/**
 * Agent Component
 * 
 * This is a client-side component that handles the voice interaction between the user and the AI interviewer.
 * It manages the call state, processes transcripts, and handles feedback generation after interviews.
 */
/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import Image from "next/image";
import {cn} from "@/lib/utils";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import { vapi } from '@/lib/vapi.sdk';
import {interviewer} from "@/constants";
import {createFeedback} from "@/lib/actions/general.action";

/**
 * Enum representing the different states of a voice call
 */
enum CallStatus {
    INACTIVE = 'INACTIVE',   // No call is active
    CONNECTING = 'CONNECTING', // Call is being established
    ACTIVE = 'ACTIVE',      // Call is in progress
    FINISHED = 'FINISHED',  // Call has ended
}

/**
 * Interface for storing conversation messages
 */
interface SavedMessage {
    role: 'user' | 'system' | 'assistant';
    content: string;
}

/**
 * Main Agent component that handles voice interaction with the AI interviewer
 * @param userName - Name of the user taking the interview
 * @param userId - Unique identifier of the user
 * @param type - Type of interaction ('generate' for question generation, 'interview' for actual interview)
 * @param interviewId - ID of the interview being conducted
 * @param questions - Array of questions for the interview
 * @param photoURL - URL of the user's profile photo
 */
interface AgentProps {
  userName?: string;
  userId?: string;
  type: 'generate' | 'interview';
  interviewId?: string;
  questions?: string[];
  photoURL?: string;
}

