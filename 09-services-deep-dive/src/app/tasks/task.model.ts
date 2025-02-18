import { InjectionToken, ValueProvider } from "@angular/core";

export const TASK_STATUS = {
  OPEN: 'OPEN',
  IN_PROGRESS: 'IN_PROGRESS',
  DONE: 'DONE'
} as const;

export type TaskInput = {
  value: string,
  label: string,
  status: TaskStatus;
}

export type TaskFilterStatus = TaskStatus | 'all';

export type TaskStatusFilter = TaskInput & {
  status: TaskFilterStatus;
}

export const TASK_STATUS_INPUT = [
  {
    status: TASK_STATUS.OPEN,
    value: 'open',
    label: 'Open'
  },
  {
    status: TASK_STATUS.IN_PROGRESS,
    value: 'in-progress',
    label: 'In-progress'
  },
  {
    status: TASK_STATUS.DONE,
    value: 'done',
    label: 'Completed'
  }
] as const;

export const TaskFilterOptions = [

  ...TASK_STATUS_INPUT,
  {
    value: 'all',
    label: 'All',
    status: 'all'
  }
 ] as const;

export const TASK_FILTER_OPTIONS = new InjectionToken<typeof TaskFilterOptions>('task-filter-options');

export const TaskFilterOptionsProvider: ValueProvider = {
  provide: TASK_FILTER_OPTIONS,
  useValue: TaskFilterOptions
}

export type TaskStatus = typeof TASK_STATUS[keyof typeof TASK_STATUS];

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
}

export type CreateTaskDto = Omit<Task, 'id' | 'status'>;
