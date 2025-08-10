import {Component, Input, model, ModelSignal} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {PlayerMetadata} from "@models/player-metadata";
import {TeamMetadata} from "@models/team-metadata";
import {Role} from "@enums/role.enum";
import {Team} from "@models/team";
import {TeamNumber} from "@enums/team-number.enum";

@Component({
  selector: 'app-team-form',
  imports: [
    FormsModule,
    NgForOf,
    NgIf
  ],
  templateUrl: './team-form.component.html',
  styleUrls: ['./team-form.component.scss']
})
export class TeamFormComponent {
  protected readonly roles: Role[] = Object.values(Role);
  protected readonly Role = Role;

  team: ModelSignal<Team> = model.required();

  @Input() players: PlayerMetadata[] = [];
  @Input() teams: Record<string, TeamMetadata> = {};
  @Input({required: true}) teamNumber: TeamNumber;

  getVareuses(): number[] {
    return this.teams[this.team.name]?.vareuses || [];
  }

  protected readonly TeamNumber = TeamNumber;
}
