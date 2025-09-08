import { cn } from '@/lib/utils';
import { IconMaximize, IconX } from '@tabler/icons-react';

export const BentoGrid = ({ className, children }) => {
	// Grid ancho completo, sin centrado ni max-w internos
	return (
		<div className={cn('grid w-full grid-cols-1 gap-4 md:auto-rows-[18rem] md:grid-cols-3', className)}>{children}</div>
	);
};

export const BentoGridItem = ({ className, title, description, header, icon, onToggleSize, onClose, ...rest }) => {
	const dataAttrs = pickDataAria(rest);
	return (
		<div
			{...dataAttrs}
			className={cn(
				'group/bento relative row-span-1 flex min-h-0 flex-col justify-between space-y-4',
				'rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 pb-12',
				'transition duration-200 hover:shadow-xl shadow-sm',
				className
			)}>
			{header}

			<div className='transition duration-200 group-hover/bento:translate-x-2'>
				<div className='mt-2 mb-2 font-sans font-bold text-[var(--foreground)]/80'>{title}</div>
				{description && (
					<div className='font-sans text-xs font-normal text-[var(--muted-foreground)]'>{description}</div>
				)}
			</div>

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
							onClick={onClose}>
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
