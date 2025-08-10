import { GameDataDto } from "../dtos";
import { Team } from "@models/team";

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

  toDto(): GameDataDto {
    return {
      teamA: this._teamA ? this._teamA.toDto() : undefined,
      teamB: this._teamB ? this._teamB.toDto() : undefined
    };
  }

  clone(): GameData {
    return new GameData(this.toDto());
  }
}
