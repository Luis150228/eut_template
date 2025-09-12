'use client';
import React, { useMemo, useRef, useState } from 'react';
import { IconUpload, IconFileSpreadsheet, IconEye, IconDownload, IconTrash } from '@tabler/icons-react';
import { cn } from '@/lib/utils';
import { parseAndCleanCsv } from '@/utils/csvCleaners';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalTrigger, ModalClose } from '@/components/ui/animated-modal';

export default function CsvCleaner({
	className,
	accept = '.csv,text/csv',
	dateColumns = [
		'fecha',
		'created_at',
		'updated_at',
		'fecha_hora',
		'opened_at',
		'sys_updated_on',
		'sys_created_on',
		'resuelto',
	],
	escapeForSql = false,
	onResult, // (rows) => void
}) {
	const inputRef = useRef(null);
	const [drag, setDrag] = useState(false);
	const [fileName, setFileName] = useState('');
	const [progress, setProgress] = useState(0);
	const [rows, setRows] = useState(null);
	const [error, setError] = useState('');

	const [view, setView] = useState('table'); // 'table' | 'json'

	const columns = useMemo(() => {
		if (!rows || !rows.length) return [];
		const set = new Set();
		rows.forEach((r) => Object.keys(r).forEach((k) => set.add(k)));
		return Array.from(set);
	}, [rows]);

	const handleFiles = async (files) => {
		const f = files?.[0];
		if (!f) return;
		setError('');
		setRows(null);
		setProgress(0);
		setFileName(f.name);

		try {
			const { rows: parsed } = await parseAndCleanCsv(f, {
				dateColumns,
				escapeForSql,
				onProgress: setProgress,
			});
			setRows(parsed);
			onResult?.(parsed);
		} catch (err) {
			console.error(err);
			setError('No se pudo procesar el archivo.');
		}
	};

	const onDrop = (e) => {
		e.preventDefault();
		setDrag(false);
		handleFiles(e.dataTransfer.files);
	};

	const downloadJson = () => {
		if (!rows) return;
		const blob = new Blob([JSON.stringify(rows, null, 2)], { type: 'application/json;charset=utf-8' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = (fileName?.replace(/\.[^.]+$/, '') || 'data') + '.json';
		a.click();
		URL.revokeObjectURL(url);
	};

	return (
		<div className={cn('w-full', className)}>
			{/* Área de carga */}
			<div
				className={cn(
					'relative w-full rounded-xl border-2 border-dashed p-6',
					'border-[var(--border)] bg-[var(--card)] text-[var(--foreground)]',
					drag && 'border-[var(--brand-red)] bg-[var(--brand-red)]/5'
				)}
				onDragEnter={(e) => {
					e.preventDefault();
					setDrag(true);
				}}
				onDragOver={(e) => {
					e.preventDefault();
					setDrag(true);
				}}
				onDragLeave={() => setDrag(false)}
				onDrop={onDrop}>
				<input
					ref={inputRef}
					type='file'
					accept={accept}
					className='hidden'
					onChange={(e) => handleFiles(e.target.files)}
				/>

				<div className='flex flex-col items-center justify-center text-center'>
					<IconFileSpreadsheet className='h-10 w-10 opacity-80' />
					<p className='mt-2 text-sm opacity-80'>
						Arrastra un <b>.csv</b> aquí o
					</p>
					<button
						type='button'
						onClick={() => inputRef.current?.click()}
						className='mt-3 inline-flex items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--card)]/90 px-3 py-1.5 text-sm shadow-sm backdrop-blur transition hover:bg-black/5 dark:hover:bg-white/10'>
						<IconUpload className='h-4 w-4' />
						Seleccionar archivo
					</button>

					{/* Estado de archivo / progreso */}
					{fileName && (
						<div className='mt-3 text-xs text-[var(--muted-foreground)]'>
							{fileName} {progress > 0 && progress < 100 ? `· ${progress}%` : ''}
						</div>
					)}
					{error && <div className='mt-2 text-xs text-red-500'>{error}</div>}
				</div>
			</div>

			{/* Acciones tras procesar */}
			{rows && (
				<div className='mt-4 flex flex-wrap items-center gap-2'>
					<Modal>
						<ModalTrigger className='inline-flex items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-sm hover:bg-black/5 dark:hover:bg-white/10'>
							<IconEye className='h-4 w-4' />
							Ver datos limpios
						</ModalTrigger>

						<ModalBody containerClassName='h-[85vh] w-[90vw] max-h-[85vh] max-w-[90vw]'>
							<ModalContent className='flex gap-3 p-4'>
								{/* Top bar modal */}
								<div className='mb-2 flex items-center justify-between gap-2'>
									<div className='text-sm opacity-80'>
										Filas: <b>{rows.length.toLocaleString()}</b> · Columnas: <b>{columns.length}</b>
									</div>
									<div className='flex items-center gap-2'>
										<button
											type='button'
											onClick={() => setView(view === 'table' ? 'json' : 'table')}
											className='rounded-md border border-[var(--border)] px-2 py-1 text-xs hover:bg-black/5 dark:hover:bg-white/10'>
											{view === 'table' ? 'Ver JSON' : 'Ver Tabla'}
										</button>
										<ModalClose className='rounded-md border border-[var(--border)] px-2 py-1 text-xs hover:bg-black/5 dark:hover:bg-white/10'>
											Cerrar
										</ModalClose>
									</div>
								</div>

								{/* Vista */}
								{view === 'table' ? (
									<div className='h-full w-full overflow-auto rounded-lg border border-[var(--border)]'>
										<table className='min-w-full text-left text-sm'>
											<thead className='sticky top-0 bg-[var(--card)]'>
												<tr>
													{columns.map((c) => (
														<th
															key={c}
															className='border-b border-[var(--border)] px-3 py-2 font-medium'>
															{c}
														</th>
													))}
												</tr>
											</thead>
											<tbody>
												{rows.map((r, i) => (
													<tr
														key={i}
														className='odd:bg-black/[0.015] dark:odd:bg-white/[0.03]'>
														{columns.map((c) => (
															<td
																key={c}
																className='whitespace-pre-wrap px-3 py-2 align-top'>
																{formatCell(r[c])}
															</td>
														))}
													</tr>
												))}
											</tbody>
										</table>
									</div>
								) : (
									<pre className='h-full w-full overflow-auto rounded-lg border border-[var(--border)] bg-[var(--card)] p-3 text-xs'>
										{JSON.stringify(rows, null, 2)}
									</pre>
								)}
							</ModalContent>

							<ModalFooter className='justify-between'>
								<button
									type='button'
									onClick={() => {
										setRows(null);
										setFileName('');
									}}
									className='inline-flex items-center gap-2 rounded-md border border-[var(--border)] px-3 py-1.5 text-sm hover:bg-black/5 dark:hover:bg-white/10'
									title='Limpiar resultado'>
									<IconTrash className='h-4 w-4' /> Limpiar
								</button>

								<div className='flex items-center gap-2'>
									<button
										type='button'
										onClick={downloadJson}
										className='inline-flex items-center gap-2 rounded-md border border-[var(--border)] px-3 py-1.5 text-sm hover:bg-black/5 dark:hover:bg:white/10'>
										<IconDownload className='h-4 w-4' />
										Descargar JSON
									</button>
									<ModalClose className='rounded-md border border-[var(--border)] px-3 py-1.5 text-sm hover:bg-black/5 dark:hover:bg-white/10'>
										Cerrar
									</ModalClose>
								</div>
							</ModalFooter>
						</ModalBody>
					</Modal>
				</div>
			)}
		</div>
	);
}

function formatCell(v) {
	if (v == null) return '';
	if (typeof v === 'object') return JSON.stringify(v);
	return String(v);
}
