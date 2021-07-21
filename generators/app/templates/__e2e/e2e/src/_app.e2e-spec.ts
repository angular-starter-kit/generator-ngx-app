import { browser, ExpectedConditions as until } from 'protractor';
<% if (props.auth) { -%>
import { LoginPage } from './page-objects/login.po';
<% } -%>
import { AppSharedPage } from './page-objects/app-shared.po';
import { ShellPage } from './page-objects/shell.po';

describe('when the app loads', () => {
<% if (props.auth) { -%>
  const login = new LoginPage();
<% } -%>
  const app = new AppSharedPage();
  const shell = new ShellPage();

  beforeAll(async () => {
    await app.navigateAndSetLanguage();
  });

<% if (props.auth) { -%>
  it('should display the login page', async () => {
    expect(await browser.getCurrentUrl()).toContain('/login');
  });

<% } else { -%>
  it('should display the shell page', async () => {
    expect(await browser.getCurrentUrl()).toContain('/');
  });

<% } -%>
<% if (props.auth) { -%>
  describe('and the user logs in', () => {
    beforeAll(async () => {
      await login.login();
    });

<% } else { -%>
  describe('and the page loads', () => {
<% } -%>
    it('should display the hello message', async () => {
      await browser.wait(until.visibilityOf(shell.welcomeText), 5000, 'Element taking too long to appear');
      expect(await shell.getParagraphText()).toEqual('Hello world !');
    });
  });
});
