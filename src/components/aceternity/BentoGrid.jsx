import React from 'react';
import { BentoGrid, BentoGridItem } from '../ui/bento-grid';
import {
	IconArrowWaveRightUp,
	IconBoxAlignRightFilled,
	IconBoxAlignTopLeft,
	IconClipboardCopy,
	IconFileBroken,
	IconSignature,
	IconTableColumn,
} from '@tabler/icons-react';

export function BentoGridDemo() {
	return (
		<BentoGrid className='max-w-4xl mx-auto'>
			{items.map((item, i) => (
				<BentoGridItem
					key={i}
					title={item.title}
					description={item.description}
					header={item.header}
					icon={item.icon}
					className={`enter ${i === 3 || i === 6 ? 'md:col-span-2' : ''}`}
					style={{ animationDelay: `${i * 120}ms` }}
				/>
			))}
		</BentoGrid>
	);
}

const Skeleton = () => (
	<div className='flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100'></div>
);

// Reusa la variable de marca definida en :root  ->  --brand-red
const ICON = (Comp) => <Comp className='h-4 w-4 text-[var(--brand-red)]' />;

const items = [
	{
		title: 'Stock de Almacen',
		description: 'Stock de equipos Asignados a mi almacen.',
		header: <Skeleton />,
		icon: ICON(IconClipboardCopy),
	},
	{
		title: 'The Digital Revolution',
		description: 'Dive into the transformative power of technology.',
		header: <Skeleton />,
		icon: ICON(IconFileBroken),
	},
	{
		title: 'The Art of Design',
		description: 'Discover the beauty of thoughtful and functional design.',
		header: <Skeleton />,
		icon: ICON(IconSignature),
	},
	{
		title: 'The Power of Communication',
		description: 'Understand the impact of effective communication in our lives.',
		header: <Skeleton />,
		icon: ICON(IconTableColumn),
	},
	{
		title: 'The Pursuit of Knowledge',
		description: 'Join the quest for understanding and enlightenment.',
		header: <Skeleton />,
		icon: ICON(IconArrowWaveRightUp),
	},
	{
		title: 'The Joy of Creation',
		description: 'Experience the thrill of bringing ideas to life.',
		header: <Skeleton />,
		icon: ICON(IconBoxAlignTopLeft),
	},
	{
		title: 'The Spirit of Adventure',
		description: 'Embark on exciting journeys and thrilling discoveries.',
		header: <Skeleton />,
		icon: ICON(IconBoxAlignRightFilled),
	},
];
