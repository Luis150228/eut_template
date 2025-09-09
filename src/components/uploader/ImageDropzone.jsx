'use client';
import React, { useCallback, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { IconUpload, IconPhoto, IconX, IconCheck } from '@tabler/icons-react';
import { cn } from '@/lib/utils';

export default function ImageDropzone({
	className,
	accept = 'image/*',
	maxSizeMB = 5,
	initial = null, // base64 inicial (opcional)
	onChange, // (base64, File) => void
	imageFit = 'contain', // 'contain' (default) | 'cover'
	fill = false, // true => ocupa el alto del padre
	heightClass = 'h-[12rem]', // alto por defecto cuando fill = false
}) {
	const inputRef = useRef(null);
	const [drag, setDrag] = useState(false);
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const [progress, setProgress] = useState(0);
	const [preview, setPreview] = useState(initial);

	const reset = () => {
		setError('');
		setLoading(false);
		setProgress(0);
	};

	const handleFiles = useCallback(
		(files) => {
			const file = files?.[0];
			if (!file) return;

			reset();
			if (!file.type.startsWith('image/')) {
				setError('El archivo debe ser una imagen.');
				return;
			}
			const max = maxSizeMB * 1024 * 1024;
			if (file.size > max) {
				setError(`Máx ${maxSizeMB}MB.`);
				return;
			}

			setLoading(true);
			const reader = new FileReader();
			reader.onprogress = (e) => {
				if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100));
			};
			reader.onerror = () => {
				setError('No se pudo leer el archivo.');
				setLoading(false);
			};
			reader.onload = (e) => {
				const b64 = e.target.result;
				setPreview(b64);
				setLoading(false);
				setProgress(100);
				onChange?.(b64, file);
			};
			reader.readAsDataURL(file);
		},
		[maxSizeMB, onChange]
	);

	const onDrop = (e) => {
		e.preventDefault();
		setDrag(false);
		handleFiles(e.dataTransfer.files);
	};

	// 👇 altura efectiva del contenedor
	const height = fill ? 'h-full' : heightClass;

	return (
		<div
			className={cn(
				'relative w-full rounded-xl border-2 border-dashed',
				'border-[var(--border)] bg-[var(--card)] text-[var(--foreground)]',
				height, // altura real (no min-height)
				drag && 'border-[var(--brand-red)] bg-[var(--brand-red)]/5',
				className
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
			{/* input oculto */}
			<input
				ref={inputRef}
				type='file'
				accept={accept}
				className='hidden'
				onChange={(e) => handleFiles(e.target.files)}
			/>

			{/* Área de preview con altura garantizada */}
			<div className='relative h-full w-full overflow-hidden rounded-xl'>
				{preview ? (
					<motion.img
						key='preview'
						src={preview}
						alt='preview'
						className={cn(
							'absolute inset-0 h-full w-full',
							imageFit === 'cover' ? 'object-cover' : 'object-contain',
							'select-none'
						)}
						initial={{ opacity: 0.4, scale: imageFit === 'cover' ? 1.02 : 1 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.35 }}
						draggable={false}
					/>
				) : (
					<div className='pointer-events-none flex h-full w-full flex-col items-center justify-center p-8 text-center'>
						<IconPhoto className='h-10 w-10 opacity-70' />
						<p className='mt-2 text-sm opacity-70'>Arrastra una imagen o</p>
						<p className='text-sm font-medium'>haz clic para seleccionar</p>
					</div>
				)}

				{/* Controles inferiores */}
				<div className='absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 p-2'>
					<button
						type='button'
						onClick={() => inputRef.current?.click()}
						className='inline-flex items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--card)]/90 px-3 py-1.5 text-sm shadow-sm backdrop-blur transition hover:bg-black/5 dark:hover:bg-white/10'>
						<IconUpload className='h-4 w-4' />
						{preview ? 'Cambiar imagen' : 'Subir imagen'}
					</button>

					{preview && (
						<button
							type='button'
							onClick={() => {
								setPreview(null);
								onChange?.(null, null);
							}}
							className='inline-flex items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--card)]/90 px-3 py-1.5 text-sm shadow-sm backdrop-blur transition hover:bg-black/5 dark:hover:bg-white/10'>
							<IconX className='h-4 w-4' /> Quitar
						</button>
					)}
				</div>

				{/* Loader */}
				{loading && (
					<div className='absolute inset-0 grid place-items-center bg-black/30 backdrop-blur-sm'>
						<div className='flex flex-col items-center'>
							<div className='relative h-12 w-12'>
								<span className='absolute inset-0 animate-spin rounded-full border-2 border-white/30 border-l-[var(--brand-red)]' />
								<span className='absolute inset-0 grid place-items-center text-xs font-semibold text-white'>
									{progress ? `${progress}%` : ''}
								</span>
							</div>
							<span className='mt-2 text-xs text-white/90'>Procesando…</span>
						</div>
					</div>
				)}
			</div>

			{/* Estado / errores */}
			<div className='flex items-center justify-between px-3 py-2 text-xs'>
				{error ? (
					<span className='text-red-500'>{error}</span>
				) : preview ? (
					<span className='inline-flex items-center gap-1 text-[var(--muted-foreground)]'>
						<IconCheck className='h-4 w-4 text-emerald-500' /> Listo
					</span>
				) : (
					<span className='text-[var(--muted-foreground)]'>PNG, JPG, WEBP · Máx {maxSizeMB}MB</span>
				)}
			</div>
		</div>
	);
}
