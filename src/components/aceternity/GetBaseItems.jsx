import EUTCallsFollowUpChart from '../charts/EUTCallsFollowUpChart';
import EUTLineChart from '../charts/EUTLineChart';
import IncidentesExport from '../filesDownloads/IncidentesExport';
import FlowbiteForm from '../forms/FlowbiteForm';
import { AnimatedModalDemo } from '../modals/AnimatedModalDemo';
import { ModalEditUser } from '../modals/modalEditUser';
import TablaDraw from '../tables/tableDrawing';
import ImageDropzone from '../uploader/ImageDropzone';
import ImportIncidents from '../uploader/ImportIncidents';

/* — catálogo actual (con headers) — */
export function GetBaseItems() {
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
			header: (
				<EUTCallsFollowUpChart
					rows={datasetCalls}
					className='h-full'
				/>
			),
			icon: ICON(IconActivity),
			span: 'half-tall',
			'data-id': 'realtime-dynamic',
		},
		{
			title: 'Modal Animado',
			header: <AnimatedModalDemo />,
			icon: ICON(IconTableColumn),
			span: 'third',
			'data-id': 'modal-animado',
		},
		{
			title: 'Editar Usuario',
			header: <ModalEditUser />,
			icon: ICON(IconArrowWaveRightUp),
			span: 'third',
			'data-id': 'editar-usuario',
		},
		{
			title: 'Add Imagen',
			header: <ImageDropzone />,
			icon: ICON(IconBoxAlignTopLeft),
			span: 'third',
			'data-id': 'add-imagen',
		},
		{
			title: 'CSV to JSON',
			header: <ImportIncidents />,
			icon: ICON(IconBoxAlignRightFilled),
			span: 'third',
			'data-id': 'csv-to-json',
		},
		{
			title: 'JSON to XLSX',
			header: <IncidentesExport />,
			icon: ICON(IconBoxAlignRightFilled),
			span: 'third',
			'data-id': 'json-to-xlsx',
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
