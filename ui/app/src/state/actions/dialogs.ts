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

import { createAction } from '@reduxjs/toolkit';
import StandardAction from '../../models/StandardAction';
import { HistoryDialogStateProps } from '../../modules/Content/History/HistoryDialog';
import { ViewVersionDialogStateProps } from '../../modules/Content/History/ViewVersionDialog';
import { FetchContentVersion } from '../../models/Version';
import { CompareVersionsDialogStateProps } from '../../modules/Content/History/CompareVersionsDialog';
import { ConfirmDialogStateProps } from '../../components/Dialogs/ConfirmDialog';
import { NewContentDialogStateProps } from '../../modules/Content/Authoring/NewContentDialog';
import { DependenciesDialogStateProps } from '../../modules/Content/Dependencies/DependenciesDialog';
import { WorkflowCancellationDialogStateProps } from '../../components/Dialogs/WorkflowCancellationDialog';
import { RejectDialogStateProps } from '../../components/Dialogs/RejectDialog';
import { LegacyFormDialogStateProps } from '../../components/Dialogs/LegacyFormDialog';
import { EditSiteDialogStateProps } from '../../modules/System/Sites/Edit/EditSiteDialog';
import { CreateFolderStateProps } from '../../components/Dialogs/CreateFolderDialog';
import { CreateFileStateProps } from '../../components/Dialogs/CreateFileDialog';
import { UploadDialogStateProps } from '../../components/Dialogs/UploadDialog';
import { PreviewDialogStateProps } from '../../components/Dialogs/PreviewDialog';
import { PathSelectionDialogStateProps } from '../../components/Dialogs/PathSelectionDialog';
import { ChangeContentTypeDialogStateProps } from '../../modules/Content/Authoring/ChangeContentTypeDialog';
import { CopyDialogStateProps } from '../../components/Dialogs/CopyDialog';
import { ItemMenuStateProps } from '../../components/ItemActionsMenu';
import { ItemMegaMenuStateProps } from '../../components/ItemMegaMenu';
import { LauncherStateProps } from '../../components/Launcher/Launcher';
import { PublishingStatusDialogStateProps } from '../../components/PublishingStatusDialog';
import { UnlockPublisherDialogStateProps } from '../../components/UnlockPublisherDialog';
import { WidgetDialogStateProps } from '../../components/WidgetDialog';
import { CodeEditorDialogStateProps } from '../../components/CodeEditorDialog';
import { PublishDialogStateProps } from '../../components/PublishDialog/utils';
import { DeleteDialogStateProps } from '../../components/DeleteDialog/utils';
import { FetchDeleteDependenciesResponse } from '../../services/dependencies';

// region History
export const showHistoryDialog = /*#__PURE__*/ createAction<Partial<HistoryDialogStateProps>>('SHOW_HISTORY_DIALOG');
export const closeHistoryDialog = /*#__PURE__*/ createAction<StandardAction>('CLOSE_HISTORY_DIALOG');
export const historyDialogClosed = /*#__PURE__*/ createAction('HISTORY_DIALOG_CLOSED');
// endregion

// region View Versions
export const showViewVersionDialog = /*#__PURE__*/ createAction<Partial<ViewVersionDialogStateProps>>(
  'SHOW_VIEW_VERSION_DIALOG'
);
export const closeViewVersionDialog = /*#__PURE__*/ createAction<StandardAction>('CLOSE_VIEW_VERSION_DIALOG');
export const viewVersionDialogClosed = /*#__PURE__*/ createAction<StandardAction>('VERSION_DIALOG_CLOSED');
// endregion

// region Fetch content
export const fetchContentVersion = /*#__PURE__*/ createAction<FetchContentVersion>('FETCH_CONTENT_VERSION');
export const fetchContentVersionComplete = /*#__PURE__*/ createAction<any>('FETCH_CONTENT_VERSION_COMPLETE');
export const fetchContentVersionFailed = /*#__PURE__*/ createAction<any>('FETCH_CONTENT_VERSION_FAILED');
// endregion

