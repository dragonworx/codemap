import * as React from 'react';
import { useState, useRef, MouseEvent } from 'react';
import Node from '~/node';
import View from '~/view';
import NodeEditor from '~/nodeEdit';
import { renderSource } from '~/renderer';
import useStore from '~/store';
import '~/less/nodeView.less';

export interface NodeViewProps {
   node: Node;
}

export default function NodeView(props: NodeViewProps) {
   const divElement: React.Ref<HTMLDivElement> = useRef(null);
   const { node } = props;
   const [ state, setState ] = useStore();
   const { selectedNodes, view } = state;
   const [ isEdit, setIsEdit ] = useState(false);
   const [ src, setSrc ] = useState('');
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
      if (!src) {
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
      setState({ selectedNodes: [node]})
      setIsEdit(true);
   };
   const onClose = () => setIsEdit(false);
   const onUpdate = () => {
      renderSource(node.src).then(({ canvas, width, height, lineInfo }) => {
         node.lineInfo = lineInfo;
         node.rect.width = width / devicePixelRatio;
         node.rect.height = height / devicePixelRatio;
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
         className={`node${node.isDragging ? ' drag' : ''}`} 
         style={style} 
         data-node
         onMouseOver={onMouseOver} 
         onMouseMove={onMouseMove}
         onMouseOut={onMouseOut}
         onDoubleClick={onDoubleClick}
      >
         { src ? <img className="preview" src={src} /> : null }
         { src && (lineOver !== null) ? <div className="line-over" style={{ top: node.lineInfo.tops[lineOver] * scale, height: node.lineInfo.height * scale }}></div> : null }
         <NodeEditor open={isEdit} node={node} onUpdate={onUpdate} onClose={onClose} />
      </div>
   );
}