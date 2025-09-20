import {
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  OnInit,
  Signal,
  signal,
  ViewChild,
  WritableSignal,
  AfterViewInit
} from '@angular/core';
import { UserFilesService } from "@services/user-files.service";
import { NgForOf } from "@angular/common";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ImproDataService } from "@services/impro-data.service";
import { MediaHandling } from "@models/media-handling";
import { MediaAction } from "@enums/video-action.enum";
import { MediaType } from "@enums/media-type.enum";
import { IMG_EXTENSIONS, VIDEO_EXTENSIONS } from "@constants/media-extentions.constants";
import {CdkDragDrop, DragDropModule, moveItemInArray} from "@angular/cdk/drag-drop";

@Component({
  selector: 'app-display-pubs-manager',
  imports: [NgForOf, DragDropModule],
  templateUrl: './display-pubs-manager.component.html',
  styleUrl: './display-pubs-manager.component.scss'
})
export class DisplayPubsManagerComponent implements OnInit, AfterViewInit {
  readonly MediaType = MediaType;

  folderPath: WritableSignal<string> = signal('');
  files: WritableSignal<string[]> = signal([]);

  @ViewChild('myVideo', { static: false }) videoRef!: ElementRef<HTMLVideoElement>;
  video: WritableSignal<HTMLVideoElement | null> = signal(null);

  mediaFile: WritableSignal<MediaHandling> = signal(null);
  videoHandling = this._improDataService.mediaHandling;

  private _destroyRef = inject(DestroyRef);
  private _imageTimeout: any;

  mediaPath = computed(() => {
    if (!this.mediaFile()) return null;
    return this.mediaFile().videoId ? `file://${this.folderPath()}/${this.mediaFile().videoId}` : null;
  });

  mediaType: Signal<MediaType> = computed(() => {
    if (!this.mediaFile()) return undefined;
    const path = this.mediaPath();
    if (!path) return undefined;

    const ext = path.split('.').pop()?.toLowerCase();
    if (ext && VIDEO_EXTENSIONS.includes(ext)) return MediaType.VIDEO;
    if (ext && IMG_EXTENSIONS.includes(ext)) return MediaType.IMAGE;
  });

  constructor(
    private _userFilesService: UserFilesService,
    private _improDataService: ImproDataService,
  ) {
    effect(() => {
      this.mediaFile.set(this.videoHandling.value());
    });
  }

  ngOnInit(): void {
    this._userFilesService.getPubsFolder()
      .subscribe(path => this.folderPath.set(path));

    this.loadFiles();

    // Charger l'ordre sauvegardé
    const savedOrder = localStorage.getItem('mediaOrder');
    if (savedOrder) {
      const orderArray: string[] = JSON.parse(savedOrder);
      // On garde uniquement les fichiers encore existants
      const filtered = orderArray.filter(f => this.files().includes(f));
      const missing = this.files().filter(f => !filtered.includes(f));
      this.files.set([...filtered, ...missing]); // merge avec nouveaux fichiers
    }
  }

  ngAfterViewInit(): void {
    if (this.videoRef) {
      this.video.set(this.videoRef.nativeElement);
    }
  }

  loadFiles(): void {
    this._userFilesService.getPubsMediaFiles()
      .subscribe(files => {
        // Vérifier si un ordre est déjà en localStorage
        const savedOrder = localStorage.getItem('mediaOrder');
        let orderedFiles = files;

        if (savedOrder) {
          const orderArray: string[] = JSON.parse(savedOrder);
          const filtered = orderArray.filter(f => files.includes(f));
          const missing = files.filter(f => !filtered.includes(f));
          orderedFiles = [...filtered, ...missing];
        }

        this.files.set(orderedFiles);
      });
  }


  onMediaClick(fileName: string): void {
    if (this._imageTimeout) {
      clearTimeout(this._imageTimeout);
      this._imageTimeout = null;
    }

    this._improDataService.saveVideoWatched(new MediaHandling({
      mediaId: fileName,
      action: MediaAction.SET
    }))
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(data => this.mediaFile.set(data));
  }

  playVideo(): void {
    const videoEl = this.video();
    if (!this.mediaFile()?.videoId || !videoEl) return;

    this._improDataService.saveVideoWatched(new MediaHandling({
      mediaId: this.mediaFile().videoId,
      action: MediaAction.PLAY
    }))
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(data => this.mediaFile.set(data));
  }

  pauseVideo(): void {
    const videoEl = this.video();
    if (!this.mediaFile()?.videoId || !videoEl) return;

    this._improDataService.saveVideoWatched(new MediaHandling({
      mediaId: this.mediaFile().videoId,
      action: MediaAction.PAUSE
    }))
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(data => this.mediaFile.set(data));
  }

  onTimeUpdate(): void {
    const videoEl = this.video();
    if (!this.mediaFile()?.videoId || !videoEl) return;

    this._improDataService.saveVideoWatched(new MediaHandling({
      mediaId: this.mediaFile().videoId,
      action: MediaAction.SET_TIME,
      numberValue: videoEl.currentTime,
    }))
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(data => this.mediaFile.set(data));
  }

  onRateChange(): void {
    const videoEl = this.video();
    if (!this.mediaFile()?.videoId || !videoEl) return;

    this._improDataService.saveVideoWatched(new MediaHandling({
      mediaId: this.mediaFile().videoId,
      action: MediaAction.SET_RATE,
      numberValue: videoEl.playbackRate,
    }))
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(data => this.mediaFile.set(data));
  }

  drop(event: CdkDragDrop<string[]>) {
    const currentFiles = [...this.files()];
    moveItemInArray(currentFiles, event.previousIndex, event.currentIndex);
    this.files.set(currentFiles);

    // Feedback visuel rapide
    const listEl = document.querySelector('.list-group');
    listEl?.classList.add('dropped');
    setTimeout(() => listEl?.classList.remove('dropped'), 300);

    // Sauvegarde dans localStorage


    localStorage.setItem('mediaOrder', JSON.stringify(currentFiles));
  }
  /** Passe automatiquement au média suivant */
  nextMedia(): void {
    if (this._imageTimeout) {
      clearTimeout(this._imageTimeout);
      this._imageTimeout = null;
    }

    const currentIndex = this.files().indexOf(this.mediaFile()?.videoId);
    const nextIndex = (currentIndex + 1) % this.files().length;
    const nextFile = this.files()[nextIndex];

    if (!nextFile) return;

    const ext = nextFile.split('.').pop()?.toLowerCase();
    if (VIDEO_EXTENSIONS.includes(ext)) {
      this.onMediaClick(nextFile);
    } else if (IMG_EXTENSIONS.includes(ext)) {
      this.onMediaClick(nextFile);
      this._imageTimeout = setTimeout(() => {
        this.nextMedia();
      }, 30_000);
    }
  }
}
