"use client"

import Link from 'next/link'
import { UserButton, SignInButton, SignedIn, SignedOut } from "@clerk/nextjs"
import { Button } from './button'
import { usePathname } from 'next/navigation'

export function Navbar() {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <nav className="fixed top-0 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          <div className="flex">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">CaseOS</span>
            </Link>
          </div>

          <div className="flex items-center">
            <SignedIn>
              <div className="bg-gray-100 p-1 rounded-full flex space-x-1 mr-4">
                <Link href="/dashboard">
                  <Button 
                    variant={isActive('/dashboard') ? "default" : "ghost"}
                    className={`rounded-full ${isActive('/dashboard') ? 'bg-white shadow-sm' : ''}`}
                  >
                    Dashboard
                  </Button>
                </Link>
                <Link href="/chat">
                  <Button 
                    variant={isActive('/chat') ? "default" : "ghost"}
                    className={`rounded-full ${isActive('/chat') ? 'bg-white shadow-sm' : ''}`}
                  >
                    Chat
                  </Button>
                </Link>
                <Link href="/documents">
                  <Button 
                    variant={isActive('/documents') ? "default" : "ghost"}
                    className={`rounded-full ${isActive('/documents') ? 'bg-white shadow-sm' : ''}`}
                  >
                    Documents
                  </Button>
                </Link>
                <Link href="/timeline">
                  <Button 
                    variant={isActive('/timeline') ? "default" : "ghost"}
                    className={`rounded-full ${isActive('/timeline') ? 'bg-white shadow-sm' : ''}`}
                  >
                    Timeline
                  </Button>
                </Link>
                <Link href="/profile">
                  <Button 
                    variant={isActive('/profile') ? "default" : "ghost"}
                    className={`rounded-full ${isActive('/profile') ? 'bg-white shadow-sm' : ''}`}
                  >
                    Profile
                  </Button>
                </Link>
              </div>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            
            <SignedOut>
              <div className="flex items-center space-x-4">
                <Link href="/pricing">
                  <Button variant="ghost" className="rounded-full">Pricing</Button>
                </Link>
                <SignInButton mode="modal">
                  <Button className="rounded-full">Sign In</Button>
                </SignInButton>
              </div>
            </SignedOut>
          </div>
        </div>
      </div>
    </nav>
  )
}
