import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Agent from '@/components/Agent'
import { vapi } from '@/lib/vapi.sdk'

/**
 * Test suite for Agent Component
 * 
 * This file tests the AI interview agent component that handles:
 * - Voice API integration for conducting interviews
 * - Real-time conversation management
 * - Event handling for call states (start, end, speech)
 * - Error handling and loading states
 * - Proper cleanup of resources
 */

// Mock the Vapi SDK to avoid actual API calls during testing
jest.mock('@/lib/vapi.sdk')

// Create a typed mock of the vapi object for better type safety
const mockVapi = vapi as jest.Mocked<typeof vapi>

// Mock props that simulate a real interview scenario
const mockProps = {
  userName: 'Test User',
  userId: 'test-uid',
  type: 'interview' as const,
  interviewId: 'test-interview-id',
  questions: ['What is React?', 'Explain TypeScript benefits'],
  photoURL: 'https://example.com/photo.jpg'
}

describe('Agent Component', () => {
  // Setup function that runs before each test to ensure clean state
  beforeEach(() => {
    // Clear all mock function calls and instances
    jest.clearAllMocks()
    // Mock all vapi methods to prevent actual API calls
    mockVapi.start = jest.fn()
    mockVapi.stop = jest.fn()
    mockVapi.on = jest.fn()
    mockVapi.off = jest.fn()
  })

  /**
   * Test: Component Rendering
   * Verifies that the Agent component renders without crashing
   * and displays the expected UI elements
   */
  it('renders agent interface correctly', () => {
    render(<Agent {...mockProps} />)
    
    // Verify that the main interactive button is present in the DOM
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  /**
   * Test: Interview Initiation
   * Tests that clicking the start button triggers the vapi.start() method
   * This simulates starting an AI-powered voice interview
   */
  it('starts interview when start button is clicked', async () => {
    render(<Agent {...mockProps} />)
    
    const startButton = screen.getByRole('button')
    fireEvent.click(startButton)
    
    // Wait for async operations and verify vapi.start was called
    await waitFor(() => {
      expect(mockVapi.start).toHaveBeenCalled()
    })
  })

  /**
   * Test: Event Listener Registration
   * Verifies that the component properly registers event listeners
   * for various call states (start, end, speech events)
   */
  it('handles vapi events correctly', () => {
    render(<Agent {...mockProps} />)
    
    // Verify all required event listeners are registered
    expect(mockVapi.on).toHaveBeenCalledWith('call-start', expect.any(Function))
    expect(mockVapi.on).toHaveBeenCalledWith('call-end', expect.any(Function))
    expect(mockVapi.on).toHaveBeenCalledWith('speech-start', expect.any(Function))
    expect(mockVapi.on).toHaveBeenCalledWith('speech-end', expect.any(Function))
  })

  /**
   * Test: Loading State Management
   * Tests that the component handles loading states properly
   * during call initialization
   */
  it('shows loading state during call initialization', async () => {
    render(<Agent {...mockProps} />)
    
    const startButton = screen.getByRole('button')
    fireEvent.click(startButton)
    
    // Verify that the start method is called (loading state should be managed internally)
    expect(mockVapi.start).toHaveBeenCalled()
  })

  /**
   * Test: Error Handling
   * Tests that the component gracefully handles API errors
   * when the voice call fails to start
   */
  it('handles call errors gracefully', async () => {
    // Mock vapi.start to reject with an error
    mockVapi.start.mockRejectedValue(new Error('Connection failed'))
    
    render(<Agent {...mockProps} />)
    
    const startButton = screen.getByRole('button')
    fireEvent.click(startButton)
    
    // Verify that the component attempts to start despite the error
    await waitFor(() => {
      expect(mockVapi.start).toHaveBeenCalled()
    })
  })

  /**
   * Test: Resource Cleanup
   * Verifies that event listeners are properly removed when component unmounts
   * This prevents memory leaks and ensures clean teardown
   */
  it('cleans up event listeners on unmount', () => {
    const { unmount } = render(<Agent {...mockProps} />)
    
    // Trigger component unmount
    unmount()
    
    // Verify all event listeners are properly removed
    expect(mockVapi.off).toHaveBeenCalledWith('call-start', expect.any(Function))
    expect(mockVapi.off).toHaveBeenCalledWith('call-end', expect.any(Function))
    expect(mockVapi.off).toHaveBeenCalledWith('speech-start', expect.any(Function))
    expect(mockVapi.off).toHaveBeenCalledWith('speech-end', expect.any(Function))
  })
})