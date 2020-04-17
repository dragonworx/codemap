import {
  React,
  useState,
  MouseEvent,
} from '~lib';
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


import { AffineView } from '~components/affineView';

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
    // marginTop: 0,
  },
  box1: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 100,
    height: 100,
    backgroundColor: 'blue',
    cursor: 'hand',
 },
 box2: {
   position: 'absolute',
   top: 20,
   left: 20,
   width: 50,
    height: 50,
    backgroundColor: 'red',
    cursor: 'wait',
 }
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

  // return (
  //   <ThemeProvider theme={theme}>
  //     <div className={classes.app}>
  //       <CssBaseline />
  //       <ApplicationBar />
  //       <ProjectSettings />
  //       <Paper elevation={3} variant="outlined" className={classes.paper}>
  //         <Canvas />
  //       </Paper>
  //     </div>
  //   </ThemeProvider>
  // );

  const [pos, setPos] = useState({x: 0, y: 0});

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.app}>
        <CssBaseline />
        <Paper elevation={3} variant="outlined" className={classes.paper}>
          <AffineView>
            <div
              className={classes.box1}
              style={{
                top: pos.y,
                left: pos.x,
              }}
              onMouseMove={(e: MouseEvent) => setPos({x: pos.x + 1, y: pos.y })}
          >
              <div className={classes.box2}>hey</div>
          </div>
          </AffineView>
        </Paper>
      </div>
    </ThemeProvider>
  );
}