const Agent = ({ userName, userId, type, interviewId, questions, photoURL }: AgentProps) => {
    const router = useRouter();
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
    const [messages, setMessages] = useState<SavedMessage[]>([]);

    // Set up event listeners for the voice API
    useEffect(() => {
        // Event handlers for call status changes
        const onCallStart = () => setCallStatus(CallStatus.ACTIVE);
        const onCallEnd = () => setCallStatus(CallStatus.FINISHED);

        // Handler for incoming messages (transcripts)
        const onMessage = (message: Message) => {
            if(message.type === 'transcript' && message.transcriptType === 'final') {
                const newMessage = { role: message.role, content: message.transcript }

                setMessages((prev) => [...prev, newMessage]);
            }
        }

        // Handlers for AI speaking status
        const onSpeechStart = () => setIsSpeaking(true);
        const onSpeechEnd = () => setIsSpeaking(false);

        const onError = (error: Error) => {
            console.log('Error', error);
            
            // Check if the error is related to meeting termination
            if (error.message && (error.message.includes('Meeting has ended') || error.message.includes('Meeting ended'))) {
                console.log('Meeting ended unexpectedly, handling gracefully');
                // Set a user-friendly error message
                setErrorMessage('The interview session ended unexpectedly. Please try again.');
                // Set call status to finished to trigger the appropriate redirect
                setCallStatus(CallStatus.FINISHED);
            } else if (error.message) {
                // Handle other types of errors
                setErrorMessage(`An error occurred: ${error.message}. Please try again.`);
                // For other errors, also end the call
                setCallStatus(CallStatus.FINISHED);
            } else {
                // Generic error handling
                setErrorMessage('An unexpected error occurred. Please try again.');
                setCallStatus(CallStatus.FINISHED);
            }
        };

        // Register event listeners
        vapi.on('call-start', onCallStart);
        vapi.on('call-end', onCallEnd);
        vapi.on('message', onMessage);
        vapi.on('speech-start', onSpeechStart);
        vapi.on('speech-end', onSpeechEnd);
        vapi.on('error', onError);

        // Clean up event listeners on component unmount
        return () => {
            vapi.off('call-start', onCallStart);
            vapi.off('call-end', onCallEnd);
            vapi.off('message', onMessage);
            vapi.off('speech-start', onSpeechStart);
            vapi.off('speech-end', onSpeechEnd);
            vapi.off('error', onError)
        }
    }, [])

    /**
     * Generates feedback after an interview is completed
     * Sends the conversation transcript to the server for analysis
     * Redirects to the feedback page on success
     */
    const handleGenerateFeedback = async (messages: SavedMessage[]) => {
        console.log('Generate feedback here.');

        const { success, feedbackId: id } = await createFeedback({
            interviewId: interviewId!,
            userId: userId!,
            transcript: messages
        })

        if(success && id) {
            router.push(`/interview/${interviewId}/feedback`);
        } else {
            console.log('Error saving feedback');
            router.push('/');
        }
    }

    // State for tracking error messages to display to the user
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Handle call completion and redirect based on interview type
    useEffect(() => {
        if(callStatus === CallStatus.FINISHED) {
            if(type === 'generate') {
                router.push('/')
            } else {
                // Only generate feedback if we have messages and no error
                if (messages.length > 0) {
                    handleGenerateFeedback(messages);
                } else if (!errorMessage) {
                    // If meeting ended with no messages, redirect to home
                    console.log('Interview ended with no messages, redirecting to home');
                    router.push('/');
                }
            }
        }
    }, [messages, callStatus, type, userId, errorMessage, router]);

    /**
     * Initiates a voice call with the AI interviewer
     * Starts the appropriate workflow based on the interaction type
     */
    const handleCall = async () => {
        setCallStatus(CallStatus.CONNECTING);
        
        try {
            if(type ==='generate') {
                await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!, {
                    variableValues: {
                        username: userName,
                        userid: userId,
                    }
                })
            } else {
                let formattedQuestions = '';

                if(questions) {
                    formattedQuestions = questions
                        .map((question) => `- ${question}`)
                        .join('\n');
                }

                // For interview mode, start the interview workflow with the questions
                await vapi.start(interviewer, {
                    variableValues: {
                        questions: formattedQuestions
                    }
                })
            }
        } catch (error) {
            console.error('Failed to start interview:', error);
            // Handle connection errors
            setErrorMessage(`Failed to start the interview. Please try again. ${error instanceof Error ? error.message : ''}`);
            setCallStatus(CallStatus.INACTIVE);
        }
    }

    const handleDisconnect = () => {
        vapi.stop();
    }

    const isCallInactiveOrFinished = callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED;
    const latestMessage = messages.length > 0 ? messages[messages.length - 1].content : '';

    return (
        <>
        {/* Main call view container */}
        <div className="call-view">
            {/* AI interviewer avatar with speaking animation */}
            <div className="card-interviewer">
                <div className="avatar">
                    <Image src="/ai-avatar.png" alt="vapi" width={65} height={54} className="object-cover" />
                    {isSpeaking && <span className="animate-speak" />}
                </div>
                <h3>AI Interviewer</h3>
            </div>

            {/* User information display */}
            <div className="card-border">
                <div className="card-content">
                    <Image 
                        src={photoURL && photoURL.length > 0 ? photoURL : "/user-avatar.png"} 
                        alt="user avatar" 
                        width={540} 
                        height={540} 
                        className="rounded-full object-cover size-[120px]" 
                    />
                    <h3>{userName}</h3>
                </div>
            </div>
        </div>
            {/* Transcript display for the latest message or error message */}
            {(messages.length > 0 || errorMessage) && (
                <div className="transcript-border">
                    <div className="transcript">
                        {errorMessage ? (
                            <p className={cn('transition-opacity duration-500 opacity-0 text-red-500', 'animate-fadeIn opacity-100')}>
                                {errorMessage}
                            </p>
                        ) : (
                            <p key={latestMessage} className={cn('transition-opacity duration-500 opacity-0', 'animate-fadeIn opacity-100')}>
                                {latestMessage}
                            </p>
                        )}
                    </div>
                </div>
            )}
            
            {/* Display a retry button if there's an error */}
            {errorMessage && callStatus === CallStatus.FINISHED && (
                <div className="w-full flex justify-center mt-4">
                    <button 
                        className="btn-primary px-6 py-2" 
                        onClick={() => {
                            setErrorMessage(null);
                            setCallStatus(CallStatus.INACTIVE);
                            setMessages([]);
                        }}
                    >
                        Try Again
                    </button>
                </div>
            )}

            {/* Call control buttons */}
            <div className="w-full flex justify-center">
                {callStatus !== 'ACTIVE' ? (
                    <button className="relative btn-call" onClick={handleCall}>
                        <span className={cn('absolute animate-ping rounded-full opacity-75', callStatus !=='CONNECTING' && 'hidden')}
                             />

                            <span>
                                {isCallInactiveOrFinished ? 'Call' : '. . .'}
                            </span>
                    </button>
                ) : (
                    <button className="btn-disconnect" onClick={handleDisconnect}>
                        End
                    </button>
                )}
            </div>
        </>
    )
}

export default Agent