// region Compare Versions
export const showCompareVersionsDialog = /*#__PURE__*/ createAction<Partial<CompareVersionsDialogStateProps>>(
  'SHOW_COMPARE_VERSIONS_DIALOG'
);
export const closeCompareVersionsDialog = /*#__PURE__*/ createAction<StandardAction>('CLOSE_COMPARE_VERSIONS_DIALOG');
export const compareVersionsDialogClosed = /*#__PURE__*/ createAction('COMPARE_VERSIONS_DIALOG_CLOSED');
// endregion

// region Confirm
export const showConfirmDialog = /*#__PURE__*/ createAction<Partial<ConfirmDialogStateProps>>('SHOW_CONFIRM_DIALOG');
export const closeConfirmDialog = /*#__PURE__*/ createAction<StandardAction>('CLOSE_CONFIRM_DIALOG');
export const confirmDialogClosed = /*#__PURE__*/ createAction('CONFIRM_DIALOG_CLOSED');
// endregion

// region Publish
export const showPublishDialog = /*#__PURE__*/ createAction<Partial<PublishDialogStateProps>>('SHOW_PUBLISH_DIALOG');
export const updatePublishDialog = /*#__PURE__*/ createAction<Partial<PublishDialogStateProps>>(
  'UPDATE_PUBLISH_DIALOG'
);
export const closePublishDialog = /*#__PURE__*/ createAction<StandardAction>('CLOSE_PUBLISH_DIALOG');
export const publishDialogClosed = /*#__PURE__*/ createAction('PUBLISH_DIALOG_CLOSED');
// endregion

// region Delete
export const showDeleteDialog = /*#__PURE__*/ createAction<Partial<DeleteDialogStateProps>>('SHOW_DELETE_DIALOG');
export const updateDeleteDialog = /*#__PURE__*/ createAction<Partial<DeleteDialogStateProps>>('UPDATE_DELETE_DIALOG');
export const closeDeleteDialog = /*#__PURE__*/ createAction<StandardAction>('CLOSE_DELETE_DIALOG');
export const deleteDialogClosed = /*#__PURE__*/ createAction('DELETE_DIALOG_CLOSED');
export const fetchDeleteDependencies = /*#__PURE__*/ createAction<{ paths: string[] }>('FETCH_DELETE_DEPENDENCIES');
export const fetchDeleteDependenciesComplete = /*#__PURE__*/ createAction<FetchDeleteDependenciesResponse>(
  'FETCH_DELETE_DEPENDENCIES_COMPLETE'
);
export const fetchDeleteDependenciesFailed = /*#__PURE__*/ createAction('FETCH_DELETE_DEPENDENCIES_FAILED');
// endregion

// region New Content
export const showNewContentDialog = /*#__PURE__*/ createAction<Partial<NewContentDialogStateProps>>(
  'SHOW_NEW_CONTENT_DIALOG'
);
export const closeNewContentDialog = /*#__PURE__*/ createAction<StandardAction>('CLOSE_NEW_CONTENT_DIALOG');
export const newContentDialogClosed = /*#__PURE__*/ createAction('NEW_CONTENT_DIALOG_CLOSED');
// endregion

// region Change ContentType
export const showChangeContentTypeDialog = /*#__PURE__*/ createAction<Partial<ChangeContentTypeDialogStateProps>>(
  'SHOW_CHANGE_CONTENT_TYPE_DIALOG'
);
export const closeChangeContentTypeDialog = /*#__PURE__*/ createAction<StandardAction>(
  'CLOSE_CHANGE_CONTENT_TYPE_DIALOG'
);
export const changeContentTypeDialogClosed = /*#__PURE__*/ createAction('CHANGE_CONTENT_TYPE_DIALOG_CLOSED');
// endregion

// region Dependencies
export const showDependenciesDialog = /*#__PURE__*/ createAction<Partial<DependenciesDialogStateProps>>(
  'SHOW_DEPENDENCIES_DIALOG'
);
export const closeDependenciesDialog = /*#__PURE__*/ createAction<StandardAction>('CLOSE_DEPENDENCIES_DIALOG');
export const dependenciesDialogClosed = /*#__PURE__*/ createAction('DEPENDENCIES_DIALOG_CLOSED');
// endregion

