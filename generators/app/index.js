const path = require('path');
const fs = require('fs-extra');
const chalk = require('chalk');
const Insight = require('insight');
const semver = require('semver');
const replace = require('replace-in-file');
const Generator = require('@ngx-rocket/core');
const asciiLogo = require('@ngx-rocket/ascii-logo');

const pkg = require('../../package.json');
const prompts = require('./prompts.js');
const options = require('./options.js');
const getLanguages = require('./languages.js');
const {deployers} = require('./deployers.js');

const packageJsonFile = 'package.json';
const appPath = 'src/app';

class NgxGenerator extends Generator {
  initializing() {
    this.version = pkg.version;
    this.props = {};

    // Disable automatic env install based on package.json
    this.features.customInstallTask = true;

    // Try to initialize analytics. Insight is broken for some users, so if it fails, proceed as if the --no-analytics flag was present.
    try {
      this.insight =
        !this.options.analytics || process.env.DISABLE_NGX_ANALYTICS
          ? {track: () => {}}
          : new Insight({trackingCode: 'UA-93069862-1', pkg});
    } catch {
      this.insight = {track: () => {}};
      this.log(
        chalk.yellow(
          'There was a problem collecting analytics data. Proceeding without anonymous usage tracking. To suppress this warning in the future, use the --no-analytics flag.'
        )
      );
    }

    if (semver.lt(process.version, '10.9.0')) {
      this.log(chalk.yellow('Angular CLI v8 needs NodeJS v10.9 or greater.'));
      this.log(chalk.yellow(`You are using ${process.version} which is unsupported, please upgrade.\n`));
      // eslint-disable-next-line unicorn/no-process-exit
      process.exit(-1);
    }

    this.argument('appName', {
      description: 'Name of the app to generate',
      type: String,
      required: false
    });

    this.insight.optOut = !this.options.analytics || process.env.DISABLE_NGX_ANALYTICS;

    if (this.options.raw) {
      this.props.ui = 'raw';
    }

    if (this.options['location-strategy']) {
      this.props.location = this.options['location-strategy'];
    }

    this.props.strict = this.options.strict;
    this.props.skipInstall = this.options['skip-install'];
    this.props.skipQuickstart = this.options['skip-quickstart'];
    this.props.initGit = this.options.git;
    this.props.usePrefix = this.options.prefix;

    if (this.options.deploy) {
      this.props.deploy = this.options.deploy;
    }

    // Updating
    let fromVersion = null;

    if (this.options.update) {
      this.props = this.config.get('props') || this.props;
      fromVersion = this.config.get('version');
    }

    if (fromVersion) {
      if (fromVersion >= this.version) {
        this.log(chalk.green('\nNothing to update, it’s all good!\n'));
        // eslint-disable-next-line unicorn/no-process-exit
        process.exit(0);
      }

      this.updating = true;
      this.log(
        `\nUpdating ${chalk.green(this.props.appName)} project (${chalk.yellow(fromVersion)} -> ${chalk.yellow(
          this.version
        )})\n`
      );
      this.log(`${chalk.yellow('Make sure you don’t have uncommitted changes before overwriting files!')}`);
      this.insight.track('update', fromVersion, 'to', this.version);
    } else if (!this.options['skip-welcome']) {
      this.log(asciiLogo(pkg.version));
    }

    // Composition
    const addonsOption = this.options.addons;
    this.addons = addonsOption ? addonsOption.split(' ') : [];
    this.addons.forEach((addon) => {
      try {
        if (/[:/]/.test(addon)) {
          // Fetch addon name from URL/GitHub/Local package format
          let splitIndex = addon.lastIndexOf('/');
          splitIndex = splitIndex === -1 ? addon.lastIndexOf(':') : splitIndex;
          addon = addon.slice(splitIndex + 1);
        }

        if (addon.startsWith('generator-')) {
          // This prefix must be removed for Yeoman to work properly
          addon = addon.slice(10);
        }

        if (addon.endsWith('.git')) {
          // When working with git repos, this suffix must be removed
          addon = addon.slice(0, -4);
        }

        this.composeWith(addon, this.options);
      } catch {
        this.log(chalk.red(`Error: add-on "${addon}" not found.`));
        // eslint-disable-next-line unicorn/no-process-exit
        process.exit(-1);
      }
    });

    this.insight.track('version', this.version);
    this.insight.track('node', process.version);
    this.insight.track('platform', process.platform);
    this.insight.track('addons', addonsOption);
  }

