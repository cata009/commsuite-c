import { MoreVertical } from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { AnnouncementItem } from '@/app/data/announcementsData';
import { TodoIcon } from '@/app/components/NavIcons';
import { highlightText } from '@/app/utils';
import { COLORS } from '@/app/constants';

interface AnnouncementDetailPanelProps {
  announcementId: string | null;
  searchQuery: string;
  announcement: AnnouncementItem | null;
  onToggleReadStatus: () => void;
  onToggleTodo?: () => void;
  onDeleteAnnouncement?: () => void;
}

export function AnnouncementDetailPanel({ announcementId, searchQuery, announcement, onToggleReadStatus, onToggleTodo, onDeleteAnnouncement }: AnnouncementDetailPanelProps) {
  const isUnread = announcement ? !announcement.isRead : false;

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'informative':
        return 'bg-informative text-white';
      case 'important':
        return 'bg-important text-white';
      case 'recalled':
        return 'bg-recalled text-white';
      default:
        return 'bg-informative text-white';
    }
  };

  const getStatusLabel = (status: string) => status.toUpperCase();

  if (!announcement) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white">
        <p className="text-[#666]">Select an announcement to view details</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white h-full overflow-hidden">
      {/* Header */}
      <div className="border-b border-[#e6e6e6] bg-white px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <h2 className="text-xl font-bold text-[#262626] flex-1 truncate">{announcement.title}</h2>

        <div className="flex items-center gap-4">
          {announcement.expirationDate && (
            <div className="text-sm text-[#666]">
              <span className="font-semibold">Expiration:</span> {announcement.expirationDate}
            </div>
          )}

          <div className="w-px h-6 bg-[#e6e6e6]"></div>

          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                <MoreVertical size={20} className="text-[#666]" />
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                className="z-50 min-w-[150px]"
                align="end"
                sideOffset={5}
                style={{
                  display: 'inline-flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'flex-end',
                  borderRadius: '4px',
                  border: '1px solid #262626',
                  background: '#FFF',
                }}
              >
                {/* Delete */}
                <DropdownMenu.Item
                  className="cursor-pointer outline-none hover:bg-gray-50 w-full"
                  style={{ display: 'flex', padding: '12px', alignItems: 'flex-start', gap: '4px' }}
                  onSelect={() => onDeleteAnnouncement && onDeleteAnnouncement()}
                >
                  <div className="w-4 h-4 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path fillRule="evenodd" clipRule="evenodd" d="M9.5 1H12.523C13.508 1 14 2 14 2.5V3H2V2.5C2 2 2.492 1 3.477 1H6.5L7 0H9L9.5 1ZM4.84017 16C4.32017 16 3.88667 15.6015 3.84367 15.083L2.92017 4H12.9202L11.9962 15.083C11.9532 15.6015 11.5202 16 11.0002 16H4.84017Z" fill="#262626" />
                    </svg>
                  </div>
                  <span
                    className="text-[#262626] uppercase"
                    style={{
                      fontFamily: 'UniCredit, sans-serif',
                      fontSize: '14px',
                      fontStyle: 'normal',
                      fontWeight: 700,
                      lineHeight: 'normal',
                      fontFeatureSettings: "'liga' off, 'clig' off"
                    }}
                  >
                    Delete
                  </span>
                </DropdownMenu.Item>

                {/* Mark as read/unread toggle */}
                <DropdownMenu.Item
                  className="cursor-pointer outline-none hover:bg-gray-50 w-full"
                  style={{ display: 'flex', padding: '12px', alignItems: 'flex-start', gap: '4px' }}
                  onSelect={() => onToggleReadStatus()}
                >
                  <div className="w-4 h-4 flex-shrink-0">
                    {isUnread ? (
                      // Mark as Read Icon (Checkmark)
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path fillRule="evenodd" clipRule="evenodd" d="M13.5625 3.76108C12.6664 2.82964 11.2141 2.82964 10.3181 3.76108L6.22952 8.00209L4.11943 5.81907C3.22338 4.88804 1.77066 4.88804 0.875 5.81907L6.22952 11.375L13.5625 3.76108Z" fill="#262626" />
                      </svg>
                    ) : (
                      // Mark as Unread Icon
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path fillRule="evenodd" clipRule="evenodd" d="M0 3.936V3H16V3.936L8 9.433L0 3.936ZM0 5.2705L8 10.7675L16 5.271V10.3335C16 11.806 14.806 13 13.3335 13H0V5.2705Z" fill="#262626" />
                      </svg>
                    )}
                  </div>
                  <span
                    className="text-[#262626] uppercase"
                    style={{
                      fontFamily: 'UniCredit, sans-serif',
                      fontSize: '14px',
                      fontStyle: 'normal',
                      fontWeight: 700,
                      lineHeight: 'normal',
                      fontFeatureSettings: "'liga' off, 'clig' off"
                    }}
                  >
                    {isUnread ? 'Mark as read' : 'Mark as unread'}
                  </span>
                </DropdownMenu.Item>

                {/* Mark/Unmark as to do */}
                <DropdownMenu.Item
                  className="cursor-pointer outline-none hover:bg-gray-50 w-full"
                  style={{ display: 'flex', padding: '12px', alignItems: 'flex-start', gap: '4px' }}
                  onSelect={() => onToggleTodo && onToggleTodo()}
                >
                  <div className="w-4 h-4 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path fillRule="evenodd" clipRule="evenodd" d="M0.994772 0C0.583161 0 0.25 0.3355 0.25 0.75V16H1.73954V0.75C1.73954 0.3355 1.40638 0 0.994772 0ZM11.1733 6.06125V0.54175C9.71159 1.48 8.24997 1.01087 6.78835 0.54175C5.32674 0.072625 3.86512 -0.3965 2.40338 0.54175V6.06125C3.86512 5.123 5.32674 5.59212 6.78835 6.06125C8.24997 6.53037 9.71159 6.9995 11.1733 6.06125ZM9.65677 11.6392L13.3126 7.95725C13.9854 7.27925 15.0772 7.27925L10.8752 12.8663L9.65677 14.0938L8.43783 12.8663L5.18814 9.59375C5.86092 8.91575 6.95225 8.91575 7.62553 9.59375L9.65677 11.6392Z" fill="#262626" />
                    </svg>
                  </div>
                  <span
                    className="text-[#262626] uppercase"
                    style={{
                      fontFamily: 'UniCredit, sans-serif',
                      fontSize: '14px',
                      fontStyle: 'normal',
                      fontWeight: 700,
                      lineHeight: 'normal',
                      fontFeatureSettings: "'liga' off, 'clig' off"
                    }}
                  >
                    {announcement.hasTodo ? 'Unmark as to do' : 'Mark as to do'}
                  </span>
                </DropdownMenu.Item>

                {/* Download */}
                <DropdownMenu.Item
                  className="cursor-pointer outline-none hover:bg-gray-50 w-full"
                  style={{ display: 'flex', padding: '12px', alignItems: 'flex-start', gap: '4px' }}
                >
                  <div className="w-4 h-4 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path fillRule="evenodd" clipRule="evenodd" d="M2 6.35253L8.00043 12L14 6.35253C13.5871 5.94943 13.0878 5.7466 12.5029 5.7466C11.9164 5.7466 11.4179 5.94943 11.0041 6.35253L9 8.2523V0H7V8.25145L4.9959 6.35253C4.58383 5.94943 4.08365 5.7466 3.49881 5.7466C2.91225 5.7466 2.41379 5.94943 2 6.35253ZM1 13.5H12.4353C12.7859 13.5 13.1173 13.5652 13.4305 13.6965C13.7427 13.826 14.0139 14.0056 14.2422 14.2342C14.4723 14.4629 14.6558 14.7281 14.7937 15.03C14.9306 15.3311 15 15.649 15 16H3.56292C3.21323 16 2.88179 15.9411 2.56861 15.8071C2.25635 15.6723 1.98609 15.4918 1.756 15.2676C1.52683 15.0443 1.34331 14.7791 1.20544 14.4727C1.06848 14.1663 1 13.843 1 13.5Z" fill="#262626" />
                    </svg>
                  </div>
                  <span
                    className="text-[#262626] uppercase"
                    style={{
                      fontFamily: 'UniCredit, sans-serif',
                      fontSize: '14px',
                      fontStyle: 'normal',
                      fontWeight: 700,
                      lineHeight: 'normal',
                      fontFeatureSettings: "'liga' off, 'clig' off"
                    }}
                  >
                    Download
                  </span>
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </div>

      {/* Meta Information Row */}
      <div className="border-b border-[#e6e6e6] bg-white px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Companies */}
          {announcement.companies.length === 1 ? (
            <span className="text-sm text-[#262626]">{announcement.companies[0]}</span>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-sm text-[#666]">{announcement.companies.length} companies:</span>
              <span className="text-sm text-[#262626]">{announcement.companies.join(', ')}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* To-Do Icon */}
          {announcement.hasTodo && (
            <div className="text-[#666]">
              <TodoIcon />
            </div>
          )}

          {/* Status Badge */}
          <div
            className={`px-2 py-1 text-xs font-bold ${getStatusBadgeColor(announcement.status)}`}
            style={{ fontSize: '10px', lineHeight: '14px', borderRadius: '4px' }}
          >
            {getStatusLabel(announcement.status)}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto px-6 py-6 message-list-scrollbar">
        <div className="w-full">
          {/* Published Date */}
          <div className="mb-6 text-sm text-[#666]">
            <span className="font-semibold">Published:</span> {announcement.publishedDate}
            {announcement.updatedDate !== announcement.publishedDate && (
              <>
                {' | '}
                <span className="font-semibold">Updated:</span> {announcement.updatedDate}
              </>
            )}
          </div>

          {/* Announcement Content */}
          <div className="prose prose-sm max-w-none">
            <div className="text-[#262626] leading-relaxed whitespace-pre-line">
              {highlightText(announcement.content, searchQuery)}
            </div>
          </div>

          {/* Action Button (if applicable) */}
          {announcement.hasTodo && (
            <div className="mt-8 pt-6 border-t border-[#e6e6e6]">
              <button className="px-6 py-3 bg-[#007a91] hover:bg-[#006577] text-white rounded font-bold transition-colors">
                I am interested
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}