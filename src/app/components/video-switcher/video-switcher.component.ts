import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {ImproDataService} from "@services/impro-data.service";

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
  ) {
  }

  resetMatch() {
    if (!confirm('Voulez-vous vraiment démarrer un nouveau match ? Les scores et les équipes seront effacés.')) return;

    this.improDataService.clearGameData();
  }
}
