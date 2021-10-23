export {};

declare global {
  interface SVGElement {
    getX(): number;
    getY(): number;
    getWidth(): number;
    getHeight(): number;
    getEndX(): number;
  }
}
