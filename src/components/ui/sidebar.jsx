'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconMenu2, IconX } from '@tabler/icons-react';
import { cn } from '@/lib/utils';
import { SidebarContext, useSidebar } from '@/hooks/useSidebar';

/**
 * Provider: si NO pasas open/setOpen por props, usa estado interno.
 * Además, maneja peekOpen para el “hover to open” en desktop.
 */
export const SidebarProvider = ({ children, open: openProp, setOpen: setOpenProp, animate = true }) => {
	const [openState, setOpenState] = useState(false);
	const open = typeof openProp === 'boolean' ? openProp : openState;
	const setOpen = typeof setOpenProp === 'function' ? setOpenProp : setOpenState;

	const [peekOpen, setPeekOpen] = useState(false);

	return (
		<SidebarContext.Provider value={{ open, setOpen, animate, peekOpen, setPeekOpen }}>
			{children}
		</SidebarContext.Provider>
	);
};

export const Sidebar = ({ children, open, setOpen, animate = true }) => {
	return (
		<SidebarProvider
			open={open}
			setOpen={setOpen}
			animate={animate}>
			{children}
		</SidebarProvider>
	);
};

export const SidebarBody = (props) => (
	<>
		<DesktopSidebar {...props} />
		<MobileSidebar {...props} />
	</>
);

/**
 * Desktop con “hover to open”.
 * Fondo light = neutral; fondo dark = var(--sidebar-bg).
 * Texto/iconos heredan var(--sidebar-fg).
 */
export const DesktopSidebar = ({ className, children, ...props }) => {
	const { open, animate, peekOpen, setPeekOpen } = useSidebar();
	const isOpen = open || peekOpen;

	return (
		<motion.aside
			data-sidebar='rail' /* 👈 hook para el CSS de override */
			className={cn(
				'hidden md:flex h-full w-[300px] shrink-0 flex-col px-3 py-3',
				'bg-neutral-100 dark:bg-[var(--sidebar-bg)]',
				'border border-neutral-200 dark:border-[var(--sidebar-border)]',
				'text-[var(--sidebar-fg)]',
				className
			)}
			onMouseEnter={() => setPeekOpen(true)}
			onMouseLeave={() => setPeekOpen(false)}
			animate={{ width: animate ? (isOpen ? 300 : 60) : 300 }}
			transition={{ duration: 0.25, ease: 'easeInOut' }}
			{...props}>
			<div className='flex flex-1 flex-col overflow-y-auto min-h-0'>{children}</div>
		</motion.aside>
	);
};

/**
 * Mobile overlay (mismo criterio de color que Desktop).
 */
export const MobileSidebar = ({ className, children, ...props }) => {
	const { open, setOpen } = useSidebar();

	return (
		<div
			data-sidebar='mobilebar' /* 👈 hook para el CSS de override */
			className={cn(
				'md:hidden flex h-10 w-full items-center justify-between px-4 py-4',
				'bg-neutral-100 dark:bg-[var(--sidebar-bg)]',
				'border-b border-neutral-200 dark:border-[var(--sidebar-border)]',
				'text-[var(--sidebar-fg)]',
				className
			)}
			{...props}>
			<div className='flex justify-end z-20 w-full'>
				<button
					type='button'
					aria-label={open ? 'Cerrar sidebar' : 'Abrir sidebar'}
					onClick={() => setOpen(!open)}
					className={cn(
						'inline-flex items-center justify-center rounded-md p-2',
						'hover:bg-neutral-200/60 dark:hover:bg-black/10 transition'
					)}>
					{open ? <IconX size={18} /> : <IconMenu2 size={18} />}
				</button>
			</div>

			<AnimatePresence>
				{open && (
					<motion.div
						initial={{ x: '-100%', opacity: 0 }}
						animate={{ x: 0, opacity: 1 }}
						exit={{ x: '-100%', opacity: 0 }}
						transition={{ duration: 0.25, ease: 'easeInOut' }}
						className={cn(
							'fixed inset-0 h-full w-full bg-white dark:bg-[var(--sidebar-bg)] p-10 z-[100] flex flex-col justify-between',
							'text-[var(--sidebar-fg)]'
						)}>
						<div className='absolute right-4 top-4'>
							<button
								type='button'
								aria-label='Cerrar sidebar'
								onClick={() => setOpen(false)}
								className={cn(
									'inline-flex items-center justify-center rounded-md p-2',
									'hover:bg-neutral-200/60 dark:hover:bg-black/10 transition'
								)}>
								<IconX size={18} />
							</button>
						</div>

						<div className='mt-8 flex flex-1 flex-col overflow-y-auto min-h-0'>{children}</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

/**
 * Link del sidebar (iconos Tabler heredan currentColor).
 */
export const SidebarLink = ({ link, className = '', ...props }) => {
	const { open, animate, peekOpen } = useSidebar();
	const isOpen = open || peekOpen;

	return (
		<a
			href={link.href}
			className={cn('flex items-center justify-start gap-2 group/sidebar py-2', 'text-[var(--sidebar-fg)]', className)}
			{...props}>
			{link.icon}
			<motion.span
				initial={false}
				animate={{
					width: animate ? (isOpen ? 'auto' : 0) : 'auto',
					opacity: animate ? (isOpen ? 1 : 0) : 1,
				}}
				transition={{ duration: 0.2, ease: 'easeInOut' }}
				className={cn(
					'text-sm transition-[opacity,width] duration-200 whitespace-pre inline-block !p-0 !m-0',
					isOpen ? 'ml-1' : 'ml-0 overflow-hidden'
				)}>
				{link.label}
			</motion.span>
		</a>
	);
};
