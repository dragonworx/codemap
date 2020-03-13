import * as React from 'react';
import { useState } from 'react';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import { defaultCodeMirrorOptions } from '~/renderer';
import Node from '~/node';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/monokai.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/theme/material.css';
import '~/less/editor.less';

export interface EditorProps {
   node: Node;
   onChange: (value: string) => void;
   onAccept: () => void;
};

export default function Editor(props: EditorProps) {
   const { node, onChange, onAccept } = props;
   const { src, srcWidth } = node;
   const [ , setEditor ] = useState(null);

   const onEditorDidMount = editor => {
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