import {Component} from '@angular/core';
import {SelectionManagerComponent} from './selection-manager/selection-manager.component';

@Component({
  selector: 'app-reseaux-manager',
  imports: [
    SelectionManagerComponent,
  ],
  templateUrl: './reseaux-manager.component.html',
  styleUrl: './reseaux-manager.component.scss'
})
export class ReseauxManagerComponent {
}
