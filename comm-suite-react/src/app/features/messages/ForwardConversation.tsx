import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AppIcon from '../../../shared/icons/AppIcon'
import RichTextEditor from '../../../shared/components/RichTextEditor/RichTextEditor'
import AttachmentStrip from '../../../shared/components/AttachmentStrip/AttachmentStrip'
import RecipientPicker from '../../../shared/components/RecipientPicker/RecipientPicker'
import { mockRecipients } from '../../core/data/companies.mock'
import type { Recipient } from '../../core/data/companies.mock'
import { isSystemMessage } from '../../core/models'
import type { Message, ConversationMessage } from '../../core/models'
import { conversationsData } from '../../core/data/conversations.mock'
import { mockMessages } from '../../core/data/messages.mock'
import { getParticipantType } from '../../core/logic/participants.logic'

interface ForwardDraft {
  id: string
  originalConversationId: string
  recipientIds: string[]
  subject: string
  body: string
  updatedAt: Date
}

export default function ForwardConversation() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const recipientInputRef = useRef<HTMLInputElement | null>(null)

  const [originalMessage, setOriginalMessage] = useState<Message | null>(null)
  const [conversationMessages, setConversationMessages] = useState<ConversationMessage[]>([])

  const [selectedRecipientIds, setSelectedRecipientIds] = useState<string[]>([])
  const [recipientTypeahead, setRecipientTypeahead] = useState('')
  const [recipientSuggestions, setRecipientSuggestions] = useState<Recipient[]>([])
  const [showRecipientSuggestions, setShowRecipientSuggestions] = useState(false)

  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [isDirty, setIsDirty] = useState(false)
  const [showUnsavedModal, setShowUnsavedModal] = useState(false)
  const [showRecipientPicker, setShowRecipientPicker] = useState(false)

  useEffect(() => {
    if (!id) return
    const msg = mockMessages.find((m) => m.id === id) || null
    setOriginalMessage(msg)
    if (msg) {
      setSubject(`FW: ${msg.subject}`)
    }

    const data = conversationsData[id]
    if (data?.messages) {
      setConversationMessages(
        data.messages.filter((item) => !isSystemMessage(item)) as ConversationMessage[],
      )
    }
  }, [id])

  const recipientItems = useMemo(
    () =>
      mockRecipients.map((r) => ({
        id: r.id,
        name: r.name,
        role: r.role,
        companyName: r.companyId,
        isOutOfOffice: r.outOfOffice?.isOoo,
        outOfOfficeLabel: r.outOfOffice?.returnDate,
      })),
    [],
  )

  const getAllCompanies = () => originalMessage?.companies?.join(', ') || ''

  const markAsDirty = () => setIsDirty(true)

  const focusRecipientInput = () => {
    if (recipientInputRef.current) {
      setTimeout(() => recipientInputRef.current?.focus(), 0)
    }
  }

  const onRecipientTypeahead = (value: string) => {
    const query = value.toLowerCase().trim()
    if (!query) {
      setRecipientSuggestions([])
      setShowRecipientSuggestions(false)
      return
    }

    const suggestions = mockRecipients
      .filter((r) => !selectedRecipientIds.includes(r.id))
      .filter(
        (r) =>
          r.name.toLowerCase().includes(query) || r.role.toLowerCase().includes(query),
      )
      .slice(0, 10)

    setRecipientSuggestions(suggestions)
    setShowRecipientSuggestions(suggestions.length > 0)
  }

  const addRecipientFromTypeahead = (recipient: Recipient) => {
    if (!selectedRecipientIds.includes(recipient.id)) {
      setSelectedRecipientIds((prev) => [...prev, recipient.id])
      markAsDirty()
    }
    setRecipientTypeahead('')
    setRecipientSuggestions([])
    setShowRecipientSuggestions(false)
    focusRecipientInput()
  }

  const removeRecipient = (recipientId: string) => {
    setSelectedRecipientIds((prev) => prev.filter((id) => id !== recipientId))
    markAsDirty()
  }

  const getRecipientName = (recipientId: string) =>
    mockRecipients.find((r) => r.id === recipientId)?.name || ''

  const getRecipientIconById = (recipientId: string) => {
    const recipient = mockRecipients.find((r) => r.id === recipientId)
    if (!recipient) return 'member-client'
    return getRecipientIcon(recipient)
  }

  const getRecipientIcon = (recipient: Recipient) => {
    const type = getParticipantType(recipient.name)
    return type === 'banker' ? 'member-bank' : 'member-client'
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    if (Number.isNaN(date.getTime())) {
      return timestamp
    }
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${day}.${month}.${year} ${hours}:${minutes}`
  }

  const validateForm = () => {
    if (selectedRecipientIds.length === 0) return false
    if (!subject.trim()) return false
    return true
  }

  const onSend = () => {
    if (!validateForm()) return
    setIsDirty(false)
    navigate('/messages')
  }

  const onSaveDraft = () => {
    if (!isDirty || !id) return
    const draft: ForwardDraft = {
      id: `forward-draft-${Date.now()}`,
      originalConversationId: id,
      recipientIds: [...selectedRecipientIds],
      subject,
      body,
      updatedAt: new Date(),
    }
    const drafts = JSON.parse(localStorage.getItem('forwardDrafts') || '[]')
    drafts.push(draft)
    localStorage.setItem('forwardDrafts', JSON.stringify(drafts))
    setIsDirty(false)
    navigate(`/messages/${id}`)
  }

  const onBack = () => {
    if (isDirty) {
      setShowUnsavedModal(true)
    } else if (id) {
      navigate(`/messages/${id}`)
    } else {
      navigate('/messages')
    }
  }

  const onDontSave = () => {
    setIsDirty(false)
    setShowUnsavedModal(false)
    if (id) {
      navigate(`/messages/${id}`)
    } else {
      navigate('/messages')
    }
  }

  const onSaveDraftAndLeave = () => {
    setShowUnsavedModal(false)
    onSaveDraft()
  }

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden">
      <div className="px-6 py-4 border-b border-[#e6e6e6] flex-shrink-0 bg-white">
        <h1
          style={{
            color: 'var(--primary-k-10262626-text, #262626)',
            fontFeatureSettings: "'liga' off, 'clig' off",
            fontFamily: 'UniCredit',
            fontSize: '18px',
            fontStyle: 'normal',
            fontWeight: 700,
            lineHeight: 'normal',
            textTransform: 'uppercase',
          }}
        >
          FORWARD CONVERSATION
        </h1>
        {originalMessage && (
          <div className="flex items-center gap-2 mt-1 w-full max-w-full overflow-hidden">
            <span className="text-sm text-[#909090] shrink-0">Companies</span>
            <span className="text-sm font-bold text-[#262626] truncate" title={getAllCompanies()}>
              {getAllCompanies()}
            </span>
          </div>
        )}
      </div>

      <div className="px-6 py-4 border-b border-[#e6e6e6] flex-shrink-0 bg-white relative z-20">
        <div className="relative flex items-start gap-4 mb-4">
          <div className="relative z-50">
            <button
              onClick={() => setShowRecipientPicker((prev) => !prev)}
              className={`font-bold text-sm mt-1.5 whitespace-nowrap flex items-center gap-1 cursor-pointer outline-none transition-colors ${
                showRecipientPicker ? 'text-[#007a91]' : 'text-[#262626]'
              }`}
            >
              To
              <AppIcon
                name="chevron-down"
                size={12}
                className={`transition-transform duration-200 ${
                  showRecipientPicker ? 'rotate-180' : ''
                }`}
              />
            </button>

            {showRecipientPicker && (
              <RecipientPicker
                isOpen
                onOpenChange={(open) => setShowRecipientPicker(open)}
                recipients={recipientItems}
                selectedIds={selectedRecipientIds}
                onApply={(ids) => {
                  setSelectedRecipientIds(ids)
                  markAsDirty()
                  setShowRecipientPicker(false)
                }}
                onCancel={() => setShowRecipientPicker(false)}
                className="absolute top-full left-0 mt-2 z-[100]"
              />
            )}
          </div>

          <div className="flex flex-wrap gap-2 items-center flex-1">
            {selectedRecipientIds.map((recipientId) => (
              <div
                key={recipientId}
                className="flex items-center gap-2 px-2 py-1 bg-[#F5F5F5] border border-[#E6E6E6] rounded-[4px]"
              >
                <AppIcon name={getRecipientIconById(recipientId)} size={14} />
                <span className="text-[#262626] text-sm font-medium">
                  {getRecipientName(recipientId)}
                </span>
                <button
                  onClick={() => removeRecipient(recipientId)}
                  className="text-[#666] hover:text-[#d32f2f] flex items-center justify-center"
                >
                  <AppIcon name="close" size={16} />
                </button>
              </div>
            ))}

            <input
              ref={recipientInputRef}
              type="text"
              value={recipientTypeahead}
              onChange={(event) => {
                const nextValue = event.target.value
                setRecipientTypeahead(nextValue)
                onRecipientTypeahead(nextValue)
              }}
              onBlur={() => setTimeout(() => setShowRecipientSuggestions(false), 200)}
              onFocus={() => setShowRecipientSuggestions(true)}
              className="flex-1 min-w-[100px] outline-none text-sm bg-transparent h-7"
            />
          </div>

          {showRecipientSuggestions && recipientSuggestions.length > 0 && (
            <div className="absolute top-full left-[40px] mt-1 w-[300px] z-50 bg-white border border-[#ccc] rounded shadow-lg max-h-60 overflow-y-auto">
              {recipientSuggestions.map((recipient) => (
                <button
                  key={recipient.id}
                  onMouseDown={() => addRecipientFromTypeahead(recipient)}
                  className="w-full text-left px-4 py-2 hover:bg-[#e7f8fb] transition-colors relative flex items-start gap-3"
                >
                  <div className="mt-0.5">
                    <AppIcon name={getRecipientIcon(recipient)} size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-[#262626]">{recipient.name}</div>
                    <div className="text-xs text-gray-600">{recipient.role}</div>
                    {recipient.outOfOffice?.isOoo && (
                      <div className="text-xs text-[#E91E63] font-medium mt-0.5">
                        Out of office: Returning {recipient.outOfOffice.returnDate}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-[#262626]">Subject:</span>
          <span className="text-sm text-[#262626]">{subject}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4 bg-[#e5e5e5] hover-scrollbar flex flex-col gap-3">
        {conversationMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex w-full group relative ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[75%] border rounded p-3 transition-all cursor-default ${
                msg.isOwn ? 'bg-white border-[#007a91]' : 'bg-[#f5f5f5] border-[#909090]'
              }`}
            >
              <div className="flex items-start justify-between gap-6 mb-3">
                <span className={`font-bold ${msg.isOwn ? 'text-[#007a91]' : 'text-[#262626]'}`}>
                  {msg.isOwn ? 'You' : msg.sender}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[#262626] uppercase font-bold text-xs">
                    {formatTimestamp(msg.timestamp)}
                  </span>
                </div>
              </div>

              {msg.replyTo && (
                <div className="mb-3 p-4 flex flex-col gap-2 rounded bg-white border border-[#007A91] self-stretch">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[#262626] text-sm font-bold uppercase">
                      {msg.replyTo.sender}
                    </span>
                    <span className="text-[#666] text-xs">{msg.replyTo.timestamp}</span>
                  </div>
                  <div
                    className="text-[#262626] text-sm opacity-90 break-words whitespace-pre-wrap line-clamp-2"
                    dangerouslySetInnerHTML={{ __html: msg.replyTo.content }}
                  ></div>
                </div>
              )}

              <div
                className="text-[#262626] leading-relaxed break-words whitespace-pre-wrap text-sm"
                dangerouslySetInnerHTML={{ __html: msg.content }}
              ></div>

              {msg.attachments?.length ? (
                <AttachmentStrip
                  attachments={msg.attachments.map((att) => ({
                    id: att.id,
                    name: att.name,
                    sizeLabel: att.size,
                    extension: att.type,
                    mimeType: att.category === 'image' ? 'image/*' : undefined,
                  }))}
                  className="mt-3 block"
                />
              ) : null}
            </div>
          </div>
        ))}
      </div>

      <div className="flex-shrink-0 border-t border-[#e6e6e6] bg-white p-6 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-30">
        <div className="mb-4">
          <RichTextEditor
            value={body}
            onChange={(next) => {
              setBody(next)
              markAsDirty()
            }}
            onSend={onSend}
            placeholder="Type your message"
            forceToolbar
            showSendButton={false}
            sendOnEnter={false}
            onAddAttachments={() => {
              window.alert('File attachment functionality would be implemented here')
            }}
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="px-6 py-2 border border-[#262626] text-[#262626] font-bold rounded hover:bg-gray-50 uppercase text-sm transition-colors"
            style={{ fontFamily: 'UniCredit' }}
          >
            Back
          </button>
          <div className="flex items-center gap-4">
            <button
              onClick={onSaveDraft}
              disabled={!isDirty}
              className="text-[#007a91] font-bold uppercase text-sm hover:underline disabled:opacity-50 disabled:no-underline disabled:cursor-not-allowed transition-colors"
              style={{ fontFamily: 'UniCredit' }}
            >
              SAVE DRAFT
            </button>
            <button
              onClick={onSend}
              disabled={selectedRecipientIds.length === 0}
              className="px-8 py-2 bg-[#007a91] text-white font-bold rounded hover:bg-[#006577] uppercase text-sm transition-all shadow-md hover:shadow-lg active:scale-95 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed disabled:shadow-none disabled:active:scale-100"
              style={{ fontFamily: 'UniCredit' }}
            >
              Send
            </button>
          </div>
        </div>
      </div>

      {showUnsavedModal && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center">
          <div className="bg-white rounded w-[400px] shadow-2xl p-6 relative">
            <h3 className="text-xl font-bold text-[#262626] text-center mb-2">
              You will lose all changes.
            </h3>
            <p className="text-center text-[#666] mb-8">
              Are you sure you want to leave?
            </p>
            <div className="flex gap-4">
              <button
                onClick={onDontSave}
                className="flex-1 py-2.5 border border-[#262626] font-bold text-[#262626] uppercase hover:bg-gray-50 rounded"
              >
                Don't save
              </button>
              <button
                onClick={onSaveDraftAndLeave}
                className="flex-1 py-2.5 bg-[#007a91] text-white font-bold uppercase hover:bg-[#006577] rounded"
              >
                Save draft
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
