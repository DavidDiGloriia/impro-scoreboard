import { v4 as uuidv4 } from "uuid";
import {PubHandlingDto} from "../dtos/pub-handling.dto";
import {PubMedia} from "@models/pub-media";
import {map} from 'lodash-es';
import {PubMediaDto} from "../dtos/pub-media.dto";
import {PubAction} from "@enums/pub-action.enum";

export class PubHandling {
  private _sequence: string;
  private _pubs?: PubMedia[];

  constructor(private _dto: PubHandlingDto = {}) {
    this._sequence = uuidv4();
    this._pubs = map(this._dto.pubs, (dto: PubMediaDto) => {
      return new PubMedia(dto);
    });

    if (!this._dto.sequence) {
      this._dto.sequence = this._sequence;
    }
  }

  // Sequence
  get sequence(): string {
    return this._dto.sequence || this._sequence;
  }

  set sequence(value: string) {
    this._dto.sequence = value;
  }

  withSequence(sequence: string): PubHandling {
    this.sequence = sequence;
    return this;
  }

  // Action
  get action(): PubAction | undefined {
    return this._dto.action;
  }

  set action(value: PubAction | undefined) {
    this._dto.action = value;
  }

  withAction(action: PubAction | undefined): PubHandling {
    this.action = action;
    return this;
  }

  get pubs(): PubMedia[] {
    return this._pubs || [];
  }

  set pubs(pubs: PubMedia[]) {
    this._pubs = pubs;
    this._dto.pubs = map(pubs, (pub) => pub.toDto());
  }

  withPubs(pubs: PubMedia[]): PubHandling {
    this.pubs = pubs;
    return this;
  }

  // DTO
  toDto(): PubHandlingDto {
    return { ...this._dto };
  }

  clone(): PubHandling {
    return new PubHandling({ ...this.toDto() });
  }
}
