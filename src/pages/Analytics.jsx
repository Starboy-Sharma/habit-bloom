import { useState } from 'react';
import { motion } from 'framer-motion';
import { useDailyLogs, useHabits } from '../context/AppContext';
import { getDaysInMonth, getMonthName, getTodayString } from '../utils/dateUtils';
import { getCompletionPct } from '../utils/streakUtils';

export default function Analytics() {
    const dailyLogs = useDailyLogs();
    const habits = useHabits();

    const today = new Date();
    const [year, setYear] = useState(today.getFullYear());
    const [month, setMonth] = useState(today.getMonth());

    const daysInMonth = getDaysInMonth(year, month);
    const todayStr = getTodayString();

    const prevMonth = () => {
        if (month === 0) { setMonth(11); setYear(y => y - 1); }
        else setMonth(m => m - 1);
    };
    const nextMonth = () => {
        if (month === 11) { setMonth(0); setYear(y => y + 1); }
        else setMonth(m => m + 1);
    };

    // Calculate Monthly Stats
    let totalCompleted = 0;
    let totalPossible = daysInMonth.length * habits.length;
    let activeDays = 0;
    let bestDay = { date: null, pct: -1 };

    const calendarData = daysInMonth.map(dateStr => {
        const log = dailyLogs.find(l => l.date === dateStr);
        const pct = getCompletionPct(log, habits);

        // Stats calc
        if (log && habits.length > 0) {
            const completed = log.entries.filter(e => e.completed).length;
            totalCompleted += completed;
            activeDays++;
            if (pct > bestDay.pct) bestDay = { date: dateStr, pct };
        }

        let heatClass = 'heat-0';
        if (pct > 0 && pct <= 33) heatClass = 'heat-1';
        else if (pct > 33 && pct <= 66) heatClass = 'heat-2';
        else if (pct > 66 && pct < 100) heatClass = 'heat-3';
        else if (pct === 100) heatClass = 'heat-4';

        const isFuture = dateStr > todayStr;
        if (isFuture) heatClass = 'future';

        return {
            date: dateStr,
            dayNum: dateStr.split('-')[2].replace(/^0/, ''),
            pct,
            heatClass,
            isToday: dateStr === todayStr,
            isFuture
        };
    });

    const completionRate = totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0;
    // Pad empty days at start of calendar grid
    const firstDayOfWeek = new Date(year, month, 1).getDay();
    const emptyDays = Array.from({ length: firstDayOfWeek });

    return (
        <motion.div
            className="page"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
        >
            <div className="flex items-center justify-between" style={{ marginBottom: 24 }}>
                <div>
                    <h1 className="page-title">Analytics 📊</h1>
                    <p className="page-subtitle">Understand your monthly trends</p>
                </div>
            </div>

            <div className="dashboard-grid">

                {/* Calendar Card */}
                <div className="card">
                    <div className="flex items-center justify-between" style={{ marginBottom: 24 }}>
                        <button className="btn btn-ghost btn-icon" onClick={prevMonth}>←</button>
                        <h2 className="section-title" style={{ margin: 0, fontSize: 18 }}>
                            {getMonthName(month)} {year}
                        </h2>
                        <button className="btn btn-ghost btn-icon" onClick={nextMonth} disabled={year === today.getFullYear() && month === today.getMonth()}>
                            {year === today.getFullYear() && month === today.getMonth() ? '' : '→'}
                        </button>
                    </div>

                    <div className="calendar-grid" style={{ marginBottom: 8 }}>
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                            <div key={i} style={{ textAlign: 'center', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>
                                {d}
                            </div>
                        ))}

                        {emptyDays.map((_, i) => (
                            <div key={`empty-${i}`} className="calendar-day empty" />
                        ))}

                        {calendarData.map((d) => (
                            <div
                                key={d.date}
                                className={`calendar-day ${d.heatClass} ${d.isToday ? 'today-marker' : ''}`}
                                title={d.isFuture ? 'Future' : `${d.date}: ${d.pct}% completed`}
                            >
                                {d.dayNum}
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center justify-center gap-2 mt-4" style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                        <span>Less</span>
                        <div className="calendar-day heat-0" style={{ width: 12, height: 12 }} />
                        <div className="calendar-day heat-1" style={{ width: 12, height: 12 }} />
                        <div className="calendar-day heat-2" style={{ width: 12, height: 12 }} />
                        <div className="calendar-day heat-3" style={{ width: 12, height: 12 }} />
                        <div className="calendar-day heat-4" style={{ width: 12, height: 12, outline: '1px solid var(--border)' }} />
                        <span>More</span>
                    </div>
                </div>

                {/* Stats Column */}
                <div className="flex flex-col gap-4">
                    <div className="card" style={{ padding: 20 }}>
                        <h3 className="section-title" style={{ fontSize: 14 }}>Monthly Completion Rate</h3>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                            <span style={{ fontSize: 42, fontWeight: 900, color: 'var(--primary)', fontFamily: 'var(--font-display)' }}>
                                {completionRate}%
                            </span>
                        </div>
                        <div className="progress-bar-track mt-2">
                            <div className="progress-bar-fill" style={{ width: `${completionRate}%` }} />
                        </div>
                    </div>

                    <div className="grid-2">
                        <div className="card text-center" style={{ padding: 16 }}>
                            <div style={{ fontSize: 24 }}>✨</div>
                            <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)', marginTop: 8 }}>{totalCompleted}</div>
                            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Habits Done</div>
                        </div>
                        <div className="card text-center" style={{ padding: 16 }}>
                            <div style={{ fontSize: 24 }}>📅</div>
                            <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)', marginTop: 8 }}>{activeDays}</div>
                            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Active Days</div>
                        </div>
                    </div>

                    {bestDay.date && (
                        <div className="card" style={{ background: 'linear-gradient(135deg, var(--mint), var(--sky))' }}>
                            <div style={{ fontSize: 12, fontWeight: 700, color: '#065f46', textTransform: 'uppercase', marginBottom: 4 }}>
                                🌟 Most Productive Day
                            </div>
                            <div style={{ fontSize: 18, fontWeight: 800, color: '#064e3b' }}>
                                {bestDay.date === todayStr ? 'Today!' : new Date(bestDay.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </div>
                            <div style={{ fontSize: 13, color: '#047857', marginTop: 2 }}>
                                {bestDay.pct}% completion score
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </motion.div>
    );
}
