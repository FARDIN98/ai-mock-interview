import { ReactNode } from 'react'
import { isAuthenticated } from '@/lib/actions/auth.action'
import { redirect } from 'next/navigation'

// Define the AuthLayout component, which serves as a layout for authentication-related pages.
const AuthLayout = async ({ children }: { children: ReactNode }) => {
  const isUserAuthenticated = await isAuthenticated();
  
  if(isUserAuthenticated){
    redirect('/')
  }
  return (
    // Render the children components within a div.
    // This div acts as a container for the content of the authentication pages.
    <div className='auth-layout'>{children}</div>
  )
}

export default AuthLayout