  async prompting() {
    // Allow to pre-set any props in an add-on generator
    Object.assign(this.props, this.sharedProps);

    await super.prompting();
    this.props.mobile = this.props.mobile || [];
    this.props.desktop = this.props.desktop || [];
    this.props.utility = this.props.utility || [];
    this.props.tools = this.props.tools || [];
    this.props.languages = this.props.languages || ['en-US', 'fr-FR'];
    this.props.usePrefix = typeof this.props.usePrefix === 'boolean' ? this.props.usePrefix : true;
    this.props.deploy = this.props.deploy || 'none';
    this.props.features = this.props.features || [];
    this.props.pwa = this.props.features.includes('pwa');
    this.props.auth = this.props.features.includes('auth');
    this.props.lazy = this.props.features.includes('lazy');
    this.props.e2e = this.props.features.includes('e2e');
    this.props.angulartics = this.props.features.includes('angulartics');
    this.shareProps(this.props);
  }

  configuring() {
    // Add prefix rules for languages
    getLanguages().forEach((language) => {
      this._prefixRules[language] = (props) => props.languages.includes(language);
    });

    this.insight.track(
      'generator',
      this.props.target,
      this.props.target.includes('web') && this.props.pwa ? 'pwa' : '',
      this.props.target.includes('cordova') ? this.props.mobile : '',
      this.props.ui,
      this.props.auth ? 'auth' : 'no-auth'
    );
    this.insight.track('package-manager', this.packageManager);

    if (this.props.target.includes('cordova') && this.packageManager === 'yarn') {
      this.log(chalk.yellow('\nWarning: Using Yarn with Cordova is NOT recommended!'));
      this.log(chalk.yellow('Cordova still uses NPM to fetch packages, causing issues with Yarn.\n'));
    }
  }

  install() {
    if (!this.props.usePrefix) {
      this.log(`\nConfiguring prefix, please wait…`);

      const clientPath = this.isFullstack ? process.env.NGX_CLIENT_PATH : '';
      const basePath = this.destinationPath(path.join(clientPath, appPath));

      try {
        // Rename folders
        fs.removeSync(path.join(basePath, 'core'));
        fs.removeSync(path.join(basePath, 'shared'));
        fs.renameSync(path.join(basePath, '@shared'), path.join(basePath, 'shared'));

        // Replace imports in files
        const options = {files: 'src/**/*.ts'};
        replace.sync({...options, from: /@shared/g, to: '@app/shared'});
      } catch (error) {
        this.log(`${chalk.red('An error occured during prefix config:')}\n${error && error.message}`);
      }
    }

    if (this.props.initGit) {
      this.spawnCommandSync('git', ['init', '--quiet']);
    }

    if (!this.props.skipInstall) {
      this.log(`\nRunning ${chalk.yellow(`${this.packageManager} install`)}, please wait…`);

      const install = this.packageManager === 'yarn' ? this.yarnInstall.bind(this) : this.npmInstall.bind(this);

      if (fs.existsSync(this.destinationPath(packageJsonFile))) {
        install();
      }

      if (this.isFullstack) {
        if (fs.existsSync(this.destinationPath(path.join(process.env.NGX_CLIENT_PATH, packageJsonFile)))) {
          install(null, null, {cwd: this.destinationPath(process.env.NGX_CLIENT_PATH)});
        }

        if (fs.existsSync(this.destinationPath(path.join(process.env.NGX_SERVER_PATH, packageJsonFile)))) {
          install(null, null, {cwd: this.destinationPath(process.env.NGX_SERVER_PATH)});
        }
      }
    }
  }

