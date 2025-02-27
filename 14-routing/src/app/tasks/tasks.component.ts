import { Component, computed, inject, input, Signal } from '@angular/core';

import { TaskComponent } from './task/task.component';
import { Task } from './task/task.model';
import { TasksService } from './tasks.service';
import { RouterLink } from '@angular/router';

type SortOrder = 'asc' | 'desc';

@Component({
  selector: 'app-tasks',
  standalone: true,
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css',
  imports: [TaskComponent, RouterLink],
})
export class TasksComponent {
  queryParams: {
    order: SortOrder
  } = {
    order: 'asc'
  };
  tasksService = inject(TasksService);
  userId = input.required<string>();
  userTasks: Signal<Task[]> = computed(
    () => this.tasksService.allTasks().filter(task => task.userId === this.userId())
  );
}
