'use client';
import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const Ctx = createContext(null);

export function Modal({ children, defaultOpen = false, onOpenChange }) {
	const [open, setOpen] = useState(!!defaultOpen);
	const value = useMemo(
		() => ({
			open,
			setOpen: (v) => {
				setOpen((prev) => {
					const next = typeof v === 'function' ? v(prev) : v;
					onOpenChange?.(next);
					return next;
				});
			},
		}),
		[open, onOpenChange]
	);
	return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useModal = () => useContext(Ctx);

export function ModalTrigger({ asChild, className, children, ...props }) {
	const { setOpen } = useContext(Ctx);
	const Comp = asChild ? 'span' : 'button';
	return (
		<Comp
			type={asChild ? undefined : 'button'}
			onClick={() => setOpen(true)}
			className={cn(
				'relative inline-flex items-center gap-2 rounded-md px-4 py-2',
				'border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)]',
				'shadow-sm transition hover:bg-black/5 dark:hover:bg-white/10',
				className
			)}
			{...props}>
			{children}
		</Comp>
	);
}

export function ModalBody({ children, backdropClassName, containerClassName }) {
	const { open, setOpen } = useContext(Ctx);

	// ESC + bloquear scroll del documento
	useEffect(() => {
		if (!open) return;
		const onKey = (e) => e.key === 'Escape' && setOpen(false);
		document.addEventListener('keydown', onKey);
		const root = document.documentElement;
		const prev = root.style.overflow;
		root.style.overflow = 'hidden';
		return () => {
			document.removeEventListener('keydown', onKey);
			root.style.overflow = prev;
		};
	}, [open, setOpen]);

	return (
		<AnimatePresence>
			{open && (
				<div className='fixed inset-0 z-[200]'>
					{/* Backdrop (clic fuera cierra) */}
					<motion.div
						className={cn(
							'absolute inset-0 bg-black/30 dark:bg-[var(--Backdrop)]/50 backdrop-blur-[2px]',
							backdropClassName
						)}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={() => setOpen(false)}
					/>

					{/* Contenedor centrado */}
					<motion.div
						role='dialog'
						aria-modal='true'
						className='absolute inset-0 grid place-items-center p-3 md:p-6'
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}>
						{/* PANEL: 90% del viewport y layout en columna */}
						<motion.div
							className={cn(
								'relative flex h-[70vh] w-[70vw] max-h-[70vh] max-w-[70vw] flex-col overflow-hidden',
								'rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] shadow-2xl',
								containerClassName
							)}
							initial={{ y: 24, scale: 0.98 }}
							animate={{ y: 0, scale: 1, transition: { type: 'spring', stiffness: 260, damping: 22 } }}
							exit={{ y: 24, opacity: 0 }}
							onClick={(e) => e.stopPropagation()}>
							{children}
						</motion.div>
					</motion.div>
				</div>
			)}
		</AnimatePresence>
	);
}

/* Contenido con scroll propio (el footer queda fijo abajo del panel) */
export function ModalContent({ className, children }) {
	return <div className={cn('flex-1 overflow-auto p-4 md:p-6', className)}>{children}</div>;
}

export function ModalFooter({ className, children }) {
	return (
		<div
			className={cn(
				'border-t border-[var(--border)] bg-[var(--card)] p-3 md:p-4',
				'flex items-center justify-end gap-2',
				className
			)}>
			{children}
		</div>
	);
}

export function ModalClose({ asChild, className, children = 'Close', ...props }) {
	const { setOpen } = useContext(Ctx);
	const Comp = asChild ? 'span' : 'button';
	return (
		<Comp
			type={asChild ? undefined : 'button'}
			onClick={() => setOpen(false)}
			className={className}
			{...props}>
			{children}
		</Comp>
	);
}
