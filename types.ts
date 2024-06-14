// src/types.ts
export interface Task {
  id: number;
  name: string;
  start: Date;
  end: Date;
  owner: string;
  summary: string;
}
