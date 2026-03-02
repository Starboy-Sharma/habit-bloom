import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { createUser } from '../models';

const GOAL_OPTIONS = [
    { value: 'Fitness', icon: '💪', desc: 'Build strength & health' },
    { value: 'Study', icon: '📚', desc: 'Learn and grow' },
    { value: 'Coding', icon: '💻', desc: 'Ship great software' },
    { value: 'Reading', icon: '📖', desc: 'Expand your mind' },
    { value: 'Custom', icon: '✨', desc: 'Your own journey' },
];

const TIMEZONES = [
    'UTC', 'America/New_York', 'America/Chicago', 'America/Los_Angeles',
    'Europe/London', 'Europe/Paris', 'Asia/Kolkata', 'Asia/Tokyo',
    'Australia/Sydney', 'Pacific/Auckland',
];

const steps = ['welcome', 'personal', 'focus'];

const pageVariants = {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
};

export default function Onboarding() {
    const navigate = useNavigate();
    const { dispatch } = useApp();
    const [step, setStep] = useState(0);
    const [form, setForm] = useState({ name: '', age: '', timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC', goalFocus: '' });
    const [errors, setErrors] = useState({});

    const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

    const validate = () => {
        const e = {};
        if (step === 1) {
            if (!form.name.trim()) e.name = 'Name is required';
            if (!form.age || isNaN(form.age) || Number(form.age) < 5 || Number(form.age) > 120) e.age = 'Please enter a valid age';
        }
        if (step === 2) {
            if (!form.goalFocus) e.goalFocus = 'Pick a focus to continue';
        }
        setErrors(e);
        return !Object.keys(e).length;
    };

    const next = () => {
        if (!validate()) return;
        if (step < steps.length - 1) setStep((s) => s + 1);
        else {
            dispatch({ type: 'SET_USER', payload: createUser(form) });
            navigate('/habits');
        }
    };

    return (
        <div className="onboarding-page">
            <motion.div
                className="onboarding-card"
                initial={{ opacity: 0, y: 30, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, type: 'spring', stiffness: 160 }}
            >
                {/* Step indicators */}
                <div className="flex items-center justify-center gap-2 mt-2" style={{ marginBottom: '28px' }}>
                    {steps.map((_, i) => (
                        <div key={i} style={{
                            height: 5, borderRadius: 99,
                            background: i <= step ? 'var(--primary)' : 'var(--border)',
                            transition: 'all 0.4s',
                            width: i === step ? 28 : 10,
                        }} />
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {step === 0 && (
                        <motion.div key="welcome" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }}>
                            <div className="text-center">
                                <div style={{ fontSize: 72, marginBottom: 16 }} className="animate-float">🌱</div>
                                <h1 className="page-title" style={{ marginBottom: 8 }}>Welcome to HabitBloom</h1>
                                <p className="page-subtitle" style={{ fontSize: 15, marginBottom: 28 }}>
                                    Build powerful daily habits, track your streaks, and watch your garden bloom as you grow. 🌸
                                </p>
                                <button className="btn btn-primary btn-lg w-full" onClick={next}>
                                    Let's Get Started ✨
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {step === 1 && (
                        <motion.div key="personal" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }}>
                            <h2 className="page-title" style={{ marginBottom: 6 }}>Tell us about you</h2>
                            <p className="page-subtitle" style={{ marginBottom: 24 }}>We'll personalize your experience.</p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                <div className="form-group">
                                    <label className="form-label">Your Name</label>
                                    <input
                                        className="form-input"
                                        placeholder="e.g. Alex Rivera"
                                        value={form.name}
                                        onChange={(e) => set('name', e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && next()}
                                        autoFocus
                                    />
                                    {errors.name && <span className="form-error">{errors.name}</span>}
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Age</label>
                                    <input
                                        className="form-input"
                                        type="number"
                                        placeholder="e.g. 25"
                                        value={form.age}
                                        min="5" max="120"
                                        onChange={(e) => set('age', e.target.value)}
                                    />
                                    {errors.age && <span className="form-error">{errors.age}</span>}
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Timezone</label>
                                    <select className="form-select" value={form.timezone} onChange={(e) => set('timezone', e.target.value)}>
                                        {TIMEZONES.map((tz) => (
                                            <option key={tz} value={tz}>{tz}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button className="btn btn-secondary" onClick={() => setStep(0)}>← Back</button>
                                <button className="btn btn-primary w-full" onClick={next}>Continue →</button>
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div key="focus" variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }}>
                            <h2 className="page-title" style={{ marginBottom: 6 }}>What's your main focus?</h2>
                            <p className="page-subtitle" style={{ marginBottom: 20 }}>Choose what you want to improve most.</p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                {GOAL_OPTIONS.map(({ value, icon, desc }) => (
                                    <motion.button
                                        key={value}
                                        whileTap={{ scale: 0.97 }}
                                        whileHover={{ scale: 1.01 }}
                                        onClick={() => set('goalFocus', value)}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px',
                                            borderRadius: 'var(--radius-md)', border: `2px solid ${form.goalFocus === value ? 'var(--primary)' : 'var(--border)'}`,
                                            background: form.goalFocus === value ? 'var(--lavender)' : 'var(--surface)',
                                            cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left',
                                        }}
                                    >
                                        <span style={{ fontSize: 28 }}>{icon}</span>
                                        <div>
                                            <div style={{ fontWeight: 700, color: form.goalFocus === value ? 'var(--primary)' : 'var(--text)', fontSize: 15 }}>{value}</div>
                                            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{desc}</div>
                                        </div>
                                        {form.goalFocus === value && <span style={{ marginLeft: 'auto', color: 'var(--primary)', fontSize: 18 }}>✓</span>}
                                    </motion.button>
                                ))}
                            </div>
                            {errors.goalFocus && <p className="form-error mt-2">{errors.goalFocus}</p>}

                            <div className="flex gap-3 mt-6">
                                <button className="btn btn-secondary" onClick={() => setStep(1)}>← Back</button>
                                <button className="btn btn-primary w-full" onClick={next}>Start Blooming 🌸</button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
