import * as Const from "./const.js"
export default class Back {
  constructor(img) {
    this.canvas = document.createElement("canvas");
    this.canvas.width = Const.WIDTH;
    this.canvas.height = Const.HEIGHT;
    const cx = this.canvas.getContext("2d");
    for (let t = 0; t < Const.ROWS - 1; t++) {
      cx.drawImage(img, 0, t * img.height + t);
      cx.drawImage(img, (Const.COLS - 1) * img.width + (Const.COLS - 1), t * img.height + t);
      cx.drawImage(img, t * img.width + t, (Const.ROWS - 1) * img.height + Const.ROWS - 1);
    }


    this.cnNext = document.createElement("canvas");
    this.cnNext.width = 5 * Const.GRID;
    this.cnNext.height = 7 * Const.GRID;
    const xc = this.cnNext.getContext("2d");
    for (let t = 1; t < 6; t++) {
      xc.drawImage(img, 0, t * img.height + t);
      xc.drawImage(img, 4 * img.width + 4, t * img.height + t);
      xc.drawImage(img, (t - 1) * img.width + (t - 1), 6 * img.height + 6);
      xc.drawImage(img, (t - 1) * img.width + (t - 1), 0);
    }
  }

  draw(ctx) {
    ctx.drawImage(this.canvas, 0, 0);
  }

  drawNext(ctx) {
    ctx.drawImage(this.cnNext, 0, 0);
  }
}