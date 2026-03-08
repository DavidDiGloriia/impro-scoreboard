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

  get alias(): string {
    return this._dto.alias;
  }

  /** For projection: alias if exists, otherwise firstName */
  get displayName(): string {
    return this._dto.alias || this._dto.prenom || '';
  }

  /** For social media: alias if exists, otherwise prénom */
  get socialName(): string {
    return this._dto.alias || this._dto.prenom || '';
  }

  get img(): string {
    return this._dto.img;
  }

  get isFemale(): boolean {
    return this._dto.femme || false;
  }

  /** Smart label for dropdowns: alias, or firstName if unique, or firstName + nom if duplicate */
  static smartLabels(players: PlayerMetadata[]): Map<string, string> {
    const firstNameCounts = new Map<string, number>();
    for (const p of players) {
      const fn = p.alias || p.firstName;
      firstNameCounts.set(fn, (firstNameCounts.get(fn) || 0) + 1);
    }
    const labels = new Map<string, string>();
    for (const p of players) {
      const display = p.alias || p.firstName;
      if ((firstNameCounts.get(display) || 0) > 1) {
        labels.set(p.code, `${p.firstName} ${p.name}`);
      } else {
        labels.set(p.code, display);
      }
    }
    return labels;
  }
}
