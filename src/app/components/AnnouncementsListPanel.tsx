import { useState, useMemo } from 'react';
import { ChevronDown, ChevronLeft } from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as Checkbox from '@radix-ui/react-checkbox';
import { announcementFolders, type AnnouncementItem } from '@/app/data/announcementsData';
import { AttachmentIcon, TodoIcon, FilterIcon, SearchIcon, CheckmarkIcon } from '@/app/components/NavIcons';
import { highlightText, filterBySearch } from '@/app/utils';
import { COLORS } from '@/app/constants';
import { CompanyDisplay } from '@/app/components/CompanyDisplay';

// Internal Icons for Folder Selector
function RadioUnselectedIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10.5" fill="white" stroke="#262626" />
    </svg>
  );
}

function RadioSelectedIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10.5" fill="white" stroke="#262626" />
      <circle cx="12" cy="12" r="6" fill="#007a91" />
    </svg>
  );
}

interface FolderSelectionContentProps {
  currentFolder: string;
  onApply: (folder: string) => void;
}

function FolderSelectionContent({ currentFolder, onApply }: FolderSelectionContentProps) {
  const [tempSelected, setTempSelected] = useState(currentFolder);
  const folders = ['Inbox', 'Deleted'];

  return (
    <div className="w-full flex flex-col">
      {/* Options */}
      <div className="flex flex-col w-full pb-2 pt-2">
        {folders.map((folder) => (
          <div
            key={folder}
            onClick={() => setTempSelected(folder)}
            className="flex items-center px-4 py-3 cursor-pointer hover:bg-gray-50 self-stretch gap-2 transition-colors"
          >
            {/* Radio Button Area */}
            <div className="flex items-start justify-center w-6 h-6 shrink-0">
              {tempSelected === folder ? <RadioSelectedIcon /> : <RadioUnselectedIcon />}
            </div>

            {/* Text */}
            <span
              className="text-[#262626]"
              style={{
                fontFamily: 'UniCredit, sans-serif',
                fontSize: '16px',
                fontStyle: 'normal',
                fontWeight: 700,
                lineHeight: '24px',
                fontFeatureSettings: "'liga' off, 'clig' off",
                textTransform: 'capitalize'
              }}
            >
              {folder}
            </span>
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-between w-full px-4 pb-4">
        {/* Cancel Button */}
        <DropdownMenu.Item asChild>
          <button
            className="px-6 py-2 border border-[#262626] rounded bg-white hover:bg-gray-50 text-[#262626] text-sm font-bold uppercase transition-colors outline-none cursor-pointer"
          >
            Cancel
          </button>
        </DropdownMenu.Item>

        {/* Apply Button */}
        <DropdownMenu.Item asChild onSelect={() => onApply(tempSelected)}>
          <button
            className="px-6 py-2 bg-[#007a91] text-white rounded text-sm font-bold uppercase hover:bg-[#006577] transition-colors outline-none cursor-pointer"
          >
            Apply
          </button>
        </DropdownMenu.Item>
      </div>
    </div>
  );
}

interface AnnouncementsListPanelProps {
  announcements: AnnouncementItem[];
  selectedAnnouncementId: string | null;
  onSelectAnnouncement: (id: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onToggleTodo?: (id: string) => void;
  onDeleteAnnouncement?: (id: string | string[]) => void;
}

export function AnnouncementsListPanel({
  announcements,
  selectedAnnouncementId,
  onSelectAnnouncement,
  isCollapsed,
  onToggleCollapse,
  searchQuery,
  onSearchChange,
  onToggleTodo,
  onDeleteAnnouncement
}: AnnouncementsListPanelProps) {
  const [selectedFolder, setSelectedFolder] = useState('Inbox');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [isFolderDropdownOpen, setIsFolderDropdownOpen] = useState(false);

  const filteredAnnouncements = useMemo(() => {
    // 1. Filter by Folder
    const folderFiltered = announcements.filter(a => {
      // Cast to any because the interface update might not be fully propagated in IDE context yet
      // defaulting new items to 'Inbox' if undefined (though mock data is updated)
      const folder = (a as any).folder || 'Inbox';
      return folder === selectedFolder;
    });

    // 2. Filter by Search
    return filterBySearch(folderFiltered, searchQuery, (announcement) => [
      announcement.title,
      announcement.preview,
      ...announcement.companies,
    ]);
  }, [announcements, searchQuery, selectedFolder]);

  // Calculate counts based on the selected folder (ignoring search)
  const folderCounts = useMemo(() => {
    const inFolder = announcements.filter(a => {
      const folder = (a as any).folder || 'Inbox';
      return folder === selectedFolder;
    });
    return {
      total: inFolder.length,
      unread: inFolder.filter(a => !a.isRead).length
    };
  }, [announcements, selectedFolder]);

  const handleSelectAll = () => {
    if (selectedItems.size === filteredAnnouncements.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(filteredAnnouncements.map(a => a.id)));
    }
  };

  const handleToggleItem = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };



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

  if (isCollapsed) {
    return null;
  }

  return (
    <div className="w-[390px] border-r border-[#e6e6e6] bg-white flex flex-col h-full transition-all duration-300 ease-out relative">
      {/* Search and Filter */}
      <div className="p-3 border-b border-[#e6e6e6]">
        <div className="flex gap-3 items-center mb-3">
          <div className="flex-1 relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <SearchIcon />
            </div>
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-sm border border-[#ccc] rounded bg-white focus:outline-none focus:border-[#007a91]"
            />
          </div>
          <button className="p-2.5 hover:bg-gray-100 rounded transition-colors">
            <FilterIcon />
          </button>
        </div>

        {/* Folder Selector */}
        <div className="flex items-center justify-between pb-1 border-b border-[#ccc]">
          <DropdownMenu.Root open={isFolderDropdownOpen} onOpenChange={setIsFolderDropdownOpen}>
            <DropdownMenu.Trigger asChild>
              <div className="flex-1 flex items-center justify-between cursor-pointer group outline-none pr-4">
                <button className="flex items-center gap-2 text-xl font-bold text-[#262626] group-hover:text-[#007a91] transition-colors outline-none">
                  <span className="capitalize">{selectedFolder}</span>
                  <ChevronDown size={16} />
                </button>
              </div>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                className="bg-white rounded-[4px] shadow-lg border border-[#262626] z-50 flex flex-col items-center"
                sideOffset={5}
                align="start"
                style={{ width: 'var(--radix-dropdown-menu-trigger-width)' }}
              >
                <FolderSelectionContent
                  currentFolder={selectedFolder}
                  onApply={(folder) => {
                    setSelectedFolder(folder);
                    setIsFolderDropdownOpen(false);
                  }}
                />
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>

          <div className="text-sm">
            <span className="font-bold">{folderCounts.unread}</span>
            <span className="text-[#666]">/{folderCounts.total} unread</span>
          </div>
        </div>
      </div>

      {/* Select All and Quick Actions */}
      <div className="px-3 py-3 bg-white border-b border-[#e6e6e6] flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer">
          <Checkbox.Root
            checked={selectedItems.size === filteredAnnouncements.length && filteredAnnouncements.length > 0}
            onCheckedChange={handleSelectAll}
            className="w-4 h-4 border border-[#262626] rounded bg-white cursor-pointer flex items-center justify-center data-[state=checked]:bg-white data-[state=checked]:border-[#262626]"
            style={{ borderRadius: '4px' }}
          >
            <Checkbox.Indicator className="flex items-center justify-center">
              <CheckmarkIcon />
            </Checkbox.Indicator>
          </Checkbox.Root>
          <span className="text-sm font-bold uppercase">
            {selectedItems.size > 0 ? `${selectedItems.size} SELECTED` : 'ALL'}
          </span>
        </label>

        {selectedItems.size > 0 && (
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className="flex items-center gap-1 outline-none group">
                <span
                  className="uppercase text-[#007a91]"
                  style={{
                    fontFamily: 'UniCredit, sans-serif',
                    fontSize: '14px',
                    fontWeight: 700,
                    fontFeatureSettings: "'liga' off, 'clig' off"
                  }}
                >
                  ACTIONS
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none" className="transition-transform group-data-[state=open]:-rotate-180">
                  <path fillRule="evenodd" clipRule="evenodd" d="M1.5 4.98881C2.10103 4.33706 3.07641 4.33706 3.678 4.98881L6 7.34884L8.322 4.98881C8.92359 4.33706 9.89841 4.33706 10.5 4.98881L6 9.5625L1.5 4.98881Z" fill="#007A91" />
                </svg>
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                className="bg-white rounded-md shadow-lg border border-[#e6e6e6] p-1 min-w-[200px] z-50"
                align="start"
                sideOffset={5}
              >
                {(() => {
                  const selectedAnnouncements = announcements.filter(a => selectedItems.has(a.id));
                  const hasUnread = selectedAnnouncements.some(a => !a.isRead);
                  const hasRead = selectedAnnouncements.some(a => a.isRead);
                  const isDeletedFolder = selectedFolder === 'Deleted';

                  // Restore logic for Deleted folder
                  if (isDeletedFolder) {
                    return (
                      <>
                        <DropdownMenu.Item
                          className="px-3 py-2 text-sm text-[#262626] hover:bg-[#e7f8fb] rounded cursor-pointer outline-none uppercase font-bold"
                          onSelect={() => {
                            // Restore logic placeholder
                            console.log('Restore announcements', selectedItems);
                            setSelectedItems(new Set());
                          }}
                        >
                          Restore Announcement
                        </DropdownMenu.Item>
                        {selectedItems.size === 1 && (
                          <DropdownMenu.Item className="px-3 py-2 text-sm text-[#262626] hover:bg-[#e7f8fb] rounded cursor-pointer outline-none uppercase font-bold">
                            Download Announcement
                          </DropdownMenu.Item>
                        )}
                      </>
                    );
                  }

                  // Standard (Inbox) Logic
                  return (
                    <>
                      {/* Read/Unread Toggles */}
                      {(hasUnread || (selectedItems.size > 1 && hasUnread && hasRead)) && (
                        <DropdownMenu.Item
                          className="px-3 py-2 text-sm text-[#262626] hover:bg-[#e7f8fb] rounded cursor-pointer outline-none uppercase font-bold"
                          onSelect={() => {
                            // Handler for Mark as Read
                            console.log('Mark as read');
                            setSelectedItems(new Set());
                          }}
                        >
                          Mark as read
                        </DropdownMenu.Item>
                      )}

                      {(hasRead || (selectedItems.size > 1 && hasUnread && hasRead)) && (
                        <DropdownMenu.Item
                          className="px-3 py-2 text-sm text-[#262626] hover:bg-[#e7f8fb] rounded cursor-pointer outline-none uppercase font-bold"
                          onSelect={() => {
                            // Handler for Mark as Unread
                            console.log('Mark as unread');
                            setSelectedItems(new Set());
                          }}
                        >
                          Mark as unread
                        </DropdownMenu.Item>
                      )}

                      {/* Single Item Extras */}
                      {selectedItems.size === 1 && (
                        <>
                          <DropdownMenu.Item className="px-3 py-2 text-sm text-[#262626] hover:bg-[#e7f8fb] rounded cursor-pointer outline-none uppercase font-bold">
                            Forward Announcement
                          </DropdownMenu.Item>
                          <DropdownMenu.Item className="px-3 py-2 text-sm text-[#262626] hover:bg-[#e7f8fb] rounded cursor-pointer outline-none uppercase font-bold">
                            Download Announcement
                          </DropdownMenu.Item>
                        </>
                      )}

                      <DropdownMenu.Separator className="h-px bg-[#e6e6e6] my-1" />

                      {/* Delete */}
                      <DropdownMenu.Item
                        className="px-3 py-2 text-sm text-[#e2001a] hover:bg-[#ffe6e6] rounded cursor-pointer outline-none uppercase font-bold"
                        onSelect={() => {
                          if (onDeleteAnnouncement) {
                            onDeleteAnnouncement(Array.from(selectedItems));
                            setSelectedItems(new Set());
                          }
                        }}
                      >
                        Delete
                      </DropdownMenu.Item>
                    </>
                  );
                })()}
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        )}
      </div>

      {/* Announcements List */}
      <div className="flex-1 overflow-y-auto message-list-scrollbar">
        {filteredAnnouncements.map((announcement) => {
          const isSelected = selectedAnnouncementId === announcement.id;
          const isChecked = selectedItems.has(announcement.id);

          return (
            <div
              key={announcement.id}
              onClick={() => onSelectAnnouncement(announcement.id)}
              className={`border-b border-[#e6e6e6] px-3 py-3 cursor-pointer transition-colors ${isSelected ? 'bg-[#e7f8fb]' : 'hover:bg-gray-50'
                }`}
            >
              <div className="flex items-center gap-2">
                {/* Checkbox - Centered Vertically */}
                <Checkbox.Root
                  checked={isChecked}
                  onCheckedChange={() => handleToggleItem(announcement.id)}
                  onClick={(e) => e.stopPropagation()}
                  className="w-4 h-4 border border-[#262626] rounded bg-white cursor-pointer flex items-center justify-center shrink-0 data-[state=checked]:bg-white data-[state=checked]:border-[#262626]"
                  style={{ borderRadius: '4px' }}
                >
                  <Checkbox.Indicator className="flex items-center justify-center">
                    <CheckmarkIcon />
                  </Checkbox.Indicator>
                </Checkbox.Root>

                {/* Content - 3 Rows structure like Messages */}
                <div className="flex-1 min-w-0">

                  {/* Row 1: Companies (Left) -- Date (Right) */}
                  <div className="flex items-center justify-between mb-2">
                    <CompanyDisplay
                      companies={announcement.companies}
                      textSize="text-xs"
                      isBold={!announcement.isRead}
                      maxWidth="max-w-[200px]"
                      tooltipAlign="start"
                      tooltipSide="top"
                    />
                    <span className="text-xs text-[#262626] font-normal shrink-0">
                      {announcement.publishedDate.split(' ')[0]}
                    </span>
                  </div>

                  {/* Row 2: Title (Left) -- Icons (Right) */}
                  <div className="flex items-center justify-between mb-2">
                    <div className={`text-sm truncate ${announcement.isRead ? 'font-normal' : 'font-bold'} text-[#262626] pr-2`}>
                      {highlightText(announcement.title, searchQuery)}
                    </div>

                    {/* Icons Container - fixed height to prevent shifts */}
                    <div className="flex gap-1.5 shrink-0 min-h-[14px]">
                      {announcement.hasAttachment && (
                        <div className="text-[#666]">
                          <AttachmentIcon />
                        </div>
                      )}
                      {announcement.hasTodo && (
                        <div className="text-[#666]">
                          <TodoIcon />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Row 3: Preview (Left) -- Badge (Right) */}
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-[#666] truncate flex-1 pr-2">
                      {highlightText(announcement.preview, searchQuery)}
                    </div>
                    <div
                      className={`px-2 py-0.5 text-xs font-bold ${getStatusBadgeColor(announcement.status)}`}
                      style={{ fontSize: '10px', lineHeight: '14px', borderRadius: '4px' }}
                    >
                      {getStatusLabel(announcement.status)}
                    </div>
                  </div>

                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* Collapse Button on Divider */}
      {onToggleCollapse && (
        <button
          onClick={onToggleCollapse}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-[30px] h-[30px] bg-white rounded-lg shadow-[2px_2px_7px_0_rgba(0,0,0,0.25)] hover:bg-gray-50 active:bg-gray-100 flex items-center justify-center transition-colors z-10"
          title="Collapse announcements list"
        >
          <ChevronLeft size={16} className="text-[#262626]" />
        </button>
      )}
    </div>
  );
}