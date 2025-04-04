/**
 * Home Page Component
 * 
 * This is the main landing page of the AI Mock Interview application.
 * It displays a call-to-action section, the user's past interviews,
 * and available new interviews.
 */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import React from 'react'
import {Button} from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import {getCurrentUser, } from "@/lib/actions/auth.action";
import {getInterviewsByUserId, getLatestInterviews } from "@/lib/actions/general.action";

// Dynamically import InterviewCard component with loading fallback
const InterviewCard = dynamic(() => import("@/components/InterviewCard"), {
  loading: () => (
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
  ),
  ssr: true, // Keep server-side rendering enabled
});

/**
 * Main page component that fetches and displays user-specific interview data
 * Shows the user's past interviews and available new interviews
 */
const Page = async () => {
    // Get the currently authenticated user
    const user = await getCurrentUser();

    // Fetch both user's past interviews and latest available interviews in parallel
    // Optimized to remove redundant await inside Promise.all
    // Pass user?.id directly and let the functions handle undefined values
    const [userInterviews, latestInterviews] = await Promise.all([
        getInterviewsByUserId(user?.id),
        getLatestInterviews({ userId: user?.id })
    ]);
    
    // Add preload hints for critical resources
    // This helps the browser prioritize important resources

    // Determine if there are past or upcoming interviews to display
    const hasPastInterviews = userInterviews?.length > 0;
    const hasUpcomingInterviews = latestInterviews?.length > 0;

    return (
        <>
            {/* Hero section with call-to-action */}
            <section className="card-cta">
                <div className="flex flex-col gap-6 max-w-lg">
                    <h2>Get Interview-Ready with AI-Powered Practice & Feedback</h2>
                    <p className="text-lg">
                        Practice on real interview questions & get instant feedback
                    </p>
                    
                    <Button asChild className="btn-primary max-sm:w-full">
                <Link href="/interview">Start an Interview</Link>
                    </Button>
                </div>

                <Image 
                    src="/robot.png" 
                    alt="robo-dude" 
                    width={400} 
                    height={400} 
                    className="max-sm:hidden" 
                    priority={true}
                    loading="eager"
                />
            </section>

            {/* User's past interviews section */}
            <section className="flex flex-col gap-6 mt-8">
                <h2>Your Interviews</h2>

                <div className="interviews-section">
                    {hasPastInterviews ? (
                        userInterviews?.map((interview) => (
                            <Suspense key={interview.id} fallback={<div className="card-border w-[360px] max-sm:w-full min-h-96 animate-pulse"></div>}>
                                <InterviewCard {...interview} />
                            </Suspense>
                        ))) : (
                            <p>You haven&apos;t taken any interviews yet</p>
                    )}
                </div>
            </section>

            {/* Available new interviews section */}
            <section className="flex flex-col gap-6 mt-8">
                <h2>Take an Interview</h2>

                <div className="interviews-section">
                    {hasUpcomingInterviews ? (
                        latestInterviews?.map((interview) => (
                            <Suspense key={interview.id} fallback={<div className="card-border w-[360px] max-sm:w-full min-h-96 animate-pulse"></div>}>
                                <InterviewCard {...interview} />
                            </Suspense>
                        ))) : (
                        <p>There are no new interviews available</p>
                    )}
                </div>
            </section>
        </>
    )
}

export default Page