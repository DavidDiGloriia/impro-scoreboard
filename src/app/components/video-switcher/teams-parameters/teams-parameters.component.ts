import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {LocalStorageService} from "@services/storage.service";
import {PlayerMetadata} from "@models/player-metadata";
import {TeamMetadata} from "@models/team-metadata";
import {FormsModule} from "@angular/forms";
import {TeamFormComponent} from "@components/video-switcher/team-form/team-form.component";
import {GameData} from "@models/game-data";
import {StorageKey} from "@enums/storage-key.enum";

@Component({
  selector: 'app-teams-parameters',
  imports: [
    FormsModule,
    TeamFormComponent
  ],
  templateUrl: './teams-parameters.component.html',
  styleUrl: './teams-parameters.component.scss'
})
export class TeamsParametersComponent implements OnInit {
  joueurFields = [
    'teamA-coach', 'teamA-capitaine', 'teamA-assistant',
    'teamA-joueur3', 'teamA-joueur4', 'teamA-joueur5', 'teamA-joueur6',
    'teamB-coach', 'teamB-capitaine', 'teamB-assistant',
    'teamB-joueur3', 'teamB-joueur4', 'teamB-joueur5', 'teamB-joueur6'
  ];

  joueurs: PlayerMetadata[] = [];
  equipes: Record<string, TeamMetadata> = {};

  gameData: GameData;

  constructor(
    private http: HttpClient,
    private storageUtils: LocalStorageService,
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    Promise.all([
      this.http.get<PlayerMetadata[]>('assets/data/joueurs.json').toPromise(),
      this.http.get<Record<string, TeamMetadata>>('assets/data/equipes.json').toPromise()
    ]).then(([joueurs, equipes]) => {
      this.joueurs = joueurs || [];
      this.equipes = equipes || {};
      this.restoreData();
    }).catch(err => {
      console.error('Erreur chargement données', err);
    });
  }

  restoreData() {
    this.gameData = this.storageUtils.read<GameData>(StorageKey.GAME_DATA);
  }

  saveData() {
    this.storageUtils.saveImproData(StorageKey.GAME_DATA, this.gameData);
  }

  getVareuses(teamName: string): number[] {
    return this.equipes[teamName]?.vareuses || [];
  }
}
