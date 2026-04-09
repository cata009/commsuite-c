import { useState } from 'react'
import AppIcon from '../../../shared/icons/AppIcon'
import type { ConversationMessage } from '../../core/models'
import TodoMessageCard from './TodoMessageCard'

export interface TodoMessagesSectionProps {
  todoMessages: ConversationMessage[]
  onViewInChat: (id: string) => void
  onUnmarkTodo: (id: string) => void
}

export default function TodoMessagesSection({
  todoMessages,
  onViewInChat,
  onUnmarkTodo,
}: TodoMessagesSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (todoMessages.length === 0) return null

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex items-center gap-2 w-full">
        <div className="flex-1 min-w-0">
          <TodoMessageCard
            message={todoMessages[0]}
            onViewInChat={onViewInChat}
            onUnmarkTodo={onUnmarkTodo}
          />
        </div>

        {todoMessages.length > 1 && (
          <button
            className="flex items-center gap-1 text-[#007A91] hover:opacity-80 transition-opacity shrink-0 outline-none"
            onClick={() => setIsExpanded((prev) => !prev)}
          >
            <span
              className="font-bold uppercase"
              style={{
                fontFamily: 'UniCredit, sans-serif',
                fontSize: '14px',
                fontWeight: 700,
                fontFeatureSettings: "'liga' off, 'clig' off",
              }}
            >
              {todoMessages.length}
            </span>
            <AppIcon name={isExpanded ? 'chevron-up' : 'chevron-down'} size={16} className="text-[#007A91]" />
          </button>
        )}
      </div>

      {isExpanded && todoMessages.length > 1 && (
        <div className="flex flex-col gap-2 w-full">
          {todoMessages.slice(1).map((message) => (
            <div key={message.id} className="pr-[36px] w-full">
              <TodoMessageCard
                message={message}
                onViewInChat={onViewInChat}
                onUnmarkTodo={onUnmarkTodo}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
