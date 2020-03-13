import * as React from 'react';
import { useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Editor from '~/editor';
import Node from '~/node';

export interface NodeEditProps { 
   open: boolean;
   onClose: () => void;
   onUpdate: () => void;
   node: Node;
}

export default function NodeEdit(props: NodeEditProps) {
   const { node, onClose, onUpdate } = props;
   const [ src, setSrc ] = useState(node.src);

   const onChange = (value: string) => {
      setSrc(value);
   };

   const onSave = () => {
      node.src = src;
      onClose();
      onUpdate();
   };

   return (
      <Dialog
         open={props.open}
         onClose={onClose}
         aria-labelledby="form-dialog-title"
         fullWidth={true}
         maxWidth="md"
      >
         <DialogTitle id="form-dialog-title">Node Edit</DialogTitle>
         <DialogContent>
            <Editor node={node} onChange={onChange} onAccept={onSave} />
         </DialogContent>
         <DialogActions>
            <Button onClick={onClose} color="primary">
               Cancel
            </Button>
            <Button onClick={onSave} color="primary">
               Save
            </Button>
         </DialogActions>
      </Dialog>
   );
}
