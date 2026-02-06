import {Component, effect, input, OnInit, output, signal, WritableSignal} from '@angular/core';
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
export class TimeManagerPanelComponent implements OnInit {
  label = input.required();
  baseTime = input.required<number>();
  reviseTime = input.required<boolean>();
  isImproRunning = input.required<boolean>();
  delay = input.required<number>();

  resetTime = output();
  startTime = output();
  stopTime = output();
  adjustTIme = output<number>();

  shouldGlow: WritableSignal<boolean> = signal(false);

  running = signal(false);


  time = 180; // en secondes

  private _timerInterval: any;
  private _glowTimeout: any;
  private _wasImproRunning = false;

  constructor() {
    effect(() => {
      const isRunning = this.isImproRunning();
      const justStarted = isRunning && !this._wasImproRunning;
      this._wasImproRunning = isRunning;

      if (!isRunning || this.reviseTime()) {
        this.time = this.baseTime();
        this.stopTimer();
      } else if (justStarted) {
        this.time = this.baseTime();
      }
    });

    effect(() => {
      if (this.isImproRunning() && !this.running()) {
        this._glowTimeout = setTimeout(() => {
          this.shouldGlow.set(true)
        }, this.delay());
      } else {
        clearTimeout(this._glowTimeout);
        this.shouldGlow.set(false)
      }
    });
  }

  ngOnInit() {
    this._timerInterval = setInterval(() => {
      if (this.running()) {
        if (this.time > 0) {
          this.time--;
        } else {
          this.stopTimer(); // ✅ met en pause automatiquement
        }
      }
    }, 1000);
  }

  startTimer(){
    this.running.set(true);
    this.startTime.emit();
  }

  stopTimer() {
    this.running.set(false);
    this.stopTime.emit();
  }

  adjustTime(amount: number) {
    this.time = Math.max(0, this.time + amount);
    this.adjustTIme.emit(amount);
  }

  resetTimer() {
    this.running.set(false)
    this.time = this.baseTime();
    this.resetTime.emit();
  }
}
