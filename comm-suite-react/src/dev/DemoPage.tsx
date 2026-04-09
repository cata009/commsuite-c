import { useState } from 'react'
import ListHeader from '../shared/components/ListHeader/ListHeader'
import AttachmentStrip from '../shared/components/AttachmentStrip/AttachmentStrip'
import RecipientPicker from '../shared/components/RecipientPicker/RecipientPicker'
import RichTextEditor from '../shared/components/RichTextEditor/RichTextEditor'

export default function DemoPage() {
  const [searchValue, setSearchValue] = useState('')
  const [selectedFolderId, setSelectedFolderId] = useState('inbox')

  const folders = [
    { id: 'inbox', label: 'Inbox' },
    { id: 'all', label: 'All folders' },
    { id: 'drafts', label: 'Drafts' },
    { id: 'deleted', label: 'Deleted' },
  ]

  const attachments = [
    {
      id: 'att-1',
      name: 'Investment_Report_Q1.pdf',
      sizeLabel: '2.3 MB',
      extension: 'pdf',
    },
    {
      id: 'att-2',
      name: 'Portfolio_Snapshot.png',
      sizeLabel: '850 KB',
      extension: 'png',
      mimeType: 'image/png',
    },
    {
      id: 'att-3',
      name: 'Risk_Assessment.xlsx',
      sizeLabel: '1.1 MB',
      extension: 'xlsx',
    },
    {
      id: 'att-4',
      name: 'Client_Brief.docx',
      sizeLabel: '420 KB',
      extension: 'docx',
    },
    {
      id: 'att-5',
      name: 'Onboarding_Checklist.pdf',
      sizeLabel: '310 KB',
      extension: 'pdf',
    },
  ]

  const [isRecipientPickerOpen, setIsRecipientPickerOpen] = useState(false)
  const [selectedRecipientIds, setSelectedRecipientIds] = useState<string[]>(['rec-2', 'rec-5'])
  const [composerValue, setComposerValue] = useState('')
  const [composerAttachments, setComposerAttachments] = useState<
    {
      id: string
      name: string
      sizeLabel?: string
      extension?: string
      mimeType?: string
    }[]
  >([])

  const recipients = [
    { id: 'rec-1', name: 'Anna Ionescu', role: 'Client' },
    { id: 'rec-2', name: 'Radu Popescu', role: 'Banker' },
    { id: 'rec-3', name: 'Mihai Dumitru', role: 'Client' },
    { id: 'rec-4', name: 'Elena Marinescu', role: 'Client' },
    {
      id: 'rec-5',
      name: 'Sonia Istrate',
      role: 'Banker',
      isOutOfOffice: true,
      outOfOfficeReturnDate: '12 Mar',
    },
    { id: 'rec-6', name: 'Vlad Enache', role: 'Client' },
    { id: 'rec-7', name: 'Ioana Petrescu', role: 'Client' },
    { id: 'rec-8', name: 'Gabriel Tudor', role: 'Banker' },
    { id: 'rec-9', name: 'Cristina Ilie', role: 'Client' },
    { id: 'rec-10', name: 'Andrei Munteanu', role: 'Client' },
    { id: 'rec-11', name: 'Larisa Pop', role: 'Banker' },
    { id: 'rec-12', name: 'Oana Serban', role: 'Client' },
  ]

  const formatSize = (size: number) => {
    if (!size) return '0 B'
    const units = ['B', 'KB', 'MB', 'GB']
    const index = Math.min(Math.floor(Math.log(size) / Math.log(1024)), units.length - 1)
    const value = size / Math.pow(1024, index)
    return `${value.toFixed(index === 0 ? 0 : 1)} ${units[index]}`
  }

  return (
    <div className="p-6 flex flex-col gap-6">
      <ListHeader
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        filterCount={0}
        folders={folders}
        selectedFolderId={selectedFolderId}
        onFolderChange={setSelectedFolderId}
        folderUnreadCount={12}
        folderTotalCount={34}
      />
      <ListHeader
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        filterCount={3}
        folders={folders}
        selectedFolderId={selectedFolderId}
        onFolderChange={setSelectedFolderId}
        folderUnreadCount={12}
        folderTotalCount={34}
      />
      <AttachmentStrip attachments={attachments.slice(0, 1)} />
      <AttachmentStrip attachments={attachments.slice(0, 2)} maxVisible={2} />
      <AttachmentStrip attachments={attachments} maxVisible={2} />
      <AttachmentStrip attachments={attachments.slice(0, 2)} showRemove />
      <div className="flex flex-col gap-3">
        <button className="btn-secondary w-fit" onClick={() => setIsRecipientPickerOpen(true)}>
          Open Recipient Picker
        </button>
        <div className="text-sm text-unicredit-text">Selected: {selectedRecipientIds.join(', ')}</div>
        <RecipientPicker
          isOpen={isRecipientPickerOpen}
          onOpenChange={setIsRecipientPickerOpen}
          recipients={recipients}
          selectedIds={selectedRecipientIds}
          onApply={(next) => {
            setSelectedRecipientIds(next)
            setIsRecipientPickerOpen(false)
          }}
          onCancel={() => setIsRecipientPickerOpen(false)}
        />
      </div>
      <div className="flex flex-col gap-3">
        <div className="text-sm text-unicredit-text">
          Tip: add multiple lines to see auto-grow (max 5 lines) + scrollbar.
        </div>
        <RichTextEditor
          value={composerValue}
          onChange={setComposerValue}
          onSend={() => {
            console.log('Send payload', {
              value: composerValue,
              attachments: composerAttachments,
            })
            setComposerValue('')
            setComposerAttachments([])
          }}
          placeholder="Type your message or drag a document"
          attachments={composerAttachments}
          onAddAttachments={(files) => {
            const list = Array.from(files)
            setComposerAttachments((prev) => [
              ...prev,
              ...list.map((file) => ({
                id: `att-${Date.now()}-${file.name}`,
                name: file.name,
                sizeLabel: formatSize(file.size),
                extension: file.name.split('.').pop()?.toUpperCase(),
                mimeType: file.type,
              })),
            ])
          }}
          onRemoveAttachment={(id) => {
            setComposerAttachments((prev) => prev.filter((att) => att.id !== id))
          }}
        />
      </div>
    </div>
  )
}
