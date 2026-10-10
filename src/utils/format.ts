const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/** Format an ISO date string (YYYY-MM-DD) to display format: DD Month YYYY (e.g., 07 October 2026) */
export function formatDate(isoDate: string): string {
  if (!isoDate) return '';
  const parts = isoDate.split('-');
  if (parts.length !== 3) return isoDate;
  const [year, month, day] = parts;
  const monthIndex = Number(month) - 1;
  if (monthIndex < 0 || monthIndex > 11) return isoDate;
  return `${day} ${MONTHS[monthIndex]} ${year}`;
}

/** Get today's date as an ISO string (YYYY-MM-DD) for storage */
export function todayISO(): string {
  return new Date().toISOString().split('T')[0];
}
