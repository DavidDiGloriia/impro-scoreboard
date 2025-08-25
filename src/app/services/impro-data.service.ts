import {Injectable, ResourceRef} from "@angular/core";
import {LocalStorageService} from "@services/storage.service";
import {HttpClient} from "@angular/common/http";
import {GameDataDto, ImproDataDto, PlayerMetadataDto, TeamMetadataDto, TimerHandlingDto} from "../dtos";
import {PlayerMetadata} from "@models/player-metadata";
import {map} from "rxjs/operators";
import {mapValues} from "lodash-es";
import {Observable, of} from "rxjs";
import {TeamMetadata} from "@models/team-metadata";
import {GameData} from "@models/game-data";
import {StorageKey} from "@enums/storage-key.enum";
import {rxResource} from "@angular/core/rxjs-interop";
import {DisplayedScreen} from "@enums/displayed-screen.enum";
import {ImproData} from "@models/impro-data";
import {TimerHandling} from "@models/timer-handling";
import {TimerAction} from "@enums/timer-action.enum";
import {VideoHandling} from "@models/video-handling";
import {VideoHandlingDto} from "../dtos/video-handling-dto";

@Injectable({
  providedIn: 'root'
})
export class ImproDataService {
  constructor(private _storageService: LocalStorageService,
              private _httpClient: HttpClient
  ) {

    window.addEventListener('storage', (event: StorageEvent) => {
      if (event.storageArea !== localStorage || !event.key) return;

      switch (event.key) {
        case StorageKey.GAME_DATA.toString(): {
          const dto = JSON.parse(event.newValue || '{}') as GameDataDto;
          this.gameData.set(new GameData(dto));
          break;
        }
        case StorageKey.DISPLAYED_SCREEN.toString(): {
          const screen = JSON.parse(event.newValue || 'null') as DisplayedScreen;
          this.displayedScreen.set(screen);
          break;
        }
        case StorageKey.IMPRO_DATA.toString(): {
          const improDataDto = JSON.parse(event.newValue || '{}') as ImproDataDto;
          this.improData.set(new ImproData(improDataDto));
          break;
        }
        case StorageKey.ROUND_TIMER.toString(): {
          const timerDto = JSON.parse(event.newValue || '{}') as TimerHandlingDto;
          this.roundTimerHandling.set(new TimerHandling(timerDto));
          break;
        }
        case StorageKey.IMPRO_TIMER.toString(): {
          const timerDto = JSON.parse(event.newValue || '{}') as TimerHandlingDto;
          this.improTimerHandling.set(new TimerHandling(timerDto));
          break;
        }
        case StorageKey.WATCHED_VIDEO.toString(): {
          const videoDto = JSON.parse(event.newValue || '{}') as VideoHandlingDto;
          this.videoHandling.set(new VideoHandling(videoDto));
          break;
        }
        case StorageKey.ANTHEM.toString(): {
          const line = JSON.parse(event.newValue || '') as string;
          this.anthemLine.set(line);
          break;
        }
      }
    });

  }

  public players: ResourceRef<PlayerMetadata[]> = rxResource({
    loader: () => this.getPlayers(),
    defaultValue: []
  });

  public teams: ResourceRef<Record<string, TeamMetadata>> = rxResource({
    loader: () => this.getTeams(),
    defaultValue: {}
  });

  public gameData: ResourceRef<GameData> = rxResource({
    loader: () => this.getGameData(),
    defaultValue: new GameData({})
  });

  public improData: ResourceRef<ImproData> = rxResource({
    loader: () => this.getImproData(),
    defaultValue: ImproData.newInstance()
  });

  public anthemLine: ResourceRef<string> = rxResource({
    loader: () => this.getAnthemLine(),
    defaultValue: ''
  });

  public roundTimerHandling: ResourceRef<TimerHandling> = rxResource({
    loader: () => this.getRoundTimer(),
    defaultValue: new TimerHandling({
      action: TimerAction.STOP
    }) // Default to 180 seconds
  });

  public videoHandling: ResourceRef<VideoHandling> = rxResource({
    loader: () => this.getVideoWatched(),
    defaultValue: new VideoHandling({})
  });

  public improTimerHandling: ResourceRef<TimerHandling> = rxResource({
    loader: () => this.getImproTimer(),
    defaultValue: new TimerHandling({
      action: TimerAction.STOP
    })
  });

