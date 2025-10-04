export class Knight{
    constructor(x, y, size) {
        this.size = size;
        this.coords = {
            x: x,
            y: y
        };
    }

    _isValid(x, y, visited) {
        const key = `${x},${y}`;
        return x >= 0 && x < this.size && y >= 0 && y < this.size && !visited.has(key);
    }

    ruleUpRt(visited) {
        const nextX = this.coords.x + 1;
        const nextY = this.coords.y + 2;
        if (this._isValid(nextX, nextY, visited)) {
            this.coords.x = nextX;
            this.coords.y = nextY;
            return true;
        }
        return false;
    }

    ruleRtUp(visited) {
        const nextX = this.coords.x + 2;
        const nextY = this.coords.y + 1;
        if (this._isValid(nextX, nextY, visited)) {
            this.coords.x = nextX;
            this.coords.y = nextY;
            return true;
        }
        return false;
    }

    ruleRtLo(visited) {
        const nextX = this.coords.x + 2;
        const nextY = this.coords.y - 1;
        if (this._isValid(nextX, nextY, visited)) {
            this.coords.x = nextX;
            this.coords.y = nextY;
            return true;
        }
        return false;
    }

    ruleLoRt(visited) {
        const nextX = this.coords.x + 1;
        const nextY = this.coords.y - 2;
        if (this._isValid(nextX, nextY, visited)) {
            this.coords.x = nextX;
            this.coords.y = nextY;
            return true;
        }
        return false;
    }

    ruleUpLe(visited) {
        const nextX = this.coords.x - 1;
        const nextY = this.coords.y + 2;
        if (this._isValid(nextX, nextY, visited)) {
            this.coords.x = nextX;
            this.coords.y = nextY;
            return true;
        }
        return false;
    }

    ruleLeUp(visited) {
        const nextX = this.coords.x - 2;
        const nextY = this.coords.y + 1;
        if (this._isValid(nextX, nextY, visited)) {
            this.coords.x = nextX;
            this.coords.y = nextY;
            return true;
        }
        return false;
    }

    ruleLeLo(visited) {
        const nextX = this.coords.x - 2;
        const nextY = this.coords.y - 1;
        if (this._isValid(nextX, nextY, visited)) {
            this.coords.x = nextX;
            this.coords.y = nextY;
            return true;
        }
        return false;
    }

    ruleLoLe(visited) {
        const nextX = this.coords.x - 1;
        const nextY = this.coords.y - 2;
        if (this._isValid(nextX, nextY, visited)) {
            this.coords.x = nextX;
            this.coords.y = nextY;
            return true;
        }
        return false;
    }
}

