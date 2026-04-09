
import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppIcon from '../../../shared/icons/AppIcon'
import AttachmentStrip from '../../../shared/components/AttachmentStrip/AttachmentStrip'
import RichTextEditor from '../../../shared/components/RichTextEditor/RichTextEditor'
import type {
  RichTextEditorAttachment,
  RichTextEditorReply,
} from '../../../shared/components/RichTextEditor/RichTextEditor'
import RecipientPicker from '../../../shared/components/RecipientPicker/RecipientPicker'
import DropdownMenu from '../../shared/DropdownMenu'
import CompanyDisplay from '../../shared/CompanyDisplay'
import TodoMessagesSection from './TodoMessagesSection'
import { conversationsData } from '../../core/data/conversations.mock'
import { mockRecipients } from '../../core/data/companies.mock'
import { isSystemMessage } from '../../core/models'
import type {
  ConversationData,
  ConversationItem,
  ConversationMessage,
  SystemMessage,
  Attachment,
} from '../../core/models'
import { highlightText } from '../../core/logic/search.utils'
import {
  getCompaniesFromParticipants,
  getParticipantType,
  getRecipientByName,
} from '../../core/logic/participants.logic'

export interface ConversationPanelProps {
  messageId: string | null
  searchQuery: string
  folder?: string
  onReadUntilEnd: (id: string) => void
  onMarkUnread: (id: string) => void
  onDeleteConversation: (id: string) => void
  onRestoreConversation: (id: string) => void
  onShowError?: (title: string, message: string) => void
}

const MAX_TODOS = 5
const MAX_ATTACHMENT_SIZE = 20 * 1024 * 1024

