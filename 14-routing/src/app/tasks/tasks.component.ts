import { Component, computed, inject, input, Signal } from '@angular/core';

import { TaskComponent } from './task/task.component';
import { Task } from './task/task.model';
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
  userId = input.required<string>();
  userTasks = input.required<Task[]>()
  order = input<SortOrder>('desc');

  getOppositeOrder = (): string => this.order() === 'asc' ? 'Descending' : 'Ascending';
}
