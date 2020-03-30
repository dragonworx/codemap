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

export const degToRad = (deg: number) => deg * (Math.PI / 180);

export const radToDeg = (rad: number) => rad * (180 / Math.PI);

export const length = (x1: number, y1: number, x2: number, y2: number) => {
   var x = Math.abs(x2 - x1);
   var y = Math.abs(y2 - y1);
   return Math.sqrt((y * y) + (x * x));
};

export const angle = (x1: number, y1: number, x2: number, y2: number) => {
   var deg = radToDeg(Math.atan2(y2 - y1, x2 - x1));
   if (deg < 0) deg = 180 + (180 - Math.abs(deg));
   return deg;
};

export const polarPoint = (deg: number, length: number) => {
   const rad = degToRad(deg);
   var x = length * Math.cos(rad);
   var y = length * Math.sin(rad);
   return new Point(x, y);
};