import { Component, EventEmitter, Input, input, Output } from '@angular/core';
import { UserTileComponent } from '../user-tile/user-tile.component';
import { CommonModule } from '@angular/common';
import { User } from '../../types/user.types';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule, UserTileComponent],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.css'
})
export class UsersListComponent {
  @Input({required: true}) users!: User[];
  @Output() userSelected = new EventEmitter<User>();
  selectedUserId?: string;

  onUserClicked(userId: string) {
    const foundUser: User | undefined = this.users.find(user => user.id === userId);
    this.selectedUserId = foundUser?.id;
    this.userSelected.emit(foundUser);
  }
}
