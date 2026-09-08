import {ChangeDetectionStrategy, Component, effect, input, InputSignal, signal} from '@angular/core';

/** Vitesse de lecture des vidéos de joueurs (1 = vitesse normale). */
const PLAYER_VIDEO_PLAYBACK_RATE = 0.8;

/**
 * Photo d'un joueur, remplacée par sa vidéo (mp4) quand elle est disponible.
 *
 * Si une vidéo est fournie, elle est rendue directement (au ralenti, une seule fois,
 * figée sur la dernière image). La photo n'est affichée que s'il n'y a pas de vidéo
 * ou si le fichier mp4 n'existe pas (erreur de chargement).
 */
@Component({
  selector: 'app-player-media',
  templateUrl: './player-media.component.html',
  styleUrl: './player-media.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayerMediaComponent {
  /** Chemin de l'image (avec extension). */
  img: InputSignal<string> = input.required();
  /** Chemin de la vidéo mp4, ou undefined si le joueur n'a pas d'image de base. */
  video: InputSignal<string | undefined> = input<string | undefined>(undefined);
  alt: InputSignal<string> = input('');
  /** cover : remplit le cadre en rognant ; contain : montre tout le média, avec des marges noires. */
  fit: InputSignal<'cover' | 'contain'> = input<'cover' | 'contain'>('cover');

  /** true après une erreur de chargement de la vidéo : on retombe sur la photo. */
  videoFailed = signal(false);

  constructor() {
    // Réinitialise l'état quand la source vidéo change (changement de joueur).
    effect(() => {
      this.video();
      this.videoFailed.set(false);
    });
  }

  onVideoLoaded(event: Event): void {
    (event.target as HTMLVideoElement).playbackRate = PLAYER_VIDEO_PLAYBACK_RATE;
  }

  onVideoError(): void {
    this.videoFailed.set(true);
  }
}
