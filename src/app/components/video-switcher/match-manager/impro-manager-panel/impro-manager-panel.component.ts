import {Component, model, ModelSignal} from '@angular/core';
import {GameData} from "@models/game-data";

@Component({
  selector: 'app-impro-manager-panel',
  imports: [],
  templateUrl: './impro-manager-panel.component.html',
  styleUrl: './impro-manager-panel.component.scss'
})
export class ImproManagerPanelComponent {
  gameData: ModelSignal<GameData> = model.required();


}
