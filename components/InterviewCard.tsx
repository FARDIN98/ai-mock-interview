/**
 * InterviewCard Component
 * 
 * Displays a card for an interview with details such as role, type, date, and score
 * Shows feedback if available, otherwise prompts user to take the interview
 * Links to either the interview or feedback page based on whether feedback exists
 */
import dayjs from 'dayjs';
import Image from "next/image";
import {getRandomInterviewCover} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {Suspense, cache} from "react";
import {getFeedbackByInterviewId} from "@/lib/actions/general.action";

// Import dynamic component with loading fallback for better performance
import dynamic from 'next/dynamic';

// Dynamically import DisplayTechIcons with loading fallback
const DisplayTechIcons = dynamic(() => import("@/components/DisplayTechIcons"), {
  loading: () => <div className="flex flex-row h-[40px] w-[120px] bg-dark-300/20 animate-pulse rounded-full"></div>,
  ssr: true, // Keep server-side rendering enabled
});

// Cache the feedback fetch to prevent redundant requests
const getCachedFeedback = cache(async (interviewId: string, userId: string) => {
  if (!interviewId || !userId) return null;
  return await getFeedbackByInterviewId({ interviewId, userId });
});

// Loading fallback for the interview card
const InterviewCardSkeleton = () => (
  <div className="card-border w-[360px] max-sm:w-full min-h-96 animate-pulse">
    <div className="card-interview">
      <div className="flex flex-col items-center">
        <div className="rounded-full bg-dark-300/20 size-[90px]"></div>
        <div className="h-6 w-40 bg-dark-300/20 mt-5 rounded"></div>
        <div className="flex flex-row gap-5 mt-3 w-full justify-center">
          <div className="h-5 w-24 bg-dark-300/20 rounded"></div>
          <div className="h-5 w-16 bg-dark-300/20 rounded"></div>
        </div>
        <div className="h-12 w-full bg-dark-300/20 mt-5 rounded"></div>
      </div>
    </div>
  </div>
);

/**
 * InterviewCard component for displaying interview information and feedback status
 * @param id - Unique identifier for the interview
 * @param userId - ID of the user who created the interview
 * @param role - Job role for the interview (e.g., "Frontend Developer")
 * @param type - Type of interview (technical, behavioral, mixed)
 * @param techstack - Array of technologies relevant to the interview
 * @param createdAt - Timestamp when the interview was created
 */
const InterviewCard = async ({ id, userId, role, type, techstack, createdAt }: InterviewCardProps) => {
    // Use cached feedback fetch to improve performance
    const feedback = userId && id
      ? await getCachedFeedback(id, userId)
      : null;
    
    // Normalize the interview type for display (convert 'mix' to 'Mixed')
    const normalizedType = /mix/gi.test(type) ? 'Mixed' : type;
    
    // Format the date using either feedback creation date, interview creation date, or current date
    const formattedDate = dayjs(feedback?.createdAt || createdAt || Date.now()).format('MMM D, YYYY');

    // Precompute the cover image URL to avoid random generation on re-renders
    const coverImageUrl = getRandomInterviewCover();

    return (
        <div className="card-border w-[360px] max-sm:w-full min-h-96">
            <div className="card-interview">
              <div>
                  {/* Badge showing interview type in the top-right corner */}
                  <div className="absolute top-0 right-0 w-fit px-4 py-2 rounded-bl-lg bg-light-600">
                      <p className="badge-text">{normalizedType}</p>
                  </div>

                  {/* Interview cover image with priority loading for above-the-fold content */}
                  <Image 
                    src={coverImageUrl} 
                    alt={`${role} interview cover`} 
                    width={90} 
                    height={90} 
                    className="rounded-full object-fit size-[90px]" 
                    priority={true}
                    loading="eager"
                  />

                  {/* Interview role title */}
                  <h3 className="mt-5 capitalize">
                      {role} Interview
                  </h3>

                  {/* Date and score information */}
                  <div className="flex flex-row gap-5 mt-3">
                      {/* Date of interview or feedback */}
                      <div className="flex flex-row gap-2">
                          <Image 
                            src="/calendar.svg" 
                            alt="calendar" 
                            width={22} 
                            height={22} 
                            loading="eager"
                          />
                          <p>{formattedDate}</p>
                      </div>

                      {/* Score display - shows actual score or placeholder if not taken */}
                      <div className="flex flex-row gap-2 items-center">
                          <Image 
                            src="/star.svg" 
                            alt="star" 
                            width={22} 
                            height={22} 
                            loading="eager"
                          />
                          <p>{feedback?.totalScore || '---'}/100</p>
                      </div>
                  </div>

                  {/* Feedback summary or prompt to take interview */}
                  <p className="line-clamp-2 mt-5">
                      {feedback?.finalAssessment || "You haven't taken the interview yet. Take it now to improve your skills."}
                  </p>
              </div>

                <div className="flex flex-row justify-between">
                    {/* Display technology stack icons with Suspense boundary */}
                    <Suspense fallback={<div className="h-[40px] w-[120px] bg-dark-300/20 animate-pulse rounded-full"></div>}>
                      <DisplayTechIcons techStack={techstack} />
                    </Suspense>

                    {/* Action button - links to feedback or interview based on status */}
                    <Button asChild className="btn-primary">
                        <Link href={feedback
                            ? `/interview/${id}/feedback`  // If feedback exists, link to feedback page
                            : `/interview/${id}`           // If no feedback, link to interview page
                        }>
                            {feedback ? 'Check Feedback' : 'View Interview'} {/* Dynamic button text based on feedback status */}
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}

// Export the component wrapped in Suspense for better loading experience
export default function InterviewCardWithSuspense(props: InterviewCardProps) {
  return (
    <Suspense fallback={<InterviewCardSkeleton />}>
      <InterviewCard {...props} />
    </Suspense>
  );
}