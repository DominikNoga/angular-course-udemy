import { Component, signal } from '@angular/core';
import { HeaderComponent } from './ui/header/header.component';
import { UsersListComponent } from './features/user/components/users-list/users-list.component';
import { UsersListSignalsComponent } from './features/user/components/users-list-signals/users-list-signals.component';
import { User } from './features/user/types/user.types';
import { DUMMY_USERS } from './features/user/contants/dummy_users';
import { TaskListComponent } from './features/tasks/components/task-list/task-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, UsersListComponent, UsersListSignalsComponent, TaskListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  users: User[] = DUMMY_USERS;
  selectedUser = signal<User | undefined>(undefined);

  updateUserTasks(selectedUser: User) {
    this.selectedUser.set(selectedUser);
  }

  selectedUserDefined = () => typeof this.selectedUser() !== 'undefined';
}
