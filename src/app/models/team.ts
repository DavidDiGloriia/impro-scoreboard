import {Player} from "@models/player";

export interface Team {
  name: string;
  coach: string;
  players: {[role: string]: Player},
  score: number;
  fouls: number;
}
