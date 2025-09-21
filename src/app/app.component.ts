import { Component } from '@angular/core';
import { ElectronService } from './services';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: true,
    imports: [RouterOutlet]
})
export class AppComponent {
  constructor(
    private electronService: ElectronService,
  ) {
  }
}
