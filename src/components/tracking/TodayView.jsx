import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp, useHabits, useTodayLog } from '../../context/AppContext';
import { getTodayString } from '../../utils/dateUtils';
import CommentModal from './CommentModal';

export default function TodayView({ onComplete }) {
    const { dispatch } = useApp();
    const habits = useHabits();
    const todayLog = useTodayLog();
    const today = getTodayString();
    const [skipModal, setSkipModal] = useState(null); // habitId
    const [numericValues, setNumericValues] = useState({});
    const [justCompleted, setJustCompleted] = useState(null);

    const getEntry = (habitId) => todayLog.entries.find((e) => e.habitId === habitId);

    const logEntry = (habitId, completed, extra = {}) => {
        dispatch({
            type: 'LOG_HABIT_ENTRY',
            payload: {
                date: today,
                entry: {
                    habitId,
                    completed,
                    value: extra.value ?? null,
                    comment: extra.comment ?? '',
                    completedAt: completed ? new Date().toISOString() : null,
                },
            },
        });
        if (completed) {
            setJustCompleted(habitId);
            setTimeout(() => setJustCompleted(null), 1200);
            onComplete && onComplete();
        }
    };

    const toggleBoolean = (habit) => {
        const entry = getEntry(habit.id);
        if (entry?.completed) {
            // Unmark
            logEntry(habit.id, false);
        } else {
            logEntry(habit.id, true);
        }
    };

    const handleNumericSave = (habit) => {
        const val = Number(numericValues[habit.id] || 0);
        logEntry(habit.id, val >= habit.target, { value: val });
    };

    const handleSkip = (habit, comment) => {
        logEntry(habit.id, false, { comment });
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <AnimatePresence>
                {habits.map((habit) => {
                    const entry = getEntry(habit.id);
                    const isCompleted = entry?.completed;
                    const isJust = justCompleted === habit.id;

                    return (
                        <motion.div
                            key={habit.id}
                            className={`track-item ${isCompleted ? 'completed' : ''}`}
                            layout
                            initial={{ opacity: 0, x: -16 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 16 }}
                            whileHover={{ scale: 1.005 }}
                            transition={{ type: 'spring', stiffness: 200, damping: 24 }}
                        >
                            {/* Icon */}
                            <div
                                className="habit-icon-circle"
                                style={{ background: `${habit.color}22`, color: habit.color, width: 38, height: 38, fontSize: 18 }}
                            >
                                {habit.icon}
                            </div>

                            {/* Name + progress */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontWeight: 800, fontSize: 14, color: 'var(--text)', marginBottom: 2 }}>
                                    {habit.name}
                                </div>
                                {habit.type === 'numeric' && (
                                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                                        Target: {habit.target} {habit.unit}
                                        {entry?.value != null && ` · Done: ${entry.value}`}
                                    </div>
                                )}
                                {entry?.comment && (
                                    <div style={{ fontSize: 11, color: 'var(--text-muted)', fontStyle: 'italic' }}>
                                        "{entry.comment}"
                                    </div>
                                )}
                            </div>

                            {/* Control */}
                            {habit.type === 'boolean' ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <motion.button
                                        className={`track-checkbox ${isCompleted ? 'checked' : ''}`}
                                        whileTap={{ scale: 0.85 }}
                                        animate={isJust ? { scale: [1, 1.35, 1] } : {}}
                                        onClick={() => toggleBoolean(habit)}
                                    >
                                        {isCompleted ? '✓' : ''}
                                    </motion.button>
                                    {!isCompleted && (
                                        <button
                                            className="btn btn-ghost btn-sm"
                                            style={{ fontSize: 11, padding: '4px 8px' }}
                                            onClick={() => setSkipModal(habit)}
                                            title="Skip with note"
                                        >
                                            Skip
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div className="numeric-input-wrap">
                                    <button
                                        className="numeric-stepper"
                                        onClick={() => setNumericValues((prev) => ({ ...prev, [habit.id]: Math.max(0, (prev[habit.id] || entry?.value || 0) - 1) }))}
                                    >−</button>
                                    <span className="numeric-value">{numericValues[habit.id] ?? entry?.value ?? 0}</span>
                                    <button
                                        className="numeric-stepper"
                                        onClick={() => setNumericValues((prev) => ({ ...prev, [habit.id]: (prev[habit.id] || entry?.value || 0) + 1 }))}
                                    >+</button>
                                    <button
                                        className="btn btn-primary btn-sm"
                                        style={{ marginLeft: 6 }}
                                        onClick={() => handleNumericSave(habit)}
                                    >
                                        {isCompleted ? '✓' : 'Log'}
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </AnimatePresence>

            {skipModal && (
                <CommentModal
                    habit={skipModal}
                    onSkip={(comment) => handleSkip(skipModal, comment)}
                    onClose={() => setSkipModal(null)}
                />
            )}
        </div>
    );
}
