import { useEffect, useMemo, useRef, useState } from 'react'
import AppIcon from '../../icons/AppIcon'

export interface ListHeaderFolder {
  id: string
  label: string
}

export interface ListHeaderProps {
  title?: string
  searchValue: string
  onSearchChange: (value: string) => void
  onSearchClear?: () => void
  placeholder?: string
  showFilterButton?: boolean
  isFilterOpen?: boolean
  filterCount?: number
  onFilterClick?: () => void
  onClearFilters?: () => void
  folders?: ListHeaderFolder[]
  selectedFolderId?: string
  onFolderChange?: (id: string) => void
  folderUnreadCount?: number
  folderTotalCount?: number
}

export function ListHeader({
  searchValue,
  onSearchChange,
  onSearchClear,
  placeholder = 'Search',
  showFilterButton = true,
  isFilterOpen = false,
  filterCount = 0,
  onFilterClick,
  onClearFilters,
  folders = [],
  selectedFolderId,
  onFolderChange,
  folderUnreadCount,
  folderTotalCount,
}: ListHeaderProps) {
  const [isFolderDropdownOpen, setIsFolderDropdownOpen] = useState(false)
  const [tempSelectedFolderId, setTempSelectedFolderId] = useState<string | undefined>(
    selectedFolderId,
  )
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!isFolderDropdownOpen) {
      setTempSelectedFolderId(selectedFolderId)
    }
  }, [isFolderDropdownOpen, selectedFolderId])

  useEffect(() => {
    if (!isFolderDropdownOpen) return

    const handleMouseDown = (event: MouseEvent) => {
      if (!containerRef.current) return
      if (!containerRef.current.contains(event.target as Node)) {
        setIsFolderDropdownOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsFolderDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isFolderDropdownOpen])

  const selectedFolderLabel = useMemo(() => {
    const match = folders.find((folder) => folder.id === selectedFolderId)
    return match ? match.label : ''
  }, [folders, selectedFolderId])

  const hasCounts =
    folderUnreadCount !== undefined && folderTotalCount !== undefined

  return (
    <div className="p-3 border-b border-unicredit-gray">
      <div className="flex gap-3 items-center mb-3">
        <div className="flex-1 relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-unicredit-text">
            <AppIcon name="search" size={18} />
          </div>
          <input
            type="text"
            placeholder={placeholder}
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            className="w-full pl-10 pr-9 py-1.5 text-sm border border-unicredit-gray-divider rounded bg-white focus:outline-none focus:border-unicredit-primary"
          />
          {searchValue && (
            <button
              onClick={() => {
                onSearchChange('')
                if (onSearchClear) onSearchClear()
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-80 transition-opacity text-unicredit-text"
            >
              <AppIcon name="search-close" size={14} />
            </button>
          )}
        </div>

        {showFilterButton && (
          <div className="flex items-center gap-2">
            <button
              onClick={onFilterClick}
              className="flex items-center justify-center p-2 rounded transition-colors outline-none border-0 bg-transparent hover:bg-transparent shadow-none focus:ring-0"
            >
              <AppIcon
                name="filter"
                size={18}
                className={
                  isFilterOpen || filterCount > 0
                    ? 'text-unicredit-primary'
                    : 'text-unicredit-text'
                }
              />
            </button>

            {filterCount > 0 && (
              <div
                className="flex h-[24px] px-[8px] justify-center items-center gap-[4px] rounded-[42px] bg-unicredit-primary cursor-pointer hover:bg-unicredit-primary-hover transition-colors"
                onClick={(event) => {
                  event.stopPropagation()
                  if (onClearFilters) onClearFilters()
                }}
                title="Clear filters"
              >
                <span
                  className="text-white text-center text-[16px] font-[700] uppercase"
                  style={{ fontFamily: 'UniCredit', lineHeight: 'normal' }}
                >
                  {filterCount}
                </span>
                <AppIcon name="search-close" size={14} className="text-white" />
              </div>
            )}
          </div>
        )}
      </div>

      <div
        ref={containerRef}
        className={`relative flex items-center justify-between pb-1 ${
          isFolderDropdownOpen ? '' : 'border-b border-unicredit-gray-divider'
        }`}
      >
        <div
          className="flex items-center gap-2 cursor-pointer group outline-none"
          onClick={() => setIsFolderDropdownOpen(!isFolderDropdownOpen)}
        >
          <span
            className={`text-xl font-bold text-unicredit-text group-hover:text-unicredit-primary transition-colors ${
              isFolderDropdownOpen ? 'text-unicredit-primary' : ''
            }`}
          >
            {selectedFolderLabel}
          </span>
          <AppIcon
            name="chevron-down"
            size={16}
            className={`transition-transform duration-200 ${
              isFolderDropdownOpen ? 'rotate-180 text-unicredit-primary' : 'text-unicredit-text'
            }`}
          />
        </div>

        {hasCounts && (
          <div className="text-sm">
            <span className="font-bold text-unicredit-text">{folderUnreadCount}</span>
            <span className="text-unicredit-text-secondary">
              /{folderTotalCount} unread
            </span>
          </div>
        )}

        {isFolderDropdownOpen && (
          <div
            className="absolute top-full left-0 right-0 mt-1 bg-white rounded-[4px] shadow-lg border border-unicredit-text z-50 flex flex-col animate-fadeIn"
            style={{ animation: 'fadeIn 0.15s ease-out' }}
          >
            <div className="flex flex-col py-2">
              {folders.map((folder) => (
                <div
                  key={folder.id}
                  onClick={() => setTempSelectedFolderId(folder.id)}
                  className="flex items-center px-4 py-3 cursor-pointer hover:bg-gray-50 self-stretch gap-2 transition-colors"
                >
                  <div className="flex items-start justify-center w-6 h-6 shrink-0">
                    {tempSelectedFolderId !== folder.id && (
                      <AppIcon name="radio-unchecked" size={24} />
                    )}
                    {tempSelectedFolderId === folder.id && (
                      <AppIcon name="radio-checked" size={24} />
                    )}
                  </div>
                  <span className="text-unicredit-text font-bold text-base capitalize">
                    {folder.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between w-full px-4 pb-4 pt-2">
              <button
                onClick={() => setIsFolderDropdownOpen(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (tempSelectedFolderId && onFolderChange) {
                    onFolderChange(tempSelectedFolderId)
                  }
                  setIsFolderDropdownOpen(false)
                }}
                className="btn-primary"
              >
                Apply
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ListHeader
