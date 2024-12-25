import { Component } from '@angular/core';
import { HeaderComponent } from '@core/header/header.component';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  imports: [
    HeaderComponent,
  ],
})
export class HomeComponent {
// TODO: landing page
}
