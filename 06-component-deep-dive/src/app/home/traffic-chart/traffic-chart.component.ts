import { Component, input, OnInit } from '@angular/core';
import { TrafficData } from '../home-page.types';
import { DashboardTileComponent } from "../dashboard-tile/dashboard-tile.component";

@Component({
  selector: 'app-traffic-chart',
  standalone: true,
  imports: [DashboardTileComponent],
  templateUrl: './traffic-chart.component.html',
  styleUrl: './traffic-chart.component.css'
})
export class TrafficChartComponent implements OnInit {
  trafficData = input.required<TrafficData>();
  maxTraffic!: number;

  ngOnInit(): void {
    this.maxTraffic = Math.max(...this.trafficData().map((data) => data.value));
  }
}
