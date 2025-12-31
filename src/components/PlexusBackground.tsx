
import React, { useEffect, useRef } from 'react';
import { Point } from '../helpers/interfaces';

const PlexusBackground: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const pointsRef = useRef<Point[]>([]);
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resize = () => {
            const parent = canvas.parentElement;
            if (parent) {
                canvas.width = parent.clientWidth;
                canvas.height = parent.clientHeight;
            }
            initPoints();
        };

        const initPoints = () => {
            // Reduce point density on mobile for performance and readability
            const isMobile = window.innerWidth < 768;
            const pointCount = isMobile ? 35 : 85;
            const points: Point[] = [];
            for (let i = 0; i < pointCount; i++) {
                points.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * (isMobile ? 0.2 : 0.3),
                    vy: (Math.random() - 0.5) * (isMobile ? 0.2 : 0.3),
                });
            }
            pointsRef.current = points;
        };

        window.addEventListener('resize', resize);
        resize();

        let animationFrame: number;
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const points = pointsRef.current;
            const isMobile = window.innerWidth < 768;
            const connectionDist = isMobile ? 100 : 160;

            points.forEach((p, i) => {
                // Respect accessibility settings
                if (!prefersReducedMotion) {
                    p.x += p.vx;
                    p.y += p.vy;

                    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
                }

                ctx.beginPath();
                ctx.arc(p.x, p.y, isMobile ? 0.8 : 1.2, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(189, 147, 249, 0.4)';
                ctx.fill();

                for (let j = i + 1; j < points.length; j++) {
                    const p2 = points[j];
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const distSq = dx * dx + dy * dy;
                    const maxDistSq = connectionDist * connectionDist;

                    if (distSq < maxDistSq) {
                        const opacity = 1 - (distSq / maxDistSq);
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = `rgba(189, 147, 249, ${opacity * (isMobile ? 0.1 : 0.18)})`;
                        ctx.lineWidth = isMobile ? 0.4 : 0.6;
                        ctx.stroke();
                    }
                }
            });

            animationFrame = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrame);
        };
    }, [prefersReducedMotion]);

    return (
        <canvas
            ref={canvasRef}
            className="position-absolute top-0 start-0 w-100 h-100 pointer-events-none"
            style={{
                zIndex: 0,
                opacity: 0.6,
                maskImage: 'linear-gradient(to left, black 20%, transparent 90%)',
                WebkitMaskImage: 'linear-gradient(to left, black 20%, transparent 90%)'
            }}
        />
    );
};

export default PlexusBackground;
