import { Component, EventEmitter, input, Input, Output, signal } from '@angular/core';
import { User } from '../../types/user.types';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../../../ui/card/card.component';

@Component({
  selector: 'app-user-tile',
  standalone: true,
  imports: [CommonModule, CardComponent],
  templateUrl: './user-tile.component.html',
  styleUrl: './user-tile.component.css'
})
export class UserTileComponent {
  @Input({
    required: true // when input not passed we will get an error,
  }) user!: User;
  selected = input.required<boolean>();
  @Output() onUserSelected = new EventEmitter<string>();

  get imagePath() {
    return `assets/users/${this.user.avatar}`;
  }

  onUserClick() {
    this.onUserSelected.emit(this.user.id);
  }
}
