import * as React from 'react';

const STORAGE_KEY_THEME = 'eut.theme';

function getStoredTheme() {
	if (typeof window === 'undefined') return null;
	try {
		return localStorage.getItem(STORAGE_KEY_THEME);
	} catch {
		return null;
	}
}

function applyTheme(theme) {
	const root = document.documentElement;
	if (theme === 'dark') root.classList.add('dark');
	else root.classList.remove('dark');
	// opcional: atributo para debugging/CSS
	root.setAttribute('data-theme', theme === 'dark' ? 'dark' : 'light');
}

export default function ThemeToggle() {
	const [theme, setTheme] = React.useState(() => {
		const stored = getStoredTheme();
		if (stored) return stored;
		// fallback: preferencia del sistema
		if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
			return 'dark';
		}
		return 'light';
	});

	React.useEffect(() => {
		applyTheme(theme);
		try {
			localStorage.setItem(STORAGE_KEY_THEME, theme);
		} catch {}
	}, [theme]);

	const toggle = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

	return (
		<button
			type='button'
			onClick={toggle}
			className='rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-sm'
			aria-label='Cambiar tema'
			title='Cambiar tema'>
			{theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
		</button>
	);
}
