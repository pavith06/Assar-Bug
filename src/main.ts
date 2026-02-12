import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));

  window.onpopstate = function (e) {
    const currentUrl = window.location.href;
    if (!currentUrl.includes('login')) {
      window.history.forward();
    }
  }


//   document.addEventListener("contextmenu",

//   function(e) {
//           e.preventDefault();
//   }, false);
