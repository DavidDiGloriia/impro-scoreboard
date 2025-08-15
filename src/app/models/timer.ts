import {TimerDto} from "../dtos";
import {TimerAction} from "@enums/timer-action.enum";

export class Timer {
  constructor(private _dto: TimerDto = {}) {
    this._dto = _dto ? _dto : {};
  }

  get time(): number {
    return this._dto.time || 180; // default to 3 minutes
  }

  set time(value: number) {
    this._dto.time = value;
  }

  withTime(time: number): Timer {
    this.time = time;
    return this;
  }

  get action(): string | undefined {
    return this._dto.action;
  }

  set action(value: TimerAction | undefined) {
    this._dto.action = value;
  }

  withAction(action: TimerAction | undefined): Timer {
    this.action = action;
    return this;
  }

  get delta(): number | undefined {
    return this._dto.delta;
  }

  set delta(value: number | undefined) {
    this._dto.delta = value;
  }

  withDelta(delta: number | undefined): Timer {
    this.delta = delta;
    return this;
  }

  toDto(): TimerDto {
    return this._dto;
  }

  clone(): Timer {
    return new Timer(this.toDto());
  }

}
