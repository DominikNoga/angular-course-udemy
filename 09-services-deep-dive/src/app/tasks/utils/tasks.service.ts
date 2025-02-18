import { Injectable, signal } from '@angular/core';
import { CreateTaskDto, Task, TASK_STATUS, TaskFilterStatus, TaskStatus } from '../task.model';

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  private tasks = signal<Task[]>([]);
  allTasks = this.tasks.asReadonly();
  constructor() { }

  addTask(task: CreateTaskDto) {
    this.tasks.update(tasks => [...tasks, this.getNewTask(task)]);
  }

  updateTaskStatus(taskId: string, status: TaskStatus) {
    this.tasks.update(tasks => tasks.map(task => {
      if (task.id === taskId) {
        return { ...task, status };
      }
      return task;
    }));
  }

  getFilteredTasks(status: TaskFilterStatus) {
    if (status === 'all') {
      return this.allTasks();
    }
    return this.tasks().filter(task => task.status === status);
  }

  private getNewTask(task: CreateTaskDto): Task {
    return {
      id: Math.random().toString(36).substr(2, 9),
      title: task.title,
      description: task.description,
      status: TASK_STATUS.OPEN
    };
  }
}