// region Workflow Cancellation

export const showWorkflowCancellationDialog = /*#__PURE__*/ createAction<Partial<WorkflowCancellationDialogStateProps>>(
  'SHOW_WORKFLOW_CANCELLATION_DIALOG'
);

export const closeWorkflowCancellationDialog = /*#__PURE__*/ createAction<StandardAction>(
  'CLOSE_WORKFLOW_CANCELLATION_DIALOG'
);

export const workflowCancellationDialogClosed = /*#__PURE__*/ createAction('WORKFLOW_CANCELLATION_DIALOG_CLOSED');

// endregion

// region Reject
export const showRejectDialog = /*#__PURE__*/ createAction<Partial<RejectDialogStateProps>>('SHOW_REJECT_DIALOG');
export const closeRejectDialog = /*#__PURE__*/ createAction<StandardAction>('CLOSE_REJECT_DIALOG');
export const rejectDialogClosed = /*#__PURE__*/ createAction('REJECT_DIALOG_CLOSED');
// endregion

// region Legacy Form
export const showEditDialog = /*#__PURE__*/ createAction<LegacyFormDialogStateProps>('SHOW_EDIT_DIALOG');
export const closeEditDialog = /*#__PURE__*/ createAction<StandardAction>('CLOSE_EDIT_DIALOG');
export const editDialogClosed = /*#__PURE__*/ createAction<StandardAction>('EDIT_DIALOG_CLOSED');
export const newContentCreationComplete = /*#__PURE__*/ createAction<StandardAction>('NEW_CONTENT_CREATION_COMPLETE');
export const updateEditConfig = /*#__PURE__*/ createAction<any>('UPDATE_EDIT_CONFIG');
// endregion

// region Legacy Code Editor
export const showCodeEditorDialog = /*#__PURE__*/ createAction<Partial<CodeEditorDialogStateProps>>(
  'SHOW_CODE_EDITOR_DIALOG'
);
export const closeCodeEditorDialog = /*#__PURE__*/ createAction<StandardAction>('CLOSE_CODE_EDITOR_DIALOG');
export const codeEditorDialogClosed = /*#__PURE__*/ createAction('CODE_EDITOR_DIALOG_CLOSED');
export const updateCodeEditorDialog = /*#__PURE__*/ createAction<any>('UPDATE_CODE_EDITOR_DIALOG');
// endregion

// region Create Folder Dialog
export const showCreateFolderDialog = /*#__PURE__*/ createAction<Partial<CreateFolderStateProps>>(
  'SHOW_CREATE_FOLDER_DIALOG'
);
export const closeCreateFolderDialog = /*#__PURE__*/ createAction<StandardAction>('CLOSE_CREATE_FOLDER_DIALOG');
export const createFolderDialogClosed = /*#__PURE__*/ createAction('CREATE_FOLDER_DIALOG_CLOSED');
// endregion

// region Create File Dialog
export const showCreateFileDialog = /*#__PURE__*/ createAction<Partial<CreateFileStateProps>>(
  'SHOW_CREATE_FILE_DIALOG'
);
export const closeCreateFileDialog = /*#__PURE__*/ createAction<StandardAction>('CLOSE_CREATE_FILE_DIALOG');
export const createFileDialogClosed = /*#__PURE__*/ createAction('CREATE_FILE_DIALOG_CLOSED');
// endregion

// region Copy Dialog
export const showCopyDialog = /*#__PURE__*/ createAction<Partial<CopyDialogStateProps>>('SHOW_COPY_DIALOG');
export const closeCopyDialog = /*#__PURE__*/ createAction<StandardAction>('CLOSE_COPY_DIALOG');
export const copyDialogClosed = /*#__PURE__*/ createAction('COPY_DIALOG_CLOSED');
// endregion

// region Upload Dialog
export const showUploadDialog = /*#__PURE__*/ createAction<Partial<UploadDialogStateProps>>('SHOW_UPLOAD_DIALOG');
export const closeUploadDialog = /*#__PURE__*/ createAction<StandardAction>('CLOSE_UPLOAD_DIALOG');
export const uploadDialogClosed = /*#__PURE__*/ createAction('UPLOAD_DIALOG_CLOSED');
// endregion

