"use strict";

const {
    abs,
    acos,
    asin,
    atan,
    atan2,
    ceil,
    cos,
    max,
    min,
    PI,
    pow,
    random,
    round,
    sin,
    sqrt,
    tan } =
    Math;
const HALF_PI = 0.5 * PI;
const QUART_PI = 0.25 * PI;
const TAU = 2 * PI;
const TO_RAD = PI / 180;
const G = 6.67 * pow(10, -11);
const EPSILON = 2.220446049250313e-16;
const rand = n => n * random();
const randIn = (_min, _max) => rand(_max - _min) + _min;
const randRange = n => n - rand(2 * n);
const fadeIn = (t, m) => t / m;
const fadeOut = (t, m) => (m - t) / m;
const fadeInOut = (t, m) => {
    let hm = 0.5 * m;
    return abs((t + hm) % m - hm) / hm;
};
const dist = (x1, y1, x2, y2) => sqrt(pow(x2 - x1, 2) + pow(y2 - y1, 2));
const angle = (x1, y1, x2, y2) => atan2(y2 - y1, x2 - x1);
const lerp = (a, b, t) => (1 - t) * a + t * b;
const clamp = (n, _min, _max) => min(max(n, _min), _max);
const norm = (n, _min, _max) => (n - _min) / (_max - _min);
const floor = n => n | 0;
const fract = n => n - floor(n);
const vh = p => p * window.innerHeight * 0.01;
const vw = p => p * window.innerWidth * 0.01;
const vmin = p => min(vh(p), vw(p));
const vmax = p => max(vh(p), vw(p));
const intToRGBA = n => {
    let r, g, b, a;

    n >>>= 0;

    r = (n & 0xff000000) >>> 24;
    g = (n & 0xff0000) >>> 16;
    b = (n & 0xff00) >>> 8;
    a = (n & 0xff) / 255;

    return `rgba(${[r, g, b, a].join()})`;
};
const nearestMultiple = (n, d) => n - n % d;
const drawTypes = {
    FILL: "fill",
    STROKE: "stroke"
};

const textAlignTypes = {
    CENTER: "center",
    END: "end",
    LEFT: "left",
    RIGHT: "right",
    START: "start"
};

const textBaselineTypes = {
    ALPHABETIC: "alphabetic",
    BOTTOM: "bottom",
    HANGING: "hanging",
    MIDDLE: "middle",
    TOP: "top"
};

const debounce = (fn, wait = 200) => {
    let timeout;

    return (...args) => {
        if (timeout) clearTimeout(timeout);

        timeout = setTimeout(() => fn(...args), wait);
    };
};



Array.prototype.lerp = function (t = [], a = 0) {
    this.forEach((n, i) => this[i] = lerp(n, t[i], a));
};

Float32Array.prototype.get = function (i = 0, n = 0) {
    return this.slice(i, i + n);
};

class PropsArray {
    constructor(count = 0, props = [], type = "float") {
        this.count = count;
        this.props = props;
        this.spread = props.length;
        this.values =
            type === "float" ?
                new Float32Array(count * props.length) :
                new Uint32Array(count * props.length);
    }
    get length() {
        return this.values.length;
    }
    set(a = [], i = 0) {
        this.values.set(a, i);
    }
    setMap(o = {}, i = 0) {
        this.set(Object.values(o), i);
    }
    get(i = 0) {
        return this.values.get(i, this.spread);
    }
    getMap(i = 0) {
        return this.get(i).reduce((r, v, i) => {
            r[this.props[i]] = v;

            return r;
        }, {});
    }
    forEach(cb) {
        let i = 0;

        for (; i < this.length; i += this.spread) {
            cb(this.get(i), i, this);
        }
    }
    map(cb) {
        let i = 0;

        for (; i < this.length; i += this.spread) {
            this.set(cb(this.get(i), i, this), i);
        }
    }
    async *read() {
        let i = 0;

        for (; i < this.length; i += this.spread) {
            yield { index: i, value: this.get(i) };
        }
    }
}


function createOffscreenCanvas(width, height) {
    let _canvas;

    if (typeof OffscreenCanvas !== "undefined") {
        _canvas = new OffscreenCanvas(parseFloat(width), parseFloat(height));
    } else {
        _canvas = createCanvas(width, height);
    }

    return _canvas;
}

function createCanvas(width, height) {
    const canvas = document.createElement("canvas");

    canvas.width = width;
    canvas.height = height;

    return canvas;
}

function createContext2D(
    width = innerWidth,
    height = innerHeight,
    contextAttributes) {
    return createCanvas(width, height).getContext("2d", contextAttributes);
}

function createOffscreenContext2D(
    width = innerWidth,
    height = innerHeight,
    contextAttributes) {
    return createOffscreenCanvas(width, height).getContext(
        "2d",
        contextAttributes);

}

