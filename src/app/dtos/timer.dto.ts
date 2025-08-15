import {TimerAction} from "@enums/timer-action.enum";

export interface TimerDto {
  action?: TimerAction;
  time?: number; // in seconds
  delta?: number
}
