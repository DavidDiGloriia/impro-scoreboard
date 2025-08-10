import {PlayerDto} from "../dtos";

export class Player {
  constructor(private _dto: PlayerDto = {}) {
  }

  get name(): string {
    return this._dto.name;
  }

  get number(): number {
    return this._dto.number;
  }

  set name(value: string) {
    this._dto.name = value;
  }

  set number(value: number) {
    this._dto.number = value;
  }

  toDto(): PlayerDto {
    return this._dto;
  }
}
