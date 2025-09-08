import { cn } from '@/lib/utils';
import { IconMaximize, IconX } from '@tabler/icons-react';

export const BentoGrid = ({ className, children }) => {
	return (
		<div className={cn('mx-auto grid max-w-7xl grid-cols-1 gap-4 md:auto-rows-[18rem] md:grid-cols-3', className)}>
			{children}
		</div>
	);
};

export const BentoGridItem = ({
	className,
	title,
	description,
	header,
	icon,
	onToggleSize, // opcional (sin lógica por ahora)
	onClose, // opcional (sin lógica por ahora)
}) => {
	return (
		<div
			className={cn(
				'group/bento relative row-span-1 flex flex-col justify-between space-y-4',
				'rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 pb-12', // pb extra para la barra inferior
				'transition duration-200 hover:shadow-xl shadow-sm',
				className
			)}>
			{/* Contenido superior / header */}
			{header}

			{/* Texto (con el micro desplazamiento en hover que ya tenías) */}
			<div className='transition duration-200 group-hover/bento:translate-x-2'>
				<div className='mt-2 mb-2 font-sans font-bold text-[var(--foreground)]/80'>{title}</div>
				{description && (
					<div className='font-sans text-xs font-normal text-[var(--muted-foreground)]'>{description}</div>
				)}
			</div>

			{/* BARRA INFERIOR: icono izq + acciones der */}
			<div className='pointer-events-none absolute inset-x-3 bottom-3'>
				<div className='flex items-center justify-between'>
					{/* Icono principal (el que ya pasas) */}
					<div className='pointer-events-auto'>{icon}</div>

					{/* Acciones derechas (solo UI por ahora) */}
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

/* — helpers — */
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
				'focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-[var(--foreground)]/20',
				className
			)}>
			{children}
		</button>
	);
}
