import React from 'react';

/**
 * Highlights matching text within a string based on a search query.
 * Returns JSX with highlighted spans for matches.
 *
 * @param text - The text to search within
 * @param searchQuery - The query to highlight
 * @param highlightClassName - Optional CSS class for highlight (default: inline style)
 * @returns JSX with highlighted matches or plain text if no query
 */
export function highlightText(
  text: string,
  searchQuery: string | undefined,
  highlightClassName?: string
): React.ReactNode {
  if (!searchQuery?.trim()) {
    return text;
  }

  const query = searchQuery.trim();
  // Escape special regex characters to prevent errors
  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escapedQuery})`, 'gi');
  const parts = text.split(regex);

  return parts.map((part, index) =>
    regex.test(part) ? (
      <span
        key={index}
        className={highlightClassName}
        style={highlightClassName ? undefined : { background: '#BFEBF3' }}
      >
        {part}
      </span>
    ) : (
      <React.Fragment key={index}>{part}</React.Fragment>
    )
  );
}

/**
 * Filters an array of items based on a search query across multiple fields.
 *
 * @param items - Array of items to filter
 * @param searchQuery - The search query
 * @param getSearchableFields - Function that returns searchable strings from an item
 * @returns Filtered array of items
 */
export function filterBySearch<T>(
  items: T[],
  searchQuery: string | undefined,
  getSearchableFields: (item: T) => string[]
): T[] {
  if (!searchQuery?.trim()) {
    return items;
  }

  const query = searchQuery.toLowerCase().trim();

  return items.filter((item) => {
    const fields = getSearchableFields(item);
    return fields.some((field) => field.toLowerCase().includes(query));
  });
}

/**
 * Formats a timestamp to a specific format.
 *
 * @param date - Date object to format
 * @returns Formatted string like "16.06.2023 11:45 AM"
 */
export function formatTimestamp(date: Date = new Date()): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours % 12 || 12;
  const formattedTime = `${String(hours12).padStart(2, '0')}:${minutes} ${ampm}`;

  return `${day}.${month}.${year} ${formattedTime}`;
}
