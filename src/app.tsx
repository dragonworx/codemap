import * as React from 'react';
import { useEffect } from 'react';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import { createMuiTheme, CssBaseline } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import Canvas from '~/canvas';
import ApplicationBar from '~/appbar';
import useStore from '~/store';
import { useCommands, DeleteNodesCommand } from '~/commands';

const useStyles = makeStyles(theme => ({
  app: {
    flexGrow: 1,
    display: 'flex',
    flexWrap: 'wrap',
    width: '100%',
    height: '100%',
  },
  appBar: {
    height: 50,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  paper: {
    margin: theme.spacing(4),
    width: '100%',
    height: `calc(100% - ${theme.spacing(16)}px)`,
    position: 'relative',
    backgroundColor: '#767474'
  },
  addButton: {
    position: 'absolute',
    right: theme.spacing(4),
    bottom: theme.spacing(4),
  }
}));

const theme = createMuiTheme({
  palette: {
    type: 'dark'
  }
});

export default function App() {
   const classes = useStyles();
   const [ state, setState ] = useStore();
   const { nodes, selectedNodes } = state;
   const { execute } = useCommands();

   useEffect(() => {
    const onKeyUp = (e: KeyboardEvent) => {
      const { keyCode } = e;
      if (keyCode === 8 || keyCode == 46) {
        execute(new DeleteNodesCommand(), nodes, selectedNodes);
      }
    };
    document.body.addEventListener('keyup', onKeyUp);
    return () => {
      document.body.removeEventListener('keyup', onKeyUp);
    }
   }, []);

   return (
    <ThemeProvider theme={theme}>
      <div className={classes.app}>
        <CssBaseline />
        <ApplicationBar />
        <Paper elevation={3} variant="outlined" className={classes.paper}>
            <Canvas />
        </Paper>
      </div>
     </ThemeProvider>
   );
 }