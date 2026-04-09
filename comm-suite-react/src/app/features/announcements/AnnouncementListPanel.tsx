import { useEffect, useMemo, useState } from 'react'
import ListHeader from '../../../shared/components/ListHeader/ListHeader'
import AppIcon from '../../../shared/icons/AppIcon'
import DropdownMenu from '../../shared/DropdownMenu'
import Checkbox from '../../shared/Checkbox'
import CompanyDisplay from '../../shared/CompanyDisplay'
import FilterPanel from '../messages/FilterPanel'
import type { Announcement, FilterOptions } from '../../core/models'
import { highlightText } from '../../core/logic/search.utils'
import { useSelectionSet } from '../../core/logic/selection.utils'

export interface AnnouncementListPanelProps {
  announcements: Announcement[]
  isLoading?: boolean
  selectedAnnouncementId?: string | null
  searchQuery: string
  isCollapsed: boolean
  onSelectAnnouncement: (id: string) => void
  onToggleCollapse: () => void
  onSearchChange: (value: string) => void
  onMarkAsRead: (ids: string[]) => void
  onMarkAsUnread: (ids: string[]) => void
  onDeleteAnnouncements: (ids: string[]) => void
  onRestoreAnnouncements: (ids: string[]) => void
}

const folders = ['Inbox', 'Deleted']

const createEmptyFilters = (): FilterOptions => ({
  companies: [],
  members: [],
  dateRange: { from: undefined, to: undefined },
  unread: false,
  todo: false,
  attachments: false,
})

