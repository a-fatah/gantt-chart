// src/components/GanttChart.tsx
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import Tooltip from './tooltip';
import { Task } from './types';

interface GanttChartProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

const GanttChart: React.FC<GanttChartProps> = ({ tasks, setTasks }) => {
  const ref = useRef<SVGSVGElement | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; content: string; visible: boolean }>({
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
        d3.min(tasks, task => task.start) as Date,
        d3.max(tasks, task => task.end) as Date,
      ])
      .range([margin.left, width - margin.right]);

    const yScale = d3
      .scaleBand()
      .domain(tasks.map(task => task.name))
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
      .attr('x', task => xScale(task.start)!)
      .attr('y', task => yScale(task.name)!)
      .attr('width', task => xScale(task.end)! - xScale(task.start)!)
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
        const rect = d3.select(event.target);
        const xStart = +rect.attr('x');
        const width = +rect.attr('width');
        const xEnd = xStart + width;
        const cursorPosition = event.offsetX;

        if (Math.abs(cursorPosition - xStart) < 5 || Math.abs(cursorPosition - xEnd) < 5) {
          rect.style('cursor', 'ew-resize');
        } else {
          rect.style('cursor', 'default');
        }

        setTooltip({
          x: event.pageX,
          y: event.pageY,
          content: task.summary,
          visible: true,
        });
      })
      .on('mouseout', () => {
        d3.select(event.target).style('cursor', 'default');
        setTooltip({
          x: 0,
          y: 0,
          content: '',
          visible: false,
        });
      });

    // Add drag behavior for resizing
    const drag = d3.drag()
      .on('start', function (event, task) {
        d3.select(this).raise().attr('stroke', 'black');
      })
      .on('drag', function (event, task) {
        const x = event.x;
        const rect = d3.select(this);
        const width = +rect.attr('width');
        const xStart = +rect.attr('x');

        // Determine if dragging start or end based on cursor position
        const isDraggingStart = x < xStart + width / 2;
        if (isDraggingStart) {
          const newStartDate = xScale.invert(x);
          if (newStartDate < task.end) {
            rect.attr('x', x);
            rect.attr('width', xScale(task.end)! - x);
            setTasks(prevTasks =>
              prevTasks.map(t => (t.id === task.id ? { ...t, start: newStartDate } : t))
            );
          }
        } else {
          const newEndDate = xScale.invert(x);
          if (newEndDate > task.start) {
            rect.attr('width', x - xStart);
            setTasks(prevTasks =>
              prevTasks.map(t => (t.id === task.id ? { ...t, end: newEndDate } : t))
            );
          }
        }
      })
      .on('end', function () {
        d3.select(this).attr('stroke', null);
      });

    taskRects.call(drag);

    // Draw dependency lines
    const lineGenerator = d3.line()
      .x(d => d[0])
      .y(d => d[1])
      .curve(d3.curveBundle.beta(1));

    tasks.forEach(task => {
      if (task.dependencies) {
        task.dependencies.forEach(depId => {
          const depTask = tasks.find(t => t.id === depId);
          if (depTask) {
            const points = [
              [xScale(depTask.end), yScale(depTask.name)! + yScale.bandwidth() / 2],
              [(xScale(depTask.end)! + xScale(task.start)!) / 2, yScale(depTask.name)! + yScale.bandwidth() / 2],
              [(xScale(depTask.end)! + xScale(task.start)!) / 2, yScale(task.name)! + yScale.bandwidth() / 2],
              [xScale(task.start), yScale(task.name)! + yScale.bandwidth() / 2]
            ];

            svg.append('path')
              .attr('d', lineGenerator(points))
              .attr('stroke', 'black')
              .attr('stroke-width', 2)
              .attr('fill', 'none')
              .attr('marker-end', 'url(#arrow)');
          }
        });
      }
    });

    // Define arrow marker
    svg.append('defs').append('marker')
      .attr('id', 'arrow')
      .attr('viewBox', '0 0 10 10')
      .attr('refX', 5)
      .attr('refY', 5)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto-start-reverse')
      .append('path')
      .attr('d', 'M 0 0 L 10 5 L 0 10 z')
      .attr('fill', 'black');

  }, [tasks, setTasks]);

  return (
    <>
      <svg ref={ref} width={800} height={400}></svg>
      <Tooltip x={tooltip.x} y={tooltip.y} content={tooltip.content} visible={tooltip.visible} />
    </>
  );
};

export default GanttChart;