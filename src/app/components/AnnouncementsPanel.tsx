import { useState } from 'react';
import { AnnouncementsListPanel } from '@/app/components/AnnouncementsListPanel';
import { AnnouncementDetailPanel } from '@/app/components/AnnouncementDetailPanel';
import { ChevronRight } from 'lucide-react';
import { announcementsData, AnnouncementItem } from '@/app/data/announcementsData';

export function AnnouncementsPanel() {
  const [selectedAnnouncementId, setSelectedAnnouncementId] = useState<string | null>('1');
  const [isListCollapsed, setIsListCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Lifted state for announcements
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>(announcementsData);

  const toggleAnnouncementReadStatus = (id: string) => {
    setAnnouncements(prev =>
      prev.map(item =>
        item.id === id ? { ...item, isRead: !item.isRead } : item
      )
    );
  };

  const toggleTodo = (id: string) => {
    setAnnouncements(prev =>
      prev.map(item =>
        item.id === id ? { ...item, hasTodo: !item.hasTodo } : item
      )
    );
  };

  const deleteAnnouncement = (id: string | string[]) => {
    const idsToDelete = Array.isArray(id) ? id : [id];

    setAnnouncements(prev => {
      let nextAnnouncements = [...prev];

      idsToDelete.forEach(itemId => {
        const itemIndex = nextAnnouncements.findIndex(a => a.id === itemId);
        if (itemIndex !== -1) {
          const item = nextAnnouncements[itemIndex];
          if (item.folder !== 'Deleted') {
            // Move to Deleted
            nextAnnouncements[itemIndex] = { ...item, folder: 'Deleted' };
          } else {
            // Permanently remove if already in Deleted
            nextAnnouncements = nextAnnouncements.filter(a => a.id !== itemId);
          }
        }
      });
      return nextAnnouncements;
    });

    // If currently selected is deleted, deselect
    if (idsToDelete.includes(selectedAnnouncementId || '')) {
      setSelectedAnnouncementId(null);
    }
  };

  const selectedAnnouncement = announcements.find(a => a.id === selectedAnnouncementId);
  const isSelectedAnnouncementRead = selectedAnnouncement ? selectedAnnouncement.isRead : true;

  return (
    <div className="flex-1 relative h-full z-0">
      <div className="absolute inset-0 flex overflow-hidden">
        <AnnouncementsListPanel
          announcements={announcements}
          selectedAnnouncementId={selectedAnnouncementId}
          onSelectAnnouncement={(id) => {
            setSelectedAnnouncementId(id);
            setAnnouncements((prev) =>
              prev.map((a) => (a.id === id ? { ...a, isRead: true } : a))
            );
          }}
          isCollapsed={isListCollapsed}
          onToggleCollapse={() => setIsListCollapsed(!isListCollapsed)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onToggleTodo={toggleTodo}
          onDeleteAnnouncement={deleteAnnouncement}
        />

        <AnnouncementDetailPanel
          announcementId={selectedAnnouncementId}
          searchQuery={searchQuery}
          announcement={selectedAnnouncement || null}
          onToggleReadStatus={() => selectedAnnouncementId && toggleAnnouncementReadStatus(selectedAnnouncementId)}
          onToggleTodo={() => selectedAnnouncementId && toggleTodo(selectedAnnouncementId)}
          onDeleteAnnouncement={() => selectedAnnouncementId && deleteAnnouncement(selectedAnnouncementId)}
        />

        {isListCollapsed && (
          <div className="absolute left-0 top-0 bottom-0 w-px bg-[#e6e6e6] z-0 pointer-events-none"></div>
        )}
      </div>

      {/* Expand Button (when collapsed) - on vertical divider */}
      {isListCollapsed && (
        <button
          onClick={() => setIsListCollapsed(false)}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-[30px] h-[30px] bg-[#007a91] rounded-lg shadow-[2px_2px_7px_0_rgba(0,0,0,0.25)] hover:bg-[#006577] active:bg-[#005566] flex items-center justify-center transition-colors z-[100]"
          title="Expand announcements list"
        >
          <ChevronRight size={16} className="text-white" />
        </button>
      )}
    </div>
  );
}
