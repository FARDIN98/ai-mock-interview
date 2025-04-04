/**
 * InterviewCard Component
 * 
 * Displays a card for an interview with details such as role, type, date, and score
 * Shows feedback if available, otherwise prompts user to take the interview
 * Links to either the interview or feedback page based on whether feedback exists
 */
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
import DisplayTechIcons from "@/components/DisplayTechIcons";
import {getFeedbackByInterviewId} from "@/lib/actions/general.action";

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
    // Fetch feedback for this interview if user ID and interview ID are provided
    const feedback = userId && id
    ? await getFeedbackByInterviewId({ interviewId: id, userId})
        : null;
    
    // Normalize the interview type for display (convert 'mix' to 'Mixed')
    const normalizedType = /mix/gi.test(type) ? 'Mixed' : type;
    
    // Format the date using either feedback creation date, interview creation date, or current date
    const formattedDate = dayjs(feedback?.createdAt || createdAt || Date.now()).format('MMM D, YYYY');

    return (
        <div className="card-border w-[360px] max-sm:w-full min-h-96">
            <div className="card-interview">
              <div>
                  {/* Badge showing interview type in the top-right corner */}
                  <div className="absolute top-0 right-0 w-fit px-4 py-2 rounded-bl-lg bg-light-600">
                      <p className="badge-text">{normalizedType}</p>
                  </div>

                  {/* Interview cover image */}
                  <Image src={getRandomInterviewCover()} alt="cover image" width={90} height={90} className="rounded-full object-fit size-[90px]" />

                  {/* Interview role title */}
                  <h3 className="mt-5 capitalize">
                      {role} Interview
                  </h3>

                  {/* Date and score information */}
                  <div className="flex flex-row gap-5 mt-3">
                      {/* Date of interview or feedback */}
                      <div className="flex flex-row gap-2">
                          <Image src="/calendar.svg" alt="calendar" width={22} height={22} />
                          <p>{formattedDate}</p>
                      </div>

                      {/* Score display - shows actual score or placeholder if not taken */}
                      <div className="flex flex-row gap-2 items-center">
               <Image src="/star.svg" alt="star" width={22} height={22} />
                          <p>{feedback?.totalScore || '---'}/100</p>
                      </div>
                  </div>

                  {/* Feedback summary or prompt to take interview */}
                  <p className="line-clamp-2 mt-5">
                      {feedback?.finalAssessment || "You haven't taken the interview yet. Take it now to improve your skills."}
                  </p>
              </div>

                <div className="flex flex-row justify-between">
                    {/* Display technology stack icons */}
                    <DisplayTechIcons techStack={techstack} />

                    {/* Action button - links to feedback or interview based on status */}
                    <Button className="btn-primary">
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
export default InterviewCard