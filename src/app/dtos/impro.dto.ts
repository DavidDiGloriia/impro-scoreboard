import {ImproType} from "@enums/impro-type.enum";
import {ImproNbPlayers} from "@enums/impro-nb-players.enum";

export interface ImproDto {
  type?: ImproType;
  title?: string;
  nbPlayers?: ImproNbPlayers;
  customNbPlayerLabel?: string;
  category?: string;
  durationMs: number
}
