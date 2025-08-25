import {
  Component,
  effect,
  ElementRef, input,
  InputSignal,
  OnInit,
  signal,
  Signal,
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
  videoHandling = this._improDataService.videoHandling;

  files: WritableSignal<string[]> = signal([]);
  video: Signal<ElementRef<HTMLVideoElement>> = viewChild('videoPlayer');
  projectionMode: InputSignal<ProjectionMode> = input.required();

  currentVideoPath: string | null = null;
  folderPath: string = '';

  constructor(private _userFilesService: UserFilesService,
              private _improDataService: ImproDataService
) {
    effect(() => {
      this.onVideoAction(this.videoHandling.value())
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
      case VideoAction.RESET:
        this.reset();
        break;
      case VideoAction.MUTE:
        this.mute();
        break;
      case VideoAction.UNMUTE:
        this.unmute();
        break;
      case VideoAction.ADJUST_TIME:
        this.changeTime(videoHandling.delta);
        break;
      case VideoAction.ADJUST_VOLUME:
        this.changeVolume(videoHandling.delta);
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

  unmute() {
    this.video().nativeElement.muted = false;
  }

  reset() {
    this.video().nativeElement.currentTime = 0;
    this.video().nativeElement.pause();
  }

  changeTime(seconds: number) {
    this.video().nativeElement.currentTime += seconds;
  }

  changeVolume(value: number) {
    this.video().nativeElement.volume += value;
  }

  protected readonly ProjectionMode = ProjectionMode;
}
