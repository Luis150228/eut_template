// LoaderBackdrop.jsx
export default function LoaderBackdrop({ children, className = '' }) {
	return (
		<div
			className={[
				'flex items-center justify-center w-full h-full min-h-[6rem]',
				// Usa --sidebar-ring si existe; si no, gris en light y rojo en dark
				'bg-[var(--Backdrop,#e5e7eb)] dark:bg-[var(--Backdrop,#c51617)]',
				className,
			].join(' ')}>
			{children}
		</div>
	);
}
