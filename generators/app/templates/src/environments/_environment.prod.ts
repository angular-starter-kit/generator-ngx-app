// `.env.ts` is generated by the `npm run env` command
import env from './.env';

export const environment = {
  production: true,
  version: env.npm_package_version,
  serverUrl: 'https://api.chucknorris.io',
  defaultLanguage: '<%=props['i18n-default'] || (props['i18n-langs'] && props['i18n-langs'][0])%>',
  supportedLanguages: <%- JSON.stringify(props['i18n-langs'] || []).replace(/["]/g, '\'').replace(/['],/g, '\', ').replace(/[\[]/, '[ ').replace(/[\]]/, ' ]') %>
};
