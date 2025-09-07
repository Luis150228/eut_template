import React from 'react';
import { BentoGrid, BentoGridItem } from '../ui/bento-grid';
import { cn } from '@/lib/utils';
import {
	IconClipboardCopy,
	IconFileBroken,
	IconSignature,
	IconTableColumn,
	IconArrowWaveRightUp,
	IconBoxAlignTopLeft,
	IconBoxAlignRightFilled,
} from '@tabler/icons-react';

const ICON = (Comp) => <Comp className='h-4 w-4 text-[var(--brand-red)]' />;
const Skeleton = () => (
	<div className='h-full w-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-200 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800' />
);

// 1) Mapa de tamaños → clases Tailwind
const spanClass = (span) => {
	switch (span) {
		case 'full':
			return 'col-span-full md:col-span-12';
		case 'half':
			return 'md:col-span-6';
		case 'third':
			return 'md:col-span-4';
		case 'quarter':
			return 'md:col-span-3';
		case 'tall':
			return 'row-span-2'; // el alto duplica
		case 'half-tall':
			return 'md:col-span-6 row-span-2';
		case 'full-tall':
			return 'col-span-full md:col-span-12 row-span-2 h-full';
		default:
			return '';
	}
};

export function BentoGridDemo() {
	return (
		<BentoGrid
			className={cn(
				// ancho y grid base
				'mx-auto w-full max-w-screen-2xl',
				'grid grid-cols-1 md:grid-cols-12 gap-4 auto-rows-[12rem]',
				// opcional: rellena huecos si usas muchas alturas distintas
				'grid-flow-row-dense'
			)}>
			{items.map((item, i) => (
				<BentoGridItem
					key={i}
					title={item.title}
					description={item.description}
					header={item.header}
					icon={item.icon}
					className={cn('min-w-0', spanClass(item.span), item.className)}
				/>
			))}
		</BentoGrid>
	);
}

// 2) Data: decide por item cuánto ocupa
const items = [
	// Ejemplo 1: una card "full" (las demás bajan de fila)
	{
		title: 'Stock de Almacen',
		description: 'Stock de equipos asignados a mi almacén.',
		header: <Skeleton />,
		icon: ICON(IconClipboardCopy),
		// span: 'full', // ← ocupa todo el renglón
		// opcional: altura grande,
		span: 'full-tall',
	},

	// Estas caerán a la fila siguiente automáticamente
	{ title: 'The Digital Revolution', header: <Skeleton />, icon: ICON(IconFileBroken), span: 'half-tall' },
	{ title: 'The Art of Design', header: <Skeleton />, icon: ICON(IconSignature), span: 'half' },

	// Otra fila: 3 columnas iguales
	{ title: 'Power of Communication', header: <Skeleton />, icon: ICON(IconTableColumn), span: 'third' },
	{ title: 'Pursuit of Knowledge', header: <Skeleton />, icon: ICON(IconArrowWaveRightUp), span: 'third' },
	{ title: 'Joy of Creation', header: <Skeleton />, icon: ICON(IconBoxAlignTopLeft), span: 'third' },

	// Alta y angosta
	{ title: 'Spirit of Adventure', header: <Skeleton />, icon: ICON(IconBoxAlignRightFilled), span: 'third' },
];
