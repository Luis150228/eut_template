import { BentoGridDemo } from './BentoGrid';

const Dashboard = () => {
	return (
		// ocupa el espacio disponible junto al sidebar y permite que su hijo scrollee
		<section className='flex flex-1 min-h-0'>
			<div className='flex flex-1 min-h-0 w-full flex-col rounded-tl-2xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900'>
				{/* Aquí vive el SCROLL */}
				<div className='flex-1 min-h-0 overflow-y-auto p-2 md:p-10'>
					<BentoGridDemo />
				</div>
			</div>
		</section>
	);
};

export default Dashboard;
