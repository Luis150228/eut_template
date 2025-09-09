'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalTrigger, ModalClose, useModal } from '../ui/animated-modal';

export function AnimatedModalDemo() {
	const images = [
		'https://images.unsplash.com/photo-1517322048670-4fba75cbbb62?q=80&w=800&auto=format&fit=crop',
		'https://images.unsplash.com/photo-1573790387438-4da905039392?q=80&w=800&auto=format&fit=crop',
		'https://images.unsplash.com/photo-1555400038-63f5ba517a47?q=80&w=800&auto=format&fit=crop',
		'https://images.unsplash.com/photo-1554931670-4ebfabf6e7a9?q=80&w=800&auto=format&fit=crop',
		'https://images.unsplash.com/photo-1546484475-7f7bd55792da?q=80&w=800&auto=format&fit=crop',
	];

	return (
		<div className='flex items-center justify-center py-10'>
			<Modal>
				<ModalTrigger className='group/modal-btn relative flex items-center justify-center bg-black px-4 py-2 text-white dark:bg-white dark:text-black'>
					<span className='transition duration-500 group-hover/modal-btn:translate-x-40'>Abrir modal</span>
					<div className='absolute inset-0 z-20 -translate-x-40 flex items-center justify-center text-white transition duration-500 group-hover/modal-btn:translate-x-0 dark:text-black'>
						✨
					</div>
				</ModalTrigger>

				<ModalBody>
					<ModalContent>
						{/* Botón “X” arriba a la derecha */}
						<ModalClose
							className='absolute right-3 top-3 rounded-md border border-[var(--border)] bg-[var(--card)] px-2 py-1 text-xs hover:bg-black/5 dark:hover:bg-white/10'
							aria-label='Cerrar'>
							✕
						</ModalClose>

						<h4 className='mb-6 text-center text-lg font-bold text-neutral-700 dark:text-neutral-100 md:text-2xl'>
							Demo de{' '}
							<span className='rounded-md border border-gray-200 bg-gray-100 px-1 py-0.5 dark:border-neutral-700 dark:bg-neutral-800'>
								Animated Modal
							</span>
						</h4>

						<div className='flex items-center justify-center'>
							{images.map((src, i) => (
								<motion.div
									key={i}
									style={{ rotate: Math.random() * 20 - 10 }}
									whileHover={{ scale: 1.1, rotate: 0, zIndex: 10 }}
									whileTap={{ scale: 1.1, rotate: 0, zIndex: 10 }}
									className='mt-2 -mr-4 shrink-0 overflow-hidden rounded-xl border border-neutral-100 bg-white p-1 dark:border-neutral-700 dark:bg-neutral-800'>
									<img
										src={src}
										alt=''
										width='320'
										height='320'
										className='h-20 w-20 rounded-lg object-cover md:h-40 md:w-40'
									/>
								</motion.div>
							))}
						</div>
					</ModalContent>

					<ModalFooter className='gap-3'>
						{/* Cerrar con componente listo */}
						<ModalClose className='w-28 rounded-md border border-gray-300 bg-gray-200 px-3 py-1 text-sm text-black dark:border-black dark:bg-black dark:text-white'>
							Cancelar
						</ModalClose>

						{/* Cerrar usando el hook (dentro del Modal) */}
						<ConfirmButton />
					</ModalFooter>
				</ModalBody>
			</Modal>
		</div>
	);
}

/** Este subcomponente se renderiza DENTRO del <Modal>, por eso sí puede usar useModal(). */
function ConfirmButton() {
	const { setOpen } = useModal();
	return (
		<button
			onClick={() => setOpen(false)}
			className='w-28 rounded-md border border-black bg-black px-3 py-1 text-sm text-white dark:bg-white dark:text-black'>
			Confirmar
		</button>
	);
}
