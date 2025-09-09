import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

// ECharts (tree-shakable)
import * as echarts from 'echarts/core';
import { BarChart, LineChart } from 'echarts/charts';
import {
	TitleComponent,
	TooltipComponent,
	GridComponent,
	LegendComponent,
	ToolboxComponent,
	DataZoomComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
	TitleComponent,
	TooltipComponent,
	GridComponent,
	LegendComponent,
	ToolboxComponent,
	DataZoomComponent,
	BarChart,
	LineChart,
	CanvasRenderer,
]);

/**
 * Chart dinámico estilo "Dynamic Data" de la doc de ECharts.
 * - Responsive: se ajusta al tamaño del contenedor (ResizeObserver).
 * - Sin fugas: limpia intervalos y dispose en unmount.
 */
export default function EUTDynamicChart({
	className = '',
	points = 10, // cuántos puntos visibles
	stepMs = 2100, // intervalo de actualización
	title = 'Dynamic Data',
}) {
	const elRef = useRef(null);
	const chartRef = useRef(null);
	const timerRef = useRef(null);

	// Estado del stream (mutable sin re-render)
	const streamRef = useRef({
		categories: [],
		categories2: [],
		data: [],
		data2: [],
		count: 0,
	});

	useEffect(() => {
		// 1) Inicializa datos
		const s = streamRef.current;
		s.categories = [];
		let now = new Date();
		for (let i = 0; i < points; i++) {
			s.categories.unshift(now.toLocaleTimeString().replace(/^\D*/, ''));
			now = new Date(+now - 2000);
		}
		s.categories2 = Array.from({ length: points }, (_, i) => i);
		s.data = Array.from({ length: points }, () => Math.round(Math.random() * 1000));
		s.data2 = Array.from({ length: points }, () => +(Math.random() * 10 + 5).toFixed(1));
		s.count = points;

		// 2) Init chart
		const chart = echarts.init(elRef.current, null, { renderer: 'canvas' });
		chartRef.current = chart;

		chart.setOption({
			title: { text: title },
			tooltip: {
				trigger: 'axis',
				axisPointer: { type: 'cross', label: { backgroundColor: '#283b56' } },
			},
			legend: {},
			toolbox: { show: true, feature: { dataView: { readOnly: false }, restore: {}, saveAsImage: {} } },
			dataZoom: { show: false, start: 0, end: 100 },
			grid: { top: 48, right: 24, bottom: 36, left: 40, containLabel: true },
			xAxis: [
				{ type: 'category', boundaryGap: true, data: s.categories },
				{ type: 'category', boundaryGap: true, data: s.categories2 },
			],
			yAxis: [
				{ type: 'value', scale: true, name: 'Price', max: 30, min: 0, boundaryGap: [0.2, 0.2] },
				{ type: 'value', scale: true, name: 'Order', max: 1200, min: 0, boundaryGap: [0.2, 0.2] },
			],
			series: [
				{ name: 'Dynamic Bar', type: 'bar', xAxisIndex: 1, yAxisIndex: 1, data: s.data },
				{ name: 'Dynamic Line', type: 'line', data: s.data2, smooth: true },
			],
		});

		// 3) Resize responsive
		const ro = new ResizeObserver(() => chart.resize());
		ro.observe(elRef.current);

		// 4) Timer de actualización
		timerRef.current = setInterval(() => {
			const axisData = new Date().toLocaleTimeString().replace(/^\D*/, '');
			s.data.shift();
			s.data.push(Math.round(Math.random() * 1000));
			s.data2.shift();
			s.data2.push(+(Math.random() * 10 + 5).toFixed(1));
			s.categories.shift();
			s.categories.push(axisData);
			s.categories2.shift();
			s.categories2.push(++s.count);

			chart.setOption({
				xAxis: [{ data: s.categories }, { data: s.categories2 }],
				series: [{ data: s.data }, { data: s.data2 }],
			});
		}, stepMs);

		return () => {
			clearInterval(timerRef.current);
			ro.disconnect();
			chart.dispose();
		};
	}, [points, stepMs, title]);

	return (
		<div
			ref={elRef}
			className={cn('h-full w-full min-h-[12rem]', className)}
		/>
	);
}
