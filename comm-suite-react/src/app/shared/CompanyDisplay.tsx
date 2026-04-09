export interface CompanyDisplayProps {
  companies: string[]
  textSize?: string
  isBold?: boolean
  maxWidth?: string
}

export default function CompanyDisplay({
  companies,
  textSize = 'text-sm',
  isBold = true,
  maxWidth = 'max-w-full',
}: CompanyDisplayProps) {
  if (!companies || companies.length === 0) return null

  const fontWeight = isBold ? 'font-bold' : 'font-normal'
  const baseClasses = `${textSize} ${fontWeight} text-[#262626] uppercase transition-colors hover:text-[#007a91]`

  if (companies.length === 1) {
    return (
      <div className={`truncate block cursor-default ${baseClasses} ${maxWidth}`} title={companies[0]}>
        {companies[0]}
      </div>
    )
  }

  return (
    <div className={`cursor-default whitespace-nowrap ${baseClasses}`} title={companies.join('\n')}>
      {companies.length} COMPANIES
    </div>
  )
}
