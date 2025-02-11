import { Component } from '@angular/core';
import { DUMMY_USERS } from '../../contants/dummy_users';
import { CommonModule } from '@angular/common';
import { UserTileSignalComponent } from '../user-tile-signal/user-tile-signal.component';

@Component({
  selector: 'app-users-list-signals',
  standalone: true,
  imports: [CommonModule, UserTileSignalComponent],
  templateUrl: './users-list-signals.component.html',
  styleUrl: './users-list-signals.component.css'
})
export class UsersListSignalsComponent {
  users = DUMMY_USERS;

  onUserSelect(id: string) {
    alert(`user with id: ${id} clicked`)
  }
}
