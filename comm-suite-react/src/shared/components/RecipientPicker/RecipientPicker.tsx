import { useEffect, useMemo, useRef, useState } from 'react'
import AppIcon from '../../icons/AppIcon'

export interface Recipient {
  id: string
  name: string
  role?: string
  avatarUrl?: string
  isOutOfOffice?: boolean
  outOfOfficeLabel?: string
  outOfOfficeReturnDate?: string
}

export interface RecipientGroup {
  id: string
  label: string
  recipientIds: string[]
}

export interface RecipientPickerProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  recipients: Recipient[]
  groups?: RecipientGroup[]
  selectedIds: string[]
  onApply: (nextSelectedIds: string[]) => void
  onCancel?: () => void
  showFooter?: boolean
  className?: string
}

export function RecipientPicker({
  isOpen,
  onOpenChange,
  recipients,
  selectedIds,
  onApply,
  onCancel,
  showFooter = true,
  className = '',
}: RecipientPickerProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [tempSelectedIds, setTempSelectedIds] = useState<Set<string>>(new Set())
  const [filteredRecipients, setFilteredRecipients] = useState<Recipient[]>([])
  const searchInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (!isOpen) return

    setTempSelectedIds(new Set(selectedIds))
    setFilteredRecipients([...recipients])
    setSearchQuery('')

    setTimeout(() => {
      if (searchInputRef.current) {
        searchInputRef.current.focus()
      }
    }, 50)
  }, [isOpen, recipients, selectedIds])

  const handleSearch = (value: string) => {
    const query = value.toLowerCase().trim()
    if (!query) {
      setFilteredRecipients([...recipients])
      return
    }

    setFilteredRecipients(
      recipients.filter(
        (recipient) =>
          recipient.name.toLowerCase().includes(query) ||
          (recipient.role && recipient.role.toLowerCase().includes(query)),
      ),
    )
  }

  const toggleSelection = (id: string) => {
    setTempSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const getIconName = (recipient: Recipient) => {
    if (recipient.role && recipient.role.toLowerCase().includes('banker')) return 'member-bank'
    return 'member-client'
  }

  const selectedCount = useMemo(() => tempSelectedIds.size, [tempSelectedIds])

  if (!isOpen) return null

  return (
    <div
      className={`relative z-50 animate-fadeIn w-[340px] bg-white shadow-2xl border border-unicredit-gray-divider rounded flex flex-col h-[320px] ${className}`}
    >
      <div className="p-3 border-b border-unicredit-gray-light">
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <AppIcon name="search" size={16} />
          </div>
          <input
            ref={searchInputRef}
            value={searchQuery}
            placeholder="Search"
            className="w-full pl-9 pr-3 py-2 border border-unicredit-gray-divider rounded text-sm outline-none focus:border-unicredit-primary text-unicredit-text"
            onChange={(event) => {
              const value = event.target.value
              setSearchQuery(value)
              handleSearch(value)
            }}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto hover-scrollbar">
        {filteredRecipients.map((item) => (
          <div
            key={item.id}
            onClick={() => toggleSelection(item.id)}
            className="flex items-center gap-3 px-4 py-3 hover:bg-unicredit-primary-light cursor-pointer border-b border-unicredit-gray-lighter transition-colors"
          >
            <div className="w-5 h-5 border border-unicredit-text bg-white rounded flex items-center justify-center transition-all shrink-0">
              {tempSelectedIds.has(item.id) && (
                <AppIcon
                  name="checkmark-stroke"
                  size={12}
                  className="text-unicredit-primary"
                />
              )}
            </div>

            <div className="shrink-0 mt-0.5">
              <AppIcon name={getIconName(item)} size={18} />
            </div>

            <div className="text-sm text-unicredit-text leading-tight flex-1">
              <span className="font-bold mr-1">{item.name}</span>
              {item.role && (
                <span className="text-unicredit-text-secondary font-normal">| {item.role}</span>
              )}

              {item.isOutOfOffice && (
                <div className="text-xs text-unicredit-error font-medium mt-0.5 flex items-center gap-1">
                  <AppIcon name="ooo" size={10} />
                  Return {item.outOfOfficeReturnDate ?? item.outOfOfficeLabel ?? ''}
                </div>
              )}
            </div>
          </div>
        ))}

        {filteredRecipients.length === 0 && (
          <div className="p-4 text-center text-gray-500 text-sm">No results found</div>
        )}
      </div>

      {showFooter && (
        <div className="p-4 border-t border-unicredit-gray-light flex items-center justify-between bg-white shrink-0">
          <button
            onClick={() => {
              if (onCancel) onCancel()
              onOpenChange(false)
            }}
            className="btn-secondary"
          >
            CANCEL
          </button>
          <div className="flex items-center gap-6">
            <span className="font-bold text-sm text-unicredit-text">{selectedCount} selected</span>
            <button
              onClick={() => {
                onApply(Array.from(tempSelectedIds))
                onOpenChange(false)
              }}
              className="btn-primary"
            >
              APPLY
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default RecipientPicker
