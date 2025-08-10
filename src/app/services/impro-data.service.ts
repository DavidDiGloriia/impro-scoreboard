import { Injectable } from "@angular/core";
import { LocalStorageService } from "@services/storage.service";
import { HttpClient } from "@angular/common/http";
import {PlayerMetadataDto, TeamMetadataDto} from "../dtos";
import { PlayerMetadata } from "@models/player-metadata";
import { map } from "rxjs/operators";
import { mapValues } from "lodash-es";
import { Observable } from "rxjs";
import {TeamMetadata} from "@models/team-metadata";
import {GameData} from "@models/game-data";

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
    return this._httpClient.get<GameData>('assets/data/game-data.json').pipe(
      map(dto => new GameData(dto))
    );
  }

  getPlayers(): Observable<PlayerMetadata[]> {
    return this._httpClient.get<PlayerMetadataDto[]>('assets/data/joueurs.json').pipe(
      map(dtoArray => dtoArray.map(dto => new PlayerMetadata(dto)))
    );
  }
}
