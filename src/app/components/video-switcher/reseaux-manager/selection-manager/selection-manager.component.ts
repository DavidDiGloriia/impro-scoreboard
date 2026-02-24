import {Component, computed, ElementRef, LOCALE_ID, QueryList, Signal, signal, ViewChild, ViewChildren} from '@angular/core';
import {registerLocaleData} from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import {ImproDataService} from '@services/impro-data.service';
import {PlayerMetadata} from '@models/player-metadata';
import {TeamMetadata} from '@models/team-metadata';
import {DatePipe, NgTemplateOutlet, UpperCasePipe} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Player} from '@models/player';
import {Team} from '@models/team';
import {find, keyBy} from 'lodash-es';
import html2canvas from 'html2canvas-pro';
import JSZip from 'jszip';
import {Role} from '@enums/role.enum';
import {RoleNamePipe} from '@pipes/role-name.pipe';

registerLocaleData(localeFr);

export interface ResolvedPlayer {
  role: string;
  player: Player;
  metadata: PlayerMetadata;
  teamMetadata: TeamMetadata;
  team: Team;
}

@Component({
  selector: 'app-selection-manager',
  imports: [UpperCasePipe, RoleNamePipe, NgTemplateOutlet, FormsModule, DatePipe],
  providers: [{provide: LOCALE_ID, useValue: 'fr'}],
  templateUrl: './selection-manager.component.html',
  styleUrl: './selection-manager.component.scss'
})
export class SelectionManagerComponent {
  // Offscreen elements for capture
  @ViewChildren('playerStory') playerStoryElements: QueryList<ElementRef<HTMLDivElement>>;
  @ViewChild('teamAOffscreen') teamAOffscreen: ElementRef<HTMLDivElement>;
  @ViewChild('teamBOffscreen') teamBOffscreen: ElementRef<HTMLDivElement>;
  @ViewChild('compoOffscreen') compoOffscreen: ElementRef<HTMLDivElement>;

  gameData = this._improDataService.gameData;
  teams = this._improDataService.teams;
  players = this._improDataService.players;

  generating = signal(false);
  generatingIndex = signal<number | null>(null);

  matchDate = signal(new Date().toISOString().slice(0, 10));
  matchTime = signal('20:00');
  matchLocation = signal('');

  readonly suggestedLocations = [
    'Salle Fernan-Léger, Argenteuil',
    'Théâtre du Rond-Point, Paris',
    'Salle Jacques Brel, Fontenay-sous-Bois',
  ];

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

  teamAPlayers: Signal<ResolvedPlayer[]> = computed(() => {
    return this._resolveTeamPlayers(this.gameData.value().teamA);
  });

  teamBPlayers: Signal<ResolvedPlayer[]> = computed(() => {
    return this._resolveTeamPlayers(this.gameData.value().teamB);
  });

  allPlayers: Signal<ResolvedPlayer[]> = computed(() => {
    return [...this.teamAPlayers(), ...this.teamBPlayers()];
  });

  compoRows: Signal<{ a: ResolvedPlayer | null; b: ResolvedPlayer | null }[]> = computed(() => {
    const aPlayers = this.teamAPlayers();
    const bPlayers = this.teamBPlayers();
    const maxLen = Math.max(aPlayers.length, bPlayers.length);
    const rows: { a: ResolvedPlayer | null; b: ResolvedPlayer | null }[] = [];
    for (let i = 0; i < maxLen; i++) {
      rows.push({a: aPlayers[i] || null, b: bPlayers[i] || null});
    }
    return rows;
  });

  constructor(private _improDataService: ImproDataService) {
  }

  getPlayerImg(resolved: ResolvedPlayer): string {
    if (!resolved.metadata?.img || !resolved.teamMetadata) return '';
    return resolved.metadata.img + resolved.teamMetadata.playerImgSuffix;
  }

  getTeamColor(resolved: ResolvedPlayer): string {
    return resolved.teamMetadata?.color || '#666';
  }

  getTeamLogo(resolved: ResolvedPlayer): string {
    return resolved.teamMetadata?.img || '';
  }

  getTeamDisplayName(resolved: ResolvedPlayer): string {
    return resolved.team.displayName;
  }

  isSimplePlayer(role: string): boolean {
    return role === 'joueur 3' || role === 'joueur 4' || role === 'joueur 5' || role === 'joueur 6';
  }

  async generateSingle(index: number) {
    const elements = this.playerStoryElements.toArray();
    if (!elements[index]) return;
    this.generatingIndex.set(index);
    try {
      const canvas = await this._capture(elements[index].nativeElement);
      const resolved = this.allPlayers()[index];
      this._downloadCanvas(canvas, `story-${resolved.metadata.firstName.toLowerCase().replace(/\s+/g, '-')}.png`);
    } finally {
      this.generatingIndex.set(null);
    }
  }

  async generateAllIndividual() {
    this.generating.set(true);
    try {
      const zip = new JSZip();
      const elements = this.playerStoryElements.toArray();
      for (let i = 0; i < elements.length; i++) {
        this.generatingIndex.set(i);
        const canvas = await this._capture(elements[i].nativeElement);
        const resolved = this.allPlayers()[i];
        const base64 = canvas.toDataURL('image/png').split(',')[1];
        zip.file(`story-${resolved.metadata.firstName.toLowerCase().replace(/\s+/g, '-')}.png`, base64, {base64: true});
      }
      const blob = await zip.generateAsync({type: 'blob'});
      this._downloadBlob(blob, 'stories-individuelles.zip');
    } finally {
      this.generating.set(false);
      this.generatingIndex.set(null);
    }
  }

  async generateTeamStory(team: 'A' | 'B') {
    const el = team === 'A' ? this.teamAOffscreen : this.teamBOffscreen;
    if (!el?.nativeElement) return;
    this.generating.set(true);
    try {
      const canvas = await this._capture(el.nativeElement);
      const teamData = team === 'A' ? this.gameData.value().teamA : this.gameData.value().teamB;
      this._downloadCanvas(canvas, `story-equipe-${teamData.displayName.toLowerCase().replace(/\s+/g, '-')}.png`);
    } finally {
      this.generating.set(false);
    }
  }

  async generateCompoStory() {
    if (!this.compoOffscreen?.nativeElement) return;
    this.generating.set(true);
    try {
      const canvas = await this._capture(this.compoOffscreen.nativeElement);
      this._downloadCanvas(canvas, 'story-composition.png');
    } finally {
      this.generating.set(false);
    }
  }

  private async _capture(el: HTMLElement): Promise<HTMLCanvasElement> {
    return html2canvas(el, {
      width: 1080,
      height: 1920,
      scale: 1,
      useCORS: true,
      backgroundColor: '#0a0a0a',
    });
  }

  private _downloadCanvas(canvas: HTMLCanvasElement, filename: string) {
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }

  private _downloadBlob(blob: Blob, filename: string) {
    const link = document.createElement('a');
    link.download = filename;
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
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
