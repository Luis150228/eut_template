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

/**
 * Wrapper de conveniencia para no tener que montar el Provider afuera.
 */
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

/**
 * Cuerpo que pinta versión desktop y mobile.
 */
export const SidebarBody = (props) => (
	<>
		<DesktopSidebar {...props} />
		<MobileSidebar {...props} />
	</>
);

/**
 * Sidebar en escritorio con “hover to open”.
 * - Sin botón. Abre al pasar el mouse; cierra al salir.
 * - FIX: el contenedor de children es ahora flex-col para que `mt-auto` funcione.
 */
export const DesktopSidebar = ({ className, children, ...props }) => {
	const { open, animate, peekOpen, setPeekOpen } = useSidebar();
	const isOpen = open || peekOpen;

	return (
		<motion.aside
			className={cn(
				'h-full px-3 py-3 hidden md:flex md:flex-col bg-neutral-100 dark:bg-neutral-800 w-[300px] shrink-0',
				className
			)}
			onMouseEnter={() => setPeekOpen(true)}
			onMouseLeave={() => setPeekOpen(false)}
			animate={{ width: animate ? (isOpen ? 300 : 60) : 300 }}
			transition={{ duration: 0.25, ease: 'easeInOut' }}
			{...props}>
			{/* FIX: este wrapper ahora es flex-col para soportar `mt-auto` en el último bloque (user card) */}
			<div className='flex flex-1 flex-col overflow-y-auto min-h-0'>{children}</div>
		</motion.aside>
	);
};

/**
 * Sidebar en mobile (overlay con AnimatePresence).
 * - FIX: también aquí el wrapper interior es flex-col por si usas `mt-auto` en el user card.
 */
export const MobileSidebar = ({ className, children, ...props }) => {
	const { open, setOpen } = useSidebar();

	return (
		<div
			className={cn(
				'h-10 px-4 py-4 flex md:hidden items-center justify-between bg-neutral-100 dark:bg-neutral-800 w-full',
				className
			)}
			{...props}>
			{/* Botón hamburguesa en mobile */}
			<div className='flex justify-end z-20 w-full'>
				<button
					type='button'
					aria-label={open ? 'Cerrar sidebar' : 'Abrir sidebar'}
					onClick={() => setOpen(!open)}
					className={cn(
						'inline-flex items-center justify-center rounded-md p-2',
						'hover:bg-neutral-200 dark:hover:bg-neutral-700 transition',
						'text-neutral-800 dark:text-neutral-200'
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
							'fixed inset-0 h-full w-full bg-white dark:bg-neutral-900 p-10 z-[100] flex flex-col justify-between'
						)}>
						<div className='absolute right-4 top-4'>
							<button
								type='button'
								aria-label='Cerrar sidebar'
								onClick={() => setOpen(false)}
								className={cn(
									'inline-flex items-center justify-center rounded-md p-2',
									'hover:bg-neutral-200 dark:hover:bg-neutral-700 transition',
									'text-neutral-800 dark:text-neutral-200'
								)}>
								<IconX size={18} />
							</button>
						</div>

						{/* FIX: flex-col para soportar `mt-auto` del user card en mobile */}
						<div className='mt-8 flex flex-1 flex-col overflow-y-auto min-h-0'>{children}</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

/**
 * Link del sidebar (colapsa el label cuando está cerrado).
 * Usa open || peekOpen para decidir si muestra el texto.
 */
export const SidebarLink = ({ link, className = '', ...props }) => {
	const { open, animate, peekOpen } = useSidebar();
	const isOpen = open || peekOpen;

	return (
		<a
			href={link.href}
			className={cn('flex items-center justify-start gap-2 group/sidebar py-2', className)}
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
					'text-neutral-700 dark:text-neutral-200 text-sm transition-[opacity,width] duration-200 whitespace-pre inline-block !p-0 !m-0',
					isOpen ? 'ml-1' : 'ml-0 overflow-hidden'
				)}>
				{link.label}
			</motion.span>
		</a>
	);
};
