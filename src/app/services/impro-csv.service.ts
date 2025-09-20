import { Injectable } from '@angular/core';
import {ImproDataDto} from "../dtos";
import {ImproDataService} from "@services/impro-data.service";
import {ImproNbPlayersShortLabel} from "@constants/impro-nb-players.constants";

@Injectable({
  providedIn: 'root'
})
export class ImproCsvService {

  private csvLines: string[] = [];

  constructor(
    private improDataService: ImproDataService
  ) {
    this.initCsv();
  }

  // Initialise le CSV avec les headers
  initCsv(): void {
    const headers = ['numéro', 'titre', 'type', 'catégorie', 'nb joueurs', 'durée'];
    this.csvLines = [headers.join(';')];
  }

  // Ajoute une impro au CSV
  addImpro(impro: ImproDataDto): void {
    const nbPlayersLabel = impro.customNbPlayerLabel || ImproNbPlayersShortLabel[impro.nbPlayers];
    const durationLabel = impro.duration ? `${Math.floor(impro.duration / 60)}:${(impro.duration % 60).toString().padStart(2, '0')}` : '';

    // L'index est la longueur actuelle du CSV minus 1 (pour ignorer l'entête)
    const index = this.csvLines.length;

    const line = [
      index,  // index auto
      impro.title || '',
      impro.type || '',
      impro.category || '',
      nbPlayersLabel|| '',
      durationLabel
    ].join(';');

    this.csvLines.push(line);
  }


  // Récupère toutes les lignes du CSV
  getCsvContent(): string {
    return this.csvLines.join('\n');
  }

  // Télécharge le CSV
  downloadCsv(): void {
    // Récupération des équipes depuis gameData
    const gameData = this.improDataService.gameData.value();
    const teamA = gameData?.teamA?.name || 'EquipeA';
    const teamB = gameData?.teamB?.name || 'EquipeB';

    // Formatage de la date
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0]; // YYYY-MM-DD

    // Nettoyage des noms pour un nom de fichier valide
    const safeTeamA = teamA.replace(/\s+/g, '_').replace(/[^\w-]/g, '');
    const safeTeamB = teamB.replace(/\s+/g, '_').replace(/[^\w-]/g, '');

    // Génération du nom de fichier
    const filename = `match_${safeTeamA}_vs_${safeTeamB}_${formattedDate}.csv`;

    // Création et téléchargement du CSV
    const blob = new Blob([this.getCsvContent()], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }


  // Réinitialise complètement le CSV
  resetCsv(): void {
    this.initCsv();
  }
}
