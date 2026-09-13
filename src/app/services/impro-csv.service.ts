import {Injectable} from '@angular/core';
import {ImproDataDto} from "../dtos";
import {ImproDataService} from "@services/impro-data.service";
import {LocalStorageService} from "@services/storage.service";
import {StorageKey} from "@enums/storage-key.enum";
import {ImproNbPlayersShortLabel} from "@constants/impro-nb-players.constants";

/** Impro terminée, telle que gardée pour le rapport de match. */
interface ReportLine {
  title: string;
  type: string;
  category: string;
  nbPlayers: string;
  duration: string;
}

/**
 * Rapport de match : une ligne CSV par impro terminée. Les lignes sont conservées dans le localStorage
 * (clé MATCH_REPORT), donc elles survivent à un rechargement ou un redémarrage de l'app pendant le match,
 * et sont effacées par « Nouveau match ».
 */
@Injectable({
  providedIn: 'root'
})
export class ImproCsvService {

  private static readonly HEADERS = ['numéro', 'titre', 'type', 'catégorie', 'nb joueurs', 'durée'];

  constructor(private improDataService: ImproDataService,
              private storageService: LocalStorageService) {
  }

  private readLines(): ReportLine[] {
    return this.storageService.read<ReportLine[]>(StorageKey.MATCH_REPORT) ?? [];
  }

  private writeLines(lines: ReportLine[]): void {
    // save() fusionne les objets ; pour une liste on écrit directement pour ne rien garder de l'ancienne
    localStorage.setItem(StorageKey.MATCH_REPORT, JSON.stringify(lines));
  }

  // Ajoute une impro terminée au rapport
  addImpro(impro: ImproDataDto): void {
    const nbPlayersLabel = impro.customNbPlayerLabel || ImproNbPlayersShortLabel[impro.nbPlayers] || '';
    const durationLabel = impro.duration
      ? `${Math.floor(impro.duration / 60)}:${(impro.duration % 60).toString().padStart(2, '0')}`
      : '';
    this.writeLines([...this.readLines(), {
      title: impro.title || '',
      type: impro.type || '',
      category: impro.category || '',
      nbPlayers: nbPlayersLabel,
      duration: durationLabel,
    }]);
  }

  /** Nombre d'impros dans le rapport en cours. */
  get count(): number {
    return this.readLines().length;
  }

  // Contenu CSV complet (séparateur « ; », guillemets si nécessaire)
  getCsvContent(): string {
    const escape = (value: string | number) => {
      const text = String(value ?? '');
      return /[;"\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
    };
    const rows = this.readLines().map((line, i) => [i + 1, line.title, line.type, line.category, line.nbPlayers, line.duration]);
    return [ImproCsvService.HEADERS, ...rows].map(row => row.map(escape).join(';')).join('\r\n');
  }

  // Télécharge le CSV
  downloadCsv(): void {
    const gameData = this.improDataService.gameData.value();
    const teamA = gameData?.teamA?.name || 'EquipeA';
    const teamB = gameData?.teamB?.name || 'EquipeB';
    const formattedDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const safe = (name: string) => name.replace(/\s+/g, '_').replace(/[^\w-]/g, '');
    const filename = `match_${safe(teamA)}_vs_${safe(teamB)}_${formattedDate}.csv`;

    // BOM UTF-8 pour qu'Excel affiche correctement les accents
    const blob = new Blob(['\ufeff', this.getCsvContent()], {type: 'text/csv;charset=utf-8;'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    // Révoquer tout de suite peut annuler le téléchargement (Chromium/Electron) : on laisse le temps de démarrer.
    setTimeout(() => {
      a.remove();
      URL.revokeObjectURL(url);
    }, 10_000);
  }

  // Réinitialise complètement le rapport
  resetCsv(): void {
    this.storageService.clear(StorageKey.MATCH_REPORT);
  }
}
