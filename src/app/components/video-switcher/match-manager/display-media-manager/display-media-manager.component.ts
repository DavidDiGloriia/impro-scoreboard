import {
  Component,
  computed,
  DestroyRef, effect,
  ElementRef,
  inject,
  OnInit,
  Signal,
  signal,
  viewChild,
  WritableSignal
} from '@angular/core';
import {UserFilesService} from "@services/user-files.service";
import {NgForOf} from "@angular/common";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {ImproDataService} from "@services/impro-data.service";
import {MediaHandling} from "@models/media-handling";
import {MediaAction} from "@enums/video-action.enum";
import {MediaType} from "@enums/media-type.enum";
import {IMG_EXTENSIONS, VIDEO_EXTENSIONS} from "@constants/media-extentions.constants";

@Component({
  selector: 'app-display-video-manager',
  imports: [
    NgForOf,
  ],
  templateUrl: './display-media-manager.component.html',
  styleUrl: './display-media-manager.component.scss'
})
export class DisplayMediaManagerComponent implements OnInit {
  readonly MediaType = MediaType;

  folderPath: WritableSignal<string> = signal('');
  files: WritableSignal<string[]> = signal([]);

  video: Signal<ElementRef<HTMLVideoElement>> = viewChild('myVideo');
  mediaFile: WritableSignal<MediaHandling> = signal(null);
  videoHandling = this._improDataService.mediaHandling;

  mediaPath = computed(() => {
    if(!this.mediaFile()){
      return null;
    }

    return this.mediaFile().videoId ? `file://${this.folderPath()}/${this.mediaFile().videoId}` : null;
  })

  mediaType: Signal<MediaType> = computed(() => {
    if(!this.mediaFile()){
      return undefined;
    }

    const mediaPath = this.mediaPath();

    if(mediaPath){
      const extension = mediaPath.split('.').pop()?.toLowerCase();
      if(extension && VIDEO_EXTENSIONS.includes(extension)){
        return MediaType.VIDEO;
      } else if(extension && IMG_EXTENSIONS.includes(extension)){
        return MediaType.IMAGE;
      }
    }
  });

  private _destroyRef = inject(DestroyRef);

  constructor(private _userFilesService: UserFilesService,
              private _improDataService: ImproDataService,
  ) {

    effect(() => {
      this.mediaFile.set(this.videoHandling.value());
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
    this._userFilesService.getMediaFiles().subscribe(files => {
      this.files.set(files);
    });
  }

  onMediaClick(video: string): void {
    this._improDataService.saveVideoWatched(new MediaHandling({
      mediaId: video,
      action: MediaAction.SET
    }))
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((data) => {
        this.mediaFile.set(data);
      });
  }

  playVideo(): void {
    this._improDataService.saveVideoWatched(new MediaHandling({
      mediaId: this.mediaFile().videoId,
      action: MediaAction.PLAY
    }))
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((data) => {
        this.mediaFile.set(data);
      });
  }

  pauseVideo(): void {
    this._improDataService.saveVideoWatched(new MediaHandling({
      mediaId: this.mediaFile().videoId,
      action: MediaAction.PAUSE
    }))
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((data) => {
        this.mediaFile.set(data);
      });
  }

  onTimeUpdate(): void {
    this._improDataService.saveVideoWatched(new MediaHandling({
      mediaId: this.mediaFile().videoId,
      action: MediaAction.SET_TIME,
      numberValue: this.video().nativeElement.currentTime,
    }))
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((data) => {
        this.mediaFile.set(data);
      });
  }

  onRateChange(): void {
    this._improDataService.saveVideoWatched(new MediaHandling({
      mediaId: this.mediaFile().videoId,
      action: MediaAction.SET_RATE,
      numberValue: this.video().nativeElement.playbackRate,
    }))
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((data) => {
        this.mediaFile.set(data);
      });
  }

}
