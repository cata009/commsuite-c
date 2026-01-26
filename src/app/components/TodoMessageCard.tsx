import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { TodoIcon } from './NavIcons';
import { CustomTooltip } from './CustomTooltip';
import { ConversationMessage } from '../data/conversationsData';

interface TodoMessageCardProps {
  message: ConversationMessage;
  onViewInChat: (messageId: string) => void;
  onUnmarkTodo: (messageId: string) => void;
}

/**
 * Single todo message card displayed in the pinned section
 */
function TodoMessageCard({ message, onViewInChat, onUnmarkTodo }: TodoMessageCardProps) {
  return (
    <div
      className="flex items-center gap-3 px-3 py-2 rounded border border-[#007A91] bg-[#E7F8FB] cursor-pointer hover:bg-[#d4f1f6] transition-colors min-w-0"
      style={{ borderRadius: '4px' }}
      onClick={() => onViewInChat(message.id)}
    >
      {/* Todo Icon */}
      <div className="shrink-0 text-[#262626]">
        <TodoIcon />
      </div>

      {/* Sender Name */}
      <span
        className="shrink-0 text-[#262626] uppercase font-bold"
        style={{
          fontFamily: 'UniCredit, sans-serif',
          fontSize: '14px',
          fontWeight: 700,
          lineHeight: '16px',
        }}
      >
        {message.sender}
      </span>

      {/* Message Content - truncated */}
      <CustomTooltip content={message.content.replace(/<[^>]*>/g, '')} side="bottom" align="start">
        <span
          className="flex-1 truncate text-[#262626]"
          style={{
            fontFamily: 'UniCredit, sans-serif',
            fontSize: '14px',
            fontWeight: 400,
            lineHeight: '16px',
          }}
        >
          {message.content.replace(/<[^>]*>/g, '')}
        </span>
      </CustomTooltip>

      {/* Timestamp */}
      <span
        className="shrink-0 text-[#262626]"
        style={{
          fontFamily: 'UniCredit, sans-serif',
          fontSize: '14px',
          fontWeight: 400,
          lineHeight: '16px',
        }}
      >
        {message.timestamp}
      </span>

      {/* More Options */}
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button
            className="shrink-0 p-1 hover:bg-[#c8ecf3] rounded transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="3" cy="8" r="1.5" fill="#262626" />
              <circle cx="8" cy="8" r="1.5" fill="#262626" />
              <circle cx="13" cy="8" r="1.5" fill="#262626" />
            </svg>
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            className="bg-white rounded shadow-lg border border-[#262626] min-w-[200px] z-50"
            align="end"
            sideOffset={5}
            onClick={(e) => e.stopPropagation()}
          >
            {/* View in Chat */}
            <DropdownMenu.Item
              className="flex items-center gap-2 px-3 py-3 cursor-pointer outline-none hover:bg-gray-50"
              onSelect={() => onViewInChat(message.id)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 3C4.36364 3 1.25818 5.28 0 8.5C1.25818 11.72 4.36364 14 8 14C11.6364 14 14.7418 11.72 16 8.5C14.7418 5.28 11.6364 3 8 3ZM8 12.1667C5.98182 12.1667 4.36364 10.5233 4.36364 8.5C4.36364 6.47667 5.98182 4.83333 8 4.83333C10.0182 4.83333 11.6364 6.47667 11.6364 8.5C11.6364 10.5233 10.0182 12.1667 8 12.1667ZM8 6.3C6.78545 6.3 5.81818 7.28 5.81818 8.5C5.81818 9.72 6.78545 10.7 8 10.7C9.21455 10.7 10.1818 9.72 10.1818 8.5C10.1818 7.28 9.21455 6.3 8 6.3Z" fill="#262626" />
              </svg>
              <span
                className="uppercase font-bold text-[#262626]"
                style={{
                  fontFamily: 'UniCredit, sans-serif',
                  fontSize: '14px',
                  fontWeight: 700,
                }}
              >
                View in Chat
              </span>
            </DropdownMenu.Item>

            {/* Unmark as To-Do */}
            <DropdownMenu.Item
              className="flex items-center gap-2 px-3 py-3 cursor-pointer outline-none hover:bg-gray-50"
              onSelect={() => onUnmarkTodo(message.id)}
            >
              <div className="text-[#262626]">
                <TodoIcon />
              </div>
              <span
                className="uppercase font-bold text-[#262626]"
                style={{
                  fontFamily: 'UniCredit, sans-serif',
                  fontSize: '14px',
                  fontWeight: 700,
                }}
              >
                Unmark as To-Do
              </span>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  );
}

interface TodoMessagesSectionProps {
  todoMessages: ConversationMessage[];
  onViewInChat: (messageId: string) => void;
  onUnmarkTodo: (messageId: string) => void;
}

/**
 * Section that displays pinned todo messages in the conversation header
 * Shows 1 message by default, with expand/collapse for more
 */
export function TodoMessagesSection({ todoMessages, onViewInChat, onUnmarkTodo }: TodoMessagesSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (todoMessages.length === 0) {
    return null;
  }

  const hasMore = todoMessages.length > 1;

  return (
    <div className="flex flex-col gap-2 w-full">
      {/* Container for the first message and the expand button */}
      <div className="flex items-center gap-2 w-full">
        <div className="flex-1 min-w-0">
          <TodoMessageCard
            message={todoMessages[0]}
            onViewInChat={onViewInChat}
            onUnmarkTodo={onUnmarkTodo}
          />
        </div>

        {/* Expand/Collapse Button with Counter - on the right */}
        {hasMore && (
          <button
            className="flex items-center gap-1 text-[#007A91] hover:opacity-80 transition-opacity shrink-0"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <span
              className="font-bold uppercase"
              style={{
                fontFamily: 'UniCredit, sans-serif',
                fontSize: '14px',
                fontWeight: 700,
                fontFeatureSettings: "'liga' off, 'clig' off"
              }}
            >
              {todoMessages.length}
            </span>
            {isExpanded ? (
              <ChevronUp size={16} className="text-[#007A91]" />
            ) : (
              <ChevronDown size={16} className="text-[#007A91]" />
            )}
          </button>
        )}
      </div>

      {/* Expanded Messages */}
      {isExpanded && hasMore && (
        <div className="flex flex-col gap-2 w-full">
          {todoMessages.slice(1).map((message) => (
            <div key={message.id} className="pr-[36px] w-full"> {/* Match the width of the expand button approx */}
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
  );
}
