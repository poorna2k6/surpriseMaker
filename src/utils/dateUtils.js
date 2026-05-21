import {
  addYears,
  differenceInYears,
  differenceInCalendarDays,
  format,
  isSameDay,
  isBefore,
  subDays,
  addDays,
  setYear,
  getYear,
} from 'date-fns';

/**
 * Returns the next upcoming anniversary date from today.
 * If the anniversary already passed this calendar year, returns next year's date.
 *
 * @param {Date} weddingDate
 * @returns {Date|null}
 */
export function calculateNextAnniversary(weddingDate) {
  if (!weddingDate || !(weddingDate instanceof Date) || isNaN(weddingDate)) {
    return null;
  }

  const today = new Date();
  const currentYear = getYear(today);

  // Build the anniversary date for the current year
  let candidate = setYear(weddingDate, currentYear);

  // If that date has already passed (and isn't today), advance to next year
  if (isBefore(candidate, today) && !isSameDay(candidate, today)) {
    candidate = addYears(candidate, 1);
  }

  return candidate;
}

/**
 * Returns the number of full years between weddingDate and targetDate.
 *
 * @param {Date} weddingDate
 * @param {Date} [targetDate=new Date()]
 * @returns {number}
 */
export function calculateYearsTogether(weddingDate, targetDate = new Date()) {
  if (!weddingDate || !(weddingDate instanceof Date) || isNaN(weddingDate)) {
    return 0;
  }
  return differenceInYears(targetDate, weddingDate);
}

/**
 * Returns a human-readable relative date string.
 * Examples: "3 years ago", "1 year ago", "Today", "Tomorrow", "In 2 days"
 *
 * @param {Date} date
 * @returns {string}
 */
export function formatRelativeDate(date) {
  if (!date || !(date instanceof Date) || isNaN(date)) return '';

  const today = new Date();
  const daysDiff = differenceInCalendarDays(date, today);

  if (daysDiff === 0) return 'Today';
  if (daysDiff === 1) return 'Tomorrow';
  if (daysDiff === -1) return 'Yesterday';

  if (daysDiff > 0) {
    if (daysDiff < 7)  return `In ${daysDiff} days`;
    if (daysDiff < 14) return 'In 1 week';
    if (daysDiff < 31) return `In ${Math.floor(daysDiff / 7)} weeks`;
    if (daysDiff < 365) return `In ${Math.floor(daysDiff / 30)} months`;
    const years = Math.floor(daysDiff / 365);
    return `In ${years} ${years === 1 ? 'year' : 'years'}`;
  }

  // Past dates
  const absDays = Math.abs(daysDiff);
  if (absDays < 7)  return `${absDays} days ago`;
  if (absDays < 14) return '1 week ago';
  if (absDays < 31) return `${Math.floor(absDays / 7)} weeks ago`;
  if (absDays < 365) return `${Math.floor(absDays / 30)} months ago`;
  const years = Math.floor(absDays / 365);
  return `${years} ${years === 1 ? 'year' : 'years'} ago`;
}

/**
 * Returns the exact Date of the Nth anniversary of weddingDate.
 *
 * @param {Date} weddingDate
 * @param {number} year  – e.g. 5 for the 5th anniversary
 * @returns {Date|null}
 */
export function getAnniversaryYear(weddingDate, year) {
  if (!weddingDate || !(weddingDate instanceof Date) || isNaN(weddingDate)) {
    return null;
  }
  return addYears(weddingDate, year);
}

/**
 * Returns a { start, end } date range centered on centerDate.
 *
 * @param {Date} centerDate
 * @param {number} daysBefore
 * @param {number} daysAfter
 * @returns {{ start: Date|null, end: Date|null }}
 */
export function getDateRange(centerDate, daysBefore, daysAfter) {
  if (!centerDate || !(centerDate instanceof Date) || isNaN(centerDate)) {
    return { start: null, end: null };
  }
  return {
    start: subDays(centerDate, daysBefore),
    end: addDays(centerDate, daysAfter),
  };
}

/**
 * Returns a formatted date string like "June 15, 2019".
 *
 * @param {Date} date
 * @returns {string}
 */
export function formatDateForDisplay(date) {
  if (!date || !(date instanceof Date) || isNaN(date)) return '';
  return format(date, 'MMMM d, yyyy');
}

/**
 * Returns true if today is the anniversary of weddingDate
 * (same month and day, any year).
 *
 * @param {Date} weddingDate
 * @returns {boolean}
 */
export function isAnniversaryToday(weddingDate) {
  if (!weddingDate || !(weddingDate instanceof Date) || isNaN(weddingDate)) {
    return false;
  }

  const today = new Date();
  return (
    weddingDate.getMonth() === today.getMonth() &&
    weddingDate.getDate() === today.getDate()
  );
}
