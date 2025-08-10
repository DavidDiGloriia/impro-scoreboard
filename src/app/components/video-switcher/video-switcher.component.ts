import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {LocalStorageService} from "@services/storage.service";
import {StorageKey} from "@enums/storage-key.enum";
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
    if (!confirm('Voulez-vous vraiment réinitialiser le match ?')) return;

    this.improDataService.clearGameData();
  }
}
