// src/components/charts/EUTLineChart.jsx
import * as React from 'react';
import * as echarts from 'echarts';

/**
 * EUTLineChart
 * - Si "fill" es true, el gráfico ocupa 100% del alto/ancho disponible del header.
 * - Si "fill" es false, usa "height" (px o string).
 *
 * npm i echarts
 */
export default function EUTLineChart({
	title = 'Visitas diarias',
	categories = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
	series = [
		{ name: 'Web', data: [120, 200, 150, 80, 70, 110, 130] },
		{ name: 'Móvil', data: [90, 132, 101, 134, 90, 230, 210] },
	],
	height = 320,
	smooth = true,
	fill = false,
	className = '',
}) {
	const ref = React.useRef(null);
	const chartRef = React.useRef(null);

	React.useEffect(() => {
		const el = ref.current;
		if (!el) return;

		// (re)usar instancia
		let chart = chartRef.current;
		if (!chart) {
			chart = echarts.init(el, null, { renderer: 'canvas' });
			chartRef.current = chart;
		}

		const isDark = document.documentElement.classList.contains('dark');
		const css = (v) => getComputedStyle(document.documentElement).getPropertyValue(v).trim();
		const fg = css('--foreground') || (isDark ? '#e5e7eb' : '#0f172a');
		const muted = css('--muted-foreground') || (isDark ? '#9ca3af' : '#64748b');
		const gridBorder = isDark ? '#334155' : '#e2e8f0';
		const axisLine = isDark ? '#475569' : '#94a3b8';

		const option = {
			backgroundColor: 'transparent',
			title: { text: title, left: 'left', textStyle: { color: fg, fontWeight: 600 } },
			tooltip: { trigger: 'axis' },
			legend: { top: 8, textStyle: { color: muted } },
			grid: { left: 40, right: 16, top: 48, bottom: 36 },
			xAxis: {
				type: 'category',
				boundaryGap: false,
				data: categories,
				axisLine: { lineStyle: { color: axisLine } },
				axisLabel: { color: muted },
				axisTick: { show: false },
				splitLine: { show: true, lineStyle: { color: gridBorder } },
			},
			yAxis: {
				type: 'value',
				axisLine: { lineStyle: { color: axisLine } },
				axisLabel: { color: muted },
				splitLine: { show: true, lineStyle: { color: gridBorder } },
			},
			series: series.map((s) => ({
				name: s.name,
				type: 'line',
				smooth,
				symbol: 'circle',
				symbolSize: 6,
				showSymbol: false,
				emphasis: { focus: 'series' },
				areaStyle: { opacity: 0.15 },
				data: s.data,
			})),
			animationDuration: 600,
			animationEasing: 'quarticOut',
		};

		chart.setOption(option);

		// Auto-resize
		const ro = new ResizeObserver(() => chart.resize());
		ro.observe(el);
		const onWin = () => chart.resize();
		window.addEventListener('resize', onWin);

		// Re-tinte por cambio de tema
		const themeObs = new MutationObserver(() => {
			const dark = document.documentElement.classList.contains('dark');
			const fg2 = css('--foreground') || (dark ? '#e5e7eb' : '#0f172a');
			const muted2 = css('--muted-foreground') || (dark ? '#9ca3af' : '#64748b');
			const grid2 = dark ? '#334155' : '#e2e8f0';
			const axis2 = dark ? '#475569' : '#94a3b8';
			chart.setOption({
				title: { textStyle: { color: fg2 } },
				legend: { textStyle: { color: muted2 } },
				xAxis: {
					axisLine: { lineStyle: { color: axis2 } },
					axisLabel: { color: muted2 },
					splitLine: { lineStyle: { color: grid2 } },
				},
				yAxis: {
					axisLine: { lineStyle: { color: axis2 } },
					axisLabel: { color: muted2 },
					splitLine: { lineStyle: { color: grid2 } },
				},
			});
		});
		themeObs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

		return () => {
			ro.disconnect();
			window.removeEventListener('resize', onWin);
			themeObs.disconnect();
			// chart.dispose(); // si notas fugas al navegar, habilita esto
		};
	}, [title, JSON.stringify(categories), JSON.stringify(series), smooth]);

	const style = fill
		? { width: '100%', height: '100%' }
		: { width: '100%', height: typeof height === 'number' ? `${height}px` : height };

	// Cuando fill=true, normalmente no quieres bordes/padding internos
	const chromeClasses = fill
		? 'p-0 border-0 bg-transparent shadow-none'
		: 'rounded-2xl border border-[var(--border)] p-4 shadow-sm';

	return (
		<div className={`w-full ${chromeClasses} bg-[var(--card)] ${className}`}>
			<div
				ref={ref}
				style={style}
			/>
		</div>
	);
}
