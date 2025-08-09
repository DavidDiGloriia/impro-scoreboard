import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { AppComponent } from './app/app.component';
import { APP_CONFIG } from './environments/environment';

import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';

import { PageNotFoundComponent} from "./app/components";
import {HashLocationStrategy, LocationStrategy} from "@angular/common";

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
    ...(APP_CONFIG.production ? [{ provide: LocationStrategy, useClass: HashLocationStrategy }] : []),
    provideRouter([
      {
        path: 'projection',
        loadComponent: () => import('./app/components/projection/projection.component').then(m => m.ProjectionComponent),
        children: [
          {
            path: 'scoreboard',
            loadComponent: () => import('@components/projection/scoreboard/scoreboard.component').then(m => m.ScoreboardComponent)
          },
          {
            path: '**',
            redirectTo: 'scoreboard',
            pathMatch: 'full'
          }
        ]
      },
      {
        path: 'control',
        loadComponent: () => import('./app/components/video-switcher/video-switcher.component').then(m => m.VideoSwitcherComponent),
        children: [
          {
            path: 'match',
            loadComponent: () => import('./app/components/video-switcher/match-manager/match-manager.component').then(m => m.MatchManagerComponent)
          },
          {
            path: 'parameters',
            loadComponent: () => import('./app/components/video-switcher/teams-parameters/teams-parameters.component').then(m => m.TeamsParametersComponent)
          },
          {
            path: '**',
            redirectTo: 'parameters',
            pathMatch: 'full'
          }
        ]
      },
      {
        path: '**',
        component: PageNotFoundComponent
      },

    ])
  ]
}).catch(err => console.error(err));
