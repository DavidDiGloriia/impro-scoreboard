import {
  AfterViewInit,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  Signal,
  signal,
  ViewChild,
  WritableSignal
} from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';

import { UserFilesService } from "@services/user-files.service";
import { ImproDataService } from "@services/impro-data.service";
import { MediaHandling } from "@models/media-handling";
import { MediaAction } from "@enums/video-action.enum";
import { MediaType } from "@enums/media-type.enum";
import { IMG_EXTENSIONS, VIDEO_EXTENSIONS } from "@constants/media-extentions.constants";

@Component({
  selector: 'app-display-pubs-manager',
  standalone: true,
  imports: [NgForOf, NgIf, DragDropModule, FormsModule],
  templateUrl: './display-pubs-manager.component.html',
  styleUrls: ['./display-pubs-manager.component.scss']
})
export class DisplayPubsManagerComponent implements OnInit, AfterViewInit, OnDestroy {
  readonly MediaType = MediaType;

  folderPath: WritableSignal<string> = signal('');
  files: WritableSignal<string[]> = signal([]);

  @ViewChild('myVideo', { static: false }) videoRef?: ElementRef<HTMLVideoElement>;
  video: WritableSignal<HTMLVideoElement | null> = signal(null);

  mediaFile: WritableSignal<MediaHandling | null> = signal(null);
  videoHandling = this._improDataService.mediaHandling;

  loopEnabled: WritableSignal<boolean> = signal(false);
  disabledFiles: WritableSignal<Set<string>> = signal(new Set());

  private _destroyRef = inject(DestroyRef);
  private _imageTimeout: any = null;

  mediaPath = computed(() => {
    const m = this.mediaFile();
    if (!m) return null;
    const id = this.getMediaId(m);
    return id ? `file://${this.folderPath()}/${id}` : null;
  });

  mediaType: Signal<MediaType | undefined> = computed(() => {
    if (!this.mediaFile()) return undefined;
    const path = this.mediaPath();
    if (!path) return undefined;
    const ext = path.split('.').pop()?.toLowerCase();
    if (ext && VIDEO_EXTENSIONS.includes(ext)) return MediaType.VIDEO;
    if (ext && IMG_EXTENSIONS.includes(ext)) return MediaType.IMAGE;
    return undefined;
  });

  constructor(
    private _userFilesService: UserFilesService,
    private _improDataService: ImproDataService,
  ) {}

