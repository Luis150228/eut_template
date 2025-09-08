import { EVT_HIDDEN_CHANGED } from './keys';

export function emitHiddenChanged() {
	if (typeof window === 'undefined') return;
	window.dispatchEvent(new Event(EVT_HIDDEN_CHANGED));
}

export function onHiddenChanged(cb) {
	if (typeof window === 'undefined') return () => {};
	window.addEventListener(EVT_HIDDEN_CHANGED, cb);
	return () => window.removeEventListener(EVT_HIDDEN_CHANGED, cb);
}
