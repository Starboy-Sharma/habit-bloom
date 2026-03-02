import { useEffect, useRef } from 'react';
import { useTheme } from '../../context/AppContext';

export default function FlowerGarden({ flowers }) {
    const canvasRef = useRef(null);
    const { theme } = useTheme();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        // Handle high DPI displays
        const dpr = window.devicePixelRatio || 1;
        const cw = canvas.clientWidth;
        const ch = canvas.clientHeight;

        // Only resize canvas if needed to avoid clearing
        if (canvas.width !== cw * dpr || canvas.height !== ch * dpr) {
            canvas.width = cw * dpr;
            canvas.height = ch * dpr;
            ctx.scale(dpr, dpr);
        }

        const w = cw;
        const h = ch;

        // Animation state
        let animationFrameId;
        let time = 0;

        // Drawing functions
        const drawSkyAndGrass = () => {
            // Sky
            const skyGradient = ctx.createLinearGradient(0, 0, 0, h * 0.7);
            if (theme === 'dark') {
                skyGradient.addColorStop(0, '#1a1133');
                skyGradient.addColorStop(1, '#2d1f4e');
            } else {
                skyGradient.addColorStop(0, '#eef2ff');
                skyGradient.addColorStop(1, '#c7d2fe');
            }
            ctx.fillStyle = skyGradient;
            ctx.fillRect(0, 0, w, h);

            // Sun / Moon
            ctx.beginPath();
            ctx.arc(w * 0.85, h * 0.2, Math.min(w, h) * 0.08, 0, Math.PI * 2);
            ctx.fillStyle = theme === 'dark' ? '#fde047' : '#fef08a';
            ctx.shadowColor = theme === 'dark' ? '#fef08a' : '#fde047';
            ctx.shadowBlur = theme === 'dark' ? 30 : 50;
            ctx.fill();
            ctx.shadowBlur = 0;

            // Grass / Hills
            const hillGradient = ctx.createLinearGradient(0, h * 0.5, 0, h);
            if (theme === 'dark') {
                hillGradient.addColorStop(0, '#064e3b');
                hillGradient.addColorStop(1, '#022c22');
            } else {
                hillGradient.addColorStop(0, '#a7f3d0');
                hillGradient.addColorStop(1, '#34d399');
            }
            ctx.fillStyle = hillGradient;
            ctx.beginPath();
            ctx.moveTo(0, h * 0.6);
            ctx.quadraticCurveTo(w * 0.5, h * 0.4, w, h * 0.65);
            ctx.lineTo(w, h);
            ctx.lineTo(0, h);
            ctx.fill();
        };

        const drawFlower = (x, y, type, scale, swayOffset) => {
            ctx.save();
            ctx.translate(x, y);

            // Gentle swaying animation
            const angle = Math.sin(time * 0.002 + swayOffset) * 0.05;
            ctx.rotate(angle);
            ctx.scale(scale, scale);

            // Stem
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.quadraticCurveTo(-10, 40, 0, 80);
            ctx.strokeStyle = theme === 'dark' ? '#10b981' : '#059669';
            ctx.lineWidth = 4;
            ctx.stroke();

            // Leaf
            ctx.beginPath();
            ctx.moveTo(0, 40);
            ctx.quadraticCurveTo(20, 20, 30, 30);
            ctx.quadraticCurveTo(20, 40, 0, 40);
            ctx.fillStyle = theme === 'dark' ? '#34d399' : '#10b981';
            ctx.fill();

            // Petals based on type
            let colors;
            switch (type) {
                case 0: colors = ['#f472b6', '#db2777']; break; // Pink daisy
                case 1: colors = ['#818cf8', '#4f46e5']; break; // Blue/indigo
                case 2: colors = ['#fbbf24', '#d97706']; break; // Yellow sunflower
                case 3: colors = ['#a78bfa', '#7c3aed']; break; // Purple
                case 4: colors = ['#f87171', '#dc2626']; break; // Red tulip-ish
                default: colors = ['#f472b6', '#db2777'];
            }

            const numPetals = type === 2 ? 12 : type === 4 ? 4 : 6;
            const petalSize = type === 2 ? 12 : type === 4 ? 18 : 15;

            // Draw petals
            for (let i = 0; i < numPetals; i++) {
                ctx.save();
                ctx.rotate((Math.PI * 2 / numPetals) * i);
                ctx.beginPath();
                if (type === 4) {
                    // Tulip shape
                    ctx.moveTo(0, 0);
                    ctx.bezierCurveTo(20, -20, 10, -35, 0, -35);
                    ctx.bezierCurveTo(-10, -35, -20, -20, 0, 0);
                } else {
                    // Normal oval petal
                    ctx.ellipse(0, -15, petalSize / 2, petalSize, 0, 0, Math.PI * 2);
                }

                const grad = ctx.createRadialGradient(0, -10, 0, 0, -15, petalSize);
                grad.addColorStop(0, colors[0]);
                grad.addColorStop(1, colors[1]);
                ctx.fillStyle = grad;
                ctx.fill();
                ctx.restore();
            }

            // Center
            ctx.beginPath();
            ctx.arc(0, 0, 8, 0, Math.PI * 2);
            ctx.fillStyle = type === 2 ? '#78350f' : '#fef08a';
            ctx.fill();

            ctx.restore();
        };

        const render = () => {
            time += 16;
            ctx.clearRect(0, 0, w, h);
            drawSkyAndGrass();

            // Sort flowers by Y so closer ones render on top
            const sorted = [...flowers].sort((a, b) => a.y - b.y);

            sorted.forEach((f, idx) => {
                const screenX = f.x * w;
                // Map abstract Y (0 to 1) to grass area (h*0.5 to h*0.9)
                const screenY = h * 0.55 + (f.y * (h * 0.35));

                // Bloom scale calculation
                // Calculate age essentially to see if it just bloomed
                const ageMs = Date.now() - new Date(f.bloomedAt).getTime();
                const bloomDuration = 2000;

                let scale = 1;
                if (ageMs < bloomDuration) {
                    // Ease out back animation for pop
                    const t = ageMs / bloomDuration;
                    const c1 = 1.70158;
                    const c3 = c1 + 1;
                    scale = 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
                    scale = Math.max(0, scale);
                }

                // Add perspective scale (lower Y = larger)
                const perspectiveScale = 0.6 + (f.y * 0.6);

                drawFlower(screenX, screenY, f.type, scale * perspectiveScale, f.x * 100);
            });

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [flowers, theme]);

    return (
        <div className="garden-canvas-wrap" style={{ width: '100%', height: '100%' }}>
            <canvas
                ref={canvasRef}
                style={{ width: '100%', height: '100%', display: 'block' }}
            />
        </div>
    );
}
