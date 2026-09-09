import {GameData} from "@models/game-data";
import {Team} from "@models/team";
import {TeamMetadata} from "@models/team-metadata";
import {Role} from "@enums/role.enum";
import {find} from "lodash-es";

/** Page de vote des étoiles (dossier vote/ du dépôt, déployée sur GitHub Pages par .github/workflows/vote-pages.yml). */
export const VOTE_BASE_URL = 'https://daviddigloriia.github.io/impro-scoreboard/';

/** Page de dépouillement, réservée à l'organisation (connexion Google). */
export const VOTE_RESULTS_URL = VOTE_BASE_URL + 'resultats.html';

/** Identifiant du match pour le vote : date du jour + codes des deux équipes, ex. "2026-09-12-lions-aigles". */
export function voteMatchId(gameData: GameData, teams: Record<string, TeamMetadata>, date: Date = new Date()): string {
  const day = date.toISOString().slice(0, 10);
  return [day, teamCode(gameData.teamA, teams), teamCode(gameData.teamB, teams)].filter(Boolean).join('-');
}

/**
 * URL complète encodée dans le QR code : identifiant du match, codes des équipes et joueurs alignés
 * ("code:numéro:rôle", sans les coachs). La page de vote n'a besoin de rien d'autre, l'app reste hors ligne.
 */
export function voteUrl(gameData: GameData, teams: Record<string, TeamMetadata>, date: Date = new Date()): string {
  const params = new URLSearchParams({
    m: voteMatchId(gameData, teams, date),
    a: teamCode(gameData.teamA, teams),
    b: teamCode(gameData.teamB, teams),
    pa: playersParam(gameData.teamA),
    pb: playersParam(gameData.teamB),
  });
  return `${VOTE_BASE_URL}?${params.toString()}`;
}

function teamCode(team: Team, teams: Record<string, TeamMetadata>): string {
  return find(Object.values(teams), (t: TeamMetadata) => t.name === team?.name)?.code ?? '';
}

function playersParam(team: Team): string {
  return Object.entries(team?.players ?? {})
    .filter(([role, player]) => role !== Role.COACH && !!player?.code)
    .map(([role, player]) => [player.code, player.number ?? '', role === Role.CAPTAIN || role === Role.ASSIST ? role : '']
      .join(':').replace(/:+$/, ''))
    .join(',');
}
