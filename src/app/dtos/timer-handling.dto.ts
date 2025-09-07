import {TimerAction} from "@enums/timer-action.enum";

export interface TimerHandlingDto {
  sequence?: string;
  action?: TimerAction;
  time?: number
  delta?: number;

}
