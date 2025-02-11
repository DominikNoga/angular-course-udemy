import { Component, input } from '@angular/core';

@Component({
  selector: 'app-dashboard-tile',
  standalone: true,
  imports: [],
  templateUrl: './dashboard-tile.component.html',
  styleUrl: './dashboard-tile.component.css'
})
export class DashboardTileComponent {
  headerContent = input.required<string>();
  imgSrc = input.required<string>();
  imgAlt = input.required<string>();
}
