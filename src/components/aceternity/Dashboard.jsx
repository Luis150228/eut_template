import { BentoGridEUT } from './BentoGrid';

const Dashboard = () => {
	return (
		// ocupa el espacio junto al sidebar; su hijo scrollea
		<section className='flex flex-1 min-h-0'>
			<div className='flex flex-1 min-h-0 w-full flex-col rounded-tl-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-900'>
				{/* SCROLL + padding lateral moderado */}
				<div className='flex-1 min-h-0 overflow-y-auto p-3 md:px-6 md:py-4'>
					<BentoGridEUT />
				</div>
			</div>
		</section>
	);
};
export default Dashboard;
