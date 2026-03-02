import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp, useHabits } from '../context/AppContext';
import { createHabit } from '../models';
import HabitCard from '../components/habits/HabitCard';
import HabitForm from '../components/habits/HabitForm';

export default function HabitSetup() {
    const { dispatch } = useApp();
    const habits = useHabits();
    const navigate = useNavigate();
    const [showForm, setShowForm] = useState(!habits.length);
    const [editingHabit, setEditingHabit] = useState(null);

    const addHabit = (data) => {
        dispatch({ type: 'ADD_HABIT', payload: createHabit(data) });
        setShowForm(false);
    };

    const updateHabit = (data) => {
        dispatch({ type: 'UPDATE_HABIT', payload: data });
        setEditingHabit(null);
    };

    const deleteHabit = (id) => {
        if (window.confirm('Delete this habit?')) {
            dispatch({ type: 'DELETE_HABIT', payload: id });
        }
    };

    return (
        <motion.div
            className="page"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
        >
            <div className="flex items-center justify-between" style={{ marginBottom: 24 }}>
                <div>
                    <h1 className="page-title">My Habits ✅</h1>
                    <p className="page-subtitle">Define what you want to track daily</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowForm(true)}>
                    + Add Habit
                </button>
            </div>

            {habits.length === 0 ? (
                <div className="empty-state card">
                    <div className="empty-state-icon">🌱</div>
                    <div className="empty-state-title">No habits yet</div>
                    <p className="empty-state-text">Add your first habit below to start tracking your daily progress and building streaks!</p>
                    <button className="btn btn-primary" onClick={() => setShowForm(true)}>Add Your First Habit</button>
                </div>
            ) : (
                <>
                    <AnimatePresence>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {habits.map((habit) => (
                                <HabitCard
                                    key={habit.id}
                                    habit={habit}
                                    onEdit={(h) => setEditingHabit(h)}
                                    onDelete={deleteHabit}
                                />
                            ))}
                        </div>
                    </AnimatePresence>

                    <div style={{ marginTop: 24, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                        <button className="btn btn-secondary" onClick={() => setShowForm(true)}>+ Add Another Habit</button>
                        <button className="btn btn-primary" onClick={() => navigate('/')}>
                            Go to Dashboard →
                        </button>
                    </div>
                </>
            )}

            {/* Add habit modal */}
            {showForm && (
                <HabitForm onSave={addHabit} onClose={() => setShowForm(false)} />
            )}

            {/* Edit habit modal */}
            {editingHabit && (
                <HabitForm initial={editingHabit} onSave={updateHabit} onClose={() => setEditingHabit(null)} />
            )}
        </motion.div>
    );
}
