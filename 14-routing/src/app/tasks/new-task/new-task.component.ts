import { Component, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TasksService } from '../tasks.service';
import { CanDeactivateFn, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-new-task',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './new-task.component.html',
  styleUrl: './new-task.component.css',
})
export class NewTaskComponent {
  userId = input.required<string>();
  enteredTitle = signal('');
  enteredSummary = signal('');
  enteredDate = signal('');
  submitted = false;
  private router = inject(Router);
  private tasksService = inject(TasksService);

  onSubmit() {
    this.tasksService.addTask(
      {
        title: this.enteredTitle(),
        summary: this.enteredSummary(),
        date: this.enteredDate(),
      },
      this.userId()
    );

    this.submitted = true;
    this.router.navigate(['users', this.userId(), 'tasks'], {
      replaceUrl: true // make sure it works as the redirect, in order to prevent going back to the same page
    });
  }
}

export const canLeaveNewTaskPage: CanDeactivateFn<NewTaskComponent> = (component: NewTaskComponent) => {
  if (component.submitted) return true;
  if (component.enteredDate() || component.enteredSummary() || component.enteredTitle()) {
    return window.confirm('Are tou sure you want to leave? You will loose all the data');
  }
  return true;
}
