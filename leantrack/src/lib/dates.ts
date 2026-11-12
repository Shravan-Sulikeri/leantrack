import { format, parse, differenceInCalendarDays, startOfWeek, endOfWeek } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

const DATE_FORMAT = 'yyyy-MM-dd';

/**
 * Returns today's date as YYYY-MM-DD in the given IANA timezone.
 */
export function getLocalDate(timezone: string): string {
  const now = new Date();
  const zoned = toZonedTime(now, timezone);
  return format(zoned, DATE_FORMAT);
}

/**
 * Returns the weekday number (0 = Sunday … 6 = Saturday) for a
 * YYYY-MM-DD date string interpreted in the given timezone.
 */
export function getLocalWeekday(date: string, timezone: string): number {
  const parsed = parse(date, DATE_FORMAT, new Date());
  const zoned = toZonedTime(parsed, timezone);
  return zoned.getDay();
}

/**
 * Formats a YYYY-MM-DD string as a short display date, e.g. "Thu, Nov 12".
 */
export function formatDisplayDate(date: string): string {
  const parsed = parse(date, DATE_FORMAT, new Date());
  return format(parsed, 'EEE, MMM d');
}

/**
 * Formats a YYYY-MM-DD string as a full date, e.g. "Thursday, November 12, 2026".
 */
export function formatFullDate(date: string): string {
  const parsed = parse(date, DATE_FORMAT, new Date());
  return format(parsed, 'EEEE, MMMM d, yyyy');
}

/**
 * Returns a greeting based on the current hour:
 * - 5-11:  "Good morning"
 * - 12-16: "Good afternoon"
 * - 17+:   "Good evening"
 */
export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'Good morning';
  if (hour >= 12 && hour < 17) return 'Good afternoon';
  return 'Good evening';
}

/**
 * Returns the number of calendar days between two YYYY-MM-DD strings.
 * Result is positive when end > start.
 */
export function getDaysBetween(start: string, end: string): number {
  const startDate = parse(start, DATE_FORMAT, new Date());
  const endDate = parse(end, DATE_FORMAT, new Date());
  return differenceInCalendarDays(endDate, startDate);
}

/**
 * Returns the Monday–Sunday week range containing the given date.
 * Both boundaries are YYYY-MM-DD strings.
 */
export function getWeekRange(date: string): { start: string; end: string } {
  const parsed = parse(date, DATE_FORMAT, new Date());
  const weekStart = startOfWeek(parsed, { weekStartsOn: 1 }); // Monday
  const weekEnd = endOfWeek(parsed, { weekStartsOn: 1 }); // Sunday
  return {
    start: format(weekStart, DATE_FORMAT),
    end: format(weekEnd, DATE_FORMAT),
  };
}
