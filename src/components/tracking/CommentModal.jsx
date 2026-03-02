import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export default function CommentModal({ habit, onSkip, onClose }) {
    const [comment, setComment] = useState('');

    const handleSkip = () => {
        onSkip(comment);
        onClose();
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
                    initial={{ opacity: 0, y: 24, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 16, scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 220, damping: 22 }}
                >
                    <div style={{ textAlign: 'center', marginBottom: 20 }}>
                        <div style={{ fontSize: 40 }}>{habit.icon}</div>
                        <h3 style={{ fontWeight: 800, fontSize: 18, color: 'var(--text)', marginTop: 8 }}>
                            Skip "{habit.name}" ?
                        </h3>
                        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
                            Add a note about why (optional) — it helps you reflect later!
                        </p>
                    </div>

                    <div className="form-group">
                        <textarea
                            className="form-textarea"
                            placeholder="e.g. Felt tired today, will make it up tomorrow..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows={3}
                            autoFocus
                        />
                    </div>

                    <div className="flex gap-3 mt-4">
                        <button className="btn btn-secondary w-full" onClick={onClose}>Cancel</button>
                        <button
                            className="btn w-full"
                            onClick={handleSkip}
                            style={{ background: 'var(--peach)', color: '#92400e', fontWeight: 700 }}
                        >
                            Skip for Today
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
