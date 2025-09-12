import { cn } from '@/lib/utils';
import { IconMaximize, IconX } from '@tabler/icons-react';
import { useEffect, useRef, useState } from 'react';

export const BentoGrid = ({ className, children }) => {
	// Grid ancho completo, sin max-w que estrangule
	return (
		<div className={cn('grid w-full grid-cols-1 gap-4 md:auto-rows-[18rem] md:grid-cols-3', className)}>{children}</div>
	);
};

export const BentoGridItem = ({ className, title, description, header, icon, onToggleSize, onClose, ...rest }) => {
	const dataAttrs = pickDataAria(rest);

	// cambios mínimos: estados locales para animar entrada y cierre
	const [isClosing, setIsClosing] = useState(false);
	const [isEntering, setIsEntering] = useState(true);
	const entryRef = useRef(null);

	// handleClose: marca cierre y llama a onClose() despues de que termine la transición
	// reemplaza la función handleClose existente por esta
	const handleClose = () => {
		if (isClosing) return;
		const el = entryRef.current;

		// si no hay ref, fallback inmediato
		if (!el) {
			setIsClosing(true);
			if (typeof onClose === 'function') onClose();
			return;
		}

		let called = false;
		const cleanup = () => {
			if (called) return;
			called = true;
			el.removeEventListener('transitionend', onTrans);
			clearTimeout(fb);
			// mantener el estado para consistencia visual si aún no está true
			setIsClosing(true);
			if (typeof onClose === 'function') onClose();
		};

		const onTrans = (ev) => {
			// asegurar que es el elemento principal el que disparó la transición
			if (ev.target !== el) return;
			if (ev.propertyName === 'opacity' || ev.propertyName === 'transform') {
				cleanup();
			}
		};

		// agregar listener ANTES de cambiar clases
		el.addEventListener('transitionend', onTrans);

		// forzamos un reflow pequeño para asegurar que la clase provoque la transición
		void el.offsetWidth;

		// aplicar la clase de cierre directamente al DOM (no depender solo de setState)
		el.classList.add('closing');

		// mantener el estado también (opcional, pero útil si otros render dependen de él)
		setIsClosing(true);

		// fallback por si transitionend no se dispara (duración > CSS por seguridad)
		const fb = setTimeout(() => {
			cleanup();
		}, 420);
	};

	// trigger enter-active en mount para que la transición CSS de entrada se ejecute
	useEffect(() => {
		const el = entryRef.current;
		if (!el) return;
		let raf = requestAnimationFrame(() => {
			el.classList.add('enter-active');
			setTimeout(() => {
				setIsEntering(false);
				el.classList.remove('enter');
				el.classList.remove('enter-active');
			}, 320);
		});
		return () => cancelAnimationFrame(raf);
	}, []);

	return (
		<div
			{...dataAttrs}
			ref={entryRef}
			className={cn(
				'group/bento relative row-span-1 flex min-h-0 flex-col',
				'rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 pb-12',
				'transition duration-200 hover:shadow-xl shadow-sm',
				// añadidos mínimos para el control de animaciones
				isEntering ? 'enter' : '',
				isClosing ? 'closing' : '',
				className
			)}>
			{/* HEADER → tiene prioridad de espacio */}
			<div className='flex-1 min-h-0 overflow-hidden'>
				{/* wrapper por si el header necesita ocupar 100% */}
				<div className='h-full w-full min-h-0 overflow-hidden'>{header}</div>
			</div>

			{/* TEXTO → cede espacio. No crece infinito */}
			<div className='shrink-0 pt-2 transition duration-200 group-hover/bento:translate-x-2'>
				{!!title && (
					<div className='mb-1 mt-1 line-clamp-1 truncate font-sans font-bold text-[var(--foreground)]/80 leading-tight'>
						{title}
					</div>
				)}
				{description && (
					<div className='line-clamp-2 text-xs font-normal leading-snug text-[var(--muted-foreground)]'>
						{description}
					</div>
				)}
			</div>

			{/* BARRA INFERIOR fija */}
			<div className='pointer-events-none absolute inset-x-3 bottom-3'>
				<div className='flex items-center justify-between'>
					<div className='pointer-events-auto'>{icon}</div>
					<div className='pointer-events-auto flex items-center gap-2'>
						<IconButton
							aria-label='Cambiar tamaño'
							onClick={onToggleSize}>
							<IconMaximize className='h-4 w-4' />
						</IconButton>
						<IconButton
							aria-label='Cerrar'
							onClick={handleClose}>
							<IconX className='h-4 w-4' />
						</IconButton>
					</div>
				</div>
			</div>
		</div>
	);
};

function IconButton({ className, children, ...props }) {
	return (
		<button
			type='button'
			{...props}
			className={cn(
				'inline-flex items-center justify-center rounded-lg',
				'border border-[var(--border)] bg-[var(--card)]/80 backdrop-blur',
				'px-2.5 py-1.5 text-[var(--foreground)]',
				'hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition shadow-sm',
				'focus:outline-none focus:ring-2 focus:ring-[var(--foreground)]/20',
				className
			)}>
			{children}
		</button>
	);
}

function pickDataAria(obj) {
	const out = {};
	for (const k in obj) if (k.startsWith('data-') || k.startsWith('aria-')) out[k] = obj[k];
	return out;
}
