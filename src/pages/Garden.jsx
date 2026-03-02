import { motion } from 'framer-motion';
import { useGarden, useStreak } from '../context/AppContext';
import FlowerGarden from '../components/garden/FlowerGarden';

export default function GardenPage() {
    const { flowers } = useGarden();
    const streak = useStreak();

    const nextMilestone = (Math.floor(streak.longest / 7) + 1) * 7;
    const daysUntilNext = nextMilestone - streak.current;

    return (
        <motion.div
            className="page"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
        >
            <div className="flex items-center justify-between" style={{ marginBottom: 24, flexShrink: 0 }}>
                <div>
                    <h1 className="page-title">My Garden 🌸</h1>
                    <p className="page-subtitle">A visual representation of your consistency.</p>
                </div>
            </div>

            <div className="garden-dashboard grid-2" style={{ marginBottom: 20, flexShrink: 0 }}>
                <div className="card card-sm flex items-center gap-4">
                    <div style={{ fontSize: 32, background: 'var(--lavender)', padding: 12, borderRadius: 16 }}>🌱</div>
                    <div>
                        <div style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 700 }}>Total Flowers</div>
                        <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--primary)' }}>{flowers.length}</div>
                    </div>
                </div>

                <div className="card card-sm flex items-center gap-4">
                    <div style={{ fontSize: 32, background: 'var(--peach)', padding: 12, borderRadius: 16 }}>💧</div>
                    <div>
                        <div style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 700 }}>Next Bloom</div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>
                            In {daysUntilNext} day{daysUntilNext !== 1 ? 's' : ''}
                            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>at {nextMilestone}-day streak</div>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ flex: 1, minHeight: 400, position: 'relative' }}>
                <FlowerGarden flowers={flowers} />

                {flowers.length === 0 && (
                    <div style={{
                        position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        backgroundColor: 'rgba(0,0,0,0.1)', backdropFilter: 'blur(2px)', borderRadius: 'var(--radius-lg)'
                    }}>
                        <div className="card text-center" style={{ maxWidth: 300 }}>
                            <div style={{ fontSize: 40, marginBottom: 12 }}>🪴</div>
                            <h3 style={{ fontWeight: 800, color: 'var(--text)', marginBottom: 8 }}>Empty Garden</h3>
                            <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                                Achieve a 7-day streak to bloom your first flower! Every week of consistency adds a new permanent flower to your garden.
                            </p>
                        </div>
                    </div>
                )}
            </div>

        </motion.div>
    );
}
