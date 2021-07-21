const chalk = require('chalk');
const Insight = require('insight');
const camelCase = require('lodash.camelcase');
const upperFirst = require('lodash.upperfirst');
const Generator = require('@ngx-rocket/core');
const asciiLogo = require('@ngx-rocket/ascii-logo');

const pkg = require('../../package.json');
const options = require('./options.json');
const prompts = require('./prompts.js');

class NgxAddonGenerator extends Generator {
  initializing() {
    this.version = pkg.version;
    this.insight = new Insight({trackingCode: 'UA-93069862-2', pkg});

    // Disable automatic env install based on package.json
    this.features.customInstallTask = true;

    this.argument('appName', {
      desc: 'Name of the addon to generate',
      type: String,
      required: false
    });

    this.insight.optOut = !this.options.analytics || process.env.DISABLE_NGX_ANALYTICS;

    // Updating
    let fromVersion = null;

    if (this.options.update) {
      this.props = this.config.get('props') || {};
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

    this.insight.track('generator', this.version);
    this.insight.track('node', process.version);
    this.insight.track('platform', process.platform);
  }

  configuring() {
    this.insight.track('generator', this.props.advanced ? 'advanced' : 'simple');
    this.insight.track('package-manager', this.packageManager);
    this.props.className = upperFirst(camelCase(this.props.appName));
    this.props.isAddon = true;
  }

  install() {
    const skipInstall = this.options['skip-install'];

    if (!skipInstall) {
      this.log(`\nRunning ${chalk.yellow(`${this.packageManager} install`)}, please wait…`);

      if (this.packageManager === 'yarn') {
        this.yarnInstall();
      } else {
        this.npmInstall(null, {loglevel: 'error'});
      }
    }
  }

  end() {
    if (this.updating) {
      this.log(`\nUpdated ${chalk.green(this.props.appName)} to ${chalk.yellow(this.version)} successfully!\n`);
    } else {
      this.log(`\nAll done! Take a look at ${chalk.green('generators/app')} to get started.\n`);
    }
  }
}

module.exports = Generator.make({
  baseDir: __dirname,
  generator: NgxAddonGenerator,
  options,
  prompts,
  prefixRules: Object.assign(Generator.defaultPrefixRules, {
    fullstack: (props) => props.type === 'fullstack',
    'not-fullstack': (props) => props.type !== 'fullstack'
  })
});
