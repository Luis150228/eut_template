import React from 'react';

/**
 * <IconOrLink Icon={IconSignature} href="..." className="..." />
 */
export function IconOrLink({ Icon, href, className = 'h-4 w-4 text-[var(--brand-red)]', ...props }) {
	const anchorClass = 'inline-flex items-center ' + className;

	// si te pasan un elemento ya creado en Icon (ej: <Icon />) lo respetamos
	if (React.isValidElement(Icon)) {
		const el = React.cloneElement(Icon, {
			className: [Icon.props.className, className].filter(Boolean).join(' '),
		});
		return href ? (
			<a
				className={anchorClass}
				href={href}
				target='_blank'
				rel='noopener noreferrer'
				{...props}>
				{el}
			</a>
		) : (
			el
		);
	}

	const IconComp = Icon; // asume componente
	const iconEl = <IconComp className={className} />;

	return href ? (
		<a
			className={anchorClass}
			href={href}
			target='_blank'
			rel='noopener noreferrer'
			{...props}>
			{iconEl}
		</a>
	) : (
		iconEl
	);
}
