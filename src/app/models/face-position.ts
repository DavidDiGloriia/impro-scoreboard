import facePositions from '@assets/data/face-positions.json';

/**
 * Cadrage d'une photo de joueur (assets/data/face-positions.json, généré par scripts/detect-faces.swift,
 * npm run faces:detect) : centre du visage en % de la photo, pour object-position.
 */
export interface FacePosition {
  x: number;
  y: number;
}

const POSITIONS = facePositions as Record<string, FacePosition>;

/** Cadrage de la photo dont la clé est le chemin sans extension (PlayerMetadata.imgKey()). */
export function facePosition(key?: string): FacePosition | undefined {
  return key ? POSITIONS[key] : undefined;
}
