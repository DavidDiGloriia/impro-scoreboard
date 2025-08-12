import { Component } from '@angular/core';
import {NgClass} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {FormatTimePipe} from "@pipes/format-time.pipe";

@Component({
  selector: 'app-time-manager-panel',
  imports: [
    FormsModule,
    FormatTimePipe
  ],
  templateUrl: './time-manager-panel.component.html',
  styleUrl: './time-manager-panel.component.scss'
})
export class TimeManagerPanelComponent {
  time = 180; // en secondes
  totalDuration = 2700; // mi-temps en secondes
  timerInterval: any;
  running = false;

  toggleTimer() {
    if (this.running) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      clearInterval(this.timerInterval);
    } else {
      this.timerInterval = setInterval(() => {
        if (this.time > 0) {
          this.time--;
        } else {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          clearInterval(this.timerInterval);
        }
      }, 1000);
    }
    this.running = !this.running;
  }

  adjustTime(amount: number) {
    this.time = Math.max(0, this.time + amount);
  }
}
