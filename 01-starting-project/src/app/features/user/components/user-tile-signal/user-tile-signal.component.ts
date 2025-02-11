import { Component, computed, input, output } from '@angular/core';
import { User } from '../../types/user.types';

@Component({
  selector: 'app-user-tile-signal',
  standalone: true,
  imports: [],
  templateUrl: './user-tile-signal.component.html',
  styleUrl: './user-tile-signal.component.css'
})
export class UserTileSignalComponent {
  // using input with signals. Instead of using decorator with capital 'I', we use small 'i'
  user = input.required<User>();
  imagePath = computed(() => `assets/users/${this.user().avatar}`);
  onUserSelect = output<string>();

  changeSignal() {
    // input signal are readonly. They can only change from parent component
    // this.avatar.set('some value');
  }

  onUserClick() {
    console.log('user clicked')
    this.onUserSelect.emit(this.user().id);
  }
}
