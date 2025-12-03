'use client'

import { useState } from 'react'
import DeleteUserModal from './DeleteUserModal'

interface UserDeleteButtonProps {
  userId: string
  userEmail: string
}

export default function UserDeleteButton({ userId, userEmail }: UserDeleteButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs sm:text-sm font-medium text-red-600 hover:text-white hover:bg-red-600 rounded-lg transition-all duration-200"
      >
        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        <span className="hidden sm:inline">Delete</span>
      </button>
      <DeleteUserModal
        userId={userId}
        userEmail={userEmail}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}


