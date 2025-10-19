export class Node{
    constructor(key, x, y, visited, parent = null){
        this.key = key;//valores del nodo en todsa sus posiciones
        this.blankCoords = {x: x, y: y};//posición dle cero
        this.visited = visited;
        this.parent = parent;
        this.value = -1;
    }

    expand(priorityQueue, qf){
        const rules = [this._ruleUp, this._ruleDown, this._ruleRight, this._ruleLeft];
    
        for (const rule of rules) {
            const newNode = rule.call(this);
            
            if (newNode) {
                newNode.getValue(qf);
                priorityQueue.insert(newNode);
            
                if (newNode.value === 0) {
                    return newNode;
                }
            }
        }

        return false;
    }

    getValue(qf){//Revisa el nodo actual con el valor objetico 
        let value = 0;
        let index = 0;
        for (const char of this.key) {
            let finalIndex = qf.indexOf(char);
            value += Math.abs((index % 3 - finalIndex % 3)) + Math.abs(Math.floor((index / 3) - Math.floor((finalIndex / 3))));
            index++;
        }
        this.value = value;
    }

    _applyRule(nextX, nextY){
        //convertir al índice
        const nextCoords = nextX + nextY * 3;
        const currentCoords = this.blankCoords.x + this.blankCoords.y * 3;

        if (!(nextX >= 0 && nextX < 3 && nextY >= 0 && nextY < 3)) {
            return null;
        }

        const chars = this.key.split('');//arreglo de cada num de la llave
        const temp = chars[currentCoords];//0 con coordenadas actuales
        chars[currentCoords] = chars[nextCoords];//mueve la ficha de al lado donde estaba el cero
        chars[nextCoords] = temp;
        const newKey = chars.join('');//une la llave ya una vez se movio el 0

        if (this.visited.has(newKey)) {
            return null;
        }

        this.visited.add(newKey);
        return new Node(newKey, nextX, nextY, this.visited, this); 
    }

    _ruleUp(){
        return this._applyRule(this.blankCoords.x, this.blankCoords.y - 1);
    }

    _ruleDown(){
        return this._applyRule(this.blankCoords.x, this.blankCoords.y + 1);
    }

    _ruleRight(){
        return this._applyRule(this.blankCoords.x + 1, this.blankCoords.y);
    }

    _ruleLeft(){
        return this._applyRule(this.blankCoords.x - 1, this.blankCoords.y);
    }
}