import { Component, Input } from '@angular/core';
import {FormsModule} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {Player} from "@models/player";
import {Team} from "@models/team";

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
  @Input() prefix: string = '';
  @Input() teamData: any = {};
  @Input() players: Player[] = [];
  @Input() teams: Record<string, Team> = {};

  roles = [
    'coach', 'capitaine', 'assistant',
    'joueur3', 'joueur4', 'joueur5', 'joueur6'
  ];

  getVareuses(): number[] {
    return this.teams[this.teamData.name]?.vareuses || [];
  }
}
