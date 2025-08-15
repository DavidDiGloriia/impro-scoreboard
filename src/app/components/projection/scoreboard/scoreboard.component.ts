import {Component, effect, input, InputSignal, OnInit, signal, WritableSignal} from '@angular/core';
import {ScoreboardTeamComponent} from "./scoreboard-team/scoreboard-team.component";
import {TeamNumber} from "@enums/team-number.enum";
import {GameData} from "@models/game-data";
import {ImproData} from "@models/impro-data";
import {FormatImproHeaderPipe} from "@pipes/format-impro-header.pipe";
import {TitleCasePipe} from "@angular/common";
import {ImproDataService} from "@services/impro-data.service";
import {TimerHandling} from "@models/timerHandling";
import {TimerAction} from "@enums/timer-action.enum";
import {FormatTimePipe} from "@pipes/format-time.pipe";

@Component({
  selector: 'app-scoreboard',
  imports: [
    ScoreboardTeamComponent,
    FormatImproHeaderPipe,
    TitleCasePipe,
    FormatTimePipe
  ],
  templateUrl: './scoreboard.component.html',
  styleUrl: './scoreboard.component.scss'
})
export class ScoreboardComponent implements OnInit {
  readonly Team = TeamNumber;

  gameData: InputSignal<GameData> = input.required();
  improData: InputSignal<ImproData> = input.required();

  improTimerHandling = this._improDataService.improTimerHandling;
  roundTimerHandling = this._improDataService.roundTimerHandling;

  isRoundTimerRunning: WritableSignal<boolean> = signal<boolean>(false);
  isImproTimerRunning: WritableSignal<boolean> = signal<boolean>(false);

  roundTimer: WritableSignal<number> = signal(2700); // 45 minutes in seconds
  improTimer: WritableSignal<number> = signal(180);


  roundTimerInterval: any;



  constructor(private _improDataService: ImproDataService) {
    effect(() => {
      this.onRoundTimerAction(this.roundTimerHandling.value())
    });

    effect(() => {
      this.onImproTimerAction(this.improTimerHandling.value())
    });
  }

  ngOnInit() {
    this.roundTimerInterval = setInterval(() => {
      if (this.isRoundTimerRunning()) {
        this.roundTimer.update(time => (time > 0 ? time - 1 : 0));
      }
    }, 1000);
  }

  onRoundTimerAction(timer: TimerHandling) {
    console.log(timer);
    switch (timer.action) {
      case TimerAction.START:
        this.isRoundTimerRunning.set(true);
        break;
      case TimerAction.STOP:
        this.isRoundTimerRunning.set(false);
        break;
      case TimerAction.RESET: {
        this.isRoundTimerRunning.set(false);
        this.roundTimer.set(2700)
      }
        break;
      case TimerAction.ADJUST:
        this.isRoundTimerRunning.set(true);
        this.roundTimer.update((value) => {
          return Math.max(0, value + timer.delta);
        });
        break;
    }
  }

  onImproTimerAction(timer: TimerHandling) {
    switch (timer.action) {
      case TimerAction.START:
        this.isImproTimerRunning.set(true);
        break;
      case TimerAction.STOP:
        this.isImproTimerRunning.set(false);
        break;
      case TimerAction.RESET: {
        this.roundTimer.set(2700);
        this.isImproTimerRunning.set(false);
      }
        break;
      case TimerAction.ADJUST:
        this.isImproTimerRunning.set(true);
        break;
    }
  }


}
