import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
<% if (props.ui === 'ionic') { -%>
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule } from '@ionic/angular';
<%   if (props.target.includes('cordova')) { -%>
import { Platform } from '@ionic/angular';
<%   } -%>
<% } -%>
<% if (props.target.includes('cordova')) { -%>
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
<% } -%>
<% if (props.angulartics && props.analyticsProvider === 'ga') { -%>
import { Angulartics2Module } from 'angulartics2';
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga';
<% } -%>

import { CoreModule } from '@core';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
<% if (props.target.includes('cordova')) { -%>

  let statusBarSpy: any, splashScreenSpy: any, platformReadySpy: any;
<%   if (props.ui === 'ionic') { -%>
  let platformSpy: any;
<%   } -%>

<% } -%>
  beforeEach(async(() => {
<% if (props.target.includes('cordova')) { -%>
    statusBarSpy = jasmine.createSpyObj('StatusBar', ['styleDefault']);
    splashScreenSpy = jasmine.createSpyObj('SplashScreen', ['hide']);
    platformReadySpy = Promise.resolve();
<%   if (props.ui === 'ionic') { -%>
    platformSpy = jasmine.createSpyObj('Platform', { ready: platformReadySpy });
<%   } -%>

<% } -%>
    TestBed.configureTestingModule({
<% if (props.ui === 'ionic') { -%>
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
<% } -%>
      imports: [
<% if (props.ui === 'ionic') { -%>
        IonicModule.forRoot(),
<% } -%>
<% if (props.angulartics && props.analyticsProvider === 'ga') { -%>
        Angulartics2Module.forRoot([Angulartics2GoogleAnalytics]),
<% } -%>
        RouterTestingModule,
        TranslateModule.forRoot(),
        CoreModule
      ],
      declarations: [AppComponent],
<% if (props.target.includes('cordova')) { -%>
      providers: [
        { provide: StatusBar, useValue: statusBarSpy },
        { provide: SplashScreen, useValue: splashScreenSpy },
<%   if (props.ui === 'ionic') { -%>
        { provide: Platform, useValue: platformSpy },
<%   } -%>
      ]
<% } else { -%>
      providers: []
<% } -%>
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
