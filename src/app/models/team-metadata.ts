import {TeamMetadataDto} from "../dtos";

export class TeamMetadata {
  constructor(private _dto: TeamMetadataDto = {}) {
    this._dto = _dto ? _dto : {};
  }


  get name(): string {
    return this._dto.nom;
  }

  get img(): string {
    return this._dto.img;
  }

  get color(): string {
    return this._dto.couleur;
  }

  get jerseys(): number[] {
    return this._dto.vareuses || [];
  }

  get group(): string {
    return this._dto.groupe;
  }

  get icon(): string {
    return this._dto.icone;
  }

}
