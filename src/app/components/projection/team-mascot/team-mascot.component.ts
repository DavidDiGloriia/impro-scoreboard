import {ChangeDetectionStrategy, Component, computed, inject, input, InputSignal, Signal} from '@angular/core';
import {find} from "lodash-es";
import {ImproDataService} from "@services/impro-data.service";
import {Team} from "@models/team";
import {TeamMetadata} from "@models/team-metadata";
import {TeamNumber} from "@enums/team-number.enum";

/**
 * Mascotte d'une équipe, cadrée comme sur l'écran de match : l'image remplit l'hôte (object-fit: cover)
 * et son cadrage dépend de l'équipe et du côté (équipe A ou B, l'une étant le miroir de l'autre).
 * Le parent donne la taille de l'hôte et, s'il le veut, un cadre autour.
 */
@Component({
  selector: 'app-team-mascot',
  template: `
    @if (src()) {
      <img [src]="src()" [class]="photoClass()" alt="Mascotte équipe" draggable="false"/>
    }
  `,
  styles: `
    :host {
      display: block;
      overflow: hidden;
    }

    img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    /* Cadrages par équipe et par côté (repris de l'écran de match) */
    .photo-teamA-aigles {
      transform-origin: center;
      transform: scaleX(-1) scale(1.65) translateX(20.2%) translateY(-17.5%);
      image-rendering: crisp-edges;
    }

    .photo-teamB-aigles {
      transform-origin: center;
      transform: scale(1.65) translateX(20.2%) translateY(-17.5%);
      image-rendering: crisp-edges;
    }

    .photo-teamA-pythons {
      object-position: top;
      image-rendering: crisp-edges;
      transform: scale(1.40) translateY(15%) translateX(-15%);
    }

    .photo-teamB-pythons {
      object-position: top;
      image-rendering: crisp-edges;
      transform: scaleX(-1) scale(1.40) translateY(15%) translateX(-15%);
    }

    .photo-teamA-lions {
      object-position: 100% center;
    }

    .photo-teamB-lions {
      object-position: 100% center;
      transform: scaleX(-1);
    }

    .photo-teamA-requins {
      object-position: 4% center;
      transform: scaleX(-1);
    }

    .photo-teamB-requins {
      object-position: 4% center;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TeamMascotComponent {
  team: InputSignal<Team> = input.required();
  side: InputSignal<TeamNumber> = input<TeamNumber>(TeamNumber.TEAM_A);

  private _improDataService = inject(ImproDataService);

  teamMetadata: Signal<TeamMetadata | undefined> = computed(() =>
    find(this._improDataService.teams.value(), (t: TeamMetadata) => t.name === this.team().name)
  );

  /** Image propre au match si elle existe, sinon celle de l'équipe. */
  src: Signal<string | undefined> = computed(() => this.team().img || this.teamMetadata()?.img);

  photoClass: Signal<string> = computed(() => {
    const code = this.teamMetadata()?.code;
    return code ? `photo-${this.side()}-${code}` : '';
  });
}
