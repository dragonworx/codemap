import * as React from 'react';
import { useState, useRef, MouseEvent, WheelEvent } from 'react';
import AddIcon from '@material-ui/icons/Add';
import useStore from '~store';
import {
   NodeView,
   ZoomControl,
} from '~components';
import {
   Node,
   Point,
   Rect,
   angle,
} from '~core';
import {
   useCommands,
   MoveNodeCommand,
   CreateNodeCommand,
} from '~commands';
import {
   findLast,
   replaceArray,
} from '~util';
import '~less/canvas.less';

let preSelectedNodes: Node[] = [];
let dragSelectedNodes: Node[] = [];
let lastClick: number;

enum CanvasMode {
   Select,
   Pan,
   Zoom
};

export function Canvas() {
   const [ { nodes, selectedNodes, view, cursor }, setStore ] = useStore();
   const divElement: React.Ref<HTMLDivElement> = useRef(null);
   const { execute } = useCommands();

   // state
   const [ isMouseDown, setIsMouseDown ] = useState(false);
   const [ isCanvasDrag, setIsCanvasDrag ] = useState(false);
   const [ dragStart, setDragStart ] = useState({x: 0, y: 0});
   const [ dragEnd, setDragEnd ] = useState({x: 0, y: 0});
   const [ mode, setMode ] = useState(CanvasMode.Select);
   const [ showCursor, setShowCursor ] = useState(false);
   
   // calculated values
   const isCanvasDragging = isMouseDown && isCanvasDrag;
   const isNodeDragging = isMouseDown && !isCanvasDrag;
   const isPanning = isMouseDown && mode === CanvasMode.Pan;
   const canvasRect = () => divElement.current!.getBoundingClientRect();
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
   const startDrag = (point: Point, isCanvasDragging: boolean) => {
      setDragStart(point);
      setDragEnd(point);
      setIsCanvasDrag(isCanvasDragging);
   };

   // handlers
   const onMouseDown = (e: MouseEvent) => {
      const { target, currentTarget, clientX, clientY } = e;
      const point = toLocalCoord(clientX, clientY);

      setIsMouseDown(true);

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
            setStore({ selectedNodes });
         }
         startDrag(point, true);
         setShowCursor(true);
      } else if ((target instanceof HTMLElement) && target.getAttribute('data-node')) {
         // node(s) drag
         const selectedNode = findLast(nodes, node => node.rect.containsPoint(point, view));
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
               setStore({ selectedNodes });
            } else {
               if (index === -1) {
                  // unselect others for single click on new node
                  replaceArray(selectedNodes, [selectedNode]);
                  setStore({ selectedNodes });
               }
            }
            selectedNode.startDrag();
         }
         selectedNodes.forEach(node => node.startDrag());
         startDrag(point, false);
         setShowCursor(false);
      }
   };

   const onMouseMove = (e: MouseEvent) => {
      const { clientX, clientY, shiftKey } = e;
      const point = toLocalCoord(clientX, clientY);
      const deg = angle(dragStart.x, dragStart.y, point.x, point.y);
      const rawDeltaX = point.x - dragStart.x;
      const rawDeltaY = point.y - dragStart.y;
      const isVerticalDrag = (deg >= 45 && deg <= 135) || (deg >= 225 && deg <= 315);
      const isHorizontalDrag = !isVerticalDrag;
      const deltaX = (shiftKey && isVerticalDrag) ? 0 : rawDeltaX;
      const deltaY = (shiftKey && isHorizontalDrag) ? 0 : rawDeltaY;

      if (e.metaKey && e.altKey) {
         setMode(CanvasMode.Pan);
      } else {
         setMode(CanvasMode.Select);
      }

      if (mode === CanvasMode.Pan) {
         if (isPanning) {
            view.panBy(deltaX, deltaY);
            setStore();
         }
      } else if (mode === CanvasMode.Select) {
         if (isCanvasDragging) {
            // drag selection rect over nodes
            setDragEnd(point);
            const rect = dragRect();
            nodes.forEach(node => {
               const preSelectedIndex = preSelectedNodes.indexOf(node);
               const dragSelectedIndex = dragSelectedNodes.indexOf(node);
               if (node.rect.containsRect(rect, view)) {
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
            const dragNodes = [...preSelectedNodes, ...dragSelectedNodes];
            replaceArray(selectedNodes, dragNodes);
            setStore({ selectedNodes });
         } else if (isNodeDragging) {
            // drag nodes
            selectedNodes.forEach(node => {
               node.dragBy(view.inverseZoom(deltaX), view.inverseZoom(deltaY));
            });
            setStore();
         }
      }
   };

   const onMouseUp = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      if (!selectedNodes.length) {
         const point = toLocalCoord(clientX, clientY);
         cursor.x = point.x;
         cursor.y = point.y;
      }
      setIsMouseDown(false);
      setMode(CanvasMode.Select);
      selectedNodes.forEach(node => node.endDrag());
      execute(new MoveNodeCommand(), selectedNodes);
      const now = Date.now();
      if (lastClick) {
         const elapsed = now - lastClick;
         if (elapsed < 300) {
            execute(new CreateNodeCommand(), nodes, selectedNodes, cursor);
         }
      }
      lastClick = now;
   };

   const onWheel = (e: WheelEvent<HTMLDivElement>) => {
      const { deltaY } = e;
      const rect = canvasRect();
      view.zoomBy(deltaY > 0 ? 0.1 : -0.1, rect.width, rect.height);
      setStore();
   };

   const onZoomChange = (value: number) => {
      const delta = view.zoom - value;
      const rect = canvasRect();
      view.zoomBy(delta, rect.width, rect.height);
      setStore();
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
         {nodes.map(node => <NodeView key={`node${node.id}`} node={node} />)}
         {showCursor && !isMouseDown && !selectedNodes.length ? <AddIcon id="cursor" style={{ left: cursor.x, top: cursor.y }} /> : null}
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