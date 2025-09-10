import XlsxExporter from './XlsxExporter';

import incidents from '@/data/incidents.json';

export default function DemoExport() {
	// (opcional) define columnas con headers bonitos y anchos
	const columns = [
		{ key: 'number', header: 'Folio', width: 18 },
		{ key: 'state', header: 'Estatus', width: 14 },
		{ key: 'company', header: 'Compañía', width: 22 },
		{ key: 'location', header: 'Ubicación', width: 28 },
		{ key: 'sys_created_on', header: 'Creado', isDate: true, width: 20 },
		{ key: 'closed_at', header: 'Cerrado', isDate: true, width: 20 },
		{ key: 'assigned_to', header: 'Asignado a', width: 24 },
		{ key: 'short_description', header: 'Resumen', width: 30 },
		{ key: 'description', header: 'Descripción', width: 60 },
		{ key: 'comments_and_work_notes', header: 'Notas', width: 60 },
		{ key: 'made_sla', header: 'SLA Cumplido', width: 15 },
	];

	return (
		<XlsxExporter
			data={incidents}
			columns={columns}
			fileName='incidentes.xlsx'
			// opcional: cambia la regla de resaltado
			// highlightRule={(row) => row.state === 'Cerrado'}
		/>
	);
}
