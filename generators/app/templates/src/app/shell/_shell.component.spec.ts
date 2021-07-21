import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
<% if (props.ui === 'ionic') { -%>
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule } from '@ionic/angular';
<% } else if (props.ui === 'bootstrap') { -%>
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
<% } else if (props.ui === 'material') { -%>
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '@app/material.module';
<% } -%>

<% if (props.auth) { -%>
import { AuthenticationService, CredentialsService } from '@app/auth';
import { MockAuthenticationService } from '@app/auth/authentication.service.mock';
import { MockCredentialsService } from '@app/auth/credentials.service.mock';
<% } -%>

import { I18nModule } from '@app/i18n';
import { ShellComponent } from './shell.component';
<% if (props.ui === 'ionic' && props.layout === 'tabs') { -%>
import { AboutComponent } from '@app/about/about.component';
import { SettingsComponent } from '@app/settings/settings.component';
import { HomeComponent } from '@app/home/home.component';
import { HomeModule } from '@app/home/home.module';
import { AboutModule } from '@app/about/about.module';
import { SettingsModule } from '@app/settings/settings.module';
<% } -%>
<% if (props.ui === 'bootstrap' || (props.ui === 'material' && props.layout === 'simple') || props.ui === 'raw') { -%>
import { HeaderComponent } from './header/header.component';
<% } -%>

describe('ShellComponent', () => {
  let component: ShellComponent;
  let fixture: ComponentFixture<ShellComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        I18nModule,
<% if (props.ui === 'ionic') { -%>
        IonicModule.forRoot(),
<%   if (props.layout === 'tabs') { -%>
        HomeModule,
        AboutModule,
        SettingsModule,
<%   } -%>
<% } else if (props.ui === 'bootstrap') { -%>
        NgbModule,
<% } else if (props.ui === 'material') { -%>
        BrowserAnimationsModule,
        FlexLayoutModule,
        MaterialModule,
<% } -%>
        RouterTestingModule
      ],
<% if ((props.auth) || (props.ui === 'ionic')) { -%>
      providers: [
<%   if (props.auth) { -%>
        { provide: AuthenticationService, useClass: MockAuthenticationService },
        { provide: CredentialsService, useClass: MockCredentialsService }
<%   } -%>
      ],
<% } -%>
<% if (props.ui === 'ionic') { -%>
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
<% } -%>
      declarations: [
<% if (props.ui === 'bootstrap' || (props.ui === 'material' && props.layout === 'simple') || props.ui === 'raw') { -%>
        HeaderComponent,
<% } -%>
        ShellComponent
      ]
  })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
