import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import { APP_CONFIG } from '../../../environments/environment';
import {JsonPipe} from "@angular/common";


@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss'],
  imports: [
    JsonPipe
  ],
  standalone: true
})
export class PageNotFoundComponent implements OnInit {
  attemptedUrl = '';

  constructor(private router: Router) {
    // récupère l'URL en cours
    this.attemptedUrl = this.router.url;
  }
  ngOnInit(): void {
  }

  protected readonly APP_CONFIG = APP_CONFIG;
}
