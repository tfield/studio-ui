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

import ElementRegistry from '../../classes/ElementRegistry';
import { dragOk } from '../util';
import iceRegistry from '../../classes/ICERegistry';
import { createReducer } from '@reduxjs/toolkit';
import GuestReducer from '../models/GuestReducer';
import { GuestStandardAction } from '../models/GuestStandardAction';
import { ElementRecord } from '../../models/InContextEditing';
import { GuestActionTypes } from '../models/Actions';
import { GuestState } from '../models/GuestStore';
import { EditingStatus } from '../../models/ICEStatus';
import { deleteProperty, notNullOrUndefined, reversePluckProps } from '../../utils/object';
import {
  getDragContextFromReceptacles,
  getHighlighted,
  updateDropZoneValidations
} from '../../utils/dom';
import {
  ASSET_DRAG_ENDED,
  ASSET_DRAG_STARTED,
  CLEAR_HIGHLIGHTED_RECEPTACLES,
  COMPONENT_DRAG_ENDED,
  COMPONENT_DRAG_STARTED,
  COMPONENT_INSTANCE_DRAG_ENDED,
  COMPONENT_INSTANCE_DRAG_STARTED,
  CONTENT_TYPE_RECEPTACLES_REQUEST,
  DESKTOP_ASSET_DRAG_ENDED,
  DESKTOP_ASSET_DRAG_STARTED,
  DESKTOP_ASSET_UPLOAD_COMPLETE,
  DESKTOP_ASSET_UPLOAD_PROGRESS,
  DESKTOP_ASSET_UPLOAD_STARTED,
  EDIT_MODE_CHANGED,
  HOST_CHECK_IN,
  TRASHED
} from '../../constants';

// region mouseover
// TODO: Not pure.
const mouseover: GuestReducer = (state, action) => {
  const { record } = action.payload;
  if (state.status === EditingStatus.LISTENING) {
    const highlight = ElementRegistry.getHoverData(record.id);
    const draggable = ElementRegistry.getDraggable(record.id);
    return {
      ...state,
      draggable: { [record.id]: draggable },
      highlighted: { [record.id]: highlight }
    };
  }
  return state;
};
// endregion

// region mouseleave
const mouseleave: GuestReducer = (state) => {
  if (state.status === EditingStatus.LISTENING) {
    return {
      ...state,
      highlighted: {},
      draggable: {}
    };
  }
};
// endregion

// region host_component_drag_started
// TODO: Not pure.
const host_component_drag_started: GuestReducer = (state, action) => {
  const { contentType } = action.payload;
  if (notNullOrUndefined(contentType)) {
    const receptacles = iceRegistry.getContentTypeReceptacles(contentType);
    const validationsLookup = iceRegistry.runReceptaclesValidations(receptacles);
    const { players, siblings, containers, dropZones } = getDragContextFromReceptacles(receptacles, validationsLookup);
    const highlighted = getHighlighted(dropZones);

    return {
      ...state,
      highlighted,
      status: EditingStatus.PLACING_NEW_COMPONENT,
      dragContext: {
        ...state.dragContext,
        players,
        siblings,
        dropZones,
        containers,
        contentType,
        inZone: false,
        targetIndex: null,
        dragged: null
      }
    };
  } else {
    return state;
  }
};
// endregion

// region host_instance_drag_started
// TODO: Not pure.
const host_instance_drag_started: GuestReducer = (state, action) => {
  const { instance } = action.payload;
  if (notNullOrUndefined(instance)) {
    const receptacles = iceRegistry.getContentTypeReceptacles(instance.craftercms.contentTypeId);
    const validationsLookup = iceRegistry.runReceptaclesValidations(receptacles);
    const { players, siblings, containers, dropZones } = getDragContextFromReceptacles(receptacles, validationsLookup);
    const highlighted = getHighlighted(dropZones);

    return {
      ...state,
      highlighted,
      status: EditingStatus.PLACING_DETACHED_COMPONENT,
      dragContext: {
        ...state.dragContext,
        players,
        siblings,
        dropZones,
        containers,
        instance,
        inZone: false,
        targetIndex: null,
        dragged: null
      }
    };
  } else {
    return state;
  }
};
// endregion

