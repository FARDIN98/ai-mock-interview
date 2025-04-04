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
import InterviewCard from "@/components/InterviewCard";
import {getCurrentUser, } from "@/lib/actions/auth.action";
import {getInterviewsByUserId, getLatestInterviews } from "@/lib/actions/general.action";

/**
 * Main page component that fetches and displays user-specific interview data
 * Shows the user's past interviews and available new interviews
 */
const Page = async () => {
    // Get the currently authenticated user
    const user = await getCurrentUser();

    // Fetch both user's past interviews and latest available interviews in parallel
    const [userInterviews, latestInterviews] = await Promise.all([
        await getInterviewsByUserId(user?.id!),
        await getLatestInterviews({ userId: user?.id! })
    ]);

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

                <Image src="/robot.png" alt="robo-dude" width={400} height={400} className="max-sm:hidden" />
            </section>

            {/* User's past interviews section */}
            <section className="flex flex-col gap-6 mt-8">
                <h2>Your Interviews</h2>

                <div className="interviews-section">
                    {hasPastInterviews ? (
                        userInterviews?.map((interview) => (
                            <InterviewCard {...interview} key={interview.id}/>
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
                            <InterviewCard {...interview} key={interview.id}/>
                        ))) : (
                        <p>There are no new interviews available</p>
                    )}
                </div>
            </section>
        </>
    )
}

export default Page