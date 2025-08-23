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

  resetTime = output();
  startTime = output();
  stopTime = output();
  adjustTIme = output<number>();

  shouldGlow: WritableSignal<boolean> = signal(false);
  firstResetTimerClick: WritableSignal<boolean> = signal(false);

  running = signal(false);


  time = 180; // en secondes

  private _timerInterval: any;
  private _resetClickTimeout: any;
  private _glowTimeout: any;

  constructor() {
    effect(() => {
      if (this.reviseTime()) {
        this.time = this.baseTime();
        this.stopTimer();
      }
    });

    effect(() => {
      if (this.isImproRunning() && !this.running()) {
        this._glowTimeout = setTimeout(() => {
          this.shouldGlow.set(true)
        }, 30000);
      } else {
        clearTimeout(this._glowTimeout);
        this.shouldGlow.set(false)
      }
    });
  }

  ngOnInit() {
    this._timerInterval = setInterval(() => {
      if (this.running()) {
        this.time = this.time > 0 ? this.time - 1 : 0;
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

  onResetTimerClick() {
    if (!this.firstResetTimerClick()) {
      // Premier clic : ajouter la classe btn-aura
      this.firstResetTimerClick.set(true);
      this._resetClickTimeout = setTimeout(() => {
        // Si l'utilisateur n'a pas cliqué une 2e fois dans les 3 secondes
        this.firstResetTimerClick.set(false);
      }, 3000);
    } else {
      // Deuxième clic dans les 3 secondes : resetTimer
      clearTimeout(this._resetClickTimeout);
      this.firstResetTimerClick.set(false);
      this.resetTimer();
    }
  }

  resetTimer() {
    this.running.set(false)
    this.time = this.baseTime();
    this.firstResetTimerClick.set(false);
    this.resetTime.emit();
  }
}
