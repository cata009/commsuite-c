import AppIcon from '../../shared/icons/AppIcon'

export interface AppHeaderProps {
  title?: string
  onNewMessage?: () => void
}

export default function AppHeader({ title = 'Communication Suite', onNewMessage }: AppHeaderProps) {
  return (
    <div className="bg-unicredit-gray-lighter px-5 py-1 flex items-center justify-between border-b border-unicredit-gray">
      <div className="flex items-center gap-2.5">
        <AppIcon name="unicredit-logo" size={24} />
        <h1 className="text-lg font-bold text-unicredit-text">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        <button
          className="w-10 h-10 flex items-center justify-center hover:bg-gray-200 rounded transition-colors"
          onClick={onNewMessage}
        >
          <AppIcon name="header-minus" size={16} className="text-[#262626]" />
        </button>
        <button className="w-10 h-10 flex items-center justify-center hover:bg-gray-200 rounded transition-colors">
          <AppIcon name="header-close" size={16} className="text-[#262626]" />
        </button>
      </div>
    </div>
  )
}
