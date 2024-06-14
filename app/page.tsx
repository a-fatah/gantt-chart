'use client';
import { Task } from '@/types';
import Image from 'next/image';
import GanttChart from './components/GanttChart';
import { useState } from 'react';

export default function Home() {
  const initialTasks: Task[] = [
    {
      id: 1,
      name: 'Task 1',
      start: new Date('2024-06-01'),
      end: new Date('2024-06-05'),
      owner: 'Alice',
      summary: 'Task 1 summary',
    },
    {
      id: 2,
      name: 'Task 2',
      start: new Date('2024-06-03'),
      end: new Date('2024-06-07'),
      owner: 'Bob',
      summary: 'Task 2 summary',
    },
    {
      id: 3,
      name: 'Task 3',
      start: new Date('2024-06-06'),
      end: new Date('2024-06-10'),
      owner: 'Charlie',
      summary: 'Task 3 summary',
    },
  ];

  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <GanttChart tasks={tasks} setTasks={setTasks} />
      </div>
    </main>
  );
}
