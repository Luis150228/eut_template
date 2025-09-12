'use client';
import React from 'react';
import ExcelJS from 'exceljs';
import { IconDownload, IconLoader2 } from '@tabler/icons-react';
import { cn } from '@/lib/utils';
import FlamaSantanderLoader from '../images/FlamaSantanderLoader';

/* ====== utils (sin cambios) ====== */
function parseMysqlLikeDate(s) {
	if (!s || typeof s !== 'string') return null;
	const m = /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2}):(\d{2})$/.exec(s);
	if (!m) return null;
	const [, y, mo, d, h, mi, se] = m.map(Number);
	return new Date(y, mo - 1, d, h, mi, se);
}
function isDateLike(value) {
	if (value instanceof Date) return true;
	if (typeof value !== 'string') return false;
	return /^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}:\d{2}$/.test(value);
}
function unionKeysPreserveOrder(rows) {
	const seen = new Set();
	const order = [];
	if (rows[0])
		Object.keys(rows[0]).forEach((k) => {
			seen.add(k);
			order.push(k);
		});
	for (let i = 1; i < rows.length; i++) {
		Object.keys(rows[i]).forEach((k) => {
			if (!seen.has(k)) {
				seen.add(k);
				order.push(k);
			}
		});
	}
	return order;
}
function autosizeWidths(rows, colDefs) {
	const maxLen = (v) => String(v ?? '').length;
	const widths = colDefs.map((c) => Math.max(maxLen(c.header ?? c.key), 6));
	for (const r of rows) {
		colDefs.forEach((c, i) => {
			const v = r[c.key];
			const len = Array.isArray(v) || (v && typeof v === 'object') ? JSON.stringify(v).length : maxLen(v);
			widths[i] = Math.min(Math.max(widths[i], len + 2), 60);
		});
	}
	return widths;
}
function normalizeRows(data) {
	if (!data) return [];
	return Array.isArray(data) ? data : [data];
}
function inferColumns(rows) {
	const keys = unionKeysPreserveOrder(rows);
	return keys.map((k) => {
		const wrap = ['description', 'comments_and_work_notes', 'short_description'].includes(k);
		const hasDate = rows.some((r) => isDateLike(r?.[k]));
		return { key: k, header: k, wrap, isDate: hasDate };
	});
}
function safeSheetName(name, existing = new Set()) {
	const forbidden = /[\[\]\*\/\\\?\:]/g;
	let base =
		String(name || 'Hoja')
			.replace(forbidden, ' ')
			.slice(0, 31)
			.trim() || 'Hoja';
	let finalName = base,
		n = 2;
	while (existing.has(finalName)) {
		const suffix = ` (${n++})`;
		finalName = base.slice(0, 31 - suffix.length) + suffix;
	}
	existing.add(finalName);
	return finalName;
}

/* ====== render helpers (sin cambios) ====== */
function addSheet(wb, { name, data, columns, highlightRule }) {
	const rows = normalizeRows(data);
	const colDefs = columns?.length ? columns : inferColumns(rows);

	const ws = wb.addWorksheet(name, { views: [{ state: 'frozen', ySplit: 1 }] });
	ws.columns = colDefs.map((c) => ({ header: c.header ?? c.key, key: c.key }));

	// Header styles
	const brand = 'FFC51617';
	const header = ws.getRow(1);
	header.font = { bold: true, color: { argb: 'FFFFFFFF' } };
	header.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
	header.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: brand } };
	header.height = 24;

	// Rows with date parsing
	const prepared = rows.map((item) => {
		const out = {};
		colDefs.forEach((c) => {
			let v = item?.[c.key];
			if (c.isDate && typeof v === 'string') {
				const d = parseMysqlLikeDate(v);
				if (d) v = d;
			}
			out[c.key] = v;
		});
		return out;
	});
	ws.addRows(prepared);

	// Column formats
	colDefs.forEach((c, idx) => {
		const col = ws.getColumn(idx + 1);
		if (c.isDate) col.numFmt = 'yyyy-mm-dd hh:mm:ss';
		if (c.wrap) col.alignment = { ...col.alignment, wrapText: true, vertical: 'top' };
	});

	// Zebra + highlight
	const okFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE6F4EA' } };
	const zebra = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8F8F8' } };
	for (let r = 2; r <= ws.rowCount; r++) {
		const row = ws.getRow(r);
		if (r % 2 === 0) row.eachCell((cell) => (cell.fill = zebra));
		if (typeof highlightRule === 'function') {
			const obj = prepared[r - 2];
			if (obj && highlightRule(obj)) row.eachCell((cell) => (cell.fill = okFill));
		}
		row.alignment = { vertical: 'top' };
	}

	// AutoFilter
	if (colDefs.length) {
		ws.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: colDefs.length } };
	}

	// Hair borders
	ws.eachRow((row) => {
		row.eachCell((cell) => {
			cell.border = cell.border || {};
			cell.border.right = { style: 'hair', color: { argb: 'FFDDDDDD' } };
		});
	});

	// Widths
	const widths = autosizeWidths(prepared, colDefs);
	colDefs.forEach((c, i) => (ws.getColumn(i + 1).width = c.width ?? widths[i]));
}

