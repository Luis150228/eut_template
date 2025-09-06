'use client';
import * as React from 'react';
// 👇 importante: usa framer-motion
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

function GradientText({
	text,
	className,
	size = 'text-5xl md:text-7xl', // <— tamaño por defecto
	gradient = 'linear-gradient(90deg, #2e2e2eff 0%, #f7d9d9ff 20%, #f7d9d9ff 50%, #fa3b3bff 80%, #fa3b3bff 100%)',
	neon = false,
	transition = { duration: 50, repeat: Infinity, ease: 'linear' },
	...props
}) {
	const baseStyle = { backgroundImage: gradient };

	return (
		<span
			data-slot='gradient-text'
			className={cn('relative inline-block', size, className)}
			{...props}>
			<motion.span
				className='m-0 text-transparent bg-clip-text bg-[length:700%_100%] bg-[position:0%_0%]'
				style={baseStyle}
				initial={{ backgroundPosition: '0% 0%' }}
				animate={{ backgroundPosition: '500% 100%' }}
				transition={transition}>
				{text}
			</motion.span>

			{neon && (
				<motion.span
					className='m-0 absolute inset-0 text-transparent bg-clip-text blur-[8px] mix-blend-plus-lighter bg-[length:700%_100%] bg-[position:0%_0%]'
					style={baseStyle}
					initial={{ backgroundPosition: '0% 0%' }}
					animate={{ backgroundPosition: '500% 100%' }}
					transition={transition}>
					{text}
				</motion.span>
			)}
		</span>
	);
}

export { GradientText };
