import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import LeftNav from './LeftNav'
import AppHeader from './AppHeader'
import Notification from './Notification'
import MessagesPage from '../features/messages/MessagesPage'
import ForwardConversation from '../features/messages/ForwardConversation'
import AnnouncementsPage from '../features/announcements/AnnouncementsPage'
import ContactsPage from '../features/contacts/ContactsPage'

export interface AppShellProps {
  embedded?: boolean
}

export default function AppShell({ embedded = false }: AppShellProps) {
  const navigate = useNavigate()

  return (
    <div
      className={`flex flex-col min-w-[1024px] overflow-hidden bg-white text-[#262626] font-sans ${
        embedded ? 'h-full' : 'h-screen'
      }`}
    >
      <div className="flex flex-1 h-full overflow-hidden">
        <LeftNav />

        <div className="flex-1 flex flex-col h-full min-w-0 bg-white">
          <AppHeader onNewMessage={() => navigate('/messages/new')} />
          <Notification />

          <div className="flex-1 relative z-0">
            <Routes>
              <Route path="/" element={<Navigate to="/messages" replace />} />
              <Route path="/messages" element={<MessagesPage />} />
              <Route path="/messages/new" element={<MessagesPage />} />
              <Route path="/messages/forward/:id" element={<ForwardConversation />} />
              <Route path="/messages/:id" element={<MessagesPage />} />
              <Route path="/announcements" element={<AnnouncementsPage />} />
              <Route path="/announcements/:id" element={<AnnouncementsPage />} />
              <Route path="/contacts" element={<ContactsPage />} />
              <Route path="/settings" element={<MessagesPage />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  )
}
