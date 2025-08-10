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

  get teamB(): Team {
    return this._teamB;
  }
}
