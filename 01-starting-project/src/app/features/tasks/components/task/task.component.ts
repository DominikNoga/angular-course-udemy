import { Component, input, output } from '@angular/core';
import { Task } from '../../types/task.types';
import { CardComponent } from "../../../../ui/card/card.component";
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [CardComponent, DatePipe],
  templateUrl: './task.component.html',
  styleUrl: './task.component.css'
})
export class TaskComponent {
  task = input.required<Task>();
  onTaskComplete = output<string>();

  completeTask() {
    this.onTaskComplete.emit(this.task().id);
  }
}
