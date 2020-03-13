import * as React from 'react';
import { ReactElement } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Map from '@material-ui/icons/Map';
import Tooltip from '@material-ui/core/Tooltip';
import VerticalAlignTop from '@material-ui/icons/VerticalAlignTop';
import VerticalAlignCenter from '@material-ui/icons/VerticalAlignCenter';
import VerticalAlignBottom from '@material-ui/icons/VerticalAlignBottom';
import UndoIcon from '@material-ui/icons/Undo';
import RedoIcon from '@material-ui/icons/Redo';
import Grid from '@material-ui/core/Grid';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { makeStyles } from '@material-ui/core/styles';
import {
   doCommand,
   undoCommand,
   redoCommand,
   AlignLeftCommand,
   AlignHCenterCommand,
   AlignRightCommand,
   AlignTopCommand,
   AlignVCenterCommand,
   AlignBottomCommand,
} from '~/commands';
import { useStore } from '~/store';

const useStyles = makeStyles(theme => ({
   appBar: {
   },
   menuButton: {
     marginRight: theme.spacing(2),
   },
   title: {
     flexGrow: 1,
   },
   grid: {
      marginLeft: theme.spacing(1),
   },
   vertical: {
      '& svg': {
         transform: 'rotateZ(90deg)',
      }
   },
 }));


function buttonGroup(buttons: ReactElement[], ) {
   return (
      <Grid item>
         <ToggleButtonGroup size="small" exclusive>
            {buttons}
         </ToggleButtonGroup>
      </Grid>
   );
}

export default function ApplicationBar() {
   const classes = useStyles();
   const { appBar, menuButton, title, vertical, grid } = classes;
   const doCmd = doCommand();
   const undo = undoCommand();
   const redo = redoCommand();
   const [ state ] = useStore();
   const { undoStack, redoStack, selectedNodes } = state;
   const hasEmptySelection = selectedNodes.length === 0;

   const onUndo = () => undo();
   const onRedo = () => redo();
   const onAlignLeft = () => doCmd(new AlignLeftCommand(selectedNodes));
   const onAlignHCenter = () => doCmd(new AlignHCenterCommand(selectedNodes));
   const onAlignRight = () => doCmd(new AlignRightCommand(selectedNodes));
   const onAlignTop = () => doCmd(new AlignTopCommand(selectedNodes));
   const onAlignVCenter = () => doCmd(new AlignVCenterCommand(selectedNodes));
   const onAlignBottom = () => doCmd(new AlignBottomCommand(selectedNodes));

   return (
      <AppBar position="static" className={appBar}>
        <Toolbar>
          <IconButton edge="start" className={menuButton} color="inherit" aria-label="menu">
            <Map />
          </IconButton>
          <Typography variant="h6" className={title}>
            CodeMap
          </Typography>
          <Grid container spacing={1} direction="row" alignItems="flex-start" className={grid}>
            {
               buttonGroup([
                  <ToggleButton key={1} value="undo" onClick={onUndo} disabled={undoStack.length === 0}><Tooltip title="Undo"><UndoIcon /></Tooltip></ToggleButton>,
                  <ToggleButton key={2} value="redo" onClick={onRedo} disabled={redoStack.length === 0}><Tooltip title="Redo"><RedoIcon /></Tooltip></ToggleButton>,
               ])
            }
            {
               buttonGroup([
                  <ToggleButton key={1} value="left" onClick={onAlignLeft} disabled={hasEmptySelection} className={vertical}><Tooltip title="Align Left"><VerticalAlignBottom /></Tooltip></ToggleButton>,
                  <ToggleButton key={2} value="center" onClick={onAlignHCenter} disabled={hasEmptySelection} className={vertical}><Tooltip title="Align H Center"><VerticalAlignCenter /></Tooltip></ToggleButton>,
                  <ToggleButton key={3} value="right" onClick={onAlignRight} disabled={hasEmptySelection} className={vertical}><Tooltip title="Align Right"><VerticalAlignTop /></Tooltip></ToggleButton>,
               ])
            }
            {
               buttonGroup([
                  <ToggleButton key={1} value="top" onClick={onAlignTop} disabled={hasEmptySelection}><Tooltip title="Align Top"><VerticalAlignTop /></Tooltip></ToggleButton>,
                  <ToggleButton key={2} value="center" onClick={onAlignVCenter} disabled={hasEmptySelection}><Tooltip title="Align V Center"><VerticalAlignCenter /></Tooltip></ToggleButton>,
                  <ToggleButton key={3} value="bottom" onClick={onAlignBottom} disabled={hasEmptySelection}><Tooltip title="Align Bottom"><VerticalAlignBottom /></Tooltip></ToggleButton>,
               ])
            }
         </Grid>
        </Toolbar>
      </AppBar>
   );
};
