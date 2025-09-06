import {
  Component, computed,
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
import {JsonPipe, NgIf} from "@angular/common";
import {ImproDataService} from "@services/impro-data.service";
import {MediaHandling} from "@models/media-handling";
import {MediaAction} from "@enums/video-action.enum";
import {ProjectionMode} from "@enums/projection-mode.enum";
import {IMG_EXTENSIONS, VIDEO_EXTENSIONS} from "@constants/media-extentions.constants";
import {MediaType} from "@enums/media-type.enum";

@Component({
  selector: 'app-media-watcher',
  imports: [
    NgIf,
    JsonPipe,
  ],
  templateUrl: './media-watcher.component.html',
  styleUrl: './media-watcher.component.scss'
})
export class MediaWatcherComponent implements OnInit {
  protected readonly ProjectionMode = ProjectionMode;

  videoHandling = this._improDataService.mediaHandling;

  files: WritableSignal<string[]> = signal([]);
  video: Signal<ElementRef<HTMLVideoElement>> = viewChild('videoPlayer');
  projectionMode: InputSignal<ProjectionMode> = input.required();

  mediaType: Signal<MediaType> = computed(() => {


    const mediaPath = this.currentVideoPath();

    if(mediaPath){
      const extension = mediaPath.split('.').pop()?.toLowerCase();
      if(extension && VIDEO_EXTENSIONS.includes(extension)){
        return MediaType.VIDEO;
      } else if(extension && IMG_EXTENSIONS.includes(extension)){
        return MediaType.IMAGE;
      }
    } else {
      return null;
    }
  });

  currentVideoPath: WritableSignal<string | null> = signal(null);
  folderPath: WritableSignal<string | null> = signal(null);

  constructor(
    private _userFilesService: UserFilesService,
    private _improDataService: ImproDataService
  ) {
    effect(() => {
      const videoValue = untracked(() => this.video());
      if (videoValue !== null && this.folderPath !== null &&  this.files() !== null) {
        this.onVideoAction(this.videoHandling.value());
      }
    });

  }


  ngOnInit(): void {
    // Abonnement pour le chemin du dossier
    this._userFilesService.getUserFolder().subscribe(path => {
      this.folderPath.set(path);
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
    // Crée le chemin complet avec le protocole file.html://
    this.currentVideoPath.set(`file://${this.folderPath()}/${fileName}`);
  }

  async onVideoAction(videoHandling: MediaHandling) {
    switch (videoHandling.action) {
      case MediaAction.SET:
        this.playVideo(videoHandling.videoId);
        break;
      case MediaAction.PLAY:
        await this.play();
        break;
      case MediaAction.PAUSE:
        this.pause();
        break;
      case MediaAction.SET_TIME:
        this.changeTime(videoHandling.numberValue);
        break;
      case MediaAction.SET_RATE:
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

  protected readonly MediaType = MediaType;
}