  end() {
    const deployer = deployers.find((d) => d.value === this.props.deploy);

    if (this.props.deploy !== 'none') {
      this.log(`\nConfiguring deployment with ${chalk.cyan(deployer.name)}, please wait…\n`);
      const result = this.spawnCommandSync('ng', ['add', deployer.package]);

      if (result.error) {
        this.log(`${chalk.red('Something went wrong during deployment configuration :(')}`);
        this.log(`You can retry manually using ${chalk.yellow(`npx ng add ${deployer.package}`)}`);
      }
    }

    if (this.updating) {
      this.log(`\nUpdated ${chalk.green(this.props.appName)} to ${chalk.yellow(this.version)} successfully!`);
      return;
    }

    if (this.props.skipQuickstart) {
      return;
    }

    this.log('\nAll done! Get started with these tasks:');
    this.log(
      `- $ ${chalk.green(`${this.packageManager} start`)}: start dev server with live reload on http://localhost:4200`
    );

    if (this.props.target.includes('web')) {
      this.log(`- $ ${chalk.green(`${this.packageManager} run build`)}: build web app for production`);

      if (this.props.deploy !== 'none') {
        this.log(`- $ ${chalk.green(`${this.packageManager} run deploy`)}: deploy app to ${deployer.name}`);
      }
    }

    if (this.props.target.includes('cordova')) {
      this.log(`- $ ${chalk.green(`${this.packageManager} run cordova:prepare`)}: prepare for building mobile app`);
      this.log(`- $ ${chalk.green(`${this.packageManager} run cordova:run`)}: run app on device or simulator`);
      this.log(`- $ ${chalk.green(`${this.packageManager} run cordova:build`)}: build mobile app for production`);
    }

    if (this.props.target.includes('electron')) {
      this.log(`- $ ${chalk.green(`${this.packageManager} run electron:build`)}: build app for electron`);
      this.log(`- $ ${chalk.green(`${this.packageManager} run electron:run`)}: run app in electron`);
      this.log(
        `- $ ${chalk.green(
          `${this.packageManager} run electron:package`
        )}: package executables for all selected platforms`
      );
    }

    this.log(`- $ ${chalk.green(`${this.packageManager} test`)}: run unit tests in watch mode for TDD`);
    this.log(`- $ ${chalk.green(`${this.packageManager} run test:ci`)}: lint code and run units tests with coverage`);
    this.log(`- $ ${chalk.green(`${this.packageManager} run e2e`)}: launch e2e tests`);

    if (this.props.tools.includes('hads')) {
      this.log(`- $ ${chalk.green(`${this.packageManager} run docs`)}: show docs and coding guides`);
    }

    if (this.props.tools.includes('compodoc')) {
      this.log(`- $ ${chalk.green(`${this.packageManager} run compodoc`)}: generates docs from code`);
    }

    if (this.props.tools.includes('prettier')) {
      this.log(`- $ ${chalk.green(`${this.packageManager} run prettier`)}: format your code automatically`);
    }
  }
}

module.exports = Generator.make({
  baseDir: __dirname,
  generator: NgxGenerator,
  options,
  prompts,
  prefixRules: Object.assign(Generator.defaultPrefixRules, {
    'ionic-tabs': (props) => props.ui === 'ionic' && props.layout === 'tabs',
    'ionic-side-menu': (props) => props.ui === 'ionic' && props.layout === 'side-menu',
    'material-simple': (props) => props.ui === 'material' && props.layout === 'simple',
    'material-side-menu': (props) => props.ui === 'material' && props.layout === 'side-menu',
    raw: (props) => props.ui === 'raw',
    'electron-windows': (props) => props.desktop && props.desktop.includes('windows'),
    'electron-mac': (props) => props.desktop && props.desktop.includes('mac'),
    'electron-linux': (props) => props.desktop && props.desktop.includes('linux'),
    'tools-hads': (props) => props.tools && props.tools.includes('hads'),
    'tools-jest': (props) => props.tools && props.tools.includes('jest'),
    'tools-karma': (props) => props.tools && !props.tools.includes('jest'),
    e2e: (props) => !props.features || props.features.includes('e2e'),
    husky: (props) => props.initGit && props.tools.includes('prettier')
  })
});
