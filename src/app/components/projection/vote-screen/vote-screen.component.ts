import {ChangeDetectionStrategy, Component, computed, effect, input, InputSignal, Signal, signal} from '@angular/core';
import {NgStyle} from "@angular/common";
import QRCode from 'qrcode';
import {ImproDataService} from "@services/impro-data.service";
import {ProjectionMode} from "@enums/projection-mode.enum";
import {GameData} from "@models/game-data";
import {TeamMetadata} from "@models/team-metadata";
import {TeamLayoutComponent} from "@components/projection/team-layout/team-layout.component";
import {voteUrl, VOTE_BASE_URL} from "@constants/vote.constants";
import {find} from "lodash-es";

/**
 * Écran « Votez pour les étoiles » : QR code vers la page de vote, avec la composition du match encodée dedans.
 */
@Component({
  selector: 'app-vote-screen',
  imports: [NgStyle, TeamLayoutComponent],
  templateUrl: './vote-screen.component.html',
  styleUrl: './vote-screen.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VoteScreenComponent {
  readonly ProjectionMode = ProjectionMode;

  gameData: InputSignal<GameData> = input.required();
  projectionMode: InputSignal<ProjectionMode> = input<ProjectionMode>(ProjectionMode.NORMAL);

  screenStyle = this._improDataService.screenStyle;
  containerStyle = this._improDataService.containerStyle;

  /** Adresse courte affichée sous le QR code, sans le protocole. */
  readonly shortUrl = VOTE_BASE_URL.replace(/^https?:\/\//, '').replace(/\/$/, '');

  url: Signal<string> = computed(() => voteUrl(this.gameData(), this._improDataService.teams.value()));

  teamAMetadata: Signal<TeamMetadata | undefined> = computed(() => this.metadata(this.gameData().teamA.name));
  teamBMetadata: Signal<TeamMetadata | undefined> = computed(() => this.metadata(this.gameData().teamB.name));

  /** QR code en data URL, régénéré quand la composition change. */
  qrDataUrl = signal<string>('');

  constructor(private _improDataService: ImproDataService) {
    effect(() => {
      const url = this.url();
      QRCode.toDataURL(url, {errorCorrectionLevel: 'M', margin: 1, width: 1024, color: {dark: '#000000', light: '#ffffff'}})
        .then(dataUrl => this.qrDataUrl.set(dataUrl))
        .catch(() => this.qrDataUrl.set(''));
    });
  }

  private metadata(name: string | undefined): TeamMetadata | undefined {
    return name ? find(this._improDataService.teams.value(), (t: TeamMetadata) => t.name === name) : undefined;
  }
}
