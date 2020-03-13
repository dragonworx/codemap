import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import Slider from '@material-ui/core/Slider';
import ZoomIn from '@material-ui/icons/ZoomIn';
import ZoomOut from '@material-ui/icons/ZoomOut';
import IconButton from '@material-ui/core/IconButton';
import { MAX_ZOOM, MIN_ZOOM } from '~/view';

export interface ZoomControlProps {
   value: number;
   onChange: (value: number) => void;
}

export default function ZoomSlider(props: ZoomControlProps) {
   const { value, onChange } = props;
 
   const handleChange = (_event, newValue) => {
     onChange(newValue);
   };

   const onZoomOutClick = () => onChange(value - 0.1);
   const onZoomInClick = () => onChange(value + 0.1);
 
   return (
      <Grid
         id="zoomControl"
         container
         spacing={0}
         direction="column"
         justify="center"
         alignItems="center"
      >
         <Grid item>
            <IconButton color="primary" aria-label="zoom out" onClick={onZoomInClick}>
               <ZoomIn />
            </IconButton>
         </Grid>
         <Grid item xs>
            <Slider
               orientation="vertical"
               value={value}
               min={MIN_ZOOM}
               step={0.1}
               max={MAX_ZOOM}
               onChange={handleChange}
               aria-labelledby="continuous-slider"
            />
         </Grid>
         <Grid item>
            <IconButton color="primary" aria-label="zoom out" onClick={onZoomOutClick}>
               <ZoomOut />
            </IconButton>
         </Grid>
      </Grid>
   );
}