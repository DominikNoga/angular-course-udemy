import { Component, effect, OnDestroy, OnInit, signal } from '@angular/core';
import { SERVER_STATUS } from '../home-page.constants';
import { DashboardTileComponent } from "../dashboard-tile/dashboard-tile.component";

type ServerStatus = 'online' | 'offline' | 'unknown';

@Component({
  selector: 'app-server-status',
  standalone: true,
  imports: [DashboardTileComponent],
  templateUrl: './server-status.component.html',
  styleUrl: './server-status.component.css'
})
export class ServerStatusComponent implements OnInit, OnDestroy {
  readonly SEED = 1000;
  currentStatus = signal<ServerStatus>(SERVER_STATUS.ONLINE);
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

  constructor() {
    effect((onCleanup) => {
      console.log(`status has changed to: ${this.currentStatus()}`);
      onCleanup(() => {
        // Do some cleanup
      })
    })
  }

  ngOnInit(): void {
    this.interval = setInterval(() => {
      const random = Math.floor(Math.random() * 1_000_0);
      if (this.currentStatus() !== SERVER_STATUS.ONLINE) this.currentStatus.set(SERVER_STATUS.ONLINE);
      if (random % this.SEED === 0) this.currentStatus.set(SERVER_STATUS.OFFLINE);
      if (random % this.SEED * 5 === 0) this.currentStatus.set(SERVER_STATUS.UNKNOWN);
    }, 1000);
  }

  ngOnDestroy(): void {
    // it will remove timeout when the component is removed from DOM
    clearInterval(this.interval);
  }

  getCurrentConfig = () => this.serverStatusConfig[this.currentStatus()];

  getCurrentClass = () => `status-${this.currentStatus()}`;
}
