import { useEffect, useMemo, useRef, useState } from 'react'
import AppIcon from '../../icons/AppIcon'

export interface Attachment {
  id: string
  name: string
  sizeLabel?: string
  mimeType?: string
  extension?: string
  url?: string
}

export interface AttachmentStripProps {
  attachments: Attachment[]
  maxVisible?: number
  showActions?: boolean
  onPreview?: (id: string) => void
  onDownload?: (id: string) => void
  showRemove?: boolean
  onRemove?: (id: string) => void
  uploadingIds?: string[]
  className?: string
}

interface DropdownMenuProps {
  className?: string
  minWidth?: number
  position?: 'top' | 'bottom' | 'auto'
  trigger: React.ReactNode
  children: React.ReactNode
}

function DropdownMenu({
  className = '',
  minWidth = 150,
  position = 'bottom',
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

  return (
    <div ref={containerRef} className={`relative inline-flex h-full text-left ${className}`}>
      <div onClick={toggle}>{trigger}</div>
      {isOpen && (
        <div
          className={`absolute right-0 origin-top-right bg-white border border-[#262626] rounded-[4px] shadow-2xl z-50 ring-1 ring-black ring-opacity-5 focus:outline-none backdrop-blur-sm ${
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

function getTypeLabel(attachment: Attachment) {
  if (attachment.extension) return attachment.extension.toUpperCase()
  if (attachment.mimeType && attachment.mimeType.includes('/')) {
    const ext = attachment.mimeType.split('/')[1]
    return ext ? ext.toUpperCase() : ''
  }
  return ''
}

function getIconName(attachment: Attachment) {
  const ext = attachment.extension?.toLowerCase()
  const isImage =
    (attachment.mimeType && attachment.mimeType.startsWith('image/')) ||
    ext === 'jpg' ||
    ext === 'jpeg' ||
    ext === 'png'
  return isImage ? 'file-image' : 'file-document'
}

export function AttachmentStrip({
  attachments,
  maxVisible = 2,
  showActions = true,
  onPreview,
  onDownload,
  showRemove = false,
  onRemove,
  uploadingIds = [],
  className = '',
}: AttachmentStripProps) {
  const visibleAttachments = useMemo(
    () => attachments.slice(0, maxVisible),
    [attachments, maxVisible],
  )
  const overflowAttachments = useMemo(
    () => attachments.slice(maxVisible),
    [attachments, maxVisible],
  )

  if (!attachments.length) return null

  return (
    <div className={`flex flex-wrap gap-3 items-stretch ${className}`}>
      {visibleAttachments.map((att) => (
        <div
          key={att.id}
          className="flex items-center gap-3 p-2 rounded border border-unicredit-gray-divider bg-white min-w-[200px] max-w-[300px] relative"
        >
          {uploadingIds.includes(att.id) && (
            <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10">
              <div className="w-5 h-5 border-2 border-[#007a91] border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          <div className="shrink-0">
            <AppIcon name={getIconName(att)} size={16} />
          </div>

          <div className="flex flex-col min-w-0 flex-1">
            <span
              className="text-unicredit-text font-bold text-sm uppercase truncate"
              title={att.name}
              style={{ fontFamily: 'UniCredit', lineHeight: 'normal' }}
            >
              {att.name}
            </span>
            <div
              className="flex items-center gap-2 text-unicredit-text text-sm"
              style={{ fontFamily: 'UniCredit', lineHeight: '24px' }}
            >
              <span>{getTypeLabel(att)}</span>
              <div className="w-px h-3 bg-unicredit-gray-divider"></div>
              <span>{att.sizeLabel ?? ''}</span>
            </div>
          </div>

          {!showRemove && showActions && (
            <DropdownMenu
              className="ml-auto"
              trigger={
                <button className="p-1 hover:text-unicredit-primary text-unicredit-text outline-none transition-colors flex items-center justify-center h-8 w-8">
                  <AppIcon name="more-vertical" size={20} />
                </button>
              }
            >
              <div className="flex flex-col min-w-[130px] py-1">
                <button
                  onClick={() => onPreview && onPreview(att.id)}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 hover:text-unicredit-primary text-left text-unicredit-text w-full transition-colors outline-none cursor-pointer"
                >
                  <AppIcon name="preview" size={16} />
                  <span className="text-xs font-bold uppercase">Preview</span>
                </button>
                <button
                  onClick={() => onDownload && onDownload(att.id)}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 hover:text-unicredit-primary text-left text-unicredit-text w-full transition-colors outline-none cursor-pointer"
                >
                  <AppIcon name="download" size={16} />
                  <span className="text-xs font-bold uppercase">Download</span>
                </button>
              </div>
            </DropdownMenu>
          )}

          {showRemove && (
            <button
              onClick={() => onRemove && onRemove(att.id)}
              className="ml-auto text-gray-400 hover:text-unicredit-error transition-colors p-1"
            >
              <AppIcon name="close" size={16} />
            </button>
          )}
        </div>
      ))}

      {overflowAttachments.length > 0 && (
        <div className="relative flex">
          <DropdownMenu
            className="flex"
            position="auto"
            minWidth={320}
            trigger={
              <button className="flex items-center gap-2 p-2 rounded border border-unicredit-gray-divider bg-white group hover:border-unicredit-primary transition-all h-full outline-none cursor-pointer">
                <AppIcon name="file-document" size={16} />
                <span className="font-bold text-unicredit-text text-sm" style={{ fontFamily: 'UniCredit' }}>
                  +{overflowAttachments.length}
                </span>
                <AppIcon name="chevron-down" size={20} className="transition-transform duration-300 text-unicredit-text" />
              </button>
            }
          >
            <div className="flex flex-col gap-2 p-2 w-[320px] max-h-[220px] overflow-y-auto hover-scrollbar">
              {overflowAttachments.map((att) => (
                <div
                  key={att.id}
                  className="flex items-center gap-3 p-2 rounded border border-unicredit-gray-divider bg-white w-full relative"
                >
                  {uploadingIds.includes(att.id) && (
                    <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10">
                      <div className="w-4 h-4 border-2 border-[#007a91] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                  <div className="shrink-0">
                    <AppIcon name={getIconName(att)} size={16} />
                  </div>

                  <div className="flex flex-col min-w-0 flex-1">
                    <span
                      className="text-unicredit-text font-bold text-sm uppercase truncate"
                      title={att.name}
                      style={{ fontFamily: 'UniCredit', lineHeight: 'normal' }}
                    >
                      {att.name}
                    </span>
                    <div
                      className="flex items-center gap-2 text-unicredit-text text-sm"
                      style={{ fontFamily: 'UniCredit', lineHeight: '24px' }}
                    >
                      <span>{getTypeLabel(att)}</span>
                      <div className="w-px h-3 bg-unicredit-gray-divider"></div>
                      <span>{att.sizeLabel ?? ''}</span>
                    </div>
                  </div>

                  {!showRemove && showActions && (
                    <DropdownMenu
                      trigger={
                        <button className="p-1 hover:text-unicredit-primary text-unicredit-text outline-none transition-colors flex items-center justify-center h-8 w-8">
                          <AppIcon name="more-vertical" size={20} />
                        </button>
                      }
                    >
                      <div className="flex flex-col min-w-[130px] py-1">
                        <button
                          onClick={() => onPreview && onPreview(att.id)}
                          className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 hover:text-unicredit-primary text-left text-unicredit-text w-full transition-colors outline-none cursor-pointer"
                        >
                          <AppIcon name="preview" size={16} />
                          <span className="text-xs font-bold uppercase">Preview</span>
                        </button>
                        <button
                          onClick={() => onDownload && onDownload(att.id)}
                          className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 hover:text-unicredit-primary text-left text-unicredit-text w-full transition-colors outline-none cursor-pointer"
                        >
                          <AppIcon name="download" size={16} />
                          <span className="text-xs font-bold uppercase">Download</span>
                        </button>
                      </div>
                    </DropdownMenu>
                  )}

                  {showRemove && (
                    <button
                      onClick={() => onRemove && onRemove(att.id)}
                      className="ml-auto text-gray-400 hover:text-red-500 p-1"
                    >
                      <AppIcon name="close" size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </DropdownMenu>
        </div>
      )}
    </div>
  )
}

export default AttachmentStrip
