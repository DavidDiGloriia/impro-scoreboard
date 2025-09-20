import {Component, effect, inject, model, ModelSignal, signal, WritableSignal} from '@angular/core';
import {ImproData} from "@models/impro-data";
import {ImproType} from "@enums/impro-type.enum";
import {FormsModule} from "@angular/forms";
import {ImproNbPlayers} from "@enums/impro-nb-players.enum";
import {values} from 'lodash-es';
import { ImproNbPlayersShortLabel} from "@constants/impro-nb-players.constants";
import {ImproCsvService} from "@services/impro-csv.service";

@Component({
  selector: 'app-impro-manager-panel',
  imports: [
    FormsModule,

  ],
  templateUrl: './impro-manager-panel.component.html',
  styleUrl: './impro-manager-panel.component.scss'
})
export class ImproManagerPanelComponent {
  protected readonly ImproType = ImproType;
  protected readonly ImproNbPlayersValues = values(ImproNbPlayers);
  protected readonly ImproNbPlayersLabel = ImproNbPlayersShortLabel;
  protected readonly ImproNbPlayers = ImproNbPlayers;


  improData: ModelSignal<ImproData> = model.required();
  improDataForm: WritableSignal<ImproData> = signal(ImproData.newInstance());

  improDurationMinutes: WritableSignal<number> = signal(0);
  improDurationSeconds: WritableSignal<number> = signal(0);
  isDirty: WritableSignal<boolean> = signal(false);

  private _improCsvService: ImproCsvService = inject(ImproCsvService)

  constructor() {
    effect(() => {
      this.improDataForm.set(this.improData().clone());
    });
  }


  onTypeChange(value: ImproType) {
    this.improDataForm.update((improData: ImproData) => {
      return improData.clone().withType(value);
    });
    this.isDirty.set(true);
  }

  onNbPlayersChange(value: ImproNbPlayers) {
    this.improDataForm.update((improData: ImproData) => {
      return improData.clone().withNbPlayers(value);
    });
    this.isDirty.set(true);
  }

  sendData(): void {
    this.improData.set(this.improDataForm().clone()
      .withIsImproRunning(true)
      .withTitle(this.improDataForm().title || 'Pas de titre')
      .withCategory(this.improDataForm().category || 'Libre'));
    this.isDirty.set(false);
  }

  onImproTitleChange(value: string) {
    this.improDataForm.update((improData: ImproData) => {
      return improData.clone().withTitle(value);
    });
    this.isDirty.set(true);
  }

  onCustomNbPlayersChange(value: string) {
    this.improDataForm.update((improData: ImproData) => {
      return improData.clone().withCustomNbPlayerLabel(value);
    });
    this.isDirty.set(true);
    }

  OnImproCategoryChange(value: string) {
    this.improDataForm.update((improData: ImproData) => {
      return improData.clone().withCategory(value);
    });
    this.isDirty.set(true);
  }

  onImproDurationChange(number: number) {
    this.improDataForm.update((improData: ImproData) => {
      return improData.clone().withDuration(number);
    });

    this.improDurationMinutes.set(Math.floor(number / 60));
    this.improDurationSeconds.set(number % 60);
    this.isDirty.set(true);
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

  endImpro() {
    this._improCsvService.addImpro(this.improData().toDto())
    this.improData.set(ImproData.newInstance().withIsImproRunning(false));
    this.isDirty.set(false);
  }

  onReviseImpro() {
    this.improData.set(this.improDataForm().clone());
    this.isDirty.set(false);
  }

  onAlsoReviseDurationChange(value: boolean) {
    this.improDataForm.update((improData: ImproData) => {
      return improData.clone().withAlsoReviseDuration(value);
    });
  }
}
