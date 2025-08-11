import {Injectable, NgZone, ResourceRef} from "@angular/core";
import {LocalStorageService} from "@services/storage.service";
import {HttpClient} from "@angular/common/http";
import {GameDataDto, PlayerMetadataDto, TeamMetadataDto} from "../dtos";
import {PlayerMetadata} from "@models/player-metadata";
import {map} from "rxjs/operators";
import {mapValues} from "lodash-es";
import {Observable, of} from "rxjs";
import {TeamMetadata} from "@models/team-metadata";
import {GameData} from "@models/game-data";
import {StorageKey} from "@enums/storage-key.enum";
import {rxResource} from "@angular/core/rxjs-interop";
import {DisplayedScreen} from "@enums/displayed-screen.enum";

@Injectable({
  providedIn: 'root'
})
export class ImproDataService {
  constructor(private _storageService: LocalStorageService,
              private _httpClient: HttpClient
              ) {

    window.addEventListener('storage', (event: StorageEvent) => {
      if (event.storageArea === localStorage && event.key === StorageKey.GAME_DATA.toString()) {
        const dto = JSON.parse(event.newValue) as GameDataDto;
        this.gameData.set(new GameData(dto))
      } else if (event.storageArea === localStorage && event.key === StorageKey.DISPLAYED_SCREEN.toString()) {
        const screen = JSON.parse(event.newValue) as DisplayedScreen;
        this.displayedScreen.set(screen);
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

  saveDisplayedScreen(screen: DisplayedScreen): Observable<DisplayedScreen> {
    return of(this._storageService.save<DisplayedScreen>(StorageKey.DISPLAYED_SCREEN, screen))
      .pipe(
        map((dto) => dto)
      );
  }
}
