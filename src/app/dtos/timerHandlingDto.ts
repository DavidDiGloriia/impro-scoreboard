import {TimerAction} from "@enums/timer-action.enum";

export interface TimerHandlingDto {
  action?: TimerAction;
  time?: number
  delta?: number;

}
