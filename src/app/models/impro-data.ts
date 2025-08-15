import {ImproDataDto} from "../dtos";
import {ImproType} from "@enums/impro-type.enum";
import {ImproNbPlayers} from "@enums/impro-nb-players.enum";

export class ImproData {
  constructor(private _dto: ImproDataDto = {}) {
    this._dto = _dto ? _dto : ImproData.newInstance();
  }

  static newInstance(): ImproData {
    return new ImproData({
      type: ImproType.MIXTE,
      title: '',
      nbPlayers: ImproNbPlayers.UNLIMITED,
      customNbPlayerLabel: '',
      category: 'Libre',
      duration: 180,
      isImproRunning: false,
      alsoReviseDuration: false,
    });
  }

  get alsoReviseDuration(): boolean {
    return this._dto.alsoReviseDuration || false;
  }

  set alsoReviseDuration(value: boolean) {
    this._dto.alsoReviseDuration = value;
  }

  withAlsoReviseDuration(revise: boolean): ImproData {
    this.alsoReviseDuration = revise;
    return this;
  }

  get isImproRunning(): boolean {
    return this._dto.isImproRunning || false;
  }

  set isImproRunning(value: boolean) {
    this._dto.isImproRunning = value;
  }

  withIsImproRunning(isRunning: boolean): ImproData {
    this.isImproRunning = isRunning;
    return this;
  }

  get type(): ImproType {
    return this._dto.type || ImproType.MIXTE;
  }

  set type(value: ImproType) {
    this._dto.type = value;
  }

  withType(type: ImproType): ImproData {
    this.type = type;
    return this;
  }

  get title(): string {
    return this._dto.title || '';
  }

  set title(value: string) {
    this._dto.title = value;
  }

  withTitle(title: string): ImproData {
    this.title = title;
    return this;
  }

  get nbPlayers(): ImproNbPlayers {
    return this._dto.nbPlayers || ImproNbPlayers.UNLIMITED;
  }

  set nbPlayers(value: ImproNbPlayers) {
    this._dto.nbPlayers = value;
  }

  withNbPlayers(nbPlayers: ImproNbPlayers): ImproData {
    this.nbPlayers = nbPlayers;
    return this;
  }

  get customNbPlayerLabel(): string {
    return this._dto.customNbPlayerLabel || '';
  }

  set customNbPlayerLabel(value: string) {
    this._dto.customNbPlayerLabel = value;
  }

  withCustomNbPlayerLabel(label: string): ImproData {
    this.customNbPlayerLabel = label;
    return this;
  }

  get category(): string {
    return this._dto.category || '';
  }

  set category(value: string) {
    this._dto.category = value;
  }

  withCategory(category: string): ImproData {
    this.category = category;
    return this;
  }

  get duration(): number {
    return this._dto.duration || 180
  }

  set duration(value: number) {
    this._dto.duration = value;
  }

  withDuration(duration: number): ImproData {
    this.duration = duration;
    return this;
  }

  toDto(): ImproDataDto {
    return this._dto;
  }

  clone(): ImproData {
    return new ImproData({
      ...this.toDto()
    });
  }
}
