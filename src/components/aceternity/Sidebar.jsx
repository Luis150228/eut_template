'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { Sidebar, SidebarBody, SidebarLink } from '../ui/sidebar';
import { IconArrowLeft, IconBrandTabler, IconSettings, IconUserBolt, IconEye, IconEyeOff } from '@tabler/icons-react';
import { cn } from '@/lib/utils';
import Dashboard from './Dashboard.jsx';
import LogoEUT from '../images/EUTLogo';
import FlamaSantander from '../images/FlamaSantander';

// helpers del grid
import { getBaseItems, loadHiddenSet, saveHiddenSet, STORAGE_KEY_HIDDEN } from './BentoGrid';

export function SidebarEUT() {
	// Links normales (sin Cards aquí para evitar choques con SidebarLink)
	const links = [
		{ label: 'Dashboard', href: '#', icon: <IconBrandTabler className='h-5 w-5 shrink-0' /> },
		{ label: 'Profile', href: '#', icon: <IconUserBolt className='h-5 w-5 shrink-0' /> },
		{ label: 'Settings', href: '#', icon: <IconSettings className='h-5 w-5 shrink-0' /> },
		{ label: 'Logout', href: '#', icon: <IconArrowLeft className='h-5 w-5 shrink-0' /> },
	];

	const [open, setOpen] = useState(false);
	const [hiddenOpen, setHiddenOpen] = useState(false);

	// Catálogo id -> título
	const catalogMap = useMemo(() => {
		const map = new Map();
		getBaseItems().forEach((it) => map.set(it['data-id'], it.title));
		return map;
	}, []);

	// Ocultas en vivo
	const [hiddenIds, setHiddenIds] = useState(() => [...loadHiddenSet()]);
	useEffect(() => {
		const refresh = () => setHiddenIds([...loadHiddenSet()]);
		window.addEventListener('eut:hidden:changed', refresh);
		const onStorage = (e) => {
			if (e.key === STORAGE_KEY_HIDDEN) refresh();
		};
		window.addEventListener('storage', onStorage);
		return () => {
			window.removeEventListener('eut:hidden:changed', refresh);
			window.removeEventListener('storage', onStorage);
		};
	}, []);

	const restore = (id) => {
		const set = loadHiddenSet();
		set.delete(id);
		saveHiddenSet(set); // emite evento → actualiza grid y este sidebar
		setHiddenIds([...set]); // refresco local inmediato
	};

	return (
		<div
			className={cn(
				'flex w-full flex-1 flex-col md:flex-row',
				'px-5',
				'overflow-hidden rounded-md border border-neutral-200 bg-gray-100 dark:border-neutral-700 dark:bg-neutral-800',
				'h-[90vh]'
			)}>
			<Sidebar
				open={open}
				setOpen={setOpen}>
				<SidebarBody className='justify-between gap-6'>
					<div className='flex flex-1 flex-col overflow-x-hidden overflow-y-auto'>
						{open ? <LogoEUT size={60} /> : <FlamaSantander size={30} />}

						{/* Links principales */}
						<div className='mt-8 flex flex-col gap-2'>
							{links.map((link, idx) => (
								<SidebarLink
									key={idx}
									link={link}
								/>
							))}

							{/* —— Fila especial “Cards” con lista colapsable —— */}
							<div className='w-full'>
								{/* Botón estilo link */}
								<button
									type='button'
									onClick={() => setHiddenOpen((v) => !v)}
									aria-expanded={hiddenOpen}
									className={cn(
										'w-full rounded-lg px-3 py-2',
										'flex items-center justify-between gap-2',
										'text-[var(--foreground)] hover:bg-black/[0.06] dark:hover:bg-white/[0.06]',
										'border border-transparent hover:border-[var(--border)] transition'
									)}>
									<span className='inline-flex items-center gap-2'>
										<IconEyeOff className='h-5 w-5 shrink-0' />
										<span className='text-sm'>Cards</span>
									</span>
									<span className='rounded-md border border-[var(--border)] px-1.5 py-0.5 text-[10px] text-[var(--muted-foreground)]'>
										{hiddenIds.length}
									</span>
								</button>

								{/* Lista: solo si está abierta y hay elementos */}
								{hiddenOpen &&
									(hiddenIds.length === 0 ? (
										<div className='mt-1 pl-10 pr-2 text-xs text-[var(--muted-foreground)]'>
											No hay tarjetas ocultas.
										</div>
									) : (
										<ul className='mt-1 space-y-1 pl-8 pr-2'>
											{hiddenIds.map((id) => (
												<li key={id}>
													<button
														type='button'
														onClick={() => restore(id)}
														className={cn(
															'w-full rounded-lg px-3 py-2 text-left',
															'flex items-center gap-2',
															'text-[var(--foreground)] hover:bg-black/[0.06] dark:hover:bg-white/[0.06]',
															'border border-transparent hover:border-[var(--border)] transition'
														)}
														title='Hacer visible'>
														<IconEye className='h-4 w-4 opacity-80' />
														<span className='truncate text-sm'>{catalogMap.get(id) || id}</span>
													</button>
												</li>
											))}
										</ul>
									))}
							</div>
							{/* ——————————————————————————————— */}
						</div>
					</div>

					{/* Perfil */}
					<div>
						<SidebarLink
							link={{
								label: 'Luis Fernando Rangel',
								href: '#',
								icon: (
									<img
										src='./avatar/C356882Avatar.jpeg'
										className='h-7 w-7 shrink-0 rounded-full'
										width={60}
										height={60}
										alt='Avatar'
									/>
								),
							}}
						/>
					</div>
				</SidebarBody>
			</Sidebar>

			<Dashboard />
		</div>
	);
}
