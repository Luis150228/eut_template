import React, { useMemo, useState } from 'react';
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
import EUTLineChart from '../charts/EUTLineChart';
import TablaDraw from '../tables/tableDrawing';
import FlowbiteForm from '../forms/FlowbiteForm';

import useHiddenCards from '@/hooks/useHiddenCards';
import useCardSpans, { nextSpan } from '@/hooks/useCardSpans';

const ICON = (Comp) => <Comp className='h-4 w-4 text-[var(--brand-red)]' />;
const Skeleton = () => (
	<div className='h-full w-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-200 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800' />
);

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

const HeaderLoader = () => (
	<LoaderBackdrop>
		<FlamaSantanderLoader
			size={110}
			strokeWidth={5}
			duration={2.4}
		/>
	</LoaderBackdrop>
);

/* — catálogo actual (con headers) — */
export function getBaseItems() {
	return [
		{
			title: 'Stock de Almacen',
			description: 'Stock de equipos asignados a mi almacén.',
			header: <Skeleton />,
			icon: ICON(IconClipboardCopy),
			span: 'half-tall',
			'data-id': 'stock-almacen',
		},
		{
			title: 'Grafica de Ejemplo Apache ECharts',
			header: (
				<EUTLineChart
					fill
					title='Stock semanal'
					categories={['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']}
					series={[
						{ name: 'Entradas', data: [12, 18, 10, 14, 9, 13, 11] },
						{ name: 'Salidas', data: [10, 12, 8, 16, 7, 12, 9] },
					]}
					smooth
					className='h-full p-0 border-0 bg-transparent shadow-none'
				/>
			),
			icon: ICON(IconFileBroken),
			span: 'half-tall',
			'data-id': 'grafica-echarts',
		},
		{
			title: 'Tabla de Ejemplo',
			header: <TablaDraw />,
			icon: ICON(IconSignature),
			span: 'full-tall',
			'data-id': 'tabla-ejemplo',
		},
		{
			title: 'Formulario de Ejemplo',
			header: <FlowbiteForm />,
			icon: ICON(IconSignature),
			span: 'half',
			'data-id': 'formulario-ejemplo',
		},
		{
			title: 'Power of Communication',
			header: <Skeleton />,
			icon: ICON(IconTableColumn),
			span: 'third',
			'data-id': 'power-communication',
		},
		{
			title: 'Pursuit of Knowledge',
			header: <Skeleton />,
			icon: ICON(IconArrowWaveRightUp),
			span: 'third',
			'data-id': 'pursuit-knowledge',
		},
		{
			title: 'Joy of Creation',
			header: <Skeleton />,
			icon: ICON(IconBoxAlignTopLeft),
			span: 'third',
			'data-id': 'joy-creation',
		},
		{
			title: 'Spirit of Adventure',
			header: <Skeleton />,
			icon: ICON(IconBoxAlignRightFilled),
			span: 'third',
			'data-id': 'spirit-adventure',
		},
	];
}

export function BentoGridEUT() {
	const { hiddenIds, hideOne, clearAll } = useHiddenCards();
	const { getSpan, setSpan } = useCardSpans();

	// aplica spans guardados y filtra ocultas en cada render
	const items = useMemo(() => {
		return getBaseItems()
			.map((it) => ({ ...it, span: getSpan(it['data-id'], it.span) }))
			.filter((it) => !hiddenIds.includes(it['data-id']));
	}, [hiddenIds, getSpan]);

	const [loadingIdx, setLoadingIdx] = useState(new Set());
	const setCardLoading = (idx, on) =>
		setLoadingIdx((prev) => {
			const next = new Set(prev);
			on ? next.add(idx) : next.delete(idx);
			return next;
		});

	const loaderOnElement = async () => {
		const idx = 0;
		setCardLoading(idx, true);
		try {
			await new Promise((r) => setTimeout(r, 1200));
		} finally {
			setCardLoading(idx, false);
		}
	};

	return (
		<>
			<div className='mt-4 flex items-center justify-between gap-3'>
				<button
					onClick={loaderOnElement}
					className='rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-[var(--foreground)]'>
					Actualizar element
				</button>
				<button
					onClick={clearAll}
					className='rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm text-[var(--foreground)]'>
					Reabrir cerradas
				</button>
			</div>

			<BentoGrid
				className={cn('w-full', 'grid grid-cols-1 md:grid-cols-12 gap-4 auto-rows-[12rem]', 'grid-flow-row-dense')}>
				{items.map((item, i) => {
					const { span, className: cls, header, title, description, icon, ...dataRest } = item;
					const id = item['data-id'];
					return (
						<BentoGridItem
							key={id || i}
							{...dataRest}
							title={title}
							description={description}
							header={
								<div className='h-full min-h-0 overflow-hidden'>{loadingIdx.has(i) ? <HeaderLoader /> : header}</div>
							}
							icon={icon}
							onToggleSize={() => setSpan(id, nextSpan(span))}
							onClose={() => hideOne(id)}
							className={cn('min-w-0', spanClass(span), cls)}
						/>
					);
				})}
			</BentoGrid>
		</>
	);
}
