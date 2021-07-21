<% if (props.ui === 'ionic') { -%>
import { Component, OnInit, OnDestroy } from '@angular/core';
<% } else if (props.target.includes('cordova')) { -%>
import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
<% } else { -%>
import { Component, OnInit, OnDestroy } from '@angular/core';
<% } -%>
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { merge } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
<% if (props.ui === 'ionic') { -%>
<%   if (props.target.includes('cordova')) { -%>
import { Platform } from '@ionic/angular';
<%   } -%>
<% } -%>
<% if (props.target.includes('cordova')) { -%>
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { Keyboard } from '@ionic-native/keyboard/ngx';
<% } -%>
<% if (props.angulartics && props.analyticsProvider === 'ga') { -%>
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga';
<% } -%>

import { environment } from '@env/environment';
import { Logger, UntilDestroy, untilDestroyed } from '@shared';
import { I18nService } from '@app/i18n';

<% if (props.target.includes('cordova')) { -%>

<% } -%>
const log = new Logger('App');

@UntilDestroy()
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private titleService: Title,
              private translateService: TranslateService,
<% if (props.target.includes('cordova')) { -%>
<%  if (props.ui === 'ionic') { -%>
              private platform: Platform,
<%   } else { -%>
              private zone: NgZone,
<%   } -%>
              private keyboard: Keyboard,
              private statusBar: StatusBar,
              private splashScreen: SplashScreen,
<% } -%>
<% if (props.angulartics && props.analyticsProvider === 'ga') { -%>
              // do not remove the analytics injection, even if the call in ngOnInit() is removed
              // this injection initializes page tracking through the router
              private angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics,
<% } -%>
              private i18nService: I18nService) { }

<%   if (props.target.includes('cordova')) { -%>
  async ngOnInit() {
<%   } else { -%>
  ngOnInit() {
<%   } -%>
    // Setup logger
    if (environment.production) {
      Logger.enableProductionMode();
    }

    log.debug('init');

<% if (props.angulartics && props.analyticsProvider === 'ga') { -%>
    this.angulartics2GoogleAnalytics.startTracking();
    this.angulartics2GoogleAnalytics.eventTrack(environment.version || 'dev', { category: 'App initialized' });
<% } -%>

    // Setup translations
    this.i18nService.init(environment.defaultLanguage, environment.supportedLanguages);

    const onNavigationEnd = this.router.events.pipe(filter(event => event instanceof NavigationEnd));

    // Change page title on navigation or language change, based on route data
    merge(this.translateService.onLangChange, onNavigationEnd)
      .pipe(
        map(() => {
          let route = this.activatedRoute;
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        filter(route => route.outlet === 'primary'),
        switchMap(route => route.data),
        untilDestroyed(this)
      )
      .subscribe(event => {
        const title = event.title;
        if (title) {
          this.titleService.setTitle(this.translateService.instant(title));
        }
      });
<% if (props.ui === 'ionic') { -%>

<%   if (props.target.includes('cordova')) { -%>

    // Cordova platform and plugins initialization
    await this.platform.ready();
    this.onCordovaReady();
<%   } -%>
<% } else if (props.target.includes('cordova')) { -%>
    // Cordova platform and plugins initialization
    document.addEventListener('deviceready', () => {
      this.zone.run(() => this.onCordovaReady());
    }, false);
<% } -%>
  }

  ngOnDestroy() {
    this.i18nService.destroy();
  }
<% if (props.target.includes('cordova')) { -%>

  private onCordovaReady() {
    log.debug('device ready');

    if ((window as any).cordova) {
      log.debug('Cordova init');

      this.keyboard.hideFormAccessoryBar(true);
<% if (props.ui === 'ionic') { -%>
      this.statusBar.styleLightContent();
<% } else { -%>
      this.statusBar.styleDefault();
<% } -%>
      this.splashScreen.hide();
    }
  }
<% } -%>

}
