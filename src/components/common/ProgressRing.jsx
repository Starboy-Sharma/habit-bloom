// ProgressRing — SVG-based circular progress indicator
export default function ProgressRing({ pct, size = 120, strokeWidth = 10, color = 'var(--primary)', bgColor = 'var(--bg-secondary)', children }) {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (pct / 100) * circumference;

    return (
        <div className="progress-ring-wrap" style={{ width: size, height: size, position: 'relative' }}>
            <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
                <circle cx={size / 2} cy={size / 2} r={radius} strokeWidth={strokeWidth} stroke={bgColor} fill="none" />
                <circle
                    cx={size / 2} cy={size / 2} r={radius}
                    strokeWidth={strokeWidth}
                    stroke={color}
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }}
                />
            </svg>
            <div style={{
                position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexDirection: 'column',
            }}>
                {children}
            </div>
        </div>
    );
}
