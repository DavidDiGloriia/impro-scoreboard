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

  toDto(): PlayerDto {
    return this._dto;
  }
}
