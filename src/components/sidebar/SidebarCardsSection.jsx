import React from 'react';
import { IconEye, IconEyeOff } from '@tabler/icons-react';
import { cn } from '@/lib/utils';
import useHiddenCards from '@/hooks/useHiddenCards';
import { getBaseItems } from '../aceternity/BentoGrid'; // reutiliza tu catálogo actual

export default function SidebarCardsSection() {
	const { hiddenIds, restoreOne } = useHiddenCards();
	const [open, setOpen] = React.useState(false);

	// mapa id -> título
	const catalog = React.useMemo(() => {
		const m = new Map();
		getBaseItems().forEach((it) => m.set(it['data-id'], it.title));
		return m;
	}, []);

	return (
		<div className='w-full'>
			<button
				type='button'
				onClick={() => setOpen((v) => !v)}
				aria-expanded={open}
				className={cn(
					'w-full rounded-lg px-3 py-2',
					'flex items-center justify-between gap-2',
					'text-[var(--foreground)] hover:bg-black/[0.06] dark:hover:bg-white/[0.06]',
					'border border-transparent hover:border-[var(--border)] transition'
				)}>
				<span className='inline-flex items-center gap-2'>
					<IconEyeOff className='h-5 w-5 shrink-0' />
					<span className='text-sm'>Cards</span>
				</span>
				<span className='rounded-md border border-[var(--border)] px-1.5 py-0.5 text-[10px] text-[var(--muted-foreground)]'>
					{hiddenIds.length}
				</span>
			</button>

			{open &&
				(hiddenIds.length === 0 ? (
					<div className='mt-1 pl-10 pr-2 text-xs text-[var(--muted-foreground)]'>No hay tarjetas ocultas.</div>
				) : (
					<ul className='mt-1 space-y-1 pl-8 pr-2'>
						{hiddenIds.map((id) => (
							<li key={id}>
								<button
									type='button'
									onClick={() => restoreOne(id)}
									className={cn(
										'w-full rounded-lg px-3 py-2 text-left',
										'flex items-center gap-2',
										'text-[var(--foreground)] hover:bg-black/[0.06] dark:hover:bg-white/[0.06]',
										'border border-transparent hover:border-[var(--border)] transition'
									)}
									title='Hacer visible'>
									<IconEye className='h-4 w-4 opacity-80' />
									<span className='truncate text-sm'>{catalog.get(id) || id}</span>
								</button>
							</li>
						))}
					</ul>
				))}
		</div>
	);
}
