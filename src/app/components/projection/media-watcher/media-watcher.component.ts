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
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {UserFilesService} from "@services/user-files.service";
import {NgIf, NgStyle} from "@angular/common";
import {ImproDataService} from "@services/impro-data.service";
import {MediaHandling} from "@models/media-handling";
import {MediaAction} from "@enums/video-action.enum";
import {ProjectionMode} from "@enums/projection-mode.enum";
import {IMG_EXTENSIONS, PDF_EXTENSIONS, VIDEO_EXTENSIONS} from "@constants/media-extentions.constants";
import {MediaType} from "@enums/media-type.enum";

@Component({
  selector: 'app-media-watcher',
  imports: [
    NgIf,
    NgStyle,
  ],
  templateUrl: './media-watcher.component.html',
  styleUrl: './media-watcher.component.scss'
})
export class MediaWatcherComponent implements OnInit {
  protected readonly ProjectionMode = ProjectionMode;

  videoHandling = this._improDataService.mediaHandling;
  screenStyle = this._improDataService.screenStyle;
  containerStyle = this._improDataService.containerStyle;

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
      } else if(extension && PDF_EXTENSIONS.includes(extension)){
        return MediaType.PDF;
      }
    } else {
      return null;
    }
  });

  currentVideoPath: WritableSignal<string | null> = signal(null);
  folderPath: WritableSignal<string | null> = signal(null);

  // PDF state
  currentPage = signal(1);
  pdfScrollY = signal(0);
  pdfZoom = signal(1);

  pdfUrl: Signal<SafeResourceUrl | null> = computed(() => {
    if (this.mediaType() !== MediaType.PDF || !this.currentVideoPath()) {
      return null;
    }
    return this._sanitizer.bypassSecurityTrustResourceUrl(
      `${this.currentVideoPath()}?p=${this.currentPage()}#page=${this.currentPage()}&toolbar=0`
    );
  });

  pdfScaleTransform = computed(() => `scale(${this.pdfZoom()})`);

  constructor(
    private _userFilesService: UserFilesService,
    private _improDataService: ImproDataService,
    private _sanitizer: DomSanitizer,
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
    this._userFilesService.getMatchFolder().subscribe(path => {
      this.folderPath.set(path);
    });

    // Abonnement pour la liste des fichiers
    this.loadFiles();
  }

  loadFiles(): void {
    this._userFilesService.listPubsFiles().subscribe(files => {
      this.files.set(files)
    });
  }

  playVideo(fileName: string) {
    // Crée le chemin complet avec le protocole file://
    this.currentVideoPath.set(`file://${this.folderPath()}/${fileName}`);
  }

  async onVideoAction(videoHandling: MediaHandling) {
    switch (videoHandling.action) {
      case MediaAction.SET:
        this.currentPage.set(1);
        this.pdfScrollY.set(0);
        this.pdfZoom.set(1);
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
      case MediaAction.SET_PAGE:
        this.currentPage.set(videoHandling.numberValue);
        this.pdfScrollY.set(0);
        break;
      case MediaAction.SET_SCROLL:
        this.pdfScrollY.set(videoHandling.numberValue);
        break;
      case MediaAction.SET_ZOOM:
        this.pdfZoom.set(videoHandling.numberValue);
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