  public displayedScreen: ResourceRef<DisplayedScreen> = rxResource({
    loader: () => this.getDisplayedScreen(),
    defaultValue: DisplayedScreen.MATCH
  });

  getTeams(): Observable<Record<string, TeamMetadata>> {
    return this._httpClient.get<Record<string, TeamMetadataDto>>('assets/data/equipes.json').pipe(
      map(dtoRecord =>
        mapValues(dtoRecord, (playerMetadataDto, code: string) => new TeamMetadata(playerMetadataDto, code))
      )
    );
  }

  getGameData(): Observable<GameData> {
    return of(this._storageService.read<GameDataDto>(StorageKey.GAME_DATA)).pipe(
      map((dto) => {
        return new GameData(dto)
      })
    );
  }


  getImproData(): Observable<ImproData> {
    return of(this._storageService.read<ImproDataDto>(StorageKey.IMPRO_DATA)).pipe(
      map((dto) => {
        return new ImproData(dto)
      })
    );
  }


  getDisplayedScreen(): Observable<DisplayedScreen> {
    return of(this._storageService.read<DisplayedScreen>(StorageKey.DISPLAYED_SCREEN));
  }

  getPlayers(): Observable<PlayerMetadata[]> {
    return this._httpClient.get<PlayerMetadataDto[]>('assets/data/joueurs.json').pipe(
      map(dtoArray => dtoArray.map(dto => new PlayerMetadata(dto)))
    );
  }

  clearGameData() {
    this._storageService.clear(StorageKey.GAME_DATA);
    this.gameData.set(new GameData({}));
  }

  saveGameData(gameData: GameData): Observable<GameData> {
    return of(this._storageService.save<GameDataDto>(StorageKey.GAME_DATA, gameData.toDto()))
      .pipe(
        map((dto) => new GameData(dto))
      );
  }

  saveImproData(improData: ImproData): Observable<ImproData> {
    return of(this._storageService.save<ImproDataDto>(StorageKey.IMPRO_DATA, improData.toDto()))
      .pipe(
        map((dto) => new ImproData(dto))
      );
  }

  saveDisplayedScreen(screen: DisplayedScreen): Observable<DisplayedScreen> {
    return of(this._storageService.save<DisplayedScreen>(StorageKey.DISPLAYED_SCREEN, screen))
      .pipe(
        map((dto) => dto)
      );
  }

  getRoundTimer(): Observable<TimerHandling> {
    return of(this._storageService.read<TimerHandlingDto>(StorageKey.ROUND_TIMER))
      .pipe(
        map((dto: TimerHandlingDto) => new TimerHandling(dto))
      );
  }

  getVideoWatched(): Observable<VideoHandling> {
    return of(this._storageService.read<VideoHandlingDto>(StorageKey.WATCHED_VIDEO))
      .pipe(
        map((dto: VideoHandlingDto) => new VideoHandling(dto))
      );
  }

  saveVideoWatched(video: VideoHandling): Observable<VideoHandling> {
    return of(this._storageService.save<VideoHandlingDto>(StorageKey.WATCHED_VIDEO, video.toDto()))
      .pipe(
        map((dto) => new VideoHandling(dto))
      );
  }

  saveRoundTimer(timer: TimerHandling): Observable<TimerHandling> {
    return of(this._storageService.save<TimerHandlingDto>(StorageKey.ROUND_TIMER, timer.toDto()))
      .pipe(
        map((dto) => new TimerHandling(dto))
      );
  }

  getAnthemLine(): Observable<string> {
    return of(this._storageService.read<string>(StorageKey.ANTHEM) || '');
  }

  saveAnthemLine(line: string): Observable<string> {
    return of(this._storageService.save<string>(StorageKey.ANTHEM, line))
  }

  getImproTimer(): Observable<TimerHandling> {
  return of(this._storageService.read<TimerHandlingDto>(StorageKey.IMPRO_TIMER))
    .pipe(
      map((dto: TimerHandlingDto) => new TimerHandling(dto))
    );
  }

  saveImproTimer(timer: TimerHandling): Observable<TimerHandling> {
    return of(this._storageService.save<TimerHandlingDto>(StorageKey.IMPRO_TIMER, timer.toDto()))
      .pipe(
        map((dto) => new TimerHandling(dto))
      );
  }


}
