'use client';
import React, { useState } from 'react';
import { Sidebar, SidebarBody, SidebarLink } from '../ui/sidebar';
import { IconArrowLeft, IconBrandTabler, IconSettings, IconUserBolt } from '@tabler/icons-react';
import { cn } from '@/lib/utils';
import Dashboard from './Dashboard.jsx';
import LogoEUT from '../images/EUTLogo';
import FlamaSantander from '../images/FlamaSantander';
import SidebarCardsSection from '../sidebar/SidebarCardsSection';

export function SidebarEUT() {
	const links = [
		{ label: 'Dashboard', href: '#', icon: <IconBrandTabler className='h-5 w-5 shrink-0' /> },
		{ label: 'Perfil', href: '#', icon: <IconUserBolt className='h-5 w-5 shrink-0' /> },
		{ label: 'Settings', href: '#', icon: <IconSettings className='h-5 w-5 shrink-0' /> },
		{ label: 'Logout', href: '#', icon: <IconArrowLeft className='h-5 w-5 shrink-0' /> },
	];
	const [open, setOpen] = useState(false);

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

						<div className='mt-8 flex flex-col gap-2'>
							{links.map((link, idx) => (
								<SidebarLink
									key={idx}
									link={link}
								/>
							))}

							{/* Bloque “Cards” reusable */}
							<SidebarCardsSection />
						</div>
					</div>

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
