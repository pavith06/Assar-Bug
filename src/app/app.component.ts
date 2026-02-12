import { Component, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from './service/auth.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'recoveryPortalFrontend';
  selectroute = false;
  Router: any;

  constructor(private router: Router, private activatedRoute: ActivatedRoute,public translate: TranslateService,private service:AuthService,public renderer: Renderer2) {


    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {

        this.selectroute = event.url !== '/' && !event.url.includes('login');
        if(event.url.includes('common-reset-password')){
          this.selectroute = false;
        }
      }
    });

    translate.addLangs(['English','French']);//'Arabic'

    translate.setDefaultLang('English');

    // const browserLang = 'English';
    const browserLang = localStorage.getItem('Language')!==null?localStorage.getItem('Language'):'English';


    translate.use(browserLang.match(/English|French/) ? browserLang : 'English');
  }
  lang:string;

  ngOnInit(): void {
    this.dashboardrouting();
    this.lang = localStorage.getItem('Language');
    if (this.lang)
    {
      this.changeLang(this.lang);

    }
  }

  dashboardrouting() {
    this.router.events.subscribe((url: any) =>
    (url));
    //   if(this.route.snapshot.routeConfig.path==='login'){

    //     this.selectroute=false;
    // }else if(this.route.snapshot.routeConfig.path==='common-reset-password/:userIdentity/:userName'){
    //   this.selectroute=false;
    // }
  }

  showReportLoss(data: { claimId: number, isReceivable: boolean }): void {
    this.router.navigateByUrl('/report-loss?claimId=' + data.claimId + "&rec=" + data.isReceivable);
  }
  changeLang(lang: string) {

  //  if(lang ==='Arabic'){


  //   this.renderer.setAttribute(document.body, 'dir', 'rtl');
  //   this.renderer.addClass(document.body, 'arabic');
  //   localStorage.setItem('Language',lang );
  //  }

  //  else{

    if(lang ==='French'){

      this.renderer.setAttribute(document.body, 'dir', 'ltr');
      this.renderer.addClass(document.body, 'french');
      this.renderer.removeClass(document.body, 'arabic');
      localStorage.setItem('Language',lang );

     }
     else{
    this.renderer.setAttribute(document.body, 'dir', 'ltr');
    this.renderer.removeClass(document.body, 'arabic');
    this.renderer.removeClass(document.body, 'french');
    localStorage.setItem('Language',lang );
  }

  //  }

   setTimeout(() => {
    this.translate.use(lang);
   }, 1000);


}
}
