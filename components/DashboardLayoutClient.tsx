'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import DashboardNav from './DashboardNav'

interface DashboardLayoutClientProps {
  user: any
  userRole: 'admin' | 'staff'
  children: React.ReactNode
}

export default function DashboardLayoutClient({ user, userRole, children }: DashboardLayoutClientProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 lg:w-72 bg-[#19395f] text-white flex-col flex-shrink-0">
        <DashboardNav user={user} userRole={userRole} />
      </aside>

      {/* Mobile Header with Hamburger */}
      <div className="md:hidden w-full bg-[#19395f] text-white flex-shrink-0 sticky top-0 z-40">
        <div className="h-16 flex items-center justify-between px-4">
          {/* Hamburger Menu - Left */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>

          {/* Logo - Center */}
          <div className="flex-1 flex justify-center">
            <Link href="/dashboard" className="flex flex-col items-center gap-1">
              {/* Both Logos Side by Side */}
              <div className="flex items-center gap-1.5">
                <Image
                  src="/logo-icon.png"
                  alt="Eyesite Icon"
                  width={24}
                  height={24}
                  quality={100}
                  className="h-6 w-6 object-contain shrink-0"
                  priority
                />
                <Image
                  src="/eyesite-logo.png"
                  alt="Eyesite Opticians Logo"
                  width={80}
                  height={24}
                  quality={100}
                  className="h-4 w-auto object-contain brightness-0 invert"
                  priority
                />
              </div>
              {/* Admin Panel Text Below Both Logos */}
              <p className="text-[10px] text-white/70 leading-tight">Admin Panel</p>
            </Link>
          </div>

          {/* Spacer for balance */}
          <div className="w-10"></div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-[#19395f] text-white flex-col flex-shrink-0 z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <DashboardNav user={user} userRole={userRole} onNavigate={() => setIsMobileMenuOpen(false)} />
      </aside>

      {/* Main content */}
      <main className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8 overflow-x-auto min-w-0">{children}</main>
    </div>
  )
}

