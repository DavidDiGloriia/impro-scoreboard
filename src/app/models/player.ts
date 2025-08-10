import {PlayerDto} from "../dtos";

export class Player {
  constructor(private _dto: PlayerDto = {}) {
  }

  get name(): string {
    return this._dto.name;
  }

  get number(): string {
    return this._dto.number;
  }

  set name(value: string) {
    this._dto.name = value;
  }

  set number(value: string) {
    this._dto.number = value;
  }

  toDto(): PlayerDto {
    return this._dto;
  }
}
