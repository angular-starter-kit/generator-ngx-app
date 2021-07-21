import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
<% if (props.ui === 'ionic') { -%>
import { LoadingController, Platform } from '@ionic/angular';
import { map } from 'rxjs/operators';
import { forkJoin, from } from 'rxjs';
<% } -%>
import { finalize } from 'rxjs/operators';

import { environment } from '@env/environment';
import { Logger, UntilDestroy, untilDestroyed } from '@shared';
import { AuthenticationService } from './authentication.service';

const log = new Logger('Login');

@UntilDestroy()
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  version: string | null = environment.version;
  error: string | undefined;
  loginForm!: FormGroup;
  isLoading = false;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private formBuilder: FormBuilder,
<% if (props.ui === 'ionic') { -%>
              private platform: Platform,
              private loadingController: LoadingController,
<% } -%>
              private authenticationService: AuthenticationService) {
    this.createForm();
  }

  ngOnInit() { }

<% if (props.ui === 'ionic') { -%>
  async login() {
<% } else { -%>
  login() {
<% } -%>
    this.isLoading = true;
    const login$ = this.authenticationService.login(this.loginForm.value);
<% if (props.ui === 'ionic') { -%>
    const loadingOverlay = await this.loadingController.create({});
    const loading$ = from(loadingOverlay.present());
    forkJoin([login$, loading$]).pipe(
      map(([credentials, ...rest]) => credentials),
<% } else { -%>
    login$.pipe(
<% } -%>
      finalize(() => {
        this.loginForm.markAsPristine();
        this.isLoading = false;
<% if (props.ui === 'ionic') { -%>
        loadingOverlay.dismiss();
<% } -%>
      }),
      untilDestroyed(this)
    ).subscribe(credentials => {
      log.debug(`${credentials.username} successfully logged in`);
      this.router.navigate([ this.route.snapshot.queryParams.redirect || '/'], { replaceUrl: true });
    }, error => {
      log.debug(`Login error: ${error}`);
      this.error = error;
    });
  }

<% if (props.ui === 'ionic') { -%>

  get isWeb(): boolean {
    return !this.platform.is('cordova');
  }
<% } -%>

  private createForm() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      remember: true
    });
  }

}
