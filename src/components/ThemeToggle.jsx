import { useEffect, useState } from 'react';

export default function ThemeToggle({ className = '' }) {
	const [mode, setMode] = useState('light');

	useEffect(() => {
		const saved = localStorage.getItem('theme');
		const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
		const initial = saved || (prefersDark ? 'dark' : 'light');
		setMode(initial);
		document.documentElement.classList.toggle('dark', initial === 'dark');
	}, []);

	const toggle = () => {
		const next = mode === 'dark' ? 'light' : 'dark';
		setMode(next);
		document.documentElement.classList.toggle('dark', next === 'dark');
		localStorage.setItem('theme', next);
	};

	return (
		<button
			onClick={toggle}
			className={
				'px-3 py-2 rounded-md border text-sm ' +
				'bg-[var(--sidebar-bg)] text-[var(--sidebar-fg)] ' + // se integra al esquema de colores
				className
			}
			aria-label='Cambiar tema'
			title='Cambiar tema'>
			{mode === 'dark' ? 'Light' : 'Dark'}
		</button>
	);
}
