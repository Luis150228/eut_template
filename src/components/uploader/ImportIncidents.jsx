import CsvCleaner from '@/components/uploader/CsvCleaner';

export default function ImportIncidents() {
	return (
		<div className='max-w-screen-lg'>
			<h2 className='mb-3 text-lg font-semibold'>Importar incidents.csv</h2>
			<CsvCleaner
				dateColumns={['fecha', 'fecha_hora', 'created_at']} // ajusta a tus headers reales
				onResult={(data) => {
					// aquí puedes persistir, mandar a API, etc.
					console.log(data);
					console.log('Filas limpias:', data.length);
				}}
			/>
		</div>
	);
}
