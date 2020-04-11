import * as React from 'react';
import { useState, ChangeEvent } from 'react';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import IconButton from '@material-ui/core/IconButton';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/monokai.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/theme/material.css';
import { Node } from '~core';
import { defaultCodeMirrorOptions } from '~components';
import { readFile } from '~util';
import '~/less/editor.less';

const useStyles = makeStyles((theme) => ({
   options: {
      marginTop: 10,
   },
}));

export interface EditorProps {
   node: Node;
   onChange: (value: string) => void;
   onAccept: () => void;
};

export function Editor(props: EditorProps) {
   const { node, onChange, onAccept } = props;
   const { src, formatting: { srcWidth }, filePath } = node;
   const [ editor, setEditor] = useState(null);
   const classes = useStyles();

   const onEditorDidMount = (editor: any) => {
      editor.setValue(node.src);
      editor.focus();
      setEditor(editor);
   };

   const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;

      if (files && files.length) {
         const file = files[0];
         readFile(file)
            .then((src: string) => {
               node.src = src;
               editor && (editor as any).setValue(src);
               setEditor(editor);
            }, () => {
               throw new Error('Could not read file');
            });
      }
   };

   return (
      <div id="editor">
         <div className="editor-container">
            <CodeMirror
               value={src}
               options={{
                  ...defaultCodeMirrorOptions,
                  lineWrapping: typeof srcWidth === 'number' ? true : false,
                  extraKeys: {
                     'Cmd-Enter': onAccept,
                     'Ctrl-Enter': onAccept,
                  },
               }}
               editorDidMount={onEditorDidMount}
               onChange={(editor, data, value) => {
                  onChange(value);
               }}
            />
         </div>
         <Grid className={classes.options} container spacing={1} direction="row" alignItems="flex-start">
            <Grid item>
               <input accept="*" id="upload-file" type="file" onChange={onFileChange} />
               <label htmlFor="upload-file">
                  <IconButton color="default" aria-label="upload file" component="span">
                     <InsertDriveFileIcon />
                  </IconButton>
               </label>
            </Grid>
         </Grid>
      </div>
   );
}