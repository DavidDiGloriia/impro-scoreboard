import { Component } from '@angular/core';
import {NgClass} from "@angular/common";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-time-manager-panel',
  imports: [
    FormsModule
  ],
  templateUrl: './time-manager-panel.component.html',
  styleUrl: './time-manager-panel.component.scss'
})
export class TimeManagerPanelComponent {
  time = 180; // en secondes
  totalDuration = 2700; // mi-temps en secondes
  timerInterval: any;
  running = false;

  formatTime(sec: number): string {
    const minutes = Math.floor(sec / 60).toString().padStart(2, '0');
    const seconds = (sec % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  }

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
