import {PubMediaDto} from "../dtos/pub-media.dto";
import {PlayerDto} from "../dtos";

export class PubMedia {
  constructor(private _dto: PubMediaDto = {}) {
    this._dto = _dto ? _dto : {};
  }

  get path(): string {
    return this._dto.path;
  }

  get duration(): number {
    return this._dto.duration;
  }

  clone(): PubMedia {
    return new PubMedia({...this._dto});
  }

  toDto(): PubMediaDto {
    return this._dto;
  }



}
