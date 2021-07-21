# :rocket: generator-ngx-rocket

[![NPM version](https://img.shields.io/npm/v/generator-ngx-rocket.svg)](https://www.npmjs.com/package/generator-ngx-rocket)
[![Build Status](https://sinedied.visualstudio.com/oss-pipelines/_apis/build/status/ngx-rocket.generator-ngx-rocket?branchName=main)](https://sinedied.visualstudio.com/oss-pipelines/_build?definitionId=2&_a=summary&repositoryFilter=2&branchFilter=7&WT.mc_id=generatorngxrocket-github-yolasors)
![Node version](https://img.shields.io/node/v/generator-ngx-rocket.svg)
[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)
[![Downloads](https://img.shields.io/npm/dm/generator-ngx-rocket.svg)](https://npmjs.org/package/generator-ngx-rocket)

![ngx-rocket logo](https://user-images.githubusercontent.com/593151/28924751-08023b32-7863-11e7-9186-c17d4647d861.png)

> Extensible Angular 12+ enterprise-grade project generator based on
> [angular-cli](https://github.com/angular/angular-cli) with best practices from the community.
> Includes PWA, Cordova & Electron support, coding guides and more!

See generated project example [here](https://github.com/ngx-rocket/starter-kit).

### Benefits versus bare `angular-cli` projects

- **A complete starter template:** example app structure tailored for scalability, with examples and boilerplate code
  for every common thing needed in enterprise projects, such as unit tests, routing, authentication, HTTPS service
  extensions, i18n support with dynamic language change and automatic user language detection...

- **Improved tooling:** SCSS & HTML linting, stricter TSLint rules, markdown-based local wiki server for documentation,
  automated localizable strings extraction, corporate proxy support, [Cordova](https://cordova.apache.org) integration

- **Extensive base documentation:** [coding guides](#coding-guides) for TypeScript/SCSS/HTML, Angular onboarding guide,
  corporate proxy and other tools [configuration and usage](#other-documentation)...

- **Ready-to-use UI components:** focus on your app, not on the stack! [Choose](#libraries) between a
  [Bootstrap 4](https://getbootstrap.com/), [Ionic](http://ionicframework.com) or
  [Angular Material](https://material.angular.io) based UI with nicely looking, responsive starter templates

- **Mobile/desktop hybrid app support:** choose between a web app, a mobile app (using [Cordova](https://cordova.apache.org)),
  a desktop app (using [Electron](https://electronjs.org)) or all at the same time using the same code base

- **API proxy example setup:** develop and debug faster using any remote server

- **Generator output customization:** with the provided
  [add-on support](https://github.com/ngx-rocket/generator-ngx-rocket/tree/main/generators/addon), start multiple
  projects even faster by plugging in additions that fit your needs, such as your enterprise theme, SSO authentication,
  services integrations...

And there's even more! See [What's in the box](#whats-in-the-box) for more details.

# Getting started

## Using [ngX-Rocket CLI](https://github.com/ngx-rocket/generator-ngx-rocket/tree/main/cli)

1. Install required tools:
 ```sh
 npm install -g generator-ngx-rocket
 ```

2. Create your application:
 ```sh
 ngx new
 ```
 
> :bulb: Pro tip: the `ngx` CLI can do more that just bootstrapping new projects! You can use it to run your
> NPM scripts with fuzzy matching (try `ngx ci` for example) or help you maintaining your project up-to-date.
> Take a look at the [full documentation](https://github.com/ngx-rocket/generator-ngx-rocket/tree/main/cli)!

# Project structure

The structure follows [Angular style guide](https://angular.io/guide/styleguide).

```
dist/                        app production build
docs/                        project docs and coding guides
e2e/                         end-to-end tests
src/                         project source code
|- app/                      app components
|  |- @shared/               shared module  (common components, directives, pipes and services)
|  |- app.component.*        app root component (shell)
|  |- app.module.ts          app root module definition
|  |- app-routing.module.ts  app routes
|  +- ...                    additional modules and components
|- assets/                   app assets (images, fonts, sounds...)
|- environments/             values for various build environments
|- theme/                    app global scss variables and theme
|- translations/             translations files
|- index.html                html entry point
|- main.scss                 global style entry point
|- main.ts                   app entry point
|- polyfills.ts              polyfills needed by Angular
+- test.ts                   unit tests entry point
reports/                     test and coverage reports
proxy.conf.js                backend proxy configuration
```

# Main tasks

Task automation is based on [NPM scripts](https://docs.npmjs.com/misc/scripts).

Task                            | Description
--------------------------------|---------------------------------------------------------------------------------------
`npm start`                     | Run development server on `http://localhost:4200/`
`npm run serve:sw`              | Run test server on `http://localhost:4200/` with service worker enabled
`npm run build [-- --configuration=production]` | Lint code and build web app for production (with [AOT](https://angular.io/guide/aot-compiler)) in `dist/`
`npm test`                      | Run unit tests via [Karma](https://karma-runner.github.io) or [Jest](https://jestjs.io/) in watch mode
`npm run test:ci`               | Lint code and run unit tests once for continuous integration
`npm run e2e`                   | Run e2e tests using [Protractor](http://www.protractortest.org)
`npm run lint`                  | Lint code
`npm run translations:extract`  | Extract strings from code and templates to `src/app/translations/template.json`
`npm run docs`                  | Display project documentation

Additional tasks for Cordova-based projects:

Task                            | Description
--------------------------------|---------------------------------------------------------------------------------------
`npm run cordova:prepare`       | Prepare for building mobile app (restore Cordova platforms and plugins)
`npm run cordova:run <ios/android> [--device]`          | Run app on target platform device or simulator
`npm run cordova:build [-- --configuration=production]` | Build mobile app for production in `dist/` folder
`npm run cordova:clean`         | Removes `www/`, `platforms/` and `plugins/` folders

Additional tasks for Electron-based projects:

Task                            | Description
--------------------------------|---------------------------------------------------------------------------------------
`npm run electron:build`        | Build desktop app
`npm run electron:run`          | Run app on electron
`npm run electron:package`      | Package app for all supported platforms

When building the application, you can specify the target configuration using the additional flag
`--configuration <name>` (do not forget to prepend `--` to pass arguments to npm scripts).

The default build configuration is `production`.

## Development server

Run `npm start` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change
any of the source files.
You should not use `ng serve` directly, as it does not use the backend proxy configuration by default.

## Code scaffolding

Run `npm run generate -- component <name>` to generate a new component. You can also use
`npm run generate -- directive|pipe|service|class|module`.

If you have installed [angular-cli](https://github.com/angular/angular-cli) globally with `npm install -g @angular/cli`,
you can also use the command `ng generate` directly.

# What's in the box

![starter kit](https://cloud.githubusercontent.com/assets/593151/23604024/a9729c78-0257-11e7-8c60-0882a98bad41.png)

The app template is based on [HTML5](http://whatwg.org/html), [TypeScript](http://www.typescriptlang.org) and
[Sass](http://sass-lang.com). The translation files use the common [JSON](http://www.json.org) format.

#### Tools

Development, build and quality processes are based on [angular-cli](https://github.com/angular/angular-cli) and
[NPM scripts](https://docs.npmjs.com/misc/scripts), which includes:

- Optimized build and bundling process with [Webpack](https://webpack.js.org/)
- [Development server](https://webpack.js.org/configuration/dev-server/) with backend proxy and live reload
- Cross-browser CSS with [autoprefixer](https://github.com/postcss/autoprefixer) and
  [browserslist](https://github.com/ai/browserslist)
- Asset revisioning for [better cache management](https://webpack.js.org/guides/caching/)
- Unit tests using [Jasmine](http://jasmine.github.io), [Karma](https://karma-runner.github.io) and
  [headless Chrome](https://github.com/GoogleChrome/puppeteer)
- End-to-end tests using [Protractor](https://github.com/angular/protractor)
- Static code analysis: [TSLint](https://github.com/palantir/tslint), [Codelyzer](https://github.com/mgechev/codelyzer),
  [Stylelint](http://stylelint.io) and [HTMLHint](http://htmlhint.com/)
- Local knowledgebase server using [Hads](https://github.com/sinedied/hads)
- Automatic code formatting with [Prettier](https://prettier.io)
- Deployment with the CLI using [ng deploy](https://angular.io/guide/deployment)

[Progressive Web App (PWA)](https://developers.google.com/web/progressive-web-apps/) support provided by
[@angular/service-worker](https://docs.google.com/document/d/1F0e0ROaZUnTFftmC0XovpREHWHjcXa4CggiFlmifjhw/).

Native mobile application bundling is based on [Cordova](https://cordova.apache.org).
[Ionic WKWebView](https://github.com/ionic-team/cordova-plugin-ionic-webview) is used for iOS for better performance.

#### Libraries

- [Angular](https://angular.io)
- [RxJS](http://reactivex.io/rxjs)
- [ngx-translate](https://github.com/ngx-translate/core)
- UI based on:
  * Bootstrap
    - [Bootstrap 4](https://getbootstrap.com)
    - [ng-bootstrap](https://ng-bootstrap.github.io/)
    - [Font Awesome](http://fontawesome.io)
  * Ionic:
    - [Ionic](http://ionicframework.com)
    - [Ionic Native](https://ionicframework.com/docs/native/)
  * Angular Material
    - [Angular Material](https://material.angular.io)
    - [Angular Flex Layout](https://github.com/angular/flex-layout)
    - [Material Icons](https://material.io/icons/)
- Optional utility libraries:
  * [Lodash](https://lodash.com)
  * [Ramda](https://ramdajs.com)
  * [Moment.js](https://momentjs.com)
  * [Date-fns](https://date-fns.org)
  * [Jest](https://jestjs.io/)


#### Coding guides

- [Angular](https://github.com/ngx-rocket/starter-kit/blob/main/docs/coding-guides/angular.md)
- [Ionic](https://github.com/ngx-rocket/starter-kit/blob/cordova/ionic/docs/coding-guides/ionic.md)
- [TypeScript](https://github.com/ngx-rocket/starter-kit/blob/main/docs/coding-guides/typescript.md)
- [Sass](https://github.com/ngx-rocket/starter-kit/blob/main/docs/coding-guides/sass.md)
- [HTML](https://github.com/ngx-rocket/starter-kit/blob/main/docs/coding-guides/html.md)
- [Unit tests](https://github.com/ngx-rocket/starter-kit/blob/main/docs/coding-guides/unit-tests.md)
- [End-to-end tests](https://github.com/ngx-rocket/starter-kit/blob/main/docs/coding-guides/e2e-tests.md)

#### Other documentation

- [I18n guide](https://github.com/ngx-rocket/starter-kit/blob/main/docs/i18n.md)
- [Working behind a corporate proxy](https://github.com/ngx-rocket/starter-kit/blob/main/docs/corporate-proxy.md)
- [Updating dependencies and tools](https://github.com/ngx-rocket/starter-kit/blob/main/docs/updating.md)
- [Using a backend proxy for development](https://github.com/ngx-rocket/starter-kit/blob/main/docs/backend-proxy.md)
- [Browser routing](https://github.com/ngx-rocket/starter-kit/blob/main/docs/routing.md)
- [Cordova](https://github.com/ngx-rocket/starter-kit/blob/cordova/ionic/docs/cordova.md)
- [Electron](https://github.com/ngx-rocket/starter-kit/blob/electron/ionic/docs/electron.md)

## Generator options

- `--packageManager [npm|yarn]`: specify whether to use [Yarn](https://yarnpkg.com) or NPM as your package manager
 (default is NPM).
 You can also use the environment variable `NGX_PACKAGE_MANAGER` to set this option globally.
- `--automate <json_file>`: automate prompt answers using specified JSON file (see
  [here](https://github.com/ngx-rocket/generator-ngx-rocket/tree/main/scripts/tests) for examples).
- `--addons <addon_name> [<addon_name>] ...`: space-separated list of add-ons to use.
- `--no-update`: do no update existing project (see also [updating generated projects](#updating-generated-projects)).
- `--no-analytics`: do not report anonymous usage analytics.
  You can also use the environment variable `NGX_DISABLE_ANALYTICS` to set this option globally.
- `--raw`: do not use any UI library for templates.
- `--tools`: generate only the toolchain, without application template.
- `--location-strategy [hash|path]`: [location strategy](https://angular.io/api/common/LocationStrategy) to use in
  Angular router (default is `path`).
- `--no-git`: do not initialize git repository.
- `--no-strict`: disable TypeScript strict type checking options.
- `--skip-quickstart`: disable quick start message after project generation.
- `--no-prefix`: do not add `@` prefix to `core`/`shared` folders.
- `--deploy <option>`: choose automatic deployment option. Use `ngx n --deploy` to see possible values.
  
When generating a *fullstack* project (with both client and server code), you can use the environment variables
`NGX_CLIENT_PATH` and `NGX_SERVER_PATH` to customize the paths for client and server code. Be aware though that some
add-ons may force specific paths that will preempt your changes.

## Updating generated projects

As new features and newer libraries and tools are added to the generator, you may want to update your project at some
point. Here is how we suggest you to do it:

1. Make sure your working directory is clean (no pending / uncommited changes).
2. Run `ngx update` using the [CLI](cli/README) inside your project folder.
3. The generator will then run again using the same options you used initially, prompting you for each file change.
   From there the recommended approach is simply to overwrite everything.
4. Finally, use your source control to see the diff for each file and merge the changes manually.

> Note: you can use the `--tools` option to generate only the toolchain and not application templates, thus reducing
> the number of changes to merge.

## Customize project generation

You can customize the generator output to change or enhance it to better suit your needs using
[add-ons](https://www.npmjs.com/search?q=ngx-rocket-addon).

To create a new add-on, you can use the `addon` sub-generator of the [CLI](https://github.com/ngx-rocket/generator-ngx-rocket/tree/main/cli):
```sh
ngx new --addon
```

See the [add-on generator documentation](https://github.com/ngx-rocket/generator-ngx-rocket/tree/main/generators/addon)
for more information about add-on creation.

# Contributing

First time contributors are welcome in this project! 🎉

To get started, take a look at the [contributing guide](CONTRIBUTING.md).
If you want to help and don't know what you can do, look for [good first contribution issues](https://github.com/ngx-rocket/generator-ngx-rocket/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+contribution%22), or if you're a seasoned OSS contributor look for [PR welcome tags](https://github.com/ngx-rocket/generator-ngx-rocket/issues?q=is%3Aopen+is%3Aissue+label%3A%22PR+welcome%22).

Thanks for helping ❤️

# License

[MIT](LICENSE)
