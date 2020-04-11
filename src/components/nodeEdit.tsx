import * as React from 'react';
import { useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { Editor } from '~components';
import { Node } from '~core';

const useStyles = makeStyles((theme) => ({
   title: {
     width: '100%',
   },
   content: {
      overflow: 'hidden'
   }
 }));

export interface NodeEditProps { 
   open: boolean;
   onClose: (submission?: NodeEditSubmission) => void;
   onUpdate: () => void;
   node: Node;
}

export interface NodeEditSubmission {
   src: string;
}

export function NodeEditor(props: NodeEditProps) {
   const { node, onClose, onUpdate } = props;
   const { title } = node;
   const [ src, setSrc ] = useState(node.src);
   const classes = useStyles();

   const onChange = (value: string) => {
      setSrc(value);
   };

   const onCancel = () => {
      onClose();
   };

   const onSave = () => {
      onClose({
         src,
      });
      onUpdate();
   };

   const onTitleChange = (event: React.ChangeEvent) => {
      node.title = (event.target as HTMLInputElement).value;
   };

   const onMouseHandler = (e: React.MouseEvent) => e.stopPropagation();

   return (
      <Dialog
         open={props.open}
         onClose={onCancel}
         aria-labelledby="node-title"
         fullWidth={true}
         maxWidth="md"
         onMouseDown={onMouseHandler}
         onMouseUp={onMouseHandler}
         onMouseMove={onMouseHandler}
      >
         <DialogTitle>
            <TextField id="node-title" className={classes.title} label="Title" defaultValue={title} onChange={onTitleChange} />
         </DialogTitle>
         <DialogContent className={classes.content}>
            <Editor node={node} onChange={onChange} onAccept={onSave} />
         </DialogContent>
         <DialogActions>
            <Button onClick={onCancel} variant="contained" color="default">
               Cancel
            </Button>
            <Button onClick={onSave} variant="contained" color="primary">
               Save
            </Button>
         </DialogActions>
      </Dialog>
   );
}
