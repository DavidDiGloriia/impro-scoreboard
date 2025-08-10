import {PlayerDto} from "./player.dto";

export interface TeamDto {
  name?: string;
  players?: {[role: string]: PlayerDto},
  score?: number;
  fouls?: number;
}
