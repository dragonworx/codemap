import * as React from 'react';
import { useState, useRef, MouseEvent, WheelEvent } from 'react';
import Node from '~/node';
import NodeView from '~/nodeView';
import { View } from '~/view';
import ZoomControl from '~/zoomControl';
import { Point, Rect } from '~/geom';
import useStore from '~/store';
import { doCommand, MoveNodeCommand } from '~/commands';
import '~/less/canvas.less';

let preSelectedNodes: Node[] = [];
let dragSelectedNodes: Node[] = [];

function useForceUpdate(){
   const [, setValue] = useState(0);
   return () => setValue(value => ++value);
}

enum CanvasMode {
   Select,
   Pan,
   Zoom
};

export function findLast<T>(array: Array<T>, predicate: (value: T, index: number, obj: T[]) => boolean) {
   let l = array.length;
   while (l--) {
       if (predicate(array[l], l, array))
           return array[l];
   }
};

export default function Canvas() {
   const [ state, setState ] = useStore();
   const { nodes, selectedNodes } = state;
   const divElement: React.Ref<HTMLDivElement> = useRef(null);
   const doCmd = doCommand();

   // state
   const [ view ] = useState(new View());
   const [ isMouseDown, setIsMouseDown ] = useState(false);
   const [ isCanvasDrag, setIsCanvasDrag ] = useState(false);
   const [ dragStart, setDragStart ] = useState({x: 0, y: 0});
   const [ dragEnd, setDragEnd ] = useState({x: 0, y: 0});
   const [ mode, setMode ] = useState(CanvasMode.Select);
   const forceUpdate = useForceUpdate();
   
   // calculated values
   const isCanvasDragging = isMouseDown && isCanvasDrag;
   const isNodeDragging = isMouseDown && !isCanvasDrag;
   const isPanning = isMouseDown && mode === CanvasMode.Pan;
   const canvasRect = () => divElement.current.getBoundingClientRect();
   const toLocalCoord = (clientX: number, clientY: number) => {
      const rect = canvasRect();
      const x = (clientX - rect.left);
      const y = (clientY - rect.top);
      return { x, y } as Point;
   };
   const dragLeft = () => Math.max(0, Math.min(dragStart.x, dragEnd.x));
   const dragTop = () => Math.max(0, Math.min(dragStart.y, dragEnd.y));
   const dragWidth = () => Math.min(canvasRect().width, Math.abs(dragEnd.x - dragStart.x));
   const dragHeight = () => Math.min(canvasRect().height, Math.abs(dragEnd.y - dragStart.y));
   const dragRect = () => new Rect(dragLeft(), dragTop(), dragWidth(), dragHeight());
   const startDrag = (point, isCanvasDragging) => {
      setDragStart(point);
      setDragEnd(point);
      setIsMouseDown(true);
      setIsCanvasDrag(isCanvasDragging);
   };

   // handlers
   const onMouseDown = (e: MouseEvent) => {
      const { target, currentTarget, clientX, clientY } = e;
      const point = toLocalCoord(clientX, clientY);

      if (e.metaKey && e.altKey) {
         view.startPan();
         setMode(CanvasMode.Pan);
         startDrag(point, false);
      } else if (target === currentTarget) {
         // canvas drag
         dragSelectedNodes = [];
         if (e.shiftKey) {
            preSelectedNodes = [...selectedNodes];
         } else {
            selectedNodes.length = 0
            preSelectedNodes.length = 0;
            setState({ selectedNodes });
         }
         startDrag(point, true);
      } else if ((target instanceof HTMLElement) && target.getAttribute('data-node')) {
         // node(s) drag
         const selectedNode = findLast(nodes, node => node.containsPoint(point, view));
         if (selectedNode) {
            const index = selectedNodes.indexOf(selectedNode);
            if (e.shiftKey) {
               if (index === -1) {
                  // add to selections
                  selectedNodes.push(selectedNode);
               } else {
                  // substract from collections
                  selectedNodes.splice(index, 1);
               }
               setState({ selectedNodes });
            } else {
               if (index === -1) {
                  setState({ selectedNodes: [selectedNode] });
               }
            }
            selectedNode.startDrag();
         }
         selectedNodes.forEach(node => node.startDrag());
         startDrag(point, false);
      }
   };

   const onMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const point = toLocalCoord(clientX, clientY);
      const deltaX = point.x - dragStart.x;
      const deltaY = point.y - dragStart.y;

      if (e.metaKey && e.altKey) {
         setMode(CanvasMode.Pan);
      } else {
         setMode(CanvasMode.Select);
      }

      if (mode === CanvasMode.Pan) {
         if (isPanning) {
            view.panBy(deltaX, deltaY);
            forceUpdate();
         }
      } else if (mode === CanvasMode.Select) {
         if (isCanvasDragging) {
            // drag selection rect over nodes
            setDragEnd(point);
            const rect = dragRect();
            nodes.forEach(node => {
               const preSelectedIndex = preSelectedNodes.indexOf(node);
               const dragSelectedIndex = dragSelectedNodes.indexOf(node);
               if (node.containsRect(rect, view)) {
                  // add to selection
                  if (e.shiftKey && e.altKey) {
                     if (preSelectedIndex > -1) {
                        preSelectedNodes.splice(preSelectedIndex, 1);
                     }
                  } else {
                     dragSelectedIndex === -1 && dragSelectedNodes.push(node);
                  }
               } else {
                  // subtract from selection
                  if (dragSelectedIndex > -1) {
                     dragSelectedNodes.splice(dragSelectedIndex, 1);
                  }
               }
            });
            setState({ selectedNodes: [...preSelectedNodes, ...dragSelectedNodes] });
         } else if (isNodeDragging) {
            // drag nodes
            selectedNodes.forEach(node => {
               node.dragBy(view.inverseZoom(deltaX), view.inverseZoom(deltaY));
            });
            forceUpdate();
         }
      }
   };

   const onMouseUp = (e: MouseEvent) => {
      setIsMouseDown(false);
      setMode(CanvasMode.Select);
      selectedNodes.forEach(node => node.endDrag());
      doCmd(new MoveNodeCommand(selectedNodes))
   };

   const onWheel = (e: WheelEvent<HTMLDivElement>) => {
      const { deltaY } = e;
      const rect = canvasRect();
      view.zoomBy(deltaY > 0 ? 0.1 : -0.1, rect.width, rect.height);
      forceUpdate();
   };

   const onZoomChange = (value: number) => {
      const delta = view.zoom - value;
      const rect = canvasRect();
      view.zoomBy(delta, rect.width, rect.height);
      forceUpdate();
   };

   // render
   return (
      <div
         id="canvas"
         onMouseDown={onMouseDown}
         onMouseUp={onMouseUp}
         onMouseMove={onMouseMove}
         onWheel={onWheel}
         ref={divElement}
         className={`mode_${mode}`}
      >
         {nodes.map(node => <NodeView key={`node${node.id}`} node={node} view={view} />)}
         {isCanvasDragging ? 
            <div 
               className="dragBounds" 
               style={{
                  left: dragLeft(),
                  top: dragTop(),
                  width: dragWidth(),
                  height: dragHeight(),
               }}
            >
            </div> : null}
            <ZoomControl onChange={onZoomChange} value={view.zoom} />
      </div>
   );
}