import { TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
<% if (props.ui === 'ionic') { -%>
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule } from '@ionic/angular';
<% } -%>
<% if (props.target.includes('cordova')) { -%>
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
<% } -%>
<% if (props.angulartics && props.analyticsProvider === 'ga') { -%>
import { Angulartics2Module } from 'angulartics2';
<% } -%>

import { AppComponent } from './app.component';

describe('AppComponent', () => {

<% if (props.target.includes('cordova') && !props.tools.includes('jest')) { -%>
  let statusBarSpy: jasmine.Spy;
  let splashScreenSpy: jasmine.Spy;
  let keyboardSpy: jasmine.Spy;
<% } else if (props.target.includes('cordova') && props.tools.includes('jest')) { -%>
  let statusBarSpy: any;
  let splashScreenSpy: any;
  let keyboardSpy: any;
<% } -%>

  beforeEach(waitForAsync(() => {
<% if (props.target.includes('cordova') && !props.tools.includes('jest')) { -%>
    statusBarSpy = jasmine.createSpyObj('StatusBar', ['styleDefault']);
    splashScreenSpy = jasmine.createSpyObj('SplashScreen', ['hide']);
    keyboardSpy = jasmine.createSpyObj('Keyboard', ['hideFormAccessoryBar']);

<% } else if (props.target.includes('cordova') && props.tools.includes('jest')) { -%>
    statusBarSpy = jest.fn();
    splashScreenSpy = {
      hide: jest.fn()
    };
    keyboardSpy = {
      hideFormAccessoryBar: jest.fn()
    };

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
        Angulartics2Module.forRoot(),
<% } -%>
        RouterTestingModule,
        TranslateModule.forRoot()
      ],
      declarations: [AppComponent],
<% if (props.target.includes('cordova')) { -%>
      providers: [
        { provide: Keyboard, useValue: keyboardSpy },
        { provide: StatusBar, useValue: statusBarSpy },
        { provide: SplashScreen, useValue: splashScreenSpy },
      ]
<% } else { -%>
      providers: []
<% } -%>
    }).compileComponents();
  }));

  it('should create the app', waitForAsync(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }), 30000);
});
