import { MessagesIcon, AnnouncementsIcon, ContactsIcon, SettingsIcon } from '@/app/components/NavIcons';

interface LeftNavProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function LeftNav({ activeSection, onSectionChange }: LeftNavProps) {
  const navItems = [
    { id: 'messages', icon: MessagesIcon, label: 'Messages' },
    { id: 'announcements', icon: AnnouncementsIcon, label: 'Announcements' },
    { id: 'contacts', icon: ContactsIcon, label: 'Contacts' },
  ];

  return (
    <div className="w-16 bg-white border-r border-[#e6e6e6] flex flex-col justify-between py-1">
      <div className="flex flex-col">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className="flex items-center justify-center p-4 relative group transition-colors hover:bg-gray-50"
              title={item.label}
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#007a91]" />
              )}
              <Icon isActive={isActive} />
            </button>
          );
        })}
      </div>
      
      <div className="flex flex-col">
        <button
          className="flex items-center justify-center p-4 hover:bg-gray-50 transition-colors"
          title="Settings"
        >
          <SettingsIcon isActive={false} />
        </button>
        <div className="flex items-center justify-center p-4">
          <div className="w-7 h-7 rounded-full bg-[#e5e5e5] flex items-center justify-center">
            <span className="text-xs font-bold text-[#262626]">ES</span>
          </div>
        </div>
      </div>
    </div>
  );
}