import { useEffect, useMemo, useState } from 'react'
import ListHeader from '../../../shared/components/ListHeader/ListHeader'
import AppIcon from '../../../shared/icons/AppIcon'
import DropdownMenu from '../../shared/DropdownMenu'
import Checkbox from '../../shared/Checkbox'
import CompanyDisplay from '../../shared/CompanyDisplay'
import FilterPanel from './FilterPanel'
import type { Message, FilterOptions } from '../../core/models'
import { highlightText } from '../../core/logic/search.utils'
import { conversationsData } from '../../core/data/conversations.mock'
import { members as mockMembers } from '../../core/data/filter.mock'
import { useSelectionSet } from '../../core/logic/selection.utils'

export interface MessageListPanelProps {
  messages: Message[]
  isLoading?: boolean
  selectedMessageId?: string | null
  searchQuery: string
  isCollapsed: boolean
  selectedFolder: string
  onSelectedFolderChange: (folder: string) => void
  onSelectMessage: (id: string) => void
  onSearchChange: (value: string) => void
  onMarkAsRead: (ids: string[]) => void
  onMarkAsUnread: (ids: string[]) => void
  onDeleteMessages: (ids: string[]) => void
  onRestoreMessages: (ids: string[]) => void
}

const folders = ['All Folders', 'Inbox', 'Drafts', 'Deleted Items']

const createEmptyFilters = (): FilterOptions => ({
  companies: [],
  members: [],
  dateRange: { from: undefined, to: undefined },
  unread: false,
  todo: false,
  attachments: false,
})

