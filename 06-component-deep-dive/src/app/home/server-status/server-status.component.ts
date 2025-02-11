import { Component, OnDestroy, OnInit } from '@angular/core';
import { SERVER_STATUS } from '../home-page.constants';
import { DashboardTileComponent } from "../dashboard-tile/dashboard-tile.component";

type ServerConfigProp = 'online' | 'offline' | 'unknown';

@Component({
  selector: 'app-server-status',
  standalone: true,
  imports: [DashboardTileComponent],
  templateUrl: './server-status.component.html',
  styleUrl: './server-status.component.css'
})
export class ServerStatusComponent implements OnInit, OnDestroy {
  currentStatus: string = SERVER_STATUS.ONLINE;
  private interval?: ReturnType<typeof setInterval>; // it is type of what will be returned by setInterval
  serverStatusConfig = {
    online: {
      p1: 'Servers are online',
      p2: 'All systems are operational.'
    },
    offline: {
      p1: 'Servers are offline',
      p2: 'Functionality should be restored soon.'
    },
    unknown: {
      p1: 'Server status is unknown',
      p2: 'Fetching server status failed.'
    }
  };

  ngOnInit(): void {
    this.interval = setInterval(() => {
      const random = Math.floor(Math.random() * 1_000_000);
      if (this.currentStatus !== SERVER_STATUS.ONLINE) this.currentStatus = SERVER_STATUS.ONLINE;
      if (random % 10 === 0) this.currentStatus = SERVER_STATUS.OFFLINE;
      if (random % 100 === 0) this.currentStatus = 'aaa';
    }, 1000);
  }

  ngOnDestroy(): void {
    // it will remove timeout when the component is removed from DOM
    clearInterval(this.interval);
  }

  getCurrentConfig = () => this.serverStatusConfig[this.getCurrentStatus() as ServerConfigProp];

  getCurrentClass = () => `status-${this.getCurrentStatus()}`;

  getCurrentStatus = (): string => this.isStatusUnknown() ? 'unknown' : this.currentStatus; 

  isStatusUnknown = (): boolean => this.currentStatus !== SERVER_STATUS.OFFLINE && this.currentStatus !== SERVER_STATUS.ONLINE;
}
