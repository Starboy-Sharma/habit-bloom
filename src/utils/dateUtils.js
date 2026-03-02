/**
 * Date utilities for Habit Tracker
 */

/**
 * Get today's date as YYYY-MM-DD string
 */
export const getTodayString = () => {
    const now = new Date();
    return formatDateString(now);
};

/**
 * Format a Date object to YYYY-MM-DD
 */
export const formatDateString = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
};

/**
 * Parse a YYYY-MM-DD string to a Date (local timezone)
 */
export const parseDate = (str) => {
    const [y, m, d] = str.split('-').map(Number);
    return new Date(y, m - 1, d);
};

/**
 * Get the difference in calendar days between two YYYY-MM-DD strings
 */
export const daysBetween = (dateStr1, dateStr2) => {
    const d1 = parseDate(dateStr1);
    const d2 = parseDate(dateStr2);
    return Math.round((d2 - d1) / (1000 * 60 * 60 * 24));
};

/**
 * Get yesterday's date string
 */
export const getYesterdayString = () => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return formatDateString(d);
};

/**
 * Get an array of the last N days as YYYY-MM-DD strings (most recent last)
 */
export const getLastNDays = (n) => {
    const days = [];
    for (let i = n - 1; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        days.push(formatDateString(d));
    }
    return days;
};

/**
 * Get all YYYY-MM-DD dates in a given month
 */
export const getDaysInMonth = (year, month) => {
    const days = [];
    const date = new Date(year, month, 1);
    while (date.getMonth() === month) {
        days.push(formatDateString(new Date(date)));
        date.setDate(date.getDate() + 1);
    }
    return days;
};

/**
 * Get day-of-week abbreviation (Mon, Tue, ...)
 */
export const getDayLabel = (dateStr) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[parseDate(dateStr).getDay()];
};

/**
 * Format a date string for display: "March 1, 2026"
 */
export const formatDisplayDate = (dateStr) => {
    const d = parseDate(dateStr);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

/**
 * Get month name from number (0-indexed)
 */
export const getMonthName = (monthIndex) => {
    return new Date(2000, monthIndex, 1).toLocaleString('en-US', { month: 'long' });
};
