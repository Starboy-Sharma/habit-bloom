import React, { createContext, useContext, useReducer, useEffect } from 'react';
import {
    getUser, saveUser,
    getHabits, saveHabits,
    getDailyLogs, saveDailyLogs,
    getStreak, saveStreak,
    getGarden, saveGarden,
    getTheme, saveTheme,
    getSoundEnabled, saveSoundEnabled,
} from '../services/localStorage';
import { defaultStreak, defaultGarden } from '../models';
import { calculateStreak, getFlowerCount } from '../utils/streakUtils';
import { createFlower } from '../models';
import { getTodayString } from '../utils/dateUtils';

const AppContext = createContext(null);

const initialState = {
    user: null,
    habits: [],
    dailyLogs: [],
    streak: defaultStreak(),
    garden: defaultGarden(),
    theme: 'light',
    soundEnabled: true,
    isLoading: true,
};

function reducer(state, action) {
    switch (action.type) {
        case 'INIT':
            return { ...state, ...action.payload, isLoading: false };

        case 'SET_USER':
            saveUser(action.payload);
            return { ...state, user: action.payload };

        case 'ADD_HABIT': {
            const habits = [...state.habits, action.payload];
            saveHabits(habits);
            return { ...state, habits };
        }

        case 'UPDATE_HABIT': {
            const habits = state.habits.map((h) =>
                h.id === action.payload.id ? action.payload : h
            );
            saveHabits(habits);
            return { ...state, habits };
        }

        case 'DELETE_HABIT': {
            const habits = state.habits.filter((h) => h.id !== action.payload);
            saveHabits(habits);
            return { ...state, habits };
        }

        case 'LOG_HABIT_ENTRY': {
            const { date, entry } = action.payload;
            let logs = [...state.dailyLogs];
            let logIndex = logs.findIndex((l) => l.date === date);

            if (logIndex === -1) {
                logs.push({ date, entries: [entry] });
            } else {
                const entries = [...logs[logIndex].entries];
                const eIdx = entries.findIndex((e) => e.habitId === entry.habitId);
                if (eIdx === -1) {
                    entries.push(entry);
                } else {
                    entries[eIdx] = entry;
                }
                logs[logIndex] = { ...logs[logIndex], entries };
            }

            saveDailyLogs(logs);

            // Recalculate streak
            const newStreak = calculateStreak(logs, state.habits);

            // Check for new flowers (every 7 days milestone)
            let garden = state.garden;
            const existingFlowerCount = garden.flowers.length;
            const expectedFlowerCount = getFlowerCount(newStreak.history);
            if (expectedFlowerCount > existingFlowerCount) {
                const newFlowers = [];
                for (let i = existingFlowerCount; i < expectedFlowerCount; i++) {
                    newFlowers.push(createFlower(i + 1));
                }
                garden = { ...garden, flowers: [...garden.flowers, ...newFlowers] };
                saveGarden(garden);
            }

            saveStreak(newStreak);
            return { ...state, dailyLogs: logs, streak: newStreak, garden };
        }

        case 'SET_THEME': {
            saveTheme(action.payload);
            return { ...state, theme: action.payload };
        }

        case 'SET_SOUND': {
            saveSoundEnabled(action.payload);
            return { ...state, soundEnabled: action.payload };
        }

        default:
            return state;
    }
}

export function AppProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        const user = getUser();
        const habits = getHabits();
        const dailyLogs = getDailyLogs();
        const streakData = getStreak() || defaultStreak();
        const gardenData = getGarden() || defaultGarden();
        const theme = getTheme();
        const soundEnabled = getSoundEnabled();

        dispatch({
            type: 'INIT',
            payload: { user, habits, dailyLogs, streak: streakData, garden: gardenData, theme, soundEnabled },
        });
    }, []);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', state.theme);
    }, [state.theme]);

    return (
        <AppContext.Provider value={{ state, dispatch }}>
            {children}
        </AppContext.Provider>
    );
}

export const useApp = () => {
    const ctx = useContext(AppContext);
    if (!ctx) throw new Error('useApp must be used within AppProvider');
    return ctx;
};

// Convenience selectors
export const useUser = () => useApp().state.user;
export const useHabits = () => useApp().state.habits;
export const useDailyLogs = () => useApp().state.dailyLogs;
export const useStreak = () => useApp().state.streak;
export const useGarden = () => useApp().state.garden;
export const useTheme = () => {
    const { state, dispatch } = useApp();
    const toggle = () => dispatch({ type: 'SET_THEME', payload: state.theme === 'light' ? 'dark' : 'light' });
    return { theme: state.theme, toggleTheme: toggle };
};
export const useSound = () => {
    const { state, dispatch } = useApp();
    const toggle = () => dispatch({ type: 'SET_SOUND', payload: !state.soundEnabled });
    return { soundEnabled: state.soundEnabled, toggleSound: toggle };
};
export const useTodayLog = () => {
    const { dailyLogs } = useApp().state;
    const today = getTodayString();
    return dailyLogs.find((l) => l.date === today) || { date: today, entries: [] };
};
