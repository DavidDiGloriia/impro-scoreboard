import { Component } from '@angular/core';
import {UpperCasePipe} from "@angular/common";

@Component({
  selector: 'app-screen-saver',
  imports: [
    UpperCasePipe
  ],
  templateUrl: './screen-saver.component.html',
  styleUrl: './screen-saver.component.scss'
})
export class ScreenSaverComponent {

}
