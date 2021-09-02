/*
 * Copyright (C) 2007-2020 Crafter Software Corporation. All Rights Reserved.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 3 as published by
 * the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { ofType } from 'redux-observable';
import { exhaustMap, filter, map, withLatestFrom } from 'rxjs/operators';
import { catchAjaxError } from '../../utils/ajax';
import {
  fetchSiteConfig,
  fetchSiteConfigComplete,
  fetchSiteConfigFailed,
  fetchSiteUiConfig,
  fetchSiteUiConfigComplete,
  fetchSiteUiConfigFailed
} from '../actions/configuration';
import {
  fetchSiteConfig as fetchSiteConfigService,
  fetchSiteUiConfig as fetchSiteUiConfigService
} from '../../services/configuration';
import { CrafterCMSEpic } from '../store';

export default [
  (action$, state$) =>
    action$.pipe(
      ofType(fetchSiteUiConfig.type),
      withLatestFrom(state$),
      filter(([, state]) => Boolean(state.sites.active)),
      // A very quick site change may present problematic as the
      // config that would be retrieved would be the first site.
      exhaustMap(([{ payload }]) =>
        fetchSiteUiConfigService(payload.site).pipe(
          map((config) => fetchSiteUiConfigComplete({ config, site: payload.site })),
          catchAjaxError(fetchSiteUiConfigFailed)
        )
      )
    ),
  (action$, state$) =>
    action$.pipe(
      ofType(fetchSiteConfig.type),
      withLatestFrom(state$),
      filter(([, state]) => Boolean(state.sites.active)),
      exhaustMap(([, state]) =>
        fetchSiteConfigService(state.sites.active).pipe(
          map((config) => fetchSiteConfigComplete(config)),
          catchAjaxError(fetchSiteConfigFailed)
        )
      )
    )
] as CrafterCMSEpic[];
