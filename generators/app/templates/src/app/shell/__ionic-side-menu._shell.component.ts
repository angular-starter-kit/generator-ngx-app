import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController, AlertController, Platform } from '@ionic/angular';
import { ActionSheetButton, ActionSheetOptions, TextFieldTypes } from '@ionic/core';
import { TranslateService } from '@ngx-translate/core';
import { filter } from 'rxjs/operators';

<% if (props.auth) { -%>
import { AuthenticationService } from '@app/core';
<% } -%>
import { I18nService } from '@i18n';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss']
})
export class ShellComponent {

  navRoot: Component;
  subscription: any;

  constructor(private router: Router,
              private translateService: TranslateService,
              private platform: Platform,
              private alertController: AlertController,
              private actionSheetController: ActionSheetController,
<% if (props.auth) { -%>
              private authenticationService: AuthenticationService,
<% } -%>
              private i18nService: I18nService) { }

<% if (props.auth) { -%>
  showProfileActions() {
    let createdActionSheet: any;
    const buttons: ActionSheetButton[] = [
      {
        text: this.translateService.instant('Logout'),
        icon: this.platform.is('ios') ? undefined : 'log-out',
        role: 'destructive',
        handler: () => this.logout()
      },
      {
        text: this.translateService.instant('Change language'),
        icon: this.platform.is('ios') ? undefined : 'globe',
        handler: () => {
          // Wait for action sheet dismiss animation to finish, see "Dismissing And Async Navigation" section in:
          // http://ionicframework.com/docs/api/components/action-sheet/ActionSheetController/#advanced
          createdActionSheet.dismiss().then(() => this.changeLanguage());
          return false;
        }
      },
      {
        text: this.translateService.instant('Cancel'),
        icon: this.platform.is('ios') ? undefined : 'close',
        role: 'cancel'
      }
    ];

    // On Cordova platform language is set to the device language
    if (this.platform.is('cordova')) {
      buttons.splice(1, 1);
    }

    const actionSheetOptions: ActionSheetOptions = {
      header: (this.username || undefined),
      buttons: buttons
    };

    this.actionSheetController.create(actionSheetOptions)
      .then(actionSheet => {
        createdActionSheet = actionSheet;
        actionSheet.present();
      });
  }

  get username(): string | null {
    const credentials = this.authenticationService.credentials;
    return credentials ? credentials.username : null;
  }

  private logout() {
    this.authenticationService.logout()
    .subscribe(() => this.router.navigate(['/login'], { replaceUrl: true }));
  }

  get isWeb(): boolean {
    return !this.platform.is('cordova');
  }

  private changeLanguage() {
<% } else { -%>
  get isWeb(): boolean {
    return !this.platform.is('cordova');
  }

  changeLanguage() {
<% } -%>
    this.alertController.create(
      {
        header: this.translateService.instant('Change language'),
        inputs: this.i18nService.supportedLanguages.map(language => ({
          type: 'radio' as TextFieldTypes,
          name: language,
          label: language,
          value: language,
          checked: language === this.i18nService.language
        })),
        buttons: [
          {
            text: this.translateService.instant('Cancel'),
            role: 'cancel'
          },
          {
            text: this.translateService.instant('Ok'),
            handler: language => {
              this.i18nService.language = language;
            }
          }
        ]
      }
    ).then(alertController => alertController.present());
  }

}
