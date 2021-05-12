/*
 * Copyright (C) 2007-2021 Crafter Software Corporation. All Rights Reserved.
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

import { Observable } from 'rxjs';
import { get } from '../utils/ajax';
import { pluck } from 'rxjs/operators';
import { WorkflowState } from '../models/WorkflowState';

export function fetchWorkflowStates(siteId: string, state: string = 'ALL'): Observable<WorkflowState[]> {
  return get(`/studio/api/1/services/api/1/content/get-item-states.json?site=${siteId}&state=${state}`).pipe(
    pluck('response')
  );
}
