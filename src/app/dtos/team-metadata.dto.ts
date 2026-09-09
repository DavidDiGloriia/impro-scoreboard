export interface TeamMetadataDto {
  nom?: string;
  img?: string;
  couleur?: string;
  vareuses?: number[];
  groupe?: string;
  icone?: string;
  playerImgFallback?: string;
  /** Suffixe ajouté au chemin de base des joueurs, sans extension (ex. "-lions"). */
  playerImgSuffix?: string;
  shortName?: string;
}
