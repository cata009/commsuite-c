import AppIcon from '../../../shared/icons/AppIcon'
import CompanyDisplay from '../../shared/CompanyDisplay'
import type { Announcement } from '../../core/models'
import { highlightText } from '../../core/logic/search.utils'

export interface AnnouncementDetailPanelProps {
  announcementId?: string | null
  searchQuery: string
  announcement: Announcement | null
  onToggleReadStatus: () => void
  onToggleTodo?: () => void
  onDeleteAnnouncement?: () => void
}

export default function AnnouncementDetailPanel({
  announcement,
  searchQuery,
  onToggleReadStatus,
}: AnnouncementDetailPanelProps) {
  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'informative':
        return 'bg-unicredit-primary'
      case 'important':
        return 'bg-unicredit-error'
      case 'recalled':
        return 'bg-unicredit-text-secondary'
      default:
        return 'bg-unicredit-primary'
    }
  }

  if (!announcement) {
    return (
      <div className="flex-1 min-w-0 relative z-20 flex flex-col items-center justify-center bg-white gap-4 h-full">
        <AppIcon name="empty-announcement" size={109} />
        <p className="text-unicredit-text-secondary">Select an announcement to view details</p>
      </div>
    )
  }

  return (
    <div className="flex-1 min-w-0 relative z-20 flex flex-col bg-white h-full overflow-hidden">
      <div className="border-b border-unicredit-gray bg-white px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <h2 className="text-xl font-bold text-unicredit-text flex-1 truncate">
          {announcement.title}
        </h2>

        <div className="flex items-center gap-4">
          {announcement.expirationDate && (
            <div className="text-sm text-unicredit-text-secondary">
              <span className="font-semibold">Expiration:</span> {announcement.expirationDate}
            </div>
          )}
          <div className="w-px h-6 bg-unicredit-gray"></div>

          <button
            className="p-1 transition-colors hover:text-unicredit-primary text-unicredit-text-secondary"
            onClick={onToggleReadStatus}
          >
            {!announcement.isRead && <AppIcon name="mark-unread" size={20} />}
            {announcement.isRead && <AppIcon name="checkmark-outline" size={20} />}
          </button>
        </div>
      </div>

      <div className="border-b border-unicredit-gray bg-white px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CompanyDisplay companies={announcement.companies} textSize="text-sm" isBold={true} />
        </div>

        <div className="flex items-center gap-3">
          {announcement.hasTodo && (
            <div className="text-unicredit-text-secondary">
              <AppIcon name="todo" size={16} />
            </div>
          )}
          <div
            className={`px-2 py-1 text-xs font-bold text-white rounded ${getStatusBadgeClass(
              announcement.status,
            )}`}
            style={{ fontSize: '10px', lineHeight: '14px' }}
          >
            {announcement.status.toUpperCase()}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 message-list-scrollbar">
        <div className="w-full">
          <div className="mb-6 text-sm text-unicredit-text-secondary">
            <span className="font-semibold">Published:</span> {announcement.publishedDate}
          </div>

          <div className="prose prose-sm max-w-none">
            <div className="text-unicredit-text leading-relaxed whitespace-pre-line">
              <div
                dangerouslySetInnerHTML={{
                  __html: highlightText(announcement.content, searchQuery),
                }}
              ></div>
            </div>
          </div>

          {announcement.hasTodo && (
            <div className="mt-8 pt-6 border-t border-unicredit-gray">
              <button className="btn-primary">I am interested</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
