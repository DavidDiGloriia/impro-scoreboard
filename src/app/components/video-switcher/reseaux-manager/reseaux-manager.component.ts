import {Component} from '@angular/core';
import {SelectionManagerComponent} from './selection-manager/selection-manager.component';
import {MatchResultManagerComponent} from './match-result-manager/match-result-manager.component';

@Component({
  selector: 'app-reseaux-manager',
  imports: [
    SelectionManagerComponent,
    MatchResultManagerComponent,
  ],
  templateUrl: './reseaux-manager.component.html',
  styleUrl: './reseaux-manager.component.scss'
})
export class ReseauxManagerComponent {
}
