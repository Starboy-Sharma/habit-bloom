/**
 * localStorage Service — centralized CRUD for all entities
 * Designed to be swappable with an API service later
 */

const KEYS = {
    USER: 'ht_user',
    HABITS: 'ht_habits',
    DAILY_LOGS: 'ht_daily_logs',
    STREAK: 'ht_streak',
    GARDEN: 'ht_garden',
    THEME: 'ht_theme',
    SOUND: 'ht_sound',
};

const read = (key, fallback = null) => {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
    } catch {
        return fallback;
    }
};

const write = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
        console.error('LocalStorage write failed:', e);
    }
};

// ─── User ───────────────────────────────────────────────────────────────────
export const getUser = () => read(KEYS.USER);
export const saveUser = (user) => write(KEYS.USER, user);
export const clearUser = () => localStorage.removeItem(KEYS.USER);

// ─── Habits ─────────────────────────────────────────────────────────────────
export const getHabits = () => read(KEYS.HABITS, []);
export const saveHabits = (habits) => write(KEYS.HABITS, habits);

// ─── Daily Logs ─────────────────────────────────────────────────────────────
export const getDailyLogs = () => read(KEYS.DAILY_LOGS, []);
export const saveDailyLogs = (logs) => write(KEYS.DAILY_LOGS, logs);

// ─── Streak ─────────────────────────────────────────────────────────────────
export const getStreak = () => read(KEYS.STREAK);
export const saveStreak = (streak) => write(KEYS.STREAK, streak);

// ─── Garden ─────────────────────────────────────────────────────────────────
export const getGarden = () => read(KEYS.GARDEN);
export const saveGarden = (garden) => write(KEYS.GARDEN, garden);

// ─── Preferences ─────────────────────────────────────────────────────────────
export const getTheme = () => read(KEYS.THEME, 'light');
export const saveTheme = (theme) => write(KEYS.THEME, theme);
export const getSoundEnabled = () => read(KEYS.SOUND, true);
export const saveSoundEnabled = (val) => write(KEYS.SOUND, val);

// ─── Reset ───────────────────────────────────────────────────────────────────
export const clearAll = () => {
    Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
};
