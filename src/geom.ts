export class Point {
   x: number;
   y: number;

   constructor(x: number = 0, y: number = 0) {
      this.x = x;
      this.y = y;
   }

   equals(point: Point) {
      return this.x === point.x && this.y === point.y;
   }
}

export class Rect {
   left: number;
   top: number;
   width: number;
   height: number;

   constructor(left: number = 0, top: number = 0, width: number = 0, height: number = 0) {
      this.left = left;
      this.top = top;
      this.width = width;
      this.height = height;
   }

   get right() {
      return this.left + this.width;
   }

   get bottom() {
      return this.top + this.height;
   }
}