import {Component} from '@angular/core';
import {SelectionManagerComponent} from './selection-manager/selection-manager.component';

export enum ReseauxScreen {
  SELECTION = 'SELECTION',
}

@Component({
  selector: 'app-reseaux-manager',
  imports: [
    SelectionManagerComponent
  ],
  templateUrl: './reseaux-manager.component.html',
  styleUrl: './reseaux-manager.component.scss'
})
export class ReseauxManagerComponent {
  readonly ReseauxScreen = ReseauxScreen;
  activeScreen: ReseauxScreen = ReseauxScreen.SELECTION;

  displayScreen(screen: ReseauxScreen) {
    this.activeScreen = screen;
  }
}
