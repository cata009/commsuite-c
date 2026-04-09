import { useEffect, useRef, useState } from 'react'

export interface DropdownMenuProps {
  className?: string
  minWidth?: number
  position?: 'top' | 'bottom' | 'auto'
  align?: 'left' | 'right'
  trigger: React.ReactNode
  children: React.ReactNode
}

export default function DropdownMenu({
  className = '',
  minWidth = 150,
  position = 'bottom',
  align = 'right',
  trigger,
  children,
}: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [computedPosition, setComputedPosition] = useState<'top' | 'bottom'>('bottom')
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!isOpen) return

    const handleMouseDown = (event: MouseEvent) => {
      if (!containerRef.current) return
      if (!containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  const toggle = (event: React.MouseEvent) => {
    event.stopPropagation()
    if (!isOpen) {
      if (position === 'auto' && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        const spaceBelow = window.innerHeight - rect.bottom
        const spaceAbove = rect.top
        setComputedPosition(spaceBelow < 250 && spaceAbove > spaceBelow ? 'top' : 'bottom')
      } else if (position !== 'auto') {
        setComputedPosition(position)
      }
      setIsOpen(true)
    } else {
      setIsOpen(false)
    }
  }

  const sideClass = align === 'left' ? 'left-0' : 'right-0'

  return (
    <div ref={containerRef} className={`relative inline-flex h-full text-left ${className}`}>
      <div onClick={toggle} className="group" data-state={isOpen ? 'open' : 'closed'}>
        {trigger}
      </div>
      {isOpen && (
        <div
          className={`absolute ${sideClass} origin-top-right bg-white border border-[#262626] rounded-[4px] shadow-2xl z-50 ring-1 ring-black ring-opacity-5 focus:outline-none backdrop-blur-sm ${
            computedPosition === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'
          }`}
          style={{ minWidth }}
        >
          <div role="menu" aria-orientation="vertical">
            {children}
          </div>
        </div>
      )}
    </div>
  )
}
