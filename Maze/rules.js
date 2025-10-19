export class MazeNode{
    constructor(x, y, visited, mapData, parent = null){
        this.coords = {x: x, y: y};
        this.mapData = mapData;
        this.visited = visited;
        this.M = this.mapData.dimensions[0];
        this.N = this.mapData.dimensions[1];
        this.parent = parent;
        this.inDest = this.coords.x === this.mapData.coords[2] && this.coords.y === this.mapData.coords[3];
        this.value = parent ? parent.value + this.mapData.traffic[this.coords.x][this.coords.y] + this.mapData.security[this.coords.x][this.coords.y] : this.mapData.traffic[this.coords.x][this.coords.y] + this.mapData.security[this.coords.x][this.coords.y]; // es el cost pero para no refactorizr el heap jaja, acumulativo por eso lo manda el padre
    }

    expand(priorityQueue){
        if(this.inDest){
            return;
        }
        const rules = [this._ruleUp, this._ruleDown, this._ruleRight, this._ruleLeft];
    
        for (const rule of rules) {
            const newNode = rule.call(this);
            
            if (newNode) {
                priorityQueue.insert(newNode);
            }
        }
    }

    _applyRule(nextX, nextY){
        const newKey = `${nextX},${nextY}`;
        if (nextX < 0 
            || nextX >= this.M 
            || nextY < 0 
            || nextY >= this.N 
            || (this.visited.has(newKey) && newKey != `${this.mapData.coords[2]},${this.mapData.coords[3]}`)
            || this.mapData.transit[nextX][nextY] == 0) {
            return null;
        }

        this.visited.add(newKey);
        return new MazeNode(nextX, nextY, this.visited, this.mapData, this); 
    }

    _ruleUp(){
        return this._applyRule(this.coords.x - 1, this.coords.y);
    }

    _ruleDown(){
        return this._applyRule(this.coords.x + 1, this.coords.y);
    }

    _ruleRight(){
        return this._applyRule(this.coords.x, this.coords.y + 1);
    }

    _ruleLeft(){
        return this._applyRule(this.coords.x, this.coords.y - 1);
    }
}