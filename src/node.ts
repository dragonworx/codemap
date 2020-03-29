import { View } from '~/view';
import { Rect, Point } from '~/geom';

const DEFAULT_FONT_SIZE = 12;
let id = 0;

export default class Node {
   id: number;
   filePath?: string;
   src: string;
   srcWidth?: number;
   linePos?: number[];
   lineHeight: number;
   fontSize: number;
   top: number;
   left: number;
   width: number;
   height: number;
   dragStartLeft: number;
   dragStartTop: number;
   dragEndLeft: number;
   dragEndTop: number;

   constructor (rect: Rect, src?: string) {
      const { left, top, width, height } = rect;
      this.id = id++;
      this.top = top || 0;
      this.left = left || 0;
      this.width = width || 200;
      this.height = height || 300;
      this.dragStartLeft = left;
      this.dragStartTop = top;
      this.src = src || '';
      this.lineHeight = 0;
      this.fontSize = DEFAULT_FONT_SIZE;
   }

   containsPoint(point: Point, view: View) {
      const { x, y } = point;
      const { left, top, right, bottom } = view.transformRect(this.rect);
      return (x >= left && x <= right) && (y >= top && y <= bottom);
   }

   containsRect(rect: Rect, view: View) {
      const { left, top, right, bottom } = view.transformRect(this.rect);
      const { left: rectLeft, top: rectTop, right: rectRight, bottom: rectBottom } = rect;
      return !(rectLeft > right || 
         rectRight < left || 
         rectTop > bottom ||
         rectBottom < top);
   }

   startDrag() {
      this.dragStartLeft = this.left;
      this.dragStartTop = this.top;
   }

   endDrag() {
      this.dragEndLeft = this.left;
      this.dragEndTop = this.top;
   }

   dragBy(deltaX: number, deltaY: number) {
      this.left = this.dragStartLeft + deltaX;
      this.top = this.dragStartTop + deltaY;
   }

   get dragStart() {
      return new Point(this.dragStartLeft, this.dragStartTop);
   }

   get dragEnd() {
      return new Point(this.dragEndLeft, this.dragEndTop);
   }

   get rect() {
      const { left, top, right, bottom, width, height } = this;
      return {
         left,
         top,
         right,
         bottom,
         width,
         height,
      } as Rect;
   }

   get right() {
      return this.left + this.width;
   }

   set right(value: number) {
      this.left = value - this.width;
   }

   get bottom() {
      return this.top + this.height;
   }

   set bottom(value: number) {
      this.top = value - this.height;
   }

   get centerX() {
      return this.left + (this.width / 2);
   }

   get centerY() {
      return this.top + (this.height / 2);
   }

   set centerX(value: number) {
      this.left = value - (this.width / 2);
   }

   set centerY(value: number) {
      this.top = value - (this.height / 2);
   }

   get location() {
      return new Point(this.left, this.top);
   }

   set location(point: Point) {
      this.left = point.x;
      this.top = point.y;
   }
}