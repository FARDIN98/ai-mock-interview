/**
 * DisplayTechIcons Component
 * 
 * Renders icons for technologies used in an interview
 * Displays up to 3 technology icons with tooltips showing the technology name
 * Uses the getTechLogos utility to fetch appropriate icons from the devicons repository
 */
import { cn, getTechLogos } from '@/lib/utils'
import Image from 'next/image';
import React from 'react'

/**
 * Asynchronously fetches and displays technology icons
 * @param techStack - Array of technology names to display icons for
 */
const DisplayTechIcons = async({techStack}: TechIconProps) => {
    // Fetch technology icons using the utility function
    const techIcons = await getTechLogos(techStack);
  return (
    <div className='flex flex-row '>
      {/* Display up to 3 technology icons with overlapping effect */}
      {techIcons.slice(0, 3).map( ({tech, url}, index) => (
        <div 
          key={tech} 
          className={cn("relative group bg-dark-300 rounded-full p-2 flex-center", 
            // Apply negative margin for overlapping effect on all but first icon
            index >= 1 && '-ml-2'
          )}
        >
            {/* Tooltip showing technology name on hover */}
            <span className='tech-tooltip'>{tech}</span>
            {/* Technology icon image */}
            <Image src={url} alt='tech' width={100} height={100} className='size-7 ' />
        </div>
      ))}
    </div>
  )
}

export default DisplayTechIcons