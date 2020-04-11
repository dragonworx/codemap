import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import { ZoomControl } from '~components';

const useStyles = makeStyles((theme) => ({
   root: {
      '& > *': {
         margin: theme.spacing(1),
         width: '25ch',
      },
   },
}));

export function ProjectSettings() {
   const classes = useStyles();

   const onRootPathClick = () => {};

   return (
      <Grid container spacing={1} direction="row" justify="center" alignItems="center" className={classes.root}>
         <Grid item>
            <ZoomControl />
         </Grid>
         <Grid item>
            <Link component="button" variant="body2" color="inherit" onClick={onRootPathClick}>Path</Link>
         </Grid>
      </Grid>
   );
}