import {Component, effect} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {TeamFormComponent} from "@components/video-switcher/team-form/team-form.component";
import {TeamNumber} from "@enums/team-number.enum";
import {ImproDataService} from "@services/impro-data.service";
import {Team} from "@models/team";

@Component({
  selector: 'app-teams-parameters',
  imports: [
    FormsModule,
    TeamFormComponent
  ],
  templateUrl: './teams-parameters.component.html',
  styleUrl: './teams-parameters.component.scss'
})
export class TeamsParametersComponent {
  protected readonly TeamNumber = TeamNumber;

  players = this._improDataService.players;
  teams  = this._improDataService.teams;
  gameData = this._improDataService.gameData;

  constructor(
    private _improDataService: ImproDataService

  ) {
    effect(() => {
      console.log(this._improDataService.gameData)
    });
  }

  onTeamChange(value: Team, teamNumber: TeamNumber) {
    const updatedGameData = this.gameData.value().clone()
      .withTeamA(teamNumber === TeamNumber.TEAM_A ? value : this.gameData.value().teamA)
      .withTeamB(teamNumber === TeamNumber.TEAM_B ? value : this.gameData.value().teamB);

    this._improDataService.saveGameData(updatedGameData).subscribe((data) => {
      this.gameData.set(data.clone());
    });
  }

}
