import { CustomTooltip } from '@/app/components/CustomTooltip';

interface CompanyDisplayProps {
  companies: string[];
  /** Text size class - defaults to 'text-xs' */
  textSize?: string;
  /** Whether text should be bold when unread */
  isBold?: boolean;
  /** Maximum width for truncation - defaults to full width */
  maxWidth?: string;
  /** Alignment for tooltip */
  tooltipAlign?: 'start' | 'center' | 'end';
  /** Side for tooltip */
  tooltipSide?: 'top' | 'bottom' | 'left' | 'right';
}

/**
 * Unified Company Display Component
 *
 * Rules:
 * - 1 company: Show full name, truncate if too long, tooltip shows full name on hover
 * - 2+ companies: Show "X COMPANIES", tooltip shows all company names on hover
 */
export function CompanyDisplay({
  companies,
  textSize = 'text-xs',
  isBold = false,
  maxWidth = 'max-w-full',
  tooltipAlign = 'start',
  tooltipSide = 'top',
}: CompanyDisplayProps) {
  if (!companies || companies.length === 0) {
    return null;
  }

  const fontWeight = isBold ? 'font-bold' : 'font-normal';
  const baseClasses = `${textSize} ${fontWeight} text-[#262626] uppercase`;

  if (companies.length === 1) {
    // Single company - show name, truncate if needed
    return (
      <CustomTooltip content={companies[0]} side={tooltipSide} align={tooltipAlign}>
        <span className={`${baseClasses} truncate block ${maxWidth} cursor-default`}>
          {companies[0]}
        </span>
      </CustomTooltip>
    );
  }

  // Multiple companies - show count with tooltip listing all
  const tooltipContent = companies.join('\n');

  return (
    <CustomTooltip content={tooltipContent} side={tooltipSide} align={tooltipAlign}>
      <span className={`${baseClasses} cursor-default whitespace-nowrap`}>
        {companies.length} COMPANIES
      </span>
    </CustomTooltip>
  );
}

/**
 * Company Display for Popover/Modal headers
 * Centered, larger text, with different styling
 */
interface CompanyDisplayHeaderProps {
  companies: string[];
  fallbackTitle?: string;
}

export function CompanyDisplayHeader({ companies, fallbackTitle }: CompanyDisplayHeaderProps) {
  if (!companies || companies.length === 0) {
    if (fallbackTitle) {
      return (
        <span className="text-[#262626] font-bold text-base uppercase text-center">
          {fallbackTitle}
        </span>
      );
    }
    return null;
  }

  if (companies.length === 1) {
    return (
      <CustomTooltip content={companies[0]} side="top" align="center">
        <span className="text-[#262626] font-bold text-base uppercase text-center truncate max-w-[280px] block cursor-default">
          {companies[0]}
        </span>
      </CustomTooltip>
    );
  }

  const tooltipContent = companies.join('\n');

  return (
    <CustomTooltip content={tooltipContent} side="top" align="center">
      <span className="text-[#262626] font-bold text-base uppercase text-center cursor-default">
        {companies.length} COMPANIES
      </span>
    </CustomTooltip>
  );
}
