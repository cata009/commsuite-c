import { useEffect, useRef } from 'react'
import { MemoryRouter } from 'react-router-dom'
import AppIcon from '../../shared/icons/AppIcon'
import AppShell from '../layout/AppShell'

export interface CommSuiteModalProps {
  isOpen: boolean
  onClose: () => void
}

const focusableSelector =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'

export default function CommSuiteModal({ isOpen, onClose }: CommSuiteModalProps) {
  const overlayRef = useRef<HTMLDivElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const closeButtonRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    if (!isOpen) return

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const focusTimer = window.setTimeout(() => {
      closeButtonRef.current?.focus()
    }, 0)

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }

      if (event.key !== 'Tab') return

      if (!containerRef.current) return
      const focusable = Array.from(
        containerRef.current.querySelectorAll<HTMLElement>(focusableSelector),
      ).filter((el) => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden'))

      if (focusable.length === 0) {
        event.preventDefault()
        return
      }

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const active = document.activeElement as HTMLElement | null

      if (!event.shiftKey && active === last) {
        event.preventDefault()
        first.focus()
      } else if (event.shiftKey && (active === first || !containerRef.current.contains(active))) {
        event.preventDefault()
        last.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = originalOverflow
      window.clearTimeout(focusTimer)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40"
      onMouseDown={(event) => {
        if (event.target === overlayRef.current) {
          onClose()
        }
      }}
    >
      <div
        ref={containerRef}
        className="relative w-[92%] h-[90%] bg-white rounded-[16px] shadow-[0_24px_64px_rgba(0,0,0,0.35)] overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-label="Communication Suite"
      >
        <button
          ref={closeButtonRef}
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors z-50"
          aria-label="Close Communication Suite"
        >
          <AppIcon name="header-close" size={16} className="text-[#262626]" />
        </button>

        <div className="h-full w-full">
          <MemoryRouter initialEntries={['/messages']}>
            <AppShell embedded />
          </MemoryRouter>
        </div>
      </div>
    </div>
  )
}
