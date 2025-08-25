import {Component, DestroyRef, HostListener, inject, OnInit} from '@angular/core';
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {ImproDataService} from "@services/impro-data.service";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {findIndex} from "lodash-es";

@Component({
  selector: 'app-display-anthem-manager',
  imports: [
    NgClass,
    NgIf,
    NgForOf
  ],
  templateUrl: './display-anthem-manager.component.html',
  styleUrl: './display-anthem-manager.component.scss'
})
export class DisplayAnthemManagerComponent implements OnInit {
  lines: string[] = [
    '<br><br>',
    'Sur la patoche, nous resterons toute une vie<br>' +
    'Pour t\'aimer, toutes nos impros sont libres<br>',
    'A toi nos voix, nos maillots et notre rire<br>' +
    'C\'est à toi, public que l\'on sourit',
    'Notre caucus nous donnera des ailes<br>' +
    'Pour les mixtes et pour les comparées<br>',
    'Gardant en tête pour réplique éternelle<br>' +
    'Le match, l\'impro, la liberté',
    'Gardant en tête pour réplique éternelle<br>' +
    'Le match, l\'impro, la liberté<br>',
    'Improvisatie en vrijheid<br>' +
    'Improvisation und Freiheit',
    '<br><br>'
  ];

  currentIndex = 0;

  private _destroyRef = inject(DestroyRef);

  constructor(private _improDataService: ImproDataService) {
  }

  ngOnInit() {
    this.currentIndex = findIndex(this.lines, (line) => line === this._improDataService.anthemLine.value()) || -1;
  }

  setLine(index: number) {
    this.currentIndex = index;
    this._saveLine();
  }

  prevLine() {
    if (this.currentIndex > 0) {
      this.currentIndex = this.currentIndex - 1;
      this._saveLine();
    }
  }

  nextLine() {
    if (this.currentIndex < this.lines.length - 1) {
      this.currentIndex = this.currentIndex + 1;
      this._saveLine();
    }
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      this.prevLine();
    }
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      this.nextLine();
    }
  }

  private _saveLine() {
    this._improDataService.saveAnthemLine(this.lines[this.currentIndex])
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe()
  }
}
