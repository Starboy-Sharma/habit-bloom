import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useHabits, useTodayLog, useStreak, useDailyLogs } from '../context/AppContext';
import { getCompletionPct, getWeeklyData } from '../utils/streakUtils';
import { getDailyQuote } from '../utils/quoteUtils';
import { formatDisplayDate, getTodayString } from '../utils/dateUtils';
import TodayView from '../components/tracking/TodayView';
import ProgressRing from '../components/common/ProgressRing';

export default function Dashboard() {
    const habits = useHabits();
    const todayLog = useTodayLog();
    const streak = useStreak();
    const dailyLogs = useDailyLogs();

    const [quote, setQuote] = useState(getDailyQuote());
    const pct = getCompletionPct(todayLog, habits);
    const weeklyData = getWeeklyData(dailyLogs, habits);

    useEffect(() => {
        setQuote(getDailyQuote());
    }, []);

    const handleComplete = () => {
        // Check if new completion pushes it to 100%
        const newPct = getCompletionPct(todayLog, habits);
        if (newPct === 100 && pct < 100) {
            fireConfetti();
        }
    };

    const fireConfetti = () => {
        const duration = 3 * 1000;
        const end = Date.now() + duration;

        const frame = () => {
            confetti({
                particleCount: 5, angle: 60, spread: 55, origin: { x: 0 },
                colors: ['#7c3aed', '#ec4899', '#34d399']
            });
            confetti({
                particleCount: 5, angle: 120, spread: 55, origin: { x: 1 },
                colors: ['#7c3aed', '#ec4899', '#34d399']
            });
            if (Date.now() < end) requestAnimationFrame(frame);
        };
        frame();
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
                    <h1 className="page-title">Dashboard</h1>
                    <p className="page-subtitle">{formatDisplayDate(getTodayString())}</p>
                </div>
            </div>

            <div className="dashboard-grid">
                {/* Left Col: Today's Tracking */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                    <div className="card">
                        <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
                            <h2 className="section-title" style={{ margin: 0 }}>Today's Plan</h2>
                            <span className="badge badge-primary">{habits.length} Habits</span>
                        </div>

                        <TodayView onComplete={handleComplete} />

                        {habits.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text-secondary)' }}>
                                No habits to track today. Add some to get started!
                            </div>
                        )}
                    </div>

                    <div className="quote-card animate-float">
                        <div className="quote-text">"{quote.text}"</div>
                        <div className="quote-author">— {quote.author}</div>
                        <div style={{ position: 'absolute', right: -20, bottom: -20, fontSize: 100, opacity: 0.1, transform: 'rotate(15deg)' }}>
                            ✨
                        </div>
                    </div>
                </div>

                {/* Right Col: Stats */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                    {/* Progress Ring Card */}
                    <div className="card flex-col items-center justify-center text-center" style={{ padding: '32px 24px' }}>
                        <ProgressRing pct={pct} size={160} strokeWidth={14} color={pct === 100 ? 'var(--success-light)' : 'var(--primary)'}>
                            <div style={{ fontSize: 36, fontWeight: 900, fontFamily: 'var(--font-display)', color: 'var(--text)' }}>
                                {pct}%
                            </div>
                            <div style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 700 }}>
                                {pct === 100 ? 'All done! 🎉' : 'Completed'}
                            </div>
                        </ProgressRing>
                    </div>

                    {/* Streaks Card */}
                    <div className="card grid-2">
                        <div>
                            <div style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 700, marginBottom: 4 }}>Current Streak</div>
                            <div className="streak-display">
                                🔥 {streak.current} <span style={{ fontSize: 16, color: 'var(--text-muted)' }}>days</span>
                            </div>
                        </div>
                        <div>
                            <div style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 700, marginBottom: 4 }}>Longest Streak</div>
                            <div className="streak-display" style={{ color: 'var(--accent)' }}>
                                💎 {streak.longest} <span style={{ fontSize: 16, color: 'var(--text-muted)' }}>days</span>
                            </div>
                        </div>
                    </div>

                    {/* Weekly Summary Card */}
                    <div className="card">
                        <h3 className="section-title">Last 7 Days</h3>
                        <div className="week-bar-group">
                            {weeklyData.map((day, i) => (
                                <div key={i} className="week-bar-col">
                                    <div className="week-bar-track">
                                        <div
                                            className="week-bar-fill"
                                            style={{
                                                height: `${day.pct}%`,
                                                background: day.pct === 100
                                                    ? 'linear-gradient(180deg, var(--success-light), var(--success))'
                                                    : 'linear-gradient(180deg, var(--primary-light), var(--primary))',
                                                opacity: day.pct === 0 ? 0 : 1
                                            }}
                                        />
                                    </div>
                                    <span className="week-bar-label" style={{ color: i === 6 ? 'var(--primary)' : '' }}>
                                        {day.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </motion.div>
    );
}
