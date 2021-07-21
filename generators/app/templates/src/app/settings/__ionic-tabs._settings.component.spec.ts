import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ActionSheetController, AlertController, Platform } from '@ionic/angular';
import { IonicModule } from '@ionic/angular';

import { SharedModule } from '@shared';
<% if (props.auth) { -%>
import { AuthenticationService, CredentialsService } from '@app/auth';
import { MockAuthenticationService } from '@app/auth/authentication.service.mock';
import { MockCredentialsService } from '@app/auth/credentials.service.mock';
<% } -%>
import { SettingsComponent } from './settings.component';

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
        imports: [
          RouterTestingModule,
          TranslateModule.forRoot(),
          IonicModule.forRoot(),
          SharedModule
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        declarations: [SettingsComponent],
        providers: [
<% if (props.auth) { -%>
          { provide: AuthenticationService, useClass: MockAuthenticationService },
          { provide: CredentialsService, useClass: MockCredentialsService },
<% } -%>
          Platform,
          AlertController,
          ActionSheetController
        ]
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
