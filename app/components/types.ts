// src/types.ts
export interface Task {
  id: string;
  name: string;
  start: Date;
  end: Date;
  owner: string;
  summary: string;
  dependencies?: string[];
}
