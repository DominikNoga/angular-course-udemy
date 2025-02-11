import { Component } from '@angular/core';
import { TrafficChartComponent } from '../traffic-chart/traffic-chart.component';
import { ServerStatusComponent } from '../server-status/server-status.component';
import { SupportTicketsComponent } from '../tickets/support-tickets/support-tickets.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [TrafficChartComponent, ServerStatusComponent, SupportTicketsComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  dummyTrafficData = [
    {
      id: 'd1',
      value: 433,
    },
    {
      id: 'd2',
      value: 260,
    },
    {
      id: 'd3',
      value: 290,
    },
    {
      id: 'd4',
      value: 410,
    },
    {
      id: 'd5',
      value: 397,
    },
    {
      id: 'd6',
      value: 488,
    },
    {
      id: 'd47',
      value: 589,
    },
  ];
  currentStatus = 'online';
}
