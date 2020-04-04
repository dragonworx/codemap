import * as React from 'react';
import { useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Editor } from '~components';
import { Node } from '~core';

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
   const [ src, setSrc ] = useState(node.src);

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

   const onMouseHandler = (e: React.MouseEvent) => e.stopPropagation();

   return (
      <Dialog
         open={props.open}
         onClose={onCancel}
         aria-labelledby="form-dialog-title"
         fullWidth={true}
         maxWidth="md"
         onMouseDown={onMouseHandler}
         onMouseUp={onMouseHandler}
         onMouseMove={onMouseHandler}
      >
         <DialogTitle id="form-dialog-title">Node Edit</DialogTitle>
         <DialogContent>
            <Editor node={node} onChange={onChange} onAccept={onSave} />
         </DialogContent>
         <DialogActions>
            <Button onClick={onCancel} variant="contained" color="secondary">
               Cancel
            </Button>
            <Button onClick={onSave} variant="contained" color="primary">
               Save
            </Button>
         </DialogActions>
      </Dialog>
   );
}
