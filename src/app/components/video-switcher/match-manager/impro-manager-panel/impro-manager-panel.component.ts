import {Component, effect, model, ModelSignal, signal, WritableSignal} from '@angular/core';
import {ImproData} from "@models/impro-data";
import {ImproType} from "@enums/impro-type.enum";
import {FormsModule} from "@angular/forms";
import {ImproNbPlayers} from "@enums/impro-nb-players.enum";
import {values} from 'lodash-es';
import { ImproNbPlayersShortLabel} from "@constants/impro-nb-players.constants";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-impro-manager-panel',
  imports: [
    FormsModule,
    NgForOf
  ],
  templateUrl: './impro-manager-panel.component.html',
  styleUrl: './impro-manager-panel.component.scss'
})
export class ImproManagerPanelComponent {
  protected readonly ImproType = ImproType;
  protected readonly ImproNbPlayersValues = values(ImproNbPlayers);
  protected readonly ImproNbPlayersLabel = ImproNbPlayersShortLabel;

  improData: ModelSignal<ImproData> = model.required();
  improDataForm: WritableSignal<ImproData> = signal(ImproData.newInstance());

  improDurationMinutes: WritableSignal<number> = signal(0);
  improDurationSeconds: WritableSignal<number> = signal(0);

  constructor() {
    effect(() => {
      this.improDataForm.set(this.improData().clone());
    });
  }


  onTypeChange(value: ImproType) {
    this.improDataForm.update((improData: ImproData) => {
      return improData.clone().withType(value);
    });
  }

  onNbPlayersChange(value: ImproNbPlayers) {
    this.improDataForm.update((improData: ImproData) => {
      return improData.clone().withNbPlayers(value);
    });
  }

  sendData(): void {
    this.improData.set(this.improDataForm().clone())
  }

  onImproTitleChange(value: string) {
    this.improDataForm.update((improData: ImproData) => {
      return improData.clone().withTitle(value);
    });
  }

  setImproCategoryFree() {
    this.improDataForm.update((improData: ImproData) => {
      return improData.clone().withCategory('libre');
    });
  }

  OnImproCategoryChange(value: string) {
    this.improDataForm.update((improData: ImproData) => {
      return improData.clone().withCategory(value);
    });
  }

  onImproDurationChange(number: number) {
    this.improDataForm.update((improData: ImproData) => {
      return improData.clone().withDuration(number);
    });

    this.improDurationMinutes.set(Math.floor(number / 60));
    this.improDurationSeconds.set(number % 60);
  }

  onImproDurationMinutesChange(value: number) {
    this.improDurationMinutes.set(value);
    const totalSeconds = value * 60 + this.improDurationSeconds();
    this.onImproDurationChange(totalSeconds);
  }

  onImproDurationSecondsChange(value: number) {
    this.improDurationSeconds.set(value);
    const totalSeconds = this.improDurationMinutes() * 60 + value;
    this.onImproDurationChange(totalSeconds);
  }
}
