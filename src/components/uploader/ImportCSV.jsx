// ImportIncidents.jsx
import { useState } from 'react';
import CsvCleaner from '@/components/uploader/CsvCleaner';
import FlamaSantanderLoader from '../images/FlamaSantanderLoader';

export default function ImportCSV({ fileName = 'csv.csv', icon = 'Logo' }) {
	const [isImporting, setIsImporting] = useState(false);

	async function persistIncidents(rows) {
		// TODO: reemplaza por tu POST real a la API
		// await fetch('/api/incidents/import', { method:'POST', body: JSON.stringify(rows) });
		await new Promise((r) => setTimeout(r, 1200)); // simulación
	}

	return (
		<div className='relative max-w-screen-lg'>
			<h2 className='mb-3 text-lg font-semibold'>Importar {fileName}</h2>
			<CsvCleaner
				dateColumns={['fecha', 'fecha_hora', 'created_at']} // ajusta a tus headers reales
				onResult={async (data) => {
					try {
						setIsImporting(true);
						console.log(data);
						console.log('Filas limpias:', data.length);
						await persistIncidents(data);
					} catch (err) {
						console.error('Falló la importación', err);
					} finally {
						setIsImporting(false);
					}
				}}
			/>

			{isImporting && (
				<div
					className='fixed inset-0 z-50 flex flex-col items-center justify-center
                bg-[rgb(var(--card-rgb,17 18 19)/0.7)] backdrop-blur-md p-6'
					aria-live='polite'
					aria-busy='true'
					role='alert'>
					<FlamaSantanderLoader
						size={160}
						strokeWidth={5}
						duration={2.2}
						strokeColor='var(--sidebar-ring)'
					/>
					<p className='mt-4 text-sm text-[var(--muted-foreground,#c7c7c7)]'>Importando incidentes…</p>
				</div>
			)}
		</div>
	);
}
