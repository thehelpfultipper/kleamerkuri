import React, { useState, useEffect } from 'react';

const WireframeOverlay: React.FC = () => {
    const [dimensions, setDimensions] = useState({
        isMobile: false,
        isUnder1200: false,
        isSmallScreen: false,
        isHydrated: false,
        prefersReducedMotion: false
    });

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            setDimensions({
                isMobile: width < 992,
                isUnder1200: width <= 1200,
                isSmallScreen: width <= 768,
                isHydrated: true,
                prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
            });
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const { isMobile, isUnder1200, isSmallScreen, isHydrated, prefersReducedMotion } = dimensions;

    const centerX = 780;
    let centerY = 450;

    if (isUnder1200 && !isMobile) {
        centerY = 380;
    } else if (isUnder1200 && isMobile) {
        centerY = 300;
    }

    const scale = isMobile ? 0.9 : 1;
    const opacity = isMobile ? 0.6 : 0.8;

    if (!isHydrated || isSmallScreen) return null;

    return (
        <div className="position-absolute top-0 start-0 w-100 h-100 pointer-events-none z-1 d-none d-md-block" style={{ opacity }}>
            <svg className="w-100 h-100" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice">
                <defs>
                    <filter id="hero-glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>

                    <linearGradient id="cyberGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#BD93F9" stopOpacity="0.6" />
                        <stop offset="50%" stopColor="#FF79C6" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#BD93F9" stopOpacity="0.1" />
                    </linearGradient>

                    <pattern id="grid-pattern" width="60" height="60" patternUnits="userSpaceOnUse">
                        <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(189, 147, 249, 0.08)" strokeWidth="0.5" />
                    </pattern>

                    <mask id="fade-mask">
                        <rect width="1000" height="1000" fill="url(#mask-grad)" />
                        <linearGradient id="mask-grad" x1="0" y1="0" x2="1000" y2="1000" gradientUnits="userSpaceOnUse">
                            <stop offset="0" stopColor="black" stopOpacity="0" />
                            <stop offset="0.3" stopColor="black" stopOpacity="0" />
                            <stop offset="0.8" stopColor="black" stopOpacity="1" />
                        </linearGradient>
                    </mask>
                </defs>

                <rect width="100%" height="100%" fill="url(#grid-pattern)" mask="url(#fade-mask)" />

                <g transform={`translate(${centerX}, ${centerY}) scale(${scale})`}>
                    {/* Floating Outer Rings */}
                    <ellipse cx="0" cy="0" rx="120" ry="40" stroke="#BD93F9" strokeWidth="1" fill="none" opacity="0.3">
                        {!prefersReducedMotion && <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="25s" repeatCount="indefinite" />}
                    </ellipse>
                    <ellipse cx="0" cy="0" rx="40" ry="120" stroke="#FF79C6" strokeWidth="1" fill="none" opacity="0.2">
                        {!prefersReducedMotion && <animateTransform attributeName="transform" type="rotate" from="360" to="0" dur="20s" repeatCount="indefinite" />}
                    </ellipse>
                    <circle cx="0" cy="0" r="180" stroke="rgba(189, 147, 249, 0.1)" strokeWidth="0.5" fill="none" strokeDasharray="10,20" />

                    {/* Droid */}
                    <g>
                        {!prefersReducedMotion && (
                            <animateTransform
                                attributeName="transform"
                                type="translate"
                                values="0,0; 0,-20; 0,0"
                                dur="4s"
                                repeatCount="indefinite"
                                additive="sum"
                            />
                        )}

                        {/* Body Plate */}
                        <path d="M-45,-30 L45,-30 L55,30 L-55,30 Z" fill="rgba(30, 30, 30, 0.8)" stroke="#BD93F9" strokeWidth="2" filter="url(#hero-glow)" />

                        {/* Core Energy Source */}
                        <circle cx="0" cy="0" r="22" fill="#fff" filter="url(#hero-glow)">
                            {!prefersReducedMotion && (
                                <>
                                    <animate attributeName="opacity" values="0.4;1;0.4" dur="2.5s" repeatCount="indefinite" />
                                    <animate attributeName="r" values="20;24;20" dur="2.5s" repeatCount="indefinite" />
                                </>
                            )}
                        </circle>

                        {/* Modular Head Unit */}
                        <g transform="translate(0, -65)">
                            <rect x="-25" y="-12" width="50" height="30" rx="8" stroke="#BD93F9" strokeWidth="1.5" fill="rgba(30, 30, 30, 0.9)" filter="url(#hero-glow)" />
                            {/* Sensors/Eyes */}
                            <circle cx="-12" cy="3" r="4" fill="#FF79C6">
                                {!prefersReducedMotion && <animate attributeName="opacity" values="1;0.3;1" dur="3s" repeatCount="indefinite" />}
                            </circle>
                            <circle cx="12" cy="3" r="4" fill="#FF79C6">
                                {!prefersReducedMotion && <animate attributeName="opacity" values="1;0.3;1" dur="3s" repeatCount="indefinite" />}
                            </circle>
                            {/* Scanning Light */}
                            <rect x="-15" y="12" width="30" height="2" fill="#BD93F9" opacity="0.6">
                                {!prefersReducedMotion && (
                                    <>
                                        <animate attributeName="width" values="0;30;0" dur="1.8s" repeatCount="indefinite" />
                                        <animate attributeName="x" values="0;-15;0" dur="1.8s" repeatCount="indefinite" />
                                    </>
                                )}
                            </rect>

                            {/* Speech Bubble */}
                            <g transform="translate(30, -65)">
                                {!prefersReducedMotion && (
                                    <animate attributeName="opacity" values="0;1;1;0" dur="12s" repeatCount="indefinite" />
                                )}
                                {/* Cyber Bubble Path - Wider to fit long strings */}
                                <path d="M0,0 L115,0 L120,5 L120,35 L115,40 L20,40 L5,55 L5,40 L-5,40 L-10,35 L-10,5 Z"
                                    fill="rgba(20, 20, 20, 0.98)"
                                    stroke="#BD93F9"
                                    strokeWidth="1.5"
                                    filter="url(#hero-glow)" />

                                {/* Cycling Text Messages - Synchronized with 12s loop */}
                                <g transform="translate(55, 25)">
                                    <text textAnchor="middle" fontSize="10" fill="#BD93F9" fontFamily="'Fira Code', monospace" fontWeight="bold">
                                        <tspan x="0" y="0">
                                            {!prefersReducedMotion && <animate attributeName="opacity" values="1;1;0;0;0;0;0;0;1" keyTimes="0;0.24;0.25;0.49;0.50;0.74;0.75;0.99;1" dur="12s" repeatCount="indefinite" />}
                                            HELLO WORLD
                                        </tspan>
                                        <tspan x="0" y="0">
                                            {!prefersReducedMotion && <animate attributeName="opacity" values="0;0;1;1;0;0;0;0;0" keyTimes="0;0.24;0.25;0.49;0.50;0.74;0.75;0.99;1" dur="12s" repeatCount="indefinite" />}
                                            SYSTEM: OK
                                        </tspan>
                                        <tspan x="0" y="0">
                                            {!prefersReducedMotion && <animate attributeName="opacity" values="0;0;0;0;1;1;0;0;0" keyTimes="0;0.24;0.25;0.49;0.50;0.74;0.75;0.99;1" dur="12s" repeatCount="indefinite" />}
                                            Chat with Eve!
                                        </tspan>
                                        <tspan x="0" y="0">
                                            {!prefersReducedMotion && <animate attributeName="opacity" values="0;0;0;0;0;0;1;1;0" keyTimes="0;0.24;0.25;0.49;0.50;0.74;0.75;0.99;1" dur="12s" repeatCount="indefinite" />}
                                            HIRE ME? [Y/n]
                                        </tspan>
                                    </text>
                                </g>
                                {/* Small blinking cursor in bubble */}
                                <rect x="98" y="27" width="6" height="2" fill="#FF79C6">
                                    {!prefersReducedMotion && <animate attributeName="opacity" values="1;0;1" dur="0.8s" repeatCount="indefinite" />}
                                </rect>
                            </g>
                        </g>

                        {/* Thruster System */}
                        <path d="M-15,35 L0,100 L15,35" fill="url(#cyberGrad)" opacity="0.8">
                            {!prefersReducedMotion && <animate attributeName="d" values="M-15,35 L0,90 L15,35; M-22,35 L0,120 L22,35; M-15,35 L0,90 L15,35" dur="0.2s" repeatCount="indefinite" />}
                        </path>

                        {/* Peripheral Bits */}
                        <line x1="-55" y1="0" x2="-80" y2="-15" stroke="#BD93F9" strokeWidth="1" opacity="0.4" />
                        <line x1="55" y1="0" x2="80" y2="-15" stroke="#BD93F9" strokeWidth="1" opacity="0.4" />
                    </g>
                </g>
            </svg>
        </div>
    );
};

export default React.memo(WireframeOverlay);
