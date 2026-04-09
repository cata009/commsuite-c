import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AppIcon from '../../../shared/icons/AppIcon'
import AnnouncementListPanel from './AnnouncementListPanel'
import AnnouncementDetailPanel from './AnnouncementDetailPanel'
import { announcementsData } from '../../core/data/announcements.mock'
import type { Announcement } from '../../core/models'

export default function AnnouncementsPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id?: string }>()

  const [announcements, setAnnouncements] = useState<Announcement[]>([...announcementsData])
  const [isLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedAnnouncementId, setSelectedAnnouncementId] = useState<string | null>(null)
  const [isListCollapsed, setIsListCollapsed] = useState(false)

  useEffect(() => {
    if (id) {
      setSelectedAnnouncementId(id)
      setAnnouncements((prev) =>
        prev.map((announcement) =>
          announcement.id === id && !announcement.isRead
            ? { ...announcement, isRead: true }
            : announcement,
        ),
      )
      return
    }

    if (selectedAnnouncementId) {
      return
    }
  }, [id, selectedAnnouncementId])

  const selectedAnnouncement = useMemo(
    () => announcements.find((announcement) => announcement.id === selectedAnnouncementId) || null,
    [announcements, selectedAnnouncementId],
  )

  const onSelectAnnouncement = (announcementId: string) => {
    setSelectedAnnouncementId(announcementId)
    setAnnouncements((prev) =>
      prev.map((announcement) =>
        announcement.id === announcementId && !announcement.isRead
          ? { ...announcement, isRead: true }
          : announcement,
      ),
    )
    navigate(`/announcements/${announcementId}`)
  }

  const onToggleReadStatus = () => {
    if (!selectedAnnouncementId) return
    setAnnouncements((prev) =>
      prev.map((announcement) =>
        announcement.id === selectedAnnouncementId
          ? { ...announcement, isRead: !announcement.isRead }
          : announcement,
      ),
    )
  }

  const onToggleTodo = (announcementId: string) => {
    setAnnouncements((prev) =>
      prev.map((announcement) =>
        announcement.id === announcementId
          ? { ...announcement, hasTodo: !announcement.hasTodo }
          : announcement,
      ),
    )
  }

  const onDeleteAnnouncements = (ids: string[]) => {
    setAnnouncements((prev) =>
      prev.map((announcement) =>
        ids.includes(announcement.id) ? { ...announcement, folder: 'Deleted' } : announcement,
      ),
    )
    if (selectedAnnouncementId && ids.includes(selectedAnnouncementId)) {
      setSelectedAnnouncementId(null)
      navigate('/announcements')
    }
  }

  const onRestoreAnnouncements = (ids: string[]) => {
    setAnnouncements((prev) =>
      prev.map((announcement) =>
        ids.includes(announcement.id) ? { ...announcement, folder: 'Inbox' } : announcement,
      ),
    )
  }

  const onMarkAsRead = (ids: string[]) => {
    setAnnouncements((prev) =>
      prev.map((announcement) =>
        ids.includes(announcement.id) ? { ...announcement, isRead: true } : announcement,
      ),
    )
  }

  const onMarkAsUnread = (ids: string[]) => {
    setAnnouncements((prev) =>
      prev.map((announcement) =>
        ids.includes(announcement.id) ? { ...announcement, isRead: false } : announcement,
      ),
    )
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-white relative z-0">
      <div className="flex items-center justify-between border-b border-[#e6e6e6] bg-white min-h-[73px] px-3 py-4 shrink-0 z-20 relative">
        <h2
          className="text-[26px] font-bold text-[#262626]"
          style={{
            fontFamily: 'UniCredit',
            lineHeight: 'normal',
            fontFeatureSettings: "'liga' off, 'clig' off",
          }}
        >
          Announcements
        </h2>
      </div>

      <div className="flex-1 relative min-h-0">
        <div className="absolute inset-0 flex overflow-hidden">
          <AnnouncementListPanel
            announcements={announcements}
            isLoading={isLoading}
            selectedAnnouncementId={selectedAnnouncementId}
            searchQuery={searchQuery}
            isCollapsed={isListCollapsed}
            onSelectAnnouncement={onSelectAnnouncement}
            onToggleCollapse={() => setIsListCollapsed((prev) => !prev)}
            onSearchChange={setSearchQuery}
            onMarkAsRead={onMarkAsRead}
            onMarkAsUnread={onMarkAsUnread}
            onDeleteAnnouncements={onDeleteAnnouncements}
            onRestoreAnnouncements={onRestoreAnnouncements}
          />

          <AnnouncementDetailPanel
            announcementId={selectedAnnouncementId}
            searchQuery={searchQuery}
            announcement={selectedAnnouncement}
            onToggleReadStatus={onToggleReadStatus}
            onToggleTodo={() => {
              if (selectedAnnouncementId) {
                onToggleTodo(selectedAnnouncementId)
              }
            }}
            onDeleteAnnouncement={() => {
              if (selectedAnnouncementId) {
                onDeleteAnnouncements([selectedAnnouncementId])
              }
            }}
          />

          {isListCollapsed && (
            <div className="absolute left-0 top-0 bottom-0 w-px bg-[#e6e6e6] z-0 pointer-events-none"></div>
          )}
        </div>

        {isListCollapsed && (
          <button
            onClick={() => setIsListCollapsed(false)}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-[30px] h-[30px] bg-[#007a91] shadow-[2px_2px_7px_0_rgba(0,0,0,0.25)] hover:bg-[#006577] flex items-center justify-center transition-colors z-[100]"
            style={{ borderRadius: '8px' }}
            title="Expand announcements list"
          >
            <AppIcon name="chevron-right" size={16} className="text-white" />
          </button>
        )}
      </div>
    </div>
  )
}
