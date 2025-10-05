export class Knight{
    constructor(x, y, size, visited) {
        this.size = size;
        this.visited = visited
        this.coords = {
            x: x,
            y: y
        };
    }

    _applyRule(nextX, nextY) {
        const key = `${nextX},${nextY}`;
        if ( nextX >= 0 && nextX < this.size && nextY >= 0 && nextY < this.size && !this.visited.has(key) ){
            this.coords.x = nextX;
            this.coords.y = nextY;
            return true;
        }
        return false;
    }

    ruleUpRt() {
        return this._applyRule(this.coords.x + 1, this.coords.y + 2);
    }

    ruleRtUp() {
        return this._applyRule(this.coords.x + 2, this.coords.y + 1);
    }

    ruleRtLo() {
        return this._applyRule(this.coords.x + 2, this.coords.y - 1);
    }

    ruleLoRt() {
        return this._applyRule(this.coords.x + 1, this.coords.y - 2);
    }

    ruleUpLe() {
        return this._applyRule(this.coords.x - 1, this.coords.y + 2);
    }

    ruleLeUp() {
        return this._applyRule(this.coords.x - 2, this.coords.y + 1);
    }

    ruleLeLo() {
        return this._applyRule(this.coords.x - 2, this.coords.y - 1);
    }

    ruleLoLe() {
        return this._applyRule(this.coords.x - 1, this.coords.y - 2);
    }
}

