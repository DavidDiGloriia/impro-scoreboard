import {Component, computed, effect, input, InputSignal, Signal, signal} from '@angular/core';
import {NgStyle, UpperCasePipe} from "@angular/common";
import {find, keyBy} from "lodash-es";
import {ImproDataService} from "@services/impro-data.service";
import {ProjectionMode} from "@enums/projection-mode.enum";
import {TeamNumber} from "@enums/team-number.enum";
import {Team} from "@models/team";
import {TeamMetadata} from "@models/team-metadata";
import {Player} from "@models/player";
import {PlayerMetadata} from "@models/player-metadata";
import {StarPlayer} from "@models/star-player";
import {RoleNamePipe} from "@pipes/role-name.pipe";
import {PlayerMediaComponent} from "@components/projection/player-media/player-media.component";
import {whiteLogoForColor} from "@constants/logo.constants";

/**
 * Écran "étoiles individuelles" : le joueur sélectionné depuis le video-switcher
 * en plein écran (vidéo, ou photo en fallback) avec son nom, son équipe et son numéro.
 */
@Component({
  selector: 'app-star-player-presentation',
  imports: [
    NgStyle,
    UpperCasePipe,
    RoleNamePipe,
    PlayerMediaComponent
  ],
  templateUrl: './star-player-presentation.component.html',
  styleUrl: './star-player-presentation.component.scss'
})
export class StarPlayerPresentationComponent {
  protected readonly ProjectionMode = ProjectionMode;
  projectionMode: InputSignal<ProjectionMode> = input.required();

  screenStyle = this._improDataService.screenStyle;
  containerStyle = this._improDataService.containerStyle;

  starPlayer: Signal<StarPlayer> = computed(() => this._improDataService.starPlayer.value() ?? StarPlayer.none());

  /** Équipe (données de match) du joueur sélectionné. */
  team: Signal<Team | undefined> = computed(() => {
    const star = this.starPlayer();
    if (!star.isSet) {
      return undefined;
    }
    const gameData = this._improDataService.gameData.value();
    return star.team === TeamNumber.TEAM_A ? gameData.teamA : gameData.teamB;
  });

  teamMetadata: Signal<TeamMetadata | undefined> = computed(() => {
    const team = this.team();
    return team ? find(this._improDataService.teams.value(), (t: TeamMetadata) => t.name === team.name) : undefined;
  });

  /** Joueur (rôle + numéro) tel qu'aligné pour ce match. */
  player: Signal<Player | undefined> = computed(() => {
    const team = this.team();
    const role = this.starPlayer().role;
    return team && role ? team.players[role] : undefined;
  });

  playerMetadata: Signal<PlayerMetadata | undefined> = computed(() => {
    const code = this.player()?.code;
    return code ? keyBy(this._improDataService.players.value(), 'code')[code] : undefined;
  });

  playerImg: Signal<string | undefined> = computed(() => {
    const metadata = this.playerMetadata();
    const teamMetadata = this.teamMetadata();
    return metadata?.img ? metadata.img + (teamMetadata?.playerImgSuffix ?? '') : teamMetadata?.playerImgFallback;
  });

  /** Logo improvisation.be à la couleur de l'équipe du joueur (mono si aucun joueur). */
  logoSrc: Signal<string> = computed(() => whiteLogoForColor(this.teamMetadata()?.color));

  /** Déclinaison de décor utilisée quand l'équipe n'a pas (encore) la sienne dans assets/layout. */
  private static readonly DEFAULT_LAYOUT = 'lions';

  /** true si le décor de l'équipe courante n'existe pas : on retombe sur la déclinaison par défaut. */
  private _cornerMissing = signal(false);

  /** Chemin du décor de coin pour l'équipe du joueur sélectionné. */
  cornerSrc(side: 'left' | 'right'): string {
    const code = this._cornerMissing() ? StarPlayerPresentationComponent.DEFAULT_LAYOUT
      : (this.teamMetadata()?.code || StarPlayerPresentationComponent.DEFAULT_LAYOUT);
    return `assets/layout/${code}-${side}.svg`;
  }

  onCornerMissing(): void {
    this._cornerMissing.set(true);
  }


  constructor(private _improDataService: ImproDataService) {
  }

}
