import { APP_ICONS } from './icons.registry'

export interface AppIconProps {
  name: string
  size?: number
  className?: string
  title?: string
}

export function AppIcon({ name, size = 24, className = '', title }: AppIconProps) {
  const svg = APP_ICONS[name]

  if (!svg) {
    console.warn(`Icon not found: ${name}`)
    return null
  }

  const cssSize = typeof size === 'number' ? `${size}px` : size

  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        lineHeight: 0,
        width: cssSize,
        height: cssSize,
      }}
      title={title}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}

export default AppIcon
