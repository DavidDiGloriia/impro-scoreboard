import {
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  OnInit,
  Signal,
  signal, viewChild,
  WritableSignal
} from '@angular/core';
import {UserFilesService} from "@services/user-files.service";
import { NgForOf, NgIf} from "@angular/common";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {ImproDataService} from "@services/impro-data.service";
import {VideoHandling} from "@models/video-handling";
import {VideoAction} from "@enums/video-action.enum";

@Component({
  selector: 'app-display-video-manager',
  imports: [
    NgForOf,
    NgIf
  ],
  templateUrl: './display-video-manager.component.html',
  styleUrl: './display-video-manager.component.scss'
})
export class DisplayVideoManagerComponent implements OnInit {
  folderPath: string = '';
  files: string[] = [];

  video: Signal<ElementRef<HTMLVideoElement>> = viewChild('myVideo');
  videoFile: WritableSignal<VideoHandling> = signal(null);
  videoPath = computed(() => {
    if(!this.videoFile()){
      return null;
    }

    return this.videoFile().videoId ? `file://${this.folderPath}/${this.videoFile().videoId}` : null;
  })

  private _destroyRef = inject(DestroyRef);

  constructor(private _userFilesService: UserFilesService,
              private _improDataService: ImproDataService,
  ) {}

  ngOnInit(): void {
    // Abonnement pour le chemin du dossier
    this._userFilesService.getUserFolder().subscribe(path => {
      this.folderPath = path;
    });

    // Abonnement pour la liste des fichiers
    this.loadFiles();
  }

  loadFiles(): void {
    this._userFilesService.getMP4Files().subscribe(files => {
      this.files = files;
    });
  }

  refreshFiles(): void {
    this.loadFiles();
  }

  onVideoClick(video: string): void {
    this._improDataService.saveVideoWatched(new VideoHandling({
      videoId: video,
      action: VideoAction.SET
    }))
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((data) => {
        this.videoFile.set(data);
      });
  }

  playVideo(): void {
    this._improDataService.saveVideoWatched(new VideoHandling({
      videoId: this.videoFile().videoId,
      action: VideoAction.PLAY
    }))
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((data) => {
        this.videoFile.set(data);
      });
  }

  pauseVideo(): void {
    this._improDataService.saveVideoWatched(new VideoHandling({
      videoId: this.videoFile().videoId,
      action: VideoAction.PAUSE
    }))
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((data) => {
        this.videoFile.set(data);
      });
  }

  onTimeUpdate(): void {
    this._improDataService.saveVideoWatched(new VideoHandling({
      videoId: this.videoFile().videoId,
      action: VideoAction.SET_TIME,
      numberValue: this.video().nativeElement.currentTime,
    }))
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((data) => {
        this.videoFile.set(data);
      });
  }

  onRateChange(): void {
    this._improDataService.saveVideoWatched(new VideoHandling({
      videoId: this.videoFile().videoId,
      action: VideoAction.SET_RATE,
      numberValue: this.video().nativeElement.playbackRate,
    }))
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((data) => {
        this.videoFile.set(data);
      });
  }

}
