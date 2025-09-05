import { createContext, useContext } from 'react';

export const SidebarContext = createContext({
	open: false, // estado “fijo” (si lo controlas por props)
	setOpen: () => {},
	animate: true,
	peekOpen: false, // estado “temporal” por hover en desktop
	setPeekOpen: () => {},
});

export const useSidebar = () => {
	const ctx = useContext(SidebarContext);
	if (!ctx) throw new Error('useSidebar must be used within a SidebarProvider');
	return ctx;
};