export default function ConversationPanel({
  messageId,
  searchQuery,
  folder,
  onReadUntilEnd,
  onMarkUnread,
  onDeleteConversation,
  onRestoreConversation,
  onShowError,
}: ConversationPanelProps) {
  const navigate = useNavigate()
  const [conversation, setConversation] = useState<ConversationData | null>(null)
  const [replyingTo, setReplyingTo] = useState<ConversationMessage | null>(null)
  const [draftContent, setDraftContent] = useState('')
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [uploadingIds, setUploadingIds] = useState<Set<string>>(new Set())
  const [highlightedMessageId, setHighlightedMessageId] = useState<string | null>(null)
  const [showScrollButton, setShowScrollButton] = useState(false)

  const [isMemberDropdownOpen, setIsMemberDropdownOpen] = useState(false)
  const [isEditMembersMode, setIsEditMembersMode] = useState(false)
  const [showMemberPicker, setShowMemberPicker] = useState(false)
  const [draftParticipants, setDraftParticipants] = useState<string[]>([])
  const [memberSearchQuery, setMemberSearchQuery] = useState('')
  const [showMemberSuggestions, setShowMemberSuggestions] = useState(false)
  const [groupedSuggestions, setGroupedSuggestions] = useState<{
    portfolio: typeof mockRecipients
    otherBank: typeof mockRecipients
  }>({ portfolio: [], otherBank: [] })
  const [participantToRemove, setParticipantToRemove] = useState<string | null>(null)

  const scrollContainerRef = useRef<HTMLDivElement | null>(null)
  const scrollBottomRef = useRef<HTMLDivElement | null>(null)
  const memberDropdownRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!messageId) {
      setConversation(null)
      return
    }

    const data = conversationsData[messageId]
    setConversation(data ? (JSON.parse(JSON.stringify(data)) as ConversationData) : null)
    setDraftContent('')
    setReplyingTo(null)
    setAttachments([])
    setUploadingIds(new Set())
  }, [messageId])

  useEffect(() => {
    if (!isMemberDropdownOpen) return
    const handleMouseDown = (event: MouseEvent) => {
      if (memberDropdownRef.current && !memberDropdownRef.current.contains(event.target as Node)) {
        setIsMemberDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [isMemberDropdownOpen])
  const unreadCount = useMemo(() => {
    if (!conversation) return 0
    if (conversation.unreadCount !== undefined) return conversation.unreadCount
    return conversation.messages.filter(
      (m) => !isSystemMessage(m) && (m as ConversationMessage).isRead === false,
    ).length
  }, [conversation])

  const todoMessages = useMemo(() => {
    if (!conversation) return []
    return conversation.messages.filter(
      (item): item is ConversationMessage => !isSystemMessage(item) && !!item.isTodo,
    )
  }, [conversation])

  const isFirstUnread = (item: ConversationItem) => {
    if (!conversation || unreadCount === 0) return false
    const index = conversation.messages.indexOf(item)
    const firstUnreadIndex = conversation.messages.length - unreadCount
    return index === firstUnreadIndex
  }

  const formatSystemText = (item: SystemMessage) => {
    const { type, actor, targetUser, organization } = item
    const pronoun = getGenderPronoun(targetUser)

    switch (type) {
      case 'member_added':
        if (actor === 'System') return `${targetUser} has been added to the conversation`
        return `${actor} added ${targetUser} to the conversation`
      case 'member_removed':
        return `${actor} removed ${targetUser} from the conversation`
      case 'you_were_added':
        return `${actor} added You to the conversation`
      case 'you_were_removed':
        return `${actor} removed You from the conversation`
      case 'member_left_org':
        return `${targetUser} was removed from the conversation because ${pronoun} is no longer part of ${organization}`
      case 'you_left_org':
        return `You were removed from the conversation because you are no longer part of ${organization}`
      case 'banker_replaced':
        return `${targetUser} was removed from the conversation as ${pronoun} is no longer assigned to organisation`
      case 'forward_separator':
        return 'FORWARDED MESSAGES ABOVE'
      default:
        return 'System notification'
    }
  }

  const getGenderPronoun = (name: string) => {
    const femaleEndings = ['a', 'ia', 'na', 'la', 'cia', 'sia']
    const lowerName = name.toLowerCase()
    const firstName = lowerName.split(' ')[0]
    if (femaleEndings.some((ending) => firstName.endsWith(ending))) {
      return 'she'
    }
    return 'he'
  }

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const element = event.currentTarget
    const atBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + 10
    setShowScrollButton(!atBottom)
    if (atBottom && messageId) {
      onReadUntilEnd(messageId)
    }
  }

  const scrollToNewest = () => {
    scrollContainerRef.current?.scrollTo({
      top: scrollContainerRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }

  const scrollToMessage = (id: string) => {
    setHighlightedMessageId(id)
    setTimeout(() => {
      const el = document.getElementById(`message-${id}`)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      setTimeout(() => setHighlightedMessageId(null), 3000)
    }, 100)
  }

  const toggleTodoStatus = (id: string) => {
    if (!conversation) return
    const messages = conversation.messages.map((item) => {
      if (isSystemMessage(item)) return item
      if (item.id !== id) return item

      if (!item.isTodo) {
        const totalTodos = conversation.messages.filter(
          (m) => !isSystemMessage(m) && (m as ConversationMessage).isTodo,
        ).length
        if (totalTodos >= MAX_TODOS) return item
        return { ...item, isTodo: true }
      }

      return { ...item, isTodo: false }
    })

    setConversation({ ...conversation, messages })
  }

  const handleSend = () => {
    if ((!draftContent || !draftContent.trim()) && attachments.length === 0) return
    if (!conversation || !messageId) return
    if (uploadingIds.size > 0) return

    const newMessage: ConversationMessage = {
      id: `msg-${Date.now()}`,
      sender: 'You',
      content: draftContent,
      attachments: [...attachments],
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }),
      isOwn: true,
      isTodo: false,
      replyTo: replyingTo ? { ...replyingTo } : undefined,
    }

    setConversation({ ...conversation, messages: [...conversation.messages, newMessage] })
    setDraftContent('')
    setReplyingTo(null)
    setAttachments([])
    setUploadingIds(new Set())

    setTimeout(() => {
      scrollBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  const onAddAttachments = (files: FileList | File[]) => {
    const fileArray = Array.from(files)
    let hasError = false
    const next: Attachment[] = []
    const nextUploading = new Set<string>()

    fileArray.forEach((file) => {
      if (file.size > MAX_ATTACHMENT_SIZE) {
        hasError = true
        return
      }

      const extension = file.name.split('.').pop() || ''
      const attachment: Attachment = {
        id: `att-${Date.now()}-${file.name}`,
        name: file.name,
        type: extension.toUpperCase() || 'FILE',
        size: formatBytes(file.size),
        category: file.type.startsWith('image/') ? 'image' : 'document',
        url: URL.createObjectURL(file),
      }

      next.push(attachment)
      nextUploading.add(attachment.id)
    })

    if (next.length > 0) {
      setAttachments((prev) => [...prev, ...next])
      setUploadingIds((prev) => {
        const merged = new Set(prev)
        nextUploading.forEach((id) => merged.add(id))
        return merged
      })

      next.forEach((attachment) => {
        setTimeout(() => {
          setUploadingIds((prev) => {
            const updated = new Set(prev)
            updated.delete(attachment.id)
            return updated
          })
        }, 1000 + Math.random() * 2000)
      })
    }

    if (hasError) {
      onShowError?.(
        'You have exceeded the maximum size.',
        'The maximum size for attachments is 20MB.',
      )
    }
  }

  const onRemoveAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id))
    setUploadingIds((prev) => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }

  const formatBytes = (bytes: number, decimals = 2) => {
    if (!+bytes) return '0 B'
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
  }

  const getMemberIconName = (name: string) => {
    const type = getParticipantType(name)
    if (type === 'banker') return 'member-bank'
    return 'member-client'
  }

  const sortedParticipants = useMemo(() => {
    if (!conversation?.participantsList) return []
    return [...conversation.participantsList].sort((a, b) => a.localeCompare(b))
  }, [conversation])

  const hasParticipantMatch = useMemo(() => {
    if (!searchQuery || !conversation?.participantsList) return false
    const query = searchQuery.toLowerCase()
    return conversation.participantsList.some((p) => p.toLowerCase().includes(query))
  }, [conversation, searchQuery])

  const isMemberOOO = (name: string) => {
    const r = getRecipientByName(name)
    return !!r?.outOfOffice?.isOoo
  }

  const getMemberOOODate = (name: string) => {
    const r = getRecipientByName(name)
    return r?.outOfOffice?.returnDate || ''
  }

  const getConversationCompanies = () => {
    if (!conversation?.participantsList) return []
    return getCompaniesFromParticipants(conversation.participantsList)
  }

  const startEditMembers = () => {
    if (!conversation) return
    setIsEditMembersMode(true)
    setIsMemberDropdownOpen(false)
    setDraftParticipants([...(conversation.participantsList || [])])
  }

  const cancelEditMembers = () => {
    setIsEditMembersMode(false)
    setDraftParticipants([])
    setMemberSearchQuery('')
  }

  const saveEditMembers = () => {
    if (!conversation) return

    const original = conversation.participantsList || []
    const current = draftParticipants
    const added = current.filter((p) => !original.includes(p))
    const removed = original.filter((p) => !current.includes(p))

    if (added.length === 0 && removed.length === 0) {
      setIsEditMembersMode(false)
      return
    }

    const currentUser = 'White Dan'
    const nextMessages = [...conversation.messages]

    removed.forEach((name) => {
      nextMessages.push({
        id: `sys-${Date.now()}-${Math.random()}`,
        type: 'member_removed',
        actor: currentUser,
        targetUser: name,
        timestamp: new Date().toLocaleTimeString(),
        organization: 'UniCredit',
      })
    })

    added.forEach((name) => {
      nextMessages.push({
        id: `sys-${Date.now()}-${Math.random()}`,
        type: 'member_added',
        actor: currentUser,
        targetUser: name,
        timestamp: new Date().toLocaleTimeString(),
        organization: 'UniCredit',
      })
    })

    setConversation({
      ...conversation,
      participantsList: [...current],
      messages: nextMessages,
    })

    setTimeout(() => {
      scrollBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 100)

    setIsEditMembersMode(false)
  }

  const onMemberSearch = () => {
    const query = memberSearchQuery.toLowerCase().trim()
    if (!query) {
      setShowMemberSuggestions(false)
      return
    }

    const result = mockRecipients.filter(
      (r) =>
        !draftParticipants.includes(r.name) &&
        (r.name.toLowerCase().includes(query) || r.role.toLowerCase().includes(query)),
    )

    const portfolio: typeof mockRecipients = []
    const otherBank: typeof mockRecipients = []

    result.forEach((r) => {
      const type = getParticipantType(r.name)
      if (type === 'client') {
        portfolio.push(r)
      } else {
        otherBank.push(r)
      }
    })

    setGroupedSuggestions({ portfolio, otherBank })
    setShowMemberSuggestions(true)
  }

  const addParticipant = (name: string) => {
    if (!draftParticipants.includes(name)) {
      setDraftParticipants((prev) => [...prev, name])
    }
    setMemberSearchQuery('')
    setShowMemberSuggestions(false)
  }

  const confirmRemoveParticipant = () => {
    if (!participantToRemove) return
    setDraftParticipants((prev) => prev.filter((p) => p !== participantToRemove))
    setParticipantToRemove(null)
  }

  const toAttachments = (list: Attachment[]): RichTextEditorAttachment[] =>
    list.map((att) => ({
      id: att.id,
      name: att.name,
      sizeLabel: att.size,
      extension: att.type,
      mimeType: att.category === 'image' ? 'image/*' : undefined,
    }))

  const replyTo: RichTextEditorReply | null = replyingTo
    ? { sender: replyingTo.sender, timestamp: replyingTo.timestamp, content: replyingTo.content }
    : null

  if (!messageId) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-white text-unicredit-text-secondary gap-4 h-full">
        <AppIcon name="empty-conversation" size={110} />
        <p className="text-lg">Select a conversation to view messages</p>
      </div>
    )
  }

  if (!conversation) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-white text-unicredit-text-secondary gap-4 h-full">
        <p className="text-lg">Loading conversation...</p>
      </div>
    )
  }
  return (
    <div className="flex-1 bg-white flex flex-col min-w-0 h-full">
      <div className="border-b border-unicredit-gray flex flex-col">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex-1 min-w-0 pr-4">
            <h2 className="text-xl font-bold text-unicredit-text truncate" title={conversation.title}>
              {conversation.title}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-unicredit-text-secondary">
              Updated: {conversation.lastUpdated}
            </span>

            <div className="relative" ref={memberDropdownRef}>
              <button
                onClick={() => setIsMemberDropdownOpen((prev) => !prev)}
                className={`flex items-center gap-1 px-4 py-1.5 border rounded-[4px] transition-colors group outline-none ${
                  hasParticipantMatch
                    ? 'bg-unicredit-primary-light text-unicredit-primary border-unicredit-primary'
                    : isMemberDropdownOpen
                    ? 'bg-unicredit-gray-lighter text-unicredit-primary border-unicredit-primary'
                    : 'border-unicredit-text bg-unicredit-gray-lighter hover:bg-gray-100'
                }`}
              >
                <AppIcon name="participants" size={15} />
                <span
                  className={`text-sm font-bold ${
                    isMemberDropdownOpen || hasParticipantMatch
                      ? 'text-unicredit-primary'
                      : 'text-unicredit-text'
                  }`}
                >
                  {(conversation.participantsList || []).length}
                </span>
              </button>

              {isMemberDropdownOpen && (
                <div className="absolute top-full right-0 mt-1 w-[240px] bg-white rounded-[4px] border border-unicredit-text shadow-lg z-50 p-3 flex flex-col animate-slideDown">
                  <div className="w-full mb-2 flex justify-center">
                    <CompanyDisplay
                      companies={getConversationCompanies()}
                      textSize="text-sm"
                      isBold
                      maxWidth="max-w-full"
                    />
                  </div>

                  <div className="flex-1 overflow-y-auto pr-1 hover-scrollbar" style={{ maxHeight: 216 }}>
                    {sortedParticipants.map((member) => (
                      <div
                        key={member}
                        className={`flex items-center gap-2.5 w-full rounded py-1.5 px-3 transition-colors cursor-default relative group/ooo ${
                          isMemberOOO(member)
                            ? 'bg-unicredit-ooo-bg hover:bg-[#F8BBD0]'
                            : 'bg-unicredit-gray-lighter hover:bg-[#ebebeb]'
                        }`}
                        title={
                          isMemberOOO(member) ? `Out of office: Returning ${getMemberOOODate(member)}` : ''
                        }
                      >
                        <div className="shrink-0 flex items-center justify-center w-5 h-5">
                          <AppIcon name={getMemberIconName(member)} size={15} />
                        </div>
                        <span
                          className="text-unicredit-text font-bold text-sm uppercase truncate flex-1 block"
                          dangerouslySetInnerHTML={{ __html: highlightText(member, searchQuery) }}
                        ></span>
                        {isMemberOOO(member) && (
                          <div className="shrink-0 text-unicredit-text">
                            <AppIcon name="ooo" size={14} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-center w-full">
                    <button
                      onClick={startEditMembers}
                      className="flex items-center gap-2 mt-4 hover:opacity-80 transition-opacity text-[#007a91]"
                    >
                      <AppIcon name="edit" size={16} className="text-current" />
                      <span
                        className="font-bold text-sm uppercase"
                        style={{
                          fontFamily: 'UniCredit, sans-serif',
                          fontFeatureSettings: "'liga' off, 'clig' off",
                          lineHeight: 'normal',
                        }}
                      >
                        EDIT MEMBERS
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <DropdownMenu
              trigger={
                <button className="p-2 transition-colors duration-200 hover:text-[#007a91] text-[#262626] outline-none cursor-pointer">
                  <AppIcon name="quick-actions" size={20} />
                </button>
              }
            >
              <div className="flex flex-col min-w-[200px]">
                <button
                  onClick={() => messageId && onMarkUnread(messageId)}
                  className="flex items-center gap-2 px-3 py-3 cursor-pointer outline-none transition-colors hover:text-[#007a91] text-left w-full text-[#262626]"
                >
                  <AppIcon name="mark-unread" size={16} />
                  <span className="uppercase font-bold text-sm">Mark as unread</span>
                </button>

                {folder === 'Deleted Items' && (
                  <button
                    onClick={() => messageId && onRestoreConversation(messageId)}
                    className="flex items-center gap-2 px-3 py-3 cursor-pointer outline-none transition-colors hover:text-[#007a91] text-left w-full text-[#262626]"
                  >
                    <AppIcon name="restore" size={16} />
                    <span className="uppercase font-bold text-sm">Restore conversation</span>
                  </button>
                )}

                <button
                  onClick={() => messageId && navigate(`/messages/forward/${messageId}`)}
                  className="flex items-center gap-2 px-3 py-3 cursor-pointer outline-none transition-colors hover:text-[#007a91] text-left w-full text-[#262626]"
                >
                  <AppIcon name="forward" size={16} />
                  <span className="uppercase font-bold text-sm">Forward conversation</span>
                </button>

                <button className="flex items-center gap-2 px-3 py-3 cursor-pointer outline-none transition-colors hover:text-[#007a91] text-left w-full text-[#262626]">
                  <AppIcon name="download" size={16} />
                  <span className="uppercase font-bold text-sm">Download conversation</span>
                </button>

                {folder !== 'Deleted Items' && (
                  <button
                    onClick={() => messageId && onDeleteConversation(messageId)}
                    className="flex items-center gap-2 px-3 py-3 cursor-pointer outline-none transition-colors hover:text-[#007a91] text-left w-full text-[#262626]"
                  >
                    <AppIcon name="trash" size={16} />
                    <span className="uppercase font-bold text-sm">Delete</span>
                  </button>
                )}
              </div>
            </DropdownMenu>
          </div>
        </div>

        {todoMessages.length > 0 && (
          <div className="px-6 pb-4">
            <TodoMessagesSection
              todoMessages={todoMessages}
              onViewInChat={scrollToMessage}
              onUnmarkTodo={toggleTodoStatus}
            />
          </div>
        )}
      </div>

      {isEditMembersMode && (
        <div className="bg-white border-b border-[#ccc] px-6 py-4 flex flex-col gap-4 animate-slideDown shadow-sm relative z-30">
          <div className="flex items-start gap-4">
            <div className="relative z-50">
              <button
                onClick={() => setShowMemberPicker((prev) => !prev)}
                className={`font-bold text-sm mt-2 whitespace-nowrap flex items-center gap-1 cursor-pointer outline-none transition-colors ${
                  showMemberPicker ? 'text-[#007a91]' : 'text-[#262626]'
                }`}
              >
                To
                <AppIcon
                  name="chevron-down"
                  size={12}
                  className={`transition-transform duration-200 ${showMemberPicker ? 'rotate-180' : ''}`}
                />
              </button>

              {showMemberPicker && (
                <RecipientPicker
                  isOpen
                  onOpenChange={(open) => setShowMemberPicker(open)}
                  recipients={mockRecipients.map((r) => ({
                    id: r.id,
                    name: r.name,
                    role: r.role,
                    companyName: r.companyId,
                    isOutOfOffice: r.outOfOffice?.isOoo,
                    outOfOfficeLabel: r.outOfOffice?.returnDate,
                  }))}
                  selectedIds={draftParticipants
                    .map((name) => mockRecipients.find((r) => r.name === name)?.id)
                    .filter(Boolean) as string[]}
                  onApply={(ids) => {
                    const selectedNames = ids
                      .map((id) => mockRecipients.find((r) => r.id === id)?.name)
                      .filter(Boolean) as string[]
                    setDraftParticipants(selectedNames)
                    setShowMemberPicker(false)
                  }}
                  onCancel={() => setShowMemberPicker(false)}
                  className="absolute top-full left-0 mt-2 z-[100]"
                />
              )}
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap gap-2 items-center">
                {draftParticipants.map((member) => (
                  <div
                    key={member}
                    className="flex items-center gap-2 px-2 py-1 bg-white border border-[#ccc] rounded-[4px]"
                  >
                    <AppIcon name={getMemberIconName(member)} size={14} />
                    <span className="text-[#262626] text-sm font-medium">{member}</span>
                    <button
                      onClick={() => setParticipantToRemove(member)}
                      className="text-[#666] hover:text-[#d32f2f] transition-colors"
                    >
                      <AppIcon name="close" size={16} />
                    </button>
                  </div>
                ))}

                <div className="relative flex-1 min-w-[200px]">
                  <input
                    type="text"
                    value={memberSearchQuery}
                    onChange={(event) => setMemberSearchQuery(event.target.value)}
                    onInput={onMemberSearch}
                    onFocus={() => memberSearchQuery && setShowMemberSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowMemberSuggestions(false), 200)}
                    placeholder="Add people..."
                    className="w-full outline-none text-sm py-1.5"
                  />

                  {showMemberSuggestions &&
                    (groupedSuggestions.portfolio.length > 0 ||
                      groupedSuggestions.otherBank.length > 0) && (
                      <div className="absolute top-full left-0 mt-2 w-[400px] bg-white border border-[#ccc] rounded-[4px] shadow-lg max-h-[300px] overflow-y-auto z-50">
                        <div className="px-4 py-2 border-b border-[#e6e6e6]">
                          <div className="flex items-center gap-2 text-gray-500">
                            <AppIcon name="search" size={14} />
                            <span className="text-xs uppercase font-bold">Search</span>
                          </div>
                        </div>

                        {groupedSuggestions.portfolio.length > 0 && (
                          <>
                            <div className="px-4 py-2 bg-gray-50 text-[10px] font-bold text-[#666] uppercase tracking-wider">
                              Users in my portfolio
                            </div>
                            {groupedSuggestions.portfolio.map((user) => (
                              <button
                                key={user.id}
                                className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors"
                                onMouseDown={() => addParticipant(user.name)}
                              >
                                <div className="flex items-center gap-2">
                                  <AppIcon name={getMemberIconName(user.name)} size={14} />
                                  <span className="font-bold text-sm text-[#262626]">{user.name}</span>
                                </div>
                                <div className="text-xs text-[#666] ml-6">{user.role}</div>
                              </button>
                            ))}
                          </>
                        )}

                        {groupedSuggestions.otherBank.length > 0 && (
                          <>
                            <div className="px-4 py-2 bg-gray-50 text-[10px] font-bold text-[#666] uppercase tracking-wider">
                              Other bank users
                            </div>
                            {groupedSuggestions.otherBank.map((user) => (
                              <button
                                key={user.id}
                                className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors"
                                onMouseDown={() => addParticipant(user.name)}
                              >
                                <div className="flex items-center gap-2">
                                  <AppIcon name={getMemberIconName(user.name)} size={14} />
                                  <span className="font-bold text-sm text-[#262626]">{user.name}</span>
                                </div>
                                <div className="text-xs text-[#666] ml-6">{user.role}</div>
                              </button>
                            ))}
                          </>
                        )}
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={cancelEditMembers} className="btn-secondary !px-4 !py-2">
              Cancel
            </button>
            <button onClick={saveEditMembers} className="btn-primary !px-4 !py-2">
              Apply
            </button>
          </div>
        </div>
      )}

      {participantToRemove && (
        <div className="fixed inset-0 bg-black/50 z-[1000] flex items-center justify-center">
          <div
            className="bg-white rounded-[4px] p-6 flex flex-col items-center shadow-2xl relative"
            style={{ width: 800, minHeight: 331 }}
          >
            <div className="mb-8 mt-4">
              <AppIcon name="warning-circle" size={80} className="text-[#EC6608]" />
            </div>

            <h3
              className="text-[#262626] text-center mb-1"
              style={{
                fontFamily: 'UniCredit',
                fontSize: 20,
                fontWeight: 700,
                lineHeight: 'normal',
              }}
            >
              Are you sure you want to remove {participantToRemove} from the conversation?
            </h3>

            <p
              className="text-[#262626] text-center mb-10"
              style={{
                fontFamily: 'UniCredit',
                fontSize: 18,
                fontWeight: 400,
                lineHeight: 'normal',
              }}
            >
              These will still have access to the chat history.
            </p>

            <div className="flex justify-between w-full mt-auto">
              <button
                onClick={() => setParticipantToRemove(null)}
                className="flex flex-col justify-center items-center py-[12px] w-[160px] bg-white text-[#262626] font-bold rounded-[4px] hover:bg-gray-50 border-2 border-[#262626]"
                style={{
                  fontFamily: 'UniCredit',
                  fontFeatureSettings: "'liga' off, 'clig' off",
                  fontSize: 16,
                  fontWeight: 700,
                  lineHeight: '22px',
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmRemoveParticipant}
                className="flex flex-col justify-center items-center py-[12px] w-[160px] bg-[#007A91] text-white font-bold rounded-[4px] hover:bg-[#006577]"
                style={{
                  fontFamily: 'UniCredit',
                  fontFeatureSettings: "'liga' off, 'clig' off",
                  fontSize: 16,
                  fontWeight: 700,
                  lineHeight: '22px',
                }}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="flex-1 relative min-h-0 flex flex-col">
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto message-list-scrollbar p-6 bg-white"
        >
          <div className="flex flex-col gap-3 min-h-full justify-end">
            {conversation.messages.map((item) => (
              <div key={item.id}>
                {isFirstUnread(item) && (
                  <div
                    id="first-unread-separator"
                    className="flex flex-col gap-4 pb-4 items-start self-stretch justify-end flex-1"
                    style={{ flex: '1 0 0' }}
                  >
                    <div className="flex items-center w-full gap-[10px] justify-center">
                      <div className="h-px bg-[#007A91] flex-1"></div>
                      <div className="flex px-6 py-2 justify-center items-center gap-[10px] bg-white">
                        <span
                          style={{
                            color: '#007A91',
                            fontFeatureSettings: "'liga' off, 'clig' off",
                            fontFamily: 'UniCredit',
                            fontSize: '14px',
                            fontStyle: 'normal',
                            fontWeight: 700,
                            lineHeight: 'normal',
                            textTransform: 'uppercase',
                          }}
                        >
                          {unreadCount} NEW MESSAGES
                        </span>
                      </div>
                      <div className="h-px bg-[#007A91] flex-1"></div>
                    </div>
                  </div>
                )}

                {isSystemMessage(item) && (
                  <div className="flex justify-center w-full my-2">
                    {item.type === 'forward_separator' ? (
                      <div className="inline-flex px-4 py-2 justify-center items-center rounded border border-[#666] bg-[#e6e6e6]">
                        <span className="text-[#262626] text-center text-sm font-bold uppercase leading-[16px]">
                          {formatSystemText(item as SystemMessage)}
                        </span>
                      </div>
                    ) : (
                      <div className="inline-flex px-3 py-1.5 justify-center items-center rounded border border-[#007A91] bg-[#E7F8FB] max-w-[90%]">
                        <span className="text-[#262626] text-center text-sm leading-[16px]">
                          {formatSystemText(item as SystemMessage)}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {!isSystemMessage(item) && (
                  <div
                    id={`message-${item.id}`}
                    className={`flex w-full group relative ${item.isOwn ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[75%] border rounded p-3 transition-all ${
                        item.isOwn ? 'bg-white border-[#007a91]' : 'bg-[#f5f5f5] border-[#909090]'
                      } ${highlightedMessageId === item.id ? 'shadow-md ring-1 ring-[#007A91]' : ''}`}
                    >
                      <div className="flex items-start justify-between gap-6 mb-3">
                        <span className={`font-bold ${item.isOwn ? 'text-[#007a91]' : 'text-[#262626]'}`}>
                          <span
                            dangerouslySetInnerHTML={{ __html: highlightText(item.sender, searchQuery) }}
                          ></span>
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[#262626] uppercase font-bold text-xs">{item.timestamp}</span>
                          {item.isTodo && (
                            <div className="text-[#262626]">
                              <AppIcon name="todo" size={14} />
                            </div>
                          )}
                          <DropdownMenu
                            trigger={
                              <button className="p-1 transition-colors duration-200 hover:text-[#007a91] text-[#262626] outline-none">
                                <AppIcon name="more-vertical" size={20} />
                              </button>
                            }
                          >
                            <div className="flex flex-col min-w-[180px]">
                              <button className="flex items-center gap-2 px-3 py-3 cursor-pointer outline-none transition-colors hover:text-[#007a91] text-left w-full text-[#262626]">
                                <AppIcon name="preview" size={16} />
                                <span className="uppercase font-bold text-sm">Mark as unread</span>
                              </button>

                              <button
                                onClick={() => toggleTodoStatus(item.id)}
                                className="flex items-center gap-2 px-3 py-3 cursor-pointer outline-none transition-colors hover:text-[#007a91] text-left w-full text-[#262626]"
                              >
                                <AppIcon name="todo" size={14} />
                                <span className="uppercase font-bold text-sm">
                                  {item.isTodo ? 'Unmark as to do' : 'Mark as to do'}
                                </span>
                              </button>

                              <button
                                onClick={() => setReplyingTo(item)}
                                className="flex items-center gap-2 px-3 py-3 cursor-pointer outline-none transition-colors hover:text-[#007a91] text-left w-full text-[#262626]"
                              >
                                <AppIcon name="reply-left" size={16} />
                                <span className="uppercase font-bold text-sm">Reply</span>
                              </button>

                              {item.isOwn && (
                                <button className="flex items-center gap-2 px-3 py-3 cursor-pointer outline-none transition-colors hover:text-[#007a91] text-left w-full text-[#262626]">
                                  <AppIcon name="trash" size={16} />
                                  <span className="uppercase font-bold text-sm">Delete for all</span>
                                </button>
                              )}
                            </div>
                          </DropdownMenu>
                        </div>
                      </div>

                      {item.replyTo && (
                        <div
                          onClick={() => scrollToMessage(item.replyTo!.id)}
                          className="mb-3 p-4 flex flex-col gap-2 rounded bg-white border border-[#007A91] self-stretch cursor-pointer hover:bg-[#f0f9fb] transition-colors duration-200"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[#262626] text-sm font-bold uppercase">{item.replyTo.sender}</span>
                            <span className="text-[#666] text-xs">{item.replyTo.timestamp}</span>
                          </div>
                          <div
                            className={`text-[#262626] text-sm opacity-90 transition-all duration-300 break-words whitespace-pre-wrap ${
                              item.isReplyExpanded ? '' : 'line-clamp-1'
                            }`}
                            dangerouslySetInnerHTML={{ __html: item.replyTo.content }}
                          ></div>
                          {shouldShowReadMore(item.replyTo.content) && (
                            <button
                              onClick={(event) => {
                                event.stopPropagation()
                                toggleReplyExpand(item)
                              }}
                              className="flex items-center gap-1 text-[#007A91] text-xs font-bold uppercase mt-1 self-end hover:opacity-80 transition-opacity"
                            >
                              <AppIcon name="read-more" size={16} />
                              {item.isReplyExpanded ? 'Read Less' : 'Read More'}
                            </button>
                          )}
                        </div>
                      )}

                      <div className="text-[#262626] leading-relaxed rich-text-content break-words whitespace-pre-wrap cursor-text select-text">
                        <div
                          dangerouslySetInnerHTML={{ __html: highlightText(item.content, searchQuery) }}
                        ></div>
                      </div>

                      {item.attachments?.length ? (
                        <AttachmentStrip
                          attachments={item.attachments.map((att) => ({
                            id: att.id,
                            name: att.name,
                            sizeLabel: att.size,
                            extension: att.type,
                          }))}
                          maxVisible={2}
                          className="mt-3 block"
                        />
                      ) : null}
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div ref={scrollBottomRef}></div>
          </div>
        </div>

        {showScrollButton && (
          <button
            onClick={scrollToNewest}
            className="absolute bottom-10 right-6 z-20 cursor-pointer transition-opacity duration-200 outline-none hover:bg-gray-50 bg-white"
            style={{
              display: 'inline-flex',
              padding: '8px 12px',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '8px',
              borderRadius: '8px',
              boxShadow: '2px 2px 7px 0 rgba(0, 0, 0, 0.25)',
            }}
          >
            <AppIcon name="arrow-down" size={14} className="text-[#262626]" />
          </button>
        )}
      </div>

      <div className="border-t border-unicredit-gray">
        <RichTextEditor
          value={draftContent}
          onChange={setDraftContent}
          onSend={handleSend}
          placeholder="Type your message or drag a document"
          attachments={toAttachments(attachments)}
          onAddAttachments={onAddAttachments}
          onRemoveAttachment={onRemoveAttachment}
          uploadingAttachmentIds={Array.from(uploadingIds)}
          sendDisabled={uploadingIds.size > 0}
          replyTo={replyTo}
          onCancelReply={() => setReplyingTo(null)}
        />
      </div>
    </div>
  )

  function toggleReplyExpand(message: ConversationMessage) {
    message.isReplyExpanded = !message.isReplyExpanded
    setConversation((prev) => (prev ? { ...prev, messages: [...prev.messages] } : prev))
  }

  function shouldShowReadMore(content?: string) {
    if (!content) return false
    return content.length > 200 || content.includes('<br>') || content.includes('</div>')
  }
}
