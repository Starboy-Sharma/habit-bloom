import { NavLink } from 'react-router-dom';
import { useTheme, useSound, useUser } from '../../context/AppContext';
import { useStreak } from '../../context/AppContext';

const NAV_ITEMS = [
    { to: '/', icon: '🏠', label: 'Dashboard' },
    { to: '/habits', icon: '✅', label: 'Habits' },
    { to: '/garden', icon: '🌸', label: 'Garden' },
    { to: '/analytics', icon: '📊', label: 'Analytics' },
];

export default function NavBar() {
    const { theme, toggleTheme } = useTheme();
    const { soundEnabled, toggleSound } = useSound();
    const user = useUser();
    const streak = useStreak();

    return (
        <>
            {/* Sidebar (desktop) */}
            <aside className="sidebar">
                <div className="sidebar-logo">
                    <h1>🌱 HabitBloom</h1>
                    <p>Hi, {user?.name?.split(' ')[0]} 👋</p>
                </div>

                <nav className="sidebar-nav">
                    {NAV_ITEMS.map(({ to, icon, label }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={to === '/'}
                            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                        >
                            <span className="nav-icon">{icon}</span>
                            {label}
                        </NavLink>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    {streak.current > 0 && (
                        <div style={{ padding: '8px 14px', background: 'var(--lavender)', borderRadius: 'var(--radius-md)', fontSize: '13px', fontWeight: '700', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            🔥 {streak.current} day streak
                        </div>
                    )}
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                            className="btn btn-ghost btn-sm"
                            onClick={toggleTheme}
                            title="Toggle theme"
                            style={{ flex: 1 }}
                        >
                            {theme === 'light' ? '🌙' : '☀️'}
                        </button>
                        <button
                            className="btn btn-ghost btn-sm"
                            onClick={toggleSound}
                            title="Toggle sound"
                            style={{ flex: 1 }}
                        >
                            {soundEnabled ? '🔊' : '🔇'}
                        </button>
                    </div>
                </div>
            </aside>

            {/* Bottom nav (mobile) */}
            <nav className="bottom-nav">
                {NAV_ITEMS.map(({ to, icon, label }) => (
                    <NavLink
                        key={to}
                        to={to}
                        end={to === '/'}
                        className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
                    >
                        <span className="nav-icon">{icon}</span>
                        {label}
                    </NavLink>
                ))}
            </nav>
        </>
    );
}
