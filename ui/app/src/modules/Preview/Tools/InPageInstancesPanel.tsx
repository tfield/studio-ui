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

import { useContentTypes, useLogicResource, usePreviewGuest, useSelection } from '../../../utils/hooks';
import React, { useEffect, useMemo, useState } from 'react';
import ToolPanel from './ToolPanel';
import { defineMessages, useIntl } from 'react-intl';
import MenuItem from '@material-ui/core/MenuItem';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { CONTENT_TREE_FIELD_SELECTED, setContentTypeFilter } from '../../../state/actions/preview';
import { useDispatch } from 'react-redux';
import Suspencified from '../../../components/SystemStatus/Suspencified';
import ContentInstance from '../../../models/ContentInstance';
import LookupTable from '../../../models/LookupTable';
import SearchBar from '../../../components/Controls/SearchBar';
import Select from '@material-ui/core/Select';
import ListItem from '@material-ui/core/ListItem';
import Avatar from '@material-ui/core/Avatar';
import { getInitials } from '../../../utils/string';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import CircularProgress from '@material-ui/core/CircularProgress';
import { getHostToGuestBus } from '../previewContext';
import EmptyState from '../../../components/SystemStatus/EmptyState';
import { Resource } from '../../../models/Resource';

const translations = defineMessages({
  title: {
    id: 'inPageInstances.title',
    defaultMessage: 'In this Page'
  },
  noResults: {
    id: 'inPageInstances.noResults',
    defaultMessage: 'No results found.'
  },
  selectContentType: {
    id: 'craftercms.ice.browseComponents.selectContentType',
    defaultMessage: 'Select content type'
  },
  chooseContentType: {
    id: 'craftercms.ice.browseComponents.chooseContentType',
    defaultMessage: 'Please choose a content type.'
  }
});

const useStyles = makeStyles((theme) =>
  createStyles({
    search: {
      padding: '15px 15px 0px 15px'
    },
    Select: {
      width: '100%',
      marginTop: '15px'
    },
    noWrapping: {
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      display: 'block'
    },
    selectProgress: {
      position: 'absolute',
      right: '28px'
    },
    emptyStateTitle: {
      fontSize: '1em'
    },
    item: {}
  })
);

export default function InPageInstancesPanel() {
  const classes = useStyles({});
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();
  const contentTypeLookup = useContentTypes();
  const contentTypeFilter = useSelection((state) => state.preview.components.contentTypeFilter);
  const guest = usePreviewGuest();
  const [keyword, setKeyword] = useState('');
  const hostToGuest$ = getHostToGuestBus();

  const models = useMemo(() => {
    return guest?.models;
  }, [guest]);

  const selectedModels = useMemo(() => {
    return Object.values(models ?? []).filter((model) => {
      return (
        model.craftercms.contentTypeId === contentTypeFilter &&
        (model.craftercms.label.toLowerCase().includes(keyword.toLowerCase()) ||
          model.craftercms.contentTypeId.toLowerCase().includes(keyword.toLowerCase()))
      );
    });
    //filter using .includes(keyword) on model.craftercms.label
  }, [contentTypeFilter, models, keyword]);

  const [contentTypes, setContentTypes] = useState([]);

  //setting contentTypes
  useEffect(() => {
    if (models) {
      const contentTypes = [];
      Object.values(models ?? []).forEach((model) => {
        if (contentTypes.indexOf(model.craftercms.contentTypeId) <= 0) {
          contentTypes.push(model.craftercms.contentTypeId);
        }
      });
      setContentTypes(contentTypes);
    }
    return () => {
      setContentTypes([]);
      setKeyword('');
    };
  }, [models]);

  const resource = useLogicResource<
    ContentInstance[],
    { models: LookupTable<ContentInstance>; contentTypeFilter: string }
  >(
    {
      models,
      contentTypeFilter
    },
    {
      shouldRenew: (source, resource) => Boolean(contentTypeFilter) && !keyword && resource.complete,
      shouldResolve: (source) => Boolean(source.models),
      shouldReject: (source) => false,
      errorSelector: (source) => null,
      resultSelector: (source) => {
        return Object.values(source.models)?.filter((model) => model.craftercms.contentTypeId === contentTypeFilter);
      }
    }
  );

  const handleSearchKeyword = (keyword) => {
    setKeyword(keyword);
  };

  const handleSelectChange = (value: string) => {
    setKeyword('');
    dispatch(setContentTypeFilter(value));
  };

  const onItemClick = (instance: ContentInstance) => {
    hostToGuest$.next({
      type: CONTENT_TREE_FIELD_SELECTED,
      payload: {
        name: instance.craftercms.label,
        modelId: instance.craftercms.id,
        fieldId: null,
        index: null
      }
    });
    return;
  };

  return (
    <ToolPanel title={translations.title}>
      <div className={classes.search}>
        <SearchBar
          onActionButtonClick={() => handleSearchKeyword('')}
          onChange={handleSearchKeyword}
          keyword={keyword}
          disabled={!Boolean(contentTypeFilter)}
        />
        <Select
          value={contentTypeFilter}
          displayEmpty
          className={classes.Select}
          onChange={(event: any) => handleSelectChange(event.target.value)}
          endAdornment={
            contentTypes.length && contentTypeLookup ? null : (
              <CircularProgress size={20} className={classes.selectProgress} />
            )
          }
        >
          <MenuItem value="" disabled>
            {formatMessage(translations.selectContentType)}
          </MenuItem>
          {contentTypeLookup &&
            contentTypes.map((id: string, i: number) => (
              <MenuItem value={contentTypeLookup[id].id} key={i}>
                {contentTypeLookup[id].name}
              </MenuItem>
            ))}
        </Select>
      </div>
      <Suspencified>
        <InPageInstancesUI
          resource={resource}
          selectedModels={selectedModels}
          onItemClick={onItemClick}
          contentTypeFilter={contentTypeFilter}
        />
      </Suspencified>
    </ToolPanel>
  );
}

interface InPageInstancesUIProps {
  resource: Resource<ContentInstance[]>;
  selectedModels: ContentInstance[];
  contentTypeFilter: string;
  onItemClick(instance: ContentInstance): void;
}

function InPageInstancesUI(props: InPageInstancesUIProps) {
  const { resource, selectedModels, onItemClick, contentTypeFilter } = props;
  resource.read();
  const classes = useStyles({});
  const { formatMessage } = useIntl();

  return (
    <>
      {selectedModels.length ? (
        selectedModels.map((instance: ContentInstance) => (
          <ListItem
            key={instance.craftercms.id}
            className={classes.item}
            button={true}
            onClick={() => onItemClick(instance)}
          >
            <ListItemAvatar>
              <Avatar>{getInitials(instance.craftercms.label)}</Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={instance.craftercms.label}
              secondary={instance.craftercms.contentTypeId}
              classes={{ primary: classes.noWrapping, secondary: classes.noWrapping }}
            />
          </ListItem>
        ))
      ) : (
        <EmptyState
          title={
            contentTypeFilter ? formatMessage(translations.noResults) : formatMessage(translations.chooseContentType)
          }
          classes={{ title: classes.emptyStateTitle }}
        />
      )}
    </>
  );
}
