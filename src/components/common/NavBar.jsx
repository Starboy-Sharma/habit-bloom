import { NavLink } from 'react-router-dom';
import { useTheme, useSound, useUser, useLogout } from '../../context/AppContext';
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
    const logout = useLogout();

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
                        <div className="streak-badge">
                            🔥 {streak.current} day streak
                        </div>
                    )}
                    <div className="sidebar-controls">
                        <button
                            className="btn btn-ghost btn-sm btn-icon"
                            onClick={toggleTheme}
                            title="Toggle theme"
                        >
                            {theme === 'light' ? '🌙' : '☀️'}
                        </button>
                        <button
                            className="btn btn-ghost btn-sm btn-icon"
                            onClick={toggleSound}
                            title="Toggle sound"
                        >
                            {soundEnabled ? '🔊' : '🔇'}
                        </button>
                    </div>
                    <button
                        className="btn btn-logout"
                        onClick={logout}
                        title="Sign out"
                    >
                        <span className="logout-icon">🚪</span>
                        <span>Sign out</span>
                    </button>
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
                <button
                    className="bottom-nav-item logout-mobile"
                    onClick={logout}
                    title="Sign out"
                >
                    <span className="nav-icon">🚪</span>
                    Sign out
                </button>
            </nav>
        </>
    );
}
