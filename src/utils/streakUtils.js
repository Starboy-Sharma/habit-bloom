import { daysBetween, getTodayString, getYesterdayString } from './dateUtils';

/**
 * Check if all habits are completed for a given date's log
 */
export const isAllComplete = (dailyLog, habits) => {
    if (!dailyLog || !habits.length) return false;
    return habits.every((habit) => {
        const entry = dailyLog.entries.find((e) => e.habitId === habit.id);
        if (!entry) return false;
        if (habit.type === 'numeric') {
            return entry.completed && entry.value >= habit.target;
        }
        return entry.completed;
    });
};

/**
 * Get the log for a specific date
 */
export const getLogForDate = (dailyLogs, date) => {
    return dailyLogs.find((log) => log.date === date) || null;
};

/**
 * Calculate current and longest streak from daily logs
 */
export const calculateStreak = (dailyLogs, habits) => {
    if (!habits.length) return { current: 0, longest: 0, lastCompletedDate: null, history: [] };

    // Build set of dates where all habits were completed
    const completedDates = new Set();
    for (const log of dailyLogs) {
        if (isAllComplete(log, habits)) {
            completedDates.add(log.date);
        }
    }

    const history = Array.from(completedDates).sort();

    // Calculate current streak (working backwards from today)
    let current = 0;
    const today = getTodayString();
    const yesterday = getYesterdayString();

    // Check if today or yesterday is completed (to not break streak at midnight)
    let checkDate = completedDates.has(today) ? today : yesterday;

    if (completedDates.has(checkDate)) {
        current = 1;
        let prev = new Date(checkDate.replace(/-/g, '/'));
        while (true) {
            prev.setDate(prev.getDate() - 1);
            const prevStr = prev.toISOString().split('T')[0];
            if (completedDates.has(prevStr)) {
                current++;
            } else {
                break;
            }
        }
    }

    // Calculate longest streak
    let longest = 0;
    let run = 0;
    for (let i = 0; i < history.length; i++) {
        if (i === 0) {
            run = 1;
        } else {
            const diff = daysBetween(history[i - 1], history[i]);
            if (diff === 1) {
                run++;
            } else {
                run = 1;
            }
        }
        if (run > longest) longest = run;
    }
    if (current > longest) longest = current;

    const lastCompletedDate = history.length ? history[history.length - 1] : null;

    return { current, longest, lastCompletedDate, history };
};

/**
 * Get completion data for the last 7 days
 * Returns array of { date, completed, pct }
 */
export const getWeeklyData = (dailyLogs, habits) => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const log = dailyLogs.find((l) => l.date === dateStr);
        let pct = 0;
        if (log && habits.length > 0) {
            const completed = log.entries.filter((e) => e.completed).length;
            pct = Math.round((completed / habits.length) * 100);
        }
        days.push({
            date: dateStr,
            label: d.toLocaleDateString('en-US', { weekday: 'short' }),
            completed: pct === 100,
            pct,
        });
    }
    return days;
};

/**
 * How many flowers should exist based on current streak history
 * (1 flower per 7 consecutive days)
 */
export const getFlowerCount = (streakHistory) => {
    return Math.floor(streakHistory.length / 7);
};

/**
 * Get completion percentage for a given log and habit list
 */
export const getCompletionPct = (dailyLog, habits) => {
    if (!dailyLog || !habits.length) return 0;
    const completed = dailyLog.entries.filter((e) => e.completed).length;
    return Math.round((completed / habits.length) * 100);
};
