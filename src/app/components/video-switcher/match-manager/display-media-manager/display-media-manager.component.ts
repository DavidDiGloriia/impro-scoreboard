import {
  Component,
  computed,
  DestroyRef, effect,
  ElementRef,
  inject,
  OnInit,
  Signal,
  signal,
  untracked,
  viewChild,
  WritableSignal
} from '@angular/core';
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {UserFilesService} from "@services/user-files.service";
import {NgForOf} from "@angular/common";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {ImproDataService} from "@services/impro-data.service";
import {MediaHandling} from "@models/media-handling";
import {MediaAction} from "@enums/video-action.enum";
import {MediaType} from "@enums/media-type.enum";
import {IMG_EXTENSIONS, PDF_EXTENSIONS, VIDEO_EXTENSIONS} from "@constants/media-extentions.constants";

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
      } else if(extension && PDF_EXTENSIONS.includes(extension)){
        return MediaType.PDF;
      }
    }
  });

  // PDF state
  currentPage = signal(1);
  totalPages = signal<number | null>(null);
  pdfScrollY = signal(0);
  pdfZoom = signal(1);

  pdfUrl: Signal<SafeResourceUrl | null> = computed(() => {
    if (this.mediaType() !== MediaType.PDF || !this.mediaPath()) {
      return null;
    }
    return this._sanitizer.bypassSecurityTrustResourceUrl(
      `${this.mediaPath()}?p=${this.currentPage()}#page=${this.currentPage()}&toolbar=0`
    );
  });

  pdfScaleTransform = computed(() => `scale(${this.pdfZoom()})`);

  private _destroyRef = inject(DestroyRef);

  constructor(private _userFilesService: UserFilesService,
              private _improDataService: ImproDataService,
              private _sanitizer: DomSanitizer,
  ) {

    effect(() => {
      this.mediaFile.set(this.videoHandling.value());
    });

    effect(() => {
      const type = this.mediaType();
      const path = this.mediaPath();
      if (type === MediaType.PDF && path) {
        untracked(() => {
          this.currentPage.set(1);
          this.pdfScrollY.set(0);
          this.pdfZoom.set(1);
          this.loadPdfPageCount(path);
        });
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

  // --- PDF controls ---

  async loadPdfPageCount(url: string): Promise<void> {
    try {
      const response = await fetch(url);
      const buffer = await response.arrayBuffer();
      const text = new TextDecoder('latin1').decode(buffer);
      const match = text.match(/\/Type\s*\/Pages[^>]*\/Count\s+(\d+)/);
      this.totalPages.set(match ? parseInt(match[1], 10) : null);
    } catch {
      this.totalPages.set(null);
    }
  }

  nextPage(): void {
    const max = this.totalPages();
    const next = this.currentPage() + 1;
    if (max === null || next <= max) {
      this.currentPage.set(next);
      this.pdfScrollY.set(0);
      this.sendAction(MediaAction.SET_PAGE, this.currentPage());
    }
  }

  prevPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.set(this.currentPage() - 1);
      this.pdfScrollY.set(0);
      this.sendAction(MediaAction.SET_PAGE, this.currentPage());
    }
  }

  scrollUp(): void {
    this.pdfScrollY.update(v => Math.min(v + 100, 0));
    this.sendAction(MediaAction.SET_SCROLL, this.pdfScrollY());
  }

  scrollDown(): void {
    this.pdfScrollY.update(v => v - 100);
    this.sendAction(MediaAction.SET_SCROLL, this.pdfScrollY());
  }

  zoomIn(): void {
    this.pdfZoom.update(v => Math.min(v + 0.25, 3));
    this.sendAction(MediaAction.SET_ZOOM, this.pdfZoom());
  }

  zoomOut(): void {
    this.pdfZoom.update(v => Math.max(v - 0.25, 0.5));
    this.sendAction(MediaAction.SET_ZOOM, this.pdfZoom());
  }

  private sendAction(action: MediaAction, numberValue: number): void {
    this._improDataService.saveVideoWatched(new MediaHandling({
      mediaId: this.mediaFile().videoId,
      action,
      numberValue,
    }))
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((data) => {
        this.mediaFile.set(data);
      });
  }

}
