'use client'

import { useState, useRef, useEffect } from 'react'

interface StatusSelectProps {
  value: string
  onChange: (value: string) => void
  options: string[]
  getStatusColor: (status: string) => string
  className?: string
}

export default function StatusSelect({
  value,
  onChange,
  options,
  getStatusColor,
  className = '',
}: StatusSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const selectRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen])

  const handleSelect = (optionValue: string) => {
    onChange(optionValue)
    setIsOpen(false)
  }

  const getStatusIcon = (status: string) => {
    const icons: Record<string, React.ReactNode> = {
      new: (
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      contacted: (
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      booked: (
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      cancelled: (
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
      code_sent: (
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      code_used: (
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    }
    return icons[status] || null
  }

  const currentStatus = value || 'new'
  const statusColor = getStatusColor(currentStatus)

  return (
    <div className={`relative inline-block ${className}`} ref={selectRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          text-xs sm:text-sm border-0 rounded-lg px-2 sm:px-3 py-1 sm:py-1.5 font-semibold 
          focus:ring-2 focus:ring-[#19395f] transition-all
          flex items-center gap-1.5
          ${statusColor}
          hover:opacity-90
        `}
      >
        {getStatusIcon(currentStatus)}
        <span>{currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1).replace('_', ' ')}</span>
        <svg
          className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-[100]" onClick={() => setIsOpen(false)}></div>
          <div className="absolute z-[101] mt-1 left-0 bg-white border border-gray-200 rounded-lg shadow-xl min-w-[160px] overflow-hidden">
            {options.map((status) => {
              const optionColor = getStatusColor(status)
              return (
                <button
                  key={status}
                  type="button"
                  onClick={() => handleSelect(status)}
                  className={`
                    w-full px-3 py-2 text-left
                    flex items-center gap-2
                    text-xs sm:text-sm font-semibold
                    transition-colors
                    ${value === status
                      ? 'bg-[#19395f] text-white'
                      : `${optionColor} hover:opacity-80`
                    }
                  `}
                >
                  {getStatusIcon(status)}
                  <span className="flex-1">{status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}</span>
                  {value === status && (
                    <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

