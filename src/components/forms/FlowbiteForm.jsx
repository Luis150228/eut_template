import * as React from 'react';

export default function FlowbiteForm({ onSubmit }) {
	const [categoryOpen, setCategoryOpen] = React.useState(false);
	const [category, setCategory] = React.useState('All categories'); // Dropdown input
	const [protocol, setProtocol] = React.useState('https://'); // Input group (prefijo para website)

	const [values, setValues] = React.useState({
		first_name: '',
		last_name: '',
		company: '',
		phone: '',
		website: '',
		visitors: '',
		email: '',
		username: '', // input group con @
		password: '',
		confirm_password: '',
		remember: false,
	});

	const [errors, setErrors] = React.useState({});

	const inputCls = (invalid) =>
		[
			'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg',
			'focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5',
			'dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white',
			'dark:focus:ring-blue-500 dark:focus:border-blue-500',
			invalid &&
				'border-red-500 focus:ring-red-500 focus:border-red-500 dark:border-red-500 dark:focus:ring-red-500 dark:focus:border-red-500',
		]
			.filter(Boolean)
			.join(' ');

	const helpCls = 'mt-1 text-sm text-red-600 dark:text-red-500';

	const set = (k, v) => setValues((s) => ({ ...s, [k]: v }));

	const validate = () => {
		const e = {};
		// Requireds
		['first_name', 'last_name', 'company', 'email', 'password', 'confirm_password'].forEach((k) => {
			if (!values[k]?.trim()) e[k] = 'Requerido';
		});
		if (!values.remember) e.remember = 'Debes aceptar los términos';

		// Phone (NNN-NN-NNN)
		if (values.phone && !/^\d{3}-\d{2}-\d{3}$/.test(values.phone)) {
			e.phone = 'Formato esperado: 123-45-678';
		}

		// Email rudimentario
		if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
			e.email = 'Email inválido';
		}

		// Website (usar protocol + website para validar URL)
		const fullURL = `${protocol}${values.website || ''}`;
		try {
			// URL nativa
			// eslint-disable-next-line no-new
			new URL(fullURL);
		} catch {
			if (values.website) e.website = 'URL inválida';
		}

		// Visitors > 0 si viene
		if (String(values.visitors).trim()) {
			const n = Number(values.visitors);
			if (!Number.isFinite(n) || n <= 0) e.visitors = 'Debe ser un número positivo';
		}

		// Passwords
		if (values.password && values.confirm_password && values.password !== values.confirm_password) {
			e.confirm_password = 'No coincide con la contraseña';
		}

		setErrors(e);
		return e;
	};

	const handleSubmit = (ev) => {
		ev.preventDefault();
		const e = validate();
		if (Object.keys(e).length) return;
		const payload = {
			...values,
			category,
			website: `${protocol}${values.website || ''}`,
		};
		if (onSubmit) onSubmit(payload);
		// Para demo:
		console.log('Form OK →', payload);
	};

	return (
		<div className='h-full min-h-0 overflow-auto'>
			<form
				onSubmit={handleSubmit}
				noValidate>
				{/* GRID superior */}
				<div className='grid gap-6 mb-6 md:grid-cols-2'>
					<div>
						<label
							htmlFor='first_name'
							className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
							First name
						</label>
						<input
							type='text'
							id='first_name'
							className={inputCls(!!errors.first_name)}
							placeholder='John'
							value={values.first_name}
							onChange={(e) => set('first_name', e.target.value)}
							required
							aria-invalid={!!errors.first_name}
						/>
						{errors.first_name && <p className={helpCls}>{errors.first_name}</p>}
					</div>

					<div>
						<label
							htmlFor='last_name'
							className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
							Last name
						</label>
						<input
							type='text'
							id='last_name'
							className={inputCls(!!errors.last_name)}
							placeholder='Doe'
							value={values.last_name}
							onChange={(e) => set('last_name', e.target.value)}
							required
							aria-invalid={!!errors.last_name}
						/>
						{errors.last_name && <p className={helpCls}>{errors.last_name}</p>}
					</div>

					<div>
						<label
							htmlFor='company'
							className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
							Company
						</label>
						<input
							type='text'
							id='company'
							className={inputCls(!!errors.company)}
							placeholder='Flowbite'
							value={values.company}
							onChange={(e) => set('company', e.target.value)}
							required
							aria-invalid={!!errors.company}
						/>
						{errors.company && <p className={helpCls}>{errors.company}</p>}
					</div>

					<div>
						<label
							htmlFor='phone'
							className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
							Phone number
						</label>
						<input
							type='tel'
							id='phone'
							className={inputCls(!!errors.phone)}
							placeholder='123-45-678'
							pattern='[0-9]{3}-[0-9]{2}-[0-9]{3}'
							value={values.phone}
							onChange={(e) => set('phone', e.target.value)}
							aria-invalid={!!errors.phone}
						/>
						{errors.phone && <p className={helpCls}>{errors.phone}</p>}
					</div>

					{/* Input group: username con @ */}
					<div>
						<label
							htmlFor='username'
							className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
							Username
						</label>
						<div className='flex'>
							<span className='inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-e-0 border-gray-300 rounded-s-lg dark:bg-gray-600 dark:text-gray-300 dark:border-gray-600'>
								@
							</span>
							<input
								type='text'
								id='username'
								className={['rounded-none rounded-e-lg', inputCls(!!errors.username)].join(' ')}
								placeholder='johndoe'
								value={values.username}
								onChange={(e) => set('username', e.target.value)}
							/>
						</div>
						{errors.username && <p className={helpCls}>{errors.username}</p>}
					</div>

					{/* Dropdown input + search (estilo Flowbite input con dropdown a la izquierda) */}
					<div>
						<label className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>Search with category</label>
						<div className='relative'>
							<button
								type='button'
								onClick={() => setCategoryOpen((s) => !s)}
								className='flex-shrink-0 z-10 inline-flex items-center p-2.5 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-s-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600 dark:focus:ring-blue-800'>
								{category}
								<svg
									className='w-2.5 h-2.5 ms-2'
									aria-hidden='true'
									xmlns='http://www.w3.org/2000/svg'
									fill='none'
									viewBox='0 0 10 6'>
									<path
										stroke='currentColor'
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth='2'
										d='M9 1 5 5 1 1'
									/>
								</svg>
							</button>
							<div className='relative w-full'>
								<input
									type='search'
									className={[
										'block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-e-lg border-s-0 border border-gray-300',
										'focus:ring-blue-500 focus:border-blue-500',
										'dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white',
										'dark:focus:ring-blue-500 dark:focus:border-blue-500',
									].join(' ')}
									placeholder='Buscar…'
								/>
								<button
									type='button'
									className='absolute top-0 end-0 p-2.5 text-sm font-medium h-full text-white bg-blue-700 rounded-e-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'>
									<svg
										className='w-4 h-4'
										aria-hidden='true'
										xmlns='http://www.w3.org/2000/svg'
										fill='none'
										viewBox='0 0 20 20'>
										<path
											stroke='currentColor'
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth='2'
											d='m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z'
										/>
									</svg>
									<span className='sr-only'>Search</span>
								</button>
							</div>

							{/* menú dropdown */}
							{categoryOpen && (
								<div
									className='absolute z-20 mt-2 w-44 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700'
									role='menu'>
									{['All categories', 'Tech', 'Finance', 'HR', 'Marketing'].map((c) => (
										<button
											type='button'
											key={c}
											onClick={() => {
												setCategory(c);
												setCategoryOpen(false);
											}}
											className='block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 text-left'
											role='menuitem'>
											{c}
										</button>
									))}
								</div>
							)}
						</div>
					</div>

					{/* Website URL (Input group con dropdown de protocolo) */}
					<div className='md:col-span-2'>
						<label
							htmlFor='website'
							className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
							Website URL
						</label>
						<div className='flex'>
							<button
								type='button'
								onClick={() => setProtocol((p) => (p === 'https://' ? 'http://' : 'https://'))}
								className='inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-e-0 border-gray-300 rounded-s-lg dark:bg-gray-600 dark:text-gray-300 dark:border-gray-600'
								title='Cambiar protocolo'>
								{protocol}
							</button>
							<input
								type='text'
								id='website'
								className={['rounded-none rounded-e-lg', inputCls(!!errors.website)].join(' ')}
								placeholder='mi-sitio.com'
								value={values.website}
								onChange={(e) => set('website', e.target.value)}
								aria-invalid={!!errors.website}
							/>
						</div>
						{errors.website && <p className={helpCls}>{errors.website}</p>}
					</div>

					<div>
						<label
							htmlFor='visitors'
							className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
							Unique visitors (per month)
						</label>
						<input
							type='number'
							id='visitors'
							className={inputCls(!!errors.visitors)}
							placeholder=''
							value={values.visitors}
							onChange={(e) => set('visitors', e.target.value)}
							aria-invalid={!!errors.visitors}
						/>
						{errors.visitors && <p className={helpCls}>{errors.visitors}</p>}
					</div>
				</div>

				{/* email */}
				<div className='mb-6'>
					<label
						htmlFor='email'
						className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
						Email address
					</label>
					<input
						type='email'
						id='email'
						className={inputCls(!!errors.email)}
						placeholder='john.doe@company.com'
						value={values.email}
						onChange={(e) => set('email', e.target.value)}
						required
						aria-invalid={!!errors.email}
					/>
					{errors.email && <p className={helpCls}>{errors.email}</p>}
				</div>

				{/* passwords */}
				<div className='mb-6'>
					<label
						htmlFor='password'
						className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
						Password
					</label>
					<input
						type='password'
						id='password'
						className={inputCls(!!errors.password)}
						placeholder='•••••••••'
						value={values.password}
						onChange={(e) => set('password', e.target.value)}
						required
						aria-invalid={!!errors.password}
					/>
					{errors.password && <p className={helpCls}>{errors.password}</p>}
				</div>

				<div className='mb-6'>
					<label
						htmlFor='confirm_password'
						className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
						Confirm password
					</label>
					<input
						type='password'
						id='confirm_password'
						className={inputCls(!!errors.confirm_password)}
						placeholder='•••••••••'
						value={values.confirm_password}
						onChange={(e) => set('confirm_password', e.target.value)}
						required
						aria-invalid={!!errors.confirm_password}
					/>
					{errors.confirm_password && <p className={helpCls}>{errors.confirm_password}</p>}
				</div>

				{/* Términos */}
				<div className='flex items-start mb-6'>
					<div className='flex items-center h-5'>
						<input
							id='remember'
							type='checkbox'
							checked={values.remember}
							onChange={(e) => set('remember', e.target.checked)}
							className='w-4 h-4 border border-gray-300 rounded-sm bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800'
							aria-invalid={!!errors.remember}
							required
						/>
					</div>
					<label
						htmlFor='remember'
						className='ms-2 text-sm font-medium text-gray-900 dark:text-gray-300'>
						I agree with the{' '}
						<a
							href='#'
							className='text-blue-600 hover:underline dark:text-blue-500'>
							terms and conditions
						</a>
						.
					</label>
				</div>
				{errors.remember && <p className={helpCls}>{errors.remember}</p>}

				<button
					type='submit'
					className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'>
					Submit
				</button>
			</form>
		</div>
	);
}
