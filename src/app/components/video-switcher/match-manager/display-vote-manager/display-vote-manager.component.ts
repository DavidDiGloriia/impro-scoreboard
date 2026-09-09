import {ChangeDetectionStrategy, Component, computed, inject, Signal, signal} from '@angular/core';
import {ImproDataService} from "@services/impro-data.service";
import {voteMatchId, voteUrl, VOTE_RESULTS_URL} from "@constants/vote.constants";

/** Panneau du video-switcher pour l'écran « Votez » : identifiant du match, lien de vote et accès aux résultats. */
@Component({
  selector: 'app-display-vote-manager',
  templateUrl: './display-vote-manager.component.html',
  styleUrl: './display-vote-manager.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DisplayVoteManagerComponent {
  readonly resultsUrl = VOTE_RESULTS_URL;

  private _improDataService = inject(ImproDataService);

  matchId: Signal<string> = computed(() => voteMatchId(this._improDataService.gameData.value(), this._improDataService.teams.value()));
  url: Signal<string> = computed(() => voteUrl(this._improDataService.gameData.value(), this._improDataService.teams.value()));

  /** Quel lien vient d'être copié, pour le retour visuel sur le bouton. */
  copied = signal<'vote' | 'results' | null>(null);

  copy(text: string, which: 'vote' | 'results'): void {
    navigator.clipboard?.writeText(text).then(() => {
      this.copied.set(which);
      setTimeout(() => this.copied.set(null), 2000);
    });
  }
}
