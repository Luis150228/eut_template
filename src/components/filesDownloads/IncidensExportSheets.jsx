import incidents from '@/data/incidents.json';
import XlsxExporter from './XlsxExporter';

const cerrados = incidents.filter((i) => i.state === 'Cerrado');
const nuevos = incidents.filter((i) => i.state === 'Nuevo');
const otros = incidents.filter((i) => i.state !== 'Cerrado' && i.state !== 'Nuevo');

export default function ExportBySheets() {
	return (
		<XlsxExporter
			fileName='incidentes.xlsx'
			sheets={[
				{ name: 'Cerrados', data: cerrados },
				{ name: 'Nuevos', data: nuevos },
				{ name: 'Otros', data: otros, highlightRule: (row) => row.state === 'Cerrado' }, // regla propia por hoja
			]}
		/>
	);
}
