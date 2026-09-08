import {TeamNumber} from "@enums/team-number.enum";

/** Joueur mis à l'honneur sur l'écran "étoiles individuelles". Null = aucun joueur sélectionné. */
export interface StarPlayerDto {
  team?: TeamNumber | null;
  /** Clé du joueur dans Team.players (rôle : capitaine, coach, Joueur1...). */
  role?: string | null;
}
