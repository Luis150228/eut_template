// FlamaTargetOverlay.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import FlamaSantanderLoader from './FlamaSantanderLoader';

function resolveTarget(target) {
	if (!target) return null;
	if (target instanceof HTMLElement) return target;
	if (typeof target === 'string') return document.querySelector(target);
	if (target?.current instanceof HTMLElement) return target.current;
	return null;
}

export default function FlamaTargetOverlay({
	show = true,
	target, // HTMLElement | ref | selector string (ej. '#main' o 'main')
	size = 160,
	block = true, // bloquea clics (pointer-events)
	zIndex = 9999,
	className = '',
	backgroundClass = 'bg-neutral-200 dark:bg-[#e30613]',
}) {
	const [rect, setRect] = useState(null);
	const el = useMemo(() => resolveTarget(target), [target]);

	useEffect(() => {
		if (!el) return;

		const update = () => {
			const r = el.getBoundingClientRect();
			setRect({ top: r.top, left: r.left, width: r.width, height: r.height });
		};

		update();

		const ro = new ResizeObserver(update);
		ro.observe(el);

		window.addEventListener('resize', update, { passive: true });
		window.addEventListener('scroll', update, { passive: true });

		return () => {
			ro.disconnect();
			window.removeEventListener('resize', update);
			window.removeEventListener('scroll', update);
		};
	}, [el]);

	if (!show || !el || !rect) return null;

	return createPortal(
		<div
			className={[
				'fixed flex items-center justify-center',
				backgroundClass,
				block ? '' : 'pointer-events-none',
				className,
			].join(' ')}
			style={{
				top: rect.top,
				left: rect.left,
				width: rect.width,
				height: rect.height,
				zIndex,
			}}>
			<FlamaSantanderLoader size={size} />
		</div>,
		document.body
	);
}
