/**
 * Utility functions for the AI Mock Interview application
 * This file contains helper functions used throughout the application
 */

import { interviewCovers, mappings } from "@/constants";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function for combining Tailwind CSS classes with proper precedence
 * Uses clsx for conditional classes and tailwind-merge to handle conflicting classes
 * @param inputs - Array of class values or conditional class objects
 * @returns Merged class string with proper Tailwind precedence
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Base URL for fetching technology icons from the devicons repository
const techIconBaseURL = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons";

/**
 * Normalizes technology names to match the format expected by the devicons repository
 * Removes .js extensions, whitespace, and converts to lowercase
 * @param tech - The technology name to normalize
 * @returns The normalized technology name that matches the devicons naming convention
 */
const normalizeTechName = (tech: string) => {
  const key = tech.toLowerCase().replace(/\.js$/, "").replace(/\s+/g, "");
  return mappings[key as keyof typeof mappings];
};

/**
 * Checks if a technology icon exists at the specified URL
 * Uses a HEAD request to avoid downloading the entire icon
 * @param url - The URL to check for the existence of an icon
 * @returns Promise resolving to true if the icon exists, false otherwise
 */
const checkIconExists = async (url: string) => {
  try {
    const response = await fetch(url, { method: "HEAD" });
    return response.ok; // Returns true if the icon exists
  } catch {
    return false;
  }
};

/**
 * Fetches technology logos for an array of technology names
 * Maps each technology to its corresponding icon URL and verifies existence
 * Falls back to a default icon if the specific technology icon doesn't exist
 * @param techArray - Array of technology names to fetch logos for
 * @returns Promise resolving to an array of objects with tech names and their icon URLs
 */
export const getTechLogos = async (techArray: string[]) => {
  // Map each technology to its potential icon URL
  const logoURLs = techArray.map((tech) => {
    const normalized = normalizeTechName(tech);
    return {
      tech,
      url: `${techIconBaseURL}/${normalized}/${normalized}-original.svg`,
    };
  });

  // Check if each icon exists and fall back to default if needed
  const results = await Promise.all(
    logoURLs.map(async ({ tech, url }) => ({
      tech,
      url: (await checkIconExists(url)) ? url : "/tech.svg",
    }))
  );

  return results;
};

/**
 * Selects a random interview cover image from the available options
 * Used to provide visual variety for interview cards
 * @returns Path to a randomly selected interview cover image
 */
export const getRandomInterviewCover = () => {
  const randomIndex = Math.floor(Math.random() * interviewCovers.length);
  return `/covers${interviewCovers[randomIndex]}`;
};
