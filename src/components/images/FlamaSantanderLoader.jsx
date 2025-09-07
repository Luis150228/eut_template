// FlamaSantanderLoader.jsx
import React, { useEffect, useRef } from 'react';

export default function FlamaSantanderLoader({
	size = 220, // px o string ('12rem', '50%')
	strokeWidth = 4,
	duration = 2.2,
	strokeColor, // si lo pasas, ignora tema; si no, light=rojo / dark=blanco
	className = '',
	...props
}) {
	const pathRef = useRef(null);

	useEffect(() => {
		const p = pathRef.current;
		if (!p) return;
		const len = p.getTotalLength();
		p.style.strokeDasharray = `${len}`;
		p.style.strokeDashoffset = `${len}`;
		p.style.setProperty('--path-len', `${len}`);
	}, []);

	const themeStrokeClasses = !strokeColor ? 'text-[#e30613] dark:text-white' : '';

	return (
		<svg
			viewBox='0 0 514.91 461.72'
			width={size}
			height={size}
			className={`${themeStrokeClasses} ${className}`}
			aria-label='Flama Santander Loader'
			role='img'
			{...props}>
			<style>{`
        @keyframes flama-draw {
          0%   { stroke-dashoffset: var(--path-len); }
          60%  { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: var(--path-len); }
        }
        @media (prefers-reduced-motion: reduce) {
          path { animation: none !important; }
        }
      `}</style>

			<path
				ref={pathRef}
				fill='none'
				stroke={strokeColor ?? 'currentColor'}
				strokeWidth={strokeWidth}
				strokeLinecap='round'
				strokeLinejoin='round'
				style={{ animation: `flama-draw ${duration}s ease-in-out infinite` }}
				d='M254.31,4.1c1.81-1.45,4.63-3.69,6.95-4.1-14.34,82.27,108.97,136.8,93.27,217.27,222.45,73.34,184.3,170.85,61.63,216.75-122.67,45.9-329.85,40.18-400.45-58.44-61.28-83.64,72.35-142.65,134.94-157.65,13.98,47.74,89.1,109.68,97.6,154.58.85,6.55-2.93,15.18,5.65,7.13,73.39-99.01-159.39-193.15-49.64-287.64-20.49,72.77,110.77,135.29,99,207C397.63,205.93,161.61,109.08,254.31,4.1Z'
			/>
		</svg>
	);
}

/*
<path
				fill={color ?? 'currentColor'}
				d='M254.31,4.1c1.81-1.45,4.63-3.69,6.95-4.1-14.34,82.27,108.97,136.8,93.27,217.27,222.45,73.34,184.3,170.85,61.63,216.75-122.67,45.9-329.85,40.18-400.45-58.44-61.28-83.64,72.35-142.65,134.94-157.65,13.98,47.74,89.1,109.68,97.6,154.58.85,6.55-2.93,15.18,5.65,7.13,73.39-99.01-159.39-193.15-49.64-287.64-20.49,72.77,110.77,135.29,99,207C397.63,205.93,161.61,109.08,254.31,4.1Z'
			/>
*/
