import {TimerHandlingDto} from "../dtos";
import {TimerAction} from "@enums/timer-action.enum";
import { v4 as uuidv4 } from 'uuid';

export class TimerHandling {
  private _sequence: string;

  constructor(private _dto: TimerHandlingDto = {}) {
    this.sequence = uuidv4(); // Fix de la flemme pour trigger le localforage change
    this._dto = _dto ? _dto : {};
  }

  get sequence(): string {
    return this._dto.sequence || this._sequence;
  }

  set sequence(value: string) {
    this._dto.sequence = value;
  }

  withSequence(sequence: string): TimerHandling {
    this.sequence = sequence;
    return this;
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
    return new TimerHandling({
      ...this.toDto(),
    });
  }

}