export default function AnnouncementListPanel({
  announcements,
  isLoading = false,
  selectedAnnouncementId,
  searchQuery,
  isCollapsed,
  onSelectAnnouncement,
  onToggleCollapse,
  onSearchChange,
  onMarkAsRead,
  onMarkAsUnread,
  onDeleteAnnouncements,
  onRestoreAnnouncements,
}: AnnouncementListPanelProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [selectedFolder, setSelectedFolder] = useState('Inbox')
  const [activeFilters, setActiveFilters] = useState<FilterOptions>(createEmptyFilters())
  const { selectedItems, selectAll, clearSelection, toggleSelectAll, toggleItem } = useSelectionSet()

  const activeFilterCount = useMemo(() => {
    let count = 0
    count += activeFilters.companies.length
    count += activeFilters.members.length
    if (activeFilters.unread) count += 1
    if (activeFilters.todo) count += 1
    if (activeFilters.attachments) count += 1
    if (activeFilters.dateRange.from && activeFilters.dateRange.to) count += 1
    return count
  }, [activeFilters])

  const filteredAnnouncements = useMemo(() => {
    let result = announcements

    result = result.filter((announcement) => announcement.folder === selectedFolder)

    if (searchQuery && searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter((announcement) => {
        if (announcement.title.toLowerCase().includes(query)) return true
        if (announcement.preview.toLowerCase().includes(query)) return true
        return false
      })
    }

    if (activeFilters.companies.length > 0) {
      result = result.filter((announcement) =>
        announcement.companies.some((company) => activeFilters.companies.includes(company)),
      )
    }

    if (activeFilters.unread) {
      result = result.filter((announcement) => !announcement.isRead)
    }

    if (activeFilters.todo) {
      result = result.filter((announcement) => announcement.hasTodo)
    }

    if (activeFilters.attachments) {
      result = result.filter((announcement) => announcement.hasAttachment)
    }

    if (activeFilters.dateRange.from && activeFilters.dateRange.to) {
      const start = new Date(activeFilters.dateRange.from)
      const end = new Date(activeFilters.dateRange.to)
      start.setHours(0, 0, 0, 0)
      end.setHours(23, 59, 59, 999)

      result = result.filter((announcement) => {
        const date = new Date(announcement.publishedDate)
        if (Number.isNaN(date.getTime())) return true
        return date >= start && date <= end
      })
    }

    return result
  }, [announcements, searchQuery, activeFilters, selectedFolder])

  useEffect(() => {
    clearSelection()
  }, [selectedFolder, searchQuery, clearSelection])

  const folderUnreadCount = filteredAnnouncements.filter((announcement) => !announcement.isRead).length
  const folderTotalCount = filteredAnnouncements.length

  const handleSelectAll = () => {
    toggleSelectAll(filteredAnnouncements.map((announcement) => announcement.id))
  }

  const handleSelectItem = (id: string) => {
    toggleItem(id, filteredAnnouncements.map((announcement) => announcement.id))
  }

  const handleBulkAction = (action: 'markRead' | 'markUnread' | 'delete' | 'restore') => {
    const ids = Array.from(selectedItems)
    if (ids.length === 0) return

    if (action === 'markRead') onMarkAsRead(ids)
    if (action === 'markUnread') onMarkAsUnread(ids)
    if (action === 'delete') onDeleteAnnouncements(ids)
    if (action === 'restore') onRestoreAnnouncements(ids)

    clearSelection()
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'informative':
        return 'bg-[#007a91]'
      case 'important':
        return 'bg-[#e2001a]'
      case 'recalled':
        return 'bg-[#666666]'
      default:
        return 'bg-[#007a91]'
    }
  }

  return (
    <div
      className={`shrink-0 relative h-full flex flex-col transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)] overflow-visible ${
        isCollapsed ? 'w-0' : 'w-[390px]'
      }`}
    >
      <div className="w-[390px] h-full flex flex-col bg-white border-r border-unicredit-gray">
        <ListHeader
          searchValue={searchQuery}
          onSearchChange={onSearchChange}
          placeholder="Search"
          showFilterButton
          isFilterOpen={isFilterOpen}
          filterCount={activeFilterCount}
          onFilterClick={() => setIsFilterOpen((prev) => !prev)}
          onClearFilters={() => setActiveFilters(createEmptyFilters())}
          folders={folders.map((folder) => ({ id: folder, label: folder }))}
          selectedFolderId={selectedFolder}
          onFolderChange={(folder) => {
            setSelectedFolder(folder)
          }}
          folderUnreadCount={folderUnreadCount}
          folderTotalCount={folderTotalCount}
        />

        {isFilterOpen && (
          <div className="flex-1 h-full overflow-hidden bg-white">
            <FilterPanel
              initialFilters={activeFilters}
              onApply={(filters) => {
                setActiveFilters(filters)
                setIsFilterOpen(false)
              }}
              onCancel={() => setIsFilterOpen(false)}
            />
          </div>
        )}

        {!isFilterOpen && isLoading && <div className="flex-1 overflow-hidden"></div>}

        {!isFilterOpen && !isLoading && (
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            {selectedFolder !== 'All Folders' && (
              <div className="px-3 h-[46px] bg-white border-b border-unicredit-gray-divider flex items-center shrink-0">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <Checkbox checked={selectAll} onCheckedChange={handleSelectAll} />
                    <span className="text-unicredit-text font-bold text-sm uppercase">
                      {selectedItems.size > 0 ? `${selectedItems.size} SELECTED` : 'ALL'}
                    </span>
                  </div>

                  {selectedItems.size > 0 && (
                    <DropdownMenu
                      trigger={
                        <button className="flex items-center gap-1 outline-none group uppercase text-[#007a91] font-bold text-sm">
                          ACTIONS
                          <AppIcon
                            name="caret-down-filled"
                            size={12}
                            className="transition-transform group-data-[state=open]:-rotate-180"
                          />
                        </button>
                      }
                    >
                      <div className="flex flex-col min-w-[200px] py-1">
                        {selectedFolder === 'Deleted' && (
                          <button
                            onClick={() => handleBulkAction('restore')}
                            className="text-left px-4 py-2 hover:bg-[#e7f8fb] text-sm text-[#262626] font-bold uppercase transition-colors outline-none h-11 flex items-center"
                          >
                            Restore Announcement
                          </button>
                        )}

                        {selectedFolder !== 'Deleted' && (
                          <>
                            <button
                              onClick={() => handleBulkAction('markRead')}
                              className="text-left px-4 py-3 hover:text-[#007a91] text-sm text-[#262626] font-bold uppercase transition-colors outline-none flex items-center gap-2"
                            >
                              <AppIcon name="mark-read" size={16} />
                              Mark as read
                            </button>
                            <button
                              onClick={() => handleBulkAction('markUnread')}
                              className="text-left px-4 py-3 hover:text-[#007a91] text-sm text-[#262626] font-bold uppercase transition-colors outline-none flex items-center gap-2"
                            >
                              <AppIcon name="mark-unread" size={16} />
                              Mark as unread
                            </button>
                            <div className="h-px bg-[#e6e6e6] my-1"></div>
                            <button
                              onClick={() => handleBulkAction('delete')}
                              className="text-left px-4 py-3 hover:text-[#e2001a] text-sm text-[#262626] font-bold uppercase transition-colors outline-none flex items-center gap-2"
                            >
                              <AppIcon name="trash" size={16} />
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </DropdownMenu>
                  )}
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto message-list-scrollbar">
              {filteredAnnouncements.map((announcement) => (
                <div
                  key={announcement.id}
                  onClick={() => onSelectAnnouncement(announcement.id)}
                  className={`border-b border-[#ccc] px-3 py-4 cursor-pointer transition-colors ${
                    selectedAnnouncementId === announcement.id ? 'bg-[#e7f8fb]' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {selectedFolder !== 'All Folders' && (
                      <div onClick={(event) => event.stopPropagation()}>
                        <Checkbox
                          checked={selectedItems.has(announcement.id)}
                          onCheckedChange={() => handleSelectItem(announcement.id)}
                        />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <CompanyDisplay
                          companies={announcement.companies}
                          isBold={!announcement.isRead}
                          maxWidth="max-w-[200px]"
                        />
                        <span className="text-xs text-[#262626] font-normal shrink-0">
                          {announcement.publishedDate.split(' ')[0]}
                        </span>
                      </div>

                      <div className="flex items-center justify-between mb-2">
                        <div
                          className={`text-base truncate text-[#262626] pr-2 ${
                            !announcement.isRead ? 'font-bold' : ''
                          }`}
                          dangerouslySetInnerHTML={{
                            __html: highlightText(announcement.title, searchQuery),
                          }}
                        ></div>
                        <div className="flex gap-1.5 shrink-0 min-h-[14px]">
                          {announcement.hasAttachment && <AppIcon name="attachment" size={14} />}
                          {announcement.hasTodo && <AppIcon name="todo" size={14} />}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div
                          className="text-sm text-[#262626] truncate flex-1 pr-2"
                          dangerouslySetInnerHTML={{
                            __html: highlightText(announcement.preview, searchQuery),
                          }}
                        ></div>
                        <div
                          className={`px-2 py-0.5 text-xs font-bold text-white rounded ${getStatusBadgeClass(
                            announcement.status,
                          )}`}
                          style={{ fontSize: '10px', lineHeight: '14px' }}
                        >
                          {announcement.status.toUpperCase()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {!isCollapsed && (
        <button
          onClick={onToggleCollapse}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-[30px] h-[30px] bg-white shadow-[2px_2px_7px_0_rgba(0,0,0,0.25)] hover:bg-gray-50 active:bg-gray-100 flex items-center justify-center transition-colors z-50"
          style={{ borderRadius: '8px' }}
          title="Collapse announcements list"
        >
          <AppIcon name="chevron-left" size={16} className="text-[#262626]" />
        </button>
      )}
    </div>
  )
}
