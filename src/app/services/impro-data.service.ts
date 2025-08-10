import { Injectable } from "@angular/core";
import { LocalStorageService } from "@services/storage.service";
import { HttpClient } from "@angular/common/http";
import {GameDataDto, PlayerMetadataDto, TeamMetadataDto} from "../dtos";
import { PlayerMetadata } from "@models/player-metadata";
import { map } from "rxjs/operators";
import { mapValues } from "lodash-es";
import {Observable, of} from "rxjs";
import {TeamMetadata} from "@models/team-metadata";
import {GameData} from "@models/game-data";
import {StorageKey} from "@enums/storage-key.enum";

@Injectable({
  providedIn: 'root'
})
export class ImproDataService {
  constructor(
    private _storageService: LocalStorageService,
    private _httpClient: HttpClient
  ) {}

  getTeams(): Observable<Record<string, TeamMetadata>> {
    return this._httpClient.get<Record<string, TeamMetadataDto>>('assets/data/equipes.json').pipe(
      map(dtoRecord =>
        mapValues(dtoRecord, (playerMetadataDto) => new TeamMetadata(playerMetadataDto))
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

  getPlayers(): Observable<PlayerMetadata[]> {
    return this._httpClient.get<PlayerMetadataDto[]>('assets/data/joueurs.json').pipe(
      map(dtoArray => dtoArray.map(dto => new PlayerMetadata(dto)))
    );
  }

  saveGameData(gameData: GameData): Observable<GameData> {
    console.log('Saving game data:', gameData.toDto());
    return of(this._storageService.save<GameDataDto>(StorageKey.GAME_DATA, gameData.toDto()))
      .pipe(
        map((dto) => new GameData(dto))
      );
  }
}
