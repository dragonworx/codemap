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
import FormatAlignCenterIcon from '@material-ui/icons/FormatAlignCenter';
import UndoIcon from '@material-ui/icons/Undo';
import RedoIcon from '@material-ui/icons/Redo';
import Grid from '@material-ui/core/Grid';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { makeStyles } from '@material-ui/core/styles';
import {
   useCommands,
   AlignLeftCommand,
   AlignHCenterCommand,
   AlignRightCommand,
   AlignTopCommand,
   AlignVCenterCommand,
   AlignBottomCommand,
   DistributeHorizontally,
   DistributeVertically,
} from '~/commands';
import useStore from '~/store';

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
   rotate90deg: {
      transform: 'rotateZ(90deg)',
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

export default    function ApplicationBar() {
   const classes = useStyles();
   const { appBar, menuButton, title, rotate90deg, grid } = classes;
   const { execute, undo, redo } = useCommands();
   const [ state ] = useStore();
   const { undoStack, redoStack, selectedNodes } = state;
   const hasMultiSelection = selectedNodes.length > 1;

   const onUndo = () => undo();
   const onRedo = () => redo();
   const onAlignLeft = () => execute(new AlignLeftCommand(selectedNodes));
   const onAlignHCenter = () => execute(new AlignHCenterCommand(selectedNodes));
   const onAlignRight = () => execute(new AlignRightCommand(selectedNodes));
   const onAlignTop = () => execute(new AlignTopCommand(selectedNodes));
   const onAlignVCenter = () => execute(new AlignVCenterCommand(selectedNodes));
   const onAlignBottom = () => execute(new AlignBottomCommand(selectedNodes));
   const onDistributeHorizontally = () => execute(new DistributeHorizontally(selectedNodes));
   const onDistributeVertically = () => execute(new DistributeVertically(selectedNodes));

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
                  <ToggleButton key={1} value="left" onClick={onAlignLeft} disabled={!hasMultiSelection} className={rotate90deg}><Tooltip title="Align Left"><VerticalAlignBottom /></Tooltip></ToggleButton>,
                  <ToggleButton key={2} value="center" onClick={onAlignHCenter} disabled={!hasMultiSelection} className={rotate90deg}><Tooltip title="Align H Center"><VerticalAlignCenter /></Tooltip></ToggleButton>,
                  <ToggleButton key={3} value="right" onClick={onAlignRight} disabled={!hasMultiSelection} className={rotate90deg}><Tooltip title="Align Right"><VerticalAlignTop /></Tooltip></ToggleButton>,
               ])
            }
            {
               buttonGroup([
                  <ToggleButton key={1} value="top" onClick={onAlignTop} disabled={!hasMultiSelection}><Tooltip title="Align Top"><VerticalAlignTop /></Tooltip></ToggleButton>,
                  <ToggleButton key={2} value="center" onClick={onAlignVCenter} disabled={!hasMultiSelection}><Tooltip title="Align V Center"><VerticalAlignCenter /></Tooltip></ToggleButton>,
                  <ToggleButton key={3} value="bottom" onClick={onAlignBottom} disabled={!hasMultiSelection}><Tooltip title="Align Bottom"><VerticalAlignBottom /></Tooltip></ToggleButton>,
               ])
            }
            {
               buttonGroup([
                  <ToggleButton key={1} value="top" onClick={onDistributeHorizontally} disabled={!hasMultiSelection}><Tooltip title="Distribute Horizontally"><FormatAlignCenterIcon className={rotate90deg} /></Tooltip></ToggleButton>,
                  <ToggleButton key={2} value="center" onClick={onDistributeVertically} disabled={!hasMultiSelection}><Tooltip title="Distribute Vertically"><FormatAlignCenterIcon /></Tooltip></ToggleButton>,
               ])
            }
         </Grid>
        </Toolbar>
      </AppBar>
   );
};
