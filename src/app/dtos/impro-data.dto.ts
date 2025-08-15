import {ImproType} from "@enums/impro-type.enum";
import {ImproNbPlayers} from "@enums/impro-nb-players.enum";

export interface ImproDataDto {
  isImproRunning?: boolean;
  alsoReviseDuration?: boolean;
  type?: ImproType;
  title?: string;
  nbPlayers?: ImproNbPlayers;
  customNbPlayerLabel?: string;
  category?: string;
  duration?: number
}
