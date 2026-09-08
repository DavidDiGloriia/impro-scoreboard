import {ChangeDetectionStrategy, Component, computed, effect, inject, input, InputSignal, Signal, signal} from '@angular/core';
import {find} from "lodash-es";
import {ImproDataService} from "@services/impro-data.service";
import {Team} from "@models/team";
import {TeamMetadata} from "@models/team-metadata";

/** Déclinaison utilisée quand l'équipe n'a pas (encore) la sienne dans assets/layout. */
const DEFAULT_LAYOUT = 'lions';

/**
 * Décor de coin d'une équipe (export Figma) : assets/layout/<code équipe>-left.svg ou -right.svg.
 * Repli sur la déclinaison par défaut si le fichier de l'équipe n'existe pas.
 *
 * Le parent positionne le composant ; le SVG fait 551 x 1080 et prend toute la hauteur de l'hôte.
 */
@Component({
  selector: 'app-team-layout',
  template: `<img [src]="src()" (error)="onMissing()" alt="" draggable="false"/>`,
  styles: `
    :host { display: block; height: 100%; pointer-events: none; user-select: none; }
    img { display: block; height: 100%; width: auto; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TeamLayoutComponent {
  /** Équipe du match (données de partie) ; undefined = déclinaison par défaut. */
  team: InputSignal<Team | undefined> = input<Team | undefined>(undefined);
  side: InputSignal<'left' | 'right'> = input.required();

  private _improDataService = inject(ImproDataService);
  private _missing = signal(false);

  private _code: Signal<string> = computed(() => {
    const team = this.team();
    const metadata = team
      ? find(this._improDataService.teams.value(), (t: TeamMetadata) => t.name === team.name)
      : undefined;
    return metadata?.code || DEFAULT_LAYOUT;
  });

  src: Signal<string> = computed(() => {
    const code = this._missing() ? DEFAULT_LAYOUT : this._code();
    return `assets/layout/${code}-${this.side()}.svg`;
  });

  constructor() {
    // Nouvelle équipe : on retente sa propre déclinaison.
    effect(() => {
      this._code();
      this._missing.set(false);
    });
  }

  onMissing(): void {
    this._missing.set(true);
  }
}