/* ====== componente ====== */
const XlsxExporter = React.forwardRef(function XlsxExporter(
	{
		// modo 1 hoja:
		data,
		columns,
		highlightRule = (row) => String(row.made_sla).toLowerCase() === 'verdadero',

		// modo multi-hoja:
		sheets, // [{ name, data, columns?, highlightRule? }, ...]

		fileName = 'incidentes.xlsx',
		className,
		// callbacks opcionales
		onStart,
		onDone,
	},
	ref
) {
	const [busy, setBusy] = React.useState(false);

	const hasMulti = Array.isArray(sheets) && sheets.length > 0;
	const hasSingle = !hasMulti && normalizeRows(data).length > 0;
	const disabled = !hasMulti && !hasSingle;

	// Exponer método export() si algún padre quiere controlarlo por ref
	React.useImperativeHandle(
		ref,
		() => ({
			export: async () => {
				// permite que quien llame espere la finalización
				await handleDownload();
			},
		}),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[]
	);

	async function handleDownload() {
		if (disabled) return;
		onStart?.();
		setBusy(true);
		try {
			const wb = new ExcelJS.Workbook();
			wb.created = new Date();
			wb.modified = new Date();

			if (hasMulti) {
				const used = new Set();
				for (const s of sheets) {
					const safeName = safeSheetName(s?.name || 'Hoja', used);
					addSheet(wb, {
						name: safeName,
						data: s?.data,
						columns: s?.columns,
						highlightRule: s?.highlightRule,
					});
				}
			} else {
				// single
				addSheet(wb, {
					name: 'Datos',
					data,
					columns,
					highlightRule,
				});
			}

			const buf = await wb.xlsx.writeBuffer();
			const blob = new Blob([buf], {
				type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
			});
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = fileName;
			a.click();
			URL.revokeObjectURL(url);
		} catch (err) {
			// re-lanzar o loggear según prefieras
			console.error('XlsxExporter error:', err);
			throw err;
		} finally {
			setBusy(false);
			onDone?.();
		}
	}

	return (
		<>
			<button
				type='button'
				onClick={handleDownload}
				disabled={busy || disabled}
				aria-busy={busy ? 'true' : 'false'}
				aria-disabled={busy ? 'true' : 'false'}
				className={cn(
					'inline-flex items-center gap-2 rounded-md border border-[var(--border)]',
					'bg-[var(--card)] px-3 py-1.5 text-sm shadow-sm hover:bg-black/5 dark:hover:bg-white/10',
					busy && 'opacity-60 pointer-events-none',
					className
				)}
				title={hasMulti ? 'Descargar XLSX (múltiples hojas)' : 'Descargar XLSX'}>
				{busy ? (
					<>
						<IconLoader2 className='h-4 w-4 animate-spin' />
						Generando…
					</>
				) : (
					<>
						<IconDownload className='h-4 w-4' />
						{hasMulti ? 'Descargar XLSX (multi)' : 'Descargar XLSX'}
					</>
				)}
			</button>

			{busy && (
				<div
					className='fixed inset-0 z-50 flex flex-col items-center justify-center
					bg-[rgb(var(--card-rgb,17 18 19)/0.7)] backdrop-blur-md p-6'
					role='alert'
					aria-live='polite'
					aria-busy='true'>
					<FlamaSantanderLoader
						size={160}
						strokeWidth={5}
						duration={2.2}
						strokeColor='var(--sidebar-ring)'
					/>
					<p className='mt-4 text-sm text-[var(--muted-foreground,#c7c7c7)]'>Generando archivo…</p>
				</div>
			)}
		</>
	);
});

export default XlsxExporter;
