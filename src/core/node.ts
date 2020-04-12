import { Rect, Point } from '~core';

const DEFAULT_FONT_SIZE = 12;
let id = 0;

export interface LineInfo {
   height: number;
   tops: number[];
}

export interface Formatting {
   fontSize: number;
   srcWidth?: number;
}

export enum NodeState {
   Creating,
   Editing,
   Dragging,
   Idle,
}

export class Node {
   readonly rect: Rect = new Rect();
   readonly dragStart: Point = new Point();
   readonly dragEnd: Point = new Point();
   id: number;
   title: string = '';
   filePath: string = '';
   src: string = '';
   lineInfo: LineInfo;
   formatting: Formatting;
   isDragging: boolean = false;
   state: NodeState;
   preview?: string;

   constructor (rect?: Rect) {
      this.id = ++id;
      this.formatting = {
         fontSize: DEFAULT_FONT_SIZE,
      };
      this.lineInfo = {
         height: 0,
         tops: [],
      };
      if (rect) {
         this.rect = rect;
      }
      this.dragStart.init(this.rect.left, this.rect.top);
      this.dragEnd.clone(this.dragStart);
      this.state = NodeState.Creating;
   }

   static fromRect(left: number, top: number, width: number, height: number) {
      const rect = new Rect(left, top, width, height);
      return new Node(rect);
   }

   startDrag() {
      const { left, top } = this.rect;
      this.dragStart.init(left, top);
      this.isDragging = true;
   }

   endDrag() {
      const { left, top } = this.rect;
      this.dragEnd.init(left, top);
      this.isDragging = false;
   }

   dragBy(deltaX: number, deltaY: number) {
      const { rect, dragStart: { x, y} } = this;
      rect.left = x + deltaX;
      rect.top = y + deltaY;
   }
}