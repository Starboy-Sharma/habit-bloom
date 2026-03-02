import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const HABIT_EMOJIS = [
    '💪', '📚', '💻', '📖', '🏃', '🧘', '💧', '🛌', '🥗', '🎯',
    '✍️', '🎸', '🧹', '💊', '🧠', '🌿', '🏋️', '🚴', '🎨', '🎵',
    '🌅', '🍎', '☕', '🦷', '🪴', '📝', '🏊', '🤸', '🧶', '🎭',
];

const HABIT_COLORS = [
    '#a78bfa', '#f472b6', '#34d399', '#60a5fa', '#fbbf24', '#f87171',
    '#818cf8', '#a3e635', '#2dd4bf', '#fb923c', '#e879f9', '#4ade80',
];

export default function HabitForm({ initial, onSave, onClose }) {
    const [form, setForm] = useState({
        name: initial?.name || '',
        icon: initial?.icon || '✨',
        type: initial?.type || 'boolean',
        target: initial?.target || '',
        unit: initial?.unit || '',
        color: initial?.color || HABIT_COLORS[0],
        ...initial,
    });
    const [errors, setErrors] = useState({});

    const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

    const validate = () => {
        const e = {};
        if (!form.name.trim()) e.name = 'Habit name is required';
        if (form.type === 'numeric') {
            if (!form.target || isNaN(form.target) || Number(form.target) <= 0) e.target = 'Enter a valid target number';
            if (!form.unit.trim()) e.unit = 'Unit is required';
        }
        setErrors(e);
        return !Object.keys(e).length;
    };

    const handleSave = () => {
        if (!validate()) return;
        onSave({ ...form, target: form.type === 'numeric' ? Number(form.target) : null });
    };

    return (
        <AnimatePresence>
            <motion.div
                className="modal-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={(e) => e.target === e.currentTarget && onClose()}
            >
                <motion.div
                    className="modal-box"
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 22 }}
                >
                    <div className="flex items-center justify-between" style={{ marginBottom: 20 }}>
                        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, color: 'var(--text)' }}>
                            {initial ? '✏️ Edit Habit' : '✨ New Habit'}
                        </h2>
                        <button className="btn btn-ghost btn-icon" onClick={onClose}>✕</button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {/* Name */}
                        <div className="form-group">
                            <label className="form-label">Habit Name</label>
                            <input
                                className="form-input"
                                placeholder="e.g. Morning Run"
                                value={form.name}
                                onChange={(e) => set('name', e.target.value)}
                                autoFocus
                            />
                            {errors.name && <span className="form-error">{errors.name}</span>}
                        </div>

                        {/* Icon Picker */}
                        <div className="form-group">
                            <label className="form-label">Icon</label>
                            <div className="emoji-grid">
                                {HABIT_EMOJIS.map((e) => (
                                    <button key={e} className={`emoji-btn ${form.icon === e ? 'selected' : ''}`} onClick={() => set('icon', e)} type="button">
                                        {e}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Color Picker */}
                        <div className="form-group">
                            <label className="form-label">Color</label>
                            <div className="color-swatches">
                                {HABIT_COLORS.map((c) => (
                                    <div key={c} className={`color-swatch ${form.color === c ? 'selected' : ''}`} style={{ background: c }} onClick={() => set('color', c)} />
                                ))}
                            </div>
                        </div>

                        {/* Tracking Type */}
                        <div className="form-group">
                            <label className="form-label">Tracking Type</label>
                            <div style={{ display: 'flex', gap: 10 }}>
                                {['boolean', 'numeric'].map((t) => (
                                    <button
                                        key={t}
                                        type="button"
                                        onClick={() => set('type', t)}
                                        style={{
                                            flex: 1, padding: '10px', borderRadius: 'var(--radius-md)',
                                            border: `2px solid ${form.type === t ? 'var(--primary)' : 'var(--border)'}`,
                                            background: form.type === t ? 'var(--lavender)' : 'var(--surface)',
                                            fontWeight: 700, fontSize: 13, cursor: 'pointer',
                                            color: form.type === t ? 'var(--primary)' : 'var(--text-secondary)',
                                            transition: 'all 0.2s',
                                        }}
                                    >
                                        {t === 'boolean' ? '✅ Yes / No' : '🔢 Numeric'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Numeric settings */}
                        {form.type === 'numeric' && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}
                            >
                                <div className="form-group">
                                    <label className="form-label">Daily Target</label>
                                    <input className="form-input" type="number" min="1" value={form.target} onChange={(e) => set('target', e.target.value)} />
                                    {errors.target && <span className="form-error">{errors.target}</span>}
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Unit</label>
                                    <input className="form-input" placeholder="minutes, pages..." value={form.unit} onChange={(e) => set('unit', e.target.value)} />
                                    {errors.unit && <span className="form-error">{errors.unit}</span>}
                                </div>
                            </motion.div>
                        )}
                    </div>

                    <div className="flex gap-3 mt-6">
                        <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
                        <button className="btn btn-primary w-full" onClick={handleSave}>
                            {initial ? 'Save Changes ✓' : 'Add Habit ✨'}
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
