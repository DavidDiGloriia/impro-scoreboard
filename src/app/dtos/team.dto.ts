import {PlayerDto} from "./player.dto";

export interface TeamDto {
  name?: string;
  customName?: string;
  img?: string;
  players?: {[role: string]: PlayerDto},
  score?: number;
  fouls?: number;
}