// region Preview Dialog
export const showPreviewDialog = /*#__PURE__*/ createAction<Partial<PreviewDialogStateProps>>('SHOW_PREVIEW_DIALOG');
export const updatePreviewDialog = /*#__PURE__*/ createAction<Partial<PreviewDialogStateProps>>(
  'UPDATE_PREVIEW_DIALOG'
);
export const closePreviewDialog = /*#__PURE__*/ createAction<StandardAction>('CLOSE_PREVIEW_DIALOG');
export const previewDialogClosed = /*#__PURE__*/ createAction('PREVIEW_DIALOG_CLOSED');
// endregion

// region Edit Site
export const showEditSiteDialog = /*#__PURE__*/ createAction<Partial<EditSiteDialogStateProps>>(
  'SHOW_EDIT_SITE_DIALOG'
);
export const closeEditSiteDialog = /*#__PURE__*/ createAction<StandardAction>('CLOSE_EDIT_SITE_DIALOG');
export const editSiteDialogClosed = /*#__PURE__*/ createAction('EDIT_SITE_DIALOG_CLOSED');
// endregion

// region Path Selection Dialog
export const showPathSelectionDialog = /*#__PURE__*/ createAction<Partial<PathSelectionDialogStateProps>>(
  'SHOW_PATH_SELECTION_DIALOG'
);
export const closePathSelectionDialog = /*#__PURE__*/ createAction<StandardAction>('CLOSE_PATH_SELECTION_DIALOG');
export const pathSelectionDialogClosed = /*#__PURE__*/ createAction('PATH_SELECTION_CLOSED');
// endregion

// region Item Menu
export const showItemMenu = /*#__PURE__*/ createAction<Partial<ItemMenuStateProps>>('SHOW_ITEM_MENU');
export const closeItemMenu = /*#__PURE__*/ createAction<StandardAction>('CLOSE_ITEM_MENU');
export const itemMenuClosed = /*#__PURE__*/ createAction('ITEM_MENU_CLOSED');
// endregion

// region Item Mega Menu
export const showItemMegaMenu = /*#__PURE__*/ createAction<Partial<ItemMegaMenuStateProps>>('SHOW_ITEM_MEGA_MENU');
export const closeItemMegaMenu = /*#__PURE__*/ createAction<StandardAction>('CLOSE_ITEM_MEGA_MENU');
export const itemMegaMenuClosed = /*#__PURE__*/ createAction('ITEM_MEGA_MENU_CLOSED');
// endregion

// region Global Nav
export const showLauncher = /*#__PURE__*/ createAction<Partial<LauncherStateProps>>('SHOW_LAUNCHER');
export const closeLauncher = /*#__PURE__*/ createAction('CLOSE_LAUNCHER');
// endregion

// region PublishingStatusDialog
export const showPublishingStatusDialog = /*#__PURE__*/ createAction<Partial<PublishingStatusDialogStateProps>>(
  'SHOW_PUBLISHING_STATUS_DIALOG'
);
export const closePublishingStatusDialog = /*#__PURE__*/ createAction('HIDE_PUBLISHING_STATUS_DIALOG');
// endregion

// region Unlock Publisher Dialog
export const showUnlockPublisherDialog = /*#__PURE__*/ createAction<Partial<UnlockPublisherDialogStateProps>>(
  'SHOW_UNLOCK_PUBLISHER_DIALOG'
);
export const closeUnlockPublisherDialog = /*#__PURE__*/ createAction('CLOSE_UNLOCK_PUBLISHER_DIALOG');
// endregion

// region Widget Dialog
export const showWidgetDialog = /*#__PURE__*/ createAction<Partial<WidgetDialogStateProps>>('SHOW_WIDGET_DIALOG');
export const closeWidgetDialog = /*#__PURE__*/ createAction<StandardAction>('CLOSE_WIDGET_DIALOG');
export const widgetDialogClosed = /*#__PURE__*/ createAction('WIDGET_DIALOG_CLOSED');
// endregion
