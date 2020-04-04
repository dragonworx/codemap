import * as React from 'react';
import { useState } from 'react';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/monokai.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/theme/material.css';
import { Node } from '~core';
import { defaultCodeMirrorOptions } from '~components';
import '~/less/editor.less';

export interface EditorProps {
   node: Node;
   onChange: (value: string) => void;
   onAccept: () => void;
};

export function Editor(props: EditorProps) {
   const { node, onChange, onAccept } = props;
   const { src, formatting: { srcWidth } } = node;
   const [ , setEditor ] = useState(null);

   const onEditorDidMount = (editor: any) => {
      editor.setValue(node.src);
      editor.focus();
      setEditor(editor);
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
         <div className="editor-options">
            options
         </div>
      </div>
   );
}