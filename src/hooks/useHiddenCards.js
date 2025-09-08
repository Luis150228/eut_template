import { useEffect, useState } from 'react';
import { KEY_HIDDEN } from '@/lib/eut/keys';
import { loadHiddenSet, saveHiddenSet } from '@/lib/eut/storage';
import { onHiddenChanged } from '@/lib/eut/events';

export default function useHiddenCards() {
	const [ids, setIds] = useState(() => [...loadHiddenSet()]);

	// escuchar cambios locales y entre pestañas
	useEffect(() => {
		const off = onHiddenChanged(() => setIds([...loadHiddenSet()]));
		const onStorage = (e) => {
			if (e.key === KEY_HIDDEN) setIds([...loadHiddenSet()]);
		};
		window.addEventListener('storage', onStorage);
		return () => {
			off?.();
			window.removeEventListener('storage', onStorage);
		};
	}, []);

	const hideOne = (id) => {
		const s = loadHiddenSet();
		s.add(id);
		saveHiddenSet(s);
		setIds([...s]);
	};
	const restoreOne = (id) => {
		const s = loadHiddenSet();
		s.delete(id);
		saveHiddenSet(s);
		setIds([...s]);
	};
	const clearAll = () => {
		saveHiddenSet([]);
		setIds([]);
	};

	return { hiddenIds: ids, hideOne, restoreOne, clearAll };
}
