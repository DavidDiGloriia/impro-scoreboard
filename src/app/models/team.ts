import { TeamDto } from "../dtos";
import { Player } from "@models/player";
import { mapValues } from "lodash-es";

export class Team {
  private _players: { [role: string]: Player } = {};

  constructor(private _dto: TeamDto = {}) {
    this._players = this._dto.players
      ? mapValues(this._dto.players, (playerDto) => new Player(playerDto))
      : {};
  }

  get name(): string {
    return this._dto.name;
  }

  set name(value: string) {
    this._dto.name = value;
  }

  get coach(): string {
    return this._dto.coach;
  }

  set coach(value: string) {
    this._dto.coach = value;
  }

  get players(): { [role: string]: Player } {
    return this._players;
  }

  set players(value: { [role: string]: Player }) {
    this._players = value;
    this._dto.players = mapValues(value, (player) => player.toDto());
  }

  get score(): number {
    return this._dto.score;
  }

  set score(value: number) {
    this._dto.score = value;
  }

  get fouls(): number {
    return this._dto.fouls;
  }

  set fouls(value: number) {
    this._dto.fouls = value;
  }

  toDto(): TeamDto {
    return {
      name: this._dto.name,
      coach: this._dto.coach,
      players: mapValues(this._players, (player: Player) => player.toDto()),
    };
  }
}
