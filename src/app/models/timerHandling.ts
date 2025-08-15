import {TimerHandlingDto} from "../dtos";
import {TimerAction} from "@enums/timer-action.enum";

export class TimerHandling {
  constructor(private _dto: TimerHandlingDto = {}) {
    this._dto = _dto ? _dto : {};
  }

  get time(): number {
    return this._dto.time;
  }

  set time(value: number) {
    this._dto.time = value;
  }

  withTime(time: number): TimerHandling {
    this.time = time;
    return this;
  }

  get action(): TimerAction {
    return this._dto.action;
  }

  set action(value: TimerAction | undefined) {
    this._dto.action = value;
  }

  withAction(action: TimerAction | undefined): TimerHandling {
    this.action = action;
    return this;
  }

  get delta(): number | undefined {
    return this._dto.delta;
  }

  set delta(value: number | undefined) {
    this._dto.delta = value;
  }

  withDelta(delta: number | undefined): TimerHandling {
    this.delta = delta;
    return this;
  }

  toDto(): TimerHandlingDto {
    return this._dto;
  }

  clone(): TimerHandling {
    return new TimerHandling(this.toDto());
  }

}