// region asset_drag_started
const asset_drag_started: GuestReducer = (state, action) => {
  const { asset } = action.payload;
  if (notNullOrUndefined(asset)) {
    let type;
    if (asset.mimeType.includes('image/')) {
      type = 'image';
    } else if (asset.mimeType.includes('video/')) {
      type = 'video-picker';
    }
    const receptacles = iceRegistry.getMediaReceptacles(type);
    const { players, containers, dropZones } = getDragContextFromReceptacles(receptacles);
    const highlighted = getHighlighted(dropZones);

    return {
      ...state,
      highlighted,
      status: EditingStatus.PLACING_DETACHED_ASSET,
      dragContext: {
        ...state.dragContext,
        players,
        siblings: [],
        dropZones,
        containers,
        inZone: false,
        targetIndex: null,
        dragged: asset
      }
    };
  } else {
    return state;
  }
};
// endregion

// region desktop_asset_drag_started
const desktop_asset_drag_started: GuestReducer = (state, action) => {
  const { asset } = action.payload;
  if (notNullOrUndefined(asset)) {
    let type;
    if (asset.type.includes('image/')) {
      type = 'image';
    } else if (asset.type.includes('video/')) {
      type = 'video-picker';
    }
    const receptacles = iceRegistry.getMediaReceptacles(type);
    const { players, containers, dropZones } = getDragContextFromReceptacles(receptacles);
    const highlighted = getHighlighted(dropZones);

    return {
      ...state,
      highlighted,
      status: EditingStatus.UPLOAD_ASSET_FROM_DESKTOP,
      dragContext: {
        ...state.dragContext,
        players,
        siblings: [],
        dropZones,
        containers,
        inZone: false,
        targetIndex: null,
        dragged: asset
      }
    };
  } else {
    return state;
  }
};
// endregion

// region dragstart
// TODO: Not pure.
const dragstart: GuestReducer = (state, action) => {
  const { record } = action.payload;
  // onMouseOver pre-populates the draggable record
  // Items that browser make draggable by default (images, etc)
  const iceId = state.draggable?.[record.id];
  if (notNullOrUndefined(iceId)) {
    const receptacles = iceRegistry.getRecordReceptacles(iceId);
    const validationsLookup = iceRegistry.runReceptaclesValidations(receptacles);
    const { players, siblings, containers, dropZones } = getDragContextFromReceptacles(
      receptacles,
      validationsLookup,
      record
    );
    const highlighted = getHighlighted(dropZones);

    return {
      ...state,
      highlighted,
      status: EditingStatus.SORTING_COMPONENT,
      dragContext: {
        ...state.dragContext,
        players,
        siblings,
        dropZones,
        containers,
        inZone: false,
        targetIndex: null,
        dragged: iceRegistry.recordOf(iceId)
      }
    };
  } else {
    return state;
  }
};
// endregion

// region dragover
// const dragover: GuestReducer = (state, action) => {};
// endregion

// region dragleave
const dragleave: GuestReducer = (state, action) => {
  const leavingDropZone = !state.dragContext?.dropZone?.element.contains(action.payload.event.relatedTarget);
  return dragOk(state.status)
    ? {
      ...state,
      dragContext: {
        ...state.dragContext,
        over: null,
        inZone: false,
        targetIndex: null,
        dropZone: leavingDropZone ? null : state.dragContext.dropZone
      }
    }
    : state;
};
// endregion

// region drop
// const drop: GuestReducer = (state) => state;
// endregion

// region set_drop_position
const set_drop_position: GuestReducer = (state, action) => {
  const { targetIndex } = action.payload;
  return {
    ...state,
    dragContext: {
      ...state.dragContext,
      targetIndex
    }
  };
};
// endregion

// region dragend
// const dragend: GuestReducer = (state, action) => {};
// endregion

// region edit_component_inline
const edit_component_inline: GuestReducer = (state, action) => {
  return {
    ...state,
    status: EditingStatus.EDITING_COMPONENT_INLINE,
    draggable: {},
    highlighted: {}
  };
};
// endregion

// region exit_component_inline_edit
const exit_component_inline_edit: GuestReducer = (state) => {
  return {
    ...state,
    status: EditingStatus.LISTENING,
    highlighted: {}
  };
};
// endregion

// region ice_zone_selected
const ice_zone_selected: GuestReducer = (state, action) => {
  const { record } = action.payload;
  const highlight = ElementRegistry.getHoverData(record.id);
  return {
    ...state,
    status: EditingStatus.EDITING_COMPONENT,
    draggable: {},
    highlighted: { [record.id]: highlight }
  };
};
// endregion

// region dblclick
const dblclick: GuestReducer = (state, action) => {
  const { record } = action.payload;
  return state.status === EditingStatus.LISTENING
    ? {
      ...state,
      status: EditingStatus.EDITING_COMPONENT_INLINE,
      editable: {
        [record.id]: record
      }
    }
    : state;
};
// endregion

