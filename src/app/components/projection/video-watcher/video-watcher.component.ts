import {
  Component,
  effect,
  ElementRef, input,
  InputSignal,
  OnInit,
  signal,
  Signal, untracked,
  viewChild,
  WritableSignal
} from '@angular/core';
import {UserFilesService} from "@services/user-files.service";
import { NgIf} from "@angular/common";
import {ImproDataService} from "@services/impro-data.service";
import {VideoHandling} from "@models/video-handling";
import {VideoAction} from "@enums/video-action.enum";
import {ProjectionMode} from "@enums/projection-mode.enum";

@Component({
  selector: 'app-video-watcher',
  imports: [
    NgIf,
  ],
  templateUrl: './video-watcher.component.html',
  styleUrl: './video-watcher.component.scss'
})
export class VideoWatcherComponent implements OnInit {
  protected readonly ProjectionMode = ProjectionMode;

  videoHandling = this._improDataService.videoHandling;

  files: WritableSignal<string[]> = signal([]);
  video: Signal<ElementRef<HTMLVideoElement>> = viewChild('videoPlayer');
  projectionMode: InputSignal<ProjectionMode> = input.required();

  currentVideoPath: string | null = null;
  folderPath: string = '';

  constructor(
    private _userFilesService: UserFilesService,
    private _improDataService: ImproDataService
  ) {
    effect(() => {
      const videoValue = untracked(() => this.video());
      if (videoValue !== null) {
        this.onVideoAction(this.videoHandling.value());
      }
    });
  }


  ngOnInit(): void {
    // Abonnement pour le chemin du dossier
    this._userFilesService.getUserFolder().subscribe(path => {
      this.folderPath = path;
    });

    // Abonnement pour la liste des fichiers
    this.loadFiles();
  }

  loadFiles(): void {
    this._userFilesService.listFiles().subscribe(files => {
      this.files.set(files)
    });
  }

  playVideo(fileName: string) {
    // Crée le chemin complet avec le protocole file://
    this.currentVideoPath = `file://${this.folderPath}/${fileName}`;
  }

  async onVideoAction(videoHandling: VideoHandling) {
    switch (videoHandling.action) {
      case VideoAction.SET:
        this.playVideo(videoHandling.videoId);
        break;
      case VideoAction.PLAY:
        await this.play();
        break;
      case VideoAction.PAUSE:
        this.pause();
        break;
      case VideoAction.SET_TIME:
        this.changeTime(videoHandling.numberValue);
        break;
      case VideoAction.SET_RATE:
        this.changeRate(videoHandling.numberValue);
        break;
      }


  }

  async play() {
    await this.video().nativeElement.play();
  }

  pause() {
    this.video().nativeElement.pause();
  }

  mute() {
    this.video().nativeElement.muted = true;
  }

  changeTime(time: number) {
    this.video().nativeElement.currentTime = time;
  }

  changeRate(rate: number) {
    this.video().nativeElement.playbackRate = rate;
  }

}
