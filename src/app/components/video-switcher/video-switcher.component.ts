import {Component} from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {ImproDataService} from "@services/impro-data.service";
import {ImproCsvService} from "@services/impro-csv.service";

@Component({
  selector: 'app-video-switcher',
  imports: [
    RouterLinkActive,
    RouterLink,
    RouterOutlet
  ],
  templateUrl: './video-switcher.component.html',
  styleUrl: './video-switcher.component.scss'
})
export class VideoSwitcherComponent {
  constructor(private improDataService: ImproDataService,
              private improCsvService: ImproCsvService
  ) {
  }

  downloadMatchReport() {
    if (this.improCsvService.count === 0
      && !confirm('Aucune impro terminée dans ce match : le rapport sera vide. Télécharger quand même ?')) return;
    this.improCsvService.downloadCsv();
  }

  resetMatch() {
    if (!confirm('Voulez-vous vraiment démarrer un nouveau match ? Les scores et les équipes seront effacés.')) return;

    this.improDataService.clearGameData();
    this.improCsvService.resetCsv();
  }
}
