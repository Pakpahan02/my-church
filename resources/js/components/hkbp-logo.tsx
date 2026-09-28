import React from 'react';

interface HkbpLogoProps extends React.SVGProps<SVGSVGElement> {
    className?: string;
    size?: number;
}

export function HkbpLogo({ className = 'w-10 h-10', size, ...props }: HkbpLogoProps) {
    const style = size ? { width: size, height: size } : undefined;

    return (
        <svg
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            style={style}
            {...props}
        >
            <defs>
                <linearGradient id="hkbpBlueGradComp" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1e3a8a" />
                    <stop offset="100%" stopColor="#0f2557" />
                </linearGradient>
                <linearGradient id="crossGradComp" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#dc2626" />
                    <stop offset="100%" stopColor="#991b1b" />
                </linearGradient>
                <linearGradient id="goldGradComp" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fbbf24" />
                    <stop offset="100%" stopColor="#d97706" />
                </linearGradient>
                <filter id="shadowComp" x="-10%" y="-10%" width="120%" height="120%">
                    <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.25" />
                </filter>
            </defs>

            {/* Outer Blue Ring with Gold Border */}
            <circle cx="100" cy="100" r="96" fill="url(#hkbpBlueGradComp)" stroke="#fbbf24" strokeWidth="4" filter="url(#shadowComp)" />
            <circle cx="100" cy="100" r="87" fill="none" stroke="#ffffff" strokeWidth="2" />

            {/* Inner Circle Background */}
            <circle cx="100" cy="100" r="66" fill="#f8fafc" stroke="#1e3a8a" strokeWidth="2" />

            {/* Sun Rays behind cross */}
            <g stroke="url(#goldGradComp)" strokeWidth="2.5" strokeLinecap="round" opacity="0.85">
                <line x1="100" y1="46" x2="100" y2="38" />
                <line x1="118" y1="52" x2="124" y2="46" />
                <line x1="130" y1="67" x2="138" y2="64" />
                <line x1="134" y1="87" x2="142" y2="87" />
                <line x1="82" y1="52" x2="76" y2="46" />
                <line x1="70" y1="67" x2="62" y2="64" />
                <line x1="66" y1="87" x2="58" y2="87" />
            </g>

            {/* Curved Text Top: HURIA KRISTEN BATAK PROTESTAN */}
            <path id="textPathTopComp" d="M 26 100 A 74 74 0 0 1 174 100" fill="none" />
            <text fontFamily="system-ui, -apple-system, sans-serif" fontSize="9.5" fontWeight="700" fill="#ffffff" letterSpacing="1.2">
                <textPath href="#textPathTopComp" startOffset="50%" textAnchor="middle">
                    HURIA KRISTEN BATAK PROTESTAN
                </textPath>
            </text>

            {/* Curved Text Bottom: HKBP • 1861 */}
            <path id="textPathBottomComp" d="M 174 100 A 74 74 0 0 1 26 100" fill="none" />
            <text fontFamily="system-ui, -apple-system, sans-serif" fontSize="10.5" fontWeight="800" fill="#fbbf24" letterSpacing="3">
                <textPath href="#textPathBottomComp" startOffset="50%" textAnchor="middle">
                    HKBP • 1861
                </textPath>
            </text>

            {/* Red Cross */}
            <g filter="url(#shadowComp)">
                <rect x="94" y="52" width="12" height="74" rx="2" fill="url(#crossGradComp)" stroke="#ffffff" strokeWidth="1.5" />
                <rect x="76" y="68" width="48" height="12" rx="2" fill="url(#crossGradComp)" stroke="#ffffff" strokeWidth="1.5" />
            </g>

            {/* Open Bible at the base */}
            <g transform="translate(62, 114)">
                <path d="M 38 12 Q 20 6 0 10 L 0 28 Q 20 24 38 30 Z" fill="#ffffff" stroke="#1e3a8a" strokeWidth="1.5" />
                <path d="M 38 12 Q 56 6 76 10 L 76 28 Q 56 24 38 30 Z" fill="#ffffff" stroke="#1e3a8a" strokeWidth="1.5" />
                <line x1="38" y1="12" x2="38" y2="30" stroke="#1e3a8a" strokeWidth="2" />
                <line x1="8" y1="16" x2="30" y2="14" stroke="#94a3b8" strokeWidth="1" strokeLinecap="round" />
                <line x1="8" y1="20" x2="30" y2="18" stroke="#94a3b8" strokeWidth="1" strokeLinecap="round" />
                <line x1="8" y1="24" x2="26" y2="22" stroke="#94a3b8" strokeWidth="1" strokeLinecap="round" />
                <line x1="46" y1="14" x2="68" y2="16" stroke="#94a3b8" strokeWidth="1" strokeLinecap="round" />
                <line x1="46" y1="18" x2="68" y2="20" stroke="#94a3b8" strokeWidth="1" strokeLinecap="round" />
                <line x1="46" y1="22" x2="64" y2="24" stroke="#94a3b8" strokeWidth="1" strokeLinecap="round" />
            </g>
        </svg>
    );
}

export default HkbpLogo;
