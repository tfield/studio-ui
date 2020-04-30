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

import StandardAction from '../../../models/StandardAction';
import React, { useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import { useStateResource } from '../../../utils/hooks';
import { FancyFormattedDate, VersionList } from './VersionList';
import { SuspenseWithEmptyState } from '../../../components/SystemStatus/Suspencified';
import ApiResponse from '../../../models/ApiResponse';
import DialogHeader, {
  DialogHeaderAction,
  DialogHeaderStateAction
} from '../../../components/Dialogs/DialogHeader';
import { LegacyVersion, VersionsStateProps } from '../../../models/Version';
import DialogBody from '../../../components/Dialogs/DialogBody';
import DialogFooter from '../../../components/Dialogs/DialogFooter';
import { Pagination } from './HistoryDialog';
import {
  compareBothVersions,
  compareVersion,
  fetchItemVersions,
  versionsChangePage
} from '../../../state/reducers/versions';
import { useDispatch } from 'react-redux';
import makeStyles from '@material-ui/styles/makeStyles';
import createStyles from '@material-ui/styles/createStyles';
import ContentType, { ContentTypeField } from '../../../models/ContentType';
import { EntityState } from '../../../models/EntityState';
import { fetchChildrenByPath } from '../../../state/reducers/items';
import { ItemsStateProps, SandboxItem } from '../../../models/Item';
import EmptyState from '../../../components/SystemStatus/EmptyState';
import Typography from '@material-ui/core/Typography';
import { palette } from '../../../styles/theme';
import { LookupTable } from '../../../models/LookupTable';
import { Resource } from '../../../models/Resource';
import ListItemText from '@material-ui/core/ListItemText';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMoreRounded';
import SingleItemSelector from '../Authoring/SingleItemSelector';
import { withoutIndex } from '../../../utils/path';

const translations = defineMessages({
  backToSelectRevision: {
    id: 'compareVersionsDialog.back.selectRevision',
    defaultMessage: 'Back to select revision'
  }
});

const useStyles = makeStyles(() =>
  createStyles({
    singleItemSelector: {
      marginBottom: '10px'
    },
    typography: {
      lineHeight: '1.5'
    }
  })
);

interface CompareVersionsDialogBaseProps {
  open: boolean;
  error: ApiResponse;
  isFetching: boolean;
}

interface CompareVersionsDialogProps extends CompareVersionsDialogBaseProps {
  versionsBranch: VersionsStateProps;
  itemsBranch: ItemsStateProps;
  selectedA: LegacyVersion;
  selectedB: LegacyVersion;
  contentTypesBranch?: EntityState<ContentType>;
  rightActions?: DialogHeaderAction[];
  onClose(): void;
  onDismiss(): void;
}

export interface CompareVersionsDialogStateProps extends CompareVersionsDialogBaseProps {
  rightActions?: DialogHeaderStateAction[];
  onClose?: StandardAction;
  onDismiss?: StandardAction;
}

export const compareVersionsDialogID = 'compareVersionsDialog';

export default function CompareVersionsDialog(props: CompareVersionsDialogProps) {
  const { open, rightActions, selectedA, selectedB, onDismiss, onClose, versionsBranch, contentTypesBranch, itemsBranch } = props;
  const { count, page, limit, selected, compareVersionsBranch, current, path } = versionsBranch;
  const { consumers } = itemsBranch;
  const { formatMessage } = useIntl();
  const classes = useStyles({});
  const [openSelector, setOpenSelector] = useState(false);
  const dispatch = useDispatch();
  const selectMode = selectedA && !selectedB;
  const compareMode = selectedA && selectedB;

  const versionsResource = useStateResource<LegacyVersion[], VersionsStateProps>(versionsBranch, {
    shouldResolve: (versionsBranch) => Boolean(versionsBranch.versions) && !versionsBranch.isFetching,
    shouldReject: (versionsBranch) => Boolean(versionsBranch.error),
    shouldRenew: (versionsBranch, resource) => (
      resource.complete
    ),
    resultSelector: (versionsBranch) => versionsBranch.versions,
    errorSelector: (versionsBranch) => versionsBranch.error
  });

  const compareVersionsResource = useStateResource<CompareVersionsResource, any>(
    {
      compareVersionsBranch,
      contentTypesBranch
    },
    {
      shouldResolve: ({ compareVersionsBranch, contentTypesBranch }) => (
        Boolean(
          compareVersionsBranch.compareVersions &&
          contentTypesBranch.byId &&
          !compareVersionsBranch.isFetching &&
          !contentTypesBranch.isFetching
        )
      ),
      shouldReject: ({ compareVersionsBranch, contentTypesBranch }) => (
        Boolean(compareVersionsBranch.error || contentTypesBranch.error)
      ),
      shouldRenew: ({ compareVersionsBranch, contentTypesBranch }, resource) => (
        (compareVersionsBranch.isFetching || contentTypesBranch.isFetching) && resource.complete
      ),
      resultSelector: ({ compareVersionsBranch, contentTypesBranch }) => (
        {
          a: compareVersionsBranch.compareVersions?.[0],
          b: compareVersionsBranch.compareVersions?.[1],
          contentTypes: contentTypesBranch.byId
        }
      ),
      errorSelector: ({ compareVersionsBranch, contentTypesBranch }) => (
        compareVersionsBranch.error || contentTypesBranch.error
      )
    }
  );

  const handleItemClick = (version: LegacyVersion) => {
    if (!selected[0]) {
      dispatch(compareVersion(version.versionNumber));
    } else if (selected[0] !== version.versionNumber) {
      dispatch(compareBothVersions([selected[0], version.versionNumber]));
    } else {
      dispatch(compareVersion());
    }
  };

  const onPageChanged = (nextPage: number) => {
    dispatch(versionsChangePage(nextPage));
  };

  return (
    <Dialog
      onClose={onClose}
      open={open}
      fullWidth
      maxWidth="md"
      onEscapeKeyDown={onDismiss}
    >
      <DialogHeader
        title={
          <FormattedMessage
            id="compareVersionsDialog.headerTitle"
            defaultMessage="Compare item versions"
          />
        }
        subtitle={
          (selectMode) ? (
            <FormattedMessage
              id="compareVersionsDialog.headerSubtitle"
              defaultMessage="Select a revision to compare to “{selectedA}”"
              values={{ selectedA: <FancyFormattedDate date={selectedA.lastModifiedDate} /> }}
            />
          ) : (
            (!compareMode) &&
            <FormattedMessage
              id="compareVersionsDialog.headerSubtitle"
              defaultMessage="Select a revision to compare"
            />
          )
        }
        leftActions={compareMode ? [{
          icon: 'BackIcon',
          onClick: () => dispatch(compareVersion(selected[0])),
          'aria-label': formatMessage(translations.backToSelectRevision)
        }] : null}
        rightActions={rightActions}
        onDismiss={onDismiss}
      />
      <DialogBody>
        {
          !compareMode &&
          <SingleItemSelector
            classes={{ root: classes.singleItemSelector }}
            label="Item"
            consumer={consumers[compareVersionsDialogID]}
            open={openSelector}
            onClose={() => setOpenSelector(false)}
            selectedItem={consumers[compareVersionsDialogID]?.byId?.[path]}
            onDropdownClick={() => {
              setOpenSelector(!openSelector);
            }}
            onPathSelected={(item) => {
              dispatch(fetchChildrenByPath({ id: compareVersionsDialogID, path: item.path }));
            }}
            onBreadcrumbSelected={(item: SandboxItem) => {
              if (withoutIndex(item.path) === withoutIndex(consumers[compareVersionsDialogID]?.path)) {
                setOpenSelector(false);
                dispatch(fetchItemVersions({ path: item.path }));
              } else {
                dispatch(fetchChildrenByPath({ id: compareVersionsDialogID, path: item.path }));
              }
            }}
            onItemClicked={(item) => {
              setOpenSelector(false);
              dispatch(fetchItemVersions({ path: item.path }));
            }}
          />
        }
        {
          compareMode ? (
            <SuspenseWithEmptyState resource={compareVersionsResource}>
              <CompareVersions resource={compareVersionsResource} />
            </SuspenseWithEmptyState>
          ) : (path ? (
              <SuspenseWithEmptyState resource={versionsResource}>
                <VersionList
                  selected={selected}
                  resource={versionsResource}
                  current={current}
                  onItemClick={handleItemClick}
                />
              </SuspenseWithEmptyState>
            ) : (
              <EmptyState
                title={
                  <FormattedMessage
                    id="compareVersionsDialog.pleaseContentItem"
                    defaultMessage="Please content item"
                  />
                }
              >
                <section>
                  <Typography
                    variant="subtitle1"
                    color="textSecondary"
                    className={classes.typography}
                  >
                    1. Select item <br />
                    2. Select revision “A” <br />
                    3. Select revision “B” <br />
                    4. View diff
                  </Typography>
                </section>
              </EmptyState>
            )
          )
        }
      </DialogBody>
      {
        (!compareMode && path) &&
        <DialogFooter>
          <Pagination
            count={count}
            page={page}
            rowsPerPage={limit}
            onPageChanged={onPageChanged}
          />
        </DialogFooter>
      }
    </Dialog>
  );
}

const CompareVersionsStyles = makeStyles(() =>
  createStyles({
    compareBoxHeader: {
      display: 'flex',
      justifyContent: 'space-around'
    },
    compareBoxHeaderItem: {
      flexBasis: '50%',
      margin: '0 10px 10px 10px',
      '& .blackText': {
        color: palette.black
      }
    },
    compareVersionsContent: {
      background: palette.white
    },
    root: {
      margin: 0,
      '&.Mui-expanded': {
        margin: 0,
        borderBottom: `1px solid rgba(0,0,0,0.12)`
      }
    },
    bold: {
      fontWeight: 600
    }
  })
);

interface CompareVersionsResource {
  a: any;
  b: any;
  contentTypes: LookupTable<ContentType>;
}

interface CompareVersionsProps {
  resource: Resource<CompareVersionsResource>;
}

function CompareVersions(props: CompareVersionsProps) {
  const classes = CompareVersionsStyles({});
  const { a, b, contentTypes } = props.resource.read();
  const values = Object.values(contentTypes[a.contentType].fields) as ContentTypeField[];

  return (
    <>
      <section className={classes.compareBoxHeader}>
        <div className={classes.compareBoxHeaderItem}>
          <ListItemText
            primary={<FancyFormattedDate date={a.lastModifiedDate} />}
            secondary={
              <FormattedMessage
                id="historyDialog.versionNumber"
                defaultMessage="Version: <span>{versionNumber}</span>"
                values={{
                  versionNumber: a.versionNumber,
                  span: (msg) => <span className="blackText">{msg}</span>
                }}
              />
            }
          />
        </div>
        <div className={classes.compareBoxHeaderItem}>
          <ListItemText
            primary={<FancyFormattedDate date={b.lastModifiedDate} />}
            secondary={
              <FormattedMessage
                id="historyDialog.versionNumber"
                defaultMessage="Version: <span>{versionNumber}</span>"
                values={{
                  versionNumber: b.versionNumber,
                  span: (msg) => <span className="blackText">{msg}</span>
                }}
              />
            }
          />
        </div>
      </section>
      <section className={classes.compareVersionsContent}>
        {
          contentTypes &&
          values.map((field) =>
            <ExpansionPanel key={field.id} classes={{ root: classes.root }}>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography><span
                  className={classes.bold}
                >{field.id} </span>({field.name})</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <Typography>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
                  sit amet blandit leo lobortis eget.
                </Typography>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          )
        }
      </section>
    </>
  );
}
