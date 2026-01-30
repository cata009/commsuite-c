import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

// Use environment if available (skipping env import for brevity, assuming dev)
// if (environment.production) { enableProdMode(); }

platformBrowserDynamic().bootstrapModule(AppModule)
    .catch(err => console.error(err));
