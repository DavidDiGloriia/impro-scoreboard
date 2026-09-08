import {StarPlayerDto} from "../dtos/star-player.dto";
import {TeamNumber} from "@enums/team-number.enum";

export class StarPlayer {
  constructor(private _dto: StarPlayerDto = {}) {
    this._dto = _dto ? _dto : {};
  }

  static none(): StarPlayer {
    return new StarPlayer({team: null, role: null});
  }

  static of(team: TeamNumber, role: string): StarPlayer {
    return new StarPlayer({team, role});
  }

  get team(): TeamNumber | null {
    return this._dto.team ?? null;
  }

  get role(): string | null {
    return this._dto.role ?? null;
  }

  get isSet(): boolean {
    return !!this.team && !!this.role;
  }

  is(team: TeamNumber, role: string): boolean {
    return this.team === team && this.role === role;
  }

  toDto(): StarPlayerDto {
    // Les null sont explicites : le storage fusionne les objets, un undefined ne désélectionnerait pas.
    return {team: this.team, role: this.role};
  }
}