  ngOnInit(): void {
    this._userFilesService.getPubsFolder()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(path => this.folderPath.set(path));

    this.loadFiles();

    // Charger état loop et fichiers désactivés
    const savedLoop = localStorage.getItem('loopEnabled');
    if (savedLoop !== null) {
      this.loopEnabled.set(savedLoop === 'true');
    }

    const savedDisabled = localStorage.getItem('disabledFiles');
    if (savedDisabled) {
      try {
        this.disabledFiles.set(new Set(JSON.parse(savedDisabled)));
      } catch {
        this.disabledFiles.set(new Set());
      }
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.videoRef) this.video.set(this.videoRef.nativeElement);
    }, 0);
  }

  ngOnDestroy(): void {
    if (this._imageTimeout) {
      clearTimeout(this._imageTimeout);
      this._imageTimeout = null;
    }
    this.onMediaClick(null);
  }

  loadFiles(): void {
    this._userFilesService.getPubsMediaFiles()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(files => {
        const savedOrder = localStorage.getItem('mediaOrder');
        let orderedFiles = files;
        if (savedOrder) {
          try {
            const orderArray: string[] = JSON.parse(savedOrder);
            const filtered = orderArray.filter(f => files.includes(f));
            const missing = files.filter(f => !filtered.includes(f));
            orderedFiles = [...filtered, ...missing];
          } catch {
            orderedFiles = files;
          }
        }
        this.files.set(orderedFiles);
      });
  }

  onMediaClick(fileName: string | null): void {
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
    const id = this.getMediaId(this.mediaFile());
    if (!id || !videoEl) return;

    this._improDataService.saveVideoWatched(new MediaHandling({
      mediaId: id,
      action: MediaAction.PLAY
    }))
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(data => this.mediaFile.set(data));
  }

  pauseVideo(): void {
    const videoEl = this.video();
    const id = this.getMediaId(this.mediaFile());
    if (!id || !videoEl) return;

    this._improDataService.saveVideoWatched(new MediaHandling({
      mediaId: id,
      action: MediaAction.PAUSE
    }))
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(data => this.mediaFile.set(data));
  }

  onTimeUpdate(): void {
    const videoEl = this.video();
    const id = this.getMediaId(this.mediaFile());
    if (!id || !videoEl) return;

    this._improDataService.saveVideoWatched(new MediaHandling({
      mediaId: id,
      action: MediaAction.SET_TIME,
      numberValue: videoEl.currentTime
    }))
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(data => this.mediaFile.set(data));
  }

  onRateChange(): void {
    const videoEl = this.video();
    const id = this.getMediaId(this.mediaFile());
    if (!id || !videoEl) return;

    this._improDataService.saveVideoWatched(new MediaHandling({
      mediaId: id,
      action: MediaAction.SET_RATE,
      numberValue: videoEl.playbackRate
    }))
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(data => this.mediaFile.set(data));
  }

  drop(event: CdkDragDrop<string[]>) {
    const currentFiles = [...this.files()];
    moveItemInArray(currentFiles, event.previousIndex, event.currentIndex);
    this.files.set(currentFiles);

    const listEl = document.querySelector('.list-group');
    listEl?.classList.add('dropped');
    setTimeout(() => listEl?.classList.remove('dropped'), 300);

    localStorage.setItem('mediaOrder', JSON.stringify(currentFiles));
  }

  nextMedia(): void {
    if (this._imageTimeout) {
      clearTimeout(this._imageTimeout);
      this._imageTimeout = null;
    }

    const activeFiles = this.getActiveFiles();
    if (!activeFiles.length) {
      this.onEndOfMedia();
      return;
    }

    const currentId = this.getMediaId(this.mediaFile());
    const currentIndex = activeFiles.indexOf(currentId ?? '');
    let nextIndex = currentIndex + 1;
    if (currentIndex === -1) nextIndex = 0;

    if (nextIndex >= activeFiles.length) {
      if (this.loopEnabled()) {
        nextIndex = 0;
      } else {
        this.onEndOfMedia();
        return;
      }
    }

    const nextFile = activeFiles[nextIndex];
    if (!nextFile) {
      this.onEndOfMedia();
      return;
    }

    this.onMediaClick(nextFile);
  }

  onEndOfMedia(): void {
    if (this.loopEnabled()) {
      const activeFiles = this.getActiveFiles();
      if (activeFiles.length) {
        this.onMediaClick(activeFiles[0]);
        return;
      }
    }
    this.onMediaClick(null);
  }

  toggleFile(file: string): void {
    const updated = new Set(this.disabledFiles());
    if (updated.has(file)) updated.delete(file);
    else updated.add(file);
    this.disabledFiles.set(updated);

    // sauvegarde dans localStorage
    localStorage.setItem('disabledFiles', JSON.stringify([...updated]));

    const currentId = this.getMediaId(this.mediaFile());
    if (currentId && !this.isFileEnabled(currentId)) {
      this.nextMedia();
    }
  }

  toggleLoop(): void {
    const newVal = !this.loopEnabled();
    this.loopEnabled.set(newVal);

    // sauvegarde dans localStorage
    localStorage.setItem('loopEnabled', String(newVal));
  }

  private isFileEnabled(file: string | null | undefined): boolean {
    if (!file) return false;
    return !this.disabledFiles().has(file);
  }

  private getActiveFiles(): string[] {
    return this.files().filter(f => this.isFileEnabled(f));
  }

  private getMediaId(obj: any): string | null {
    if (!obj) return null;
    return obj.videoId ?? obj.mediaId ?? obj.media_id ?? null;
  }
}
