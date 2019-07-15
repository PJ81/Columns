import * as Const from "./const.js"
import Back from "./back.js"
import Game from "./game.js"
import Resources from "./resources.js";
import Input from "./input.js";

class Columns extends Game {
  constructor() {
    super();
    this.createCanvasNext();
    this.cnNext;
    this.board;
    this.bag;
    this.nextBag;
    this.dropTime;
    this.maxRandom;
    this.x;
    this.y;
    this.tileSize;
    this.counter;
    this.state;
    this.flashTime = 0;
    this.score;
    this.bestScore = 0;
    this.totalSum = 0;

    this.keys = new Input((what, state) => {
      switch (what) {
        case Const.LEFT:
          state === Const.RELEASED && this.move(-Const.GRID);
          break;
        case Const.RIGHT:
          state === Const.RELEASED && this.move(Const.GRID);
          break;
        case Const.UP:
          state === Const.RELEASED && this.roll(Const.UP);
          break;
        case Const.DOWN:
          state === Const.RELEASED && this.roll(Const.DOWN);
          break;
        case Const.FALL:
          this.drop = state === Const.PRESSED;
          break;
      }
    });

    this.canvas.addEventListener("click", () => {
      if (this.state === Const.GAMEOVER) {
        this.reset();
      }
    }, false);
    this.rnd = () => {
      return Math.floor(Math.random() * this.maxRandom) + 1;
    }

    this.res = new Resources(() => {
      this.back = new Back(this.res.images[Const.GREY]);
      this.reset();
      this.loop(0);
    })
  }

  reset() {
    this.board = [];
    for (let y = 0; y < Const.ROWS; y++) {
      this.board.push([]);
      for (let x = 0; x < Const.COLS; x++) {
        this.board[y].push((x === 0 || x === (Const.COLS - 1) || y === (Const.ROWS - 1)) ? 99 : 0);
      }
    }
    this.score = 0;
    this.displayScore();
    this.maxRandom = 4;
    this.counter = Math.ceil(80 * Math.log(this.maxRandom - 2) * Math.log2(this.maxRandom + 8));
    //Math.ceil(80 * Math.log(this.maxRandom) * Math.log2(this.maxRandom));
    this.bag = new Array(3);
    this.nextBag = new Array(3);
    this.tileSize = this.res.images[Const.BLUE].width + 1;
    this.dropTime = .8;
    this.dTimer = this.dropTime;
    this.x = (Const.WIDTH >> 1) - (this.tileSize >> 1);
    this.y = 0;
    this.state = Const.PLAYING;
    this.fillNextBag();
    this.getBag();
  }

  createCanvasNext() {
    this.cnNext = document.createElement('canvas');
    this.cnNext.id = "next";
    this.cnNext.width = (5 * Const.GRID) * Const.SCALE;
    this.cnNext.height = (7 * Const.GRID) * Const.SCALE;
    this.ctxNext = this.cnNext.getContext('2d');
    this.ctxNext.scale(Const.SCALE, Const.SCALE);
    document.body.appendChild(this.cnNext);
  }

  move(d) {
    const tileX = Math.floor((this.x + d) / this.tileSize),
      tileY = Math.floor(this.y / this.tileSize);
    if (this.board[tileY][tileX] === 0 &&
      (tileY < 1 || this.board[tileY - 1][tileX] === 0) &&
      (tileY < 2 || this.board[tileY - 2][tileX] === 0))
      this.x += d;
  }

  roll(d) {
    if (d === Const.DOWN) {
      const t = this.bag[0];
      this.bag[0] = this.bag[1];
      this.bag[1] = this.bag[2];
      this.bag[2] = t;
    } else {
      const t = this.bag[2];
      this.bag[2] = this.bag[1];
      this.bag[1] = this.bag[0];
      this.bag[0] = t;
    }
  }

  deleteFlash() {
    for (let y = 0; y < Const.ROWS - 1; y++) {
      for (let x = 1; x < Const.COLS - 1; x++) {
        const c = this.board[y][x];
        if (c > 8) {
          for (let w = y; w > 0; w--) {
            this.board[w][x] = this.board[w - 1][x];
          }
        }
      }
    }
    if (!this.checkCombos()) {
      const sc = Math.floor((50 * Math.log(.41 * this.totalSum)));
      this.score += sc;

      if (this.score > this.bestScore) {
        this.bestScore = this.score;
      }

      if ((this.counter -= sc) < 0) {
        this.maxRandom++;
        this.dropTime -= .1;
        if (this.dropTime < .2) this.dropTime = .2;
        if (this.maxRandom > 9) this.maxRandom = 9;
        this.counter = Math.ceil(80 * Math.log(this.maxRandom - 2) * Math.log2(this.maxRandom + 8));
        //Math.ceil(80 * Math.log(this.maxRandom) * Math.log2(this.maxRandom));
      }
      this.totalSum = 0;
      this.displayScore();
    }
  }

  displayScore() {
    document.getElementById("score").innerText = ("00000" + this.score).slice(-6);
    document.getElementById("bestscore").innerText = ("00000" + this.bestScore).slice(-6);
  }


