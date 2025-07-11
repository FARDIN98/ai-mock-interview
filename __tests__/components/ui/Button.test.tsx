/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

describe('Button Component', () => {
  it('renders button with default props', () => {
    render(<Button>Click me</Button>)
    
    const button = screen.getByRole('button', { name: /click me/i })
    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('inline-flex')
  })

  it('renders different button variants', () => {
    const { rerender } = render(<Button variant="default">Default</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-primary')
    
    rerender(<Button variant="destructive">Destructive</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-destructive')
    
    rerender(<Button variant="outline">Outline</Button>)
    expect(screen.getByRole('button')).toHaveClass('border')
    
    rerender(<Button variant="secondary">Secondary</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-secondary')
    
    rerender(<Button variant="ghost">Ghost</Button>)
    expect(screen.getByRole('button')).toHaveClass('hover:bg-accent')
    
    rerender(<Button variant="link">Link</Button>)
    expect(screen.getByRole('button')).toHaveClass('underline-offset-4')
  })

  it('renders different button sizes', () => {
    const { rerender } = render(<Button size="default">Default Size</Button>)
    expect(screen.getByRole('button')).toHaveClass('h-10')
    
    rerender(<Button size="sm">Small</Button>)
    expect(screen.getByRole('button')).toHaveClass('h-9')
    
    rerender(<Button size="lg">Large</Button>)
    expect(screen.getByRole('button')).toHaveClass('h-11')
    
    rerender(<Button size="icon">Icon</Button>)
    expect(screen.getByRole('button')).toHaveClass('h-10 w-10')
  })

  it('handles click events', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('can be disabled', () => {
    const handleClick = jest.fn()
    render(
      <Button disabled onClick={handleClick}>
        Disabled Button
      </Button>
    )
    
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(button).toHaveClass('disabled:pointer-events-none')
    
    fireEvent.click(button)
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('accepts custom className', () => {
    render(<Button className="custom-class">Custom</Button>)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('custom-class')
  })

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLButtonElement>()
    render(<Button ref={ref}>Ref Button</Button>)
    
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
    expect(ref.current?.textContent).toBe('Ref Button')
  })

  it('renders as different HTML elements when asChild is used', () => {
    // This test assumes the button uses Radix UI's Slot component
    render(
      <Button asChild>
        <a href="/test">Link Button</a>
      </Button>
    )
    
    const link = screen.getByRole('link')
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/test')
  })

  it('combines variant and size classes correctly', () => {
    render(
      <Button variant="outline" size="lg">
        Large Outline
      </Button>
    )
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('border') // outline variant
    expect(button).toHaveClass('h-11') // lg size
  })

  it('handles loading state', () => {
    render(
      <Button disabled className="opacity-50">
        <span className="animate-spin">⏳</span>
        Loading...
      </Button>
    )
    
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(button).toHaveClass('opacity-50')
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('supports keyboard navigation', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Keyboard Button</Button>)
    
    const button = screen.getByRole('button')
    button.focus()
    
    expect(button).toHaveFocus()
    
    fireEvent.keyDown(button, { key: 'Enter' })
    expect(handleClick).toHaveBeenCalledTimes(1)
    
    fireEvent.keyDown(button, { key: ' ' })
    expect(handleClick).toHaveBeenCalledTimes(2)
  })

  it('applies hover and focus styles', () => {
    render(<Button>Hover me</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('hover:bg-primary/90')
    // Check for focus-visible related classes
    expect(button.className).toContain('focus-visible')
  })

  it('handles different button types', () => {
    const { rerender } = render(<Button type="button">Button</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button')
    
    rerender(<Button type="submit">Submit</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit')
    
    rerender(<Button type="reset">Reset</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('type', 'reset')
  })

  it('renders with icons', () => {
    render(
      <Button>
        <span data-testid="icon">🚀</span>
        Button with Icon
      </Button>
    )
    
    expect(screen.getByTestId('icon')).toBeInTheDocument()
    expect(screen.getByText('Button with Icon')).toBeInTheDocument()
  })

  it('handles long text content', () => {
    const longText = 'This is a very long button text that might wrap or truncate'
    render(<Button>{longText}</Button>)
    
    expect(screen.getByText(longText)).toBeInTheDocument()
  })

  it('maintains accessibility attributes', () => {
    render(
      <Button 
        aria-label="Custom aria label"
        aria-describedby="description"
        data-testid="accessible-button"
      >
        Accessible Button
      </Button>
    )
    
    const button = screen.getByTestId('accessible-button')
    expect(button).toHaveAttribute('aria-label', 'Custom aria label')
    expect(button).toHaveAttribute('aria-describedby', 'description')
  })
})