import { Component, computed, Signal, signal } from '@angular/core';

import { TaskItemComponent } from './task-item/task-item.component';
import { TasksService } from '../utils/tasks.service';
import { Task, TASK_FILTER_OPTIONS, TaskFilterStatus, TaskStatus } from '../task.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tasks-list',
  standalone: true,
  templateUrl: './tasks-list.component.html',
  styleUrl: './tasks-list.component.css',
  imports: [TaskItemComponent, FormsModule],
})
export class TasksListComponent {
  selectedFilter: TaskFilterStatus = 'all';
  private filterSignal = signal<TaskFilterStatus>(this.selectedFilter);
  tasks: Signal<Task[]>;
  readonly TASK_FILTER_OPTIONS = TASK_FILTER_OPTIONS;

  constructor(private tasksService: TasksService) {
    this.tasks = computed(() =>{
      return this.tasksService.getFilteredTasks(this.filterSignal())
    });
  }

  onChangeTasksFilter() {
    this.filterSignal.set(this.selectedFilter);
    console.log(this.filterSignal());
  }
}
