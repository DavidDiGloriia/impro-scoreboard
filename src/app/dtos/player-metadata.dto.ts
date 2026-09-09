export interface PlayerMetadataDto {
  prenom?: string;
  nom?: string;
  alias?: string;
  /** Chemin de base de la photo, sans suffixe d'équipe ni extension (ex. "assets/joueurs/polo"). */
  img?: string;
  femme?: boolean;
}
