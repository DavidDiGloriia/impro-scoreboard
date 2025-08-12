import {PlayerMetadataDto} from "../dtos";

export class PlayerMetadata {
  constructor(private _dto: PlayerMetadataDto = {}) {
    this._dto = _dto ? _dto : {};
  }

  get code(): string {
    return this.firstName + (this.name ?? '');
  }

  get firstName(): string {
    return this._dto.prenom;
  }

  get name(): string {
    return this._dto.nom;
  }

  get img(): string {
    return this._dto.img;
  }

  get isFemale(): boolean {
    return this._dto.femme || false;
  }
}
