import {
   React,
   useState,
   makeStyles,
   ChangeEvent,
} from '~lib';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { ZoomControl, Prompt } from '~components';
import useStore from '~store';

const useStyles = makeStyles((theme) => ({
   root: {
      '& > *': {
         margin: theme.spacing(1),
         width: '25ch',
      },
   },
   label: {
      color: 'rgba(255, 255, 255, 0.7)',
      fontSize: 'smaller',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      '& > *': {
         marginLeft: 5,
      }
   },
   formControl: {
      minWidth: 120,
   },
}));

interface SelectItem {
   text: string;
   value: string;
}

export function ProjectSettings() {
   const classes = useStyles();
   const [ state, setState ] = useStore();
   const { rootPath, syntax, theme, background } = state;
   const [ isPathPromptOpen, setIsPathPromptOpen ] = useState(false);
   const onRootPathClick = () => setIsPathPromptOpen(true);
   const onPathPromptClose = () => setIsPathPromptOpen(false);
   const onPathPromptSave = (value: string) => {
      state.rootPath = value;console.log(value)
      setState();
   };

   const select = (id: string, label: string, items: SelectItem[], defaultValue: string, onChange: (value: string) => void) => {
      const onSelectChange = (e: ChangeEvent<any>) => {
         const value = (e.target as HTMLSelectElement).value;
         onChange(value);
      };

      return (
         <FormControl className={classes.formControl}>
            <InputLabel id={`${id}-label`}>{label}</InputLabel>
            <Select
               labelId={`${id}-label`}
               id={id}
               value={defaultValue}
               onChange={onSelectChange}
            >
               {items.map(item => <MenuItem key={item.value} value={item.value}>{item.text}</MenuItem>)}
            </Select>
         </FormControl>
      );
   };

   const onSyntaxChange = (value: string) => setState({ syntax: value });
   const onThemeChange = (value: string) => setState({ theme: value });
   const onBackgroundChange = (e: ChangeEvent<HTMLInputElement>) => {
      const value = (e.currentTarget.value);
      setState({ background: value });
   };

   return (
      <Grid container spacing={1} direction="row" justify="center" alignItems="center" className={classes.root}>
         <Grid item xs={2}>
            <label className={classes.label}>Root<Link component="button" variant="body2" color="primary" underline="always" onClick={onRootPathClick}>{rootPath ? rootPath : '<unset>'}</Link></label>
            <Prompt
               open={isPathPromptOpen}
               title="Enter Project Path Root"
               description="Select the location of the project path root. This will make source files path relative to this path."
               label="Project Path Root"
               defaultValue={rootPath}
               onClose={onPathPromptClose}
               onSave={onPathPromptSave}
            ></Prompt>
         </Grid>
         <Grid item xs={2}>
            {select('syntax', 'Syntax', [
               {
                  text: 'JavaScript',
                  value: 'javascript',
               },
               {
                  text: 'Python',
                  value: 'python',
               },
            ], syntax, onSyntaxChange)}
         </Grid>
         <Grid item xs={2}>
            {select('theme', 'Theme', [
               {
                  text: 'Monokai',
                  value: 'monokai',
               },
            ], theme, onThemeChange)}
         </Grid>
         <Grid item xs={1}>
            <label className={classes.label}>Background
               <input type="color" onChange={onBackgroundChange} defaultValue={background} />
            </label>
         </Grid>
         <Grid item xs={2}>
            <label className={classes.label}>Zoom
               <ZoomControl />
            </label>
         </Grid>
      </Grid>
   );
}