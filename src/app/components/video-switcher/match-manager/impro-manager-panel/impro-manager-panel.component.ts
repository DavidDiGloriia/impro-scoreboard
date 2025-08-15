import {Component, effect, model, ModelSignal, signal, WritableSignal} from '@angular/core';
import {ImproData} from "@models/impro-data";
import {ImproType} from "@enums/impro-type.enum";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-impro-manager-panel',
  imports: [
    FormsModule
  ],
  templateUrl: './impro-manager-panel.component.html',
  styleUrl: './impro-manager-panel.component.scss'
})
export class ImproManagerPanelComponent {
  protected readonly ImproType = ImproType;

  improData: ModelSignal<ImproData> = model.required();
  improDataForm: WritableSignal<ImproData> = signal(ImproData.newInstance());

  constructor() {
    effect(() => {
      this.improDataForm.set(this.improData());
    });
  }


  onTypeChange(value: ImproType) {
    this.improDataForm.update((improData: ImproData) => {
      return improData.clone().withType(value);
    });
  }

  sendData(): void {
    this.improData.set(this.improDataForm().clone())
  }
}
