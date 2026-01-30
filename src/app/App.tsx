import { useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { LeftNav } from '@/app/components/LeftNav';
import { AppHeader } from '@/app/components/AppHeader';
import { MessagesSection } from '@/app/components/MessagesSection';
import { NewMessageDialog } from '@/app/components/NewMessageDialog';
import { AnnouncementsPanel } from '@/app/components/AnnouncementsPanel';
import { ContactsPanel } from '@/app/components/ContactsPanel';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const activeSection = location.pathname.split('/')[1] || 'messages';

  const [isNewMessageOpen, setIsNewMessageOpen] = useState(false);

  // Lifted state for drafts (shared global state makes sense)
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  return (
    <div className="w-full h-screen flex flex-col bg-white overflow-hidden">
      <AppHeader onNewMessage={() => setIsNewMessageOpen(true)} />

      <div className="flex-1 flex overflow-hidden">
        <LeftNav
          activeSection={activeSection}
          onSectionChange={(section: string) => navigate(`/${section}`)}
        />
        <Routes>
          <Route path="/" element={<Navigate to="/messages" replace />} />
          <Route
            path="/messages"
            element={
              <MessagesSection
                drafts={drafts}
                setDrafts={setDrafts}
                onNewMessage={() => setIsNewMessageOpen(true)}
              />
            }
          />
          <Route
            path="/messages/:messageId"
            element={
              <MessagesSection
                drafts={drafts}
                setDrafts={setDrafts}
                onNewMessage={() => setIsNewMessageOpen(true)}
              />
            }
          />
          <Route path="/announcements" element={<AnnouncementsPanel />} />
          <Route path="/announcements/:announcementId" element={<AnnouncementsPanel />} />
          <Route path="/contacts" element={<ContactsPanel />} />
          <Route path="*" element={<Navigate to="/messages" replace />} />
        </Routes>
      </div>

      <NewMessageDialog
        open={isNewMessageOpen}
        onOpenChange={setIsNewMessageOpen}
      />
    </div>
  );
}