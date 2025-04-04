import { isAuthenticated, signOut } from '@/lib/actions/auth.action'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ReactNode } from 'react'

const RootLayout = async ({children} : {children: ReactNode}) => {
  const isUserAuthenticated = await isAuthenticated();

  if(!isUserAuthenticated){
    redirect('/sign-in')
  }
  return (
    <div>
      <div className="root-layout">
        <nav className="flex justify-between items-center w-full">
          <Link href="/" className='flex items-center gap-2' >
            <Image src="/logo.svg" alt="logo" width={38} height={32} />
            <h2 className='text-primary-100 font-bold'>PrepWise</h2>
          </Link>
          <form action={signOut}>
            <Button type="submit" variant="outline" className="btn-secondary max-sm:px-3 max-sm:text-sm">
              Logout
            </Button>
          </form>
        </nav>

        {children}
      </div>
    </div>
  )
}

export default RootLayout