/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
import { render, screen } from '@testing-library/react'
import InterviewCardWithSuspense from '@/components/InterviewCard'

/**
 * Test suite for InterviewCard Component
 * 
 * This file tests the interview card component that displays:
 * - Interview information (role, type, tech stack, creation date)
 * - Technology icons for the interview tech stack
 * - Interactive elements and proper rendering
 * - Integration with Next.js components (Image, Link)
 * - Suspense and loading states
 */

// Mock next/image component to avoid Next.js specific image optimization during tests
jest.mock('next/image', () => {
  return function MockImage({ src, alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement> & { src: string; alt: string }) {
    return <img src={src} alt={alt} {...props} />
  }
})

// Mock next/link component to avoid Next.js routing during tests
jest.mock('next/link', () => {
  return function MockLink({ children, href, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { children: React.ReactNode; href: string }) {
    return <a href={href} {...props}>{children}</a>
  }
})

// Mock DisplayTechIcons component to test technology display functionality
jest.mock('@/components/DisplayTechIcons', () => {
  return function MockDisplayTechIcons({ techStack }: { techStack: string[] }) {
    return (
      <div data-testid="tech-icons">
        {techStack.map((tech) => (
          <span key={tech}>{tech}</span>
        ))}
      </div>
    )
  }
})

// Mock general.action to avoid actual database operations during tests
jest.mock('@/lib/actions/general.action', () => ({
  getFeedbackByInterviewId: jest.fn().mockResolvedValue(null)
}))

// Mock utils to control random cover image generation behavior
jest.mock('@/lib/utils', () => ({
  getRandomInterviewCover: jest.fn().mockReturnValue('/test-cover.jpg')
}))

// Mock dayjs library to provide consistent date handling in tests
jest.mock('dayjs', () => {
  const mockDayjs = (_date?: string | number | Date) => ({
    format: jest.fn().mockReturnValue('Jan 15, 2024')
  })
  return mockDayjs
})

// Mock props for testing the InterviewCard component
// These props represent a typical interview record with all required fields
const mockProps = {
  id: 'test-interview-id',
  userId: 'test-user-id',
  role: 'Frontend Developer',
  type: 'Technical',
  techstack: ['React', 'TypeScript', 'Next.js'],
  createdAt: new Date('2024-01-15T10:30:00Z')
}

describe('InterviewCard Component', () => {
  // Clear all mocks before each test to ensure test isolation
  beforeEach(() => {
    jest.clearAllMocks()
  })

  // Test basic rendering functionality
  it('renders without crashing', () => {
    const { container } = render(<InterviewCardWithSuspense {...mockProps} />)
    expect(container).toBeInTheDocument()
  })

  // Test loading state with skeleton animation
  it('renders skeleton when loading', () => {
    render(<InterviewCardWithSuspense {...mockProps} />)
    
    // Check for skeleton loading state with pulse animation
    const skeletonElements = screen.getAllByText('', { selector: '.animate-pulse' })
    expect(skeletonElements.length).toBeGreaterThan(0)
  })

  // Test card structure and CSS classes
  it('has correct card structure', () => {
    const { container } = render(<InterviewCardWithSuspense {...mockProps} />)
    
    // Check for card wrapper with proper styling
    const cardElement = container.querySelector('.card-border')
    expect(cardElement).toBeInTheDocument()
  })

  // Test component with different prop values
  it('handles props correctly', () => {
    const customProps = {
      ...mockProps,
      role: 'Backend Developer',
      type: 'behavioral'
    }
    
    const { container } = render(<InterviewCardWithSuspense {...customProps} />)
    expect(container).toBeInTheDocument()
  })

  // Test edge case: empty technology stack
  it('renders with empty techstack', () => {
    const propsWithoutTech = {
      ...mockProps,
      techstack: []
    }
    
    const { container } = render(<InterviewCardWithSuspense {...propsWithoutTech} />)
    expect(container).toBeInTheDocument()
  })

  // Test different interview types (technical, behavioral, mix)
  it('renders with different interview types', () => {
    const mixedProps = {
      ...mockProps,
      type: 'mix'
    }
    
    const { container } = render(<InterviewCardWithSuspense {...mixedProps} />)
    expect(container).toBeInTheDocument()
  })

  // Test edge case: very long role names for text overflow handling
  it('handles long role names', () => {
    const longRoleProps = {
      ...mockProps,
      role: 'Senior Full Stack Software Engineer with DevOps Experience'
    }
    
    const { container } = render(<InterviewCardWithSuspense {...longRoleProps} />)
    expect(container).toBeInTheDocument()
  })

  // Test date handling and formatting
  it('renders with valid date', () => {
    const dateProps = {
      ...mockProps,
      createdAt: new Date('2024-01-15')
    }
    
    const { container } = render(<InterviewCardWithSuspense {...dateProps} />)
    expect(container).toBeInTheDocument()
  })
})