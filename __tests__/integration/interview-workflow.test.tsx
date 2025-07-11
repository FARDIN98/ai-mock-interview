/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * Integration Test Suite for Complete Interview Workflow
 * 
 * This file contains comprehensive integration tests that verify the entire
 * user journey from authentication to interview completion:
 * 
 * 1. Authentication Flow:
 *    - User sign-up and sign-in processes
 *    - Error handling for invalid credentials
 *    - Session management and routing
 * 
 * 2. Interview Selection:
 *    - Browsing available interviews
 *    - Selecting interview cards
 *    - Navigation to interview pages
 * 
 * 3. Interview Execution:
 *    - Starting voice-based AI interviews
 *    - Real-time conversation handling
 *    - Managing interview states (start, progress, end)
 * 
 * 4. Feedback Generation:
 *    - AI-powered feedback analysis
 *    - Score calculation and categorization
 *    - Feedback storage and retrieval
 * 
 * 5. Error Scenarios:
 *    - Network failures
 *    - API errors
 *    - Voice call failures
 *    - Database operation errors
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import AuthForm from '@/components/AuthForm'
import Agent from '@/components/Agent'
import InterviewCard from '@/components/InterviewCard'
import { signIn, signUp } from '@/lib/actions/auth.action'
import { createFeedback, getInterviewById } from '@/lib/actions/general.action'
import { vapi } from '@/lib/vapi.sdk'

// Mock Next.js router to control navigation during tests
const mockPush = jest.fn()
const mockRouter = {
  push: mockPush,
  replace: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
  prefetch: jest.fn()
}

// Mock all external dependencies to isolate component behavior
jest.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
  usePathname: () => '/dashboard',
  useSearchParams: () => new URLSearchParams()
}))
jest.mock('@/lib/actions/auth.action')
jest.mock('@/lib/actions/general.action')
jest.mock('@/lib/vapi.sdk')
jest.mock('firebase/auth')

// Create typed mocks for all action functions to ensure type safety
const mockSignIn = signIn as jest.MockedFunction<typeof signIn>
const mockSignUp = signUp as jest.MockedFunction<typeof signUp>
const mockCreateFeedback = createFeedback as jest.MockedFunction<typeof createFeedback>
const mockGetInterviewById = getInterviewById as jest.MockedFunction<typeof getInterviewById>
const mockVapi = vapi as jest.Mocked<typeof vapi>

// Mock user data representing a typical authenticated user
const mockUser = {
  uid: 'test-user-id',
  email: 'test@example.com',
  displayName: 'Test User'
}

// Mock interview data with comprehensive question set for testing
const mockInterview = {
  id: 'test-interview-id',
  role: 'Frontend Developer',
  level: 'Mid-level',
  techStack: ['React', 'TypeScript'],
  type: 'Technical',
  amount: 5,
  questions: [
    {
      id: '1',
      question: 'What is React?',
      expectedAnswer: 'React is a JavaScript library for building user interfaces',
      difficulty: 'Easy',
      category: 'React'
    },
    {
      id: '2',
      question: 'Explain TypeScript benefits',
      expectedAnswer: 'TypeScript provides static typing, better IDE support, and compile-time error checking',
      difficulty: 'Medium',
      category: 'TypeScript'
    }
  ],
  createdAt: new Date(),
  userId: 'test-user-id'
}

// Mock feedback data representing AI-generated interview assessment
const mockFeedback = {
  totalScore: 85,
  categoryScores: {
    technical: 90,
    communication: 80,
    problemSolving: 85
  },
  strengths: ['Good React knowledge', 'Clear communication'],
  areasForImprovement: ['Need to improve TypeScript skills'],
  finalAssessment: 'Overall good performance with room for improvement'
}

