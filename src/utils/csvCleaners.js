import Papa from 'papaparse';

// ---------- helpers ----------
export function cleanString(v, { stripAccents = false } = {}) {
	if (v == null) return v;
	let s = String(v);

	// BOM/zero-width y controles
	s = s.replace(/\uFEFF|\u200B/g, '');
	s = s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '');

	// comillas “inteligentes” → ASCII
	s = s.replace(/[\u2018\u2019\u201A\u2032]/g, "'").replace(/[\u201C\u201D\u201E\u2033]/g, '"');

	if (stripAccents) {
		// quita diacríticos: áéíóúñ → aeioun (ñ se conserva como ñ si no quitamos marca)
		s = s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
	}

	// colapsa espacios
	s = s.replace(/\s+/g, ' ').trim();
	return s;
}

export function normalizeHeader(h) {
	// para llaves conviene quitar acentos para evitar claves raras
	return cleanString(h, { stripAccents: true }).replace(/\s+/g, '_').replace(/[^\w]/g, '').toLowerCase();
}

// dd-mm-aaaa [hh:mm:ss] -> aaaa-mm-dd hh:mm:ss
export function normalizeDateToMysql(v) {
	if (v == null) return v;
	const s = cleanString(v);
	const m = /^(\d{2})[\/-](\d{2})[\/-](\d{4})(?:[ T](\d{2}):(\d{2}):(\d{2}))?$/.exec(s);
	if (!m) return s;
	const [, dd, mm, yyyy, HH = '00', MM = '00', SS = '00'] = m;
	const D = +dd,
		M = +mm;
	if (D < 1 || D > 31 || M < 1 || M > 12) return s;
	return `${yyyy}-${mm}-${dd} ${HH}:${MM}:${SS}`;
}

export function sqlEscape(str) {
	if (str == null) return str;
	return String(str).replace(/'/g, "''");
}

// ---------- decoders ----------
async function decodeBlobWithEncoding(blob, encoding = 'utf-8') {
	const ab = await blob.arrayBuffer();
	// TextDecoder soporta 'utf-8', 'windows-1252', 'iso-8859-1', 'latin1'
	const dec = new TextDecoder(encoding);
	return dec.decode(ab);
}

function looksBrokenUtf8(str) {
	// si hay muchos '�' (U+FFFD) consideramos que la decodificación fue incorrecta
	const bad = (str.match(/\uFFFD/g) || []).length;
	return bad > Math.max(3, str.length * 0.0005);
}

async function autoDecode(blob) {
	let s = await decodeBlobWithEncoding(blob, 'utf-8');
	if (!looksBrokenUtf8(s)) return s;
	// intenta windows-1252
	s = await decodeBlobWithEncoding(blob, 'windows-1252');
	return s;
}

// ---------- parse principal ----------
/**
 * @param {File|Blob|string} input
 * @param {Object} opts
 * @param {'auto'|'utf-8'|'windows-1252'|'iso-8859-1'} [opts.encoding='auto']
 * @param {'keep'|'strip'} [opts.accentMode='keep']
 * @param {string[]} [opts.dateColumns]
 * @param {boolean} [opts.escapeForSql=false]
 * @param {(p:number)=>void} [opts.onProgress]
 * @param {(row:any)=>any} [opts.transformRow]
 * @param {boolean} [opts.useWorker=true]
 * @returns {Promise<{rows:any[], meta:any}>}
 */
export async function parseAndCleanCsv(
	input,
	{
		encoding = 'auto',
		accentMode = 'keep',
		dateColumns = ['fecha', 'created_at', 'updated_at', 'fecha_hora'],
		escapeForSql = false,
		onProgress,
		transformRow,
		useWorker = true,
	} = {}
) {
	// 1) Si es Blob/File, decodifica a string con la codificación indicada
	let source = input;
	if (typeof File !== 'undefined' && input instanceof Blob) {
		if (encoding === 'auto') source = await autoDecode(input);
		else source = await decodeBlobWithEncoding(input, encoding);
	}

	// 2) Normaliza la lista de columnas de fecha para comparación
	const dateColsNorm = new Set(dateColumns.map((c) => normalizeHeader(c)));

	return new Promise((resolve, reject) => {
		const rows = [];
		let headerMap = null; // Map<originalHeader, normalizedHeader>

		Papa.parse(source, {
			header: true,
			dynamicTyping: false,
			skipEmptyLines: 'greedy',
			worker: !!useWorker, // ✅ worker activo

			// importante: NO usamos transformHeader (rompe con worker)
			step: (results) => {
				const meta = results.meta || {};
				const row = results.data || {};

				// crea el mapa de headers la primera vez
				if (!headerMap) {
					headerMap = new Map();
					(meta.fields || Object.keys(row) || []).forEach((orig) => {
						headerMap.set(orig, normalizeHeader(orig));
					});
				}

				const stripAccents = accentMode === 'strip';
				const out = {};

				for (const origKey in row) {
					const key = headerMap.get(origKey) || normalizeHeader(origKey);
					let v = row[origKey];

					if (typeof v === 'string') v = cleanString(v, { stripAccents });

					if (dateColsNorm.has(key)) v = normalizeDateToMysql(v);

					if (typeof v === 'string') {
						if (/^null$/i.test(v)) v = null;
						else v = v.replace(/\s{2,}/g, ' ');
					}

					if (escapeForSql && typeof v === 'string') v = sqlEscape(v);

					out[key] = v;
				}

				const finalRow = transformRow ? transformRow(out) : out;
				rows.push(finalRow);
				if (onProgress) onProgress((onProgress.__i = ((onProgress.__i || 0) + 1) % 100));
			},

			complete: (meta) => {
				if (onProgress) onProgress(100);
				resolve({ rows, meta });
			},
			error: reject,
		});
	});
}
