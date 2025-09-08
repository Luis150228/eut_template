import { useState } from 'react';
import { loadSpanMap, saveSpan } from '@/lib/eut/storage';

export const SPAN_ORDER = ['quarter', 'third', 'half', 'tall', 'half-tall', 'full', 'full-tall'];

export function nextSpan(cur) {
	const i = SPAN_ORDER.indexOf(cur);
	return i === -1 ? SPAN_ORDER[0] : SPAN_ORDER[(i + 1) % SPAN_ORDER.length];
}

export default function useCardSpans() {
	const [map, setMap] = useState(() => loadSpanMap());

	const setSpan = (id, span) => {
		saveSpan(id, span);
		setMap((m) => ({ ...m, [id]: span }));
	};

	const getSpan = (id, fallback) => map[id] ?? fallback;

	return { getSpan, setSpan, nextSpan };
}
