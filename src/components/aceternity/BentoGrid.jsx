import React, { useState } from 'react';
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
import FlamaSantanderLoader from '../images/FlamaSantanderLoader';
import LoaderBackdrop from '../images/LoaderBackdrop';

const ICON = (Comp) => <Comp className='h-4 w-4 text-[var(--brand-red)]' />;
const Skeleton = () => (
	<div className='h-full w-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-200 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800' />
);

// 1) Mapa de tamaños → clases Tailwind (sin cambios complejos)
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
			return 'row-span-2';
		case 'half-tall':
			return 'md:col-span-6 row-span-2';
		case 'full-tall':
			return 'col-span-full md:col-span-12 row-span-2 h-full';
		default:
			return '';
	}
};

// 2) Data original (sin loader dentro)
const items = [
	{
		title: 'Stock de Almacen',
		description: 'Stock de equipos asignados a mi almacén.',
		header: <Skeleton />,
		icon: ICON(IconClipboardCopy),
		span: 'half-tall',
	},
	{ title: 'The Digital Revolution', header: <Skeleton />, icon: ICON(IconFileBroken), span: 'half-tall' },
	{ title: 'The Art of Design', header: <Skeleton />, icon: ICON(IconSignature), span: 'half' },
	{ title: 'Power of Communication', header: <Skeleton />, icon: ICON(IconTableColumn), span: 'third' },
	{ title: 'Pursuit of Knowledge', header: <Skeleton />, icon: ICON(IconArrowWaveRightUp), span: 'third' },
	{ title: 'Joy of Creation', header: <Skeleton />, icon: ICON(IconBoxAlignTopLeft), span: 'third' },
	{ title: 'Spirit of Adventure', header: <Skeleton />, icon: ICON(IconBoxAlignRightFilled), span: 'third' },
];

// 3) Loader “de reemplazo” para el header (centra el SVG y conserva el alto)
const HeaderLoader = ({ size = 96 }) => (
	<LoaderBackdrop>
		<FlamaSantanderLoader
			size={110}
			strokeWidth={5}
			duration={2.4}
		/>
	</LoaderBackdrop>
);

export function BentoGridDemo() {
	// Índices que están cargando (permite múltiples a la vez)
	const [loadingIdx, setLoadingIdx] = useState(new Set());

	const setCardLoading = (idx, on) =>
		setLoadingIdx((prev) => {
			const next = new Set(prev);
			on ? next.add(idx) : next.delete(idx);
			return next;
		});

	// Ejemplo: refrescar la card con índice 2 (la tercera)
	const loaderOnElement = async () => {
		const idx = 0;
		setCardLoading(idx, true);
		try {
			// await fetch('/api/card-2');
			await new Promise((r) => setTimeout(r, 1500)); // demo
		} finally {
			setCardLoading(idx, false);
		}
	};

	// Render: si una card está “loading”, se reemplaza su header por el loader
	const renderItems = items.map((it, i) => ({
		...it,
		header: loadingIdx.has(i) ? <HeaderLoader /> : it.header,
	}));

	return (
		<>
			{/* Botón de ejemplo para disparar la actualización de la card [2] */}
			<div className='mt-4'>
				<button
					onClick={loaderOnElement}
					className='rounded-md bg-neutral-200 px-3 py-2 dark:bg-neutral-800'>
					Actualizar element
				</button>
			</div>

			<BentoGrid
				className={cn(
					'mx-auto w-full max-w-screen-2xl',
					'grid grid-cols-1 md:grid-cols-12 gap-4 auto-rows-[12rem]',
					'grid-flow-row-dense'
				)}>
				{renderItems.map((item, i) => (
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
		</>
	);
}
