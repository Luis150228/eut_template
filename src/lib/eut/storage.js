import { KEY_SPANS, KEY_HIDDEN, KEY_THEME } from './keys';
import { emitHiddenChanged } from './events';

function readJSON(key, fallback) {
	try {
		const raw = localStorage.getItem(key);
		return raw ? JSON.parse(raw) : fallback;
	} catch {
		return fallback;
	}
}
function writeJSON(key, value) {
	try {
		localStorage.setItem(key, JSON.stringify(value));
	} catch {}
}

/* ——— spans ——— */
export function loadSpanMap() {
	return readJSON(KEY_SPANS, {});
}
export function saveSpan(id, span) {
	if (!id) return;
	const map = loadSpanMap();
	map[id] = span;
	writeJSON(KEY_SPANS, map);
}

/* ——— hidden ——— */
export function loadHiddenSet() {
	const arr = readJSON(KEY_HIDDEN, []);
	return new Set(Array.isArray(arr) ? arr : []);
}
export function saveHiddenSet(setOrArr) {
	const arr = Array.isArray(setOrArr) ? setOrArr : [...setOrArr];
	writeJSON(KEY_HIDDEN, arr);
	emitHiddenChanged();
}

/* ——— theme (por si lo quieres aquí) ——— */
export function loadTheme() {
	return readJSON(KEY_THEME, null);
}
export function saveTheme(theme) {
	if (!theme) return;
	try {
		localStorage.setItem(KEY_THEME, theme);
	} catch {}
}
