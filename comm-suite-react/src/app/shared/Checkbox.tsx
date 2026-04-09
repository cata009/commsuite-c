import AppIcon from '../../shared/icons/AppIcon'

export interface CheckboxProps {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

export default function Checkbox({ checked = false, onCheckedChange }: CheckboxProps) {
  const toggle = (event: React.MouseEvent) => {
    event.stopPropagation()
    onCheckedChange?.(!checked)
  }

  return (
    <div
      className="w-5 h-5 border border-[#262626] bg-white rounded flex items-center justify-center cursor-pointer transition-colors"
      onClick={toggle}
    >
      {checked ? <AppIcon name="checkmark-stroke" size={12} className="text-[#007A91]" /> : null}
    </div>
  )
}
