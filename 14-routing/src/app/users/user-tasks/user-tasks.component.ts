import { Component, computed, DestroyRef, inject, input, OnInit } from '@angular/core';
import { UsersService } from '../users.service';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-user-tasks',
  standalone: true,
  templateUrl: './user-tasks.component.html',
  styleUrl: './user-tasks.component.css',
  imports: [RouterOutlet, RouterLink]
})
export class UserTasksComponent implements OnInit {
  userId = input.required<string>();
  private usersService = inject(UsersService);
  private activatedRoute = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  userName = computed(
    () => this.usersService.users.find(user => user.id === this.userId())?.name
  );

  ngOnInit(): void {
    console.log(this.activatedRoute);
    const sub = this.activatedRoute.paramMap.subscribe({
      next: paramMap => {
        const userId = paramMap.get('userId');
      }
    });
    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }
}
