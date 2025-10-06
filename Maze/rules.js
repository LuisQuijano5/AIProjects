export class Node{
    constructor(x, y, visited, M, N, mapData, parent = null){
        this.coords = {x: x, y: y};
        this.visited = visited;
        this.M = M;
        this.N = N;
        this.mapData = mapData;
        this.parent = parent;
        this.cost = 18 - mapData.security[x][y] - mapData.traffic[x][y];
    }

    expand(priorityQueue){
        const rules = [this._ruleUp, this._ruleDown, this._ruleRight, this._ruleLeft];
    
        for (const rule of rules) {
            const newNode = rule.call(this);
            
            if (newNode) {
                priorityQueue.insert(newNode);
            }
        }

        return false;
    }

    _applyRule(nextX, nextY){
        const newKey = `${this.nextX},${this.nextY}`;
        if (!(nextX >= 0 
            && nextX < this.M 
            && nextY >= 0 
            && nextY < this.N 
            && !this.visited.has(newKey)
            && this.mapData.transit[nextX][nextY] == 1)) {
            return null;
        }

        this.visited.add(newKey);
        return new Node(nextX, nextY, this.visited, this.M, this.N, this.mapData, this); 
    }

    _ruleUp(){
        return this._applyRule(this.coords.x + 1, this.coords.y);
    }

    _ruleDown(){
        return this._applyRule(this.coords.x - 1, this.coords.y);
    }

    _ruleRight(){
        return this._applyRule(this.coords.x, this.coords.y + 1);
    }

    _ruleLeft(){
        return this._applyRule(this.coords.x, this.coords.y - 1);
    }
}