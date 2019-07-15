import * as Const from "./const.js"

export default class Resources {
    constructor(cb) {
        this.images = new Array(21);

        Promise.all([
            (this.loadImage("./img/blue.gif")).then((i) => {
                this.images[Const.BLUE] = i;
            }),
            (this.loadImage("./img/green.gif")).then((i) => {
                this.images[Const.GREEN] = i;
            }),
            (this.loadImage("./img/grey.gif")).then((i) => {
                this.images[Const.GREY] = i;
            }),
            (this.loadImage("./img/lila.gif")).then((i) => {
                this.images[Const.LILA] = i;
            }),
            (this.loadImage("./img/magenta.gif")).then((i) => {
                this.images[Const.MAGENTA] = i;
            }),
            (this.loadImage("./img/orange.gif")).then((i) => {
                this.images[Const.ORANGE] = i;
            }),
            (this.loadImage("./img/red.gif")).then((i) => {
                this.images[Const.RED] = i;
            }),
            (this.loadImage("./img/yellow.gif")).then((i) => {
                this.images[Const.YELLOW] = i;
            }),
            (this.loadImage("./img/blueS.gif")).then((i) => {
                this.images[Const.BLUES] = i;
            }),
            (this.loadImage("./img/greenS.gif")).then((i) => {
                this.images[Const.GREENS] = i;
            }),
            (this.loadImage("./img/lilaS.gif")).then((i) => {
                this.images[Const.LILAS] = i;
            }),
            (this.loadImage("./img/magentaS.gif")).then((i) => {
                this.images[Const.MAGENTAS] = i;
            }),
            (this.loadImage("./img/orangeS.gif")).then((i) => {
                this.images[Const.ORANGES] = i;
            }),
            (this.loadImage("./img/redS.gif")).then((i) => {
                this.images[Const.REDS] = i;
            }),
            (this.loadImage("./img/yellowS.gif")).then((i) => {
                this.images[Const.YELLOWS] = i;
            }),
            (this.loadImage("./img/choco.gif")).then((i) => {
                this.images[Const.CHOCO] = i;
            }),
            (this.loadImage("./img/chocoS.gif")).then((i) => {
                this.images[Const.CHOCOS] = i;
            }),
            (this.loadImage("./img/cyan.gif")).then((i) => {
                this.images[Const.CYAN] = i;
            }),
            (this.loadImage("./img/cyanS.gif")).then((i) => {
                this.images[Const.CYANS] = i;
            })
        ]).then(() => {
            cb();
        });
    }

    loadImage(url) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.src = url;
        });
    }
}