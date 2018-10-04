import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
/// <reference path="../../node_modules/@types/node/index.d.ts"/>
/// <reference types="core-js" />
/// <reference types="node" />
/// <reference types="require" />
if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
