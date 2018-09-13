import { Routes, Route } from '@angular/router';

<% if (props.auth) { -%>
import { AuthenticationGuard } from '@app/core';
<% } -%>
import { ShellComponent } from './shell.component';

/**
 * Provides helper methods to create routes.
 */
export class Shell {

  /**
   * Creates routes using the shell component and authentication.
   * @param routes The routes to add.
   * @return {Route} The new route using shell as the base.
   */
  static childRoutes(routes: Routes): Route {
    return {
      path: '',
      component: ShellComponent,
      children: routes,
<% if (props.auth) { -%>
      canActivate: [AuthenticationGuard],
<% } -%>
      // Reuse ShellComponent instance when navigating between child views
      data: { reuse: true }
    };
  }
}
