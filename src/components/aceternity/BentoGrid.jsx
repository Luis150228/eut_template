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
	IconActivity,
} from '@tabler/icons-react';
import FlamaSantanderLoader from '../images/FlamaSantanderLoader';
import LoaderBackdrop from '../images/LoaderBackdrop';
import EUTLineChart from '../charts/EUTLineChart';
import TablaDraw from '../tables/tableDrawing';
import FlowbiteForm from '../forms/FlowbiteForm';

import useHiddenCards from '@/hooks/useHiddenCards';
import useCardSpans, { nextSpan } from '@/hooks/useCardSpans';
import EUTDynamicChart from '../charts/EUTDynamicChart';
import EUTCallsFollowUpChart from '../charts/EUTCallsFollowUpChart';
import { AnimatedModalDemo } from '../modals/AnimatedModalDemo';
import UserEditForm from '../forms/UserEditForm';
import { ModalEditUser } from '../modals/modalEditUser';
import ImageDropzone from '../uploader/ImageDropzone';
import ImportIncidents from '../uploader/ImportIncidents';
import IncidentesExport from '../filesDownloads/IncidentesExport';
import ExportBySheets from '../filesDownloads/IncidensExportSheets';
import ImportCSV from '../uploader/ImportCSV';
import { IconOrLink } from '../images/IconOrLink';

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

