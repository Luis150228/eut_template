'use client';
import React, { useState } from 'react';
import { Sidebar, SidebarBody, SidebarLink } from '../ui/sidebar';
import { IconArrowLeft, IconBrandTabler, IconSettings, IconUserBolt } from '@tabler/icons-react';
import { cn } from '@/lib/utils';
import Logo from './Logo.jsx';
import LogoIcon from './LogoIcon.jsx';
import Dashboard from './Dashboard.jsx';
import LogoEUT from '../images/EUTLogo';
import FlamaSantander from '../images/FlamaSantander';

export function SidebarEUT() {
	// …imports
	const links = [
		{ label: 'Dashboard', href: '#', icon: <IconBrandTabler className='h-5 w-5 shrink-0' /> },
		{ label: 'Profile', href: '#', icon: <IconUserBolt className='h-5 w-5 shrink-0' /> },
		{ label: 'Settings', href: '#', icon: <IconSettings className='h-5 w-5 shrink-0' /> },
		{ label: 'Logout', href: '#', icon: <IconArrowLeft className='h-5 w-5 shrink-0' /> },
	];

	const [open, setOpen] = useState(false);
	return (
		<div
			className={cn(
				'mx-auto flex w-full max-w-[95vw] flex-1 flex-col overflow-hidden rounded-md border border-neutral-200 bg-gray-100 md:flex-row dark:border-neutral-700 dark:bg-neutral-800',
				// for your use case, use `h-screen` instead of `h-[60vh]`
				'h-[90vh]'
			)}>
			<Sidebar
				open={open}
				setOpen={setOpen}>
				<SidebarBody className='justify-between gap-10'>
					<div className='flex flex-1 flex-col overflow-x-hidden overflow-y-auto'>
						{open ? <LogoEUT size={60} /> : <FlamaSantander size={30} />}
						<div className='mt-8 flex flex-col gap-2'>
							{links.map((link, idx) => (
								<SidebarLink
									key={idx}
									link={link}
								/>
							))}
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
