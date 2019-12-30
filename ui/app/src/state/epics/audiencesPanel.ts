/*
 * Copyright (C) 2007-2019 Crafter Software Corporation. All Rights Reserved.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 *
 */

import { Epic, ofType } from 'redux-observable';
import {
  FETCH_AUDIENCES_PANEL_CONFIG,
  fetchAudiencesPanelConfigComplete,
  fetchAudiencesPanelConfigFailed
} from "../actions/preview";
import { map, switchMap, withLatestFrom } from "rxjs/operators";
import { catchAjaxError } from "../../utils/ajax";
import { getAudiencesPanelConfig } from "../../services/configuration";
import { Observable } from "rxjs";
import GlobalState from "../../models/GlobalState";

const fetchAudiencesPanelConfig: Epic = (action$, state$: Observable<GlobalState>) => action$.pipe(
  ofType(FETCH_AUDIENCES_PANEL_CONFIG),
  withLatestFrom(state$),
  switchMap(([, state]) => getAudiencesPanelConfig(state.sites.active)),
  map(fetchAudiencesPanelConfigComplete),
  catchAjaxError(fetchAudiencesPanelConfigFailed)
);

export default [
  fetchAudiencesPanelConfig
] as Epic[];
