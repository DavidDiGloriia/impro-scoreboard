import { v4 as uuidv4 } from "uuid";
import { VideoHandlingDto } from "../dtos/video-handling-dto";
import { VideoAction } from "@enums/video-action.enum"; // à adapter selon ton projet

export class VideoHandling {
  private _sequence: string;

  constructor(private _dto: VideoHandlingDto = {}) {
    this._sequence = uuidv4(); // générer une séquence unique si non fournie
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

  withSequence(sequence: string): VideoHandling {
    this.sequence = sequence;
    return this;
  }

  // Video ID
  get videoId(): string | undefined {
    return this._dto.videoId;
  }

  set videoId(value: string | undefined) {
    this._dto.videoId = value;
  }

  withVideoId(videoId: string): VideoHandling {
    this.videoId = videoId;
    return this;
  }

  // Action
  get action(): VideoAction | undefined {
    return this._dto.action;
  }

  set action(value: VideoAction | undefined) {
    this._dto.action = value;
  }

  withAction(action: VideoAction | undefined): VideoHandling {
    this.action = action;
    return this;
  }

  get numberValue(): number | undefined {
    return this._dto.numberValue;
  }

  set numberValue(value: number | undefined) {
    this._dto.numberValue = value;
  }

  withNumberValue(delta: number | undefined): VideoHandling {
    this.numberValue = delta;
    return this;
  }

  // DTO
  toDto(): VideoHandlingDto {
    return { ...this._dto };
  }

  // Clone
  clone(): VideoHandling {
    return new VideoHandling({ ...this.toDto() });
  }
}
