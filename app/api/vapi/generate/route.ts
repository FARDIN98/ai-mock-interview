/**
 * API route for generating interview questions using Google's Gemini AI
 * This file handles the generation of interview questions based on user input
 * and stores the generated interview in Firebase
 */

import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { getRandomInterviewCover } from "@/lib/utils";
import { db } from "@/firebase/admin";

// Get the API key from environment variables with proper error handling
// This is required for the Google Generative AI API to function
const googleApiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
if (!googleApiKey) {
  console.error("Google Generative API key is not set in environment variables");
}

/**
 * Simple GET endpoint that returns a success message
 * Used for health checks and API verification
 * @returns {Response} JSON response with success status
 */
export async function GET() {
  return Response.json({ success: true, data: "THANK YOU!" }, { status: 200 });
}

/**
 * POST endpoint for generating interview questions
 * Accepts parameters for customizing the interview and generates questions using Google's Gemini AI
 * @param {Request} request - The incoming HTTP request containing interview parameters
 * @returns {Response} JSON response with success status or error
 */
export async function POST(request: Request) {
  // Extract interview parameters from the request body
  const { type, role, level, techstack, amount, userid } = await request.json();

  try {
    // Set environment variable explicitly for the Google AI SDK
    // This ensures the API key is available for the generateText function
    process.env.GOOGLE_GENERATIVE_AI_API_KEY = googleApiKey;
    
    // Generate interview questions using Google's Gemini AI model
    // The prompt is structured to create questions based on the provided parameters
    const { text: questions } = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt: `Prepare questions for a job interview.
        The job role is ${role}.
        The job experience level is ${level}.
        The tech stack used in the job is: ${techstack}.
        The focus between behavioural and technical questions should lean towards: ${type}.
        The amount of questions required is: ${amount}.
        Please return only the questions, without any additional text.
        The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
        Return the questions formatted like this:
        ["Question 1", "Question 2", "Question 3"]
        
        Thank you! <3
    `,
    });

    // Create an interview object with the generated questions and metadata
    // This will be stored in the Firebase database
    const interview = {
      role,                              // Job role (e.g., "Frontend Developer")
      type,                              // Interview type (e.g., "technical", "behavioral", "mixed")
      level,                             // Experience level (e.g., "junior", "mid", "senior")
      techstack: techstack.split(","),   // Convert comma-separated string to array of technologies
      questions: JSON.parse(questions),  // Parse the JSON string of questions into an array
      userId: userid,                    // User ID for associating the interview with a user
      finalized: true,                   // Mark the interview as ready for use
      coverImage: getRandomInterviewCover(), // Get a random cover image for the interview card
      createdAt: new Date().toISOString()    // Timestamp for when the interview was created
    };

    // Store the interview in the Firebase 'interviews' collection
    await db.collection("interviews").add(interview);

    // Return a success response
    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    // Log the error for debugging purposes
    console.error(error);

    // Return an error response with the error details
    return Response.json({ success: false, error }, { status: 500 });
  }
}
