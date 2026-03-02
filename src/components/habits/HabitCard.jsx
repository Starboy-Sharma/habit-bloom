import { motion } from 'framer-motion';

export default function HabitCard({ habit, onEdit, onDelete }) {
    return (
        <motion.div
            className="habit-card"
            layout
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16, scale: 0.95 }}
            whileHover={{ y: -2 }}
            transition={{ type: 'spring', stiffness: 200, damping: 22 }}
        >
            <div
                className="habit-icon-circle"
                style={{ background: `${habit.color}22`, color: habit.color }}
            >
                {habit.icon}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--text)', marginBottom: 3 }}>
                    {habit.name}
                </div>
                <div className="flex items-center gap-2">
                    <span className={`badge ${habit.type === 'boolean' ? 'badge-primary' : 'badge-warning'}`}>
                        {habit.type === 'boolean' ? '✅ Yes/No' : `🔢 ${habit.target} ${habit.unit}`}
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <motion.button
                    className="btn btn-ghost btn-icon btn-sm"
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onEdit(habit)}
                    title="Edit habit"
                >
                    ✏️
                </motion.button>
                <motion.button
                    className="btn btn-danger btn-icon btn-sm"
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onDelete(habit.id)}
                    title="Delete habit"
                >
                    🗑️
                </motion.button>
            </div>
        </motion.div>
    );
}