const datasetCalls = [
	{
		fecha: '2025-08-22',
		recibidas: 604,
		atendidas: 598,
		abandonadas: 6,
		abandono_menos10: 1,
		prc_abandono: '0.83',
		tiempoAHT: '00:06:44',
		nummin: 242034,
		rangosem: '22 AGO - 28 AGO',
		anhio: 2025,
	},
	{
		fecha: '2025-08-23',
		recibidas: 35,
		atendidas: 35,
		abandonadas: 0,
		abandono_menos10: 0,
		prc_abandono: '0.00',
		tiempoAHT: '00:05:30',
		nummin: 11562,
		rangosem: '22 AGO - 28 AGO',
		anhio: 2025,
	},
	{
		fecha: '2025-08-24',
		recibidas: 3,
		atendidas: 3,
		abandonadas: 0,
		abandono_menos10: 0,
		prc_abandono: '0.00',
		tiempoAHT: '00:09:01',
		nummin: 1624,
		rangosem: '22 AGO - 28 AGO',
		anhio: 2025,
	},
	{
		fecha: '2025-08-25',
		recibidas: 721,
		atendidas: 692,
		abandonadas: 29,
		abandono_menos10: 8,
		prc_abandono: '2.95',
		tiempoAHT: '00:06:10',
		nummin: 256320,
		rangosem: '22 AGO - 28 AGO',
		anhio: 2025,
	},
	{
		fecha: '2025-08-26',
		recibidas: 622,
		atendidas: 619,
		abandonadas: 3,
		abandono_menos10: 0,
		prc_abandono: '0.48',
		tiempoAHT: '00:06:26',
		nummin: 239528,
		rangosem: '22 AGO - 28 AGO',
		anhio: 2025,
	},
	{
		fecha: '2025-08-27',
		recibidas: 622,
		atendidas: 620,
		abandonadas: 2,
		abandono_menos10: 2,
		prc_abandono: '0.00',
		tiempoAHT: '00:06:33',
		nummin: 243775,
		rangosem: '22 AGO - 28 AGO',
		anhio: 2025,
	},
	{
		fecha: '2025-08-28',
		recibidas: 540,
		atendidas: 536,
		abandonadas: 4,
		abandono_menos10: 3,
		prc_abandono: '0.19',
		tiempoAHT: '00:06:42',
		nummin: 215814,
		rangosem: '22 AGO - 28 AGO',
		anhio: 2025,
	},
	{
		fecha: '2025-08-29',
		recibidas: 363,
		atendidas: 361,
		abandonadas: 2,
		abandono_menos10: 2,
		prc_abandono: '0.00',
		tiempoAHT: '00:05:54',
		nummin: 127881,
		rangosem: '29 AGO - 04 SEP',
		anhio: 2025,
	},
	{
		fecha: '2025-08-30',
		recibidas: 15,
		atendidas: 15,
		abandonadas: 0,
		abandono_menos10: 0,
		prc_abandono: '0.00',
		tiempoAHT: '00:04:56',
		nummin: 4442,
		rangosem: '29 AGO - 04 SEP',
		anhio: 2025,
	},
	{
		fecha: '2025-08-31',
		recibidas: 11,
		atendidas: 10,
		abandonadas: 1,
		abandono_menos10: 1,
		prc_abandono: '0.00',
		tiempoAHT: '00:04:52',
		nummin: 2926,
		rangosem: '29 AGO - 04 SEP',
		anhio: 2025,
	},
	{
		fecha: '2025-09-01',
		recibidas: 586,
		atendidas: 585,
		abandonadas: 1,
		abandono_menos10: 1,
		prc_abandono: '0.00',
		tiempoAHT: '00:05:36',
		nummin: 196626,
		rangosem: '29 AGO - 04 SEP',
		anhio: 2025,
	},
	{
		fecha: '2025-09-02',
		recibidas: 555,
		atendidas: 552,
		abandonadas: 3,
		abandono_menos10: 0,
		prc_abandono: '0.54',
		tiempoAHT: '00:06:12',
		nummin: 205605,
		rangosem: '29 AGO - 04 SEP',
		anhio: 2025,
	},
	{
		fecha: '2025-09-03',
		recibidas: 509,
		atendidas: 508,
		abandonadas: 1,
		abandono_menos10: 0,
		prc_abandono: '0.20',
		tiempoAHT: '00:06:07',
		nummin: 186704,
		rangosem: '29 AGO - 04 SEP',
		anhio: 2025,
	},
	{
		fecha: '2025-09-04',
		recibidas: 789,
		atendidas: 764,
		abandonadas: 25,
		abandono_menos10: 6,
		prc_abandono: '2.43',
		tiempoAHT: '00:06:55',
		nummin: 317674,
		rangosem: '29 AGO - 04 SEP',
		anhio: 2025,
	},
	{
		fecha: '2025-09-05',
		recibidas: 414,
		atendidas: 411,
		abandonadas: 3,
		abandono_menos10: 2,
		prc_abandono: '0.24',
		tiempoAHT: '00:05:46',
		nummin: 142322,
		rangosem: '05 SEP - 11 SEP',
		anhio: 2025,
	},
	{
		fecha: '2025-09-06',
		recibidas: 47,
		atendidas: 47,
		abandonadas: 0,
		abandono_menos10: 0,
		prc_abandono: '0.00',
		tiempoAHT: '00:05:04',
		nummin: 14306,
		rangosem: '05 SEP - 11 SEP',
		anhio: 2025,
	},
	{
		fecha: '2025-09-07',
		recibidas: 7,
		atendidas: 6,
		abandonadas: 1,
		abandono_menos10: 0,
		prc_abandono: '14.29',
		tiempoAHT: '00:02:07',
		nummin: 767,
		rangosem: '05 SEP - 11 SEP',
		anhio: 2025,
	},
];

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
			icon: (
				<IconOrLink
					Icon={IconClipboardCopy}
					href='https://eutranet.eutranet.com'
				/>
			),
			span: 'half-tall',
			'data-id': 'stock-almacen',
			cardType: 'reporte',
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
			icon: <IconOrLink Icon={IconFileBroken} />,
			span: 'half-tall',
			'data-id': 'grafica-echarts',
			cardType: 'reporte',
		},
		{
			title: 'Tabla de Ejemplo',
			header: <TablaDraw />,
			icon: <IconOrLink Icon={IconSignature} />,
			span: 'full-tall',
			'data-id': 'tabla-ejemplo',
			cardType: 'reporte',
		},
		{
			title: 'Formulario de Ejemplo',
			header: <FlowbiteForm />,
			icon: <IconOrLink Icon={IconSignature} />,
			span: 'half',
			'data-id': 'formulario-ejemplo',
			cardType: 'formulario',
		},
		{
			header: (
				<EUTCallsFollowUpChart
					rows={datasetCalls}
					className='h-full'
				/>
			),
			icon: <IconOrLink Icon={IconActivity} />,
			span: 'half-tall',
			'data-id': 'realtime-dynamic',
			cardType: 'reporte',
		},
		{
			title: 'Modal Animado',
			header: <AnimatedModalDemo />,
			icon: <IconOrLink Icon={IconTableColumn} />,
			span: 'third',
			'data-id': 'modal-animado',
			cardType: 'reporte',
		},
		{
			title: 'Editar Usuario',
			header: <ModalEditUser />,
			icon: <IconOrLink Icon={IconArrowWaveRightUp} />,
			span: 'third',
			'data-id': 'editar-usuario',
			cardType: 'formulario',
		},
		{
			title: 'Add Imagen',
			header: <ImageDropzone />,
			icon: <IconOrLink Icon={IconBoxAlignTopLeft} />,
			span: 'third',
			'data-id': 'add-imagen',
			cardType: 'dataupdate',
		},
		{
			title: 'CSV to JSON',
			header: <ImportCSV fileName='Tareas' />,
			icon: <IconOrLink Icon={IconTableColumn} />,
			span: 'third',
			'data-id': 'csv-to-json',
			cardType: 'dataupdate',
		},
		{
			title: 'JSON to XLSX',
			header: <IncidentesExport />,
			icon: <IconOrLink Icon={IconBoxAlignRightFilled} />,
			span: 'third',
			'data-id': 'json-to-xlsx',
			cardType: 'reporte',
		},
		{
			title: 'JSON to XLSX Sheets',
			header: <ExportBySheets />,
			icon: <IconOrLink Icon={IconBoxAlignRightFilled} />,
			span: 'third',
			'data-id': 'json-to-xlsx-sheets',
			cardType: 'reporte',
		},
		{
			title: 'Spirit of Adventure',
			header: <Skeleton />,
			icon: <IconOrLink Icon={IconBoxAlignRightFilled} />,
			span: 'third',
			'data-id': 'spirit-adventure',
			cardType: 'reporte',
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
			{/* <div className='mt-4 flex items-center justify-between gap-3'> */}
			{/* <button
					onClick={loaderOnElement}
					className='rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-[var(--foreground)]'>
					Actualizar element
				</button>
				<button
					onClick={clearAll}
					className='rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm text-[var(--foreground)]'>
					Reabrir cerradas
				</button> */}
			{/* </div> */}

			<BentoGrid
				className={cn(
					'w-full',
					'grid grid-cols-1 md:grid-cols-12 gap-4 auto-rows-[12rem]',
					'grid-flow-row-dense',
					'mt-15'
				)}>
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