// region computed_dragend
const computed_dragend: GuestReducer = (state) => {
  return {
    ...state,
    status: EditingStatus.LISTENING,
    dragContext: null,
    highlighted: {}
  };
  // Previously
  // 1. EditingStatus.OFF
  // 2. EditingStatus.LISTENING after a timeout
  // Chrome didn't trigger the dragend event
  // without the set timeout.
  // setTimeout(() => {
  //   return {
  //     ...state
  //       status: EditingStatus.LISTENING
  //     };
  // });
};
// endregion

// region computed_dragover
// TODO: Not pure.
const computed_dragover: GuestReducer = (state, action) => {
  if (state.dragContext.scrolling) {
    return state;
  } else {
    const dragContext = state.dragContext;
    const { record, event } = action.payload;
    const element = record.element;
    if (dragContext.players.includes(element)) {
      let { next, prev } =
        // No point finding siblings for the drop zone element
        dragContext.containers.includes(element)
          ? { next: null, prev: null }
          : ElementRegistry.getSiblingRects(record.id);
      return {
        ...state,
        dragContext: {
          ...dragContext,
          next,
          prev,
          inZone: true,
          over: record,
          coordinates: { x: event.clientX, y: event.clientY },
          dropZone: dragContext.dropZones.find(
            (dz) => dz.element === element || dz.children.includes(element)
          )
        }
      };
    } else {
      return state;
    }
  }
};
// endregion

// region desktop_asset_upload_complete
// TODO: Carry or retrieve record for these events
const desktop_asset_upload_complete: GuestReducer = (
  state,
  action: GuestStandardAction<{ record: ElementRecord }>
) => {
  const { record } = action.payload;
  return {
    ...state,
    uploading: deleteProperty({ ...state.uploading }, `${record.id}`)
  };
};
// endregion

// region desktop_asset_upload_progress
const desktop_asset_upload_progress: GuestReducer = (state, action) => {
  const { percentage, record } = action.payload;
  return {
    ...state,
    uploading: {
      ...state.uploading,
      [record.id]: {
        ...state.uploading[record.id],
        progress: percentage
      }
    }
  };
};
// endregion

// region desktop_asset_upload_started
const desktop_asset_upload_started: GuestReducer = (state, action) => {
  const { record } = action.payload;
  return {
    ...state,
    uploading: {
      ...state.uploading,
      [record.id]: ElementRegistry.getHoverData(record.id)
    }
  };
};
// endregion

// region edit_mode_changed
const edit_mode_changed: GuestReducer = (state, action) => {
  const { inEditMode } = action.payload;
  const status = inEditMode ? EditingStatus.LISTENING : EditingStatus.OFF;
  return {
    ...state,
    status,
    inEditMode
  };
};
// endregion

// region clear_highlighted_receptacles
const clear_highlighted_receptacles: GuestReducer = (state, action) => {
  return {
    ...state,
    status: EditingStatus.LISTENING,
    highlighted: {}
  };
};
// endregion

// region content_type_receptacles_request
const content_type_receptacles_request: GuestReducer = (state, action) => {
  const { contentTypeId } = action.payload;
  const highlighted = {};

  iceRegistry.getContentTypeReceptacles(contentTypeId).forEach((item) => {
    let { physicalRecordId } = ElementRegistry.compileDropZone(item.id);
    highlighted[physicalRecordId] = ElementRegistry.getHoverData(physicalRecordId);
  });

  return {
    ...state,
    dragContext: {
      ...state.dragContext,
      inZone: false
    },
    status: EditingStatus.SHOW_RECEPTACLES,
    highlighted
  };
};
// endregion

// region start_listening
const start_listening: GuestReducer = (state) => {
  return {
    ...state,
    status: EditingStatus.LISTENING,
    highlighted: {}
  };
};
// endregion

// region scrolling
const scrolling: GuestReducer = (state) => {
  return {
    ...state,
    dragContext: {
      ...state.dragContext,
      scrolling: true
    }
  };
};
// endregion

// region scrolling_end
const scrolling_stopped: GuestReducer = (state) => {
  return {
    ...state,
    dragContext: {
      ...state.dragContext,
      scrolling: false,
      dropZones: state.dragContext?.dropZones?.map((dropZone) => ({
        ...dropZone,
        rect: dropZone.element.getBoundingClientRect(),
        childrenRects: dropZone.children.map((child) => child.getBoundingClientRect())
      }))
    }
  };
};
// endregion

