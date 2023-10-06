'use client';

import React, { useEffect, useRef } from 'react';
import { Chart as ChartJS, ChartConfiguration } from 'chart.js/auto';
import { chartConfiguration, colors, labels } from './chart-config';
import Comment from '../../../shared/interfaces/comment';
import { calculateDistribution } from '@/app/utils/calculate-distribution';

export default function LineChart(props: { comments: Comment[] }) {
  const { comments } = props;
  const canvas = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const ctx: CanvasRenderingContext2D | null = canvas.current ? canvas.current.getContext('2d') : null;

    if (!ctx) {
      return;
    }
    
    const gradient = ctx.createLinearGradient(0, 16, 0, 600);
    gradient.addColorStop(0, colors.purple.half);
    gradient.addColorStop(0.65, colors.purple.quarter);
    gradient.addColorStop(1, colors.purple.zero);

    const configData = {
      labels,
      datasets: [
        {
          backgroundColor: gradient,
          label: "Ratings Distribution",
          data: calculateDistribution(comments),
          fill: true,
          borderWidth: 2,
          borderColor: colors.purple.default,
          lineTension: 0.2,
          pointBackgroundColor: colors.purple.default,
          pointRadius: 3
        }
      ]
    };
    const config = {
      ...chartConfiguration,
      data: configData,
    } as ChartConfiguration;

    const myLineChart = new ChartJS(ctx, config);

    return function cleanup() {
      myLineChart.destroy();
    };
  });

  return (
    <div className="line-chart">
      <canvas id="lineChart" ref={canvas} height="100" />
    </div>
  );
}