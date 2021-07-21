import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
<% if (props.ui === 'ionic') { -%>
import { IonicModule } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
<% } else if (props.ui === 'material') { -%>
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
<% } -%>
<% if (props.angulartics) { -%>
import { RouterTestingModule } from '@angular/router/testing';
import { Angulartics2Module } from 'angulartics2';
<% } -%>

import { SharedModule } from '@shared';
<% if (props.ui === 'material') { -%>
import { MaterialModule } from '@app/material.module';
<% } -%>
import { HomeComponent } from './home.component';
import { QuoteService } from './quote.service';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
        imports: [
<% if (props.ui === 'ionic') { -%>
          IonicModule.forRoot(),
<% } else if (props.ui === 'material') { -%>
          BrowserAnimationsModule,
          FlexLayoutModule,
          MaterialModule,
<% } -%>
<% if (props.angulartics) { -%>
          RouterTestingModule,
          Angulartics2Module.forRoot(),
<% } -%>
          SharedModule,
          HttpClientTestingModule
        ],
<% if (props.ui === 'ionic') { -%>
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
<% } -%>
        declarations: [HomeComponent],
        providers: [QuoteService]
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