// region drop_zone_enter
const drop_zone_enter: GuestReducer = (state, action) => {
  const { iceId } = action.payload;
  const { dropZones: currentDropZones } = state.dragContext;
  const currentDropZone = currentDropZones.find((dropZone) => dropZone.iceId === iceId);
  let length = currentDropZone.children.length;
  let invalidDrop = currentDropZone.origin ? false : state.dragContext.invalidDrop;
  let rest = reversePluckProps(currentDropZone.validations, 'maxCount', 'minCount');

  if (state.status === EditingStatus.SORTING_COMPONENT && currentDropZone.origin) {
    length = length - 1;
  }

  const maxCount = !currentDropZone.origin ? iceRegistry.runValidation(currentDropZone.iceId as number, 'maxCount', [length]) : null;

  if (maxCount) {
    rest.maxCount = maxCount;
    invalidDrop = true;
  }

  const dropZones = updateDropZoneValidations(currentDropZone, currentDropZones, rest);
  const highlighted = getHighlighted(dropZones);

  return {
    ...state,
    dragContext: {
      ...state.dragContext,
      dropZones,
      invalidDrop
    },
    highlighted
  };
};
// endregion

// region drop_zone_leave
const drop_zone_leave: GuestReducer = (state, action) => {
  const { iceId } = action.payload;
  if (!state.dragContext) {
    return;
  }
  const { dropZones: currentDropZones } = state.dragContext;
  const currentDropZone = currentDropZones.find((dropZone) => dropZone.iceId === iceId);
  let length = currentDropZone.children.length;
  let invalidDrop = state.status === EditingStatus.SORTING_COMPONENT ? state.dragContext.invalidDrop : false;
  let rest = reversePluckProps(currentDropZone.validations, 'minCount');

  if (state.status === EditingStatus.SORTING_COMPONENT && currentDropZone.origin) {
    length = length - 1;
  }

  const minCount = iceRegistry.runValidation(currentDropZone.iceId as number, 'minCount', [length]);

  if (minCount) {
    rest.minCount = minCount;
    invalidDrop = !!currentDropZone.origin;
  }

  const dropZones = updateDropZoneValidations(currentDropZone, currentDropZones, rest);
  const highlighted = getHighlighted(dropZones);

  return {
    ...state,
    dragContext: {
      ...state.dragContext,
      dropZones,
      invalidDrop
    },
    highlighted
  };
};
// endregion

const initialState: GuestState = {
  dragContext: null,
  draggable: {},
  editable: {},
  highlighted: {},
  ICE_GUEST_INIT: false,
  inEditMode: false,
  status: EditingStatus.LISTENING,
  uploading: {},
  models: {},
  contentTypes: {},
  hostCheckedIn: false
};

const foo = (state) => state;

const reducerFunctions: {
  [K in GuestActionTypes]: (...args: any) => GuestState;
} = {
  computed_dragend,
  computed_dragover,
  dblclick,
  dragend: foo,
  dragleave,
  dragover: foo,
  dragstart,
  drop: foo,
  set_drop_position,
  edit_component_inline,
  exit_component_inline_edit,
  ice_zone_selected,
  insert_component: foo,
  insert_instance: foo,
  mouseleave,
  mouseover,
  move_component: foo,
  set_edit_mode: (state, action) => ({ ...state, inEditMode: action.payload.inEditMode }),
  start_listening,
  add_asset_types: foo,
  click: foo,
  scrolling,
  scrolling_stopped,
  drop_zone_enter,
  drop_zone_leave,
  [TRASHED]: foo,
  [ASSET_DRAG_ENDED]: foo,
  [COMPONENT_DRAG_ENDED]: foo,
  [COMPONENT_INSTANCE_DRAG_ENDED]: foo,
  [DESKTOP_ASSET_DRAG_ENDED]: foo,
  [EDIT_MODE_CHANGED]: edit_mode_changed,
  [CONTENT_TYPE_RECEPTACLES_REQUEST]: content_type_receptacles_request,
  [CLEAR_HIGHLIGHTED_RECEPTACLES]: clear_highlighted_receptacles,
  [DESKTOP_ASSET_UPLOAD_STARTED]: desktop_asset_upload_started,
  [DESKTOP_ASSET_UPLOAD_COMPLETE]: desktop_asset_upload_complete,
  [DESKTOP_ASSET_UPLOAD_PROGRESS]: desktop_asset_upload_progress,
  [COMPONENT_DRAG_STARTED]: host_component_drag_started,
  [COMPONENT_INSTANCE_DRAG_STARTED]: host_instance_drag_started,
  [DESKTOP_ASSET_DRAG_STARTED]: desktop_asset_drag_started,
  [ASSET_DRAG_STARTED]: asset_drag_started,
  [HOST_CHECK_IN]: (state, action) => ({
    ...state,
    hostCheckedIn: true,
    inEditMode: action.payload.editMode
  })
};

export default createReducer<GuestState>(initialState, reducerFunctions);
