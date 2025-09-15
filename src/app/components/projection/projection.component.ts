import {Component, effect, OnDestroy, OnInit, ResourceRef, signal, WritableSignal} from '@angular/core';
import {RouterOutlet} from "@angular/router";
import {DisplayedScreen} from "@enums/displayed-screen.enum";
import {ImproDataService} from "@services/impro-data.service";
import {ScoreboardComponent} from "@components/projection/scoreboard/scoreboard.component";
import {TeamPresentationComponent} from "@components/projection/team-presentation/team-presentation.component";
import {ScreenSaverComponent} from "@components/projection/screen-saver/screen-saver.component";
import {TimerHandling} from "@models/timer-handling";
import {TimerAction} from "@enums/timer-action.enum";
import {MediaWatcherComponent} from "@components/projection/media-watcher/media-watcher.component";
import {AnthemComponent} from "@components/projection/anthem/anthem.component";
import {PubsWatcherComponent} from "@components/projection/pubs-watcher/pubs-watcher.component";
import {
  BothTeamsPresentationComponent
} from "@components/projection/both-teams-presentation/both-teams-presentation.component";

@Component({
  selector: 'app-projection',
  imports: [
    ScoreboardComponent,
    TeamPresentationComponent,
    RouterOutlet,
    ScreenSaverComponent,
    MediaWatcherComponent,
    AnthemComponent,
    PubsWatcherComponent,
    BothTeamsPresentationComponent
  ],
  templateUrl: './projection.component.html',
  styleUrl: './projection.component.scss',
})
export class ProjectionComponent implements OnInit, OnDestroy {
  readonly DisplayedScreen = DisplayedScreen;
  displayedScreen: ResourceRef<DisplayedScreen> = this._improDataService.displayedScreen;
  gameData = this._improDataService.gameData;
  improData = this._improDataService.improData;

  constructor(private _improDataService: ImproDataService) {
    effect(() => {
      this.improTimer.set(this._improDataService.improData.value().duration);
    });

    effect(() => {
      this.onRoundTimerAction(this.roundTimerHandling.value())
    });

    effect(() => {
      this.onImproTimerAction(this.improTimerHandling.value())
    });

    window.addEventListener('beforeunload', () => {
      this.ngOnDestroy();
    });
  }

  roundTimerHandling = this._improDataService.roundTimerHandling;
  isRoundTimerRunning: WritableSignal<boolean> = signal<boolean>(false);
  roundTimer: WritableSignal<number> = signal(2700); // 45 minutes in seconds
  roundTimerInterval: any;

  improTimerHandling = this._improDataService.improTimerHandling;
  isImproTimerRunning: WritableSignal<boolean> = signal<boolean>(false);
  improTimer: WritableSignal<number> = signal(180);
  improTimerInterval: any;

  ngOnInit() {
    this.roundTimerInterval = setInterval(() => {
      if (this.isRoundTimerRunning()) {
        this.roundTimer.update(time => (time > 0 ? time - 1 : 0));
      }
    }, 1000);

    this.improTimerInterval = setInterval(() => {
      if (this.isImproTimerRunning()) {
        this.improTimer.update(time => (time > 0 ? time - 1 : 0));
      }
    }, 1000);
  }

  ngOnDestroy() {
    clearInterval(this.roundTimerInterval);
    clearInterval(this.improTimerInterval);
    this._improDataService.saveImproTimer(new TimerHandling().withAction(TimerAction.STOP))
    this._improDataService.saveRoundTimer(new TimerHandling().withAction(TimerAction.STOP))
  }

  onRoundTimerAction(timer: TimerHandling) {
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
        this.isImproTimerRunning.set(false);
        this.improTimer.set(this.improData.value().duration)
      }
        break;
      case TimerAction.ADJUST:
        this.improTimer.update((value) => {
          return Math.max(0, value + timer.delta);
        });
        break;
    }
  }

}
