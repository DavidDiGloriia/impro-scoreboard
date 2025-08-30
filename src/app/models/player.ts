import {PlayerDto} from "../dtos";

export class Player {
  constructor(private _dto: PlayerDto = {}) {
  }

  get code(): string {
    return this._dto.code;
  }

  get number(): number {
    return this._dto.number;
  }

  set code(value: string) {
    this._dto.code = value;
  }

  set number(value: number) {
    this._dto.number = value;
  }

  get displayed(): boolean {
    return this._dto.displayed;
  }

  set displayed(value: boolean) {
    this._dto.displayed = value;
  }

  withIsDisplayed(displayed: boolean): Player {
    this.displayed = displayed;
    return this;
  }

  toDto(): PlayerDto {
    return this._dto;
  }
}
