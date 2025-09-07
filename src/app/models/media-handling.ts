import { v4 as uuidv4 } from "uuid";
import { MediaHandlingDto } from "../dtos";
import { MediaAction } from "@enums/video-action.enum";

export class MediaHandling {
  private _sequence: string;

  constructor(private _dto: MediaHandlingDto = {}) {
    this._sequence = uuidv4();
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

  withSequence(sequence: string): MediaHandling {
    this.sequence = sequence;
    return this;
  }

  // Video ID
  get videoId(): string | undefined {
    return this._dto.mediaId;
  }

  set videoId(value: string | undefined) {
    this._dto.mediaId = value;
  }

  withVideoId(videoId: string): MediaHandling {
    this.videoId = videoId;
    return this;
  }

  // Action
  get action(): MediaAction | undefined {
    return this._dto.action;
  }

  set action(value: MediaAction | undefined) {
    this._dto.action = value;
  }

  withAction(action: MediaAction | undefined): MediaHandling {
    this.action = action;
    return this;
  }

  get numberValue(): number | undefined {
    return this._dto.numberValue;
  }

  set numberValue(value: number | undefined) {
    this._dto.numberValue = value;
  }

  withNumberValue(delta: number | undefined): MediaHandling {
    this.numberValue = delta;
    return this;
  }

  // DTO
  toDto(): MediaHandlingDto {
    return { ...this._dto };
  }

  // Clone
  clone(): MediaHandling {
    return new MediaHandling({ ...this.toDto() });
  }
}
