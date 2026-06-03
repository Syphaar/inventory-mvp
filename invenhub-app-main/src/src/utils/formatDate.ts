/**
 * Date Formatting Utilities
 *
 * Provides consistent date formatting across the application.
 * Formats ISO datetime strings to readable formats.
 *
 * Usage:
 * - formatDate('2026-01-15T12:30:00Z') -> "Jan 15, 2026"
 * - formatDateTime('2026-01-15T12:30:00Z') -> "Jan 15, 12:30 PM"
 * - formatTime('2026-01-15T12:30:00Z') -> "12:30 PM"
 */

/**
 * Format ISO DateTime to Date String
 *
 * Converts ISO 8601 datetime to short date format.
 * Format: "Mon DD, YYYY" (e.g., "Jan 15, 2026")
 *
 * Usage: formatDate('2026-01-15T12:30:00Z') -> "Jan 15, 2026"
 *
 * @param isoDate - ISO 8601 datetime string
 * @returns Formatted date string
 */
export function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Format ISO DateTime to DateTime String
 *
 * Converts ISO 8601 datetime to full datetime format.
 * Format: "Mon DD HH:MM" (e.g., "Jan 15, 12:30")
 *
 * Usage: formatDateTime('2026-01-15T12:30:00Z') -> "Jan 15, 12:30"
 *
 * @param isoDate - ISO 8601 datetime string
 * @returns Formatted datetime string
 */
export function formatDateTime(isoDate: string): string {
  return new Date(isoDate).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * Format ISO DateTime to Time String
 *
 * Extracts just the time portion from ISO datetime.
 * Format: "HH:MM AM/PM" (e.g., "12:30 PM")
 *
 * Usage: formatTime('2026-01-15T12:30:00Z') -> "12:30 PM"
 *
 * @param isoDate - ISO 8601 datetime string
 * @returns Formatted time string
 */
export function formatTime(isoDate: string): string {
  return new Date(isoDate).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * Format ISO DateTime to Relative Time
 *
 * Converts ISO datetime to relative format (e.g., "2 days ago").
 * Useful for showing "time since" for recent events.
 *
 * Usage: formatRelativeTime('2026-01-13T12:30:00Z') -> "2 days ago"
 *
 * @param isoDate - ISO 8601 datetime string
 * @returns Relative time string
 */
export function formatRelativeTime(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;

  return formatDate(isoDate);
}

/**
 * Parse ISO DateTime to JavaScript Date
 *
 * Safely converts ISO string to Date object.
 *
 * @param isoDate - ISO 8601 datetime string
 * @returns Date object
 */
export function parseDate(isoDate: string): Date {
  return new Date(isoDate);
}
