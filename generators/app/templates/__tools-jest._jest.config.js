// https://github.com/thymikee/jest-preset-angular#brief-explanation-of-config
module.exports = {
  preset: 'jest-preset-angular',
  roots: ['src'],
  coverageDirectory: 'reports',
  setupFilesAfterEnv: ['<rootDir>/src/setup-jest.ts'],
  moduleNameMapper: {
    '@app/(.*)': '<rootDir>/src/app/$1',
<% if (props.usePrefix) { -%>
    '@shared': ['<rootDir>/src/app/@shared'],
    '@shared/(.*)': ['<rootDir>/src/app/@shared/$1'],
<% } -%>
    '@env': '<rootDir>/src/environments/environment'
  },
  globals: {
    'ts-jest': {
      allowSyntheticDefaultImports: true,
      tsconfig: '<rootDir>/tsconfig.spec.json',
      diagnostics: {
        ignoreCodes: ['TS151001'],
      }
    },
  },
  // Do not ignore librairies such as ionic, ionic-native or bootstrap to transform them during unit testing.
<% const excludedLibrairies = ['jest-test']
  if (props.target.includes('cordova')) { excludedLibrairies.push('@ionic-native'); }
  if (props.ui === 'ionic') { excludedLibrairies.push('@ionic'); }
  if (props.ui === 'bootstrap') { excludedLibrairies.push('@ng-bootstrap'); } -%>
  transformIgnorePatterns: ['node_modules/(?!(<%- excludedLibrairies.join('|') %>))']
};
