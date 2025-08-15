import {Component, effect, input, OnInit, output} from '@angular/core';
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

  resetTime = output();
  startTime = output();
  stopTime = output();
  adjustTIme = output<number>();

  time = 180; // en secondes
  timerInterval: any;
  running = false;

  constructor() {
    effect(() => {
        this.time = this.baseTime();
    });
  }

  ngOnInit() {
    this.timerInterval = setInterval(() => {
      if (this.running) {
        this.time = this.time > 0 ? this.time - 1 : 0;
      }
    }, 1000);
  }

  startTimer(){
    this.running = true;
    this.startTime.emit();
  }

  stopTimer() {
    this.running = false;
    this.stopTime.emit();
  }

  adjustTime(amount: number) {
    this.time = Math.max(0, this.time + amount);
    this.adjustTIme.emit(amount);
  }

  resetTimer() {
    if (!confirm('Voulez-vous vraiment reset le timer ?')) return;
    this.running = false;
    this.time = this.baseTime();
    this.resetTime.emit();
  }
}
