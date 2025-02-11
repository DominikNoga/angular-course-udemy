import { Component, computed, input, signal, Signal } from '@angular/core';
import { User } from '../../../user/types/user.types';
import { TaskComponent } from '../task/task.component';
import { Task } from '../../types/task.types';
import { TaskService } from '../../utils/task.service';
import { AddTaskComponent } from '../add-task/add-task.component';
import { Task2Service } from '../../utils/taskTest.service';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [TaskComponent, AddTaskComponent],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent {
  user = input.required<User>();
  allTasks = signal<Task[]>([]);
  userTasks: Signal<Task[]> = computed(() => this.allTasks().filter(task => task.userId === this.user().id));
  addTaskToggled: boolean = false;

  constructor(private taskService: TaskService, private task2Service: Task2Service) {
    // this.taskService.getTasks().subscribe(tasks => {
    //   this.allTasks.set(tasks);
    // })
    this.allTasks.set( this.task2Service.getTasks());
  }

  get selectedUserTasks() {
    return this.task2Service.getUserTasks(this.user().id);
  }

  onTaskComplete(taskId: string) {
    this.task2Service.deleteTask(taskId);
  }

  toggleAddTask() {
    this.addTaskToggled = !this.addTaskToggled;
  }
}