export default function MessageListPanel({
  messages,
  isLoading = false,
  selectedMessageId,
  searchQuery,
  isCollapsed,
  selectedFolder,
  onSelectedFolderChange,
  onSelectMessage,
  onSearchChange,
  onMarkAsRead,
  onMarkAsUnread,
  onDeleteMessages,
  onRestoreMessages,
}: MessageListPanelProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
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

  const filteredMessages = useMemo(() => {
    let result = messages

    if (selectedFolder !== 'All Folders') {
      result = result.filter((m) => m.folder === selectedFolder)
    }

    if (searchQuery && searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter((m) => {
        if ((m.sender || '').toLowerCase().includes(query)) return true
        if ((m.subject || '').toLowerCase().includes(query)) return true
        const conv = conversationsData[m.id]
        if (conv) {
          if ((conv.title || '').toLowerCase().includes(query)) return true
          if (conv.messages.some((msg: any) => (msg.content || '').toLowerCase().includes(query))) {
            return true
          }
        }
        return false
      })
    }

    if (activeFilters.companies && activeFilters.companies.length > 0) {
      result = result.filter((m) => m.companies.some((c) => activeFilters.companies.includes(c)))
    }

    if (activeFilters.members && activeFilters.members.length > 0) {
      const selectedMemberNames = mockMembers
        .filter((m) => activeFilters.members.includes(m.id))
        .map((m) => m.name.toLowerCase())

      result = result.filter((m) => {
        const conv = conversationsData[m.id]
        if (conv && conv.participantsList) {
          return conv.participantsList.some((p) =>
            selectedMemberNames.some((selected) => p.toLowerCase().includes(selected)),
          )
        }
        if (selectedMemberNames.some((selected) => m.sender.toLowerCase().includes(selected))) return true
        return false
      })
    }

    if (activeFilters.unread) {
      result = result.filter((m) => m.unreadCount > 0)
    }

    if (activeFilters.todo) {
      result = result.filter((m) => m.isTodo)
    }

    if (activeFilters.attachments) {
      result = result.filter((m) => m.hasAttachment)
    }

    if (activeFilters.dateRange.from && activeFilters.dateRange.to) {
      const start = new Date(activeFilters.dateRange.from)
      const end = new Date(activeFilters.dateRange.to)
      start.setHours(0, 0, 0, 0)
      end.setHours(23, 59, 59, 999)

      result = result.filter((m) => {
        if (!m.timestamp) return true
        const msgDate = new Date(m.timestamp)
        return msgDate >= start && msgDate <= end
      })
    }

    return result
  }, [messages, searchQuery, selectedFolder, activeFilters])

  useEffect(() => {
    clearSelection()
  }, [selectedFolder, searchQuery, clearSelection])

  const folderUnreadCount = filteredMessages.filter((m) => m.unreadCount > 0 && !m.isEntered).length
  const folderTotalCount = filteredMessages.length

  const handleSelectAll = () => {
    toggleSelectAll(filteredMessages.map((message) => message.id))
  }

  const handleSelectItem = (id: string) => {
    toggleItem(id, filteredMessages.map((message) => message.id))
  }

  const handleBulkAction = (action: 'markRead' | 'markUnread' | 'delete' | 'restore') => {
    const ids = Array.from(selectedItems)
    if (ids.length === 0) return

    if (action === 'markRead') onMarkAsRead(ids)
    if (action === 'markUnread') onMarkAsUnread(ids)
    if (action === 'delete') onDeleteMessages(ids)
    if (action === 'restore') onRestoreMessages(ids)

    clearSelection()
  }

  const hasUnreadInSelection = Array.from(selectedItems).some((id) => {
    const msg = messages.find((m) => m.id === id)
    return msg && msg.unreadCount > 0 && !msg.isEntered
  })

  const hasReadInSelection = Array.from(selectedItems).some((id) => {
    const msg = messages.find((m) => m.id === id)
    return msg && (msg.unreadCount === 0 || msg.isEntered)
  })

  const getSenderDisplay = (message: Message) => {
    const conversation = conversationsData[message.id]
    if (conversation && conversation.participantsList) {
      const participants = conversation.participantsList
      const otherParticipants = participants.filter(
        (p) => !p.toLowerCase().includes('(you)') && p !== 'You',
      )
      otherParticipants.sort((a, b) => a.localeCompare(b))

      if (otherParticipants.length > 0) {
        const primaryName = otherParticipants[0]
        const count = participants.length - 1
        return count > 0 ? `${primaryName} +${count}` : primaryName
      }
    }
    return message.sender
  }

  return (
    <div
      className={`shrink-0 relative h-full flex flex-col transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)] ${
        isCollapsed ? 'w-0 overflow-hidden' : 'w-[390px] overflow-visible'
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
          folders={folders.map((f) => ({ id: f, label: f }))}
          selectedFolderId={selectedFolder}
          onFolderChange={onSelectedFolderChange}
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
                        <button className="flex items-center gap-1 outline-none group uppercase text-unicredit-primary font-bold text-sm">
                          ACTIONS
                          <AppIcon name="caret-down-filled" size={12} className="transition-transform group-data-[state=open]:-rotate-180" />
                        </button>
                      }
                    >
                      <div className="flex flex-col min-w-[200px] py-1">
                        {selectedFolder === 'Deleted Items' && (
                          <button
                            onClick={() => handleBulkAction('restore')}
                            className="text-left px-4 py-3 hover:bg-unicredit-primary-light text-sm text-unicredit-text font-bold uppercase transition-colors outline-none h-11 flex items-center gap-2"
                          >
                            <AppIcon name="restore" size={16} />
                            Restore Conversation
                          </button>
                        )}

                        {selectedFolder === 'Drafts' && (
                          <button
                            onClick={() => handleBulkAction('delete')}
                            className="text-left px-4 py-3 hover:bg-unicredit-primary-light text-sm text-unicredit-text font-bold uppercase transition-colors outline-none flex items-center gap-2"
                          >
                            <AppIcon name="trash" size={16} />
                            Delete
                          </button>
                        )}

                        {selectedFolder !== 'Deleted Items' && selectedFolder !== 'Drafts' && (
                          <>
                            {hasUnreadInSelection && (
                              <button
                                onClick={() => handleBulkAction('markRead')}
                                className="text-left px-4 py-3 hover:text-unicredit-primary text-sm text-unicredit-text font-bold uppercase transition-colors outline-none flex items-center gap-2"
                              >
                                <AppIcon name="mark-read" size={16} />
                                Mark as read
                              </button>
                            )}
                            {hasReadInSelection && (
                              <button
                                onClick={() => handleBulkAction('markUnread')}
                                className="text-left px-4 py-3 hover:text-[#007a91] text-sm text-[#262626] font-bold uppercase transition-colors outline-none flex items-center gap-2"
                              >
                                <AppIcon name="mark-unread" size={16} />
                                Mark as unread
                              </button>
                            )}
                            <button
                              onClick={() => handleBulkAction('delete')}
                              className="text-left px-4 py-3 hover:text-[#007a91] text-sm text-[#262626] font-bold uppercase transition-colors outline-none flex items-center gap-2"
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
              {filteredMessages.map((message) => (
                <div
                  key={message.id}
                  onClick={() => onSelectMessage(message.id)}
                  className={`px-3 py-3 border-b border-[#ccc] cursor-pointer transition-colors ${
                    selectedMessageId === message.id ? 'bg-[#e7f8fb]' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {selectedFolder !== 'All Folders' && (
                      <div onClick={(event) => event.stopPropagation()}>
                        <Checkbox
                          checked={selectedItems.has(message.id)}
                          onCheckedChange={() => handleSelectItem(message.id)}
                        />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <CompanyDisplay
                          companies={message.companies}
                          isBold={message.unreadCount > 0 && !message.isEntered}
                          maxWidth="max-w-[200px]"
                        />
                        <span className="text-xs text-[#262626] font-normal shrink-0">
                          {message.time}
                        </span>
                      </div>

                      <div className="flex items-center justify-between mb-2">
                        <span
                          className={`text-base truncate ${
                            message.unreadCount > 0 && !message.isEntered ? 'font-bold' : ''
                          }`}
                        >
                          {getSenderDisplay(message)}
                        </span>
                        <div className="flex items-center gap-1">
                          {message.isTodo && <AppIcon name="todo" size={14} />}
                          {message.hasAttachment && <AppIcon name="attachment" size={14} />}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span
                          className={`text-sm text-[#262626] truncate flex-1 ${
                            message.unreadCount > 0 && !message.isEntered ? 'font-bold' : ''
                          }`}
                          title={message.subject}
                          dangerouslySetInnerHTML={{
                            __html: highlightText(message.subject, searchQuery),
                          }}
                        ></span>
                        {message.unreadCount > 0 && (
                          <div
                            className={`ml-2 px-1.5 py-0.5 rounded text-xs font-bold text-white shrink-0 ${
                              message.isEntered ? 'bg-[#666]' : 'bg-[#e2001a]'
                            }`}
                          >
                            {message.unreadCount}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  )
}
