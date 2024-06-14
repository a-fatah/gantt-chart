'use client';
import Image from 'next/image';
import { useState } from 'react';
import { Task } from './components/types';
import GanttChart from './components/GanttChart';

export default function Home() {
  const initialTasks: Task[] = [
    {
      id: '1',
      name: 'Project Kickoff',
      start: new Date('2024-06-01'),
      end: new Date('2024-06-02'),
      summary: 'Initial project meeting with all stakeholders',
      owner: 'Alice',
      dependencies: []
    },
    {
      id: '2',
      name: 'Requirements Gathering',
      start: new Date('2024-06-03'),
      end: new Date('2024-06-07'),
      summary: 'Collect detailed requirements from the client',
      owner: 'Bob',
      dependencies: ['1']
    },
    {
      id: '3',
      name: 'Design Phase',
      start: new Date('2024-06-08'),
      end: new Date('2024-06-14'),
      summary: 'Create design documents and mockups',
      owner: 'Charlie',
      dependencies: ['2']
    },
    {
      id: '4',
      name: 'Development Phase',
      start: new Date('2024-06-15'),
      end: new Date('2024-07-15'),
      summary: 'Develop the core features of the project',
      owner: 'Dave',
      dependencies: ['3']
    },
    {
      id: '5',
      name: 'Testing Phase',
      start: new Date('2024-07-16'),
      end: new Date('2024-07-30'),
      summary: 'Test the developed features for any bugs',
      owner: 'Eve',
      dependencies: ['4']
    },
    {
      id: '6',
      name: 'Client Review',
      start: new Date('2024-08-01'),
      end: new Date('2024-08-05'),
      summary: 'Present the project to the client for feedback',
      owner: 'Frank',
      dependencies: ['5']
    },
    {
      id: '7',
      name: 'Final Adjustments',
      start: new Date('2024-08-06'),
      end: new Date('2024-08-10'),
      summary: 'Make final adjustments based on client feedback',
      owner: 'Grace',
      dependencies: ['6']
    },
    {
      id: '8',
      name: 'Project Launch',
      start: new Date('2024-08-15'),
      end: new Date('2024-08-15'),
      summary: 'Official launch of the project',
      owner: 'Hannah',
      dependencies: ['7']
    }
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
