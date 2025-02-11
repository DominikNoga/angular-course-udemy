import { Component, inject, input, output } from '@angular/core';
import { CreateTaskDto } from '../../types/task.types';
import { TaskService } from '../../utils/task.service';
import { Task2Service } from '../../utils/taskTest.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.css'
})
export class AddTaskComponent {
  userId = input.required<string>();
  newTask: CreateTaskDto = {
    title: '',
    dueDate: '',
    summary: '',
  };

  displayAddTask = true;
  onHideAddTask = output<void>();
  private taskService = inject(TaskService);
  private task2Service = inject(Task2Service);

  createNewTask() {
    // this.newTask.userId = this.userId();
    // this.taskService.addTask(this.newTask, this.userId());
    this.task2Service.addTask(this.newTask, this.userId());
    this.hideAddTask();
  }

  hideAddTask() {
    this.displayAddTask = false;
    this.onHideAddTask.emit()
  }
}
