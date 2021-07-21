/*
 * Use the Page Object pattern to define the page under test.
 * See docs/coding-guide/e2e-tests.md for more info.
 */

import { browser, element, by } from 'protractor';

export class LoginPage {
<%   if (props.ui === 'ionic') { -%>
  // Custom locator to find an element within shadow DOM (by.deepCss() doesn't work here)
  usernameField = element(by.css('ion-input[formControlName="username"] input'));
  passwordField = element(by.css('ion-input[formControlName="password"] input'));
  loginButton = element(by.css('ion-button[type="submit"]'));
<%   } else { -%>
  usernameField = element(by.css('input[formControlName="username"]'));
  passwordField = element(by.css('input[formControlName="password"]'));
  loginButton = element(by.css('button[type="submit"]'));
<%   } -%>

  async login() {
    await this.usernameField.sendKeys('test');
    await this.passwordField.sendKeys('123');
    await this.loginButton.click();
  }
}
