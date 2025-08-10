import {PlayerDto} from "./player.dto";

export interface TeamDto {
  name?: string;
  coach?: string;
  players?: {[role: string]: PlayerDto},
  score?: number;
  fouls?: number;
}
