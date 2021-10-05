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

import React from 'react';
import PullFromRemoteDialogContainer from './PullFromRemoteDialogContainer';
import { EnhancedDialog } from '../EnhancedDialog';
import { PullFromRemoteDialogProps } from './utils';
import { FormattedMessage } from 'react-intl';

export function PullFromRemoteDialog(props: PullFromRemoteDialogProps) {
  const { branches, remoteName, mergeStrategies, onPullSuccess, onPullError, ...rest } = props;

  return (
    <EnhancedDialog title={<FormattedMessage id="words.pull" defaultMessage="Pull" />} maxWidth="xs" {...rest}>
      <PullFromRemoteDialogContainer
        branches={branches}
        mergeStrategies={mergeStrategies}
        remoteName={remoteName}
        onPullSuccess={onPullSuccess}
        onPullError={onPullError}
      />
    </EnhancedDialog>
  );
}

export default PullFromRemoteDialog;
