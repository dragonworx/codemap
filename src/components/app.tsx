import * as React from 'react';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import { createMuiTheme, CssBaseline } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import {
  Canvas,
  ApplicationBar,
  ProjectSettings,
} from '~components';
import { useCommands } from '~commands';
import { useKeyUpEvent, Keys } from '~hooks';

const useStyles = makeStyles(theme => ({
  app: {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    width: '100%',
    height: '100%',
  },
  paper: {
    margin: theme.spacing(4),
    position: 'relative',
    backgroundColor: '#767474',
    flexGrow: 2,
    marginTop: 0,
  },
}));

const theme = createMuiTheme({
  palette: {
    type: 'dark'
  }
});

export function App() {
  const classes = useStyles();
  const { undo, redo } = useCommands();

  useKeyUpEvent((e: KeyboardEvent) => {
    if (e.keyCode === Keys.Z) {
      if (e.ctrlKey) {
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      }
    }
  });

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.app}>
        <CssBaseline />
        <ApplicationBar />
        <ProjectSettings />
        <Paper elevation={3} variant="outlined" className={classes.paper}>
          <Canvas />
        </Paper>
      </div>
    </ThemeProvider>
  );
}