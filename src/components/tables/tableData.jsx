import * as React from 'react';
import { cn } from '@/lib/utils';
import {
	IconChevronsLeft,
	IconChevronLeft,
	IconChevronRight,
	IconChevronsRight,
	IconChevronUp,
	IconChevronDown,
	IconSearch,
	IconArrowsSort, // ← compatible con tu versión
} from '@tabler/icons-react';

/**
 * DataTable.jsx
 * - fill: si true, ocupa 100% alto del contenedor (ideal para cards)
 * - sticky header dentro del área scroll
 * - responsive (tabla md+, cards en mobile)
 */
export default function DataTable({
	columns = [],
	data = [],
	defaultPageSize = 10,
	pageSizeOptions = [5, 10, 25, 50],
	defaultSort = null,
	searchableKeys,
	rowKey = 'id',
	striped = true,
	dense = false,
	stickyHeader = true,
	loading = false,
	renderRowActions,
	onSelectionChange,
	className = '',
	fill = false, // 👈 NUEVO
	maxHeight = '28rem', // si no usas fill, esto controla el alto
}) {
	const [page, setPage] = React.useState(1);
	const [pageSize, setPageSize] = React.useState(defaultPageSize);
	const [search, setSearch] = React.useState('');
	const [sort, setSort] = React.useState(defaultSort); // {key, dir}
	const [selected, setSelected] = React.useState(() => new Set());

	const allKeys = React.useMemo(
		() => (searchableKeys?.length ? searchableKeys : columns.map((c) => c.key).filter(Boolean)),
		[columns, searchableKeys]
	);

	const keyOf = (row, idx) => {
		if (typeof rowKey === 'function') return rowKey(row, idx);
		if (rowKey && row && row[rowKey] != null) return String(row[rowKey]);
		return String(idx);
	};

	// Filtro
	const filtered = React.useMemo(() => {
		const q = search.trim().toLowerCase();
		if (!q) return data;
		return data.filter((row) => allKeys.some((k) => String(get(row, k, '')).toLowerCase().includes(q)));
	}, [data, search, allKeys]);

	// Orden
	const sorted = React.useMemo(() => {
		if (!sort?.key) return filtered;
		const col = columns.find((c) => c.key === sort.key);
		const dir = sort.dir === 'desc' ? -1 : 1;
		return [...filtered].sort((a, b) => {
			const av = normalize(get(a, col?.key, ''));
			const bv = normalize(get(b, col?.key, ''));
			if (av < bv) return -1 * dir;
			if (av > bv) return 1 * dir;
			return 0;
		});
	}, [filtered, sort, columns]);

	// Página
	const total = sorted.length;
	const totalPages = Math.max(1, Math.ceil(total / pageSize));
	const safePage = Math.min(page, totalPages);
	const start = (safePage - 1) * pageSize;
	const pageRows = sorted.slice(start, start + pageSize);

	React.useEffect(() => setPage(1), [search, pageSize, sort?.key, sort?.dir]);

	// Selección
	const toggleRow = (id) =>
		setSelected((prev) => {
			const next = new Set(prev);
			next.has(id) ? next.delete(id) : next.add(id);
			return next;
		});
	const toggleAllPage = () => {
		const ids = pageRows.map((r, i) => keyOf(r, start + i));
		const allSel = ids.every((id) => selected.has(id));
		setSelected((prev) => {
			const next = new Set(prev);
			ids.forEach((id) => (allSel ? next.delete(id) : next.add(id)));
			return next;
		});
	};
	React.useEffect(() => {
		if (!onSelectionChange) return;
		const map = new Map(data.map((r, i) => [keyOf(r, i), r]));
		const selectedRows = [...selected].map((id) => map.get(id)).filter(Boolean);
		onSelectionChange(selectedRows);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selected]);

	const onSort = (key, sortable = true) => {
		if (!sortable) return;
		setSort((prev) => {
			if (!prev || prev.key !== key) return { key, dir: 'asc' };
			if (prev.dir === 'asc') return { key, dir: 'desc' };
			return null;
		});
	};

	// clases tema
	const headCls = 'text-[var(--muted-foreground)] font-semibold text-sm';
	const cellCls = 'text-[var(--foreground)] text-sm';

	// ——— LAYOUT que NO se desborda ———
	return (
		<div className={cn('w-full h-full', className)}>
			<div
				className={cn(
					'flex h-full flex-col rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm',
					'overflow-hidden' // 👈 recorta sticky/scroll dentro del card
				)}>
				{/* Toolbar */}
				<div className='p-3 border-b border-[var(--border)] flex flex-col gap-2 md:flex-row md:items-center md:justify-between'>
					<div className='relative w-full md:max-w-sm'>
						<IconSearch className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]' />
						<input
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							placeholder='Buscar…'
							className={cn(
								'w-full rounded-xl border border-[var(--border)] bg-[var(--card)]',
								'pl-9 pr-3 py-2 outline-none',
								'text-[var(--foreground)] placeholder-[var(--muted-foreground)]'
							)}
						/>
					</div>
					<div className='flex items-center gap-2'>
						<span className='text-xs text-[var(--muted-foreground)]'>Filas por página</span>
						<select
							value={pageSize}
							onChange={(e) => setPageSize(Number(e.target.value))}
							className={cn(
								'rounded-lg border border-[var(--border)] bg-[var(--card)] px-2 py-1 text-[var(--foreground)]'
							)}>
							{pageSizeOptions.map((n) => (
								<option
									key={n}
									value={n}>
									{n}
								</option>
							))}
						</select>
					</div>
				</div>

				{/* Área scroll (solo el cuerpo) */}
				<div
					className='flex-1 overflow-auto'
					style={fill ? undefined : { maxHeight }}>
					{/* Tabla md+ */}
					<table className='hidden md:table w-full border-collapse'>
						<thead className={cn(stickyHeader && 'sticky top-0 z-10')}>
							<tr className='bg-[color:var(--card)]/95 backdrop-blur supports-[backdrop-filter]:bg-[color:var(--card)]/75'>
								<th className='w-10 px-3 py-3 text-left'>
									<input
										type='checkbox'
										aria-label='Seleccionar página'
										onChange={toggleAllPage}
										checked={pageRows.length > 0 && pageRows.every((r, i) => selected.has(keyOf(r, start + i)))}
										className='h-4 w-4 accent-[var(--foreground)]'
									/>
								</th>
								{columns.map((col) => {
									const isSorted = sort?.key === col.key;
									const sortable = col.sortable !== false;
									return (
										<th
											key={col.key}
											style={{ width: col.width }}
											className={cn(
												'px-3 py-3 text-left select-none',
												headCls,
												col.align === 'right' && 'text-right',
												col.align === 'center' && 'text-center'
											)}
											onClick={() => onSort(col.key, sortable)}>
											<div className={cn('inline-flex items-center gap-1', sortable && 'cursor-pointer')}>
												<span>{col.header}</span>
												{sortable &&
													(isSorted ? (
														sort.dir === 'asc' ? (
															<IconChevronUp className='h-4 w-4' />
														) : (
															<IconChevronDown className='h-4 w-4' />
														)
													) : (
														<IconArrowsSort className='h-4 w-4 opacity-60' />
													))}
											</div>
										</th>
									);
								})}
								{renderRowActions && <th className={cn('px-3 py-3 text-right', headCls)}>Acciones</th>}
							</tr>
						</thead>

						<tbody>
							{loading ? (
								<tr>
									<td
										colSpan={columns.length + 2}
										className='px-3 py-6 text-center text-[var(--muted-foreground)]'>
										Cargando…
									</td>
								</tr>
							) : pageRows.length === 0 ? (
								<tr>
									<td
										colSpan={columns.length + 2}
										className='px-3 py-10 text-center text-[var(--muted-foreground)]'>
										Sin resultados
									</td>
								</tr>
							) : (
								pageRows.map((row, i) => {
									const rid = keyOf(row, start + i);
									const zebra = striped && i % 2 === 1;
									return (
										<tr
											key={rid}
											className={cn(
												'transition-colors',
												zebra ? 'bg-black/[0.02] dark:bg-white/[0.03]' : '',
												'hover:bg-black/[0.04] dark:hover:bg-white/[0.06]'
											)}>
											<td className='w-10 px-3 py-2'>
												<input
													type='checkbox'
													checked={selected.has(rid)}
													onChange={() => toggleRow(rid)}
													className='h-4 w-4 accent-[var(--foreground)]'
												/>
											</td>
											{columns.map((col) => (
												<td
													key={col.key}
													className={cn(
														'px-3 py-2 align-middle',
														cellCls,
														dense && 'py-1.5',
														col.align === 'right' && 'text-right',
														col.align === 'center' && 'text-center'
													)}>
													{col.render ? col.render(row) : String(get(row, col.key, ''))}
												</td>
											))}
											{renderRowActions && (
												<td className={cn('px-3 py-2 text-right', cellCls)}>{renderRowActions(row)}</td>
											)}
										</tr>
									);
								})
							)}
						</tbody>
					</table>

					{/* Cards (mobile) */}
					<div className='md:hidden p-2 space-y-3'>
						{loading ? (
							<div className='text-center text-[var(--muted-foreground)] py-6'>Cargando…</div>
						) : pageRows.length === 0 ? (
							<div className='text-center text-[var(--muted-foreground)] py-10'>Sin resultados</div>
						) : (
							pageRows.map((row, i) => {
								const rid = keyOf(row, start + i);
								return (
									<div
										key={rid}
										className={cn('rounded-xl border border-[var(--border)] bg-[var(--card)] p-3')}>
										<div className='flex items-start justify-between gap-3'>
											<label className='inline-flex items-center gap-2'>
												<input
													type='checkbox'
													checked={selected.has(rid)}
													onChange={() => toggleRow(rid)}
													className='h-4 w-4 accent-[var(--foreground)]'
												/>
												<span className='text-sm font-medium text-[var(--foreground)]'>
													{columns[0]?.render ? columns[0].render(row) : String(get(row, columns[0]?.key, 'Fila'))}
												</span>
											</label>
											{renderRowActions && <div>{renderRowActions(row)}</div>}
										</div>
										<div className='mt-2 grid grid-cols-2 gap-2 text-xs'>
											{columns.slice(1).map((col) => (
												<div
													key={col.key}
													className='rounded-md border border-[var(--border)] p-2'>
													<div className='text-[var(--muted-foreground)]'>{col.header}</div>
													<div className='text-[var(--foreground)]'>
														{col.render ? col.render(row) : String(get(row, col.key, ''))}
													</div>
												</div>
											))}
										</div>
									</div>
								);
							})
						)}
					</div>
				</div>

				{/* Footer fijo dentro del card */}
				<div className='p-3 border-t border-[var(--border)] flex items-center justify-between'>
					<div className='text-xs text-[var(--muted-foreground)]'>
						Página <span className='font-medium text-[var(--foreground)]'>{safePage}</span> de{' '}
						{Math.max(1, Math.ceil(total / pageSize))} — {total} registros
					</div>
					<div className='flex items-center gap-1'>
						<button
							className={btnPagerCls()}
							onClick={() => setPage(1)}
							disabled={safePage === 1}
							aria-label='Primera'>
							{' '}
							<IconChevronsLeft className='h-4 w-4' />{' '}
						</button>
						<button
							className={btnPagerCls()}
							onClick={() => setPage((p) => Math.max(1, p - 1))}
							disabled={safePage === 1}
							aria-label='Anterior'>
							{' '}
							<IconChevronLeft className='h-4 w-4' />{' '}
						</button>
						<button
							className={btnPagerCls()}
							onClick={() => setPage((p) => Math.min(Math.ceil(total / pageSize), p + 1))}
							disabled={safePage === Math.ceil(total / pageSize)}
							aria-label='Siguiente'>
							{' '}
							<IconChevronRight className='h-4 w-4' />{' '}
						</button>
						<button
							className={btnPagerCls()}
							onClick={() => setPage(Math.ceil(total / pageSize))}
							disabled={safePage === Math.ceil(total / pageSize)}
							aria-label='Última'>
							{' '}
							<IconChevronsRight className='h-4 w-4' />{' '}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

/* helpers */
function btnPagerCls() {
	return cn(
		'inline-flex items-center justify-center rounded-lg',
		'border border-[var(--border)] bg-[var(--card)]',
		'h-8 w-8 text-[var(--foreground)] disabled:opacity-50 disabled:cursor-not-allowed',
		'hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition'
	);
}
function get(obj, path, fallback) {
	if (!obj || !path) return fallback;
	const parts = String(path).split('.');
	let cur = obj;
	for (const p of parts) {
		if (cur && Object.prototype.hasOwnProperty.call(cur, p)) cur = cur[p];
		else return fallback;
	}
	return cur ?? fallback;
}
function normalize(v) {
	const n = Number(v);
	if (!Number.isNaN(n)) return n;
	return String(v).toLowerCase();
}
