import { NavLink } from 'react-router-dom'
import AppIcon from '../../shared/icons/AppIcon'

const navItems = [
  { id: 'messages', label: 'Messages', icon: 'messages' },
  { id: 'announcements', label: 'Announcements', icon: 'announcements' },
  { id: 'contacts', label: 'Contacts', icon: 'contacts' },
]

export default function LeftNav() {
  return (
    <div className="w-[68px] h-full flex flex-col items-center py-4 bg-unicredit-gray-lighter border-r border-unicredit-gray gap-2">
      {navItems.map((item) => (
        <div key={item.id} className="relative w-full flex justify-center py-1">
          <NavLink
            to={`/${item.id}`}
            title={item.label}
            className={({ isActive }) =>
              `w-10 h-10 flex items-center justify-center transition-colors ${
                isActive ? 'text-unicredit-primary' : 'text-unicredit-text-secondary hover:text-unicredit-primary'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <div className="absolute left-[2px] top-0 bottom-0 w-[2.5px] bg-unicredit-primary rounded-full"></div>
                )}
                <AppIcon name={item.icon} />
              </>
            )}
          </NavLink>
        </div>
      ))}

      <div className="mt-auto flex flex-col gap-4 items-center mb-2">
        <div className="relative w-full flex justify-center py-1">
          <NavLink
            to="/settings"
            title="Settings"
            className={({ isActive }) =>
              `w-10 h-10 flex items-center justify-center transition-colors ${
                isActive ? 'text-unicredit-primary' : 'text-unicredit-text-secondary hover:text-unicredit-primary'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <div className="absolute left-[2px] top-0 bottom-0 w-[2.5px] bg-unicredit-primary rounded-full"></div>
                )}
                <AppIcon name="settings" />
              </>
            )}
          </NavLink>
        </div>

        <div
          className="w-7 h-7 rounded-full bg-unicredit-gray flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
          title="User Profile"
        >
          <span className="text-xs font-bold text-unicredit-text">ES</span>
        </div>
      </div>
    </div>
  )
}
