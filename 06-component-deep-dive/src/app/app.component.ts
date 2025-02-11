import { Component } from '@angular/core';
import { HeaderComponent } from './shared/header/header.component';
import { HomePageComponent } from './home/home-page/home-page.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  imports: [HeaderComponent, HomePageComponent]
})
export class AppComponent {
  
}
