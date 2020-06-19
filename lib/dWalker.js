var params = {
    parent: "", // Basic element
    itemRadius: 7, // The radius of the main elements
    freeZoneRadius: 100 // The radius of the zone beyond which the elements will not go
}
var items = [], lines = [];

/**
 * Main function
 * @param {object} args 
 */
function dWalker(args) {
    if (!args || !args.parent) return;
    for (let key in args) params[key] = args[key];
    const ELEM = document.querySelector(params.parent),
        HEIGHT = ELEM.clientHeight,
        WIDTH = ELEM.clientWidth,
        SCALE = Math.sqrt(WIDTH + HEIGHT) / 55;
    let exitFlag = false;
    let att = 0, id = 0;
    let nullPoint = new Point(0, 0);

    while (true) {
        let pos = new Point(getRandomInt(WIDTH), getRandomInt(HEIGHT));
        let region = new Region(pos, params.freeZoneRadius * SCALE);

        for (let j = 0; j < items.length; j++) {
            if (items[j].Region.IsIntersect(region)) {
                exitFlag = true;
                break;
            }
        }
        if (exitFlag) {
            if (++att === 100)
                break;
            exitFlag = false;
            continue;
        }
        let item = new Item(id++, params.itemRadius * SCALE, pos);
        item.Region = region;

        items.push(item);
        att = 0;

        let line = new Line(nullPoint, nullPoint);
        line.appendTo(ELEM);
        lines.push(line);
    }
    items.forEach(item => item.appendTo(ELEM));

    const SetLineNewPosition = item => {
        let length = null, len;
        for (let i = 0; i < items.length; i++) {
            if (item.id === items[i].id || items[i].partnerId === item.id) continue;
            len = getVectorLength(item.Position, items[i].Position)
            if (length === null || length > len) {
                length = len;
                item.partnerId = items[i].id;
            }
        }
        lines[item.id].Update(item.CenterPosition, items[item.partnerId].CenterPosition);
    }

    items.forEach(item => item.SetNewPosition(new Point(WIDTH / 2, HEIGHT / 2)));
    items.forEach(item => SetLineNewPosition(item));
    let handleMove = e => { e = e.type === 'touchmove' ? e.changedTouches[0] : event || window.event; items.forEach(item => item.SetNewPosition(new Point(e.clientX, e.clientY))); items.forEach(item => SetLineNewPosition(item)); };
    window.onmousemove = window.ontouchmove = handleMove;
}

class Item {
    /**
     * @param {Object} parent 
     * @param {number} radius 
     * @param {Point} pos 
     */
    constructor(id, radius, pos) {
        this.item = document.createElement("div");
        this.item.style.cssText = `
            width: ${radius * 2}px;
            height: ${radius * 2}px;
            position: absolute;
            border-radius: ${radius}px;`;
        this.id = id;
        this.partnerId = undefined;

        this.region = new Region(pos, 0);
        this.radius = radius;
        this.Position = pos;
    }

    get Position() { return this.position; }
    /**
     * Set Top Left position from item
     * @param {Point} pos
     */
    set Position(pos) { this.position = pos; this.item.style.left = `${pos.X}px`; this.item.style.top = `${pos.Y}px`; }
    get Radius() { return this.radius; }
    set Region(reg) { this.region = reg; }
    get Region() { return this.region; }
    get CenterPosition() { return new Point(this.Position.X + this.Radius, this.Position.Y + this.Radius); }

    /**
     * @param {Point} pos 
     */
    SetNewPosition(pos) {
        if (this.region.Radius <= 0) return;
        let rxy = getVectorLength(pos, this.region.Position);
        let x = pos.X, y = pos.Y;
        if (rxy > this.region.Radius) {
            let k = this.region.Radius / rxy;
            x = this.region.Position.X + (x - this.region.Position.X) * k;
            y = this.region.Position.Y + (y - this.region.Position.Y) * k;
        }
        this.Position = new Point(x - this.Radius, y - this.Radius);
    }

    appendTo(object) { object.appendChild(this.item); }
}

class Region {
    /**
     * @param {Point} position 
     * @param {number} radius 
     */
    constructor(position, radius) { this.position = position; this.radius = radius; }
    get Position() { return this.position; }
    get Radius() { return this.radius; }

    IsIntersect(reg) { return reg.Radius + this.Radius >= getVectorLength(this.Position, reg.Position) }
}

class Point {
    /**
     * @param {number} x 
     * @param {number} y 
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    get X() { return this.x; }
    get Y() { return this.y; }

    Equals(point) { return this.X === point.X && this.Y === point.Y; }
}

class Line {
    /**
     * @param {Point} from 
     * @param {Point} to 
     */
    constructor(from, to) {
        this.hr = document.createElement("hr");
        this.hr.style.cssText = 'position: absolute; transform-origin: 0; margin: 0;';

        this.from = from;
        this.to = to;
        this.Update(from, to);
    }

    /**
     * Redraws the line at two points
     * @param {Point} from 
     * @param {Point} to 
     */
    Update(from, to) {
        if (this.from.Equals(from) && this.to.Equals(to)) return;
        this.from = from;
        this.to = to;
        // Determining the angle of rotation of the line
        let len = getVectorLength(from, to);
        let cos = (to.X - from.X) / len;
        let k = to.Y < from.Y ? -1 : 1;

        this.hr.style.top = `${from.Y}px`;
        this.hr.style.left = `${from.X}px`;
        this.hr.style.width = `${len}px`;
        this.hr.style.transform = `rotate(${(Math.acos(cos) * 180 / Math.PI) * k}deg)`;
    }
    appendTo(object) { object.appendChild(this.hr); }
}

const getRandomInt = max => Math.floor(Math.random() * Math.floor(max));

/**
 * Returns the distance between two points
 * @param {Point} a 
 * @param {Point} b 
 */
const getVectorLength = (a, b) => Math.sqrt(Math.pow(b.X - a.X, 2) + Math.pow(b.Y - a.Y, 2));