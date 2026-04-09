import DropdownMenu from '../../shared/DropdownMenu'
import AppIcon from '../../../shared/icons/AppIcon'
import type { ConversationMessage } from '../../core/models'

export interface TodoMessageCardProps {
  message: ConversationMessage
  onViewInChat: (id: string) => void
  onUnmarkTodo: (id: string) => void
}

export default function TodoMessageCard({ message, onViewInChat, onUnmarkTodo }: TodoMessageCardProps) {
  const getTextContent = (html: string) => html.replace(/<[^>]*>/g, '')

  return (
    <div
      className="flex items-center gap-3 px-3 py-2 rounded border border-[#007A91] bg-[#E7F8FB] cursor-pointer hover:bg-[#d4f1f6] transition-colors min-w-0"
      style={{ borderRadius: '4px' }}
      onClick={() => onViewInChat(message.id)}
    >
      <div className="shrink-0 text-[#262626]">
        <AppIcon name="todo" size={14} />
      </div>

      <span
        className="shrink-0 text-[#262626] uppercase font-bold"
        style={{ fontFamily: 'UniCredit, sans-serif', fontSize: '14px', fontWeight: 700, lineHeight: '16px' }}
      >
        {message.sender}
      </span>

      <span
        className="flex-1 truncate text-[#262626]"
        style={{ fontFamily: 'UniCredit, sans-serif', fontSize: '14px', fontWeight: 400, lineHeight: '16px' }}
        title={getTextContent(message.content)}
      >
        {getTextContent(message.content)}
      </span>

      <span
        className="shrink-0 text-[#262626]"
        style={{ fontFamily: 'UniCredit, sans-serif', fontSize: '14px', fontWeight: 400, lineHeight: '16px' }}
      >
        {message.timestamp}
      </span>

      <DropdownMenu
        trigger={
          <button
            className="shrink-0 p-1 transition-colors flex items-center justify-center hover:text-[#007a91] text-[#262626]"
            onClick={(event) => event.stopPropagation()}
          >
            <AppIcon name="more-horizontal" size={16} />
          </button>
        }
      >
        <div className="flex flex-col">
          <button
            className="flex items-center gap-2 px-3 py-3 cursor-pointer outline-none hover:bg-gray-50 text-left w-full"
            onClick={() => onViewInChat(message.id)}
          >
            <AppIcon name="preview" size={16} />
            <span
              className="uppercase font-bold text-[#262626]"
              style={{ fontFamily: 'UniCredit, sans-serif', fontSize: '14px', fontWeight: 700 }}
            >
              View in Chat
            </span>
          </button>

          <button
            className="flex items-center gap-2 px-3 py-3 cursor-pointer outline-none hover:bg-gray-50 text-left w-full"
            onClick={() => onUnmarkTodo(message.id)}
          >
            <div className="text-[#262626]">
              <AppIcon name="todo" size={14} />
            </div>
            <span
              className="uppercase font-bold text-[#262626]"
              style={{ fontFamily: 'UniCredit, sans-serif', fontSize: '14px', fontWeight: 700 }}
            >
              Unmark as To-Do
            </span>
          </button>
        </div>
      </DropdownMenu>
    </div>
  )
}
