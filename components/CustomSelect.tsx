'use client'

import { useState, useRef, useEffect } from 'react'

interface Option {
  value: string
  label: string
  icon?: React.ReactNode
}

interface CustomSelectProps {
  value: string
  onChange: (value: string) => void
  options: Option[]
  placeholder?: string
  className?: string
  disabled?: boolean
  label?: string | React.ReactNode
  required?: boolean
}

export default function CustomSelect({
  value,
  onChange,
  options,
  placeholder = 'Select an option',
  className = '',
  disabled = false,
  label,
  required = false,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const selectRef = useRef<HTMLDivElement>(null)

  const selectedOption = options.find(opt => opt.value === value)

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

  return (
    <div className={`relative ${className}`} ref={selectRef}>
      {label && (
        <div className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
          {typeof label === 'string' ? (
            <>
              {label} {required && <span className="text-red-500">*</span>}
            </>
          ) : (
            <>
              {label} {required && <span className="text-red-500">*</span>}
            </>
          )}
        </div>
      )}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full px-3 sm:px-4 py-2 sm:py-2.5 
          border border-gray-300 rounded-lg 
          bg-white text-left
          focus:ring-2 focus:ring-[#19395f] focus:border-[#19395f] 
          transition-all text-sm sm:text-base
          flex items-center justify-between gap-2
          ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'cursor-pointer hover:border-gray-400'}
          ${isOpen ? 'ring-2 ring-[#19395f] border-[#19395f]' : ''}
        `}
      >
        <span className={`flex-1 truncate ${!selectedOption ? 'text-gray-400' : 'text-gray-900'}`}>
          {selectedOption ? (
            <span className="flex items-center gap-2">
              {selectedOption.icon}
              <span>{selectedOption.label}</span>
            </span>
          ) : (
            placeholder
          )}
        </span>
        <svg
          className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-400 transition-transform duration-200 flex-shrink-0 ${
            isOpen ? 'transform rotate-180' : ''
          }`}
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
          <div className="absolute z-[101] w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-auto">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className={`
                  w-full px-3 sm:px-4 py-2 sm:py-2.5 text-left
                  flex items-center gap-2
                  text-sm sm:text-base
                  transition-colors
                  ${value === option.value
                    ? 'bg-[#19395f] text-white'
                    : 'text-gray-900 hover:bg-gray-50'
                  }
                  ${option.value === '' ? 'border-b border-gray-200' : ''}
                `}
              >
                {option.icon && (
                  <span className="flex-shrink-0">{option.icon}</span>
                )}
                <span className="flex-1">{option.label}</span>
                {value === option.value && (
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

