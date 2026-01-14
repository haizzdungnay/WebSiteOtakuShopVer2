'use client'

import { useThemeSafe } from '@/contexts/ThemeContext'
import { Sun, Moon, Monitor } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

interface ThemeToggleProps {
  variant?: 'icon' | 'dropdown'
  className?: string
}

export default function ThemeToggle({ variant = 'icon', className = '' }: ThemeToggleProps) {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useThemeSafe()
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showDropdown])

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setShowDropdown(false)
    }
  }

  if (variant === 'icon') {
    return (
      <button
        onClick={toggleTheme}
        className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-card transition-colors ${className}`}
        aria-label={`Chuyển sang chế độ ${resolvedTheme === 'light' ? 'tối' : 'sáng'}`}
        title={`Chế độ ${resolvedTheme === 'light' ? 'sáng' : 'tối'}`}
      >
        {resolvedTheme === 'light' ? (
          <Moon size={20} className="text-gray-700" />
        ) : (
          <Sun size={20} className="text-yellow-400" />
        )}
      </button>
    )
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef} onKeyDown={handleKeyDown}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-card transition-colors"
        aria-label="Chọn chế độ hiển thị"
        aria-expanded={showDropdown}
        aria-haspopup="listbox"
      >
        {resolvedTheme === 'light' ? (
          <Sun size={20} className="text-yellow-500" />
        ) : (
          <Moon size={20} className="text-blue-400" />
        )}
        <span className="text-sm hidden lg:inline dark:text-dark-text">
          {theme === 'system' ? 'Hệ thống' : resolvedTheme === 'light' ? 'Sáng' : 'Tối'}
        </span>
      </button>

      {showDropdown && (
        <div
          className="absolute right-0 top-full mt-2 w-40 bg-white dark:bg-dark-card rounded-lg shadow-lg border border-gray-200 dark:border-dark-border z-50"
          role="listbox"
          aria-label="Chọn chế độ hiển thị"
        >
          <ThemeOption
            icon={<Sun size={18} />}
            label="Sáng"
            isActive={theme === 'light'}
            onClick={() => {
              setTheme('light')
              setShowDropdown(false)
            }}
          />
          <ThemeOption
            icon={<Moon size={18} />}
            label="Tối"
            isActive={theme === 'dark'}
            onClick={() => {
              setTheme('dark')
              setShowDropdown(false)
            }}
          />
          <ThemeOption
            icon={<Monitor size={18} />}
            label="Hệ thống"
            isActive={theme === 'system'}
            onClick={() => {
              setTheme('system')
              setShowDropdown(false)
            }}
          />
        </div>
      )}
    </div>
  )
}

function ThemeOption({
  icon,
  label,
  isActive,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  isActive: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors first:rounded-t-lg last:rounded-b-lg
        ${isActive
          ? 'bg-primary/10 text-primary-dark dark:text-primary-light font-medium'
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-border'
        }`}
      role="option"
      aria-selected={isActive}
    >
      {icon}
      <span>{label}</span>
      {isActive && (
        <svg className="ml-auto w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      )}
    </button>
  )
}
