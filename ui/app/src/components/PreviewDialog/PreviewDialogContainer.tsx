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

import React, { useState } from 'react';
import AsyncVideoPlayer from '../AsyncVideoPlayer/AsyncVideoPlayer';
import LoadingState, { ConditionalLoadingState } from '../LoadingState/LoadingState';
import IFrame from '../IFrame/IFrame';
import { nou } from '../../utils/object';
import AceEditor from '../AceEditor/AceEditor';
import { PreviewDialogContainerProps } from './utils';
import { useStyles } from './styles';
import DialogFooter from '../DialogFooter';
import SecondaryButton from '../SecondaryButton';
import { FormattedMessage } from 'react-intl';
import PrimaryButton from '../PrimaryButton';
import { useDetailedItem } from '../../hooks';
import { DialogBody } from '../DialogBody';
import { useDispatch } from 'react-redux';
import { closeCodeEditorDialog, closePreviewDialog, showCodeEditorDialog } from '../../state/actions/dialogs';
import { batchActions } from '../../state/actions/misc';
import { conditionallyUnlockItem } from '../../state/actions/content';
import { hasEditAction } from '../../utils/content';

export function PreviewDialogContainer(props: PreviewDialogContainerProps) {
  const { title, content, mode, url, onClose, type } = props;
  const classes = useStyles();
  const item = useDetailedItem(url);
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(true);

  const renderPreview = () => {
    switch (type) {
      case 'image':
        return <img src={url} alt="" />;
      case 'video':
        return <AsyncVideoPlayer playerOptions={{ src: url, autoplay: true }} />;
      case 'page':
        return (
          <>
            {isLoading && <LoadingState />}
            <IFrame
              url={url}
              title={title}
              width={isLoading ? 0 : 960}
              height={isLoading ? 0 : 600}
              onLoadComplete={() => setIsLoading(false)}
            />
          </>
        );
      case 'editor': {
        return (
          <ConditionalLoadingState isLoading={nou(content)}>
            <AceEditor value={content} classes={{ editorRoot: classes.editor }} mode={`ace/mode/${mode}`} readOnly />
          </ConditionalLoadingState>
        );
      }
      default:
        break;
    }
  };

  const onEdit = () => {
    dispatch(
      batchActions([
        closePreviewDialog(),
        showCodeEditorDialog({
          path: url,
          mode,
          onClose: batchActions([closeCodeEditorDialog(), conditionallyUnlockItem({ path: url })])
        })
      ])
    );
  };

  return (
    <>
      <DialogBody className={classes.container}>{renderPreview()}</DialogBody>
      {type === 'editor' && (
        <DialogFooter>
          <SecondaryButton onClick={(e) => onClose(e, null)}>
            <FormattedMessage id="words.close" defaultMessage="Close" />
          </SecondaryButton>
          {hasEditAction(item.availableActions) && (
            <PrimaryButton sx={{ marginLeft: '15px' }} onClick={onEdit}>
              <FormattedMessage id="words.edit" defaultMessage="Edit" />
            </PrimaryButton>
          )}
        </DialogFooter>
      )}
    </>
  );
}
