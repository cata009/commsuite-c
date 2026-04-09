import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import AppIcon from '../../icons/AppIcon'
import AttachmentStrip from '../AttachmentStrip/AttachmentStrip'

export interface RichTextEditorAttachment {
  id: string
  name: string
  sizeLabel?: string
  extension?: string
  mimeType?: string
}

export interface RichTextEditorReply {
  sender: string
  timestamp: string
  content: string
}

export interface RichTextEditorProps {
  value: string
  onChange: (next: string) => void
  onSend: () => void
  placeholder?: string
  disabled?: boolean
  sendDisabled?: boolean
  forceToolbar?: boolean
  showSendButton?: boolean
  sendOnEnter?: boolean
  attachments?: RichTextEditorAttachment[]
  onAddAttachments: (files: FileList | File[]) => void
  onRemoveAttachment?: (id: string) => void
  uploadingAttachmentIds?: string[]
  maxLines?: number
  maxAttachmentSizeMb?: number
  replyTo?: RichTextEditorReply | null
  onCancelReply?: () => void
}

export function RichTextEditor({
  value,
  onChange,
  onSend,
  placeholder = 'Type your message...',
  disabled = false,
  sendDisabled = false,
  forceToolbar = false,
  showSendButton = true,
  sendOnEnter = true,
  attachments = [],
  onAddAttachments,
  onRemoveAttachment,
  uploadingAttachmentIds = [],
  maxLines = 5,
  replyTo = null,
  onCancelReply,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [isPreviewExpanded, setIsPreviewExpanded] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [isEmpty, setIsEmpty] = useState(true)
  const [showToolbar, setShowToolbar] = useState(false)
  const [fontSize, setFontSize] = useState('14')
  const [currentColor, setCurrentColor] = useState('#262626')
  const [isBold, setIsBold] = useState(false)
  const [isItalic, setIsItalic] = useState(false)
  const [isUnderline, setIsUnderline] = useState(false)
  const [isStrikethrough, setIsStrikethrough] = useState(false)
  const [isFontMenuOpen, setIsFontMenuOpen] = useState(false)
  const [isColorMenuOpen, setIsColorMenuOpen] = useState(false)
  const [isHighlightMenuOpen, setIsHighlightMenuOpen] = useState(false)
  const [savedSelection, setSavedSelection] = useState<Range | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const highlightMenuRef = useRef<HTMLDivElement | null>(null)
  const colorMenuRef = useRef<HTMLDivElement | null>(null)
  const fontMenuRef = useRef<HTMLDivElement | null>(null)

  const colors = useMemo(
    () => [
      '#262626',
      '#007A91',
      '#D32F2F',
      '#388E3C',
      '#F57C00',
      '#7B1FA2',
      '#000000',
      '#1976D2',
    ],
    [],
  )

  const highlightColors = useMemo(
    () => ['#FFFF00', '#00FF00', '#00FFFF', '#FF00FF', '#FF0000', '#E0E0E0', '#FFFFFF'],
    [],
  )

  const maxHeightPx = useMemo(() => {
    const lineHeight = 16
    const paddingY = 20
    return lineHeight * maxLines + paddingY
  }, [maxLines])

  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value || ''
      updateIsEmpty()
      checkActiveStyles()
    }
  }, [value])

  useLayoutEffect(() => {
    if (!editorRef.current) return
    editorRef.current.style.height = 'auto'
    const nextHeight = Math.min(editorRef.current.scrollHeight, maxHeightPx)
    editorRef.current.style.height = `${nextHeight}px`
    editorRef.current.style.overflowY =
      editorRef.current.scrollHeight > maxHeightPx ? 'auto' : 'hidden'
  }, [value, maxHeightPx])

  useEffect(() => {
    if (!isFontMenuOpen && !isColorMenuOpen && !isHighlightMenuOpen) return

    const handleMouseDown = (event: MouseEvent) => {
      const target = event.target as Node
      if (isFontMenuOpen && fontMenuRef.current && !fontMenuRef.current.contains(target)) {
        setIsFontMenuOpen(false)
      }
      if (isColorMenuOpen && colorMenuRef.current && !colorMenuRef.current.contains(target)) {
        setIsColorMenuOpen(false)
      }
      if (
        isHighlightMenuOpen &&
        highlightMenuRef.current &&
        !highlightMenuRef.current.contains(target)
      ) {
        setIsHighlightMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleMouseDown)
    return () => {
      document.removeEventListener('mousedown', handleMouseDown)
    }
  }, [isFontMenuOpen, isColorMenuOpen, isHighlightMenuOpen])

  useEffect(() => {
    if (forceToolbar) {
      setShowToolbar(true)
    }
  }, [forceToolbar])

  const updateIsEmpty = () => {
    if (!editorRef.current) {
      setIsEmpty(!value)
      return
    }
    const html = editorRef.current.innerHTML || ''
    const text = editorRef.current.innerText || ''
    setIsEmpty(!html || html === '<br>' || html === '<div><br></div>' || text.trim() === '')
  }

  const ensureCssMode = () => {
    document.execCommand('styleWithCSS', false, 'true')
  }

  const saveSelection = () => {
    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0) {
      setSavedSelection(selection.getRangeAt(0).cloneRange())
    } else {
      setSavedSelection(null)
    }
  }

  const restoreSelection = () => {
    if (!savedSelection) return
    const selection = window.getSelection()
    if (selection) {
      selection.removeAllRanges()
      selection.addRange(savedSelection)
    }
  }

  const checkActiveStyles = () => {
    setIsBold(document.queryCommandState('bold'))
    setIsItalic(document.queryCommandState('italic'))
    setIsUnderline(document.queryCommandState('underline'))
    setIsStrikethrough(document.queryCommandState('strikeThrough'))
  }

  const updateState = () => {
    checkActiveStyles()
    const currentSize = document.queryCommandValue('fontSize')
    if (currentSize && currentSize.indexOf('px') !== -1) {
      const size = currentSize.replace('px', '')
      if (!Number.isNaN(parseInt(size))) {
        setFontSize(size)
      }
    }
  }

  const sanitize = () => {
    if (!editorRef.current) return
    const fontTags = editorRef.current.getElementsByTagName('font')
    for (let i = 0; i < fontTags.length; i += 1) {
      const font = fontTags[i]
      if (font.size === '7' || font.getAttribute('size') === '7') {
        font.removeAttribute('size')
        font.style.fontSize = `${fontSize}px`
        font.style.lineHeight = `${parseInt(fontSize, 10) + 4}px`
      }
    }

    const spans = editorRef.current.getElementsByTagName('span')
    for (let i = 0; i < spans.length; i += 1) {
      const span = spans[i]
      if (
        span.style.fontSize === 'xxx-large' ||
        span.style.fontSize === '48px' ||
        (span.style.fontSize &&
          fontSize !== '14' &&
          span.style.fontSize.includes(fontSize))
      ) {
        span.style.fontSize = `${fontSize}px`
        span.style.lineHeight = `${parseInt(fontSize, 10) + 4}px`
      }
    }
  }

  const execCommand = (command: string, commandValue: string | null = null) => {
    ensureCssMode()
    document.execCommand(command, false, commandValue ?? undefined)
    checkActiveStyles()
    updateState()
    handleInput()
  }

  const handleInput = () => {
    if (!editorRef.current) return
    sanitize()
    onChange(editorRef.current.innerHTML)
    checkActiveStyles()
    updateIsEmpty()
    updateState()
  }

  const handleFocus = () => {
    setIsFocused(true)
    setShowToolbar(true)
    ensureCssMode()
    checkActiveStyles()
    updateState()
  }

  const handleBlur = () => {
    setTimeout(() => {
      if (!isFontMenuOpen && !isColorMenuOpen) {
        setIsFocused(false)
      }
    }, 200)
  }

  const shouldShowReadMore = (content?: string) => {
    if (!content) return false
    return content.length > 150 || content.includes('<br>') || content.includes('</div>')
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      if (sendOnEnter) {
        event.preventDefault()
        if (!sendDisabled) onSend()
      }
    }
  }

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      if (text) {
        execCommand('insertText', text)
      }
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err)
    }
  }

  const handleFontMenuToggle = (event: React.MouseEvent) => {
    event.stopPropagation()
    if (!isFontMenuOpen) {
      saveSelection()
      setIsFontMenuOpen(true)
    } else {
      setIsFontMenuOpen(false)
    }
    setIsColorMenuOpen(false)
    setIsHighlightMenuOpen(false)
  }

  const handleColorMenuToggle = (event: React.MouseEvent) => {
    event.stopPropagation()
    saveSelection()
    setIsColorMenuOpen(!isColorMenuOpen)
    setIsFontMenuOpen(false)
    setIsHighlightMenuOpen(false)
  }

  const handleHighlightMenuToggle = (event: React.MouseEvent) => {
    event.stopPropagation()
    saveSelection()
    setIsHighlightMenuOpen(!isHighlightMenuOpen)
    setIsColorMenuOpen(false)
    setIsFontMenuOpen(false)
  }

  const handleTextColor = (color: string) => {
    setCurrentColor(color)
    ensureCssMode()
    if (editorRef.current) editorRef.current.focus()
    restoreSelection()
    document.execCommand('foreColor', false, color)
    sanitize()
    handleInput()
  }

  const handleHighlightColor = (color: string) => {
    restoreSelection()
    execCommand('hiliteColor', color)
    setIsHighlightMenuOpen(false)
  }

  const handleFontSize = (size: string) => {
    setFontSize(size)
    ensureCssMode()
    if (editorRef.current) editorRef.current.focus()
    restoreSelection()
    document.execCommand('fontSize', false, '7')
    sanitize()
    handleInput()
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setIsDragging(false)
    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      onAddAttachments(event.dataTransfer.files)
    }
  }

  return (
    <div className="p-4 pt-2">
      <div className="flex items-end gap-3 translate-y-[-2px]">
        <div className="flex-1 flex flex-col gap-3 min-w-0">
          <div
            className="relative flex flex-col border border-unicredit-gray-divider rounded-md bg-white shadow-sm w-full"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={(event) => {
                if (event.target.files) {
                  onAddAttachments(event.target.files)
                  event.currentTarget.value = ''
                }
              }}
            />

            {isDragging && (
              <div
                className="absolute inset-0 z-50 bg-white/90 flex flex-col items-center justify-center border-2 border-dashed border-[#007a91] m-2 rounded"
                onDragOver={(event) => {
                  event.preventDefault()
                  event.stopPropagation()
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
              >
                <AppIcon
                  name="upload"
                  size={48}
                  className="text-[#007a91] mb-2 pointer-events-none"
                />
                <span className="text-[#007a91] font-bold text-lg pointer-events-none">
                  Drop your files here
                </span>
              </div>
            )}

            {replyTo && (
              <div className="mx-4 mt-4 mb-0 p-4 flex flex-col gap-2 rounded bg-unicredit-primary-light border border-unicredit-primary relative group/reply min-w-0">
                <div className="flex items-start justify-between min-w-0">
                  <div className="flex-1 min-w-0 pr-10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-unicredit-text text-sm font-bold">
                        {replyTo.sender}
                      </span>
                      <span className="text-unicredit-text-secondary text-xs">
                        {replyTo.timestamp}
                      </span>
                    </div>
                    <div
                      className={`text-unicredit-text text-sm opacity-90 break-words whitespace-pre-wrap transition-all duration-300 composer-scrollbar ${
                        isPreviewExpanded ? '' : 'line-clamp-2'
                      }`}
                      style={{
                        overflowWrap: 'anywhere',
                        maxHeight: isPreviewExpanded ? '150px' : '40px',
                        overflowY: isPreviewExpanded ? 'auto' : 'hidden',
                      }}
                      dangerouslySetInnerHTML={{ __html: replyTo.content }}
                    />
                  </div>
                  <button
                    onClick={() => {
                      setIsPreviewExpanded(false)
                      if (onCancelReply) onCancelReply()
                    }}
                    className="text-unicredit-primary hover:text-unicredit-primary-hover transition-colors p-0.5 absolute top-4 right-4 z-10"
                  >
                    <AppIcon name="close" size={20} />
                  </button>
                </div>
                {shouldShowReadMore(replyTo.content) && (
                  <button
                    onClick={() => setIsPreviewExpanded(!isPreviewExpanded)}
                    className="flex items-center gap-1 text-unicredit-primary text-xs font-bold uppercase mt-1 self-end hover:opacity-80 transition-opacity"
                  >
                    <AppIcon name="read-more" size={16} />
                    {isPreviewExpanded ? 'Read Less' : 'Read More'}
                  </button>
                )}
              </div>
            )}

            {(showToolbar || !isEmpty) && (
              <div className="flex items-center gap-1 px-3 py-2 border-b border-unicredit-gray bg-white">
            <button
            onClick={() => execCommand('bold')}
            className={`px-2 py-1 hover:bg-unicredit-gray-lighter rounded transition-colors text-unicredit-text ${
              isBold ? 'bg-unicredit-primary-light text-unicredit-primary' : ''
            }`}
            title="Bold"
          >
            <AppIcon name="bold-rt" size={12} />
          </button>

          <button
            onClick={() => execCommand('italic')}
            className={`px-2 py-1 hover:bg-unicredit-gray-lighter rounded transition-colors text-unicredit-text ${
              isItalic ? 'bg-unicredit-primary-light text-unicredit-primary' : ''
            }`}
            title="Italic"
          >
            <AppIcon name="italic-rt" size={12} />
          </button>

          <button
            onClick={() => execCommand('underline')}
            className={`px-2 py-1 hover:bg-unicredit-gray-lighter rounded transition-colors text-unicredit-text ${
              isUnderline ? 'bg-unicredit-primary-light text-unicredit-primary' : ''
            }`}
            title="Underline"
          >
            <AppIcon name="underline-rt" size={15} />
          </button>

          <button
            onClick={() => execCommand('strikeThrough')}
            className={`px-2 py-1 hover:bg-unicredit-gray-lighter rounded transition-colors text-unicredit-text ${
              isStrikethrough ? 'bg-unicredit-primary-light text-unicredit-primary' : ''
            }`}
            title="Strikethrough"
          >
            <AppIcon name="strikethrough" size={20} />
          </button>

          <div className="w-px h-5 bg-unicredit-gray-divider mx-1"></div>

          <button
            onClick={() => execCommand('insertUnorderedList')}
            className="p-1.5 hover:bg-unicredit-gray-lighter rounded transition-colors text-unicredit-text"
            title="Bullet list"
          >
            <AppIcon name="list-bullets" size={20} />
          </button>

          <button
            onClick={() => execCommand('insertOrderedList')}
            className="p-1.5 hover:bg-unicredit-gray-lighter rounded transition-colors text-unicredit-text"
            title="Numbered list"
          >
            <AppIcon name="list-ordered" size={20} />
          </button>

          <div className="w-px h-5 bg-unicredit-gray-divider mx-1"></div>

          <div className="relative group" ref={highlightMenuRef}>
            <button
              onClick={handleHighlightMenuToggle}
              className="flex items-center gap-0.5 p-1.5 hover:bg-unicredit-gray-lighter rounded transition-colors text-unicredit-text"
              title="Highlight color"
            >
              <AppIcon name="highlighter" size={18} />
              <AppIcon name="caret-down-filled" size={16} />
            </button>
            {isHighlightMenuOpen && (
              <div className="absolute bottom-full mb-2 left-0 bg-white border border-unicredit-gray shadow-xl rounded-[4px] z-50 min-w-[124px] p-2 grid grid-cols-4 gap-1 transition-all duration-200">
                {highlightColors.map((color) => (
                  <div
                    key={color}
                    onClick={() => handleHighlightColor(color)}
                    className="w-6 h-6 rounded-sm cursor-pointer border border-black/10 hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="relative" ref={colorMenuRef}>
            <button
              onClick={handleColorMenuToggle}
              className="p-1.5 hover:bg-unicredit-gray-lighter rounded transition-colors h-8 flex items-center justify-center"
              title="Text color"
            >
              <div
                className="w-[18px] h-[18px] rounded-sm border border-unicredit-gray-divider"
                style={{ backgroundColor: currentColor }}
              />
            </button>
            {isColorMenuOpen && (
              <div className="absolute bottom-full mb-2 left-0 bg-white border border-unicredit-gray shadow-xl rounded-[4px] z-50 min-w-[124px] p-2 grid grid-cols-4 gap-1 transition-all duration-200">
                {colors.map((color) => (
                  <div
                    key={color}
                    onClick={() => handleTextColor(color)}
                    className="w-6 h-6 rounded-sm cursor-pointer border border-black/10 hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="relative" ref={fontMenuRef}>
            <button
              onClick={handleFontMenuToggle}
              className="flex items-center gap-1 px-2 py-1 hover:bg-unicredit-gray-lighter rounded text-sm cursor-pointer transition-colors outline-none h-8"
            >
              <span className="text-unicredit-text font-medium min-w-[20px]">{fontSize}</span>
              <AppIcon name="caret-down-filled" size={16} />
            </button>
            {isFontMenuOpen && (
              <div className="absolute bottom-full mb-2 left-0 bg-white border border-unicredit-gray shadow-xl rounded-[4px] z-50 min-w-[80px] p-1 transition-all duration-200">
                {['14', '16', '18', '20'].map((size) => (
                  <div
                    key={size}
                    onClick={() => handleFontSize(size)}
                    className="px-3 py-1.5 hover:bg-unicredit-primary-light cursor-pointer text-sm text-unicredit-text rounded-sm transition-colors"
                  >
                    {size}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="w-px h-5 bg-unicredit-gray-divider mx-1"></div>

          <button
            onClick={handlePaste}
            className="p-1.5 hover:bg-unicredit-gray-lighter rounded transition-colors text-unicredit-text"
            title="Paste"
          >
            <AppIcon name="paste-filled" size={20} />
          </button>

          <button
            className="p-1.5 hover:bg-unicredit-gray-lighter rounded transition-colors text-unicredit-text"
            title="Insert link"
          >
            <AppIcon name="link" size={20} />
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-1.5 hover:bg-unicredit-gray-lighter rounded transition-colors text-unicredit-text"
            title="Attach"
          >
            <AppIcon name="attach" size={20} />
          </button>

          <div className="relative group">
            <button
              className="flex items-center gap-0.5 p-1.5 hover:bg-unicredit-gray-lighter rounded transition-colors text-unicredit-text h-8"
              title="Signature selection"
            >
              <AppIcon name="signature" size={23} />
              <AppIcon name="caret-down-filled" size={16} />
            </button>
          </div>
        </div>
      )}

            <div
              ref={editorRef}
              contentEditable={!disabled}
              className="w-full px-4 py-[10px] bg-white focus:outline-none transition-all duration-300 ease-in-out composer-scrollbar overflow-y-auto rich-text-content break-words whitespace-pre-wrap"
              style={{
                minHeight: showToolbar ? '100px' : '44px',
                maxHeight: `${maxHeightPx}px`,
                fontSize: '14px',
                lineHeight: '16px',
              }}
              onInput={handleInput}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              onKeyUp={updateState}
              onMouseUp={updateState}
              suppressContentEditableWarning
            />

            {isEmpty && !isFocused && !replyTo && (
              <div
                className="absolute left-4 text-unicredit-text-secondary pointer-events-none select-none z-10"
                style={{ top: showToolbar ? '52px' : '10px' }}
              >
                {placeholder}
              </div>
            )}
          </div>

          {attachments.length > 0 && (
            <AttachmentStrip
              attachments={attachments}
              showActions={false}
              showRemove={!!onRemoveAttachment}
              onRemove={onRemoveAttachment}
              uploadingIds={uploadingAttachmentIds}
              maxVisible={2}
            />
          )}
        </div>

        {showSendButton && (
          <button
            onClick={onSend}
            disabled={disabled || sendDisabled}
            className={`w-11 h-11 rounded-full bg-[#007a91] hover:bg-[#006577] flex items-center justify-center transition-all duration-200 ease-out shrink-0 mb-[2px] active:scale-95 shadow-md hover:shadow-lg ${
              disabled || sendDisabled ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <AppIcon name="send" size={20} className="text-white" />
          </button>
        )}
      </div>
    </div>
  )
}

export default RichTextEditor