function createRenderingContext(width, height) {
    const contextAttributes = {
        alpha: true,
        desynchronized: true
    };


    const ctx = createContext2D(width, height, contextAttributes);
    const buffer = createOffscreenContext2D(width, height, contextAttributes);

    ctx.canvas.style.position = "absolute";
    ctx.canvas.style.top = "0";
    ctx.canvas.style.left = "0";

    // document.body.appendChild(ctx.canvas);

    // append to div named "rendering-context"
    // const div = document.createElement("div");
    const div = document.getElementById("rendering-context");
    // div.id = "rendering-context";
    // div.style.position = "absolute";
    // div.style.top = "0";

    // document.body.appendChild(div);
    div.appendChild(ctx.canvas);

    return {
        buffer,
        ctx
    };

}

/* <----------------------------> */

"use strict";

let fadeFilmMain = document.getElementById("fadeFilmMain");
let fadeFilmMainHeight = fadeFilmMain.clientHeight;
let fadeFilmMainWidth = fadeFilmMain.clientWidth;

let height = fadeFilmMainHeight;
let width = fadeFilmMainWidth;

// console.log(height, width);

const particleCount = 2000;
const particlePropCount = 9;
const particlePropsLength = particleCount * particlePropCount;
const spawnRadius = rand(150) + 150;
const noiseSteps = 6;


// $(window).on('load', function () {
//     const { buffer, ctx } = createRenderingContext(height, width);
// });

const { buffer, ctx } = createRenderingContext();

let center;
let tick;
let simplex;
let particleProps;

function setup() {
    tick = 0;
    center = [];
    resize();
    createParticles();
    draw();
}

function createParticles() {
    simplex = new SimplexNoise();
    particleProps = new Float32Array(particleCount * particlePropCount);

    let i;

    for (i = 0; i < particlePropsLength; i += particlePropCount) {
        initParticle(i);
    }
}

function initParticle(i) {
    let iy, ih, rd, rt, cx, sy, x, y, s, rv, vx, vy, t, h, w, l, ttl;

    iy = i + 1;
    ih = 0.5 * i | 0;
    rd = rand(spawnRadius);
    rt = rand(TAU);
    cx = cos(rt);
    sy = sin(rt);
    x = center[0] + cx * rd;
    y = center[1] + sy * rd;
    rv = randIn(0.1, 1);
    s = randIn(1, 8);
    vx = rv * cx * 0.1;
    vy = rv * sy * 0.1;
    w = randIn(0.1, 2);
    h = randIn(160, 260);
    l = 0;
    ttl = randIn(50, 200);

    particleProps.set([x, y, vx, vy, s, h, w, l, ttl], i);
}

function drawParticle(i) {
    let n, dx, dy, dl, c;
    let [x, y, vx, vy, s, h, w, l, ttl] = particleProps.get(i, particlePropCount);

    n = simplex.noise3D(x * 0.0025, y * 0.0025, tick * 0.0005) * TAU * noiseSteps;
    vx = lerp(vx, cos(n), 0.05);
    vy = lerp(vy, sin(n), 0.05);
    dx = x + vx * s;
    dy = y + vy * s;
    dl = fadeInOut(l, ttl);
    c = `hsla(${h},50%,60%,${dl})`;

    l++;

    buffer.save();
    buffer.lineWidth = dl * w + 1;
    buffer.strokeStyle = c;
    buffer.beginPath();
    buffer.moveTo(x, y);
    buffer.lineTo(dx, dy);
    buffer.stroke();
    buffer.closePath();
    buffer.restore();

    particleProps.set([dx, dy, vx, vy, s, h, w, l, ttl], i);

    (checkBounds(x, y) || l > ttl) && initParticle(i);
}

function checkBounds(x, y) {
    return (
        x > buffer.canvas.width ||
        x < 0 ||
        y > buffer.canvas.height ||
        y < 0);

}

function resize() {

    let fadeFilmMain = document.getElementById("fadeFilmMain");
    let fadeFilmMainHeight = fadeFilmMain.clientHeight;
    let fadeFilmMainWidth = fadeFilmMain.clientWidth;

    let height = fadeFilmMainHeight;
    let width = fadeFilmMainWidth;

    innerHeight = height;
    innerWidth = width;

    buffer.canvas.width = innerWidth;
    buffer.canvas.height = innerHeight;

    buffer.drawImage(ctx.canvas, 0, 0);

    ctx.canvas.width = innerWidth;
    ctx.canvas.height = innerHeight;

    ctx.drawImage(buffer.canvas, 0, 0);

    center[0] = 0.5 * innerWidth;
    center[1] = 0.5 * innerHeight;
}

function draw() {
    tick++;
    buffer.clearRect(0, 0, buffer.canvas.width, buffer.canvas.height);

    ctx.fillStyle = 'rgba(0,0,0,0.1)';
    ctx.fillRect(0, 0, buffer.canvas.width, buffer.canvas.height);

    let i = 0;

    for (; i < particlePropsLength; i += particlePropCount) {
        drawParticle(i);
    }

    ctx.save();
    ctx.filter = 'blur(8px)';
    ctx.globalCompositeOperation = 'lighten';
    ctx.drawImage(buffer.canvas, 0, 0);
    ctx.restore();

    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.drawImage(buffer.canvas, 0, 0);
    ctx.restore();

    window.requestAnimationFrame(draw);
}

window.addEventListener("load", setup);
window.addEventListener("resize", resize);