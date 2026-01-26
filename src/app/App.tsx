import { useState } from 'react';
import { LeftNav } from '@/app/components/LeftNav';
import { AppHeader } from '@/app/components/AppHeader';
import { MessageListPanel } from '@/app/components/MessageListPanel';
import { ConversationPanel } from '@/app/components/ConversationPanel';
import { NewMessageDialog } from '@/app/components/NewMessageDialog';
import { AnnouncementsPanel } from '@/app/components/AnnouncementsPanel';
import { ContactsPanel } from '@/app/components/ContactsPanel';
import { ChevronRight } from 'lucide-react';
import { NewIcon } from '@/app/components/NavIcons';
import { mockMessages, Message } from '@/app/data/messagesData';

export default function App() {
  const [activeSection, setActiveSection] = useState('messages');
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>('1');
  const [isNewMessageOpen, setIsNewMessageOpen] = useState(false);
  const [isMessageListCollapsed, setIsMessageListCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Lifted state for messages
  const [messages, setMessages] = useState<Message[]>(mockMessages);

  const toggleMessageReadStatus = (id: string) => {
    setMessages(prevMessages =>
      prevMessages.map(msg => {
        if (msg.id === id) {
          // If unreadCount > 0, make it 0 (Read). If 0, make it 1 (Unread).
          return { ...msg, unreadCount: msg.unreadCount > 0 ? 0 : 1 };
        }
        return msg;
      })
    );
  };

  const selectedMessage = messages.find(m => m.id === selectedMessageId);
  const isSelectedMessageUnread = selectedMessage ? selectedMessage.unreadCount > 0 : false;

  const renderMainContent = () => {
    switch (activeSection) {
      case 'messages':
        return (
          <div className="flex-1 flex flex-col h-full">
            {/* Messages Section Header */}
            <div className="flex items-center justify-between border-b border-[#e6e6e6] bg-white" style={{ paddingLeft: '12px', paddingRight: 'calc(100% - 390px + 12px)', paddingTop: '16px', paddingBottom: '16px' }}>
              <h2 className="text-[26px] font-bold text-[#262626]">Messages</h2>

              <button
                onClick={() => setIsNewMessageOpen(true)}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-[#007a91] hover:bg-[#006577] text-white rounded transition-colors"
                style={{ fontFamily: 'UniCredit', fontSize: '14px', fontWeight: 700, lineHeight: '22px' }}
              >
                <NewIcon />
                <span>NEW</span>
              </button>
            </div>

            {/* Messages Content */}
            <div className="flex-1 relative z-0">
              <div className="absolute inset-0 flex overflow-hidden">
                <MessageListPanel
                  messages={messages}
                  selectedMessageId={selectedMessageId}
                  onSelectMessage={(id: string) => {
                    setSelectedMessageId(id);
                    setMessages((prev) =>
                      prev.map((m) =>
                        m.id === id ? { ...m, unreadCount: 0 } : m
                      )
                    );
                  }}
                  isCollapsed={isMessageListCollapsed}
                  onToggleCollapse={() => setIsMessageListCollapsed(!isMessageListCollapsed)}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  onMarkAsRead={(ids: string[]) => {
                    setMessages((prev) =>
                      prev.map((m) =>
                        ids.includes(m.id) ? { ...m, unreadCount: 0 } : m
                      )
                    );
                  }}
                  onMarkAsUnread={(ids: string[]) => {
                    setMessages((prev) =>
                      prev.map((m) =>
                        ids.includes(m.id) ? { ...m, unreadCount: 1 } : m
                      )
                    );
                  }}
                />

                <ConversationPanel
                  messageId={selectedMessageId}
                  searchQuery={searchQuery}
                  isUnread={isSelectedMessageUnread}
                  onToggleReadStatus={() => selectedMessageId && toggleMessageReadStatus(selectedMessageId)}
                  onTodoStatusChange={(id: string, hasTodo: boolean) => {
                    setMessages(prev => prev.map(m =>
                      m.id === id ? { ...m, isTodo: hasTodo } : m
                    ));
                  }}
                />

                {/* Vertical divider (inside or outside doesn't matter much for visual, putting inside to match scrolling area bounds) */}
                {isMessageListCollapsed && (
                  <div className="absolute left-0 top-0 bottom-0 w-px bg-[#e6e6e6] z-0 pointer-events-none"></div>
                )}
              </div>

              {/* Expand Button (outside overflow-hidden) */}
              {isMessageListCollapsed && (
                <button
                  onClick={() => setIsMessageListCollapsed(false)}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-[30px] h-[30px] bg-[#007a91] rounded-lg shadow-[2px_2px_7px_0_rgba(0,0,0,0.25)] hover:bg-[#006577] active:bg-[#005566] flex items-center justify-center transition-colors z-[100]"
                  title="Expand messages list"
                >
                  <ChevronRight size={16} className="text-white" />
                </button>
              )}
            </div>
          </div>
        );
      case 'announcements':
        return (
          <div className="flex-1 flex flex-col h-full">
            {/* Announcements Section Header */}
            <div className="flex items-center justify-between border-b border-[#e6e6e6] bg-white" style={{ paddingLeft: '12px', paddingRight: '12px', paddingTop: '16px', paddingBottom: '16px' }}>
              <h2 className="text-[26px] font-bold text-[#262626]">Announcements</h2>
            </div>

            {/* Announcements Content */}
            <AnnouncementsPanel />
          </div>
        );
      case 'contacts':
        return <ContactsPanel />;
      default:
        return (
          <div className="flex-1 flex items-center justify-center bg-white">
            <p className="text-[#666]">Select a section from the navigation</p>
          </div>
        );
    }
  };

  return (
    <div className="w-full h-screen flex flex-col bg-white overflow-hidden">
      <AppHeader onNewMessage={() => setIsNewMessageOpen(true)} />

      <div className="flex-1 flex overflow-hidden">
        <LeftNav
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
        {renderMainContent()}
      </div>

      <NewMessageDialog
        open={isNewMessageOpen}
        onOpenChange={setIsNewMessageOpen}
      />
    </div>
  );
}