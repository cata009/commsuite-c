import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AppIcon from '../../../shared/icons/AppIcon'
import MessageListPanel from './MessageListPanel'
import ConversationPanel from './ConversationPanel'
import { mockMessages } from '../../core/data/messages.mock'
import type { Message } from '../../core/models'
import Notification from '../../layout/Notification'
import type { NotificationData } from '../../layout/Notification'

export default function MessagesPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id?: string }>()

  const [messages, setMessages] = useState<Message[]>([...mockMessages])
  const [isLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null)
  const [isMessageListCollapsed, setIsMessageListCollapsed] = useState(() => {
    try {
      return window.localStorage.getItem('commSuite.messagesListCollapsed') === 'true'
    } catch {
      return false
    }
  })
  const [selectedFolder, setSelectedFolder] = useState('Inbox')
  const [notification, setNotification] = useState<NotificationData | null>(null)

  useEffect(() => {
    if (id) {
      if (id === 'new') {
        setSelectedMessageId(null)
        return
      }
      setSelectedMessageId(id)
      return
    }

    if (selectedMessageId) {
      return
    }
  }, [id, selectedMessageId])

  useEffect(() => {
    try {
      window.localStorage.setItem(
        'commSuite.messagesListCollapsed',
        String(isMessageListCollapsed),
      )
    } catch {
      // ignore storage failures
    }
  }, [isMessageListCollapsed])

  const selectedMessageFolder = useMemo(
    () => messages.find((m) => m.id === selectedMessageId)?.folder,
    [messages, selectedMessageId],
  )

  const onSelectMessage = (messageId: string) => {
    setSelectedMessageId(messageId)
    const msg = messages.find((m) => m.id === messageId)
    if (msg) {
      msg.isEntered = true
      msg.unreadCount = 0
    }
    navigate(`/messages/${messageId}`)
  }

  const onMarkAsRead = (ids: string[]) => {
    setMessages((prev) =>
      prev.map((m) =>
        ids.includes(m.id) ? { ...m, unreadCount: 0, isEntered: true } : m,
      ),
    )
  }

  const onMarkAsUnread = (ids: string[]) => {
    setMessages((prev) =>
      prev.map((m) =>
        ids.includes(m.id) ? { ...m, unreadCount: 1, isEntered: false } : m,
      ),
    )
  }

  const onDeleteMessages = (ids: string[]) => {
    setMessages((prev) =>
      prev.map((m) => (ids.includes(m.id) ? { ...m, folder: 'Deleted Items' } : m)),
    )
    if (selectedMessageId && ids.includes(selectedMessageId)) {
      setSelectedMessageId(null)
      navigate('/messages')
    }
  }

  const onRestoreMessages = (ids: string[]) => {
    setMessages((prev) =>
      prev.map((m) => (ids.includes(m.id) ? { ...m, folder: 'Inbox' } : m)),
    )
    if (selectedMessageId && ids.includes(selectedMessageId)) {
      setSelectedMessageId(null)
      navigate('/messages')
    }
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-white">
      <div className="flex items-center justify-between border-b border-[#e6e6e6] bg-white min-h-[73px] px-3 py-4 pr-[calc(100%-390px+12px)]">
        <h2
          className="text-[26px] font-bold text-[#262626]"
          style={{
            fontFamily: 'UniCredit',
            lineHeight: 'normal',
            fontFeatureSettings: "'liga' off, 'clig' off",
          }}
        >
          Messages
        </h2>
        <button
          onClick={() => navigate('/messages/new')}
          className="flex items-center gap-1.5 px-4 py-1.5 bg-[#007a91] hover:bg-[#006577] text-white rounded transition-colors text-sm font-bold uppercase outline-none cursor-pointer"
          style={{ fontFamily: 'UniCredit, sans-serif' }}
        >
          <AppIcon name="new" size={16} />
          <span>NEW</span>
        </button>
      </div>

      <div className="flex-1 relative z-0">
        <Notification notification={notification} onClose={() => setNotification(null)} />
        <div className="absolute inset-0 flex overflow-hidden">
          <MessageListPanel
            messages={messages}
            isLoading={isLoading}
            selectedMessageId={selectedMessageId}
            searchQuery={searchQuery}
            isCollapsed={isMessageListCollapsed}
            selectedFolder={selectedFolder}
            onSelectedFolderChange={(folder) => {
              setSelectedFolder(folder)
              setSelectedMessageId(null)
            }}
            onSelectMessage={onSelectMessage}
            onSearchChange={setSearchQuery}
            onMarkAsRead={onMarkAsRead}
            onMarkAsUnread={onMarkAsUnread}
            onDeleteMessages={onDeleteMessages}
            onRestoreMessages={onRestoreMessages}
          />

          <div className="relative w-0">
            <button
              onClick={() => setIsMessageListCollapsed((prev) => !prev)}
              className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-[30px] h-[30px] shadow-[2px_2px_7px_0_rgba(0,0,0,0.25)] flex items-center justify-center transition-colors z-[100] ${
                isMessageListCollapsed
                  ? 'bg-[#007a91] hover:bg-[#006577]'
                  : 'bg-white hover:bg-gray-50 active:bg-gray-100'
              }`}
              style={{ borderRadius: '8px' }}
              aria-label={isMessageListCollapsed ? 'Expand messages list' : 'Collapse messages list'}
              title={isMessageListCollapsed ? 'Expand messages list' : 'Collapse messages list'}
            >
              <AppIcon
                name={isMessageListCollapsed ? 'chevron-right' : 'chevron-left'}
                size={16}
                className={isMessageListCollapsed ? 'text-white' : 'text-[#262626]'}
              />
            </button>
          </div>

          <ConversationPanel
            messageId={selectedMessageId}
            searchQuery={searchQuery}
            folder={selectedMessageFolder}
            onReadUntilEnd={(id) => onMarkAsRead([id])}
            onMarkUnread={(id) => onMarkAsUnread([id])}
            onDeleteConversation={(id) => onDeleteMessages([id])}
            onRestoreConversation={(id) => onRestoreMessages([id])}
            onShowError={(title, message) => setNotification({ title, message })}
          />

          {isMessageListCollapsed && (
            <div className="absolute left-0 top-0 bottom-0 w-px bg-[#e6e6e6] z-0 pointer-events-none"></div>
          )}
        </div>
      </div>
    </div>
  )
}
