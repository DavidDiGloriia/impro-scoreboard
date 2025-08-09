import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {LocalStorageService} from "@services/storage.service";
import {Player} from "@models/player";
import {Team} from "@models/team";
import {FormsModule} from "@angular/forms";
import {TeamFormComponent} from "@components/video-switcher/team-form/team-form.component";

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

  joueurs: Player[] = [];
  equipes: Record<string, Team> = {};

  improData: any = { teamA: {}, teamB: {} };

  constructor(
    private http: HttpClient,
    private storageUtils: LocalStorageService,
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    Promise.all([
      this.http.get<Player[]>('assets/data/joueurs.json').toPromise(),
      this.http.get<Record<string, Team>>('assets/data/equipes.json').toPromise()
    ]).then(([joueurs, equipes]) => {
      this.joueurs = joueurs || [];
      this.equipes = equipes || {};
      this.restoreData();
    }).catch(err => {
      console.error('Erreur chargement données', err);
    });
  }

  restoreData() {
    this.improData = this.storageUtils.readImproData();
  }

  saveData() {
    this.storageUtils.saveImproData(this.improData);
  }

  getVareuses(teamName: string): number[] {
    return this.equipes[teamName]?.vareuses || [];
  }

  resetMatch() {
    if (!confirm('Voulez-vous vraiment réinitialiser le match ?')) return;

    this.improData = { teamA: {}, teamB: {} };
    this.storageUtils.clearImproData();
  }
}
