import * as React from 'react';
import { useState, useRef, MouseEvent } from 'react';
import Node from '~/node';
import { View } from '~/view';
import NodeEditor from '~/nodeEdit';
import { renderSource } from '~/renderer';
import { useStore } from '~/store';
import '~/less/nodeView.less';

export interface NodeViewProps {
   node: Node;
   view: View;
}

export default function NodeView(props: NodeViewProps) {
   const [ state, setState ] = useStore();
   const { selectedNodes } = state;
   const { node, view } = props;
   const divElement: React.Ref<HTMLDivElement> = useRef(null);
   const [ isEdit, setIsEdit ] = useState(false);
   const [ src, setSrc ] = useState(null);
   const [ lineOver, setLineOver ] = useState(null);

   const divRect = () => divElement.current.getBoundingClientRect();
   const toLocalCoord = (clientX: number, clientY: number) => {
      const rect = divRect();
      const x = (clientX - rect.left);
      const y = (clientY - rect.top);
      return { x, y };
   };

   const onMouseOver = () => setLineOver(null);
   const onMouseMove = (e: MouseEvent) => {
      if (!src) {
         return;
      }
      setLineOver(null);
      const point = toLocalCoord(e.clientX, e.clientY);
      const { linePos, lineHeight } = node;
      const l = linePos.length;
      const y = point.y;
      const scale = view.zoom;
      for (let i = 0; i < l; i++) {
         const lineY = linePos[i];
         if (y >= lineY * scale && y <= (lineY + lineHeight) * scale) {
            setLineOver(i);
            break;
         }
      }
   };
   const onMouseOut = () => setLineOver(null);
   const onDoubleClick = () => setIsEdit(true);
   const onClose = () => setIsEdit(false);
   const onUpdate = () => {
      renderSource(node.src).then(({ canvas, width, height, linePos, lineHeight }) => {
         node.linePos = linePos;
         node.lineHeight = lineHeight;
         node.width = width / devicePixelRatio;
         node.height = height / devicePixelRatio;
         setSrc(canvas.toDataURL());
      });
   };

   const { left, top, width, height } = view.transformRect(node.rect);
   const scale = view.zoom;
   const isSelected = (node: Node) => !!selectedNodes.find((selectedNode: Node) => selectedNode === node);

   const style = {
      left,
      top,
      width,
      height,
      borderColor: isSelected(node) ? 'yellow' : undefined,
   };

   return (
      <div 
         ref={divElement}
         className="node" 
         style={style} 
         data-node
         onMouseOver={onMouseOver} 
         onMouseMove={onMouseMove}
         onMouseOut={onMouseOut}
         onDoubleClick={onDoubleClick}
      >
         { src ? <img className="preview" src={src} /> : null }
         { src && (lineOver !== null) ? <div className="line-over" style={{ top: node.linePos[lineOver] * scale, height: node.lineHeight * scale }}></div> : null }
         <NodeEditor open={isEdit} node={node} onUpdate={onUpdate} onClose={onClose} />
      </div>
   );
}