export function highlightText(text: string | undefined | null, query?: string, highlightClass = 'bg-[#BFEBF3]'): string {
    if (!text) return '';
    if (!query || !query.trim()) return text;

    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedQuery})`, 'gi');
    return text.replace(regex, `<span class="${highlightClass}">$1</span>`);
}

export function formatTimestamp(date: Date = new Date()): string {
    // Basic formatting: "16.06.2023 11:45 AM"
    // Using native generic formatting for now to match requirement without heavy libs if possible, 
    // but React used custom formatting. Let's aim for DD.MM.YYYY HH:MM AM/PM
    const d = date;
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    let hours = d.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const minutes = d.getMinutes().toString().padStart(2, '0');

    return `${day}.${month}.${year} ${hours}:${minutes} ${ampm}`;
}
