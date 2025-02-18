import { Component, computed, inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Task, TASK_STATUS, TASK_STATUS_INPUT, TaskStatus } from '../../task.model';
import { TasksService } from '../../utils/tasks.service';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './task-item.component.html',
  styleUrl: './task-item.component.css',
})
export class TaskItemComponent {
  readonly TASK_STATUS_OPTIONS = TASK_STATUS_INPUT;
  private tasksService = inject(TasksService);
  task = input.required<Task>();
  taskStatus = computed(() => {
    switch (this.task().status) {
      case 'OPEN':
        return 'Open';
      case 'IN_PROGRESS':
        return 'Working on it';
      case 'DONE':
        return 'Completed';
      default:
        return 'Open';
    }
  });

  onChangeTaskStatus(taskId: string, status: string) {
    let newStatus: TaskStatus = 'OPEN';
    switch (status) {
      case 'open':
        newStatus = TASK_STATUS.OPEN;
        break;
      case 'in-progress':
        newStatus = TASK_STATUS.IN_PROGRESS;
        break;
      case 'done':
        newStatus = TASK_STATUS.DONE;
        break;
      default:
        break;
    }

    this.tasksService.updateTaskStatus(taskId, newStatus);
  }
}
