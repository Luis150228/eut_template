import DataTable from './tableData';

const columns = [
	{ key: 'folio', header: 'Folio', sortable: true, width: '10rem' },
	{ key: 'abierto', header: 'Abierto', sortable: true },
	{ key: 'estatus', header: 'Estatus', sortable: true },
	{ key: 'asig_a', header: 'Asignado', sortable: true },
];

const rows = [
	{ id: 'INC1001', folio: 'INC1001', abierto: '2025-09-07', estatus: 'Abierto', asig_a: 'Juan' },
	{ id: 'INC1002', folio: 'INC1002', abierto: '2025-09-06', estatus: 'Cerrado', asig_a: 'Ana' },
	{ id: 'INC1003', folio: 'INC1002', abierto: '2025-09-06', estatus: 'Cerrado', asig_a: 'Luis' },
	{ id: 'INC1004', folio: 'INC1004', abierto: '2025-09-06', estatus: 'Cerrado', asig_a: 'Natalie' },
	{ id: 'INC1005', folio: 'INC1005', abierto: '2025-09-06', estatus: 'Cerrado', asig_a: 'Jazz' },
	{ id: 'INC1006', folio: 'INC1006', abierto: '2025-09-06', estatus: 'Cerrado', asig_a: 'Derek' },
];

export default function TablaDraw({
	fill = true, // por defecto ocupa 100% del alto disponible del card
	maxHeight = '32rem', // si pones fill={false}, esto limita la altura y activa overflow
	pageSize = 10,
	dense = false,
	striped = true,
}) {
	return (
		<div className='h-full min-h-0 overflow-hidden'>
			<DataTable
				columns={columns}
				data={rows}
				fill={fill}
				{...(!fill ? { maxHeight } : {})}
				defaultPageSize={pageSize}
				dense={dense}
				striped={striped}
				renderRowActions={(row) => (
					<button className='rounded-md border border-[var(--border)] px-2 py-1 text-xs'>Ver</button>
				)}
			/>
		</div>
	);
}
