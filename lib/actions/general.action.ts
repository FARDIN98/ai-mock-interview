'use server';

/**
 * Server Actions for Interview and Feedback Management
 * 
 * This file contains server-side functions for managing interviews and feedback
 * using Firebase Firestore and Google's Gemini AI for feedback generation
 */

import {db} from "@/firebase/admin";
import {generateObject} from "ai";
import {google} from "@ai-sdk/google";
import {feedbackSchema} from "@/constants";

/**
 * Retrieves all interviews created by a specific user
 * @param userId - The unique identifier of the user
 * @returns Promise resolving to an array of Interview objects or null
 */
export async function getInterviewsByUserId(userId?: string): Promise<Interview[] | null> {
    // If userId is undefined, return an empty array
    if (!userId) {
        return [];
    }
    
    // Query Firestore for interviews matching the user ID, sorted by creation date
    const interviews = await db
        .collection('interviews')
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .get();

    // Map the Firestore documents to Interview objects with IDs
    return interviews.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
    })) as Interview[];
}

/**
 * Retrieves the latest interviews created by other users
 * Used for displaying recent interviews on the dashboard
 * @param params - Object containing userId and optional limit
 * @returns Promise resolving to an array of Interview objects or null
 */
export async function getLatestInterviews(params: GetLatestInterviewsParams): Promise<Interview[] | null> {
    const { userId, limit = 20 } = params;

    // Base query for finalized interviews
    let query = db
        .collection('interviews')
        .orderBy('createdAt', 'desc')        // Sort by creation date (newest first)
        .where('finalized', '==', true);     // Only include finalized interviews
    
    // Only add the userId filter if userId is defined
    if (userId) {
        query = query.where('userId', '!=', userId); // Exclude current user's interviews
    }
    
    // Execute the query with limit
    const interviews = await query
        .limit(limit)                        // Limit the number of results
        .get();

    // Map the Firestore documents to Interview objects with IDs
    return interviews.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
    })) as Interview[];
}

/**
 * Retrieves a specific interview by its ID
 * Used when viewing or taking an interview
 * @param id - The unique identifier of the interview
 * @returns Promise resolving to an Interview object or null if not found
 */
export async function getInterviewById(id: string): Promise<Interview | null> {
    // Query Firestore for the specific interview document
    const interview = await db
        .collection('interviews')
        .doc(id)
        .get();

    // Return the interview data or null if not found
    if (!interview.exists) {
        return null;
    }
    
    return {
        id: interview.id,
        ...interview.data()
    } as Interview;
}

/**
 * Creates feedback for an interview using AI analysis of the transcript
 * Uses Google's Gemini AI to generate structured feedback and scores
 * @param params - Object containing interviewId, userId, and transcript
 * @returns Object with success status and feedbackId if successful
 */
export async function createFeedback(params: CreateFeedbackParams) {
    const { interviewId, userId, transcript } = params;

    try {
        // Format the transcript for the AI prompt
        const formattedTranscript = transcript
            .map((sentence: { role: string; content: string; }) => (
                `- ${sentence.role}: ${sentence.content}\n`
            )).join('');

        // Generate structured feedback using Google's Gemini AI
        const { object: { totalScore, categoryScores, strengths, areasForImprovement, finalAssessment } } = await generateObject({
            model: google('gemini-2.0-flash-001', {
                structuredOutputs: false,
            }),
            schema: feedbackSchema,  // Schema defining the expected output structure
            prompt: `You are an AI interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories. Be thorough and detailed in your analysis. Don't be lenient with the candidate. If there are mistakes or areas for improvement, point them out.
        Transcript:
        ${formattedTranscript}

        Please score the candidate from 0 to 100 in the following areas. Do not add categories other than the ones provided:
        - **Communication Skills**: Clarity, articulation, structured responses.
        - **Technical Knowledge**: Understanding of key concepts for the role.
        - **Problem-Solving**: Ability to analyze problems and propose solutions.
        - **Cultural & Role Fit**: Alignment with company values and job role.
        - **Confidence & Clarity**: Confidence in responses, engagement, and clarity.
        `,
            system:
                "You are a professional interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories",
        });

        // Store the generated feedback in Firestore
        const feedback = await db.collection('feedback').add({
            interviewId,          // Link to the specific interview
            userId,               // User who took the interview
            totalScore,           // Overall score (0-100)
            categoryScores,       // Scores for individual categories
            strengths,            // Array of candidate's strengths
            areasForImprovement,  // Array of areas needing improvement
            finalAssessment,      // Summary assessment text
            createdAt: new Date().toISOString()  // Timestamp
        })

        // Return success status and the new feedback document ID
        return {
            success: true,
            feedbackId: feedback.id
        }
    } catch (e) {
        // Log error and return failure status
        console.error('Error saving feedback', e)

        return { success: false }
    }
}

/**
 * Retrieves feedback for a specific interview and user
 * Used to display feedback results and determine if an interview has been taken
 * @param params - Object containing interviewId and userId
 * @returns Promise resolving to a Feedback object or null if not found
 */
export async function getFeedbackByInterviewId(params: GetFeedbackByInterviewIdParams): Promise<Feedback | null> {
    const { interviewId, userId } = params;

    // Query Firestore for feedback matching both interview ID and user ID
    const feedback = await db
        .collection('feedback')
        .where('interviewId', '==', interviewId)  // Match specific interview
        .where('userId', '==', userId)            // Match specific user
        .limit(1)                                 // Only need one result
        .get();

    // Return null if no feedback found
    if(feedback.empty) return null;

    // Get the first (and only) feedback document
    const feedbackDoc = feedback.docs[0];

    // Return feedback data with document ID
    return {
        id: feedbackDoc.id, ...feedbackDoc.data()
,    } as Feedback;
}