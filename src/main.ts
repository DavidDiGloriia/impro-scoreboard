import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { AppComponent } from './app/app.component';
import { APP_CONFIG } from './environments/environment';

import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';

import {ScoreboardComponent, PageNotFoundComponent} from "./app/components";

// AoT requires an exported function for factories
export function httpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

if (APP_CONFIG.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    provideRouter([
      {
        path: 'projection',
        component: ScoreboardComponent
      },
      {
        path: 'control',
        loadComponent: () => import('./app/components/video-switcher/video-switcher.component').then(m => m.VideoSwitcherComponent)
      },
      {
        path: '**',
        component: PageNotFoundComponent
      },

    ])
  ]
}).catch(err => console.error(err));
