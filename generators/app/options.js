const {deployerValues, deployerValuesHelp} = require('./deployers.js');

module.exports = [
  {
    name: 'skip-welcome',
    type: 'Boolean',
    required: false,
    description: 'Skip Yeoman’s welcome message',
    defaults: false
  },
  {
    name: 'skip-quickstart',
    type: 'Boolean',
    required: false,
    description: 'Skip quick start message at the end',
    defaults: false
  },
  {
    name: 'analytics',
    type: 'Boolean',
    required: false,
    description: 'Report anonymous usage analytics',
    defaults: true
  },
  {
    name: 'addons',
    type: 'String',
    required: false,
    description: 'Use specified space-separated addons',
    defaults: ''
  },
  {
    name: 'raw',
    type: 'Boolean',
    required: false,
    description: 'Do not use any UI library',
    defaults: false
  },
  {
    name: 'location-strategy',
    type: (value) => {
      if (value !== 'hash' && value !== 'path') {
        console.error('Invalid location strategy: can be either "hash" or "path"');
        // eslint-disable-next-line unicorn/no-process-exit
        process.exit(-1);
      }

      return value;
    },
    required: false,
    description: 'Location strategy to use in Angular router: "path" or "hash"',
    defaults: 'path'
  },
  {
    name: 'git',
    type: 'Boolean',
    required: false,
    description: 'Initialize git repository',
    defaults: true
  },
  {
    name: 'strict',
    type: 'Boolean',
    required: false,
    description: 'Enable TypeScript strict mode',
    defaults: true
  },
  {
    name: 'prefix',
    type: 'Boolean',
    required: false,
    description: 'Add "@" prefix to core/shared folders',
    defaults: true
  },
  {
    name: 'deploy',
    required: false,
    description: 'Choose automatic deployment option',
    defaults: null,
    type: (value) => {
      if (value !== null && !deployerValues.includes(value)) {
        console.error(`Invalid deployment option, accepted values:\n- ${deployerValuesHelp.join('\n- ')}`);
        // eslint-disable-next-line unicorn/no-process-exit
        process.exit(-1);
      }

      return value;
    }
  }
];