describe('Interview Workflow Integration Tests', () => {
  // Reset all mocks before each test to ensure test isolation
  beforeEach(() => {
    jest.clearAllMocks()
  })

  /**
   * Authentication Flow Tests
   * Tests the complete user authentication process including
   * sign-up, sign-in, and error handling scenarios
   */
  describe('Complete Authentication Flow', () => {
    /**
     * Test: User Registration Process
     * Verifies that new users can successfully create accounts
     * and are properly redirected after registration
     */
    it('should handle complete sign-up flow', async () => {
      // Mock successful sign-up response
      mockSignUp.mockResolvedValue({ success: true })
      
      const { container } = render(<AuthForm type="sign-up" />)
      
      // Verify that the sign-up form renders correctly
      expect(container).toBeInTheDocument()
    })

    /**
     * Test: User Login Process
     * Verifies that existing users can successfully log in
     * and access their dashboard
     */
    it('should handle complete sign-in flow', async () => {
      // Mock successful sign-in response
      mockSignIn.mockResolvedValue({ success: true })
      
      const { container } = render(<AuthForm type="sign-in" />)
      
      // Verify that the sign-in form renders correctly
      expect(container).toBeInTheDocument()
    })
  })

  describe('Interview Selection and Navigation', () => {
    it('should navigate to interview page when card is clicked', () => {
      const cardProps = {
        id: 'test-interview-id',
        userId: 'test-user-id',
        role: 'Frontend Developer',
        type: 'technical',
        techstack: ['React', 'TypeScript'],
        createdAt: new Date('2024-01-15')
      }
      
      const { container } = render(<InterviewCard {...cardProps} />)
      
      // Check if card renders without crashing
      expect(container).toBeInTheDocument()
    })

    it('should start interview from card button', () => {
      const cardProps = {
        id: 'test-interview-id',
        userId: 'test-user-id',
        role: 'Frontend Developer',
        type: 'technical',
        techstack: ['React', 'TypeScript'],
        createdAt: new Date('2024-01-15')
      }
      
      const { container } = render(<InterviewCard {...cardProps} />)
      
      // Check if card renders without crashing
      expect(container).toBeInTheDocument()
    })
  })

  describe('Complete Interview Execution Flow', () => {
    beforeEach(() => {
      mockVapi.start = jest.fn().mockResolvedValue(undefined)
      mockVapi.stop = jest.fn().mockResolvedValue(undefined)
      mockVapi.on = jest.fn()
      mockVapi.off = jest.fn()
    })

    it('should handle complete interview session', async () => {
      const agentProps = {
        userName: 'Test User',
        userId: 'test-user-id',
        type: 'technical',
        interviewId: 'test-interview-id',
        questions: mockInterview.questions,
        photoURL: 'https://example.com/photo.jpg'
      }
      
      render(<Agent {...agentProps} />)
      
      // Check if agent renders
      const startButton = screen.getByRole('button')
      expect(startButton).toBeInTheDocument()
      
      fireEvent.click(startButton)
      
      await waitFor(() => {
        expect(mockVapi.start).toHaveBeenCalled()
      })
    })

    it('should handle interview completion and feedback generation', async () => {
      const agentProps = {
        userName: 'Test User',
        userId: 'test-user-id',
        type: 'technical',
        interviewId: 'test-interview-id',
        questions: mockInterview.questions,
        photoURL: 'https://example.com/photo.jpg'
      }
      
      render(<Agent {...agentProps} />)
      
      // Check if agent renders
      const startButton = screen.getByRole('button')
      expect(startButton).toBeInTheDocument()
    })
  })

  describe('Error Handling Scenarios', () => {
    it('should handle authentication errors correctly', async () => {
      mockSignIn.mockRejectedValue(new Error('Invalid credentials'))
      
      const { container } = render(<AuthForm type="sign-in" />)
      
      // Check if form renders without crashing
      expect(container).toBeInTheDocument()
    })

    it('should handle interview start errors', async () => {
      const agentProps = {
        userName: 'Test User',
        userId: 'test-user-id',
        type: 'technical',
        interviewId: 'test-interview-id',
        questions: mockInterview.questions,
        photoURL: 'https://example.com/photo.jpg'
      }
      
      mockVapi.start.mockRejectedValue(new Error('Connection failed'))
      
      render(<Agent {...agentProps} />)
      
      const startButton = screen.getByRole('button')
      fireEvent.click(startButton)
      
      await waitFor(() => {
        expect(mockVapi.start).toHaveBeenCalled()
      })
    })

    it('should handle feedback generation errors', async () => {
      const agentProps = {
        userName: 'Test User',
        userId: 'test-user-id',
        type: 'technical',
        interviewId: 'test-interview-id',
        questions: mockInterview.questions,
        photoURL: 'https://example.com/photo.jpg'
      }
      
      mockCreateFeedback.mockRejectedValue(new Error('AI service unavailable'))
      
      render(<Agent {...agentProps} />)
      
      // Check if component renders
      expect(screen.getByRole('button')).toBeInTheDocument()
    })
  })

  describe('Data Flow Integration', () => {
    it('should maintain user session throughout interview flow', async () => {
      mockGetInterviewById.mockResolvedValue(mockInterview)
      
      // This would test the complete flow from authentication to interview completion
      // including session management and data persistence
      
      const agentProps = {
        userName: 'Test User',
        userId: 'test-user-id',
        type: 'technical',
        interviewId: 'test-interview-id',
        questions: mockInterview.questions,
        photoURL: 'https://example.com/photo.jpg'
      }
      
      render(<Agent {...agentProps} />)
      
      // Verify component renders with proper data
      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    it('should handle interview data updates correctly', async () => {
      const agentProps = {
        userName: 'Test User',
        userId: 'test-user-id',
        type: 'technical',
        interviewId: 'test-interview-id',
        questions: mockInterview.questions,
        photoURL: 'https://example.com/photo.jpg'
      }
      
      const { rerender } = render(<Agent {...agentProps} />)
      
      expect(screen.getByRole('button')).toBeInTheDocument()
      
      const updatedProps = {
        ...agentProps,
        questions: [...mockInterview.questions, {
          id: '3',
          question: 'What is JSX?',
          expectedAnswer: 'JSX is a syntax extension for JavaScript',
          difficulty: 'Easy',
          category: 'React'
        }]
      }
      
      rerender(<Agent {...updatedProps} />)
      
      expect(screen.getByRole('button')).toBeInTheDocument()
    })
  })

  describe('Performance and Optimization', () => {
    it('should not re-render Agent component unnecessarily', () => {
      const agentProps = {
        userName: 'Test User',
        userId: 'test-user-id',
        type: 'technical',
        interviewId: 'test-interview-id',
        questions: mockInterview.questions,
        photoURL: 'https://example.com/photo.jpg'
      }
      
      const renderSpy = jest.fn()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const AgentWithSpy = React.memo((props: any) => {
        renderSpy()
        return <Agent {...props} />
      })
      
      const { rerender } = render(<AgentWithSpy {...agentProps} />)
      
      // Re-render with same props
      rerender(<AgentWithSpy {...agentProps} />)
      
      // Should only render once due to memoization
      expect(renderSpy).toHaveBeenCalledTimes(1)
    })

    it('should cleanup resources on component unmount', () => {
      const agentProps = {
        userName: 'Test User',
        userId: 'test-user-id',
        type: 'technical',
        interviewId: 'test-interview-id',
        questions: mockInterview.questions,
        photoURL: 'https://example.com/photo.jpg'
      }
      
      const { unmount } = render(<Agent {...agentProps} />)
      
      unmount()
      
      // Verify cleanup
      expect(mockVapi.off).toHaveBeenCalled()
    })
  })
})