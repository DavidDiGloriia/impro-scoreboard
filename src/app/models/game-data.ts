import { GameDataDto } from "../dtos";
import { Team } from "@models/team";
import {ProjectionMode} from "@enums/projection-mode.enum";

export class GameData {
  private _teamA: Team;
  private _teamB: Team;

  constructor(private _dto: GameDataDto = {}) {
    this._dto = _dto ? _dto : {};
    this._teamA = new Team(this._dto.teamA);
    this._teamB = new Team(this._dto.teamB);
  }

  get teamA(): Team {
    return this._teamA;
  }

  set teamA(value: Team) {
    this._teamA = value;
    this._dto.teamA = value.toDto();
  }

  withTeamA(team: Team): GameData {
    this.teamA = team;
    return this;
  }

  get teamB(): Team {
    return this._teamB;
  }

  set teamB(value: Team) {
    this._teamB = value;
    this._dto.teamB = value.toDto();
  }

  withTeamB(team: Team): GameData {
    this.teamB = team;
    return this;
  }

  get projectionMode(): ProjectionMode {
    return this._dto.projectionMode || ProjectionMode.NORMAL;
  }

  set projectionMode(value: ProjectionMode) {
    this._dto.projectionMode = value;
  }

  withProjectionMode(mode: ProjectionMode): GameData {
    this.projectionMode = mode;
    return this;
  }

  toDto(): GameDataDto {
    return {
      teamA: this._teamA ? this._teamA.toDto() : undefined,
      teamB: this._teamB ? this._teamB.toDto() : undefined,
      projectionMode: this._dto.projectionMode,
    };
  }

  clone(): GameData {
    return new GameData({
      ...this.toDto(),
    });
  }
}
