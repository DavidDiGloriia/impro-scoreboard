import {Component, computed, ElementRef, LOCALE_ID, Signal, signal, ViewChild} from '@angular/core';
import {registerLocaleData} from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import {ImproDataService} from '@services/impro-data.service';
import {PlayerMetadata} from '@models/player-metadata';
import {TeamMetadata} from '@models/team-metadata';
import {NgTemplateOutlet, UpperCasePipe} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Team} from '@models/team';
import {find, keyBy} from 'lodash-es';
import {toPng} from 'html-to-image';
import {Role} from '@enums/role.enum';
import {ResolvedPlayer} from '../selection-manager/selection-manager.component';
import facePositions from '@assets/data/face-positions.json';
import {SearchableSelectComponent, SelectOption} from '@components/searchable-select/searchable-select.component';

registerLocaleData(localeFr);

@Component({
  selector: 'app-match-result-manager',
  imports: [UpperCasePipe, NgTemplateOutlet, FormsModule, SearchableSelectComponent],
  providers: [{provide: LOCALE_ID, useValue: 'fr'}],
  templateUrl: './match-result-manager.component.html',
  styleUrl: './match-result-manager.component.scss'
})
export class MatchResultManagerComponent {
  @ViewChild('etoilesOffscreen') etoilesOffscreen: ElementRef<HTMLDivElement>;

  gameData = this._improDataService.gameData;
  teams = this._improDataService.teams;
  players = this._improDataService.players;

  generating = signal(false);

  scoreA = signal(0);
  scoreB = signal(0);

  star1Code = signal<string>('');
  star2Code = signal<string>('');
  star3Code = signal<string>('');
  starStaffCode = signal<string>('');

  protected readonly Role = Role;

  playersByCode: Signal<Record<string, PlayerMetadata>> = computed(() => {
    return keyBy(this.players.value(), 'code');
  });

  teamAMeta: Signal<TeamMetadata | null> = computed(() => {
    const team = this.gameData.value().teamA;
    if (!team?.name) return null;
    return find(this.teams.value(), (t: TeamMetadata) => t.name === team.name) || null;
  });

  teamBMeta: Signal<TeamMetadata | null> = computed(() => {
    const team = this.gameData.value().teamB;
    if (!team?.name) return null;
    return find(this.teams.value(), (t: TeamMetadata) => t.name === team.name) || null;
  });

  allPlayers: Signal<ResolvedPlayer[]> = computed(() => {
    return [
      ...this._resolveTeamPlayers(this.gameData.value().teamA),
      ...this._resolveTeamPlayers(this.gameData.value().teamB),
    ];
  });

  playerOptions: Signal<SelectOption[]> = computed(() => {
    const all = this.allPlayers();
    const metas = all.map(p => p.metadata);
    const labels = PlayerMetadata.smartLabels(metas);
    return all.map(p => ({
      value: p.player.code,
      label: `${labels.get(p.player.code) || p.metadata.firstName} (${p.team.displayName})`,
    }));
  });

  winner: Signal<'A' | 'B' | 'draw'> = computed(() => {
    const a = this.scoreA();
    const b = this.scoreB();
    if (a > b) return 'A';
    if (b > a) return 'B';
    return 'draw';
  });

  resultLabel: Signal<string> = computed(() => {
    const w = this.winner();
    if (w === 'draw') return 'ÉGALITÉ !';
    const meta = w === 'A' ? this.teamAMeta() : this.teamBMeta();
    const name = meta?.shortName || (w === 'A' ? this.gameData.value().teamA.displayName : this.gameData.value().teamB.displayName);
    return `VICTOIRE DES ${name.toUpperCase()} !`;
  });

  resultColor: Signal<string> = computed(() => {
    const w = this.winner();
    if (w === 'draw') return '#fff';
    const meta = w === 'A' ? this.teamAMeta() : this.teamBMeta();
    return meta?.color || '#fff';
  });

  bgColorA: Signal<string> = computed(() => {
    const w = this.winner();
    if (w === 'draw') return this.teamAMeta()?.color || '#333';
    const winnerMeta = w === 'A' ? this.teamAMeta() : this.teamBMeta();
    return winnerMeta?.color || '#333';
  });

  bgColorB: Signal<string> = computed(() => {
    const w = this.winner();
    if (w === 'draw') return this.teamBMeta()?.color || '#333';
    const winnerMeta = w === 'A' ? this.teamAMeta() : this.teamBMeta();
    return winnerMeta?.color || '#333';
  });

  stars: Signal<{ label: string; resolved: ResolvedPlayer | null }[]> = computed(() => {
    const all = this.allPlayers();
    const resolve = (code: string) => all.find(p => p.player.code === code) || null;
    return [
      {label: '1ÈRE ÉTOILE', resolved: resolve(this.star1Code())},
      {label: '2ÈME ÉTOILE', resolved: resolve(this.star2Code())},
      {label: '3ÈME ÉTOILE', resolved: resolve(this.star3Code())},
      {label: 'ÉTOILE DU STAFF', resolved: resolve(this.starStaffCode())},
    ];
  });

  constructor(private _improDataService: ImproDataService) {
  }

  getPlayerImg(resolved: ResolvedPlayer): string {
    if (!resolved.metadata?.img || !resolved.teamMetadata) return '';
    return resolved.metadata.img + resolved.teamMetadata.playerImgSuffix;
  }

  private static readonly SCALE_OVERRIDES: Record<string, number> = {
    'assets/joueurs/doc': 2.8,
    'assets/joueurs/antoine': 2.5,
  };

  getTeamColor(resolved: ResolvedPlayer): string {
    return resolved.teamMetadata?.color || '#666';
  }

  getFacePosition(resolved: ResolvedPlayer): string {
    const src = this.getPlayerImg(resolved);
    const pos = (facePositions as Record<string, { x: number; y: number }>)[src];
    return pos ? `${pos.x}% ${pos.y - 10}%` : 'center 5%';
  }

  getPlayerScale(resolved: ResolvedPlayer): string {
    const img = resolved.metadata?.img;
    const key = img ? Object.keys(MatchResultManagerComponent.SCALE_OVERRIDES).find(k => img.startsWith(k)) : null;
    const scale = key ? MatchResultManagerComponent.SCALE_OVERRIDES[key] : 2.2;
    return `scale(${scale})`;
  }

  async generateStory() {
    if (!this.etoilesOffscreen?.nativeElement) return;
    this.generating.set(true);
    try {
      const dataUrl = await toPng(this.etoilesOffscreen.nativeElement, {
        width: 1080,
        height: 1920,
        pixelRatio: 1,
        backgroundColor: '#0a0a0a',
      });
      const link = document.createElement('a');
      link.download = 'story-resultat.png';
      link.href = dataUrl;
      link.click();
    } finally {
      this.generating.set(false);
    }
  }

  private _resolveTeamPlayers(team: Team): ResolvedPlayer[] {
    if (!team?.name) return [];
    const teamMetadata = find(this.teams.value(), (t: TeamMetadata) => t.name === team.name);
    if (!teamMetadata) return [];
    const pByCode = this.playersByCode();
    return Object.entries(team.players)
      .filter(([role, player]) => !!player?.code && role !== Role.COACH)
      .map(([role, player]) => ({role, player, metadata: pByCode[player.code], teamMetadata, team}))
      .filter(r => !!r.metadata);
  }
}
