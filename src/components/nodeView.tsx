import * as React from 'react';
import { useState, useRef, MouseEvent } from 'react';
import AddCirlce from '@material-ui/icons/AddCircle';
import useStore from '~store';
import {
   NodeEditor,
   NodeEditSubmission,
   renderSource,
} from '~components';
import { Node, NodeState } from '~core';
import { removeArrayItem } from '~util';
import '~less/nodeView.less';

export interface NodeViewProps {
   node: Node;
}

export function NodeView(props: NodeViewProps) {
   const divElement: React.Ref<HTMLDivElement> = useRef(null);
   const { node } = props;
   const [ { nodes, selectedNodes, view }, setStore ] = useStore();
   const [ isEdit, setIsEdit ] = useState(node.state === NodeState.Creating);
   const [ preview, setPreview ] = useState(node.preview);
   const [ lineOver, setLineOver ] = useState(-1);

   const divRect = () => divElement.current!.getBoundingClientRect();
   const toLocalCoord = (clientX: number, clientY: number) => {
      const rect = divRect();
      const x = (clientX - rect.left);
      const y = (clientY - rect.top);
      return { x, y };
   };

   const onMouseOver = () => setLineOver(-1);
   const onMouseMove = (e: MouseEvent) => {
      if (!preview) {
         return;
      }
      setLineOver(-1);
      const point = toLocalCoord(e.clientX, e.clientY);
      const { lineInfo } = node;
      const { tops, height } = lineInfo;
      const l = tops.length;
      const y = point.y;
      const scale = view.zoom;
      for (let i = 0; i < l; i++) {
         const lineY = tops[i];
         if (y >= lineY * scale && y <= (lineY + height) * scale) {
            setLineOver(i);
            break;
         }
      }
   };
   const onMouseOut = () => setLineOver(-1);
   const onDoubleClick = () => {
      setStore({ selectedNodes: [node]})
      setIsEdit(true);
   };
   const onClose = (submission?: NodeEditSubmission) => {
      if (submission) {
         node.src = submission.src;
         node.state = NodeState.Idle;
      } else if (node.state === NodeState.Creating) {
         removeArrayItem(nodes, node);
         setStore();
      }
      setIsEdit(false);
   };
   const onUpdate = () => {
      renderSource(node.src).then(({ canvas, width, height, lineInfo }) => {
         node.lineInfo = lineInfo;
         node.rect.width = width / devicePixelRatio;
         node.rect.height = height / devicePixelRatio;
         node.preview = canvas.toDataURL();
         setPreview(node.preview);
      });
   };

   const { left, top, width, height } = view.transformRect(node.rect);
   const scale = view.zoom;
   const isSelected = preview && selectedNodes.indexOf(node) > -1;

   if (node.state === NodeState.Creating) {
      const style = {
         left,
         top,
      };

      return (
         <div className="node" style={style}>
            <AddCirlce id="cursor" />
            <NodeEditor open={isEdit} node={node} onUpdate={onUpdate} onClose={onClose} />
         </div>
      );
   }

   const style = {
      left,
      top,
      width,
      height,
      borderColor: isSelected ? 'yellow' : undefined,
   };

   return (
      <div 
         ref={divElement}
         className={`node ${node.isDragging ? ' drag' : ''}`} 
         style={style} 
         data-node
         onMouseOver={onMouseOver} 
         onMouseMove={onMouseMove}
         onMouseOut={onMouseOut}
         onDoubleClick={onDoubleClick}
      >
         { preview ? <img className="preview" src={preview} /> : null }
         { preview && (lineOver !== -1) ? <div className="line-over" style={{ top: node.lineInfo.tops[lineOver] * scale, height: node.lineInfo.height * scale }}></div> : null }
         <NodeEditor open={isEdit} node={node} onUpdate={onUpdate} onClose={onClose} />
      </div>
   );
}