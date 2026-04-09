import AppIcon from '../../shared/icons/AppIcon'

export interface NotificationData {
  title: string
  message: string
}

export interface NotificationProps {
  notification?: NotificationData | null
  onClose?: () => void
}

export default function Notification({ notification, onClose }: NotificationProps) {
  if (!notification) return null

  return (
    <div className="fixed top-[88px] right-[24px] z-[9999] inline-flex flex-col p-[24px] gap-[12px] rounded-[4px] bg-[#CF3524] shadow-lg max-w-[450px]">
      <div className="flex items-start justify-between gap-[12px]">
        <div className="flex flex-col gap-[12px]">
          <span
            className="text-white font-bold text-[16px] leading-[22px]"
            style={{ fontFamily: 'UniCredit' }}
          >
            {notification.title}
          </span>
          <span
            className="text-white font-normal text-[14px] leading-[20px]"
            style={{ fontFamily: 'UniCredit' }}
          >
            {notification.message}
          </span>
        </div>
        <button
          onClick={() => onClose?.()}
          className="p-1 hover:opacity-80 transition-opacity outline-none cursor-pointer"
        >
          <AppIcon name="header-close" size={20} className="text-white" />
        </button>
      </div>
    </div>
  )
}