  update(dt) {
    switch (this.state) {
      case Const.PLAYING:
        if (this.flashTime > 0) {
          if ((this.flashTime -= dt) < 0) {
            this.flashTime = 0;
            this.deleteFlash();
          }
        }
        if ((this.dTimer -= dt) < 0 || this.drop) {
          this.dTimer = this.dropTime;
          let tileY = -1,
            tileX = Math.floor(this.x / this.tileSize);
          if (this.y > -1) {
            tileY = Math.floor(this.y / this.tileSize);
          }
          if (this.board[tileY + 1][tileX] === 0) {
            this.y += this.tileSize;
          } else {
            if (tileY < 2) {
              this.state = Const.GAMEOVER;
              return;
            }
            this.drop = false;
            this.board[tileY][tileX] = this.bag[0];
            this.board[tileY - 1][tileX] = this.bag[1];
            this.board[tileY - 2][tileX] = this.bag[2];
            this.checkCombos();
            this.getBag();
          }
        }
        break;
      case Const.GAMEOVER:
        //
        break;
    }
  }

  draw() {
    switch (this.state) {
      case Const.PLAYING:
        for (let y = 0; y < Const.ROWS; y++) {
          for (let x = 0; x < Const.COLS; x++) {
            const b = this.board[y][x];
            if (b > 0 && b < 16)
              this.ctx.drawImage(this.res.images[b], x * this.tileSize, y * this.tileSize);
          }
        }
        for (let g = 0; g < 3; g++) {
          this.ctx.drawImage(this.res.images[this.bag[g]], this.x, this.y - this.tileSize * g);
          this.ctxNext.drawImage(this.res.images[this.nextBag[g]], 2 * Const.GRID, 4 * Const.GRID - g * Const.GRID);
        }
        break;
      case Const.GAMEOVER:
        this.ctx.fillStyle = "#dedede";
        this.ctx.textAlign = "center";
        this.ctx.font = "46px 'Oxygen Mono'";
        this.ctx.fillText("GAME OVER", Const.WIDTH >> 1, Const.HEIGHT * .405);
        this.ctx.font = "20px 'Oxygen Mono'";
        this.ctx.fillText("CLICK TO PLAY", Const.WIDTH >> 1, Const.HEIGHT * .485);
        break;
    }
    this.back.draw(this.ctx);
    this.back.drawNext(this.ctxNext);
  }

  isSafe(x, y, cl) {
    return (x > -1 && x < Const.COLS && y > -1 && y < Const.ROWS && cl === this.board[y][x]);
  }

  findLast(x, y, dx, dy, cl) {
    while (this.isSafe(x + dx, y + dy, cl)) {
      x += dx;
      y += dy;
    }
    return {
      x,
      y
    };
  }

  countSqrs(pt, dx, dy, cl) {
    var v = [];
    while (true) {
      v.push(pt);
      if (this.isSafe(pt.x + dx, pt.y + dy, cl)) {
        pt = {
          x: pt.x + dx,
          y: pt.y + dy
        };
      } else {
        break;
      }
    }
    return v;
  }

  checkForMatch(x, y) {
    let sum = [],
      i;
    const cl = this.board[y][x];
    const v1 = this.countSqrs(this.findLast(x, y, 0, -1, cl), 0, 1, cl),
      v2 = this.countSqrs(this.findLast(x, y, -1, 1, cl), 1, -1, cl),
      v3 = this.countSqrs(this.findLast(x, y, -1, 0, cl), 1, 0, cl),
      v4 = this.countSqrs(this.findLast(x, y, -1, -1, cl), 1, 1, cl);

    if (v1.length > 2)
      for (i = 0; i < v1.length; i++) sum.push(v1[i]);
    if (v2.length > 2)
      for (i = 0; i < v2.length; i++) sum.push(v2[i]);
    if (v3.length > 2)
      for (i = 0; i < v3.length; i++) sum.push(v3[i]);
    if (v4.length > 2)
      for (i = 0; i < v4.length; i++) sum.push(v4[i]);
    return sum;
  }

  checkCombos() {
    for (let y = Const.ROWS - 2; y > -1; y--) {
      for (let x = 1; x < Const.COLS - 1; x++) {
        if (this.board[y][x] === 0) continue;
        const k = this.checkForMatch(x, y);
        if (k.length > 2) {
          this.totalSum += k.length;
          for (let p of k) {
            this.board[p.y][p.x] += 9;
          }
          this.flashTime = .15;
          return true;
        }
      }
    }
    return false;
  }

  getBag() {
    this.bag[0] = this.nextBag[0];
    this.bag[1] = this.nextBag[1];
    this.bag[2] = this.nextBag[2];
    this.x = (Const.WIDTH >> 1) - (this.tileSize >> 1);
    this.y = 0;
    this.fillNextBag();
  }

  fillNextBag() {
    this.nextBag[0] = this.rnd();
    this.nextBag[1] = this.rnd();
    this.nextBag[2] = this.rnd();
  }
}

new Columns();