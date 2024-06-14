// src/components/GanttChart.tsx
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Task } from '@/types';
import Tooltip from './tooltip';

interface GanttChartProps {
  tasks: Task[];
}

const GanttChart: React.FC<GanttChartProps> = ({ tasks }) => {
  const ref = useRef<SVGSVGElement | null>(null);
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    content: string;
    visible: boolean;
  }>({
    x: 0,
    y: 0,
    content: '',
    visible: false,
  });

  useEffect(() => {
    if (tasks.length === 0 || !ref.current) return;

    const svg = d3.select(ref.current);
    const width = 800;
    const height = 400;
    const margin = { top: 20, right: 30, bottom: 30, left: 100 };

    svg.selectAll('*').remove(); // Clear previous chart

    const xScale = d3
      .scaleTime()
      .domain([
        d3.min(tasks, (task) => task.start) as Date,
        d3.max(tasks, (task) => task.end) as Date,
      ])
      .range([margin.left, width - margin.right]);

    const yScale = d3
      .scaleBand()
      .domain(tasks.map((task) => task.name))
      .range([margin.top, height - margin.bottom])
      .padding(0.1);

    svg
      .append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(xScale).tickSizeOuter(0));

    svg
      .append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale).tickSizeOuter(0));

    const taskRects = svg
      .selectAll('rect')
      .data(tasks)
      .enter()
      .append('rect')
      .attr('x', (task) => xScale(task.start)!)
      .attr('y', (task) => yScale(task.name)!)
      .attr('width', (task) => xScale(task.end)! - xScale(task.start)!)
      .attr('height', yScale.bandwidth())
      .attr('fill', 'steelblue')
      .on('mouseover', (event, task) => {
        setTooltip({
          x: event.pageX,
          y: event.pageY,
          content: task.summary,
          visible: true,
        });
      })
      .on('mousemove', (event, task) => {
        setTooltip({
          x: event.pageX,
          y: event.pageY,
          content: task.summary,
          visible: true,
        });
      })
      .on('mouseout', () => {
        setTooltip({
          x: 0,
          y: 0,
          content: '',
          visible: false,
        });
      });
  }, [tasks]);

  return (
    <>
      <svg ref={ref} width={800} height={400}></svg>
      <Tooltip
        x={tooltip.x}
        y={tooltip.y}
        content={tooltip.content}
        visible={tooltip.visible}
      />
    </>
  );
};

export default GanttChart;
