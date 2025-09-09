import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

import * as echarts from 'echarts/core';
import { BarChart, LineChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, GridComponent, LegendComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([TitleComponent, TooltipComponent, GridComponent, LegendComponent, BarChart, LineChart, CanvasRenderer]);

/** Formatea "2025-09-05" -> "5-sep" */
function fmtLabel(iso) {
	const d = new Date(iso);
	if (isNaN(+d)) return iso;
	const day = d.getDate();
	const m = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'][d.getMonth()];
	return `${day}-${m}`;
}

/**
 * Seguimiento Telefónico (barras: Recibidas, línea: % Abandono)
 * rows: [{ fecha, recibidas, prc_abandono, ... }]
 */
export default function EUTCallsFollowUpChart({
	className = '',
	stepMs = 2200,
	title = 'Seguimiento Telefónico',
	rows = [
		// ← dataset de ejemplo con TU FORMATO (5–7 sep)
		{
			fecha: '2025-09-05',
			recibidas: 414,
			atendidas: 411,
			abandonadas: 3,
			abandono_menos10: 2,
			prc_abandono: '0.24',
			tiempoAHT: '00:05:46',
			nummin: 142322,
			rangosem: '05 SEP - 11 SEP',
			anhio: 2025,
		},
		{
			fecha: '2025-09-06',
			recibidas: 47,
			atendidas: 47,
			abandonadas: 0,
			abandono_menos10: 0,
			prc_abandono: '0.00',
			tiempoAHT: '00:05:04',
			nummin: 14306,
			rangosem: '05 SEP - 11 SEP',
			anhio: 2025,
		},
		{
			fecha: '2025-09-07',
			recibidas: 7,
			atendidas: 6,
			abandonadas: 1,
			abandono_menos10: 0,
			prc_abandono: '14.29',
			tiempoAHT: '00:02:07',
			nummin: 767,
			rangosem: '05 SEP - 11 SEP',
			anhio: 2025,
		},
	],
}) {
	const elRef = useRef(null);
	const chartRef = useRef(null);
	const timerRef = useRef(null);
	const roRef = useRef(null);
	const ioRef = useRef(null);

	// buffers mutables (no re-render)
	const labels = useRef([]);
	const llamadas = useRef([]);
	const abandonoPct = useRef([]);
	const subtext = useRef('');

	useEffect(() => {
		if (!rows || rows.length === 0) return;

		// construir arrays desde rows (en el orden recibido)
		labels.current = rows.map((r) => fmtLabel(r.fecha));
		llamadas.current = rows.map((r) => Number(r.recibidas) || 0);
		abandonoPct.current = rows.map((r) => parseFloat(r.prc_abandono) || 0);
		subtext.current = rows[0]?.rangosem || '';

		const el = elRef.current;
		const chart = echarts.init(el, null, { renderer: 'canvas' });
		chartRef.current = chart;

		// colores desde CSS vars
		const css = getComputedStyle(document.documentElement);
		const fg = css.getPropertyValue('--foreground')?.trim() || '#e5e7eb';
		const brand = css.getPropertyValue('--brand-red')?.trim() || '#c51617';
		const barCol = '#2F80ED';

		// ejes “bonitos”
		const maxCalls = Math.max(1, ...llamadas.current);
		const maxCallsAxis = Math.ceil(maxCalls * 1.25);
		const maxPct = Math.max(1, ...abandonoPct.current);
		const maxPctAxis = Math.max(16, Math.ceil((maxPct + 1) / 2) * 2); // cubrir 14.3%

		chart.setOption({
			title: {
				text: title,
				subtext: subtext.current,
				left: 'center',
				top: 6,
				textStyle: { fontWeight: 700 },
			},
			grid: { top: 64, right: 24, bottom: 32, left: 48, containLabel: true },
			legend: { top: 36 },
			tooltip: {
				trigger: 'axis',
				axisPointer: { type: 'cross' },
				formatter: (params) => {
					const pBar = params.find((p) => p.seriesName === 'Llamadas Recibidas');
					const pLine = params.find((p) => p.seriesName === '% Abandono');
					const x = params[0]?.axisValueLabel ?? '';
					const calls = pBar ? pBar.data.toLocaleString() : '-';
					const pct = pLine ? `${pLine.data}%` : '-';
					return `${x}<br/>Llamadas: <b>${calls}</b><br/>% Abandono: <b>${pct}</b>`;
				},
			},

			/* 👇 BOTONES DE ACCIÓN */
			toolbox: {
				show: true,
				right: 12,
				top: 8,
				iconStyle: {
					borderColor: brand, // usa tu color de marca en dark/light
				},
				emphasis: {
					iconStyle: { borderColor: brand },
				},
				feature: {
					dataView: {
						readOnly: true,
						optionToContent: (opt) => {
							// pequeña tabla legible
							const xs = labels.current;
							const cs = llamadas.current;
							const ps = abandonoPct.current;
							const rows = xs
								.map(
									(lbl, i) => `
            <tr>
              <td style="padding:6px 10px;border-bottom:1px solid #ddd">${lbl}</td>
              <td style="padding:6px 10px;border-bottom:1px solid #ddd;text-align:right">${(
								cs[i] ?? 0
							).toLocaleString()}</td>
              <td style="padding:6px 10px;border-bottom:1px solid #ddd;text-align:right">${ps[i] ?? 0}%</td>
            </tr>
          `
								)
								.join('');
							return `
            <div style="padding:8px;max-height:260px;overflow:auto">
              <table style="border-collapse:collapse;width:100%;font-size:12px">
                <thead>
                  <tr>
                    <th style="text-align:left;padding:6px 10px;border-bottom:1px solid #bbb">Fecha</th>
                    <th style="text-align:right;padding:6px 10px;border-bottom:1px solid #bbb">Llamadas</th>
                    <th style="text-align:right;padding:6px 10px;border-bottom:1px solid #bbb">% Abandono</th>
                  </tr>
                </thead>
                <tbody>${rows}</tbody>
              </table>
            </div>
          `;
						},
					},
					restore: {}, // restaura la opción inicial de ECharts
					saveAsImage: { name: 'seguimiento-telefonico', pixelRatio: 2 },
				},
			},

			xAxis: {
				type: 'category',
				boundaryGap: true,
				data: labels.current,
				axisLabel: { color: fg },
				axisLine: { lineStyle: { color: fg + '55' } },
			},
			yAxis: [
				{
					type: 'value',
					name: 'Llamadas',
					min: 0,
					max: maxCallsAxis,
					axisLabel: { color: fg },
					splitLine: { lineStyle: { color: fg + '22' } },
				},
				{
					type: 'value',
					name: '% Abandono',
					min: 0,
					max: maxPctAxis,
					axisLabel: { formatter: '{value} %', color: fg },
					splitLine: { show: false },
				},
			],
			series: [
				{
					name: 'Llamadas Recibidas',
					type: 'bar',
					data: llamadas.current,
					itemStyle: { color: '#2F80ED' },
					yAxisIndex: 0,
					barMaxWidth: 28,
				},
				{
					name: '% Abandono',
					type: 'line',
					data: abandonoPct.current,
					yAxisIndex: 1,
					itemStyle: { color: brand },
					lineStyle: { width: 2 },
					symbol: 'circle',
					symbolSize: 8,
					label: { show: true, formatter: ({ value }) => `${value}%`, position: 'top' },
				},
			],
			animation: true,
		});

		// responsive
		const ro = new ResizeObserver(() => chart.resize());
		ro.observe(el);
		roRef.current = ro;

		// rotación: primer elemento al final
		const rotate = () => {
			labels.current.push(labels.current.shift());
			llamadas.current.push(llamadas.current.shift());
			abandonoPct.current.push(abandonoPct.current.shift());
			chart.setOption({
				xAxis: { data: labels.current },
				series: [{ data: llamadas.current }, { data: abandonoPct.current }],
			});
		};

		// pausa/reanuda según visibilidad
		const io = new IntersectionObserver(
			(entries) => {
				const vis = entries[0]?.isIntersecting;
				clearInterval(timerRef.current);
				if (vis) timerRef.current = setInterval(rotate, stepMs);
			},
			{ threshold: 0.1 }
		);
		io.observe(el);
		ioRef.current = io;

		return () => {
			clearInterval(timerRef.current);
			io.disconnect();
			ro.disconnect();
			chart.dispose();
		};
	}, [JSON.stringify(rows), stepMs, title]);

	return (
		<div
			ref={elRef}
			className={cn('h-full w-full min-h-[14rem]', className)}
		/>
	);
}
