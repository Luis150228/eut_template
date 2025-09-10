'use client';
import React from 'react';
import ExcelJS from 'exceljs';
import { IconDownload, IconLoader2 } from '@tabler/icons-react';
import { cn } from '@/lib/utils';

/* -------- utils -------- */
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

/* -------- componente -------- */
export default function XlsxExporter({
	data,
	fileName = 'export.xlsx',
	columns, // opcional: [{ key, header?, width?, wrap?, isDate? }, ...]
	highlightRule = (row) => String(row.made_sla).toLowerCase() === 'verdadero',
	className,
}) {
	const [busy, setBusy] = React.useState(false);

	const rowsInput = React.useMemo(() => {
		if (!data) return [];
		return Array.isArray(data) ? data : [data];
	}, [data]);

	const colDefs = React.useMemo(() => {
		if (columns?.length) return columns;
		const keys = unionKeysPreserveOrder(rowsInput);
		return keys.map((k) => {
			const wrap = ['description', 'comments_and_work_notes', 'short_description'].includes(k);
			const hasDate = rowsInput.some((r) => isDateLike(r?.[k]));
			return { key: k, header: k, wrap, isDate: hasDate };
		});
	}, [columns, rowsInput]);

	async function handleDownload() {
		if (!rowsInput.length) return;
		setBusy(true);
		try {
			const wb = new ExcelJS.Workbook();
			wb.created = new Date();
			wb.modified = new Date();
			const ws = wb.addWorksheet('Datos', { views: [{ state: 'frozen', ySplit: 1 }] });

			ws.columns = colDefs.map((c) => ({ header: c.header ?? c.key, key: c.key }));

			const brand = 'FFC51617'; // ARGB
			const header = ws.getRow(1);
			header.font = { bold: true, color: { argb: 'FFFFFFFF' } };
			header.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
			header.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: brand } };
			header.height = 24;

			const prepared = rowsInput.map((item) => {
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

			colDefs.forEach((c, idx) => {
				const col = ws.getColumn(idx + 1);
				if (c.isDate) col.numFmt = 'yyyy-mm-dd hh:mm:ss';
				if (c.wrap) col.alignment = { ...col.alignment, wrapText: true, vertical: 'top' };
			});

			const okFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE6F4EA' } };
			const zebra = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8F8F8' } };
			for (let r = 2; r <= ws.rowCount; r++) {
				const row = ws.getRow(r);
				if (r % 2 === 0) row.eachCell((cell) => (cell.fill = zebra));
				const obj = prepared[r - 2];
				if (obj && highlightRule(obj)) row.eachCell((cell) => (cell.fill = okFill));
				row.alignment = { vertical: 'top' };
			}

			ws.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: colDefs.length } };
			ws.eachRow((row) => {
				row.eachCell((cell) => {
					cell.border = cell.border || {};
					cell.border.right = { style: 'hair', color: { argb: 'FFDDDDDD' } };
				});
			});

			const widths = autosizeWidths(prepared, colDefs);
			colDefs.forEach((c, i) => (ws.getColumn(i + 1).width = c.width ?? widths[i]));

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
		} finally {
			setBusy(false);
		}
	}

	return (
		<button
			type='button'
			onClick={handleDownload}
			disabled={busy || !rowsInput.length}
			aria-busy={busy ? 'true' : 'false'}
			aria-disabled={busy ? 'true' : 'false'}
			className={cn(
				'inline-flex items-center gap-2 rounded-md border border-[var(--border)]',
				'bg-[var(--card)] px-3 py-1.5 text-sm shadow-sm hover:bg-black/5 dark:hover:bg-white/10',
				busy && 'opacity-60 pointer-events-none',
				className
			)}
			title='Descargar XLSX'>
			{busy ? (
				<>
					<IconLoader2 className='h-4 w-4 animate-spin' />
					Generando…
				</>
			) : (
				<>
					<IconDownload className='h-4 w-4' />
					Descargar XLSX
				</>
			)}
		</button>
	);
}
