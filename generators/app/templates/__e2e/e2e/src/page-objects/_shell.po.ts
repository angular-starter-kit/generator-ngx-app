/*
 * Use the Page Object pattern to define the page under test.
 * See docs/coding-guide/e2e-tests.md for more info.
 */

import { browser, element, by } from 'protractor';

export class ShellPage {
<% if (props.ui === 'ionic') { -%>
  welcomeText = element(by.css('app-root ion-card-title'));
<% } else if (props.ui === 'material') { -%>
  welcomeText = element(by.css('app-root mat-card-title'));
<% } else { -%>
  welcomeText = element(by.css('app-root h1'));
<% } -%>

  getParagraphText() {
    return this.welcomeText.getText();
  }
}
