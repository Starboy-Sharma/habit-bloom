/**
 * Data Models for Habit Tracker
 */

/**
 * @typedef {Object} User
 * @property {string} name
 * @property {number} age
 * @property {string} timezone
 * @property {string} goalFocus - 'Fitness' | 'Study' | 'Coding' | 'Reading' | 'Custom'
 * @property {string} createdAt - ISO date string
 */

/**
 * @typedef {Object} Habit
 * @property {string} id
 * @property {string} name
 * @property {string} icon - emoji
 * @property {'boolean'|'numeric'} type
 * @property {number|null} target - for numeric type
 * @property {string|null} unit - e.g. 'minutes', 'pages'
 * @property {string} color - hex color
 * @property {string} createdAt - ISO date string
 */

/**
 * @typedef {Object} LogEntry
 * @property {string} habitId
 * @property {boolean} completed
 * @property {number|null} value - for numeric type
 * @property {string} comment
 * @property {string|null} completedAt - ISO date string
 */

/**
 * @typedef {Object} DailyLog
 * @property {string} date - YYYY-MM-DD
 * @property {LogEntry[]} entries
 */

/**
 * @typedef {Object} Streak
 * @property {number} current
 * @property {number} longest
 * @property {string|null} lastCompletedDate - YYYY-MM-DD
 * @property {string[]} history - array of YYYY-MM-DD strings where all habits completed
 */

/**
 * @typedef {Object} Flower
 * @property {string} id
 * @property {number} type - 0-4, flower variety
 * @property {number} x - canvas x position (0-1 normalized)
 * @property {number} y - canvas y position (0-1 normalized)
 * @property {string} bloomedAt - ISO date string
 * @property {number} streakMilestone - which 7-day milestone triggered this
 */

/**
 * @typedef {Object} Garden
 * @property {Flower[]} flowers
 */

export const createUser = (data) => ({
    name: data.name,
    age: parseInt(data.age),
    timezone: data.timezone,
    goalFocus: data.goalFocus,
    createdAt: new Date().toISOString(),
});

export const createHabit = (data) => ({
    id: `habit_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    name: data.name,
    icon: data.icon || '✨',
    type: data.type || 'boolean',
    target: data.type === 'numeric' ? Number(data.target) : null,
    unit: data.type === 'numeric' ? data.unit : null,
    color: data.color || '#a78bfa',
    createdAt: new Date().toISOString(),
});

export const createDailyLog = (date) => ({
    date,
    entries: [],
});

export const createLogEntry = (habitId) => ({
    habitId,
    completed: false,
    value: null,
    comment: '',
    completedAt: null,
});

export const createFlower = (streakMilestone) => ({
    id: `flower_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    type: Math.floor(Math.random() * 5),
    x: 0.05 + Math.random() * 0.9,
    y: 0.4 + Math.random() * 0.45,
    bloomedAt: new Date().toISOString(),
    streakMilestone,
});

export const defaultStreak = () => ({
    current: 0,
    longest: 0,
    lastCompletedDate: null,
    history: [],
});

export const defaultGarden = () => ({
    flowers: [],
});
