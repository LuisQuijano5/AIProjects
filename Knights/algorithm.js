export function depthFirst(knight, sqVisited, path) {
    const TOTAL_SQUARES = knight.size * knight.size;

    if (sqVisited.size === TOTAL_SQUARES) {
        return true;
    }

    const possibleMoves = [
        knight.ruleRtUp, knight.ruleUpRt, knight.ruleUpLe, knight.ruleLeUp,
        knight.ruleLeLo, knight.ruleLoLe, knight.ruleLoRt, knight.ruleRtLo,
    ];

    for (const move of possibleMoves) {
        const originalX = knight.coords.x;
        const originalY = knight.coords.y;
        
        if (move.call(knight)) { 
            const newKey = `${knight.coords.x},${knight.coords.y}`;
            
            sqVisited.add(newKey);
            path.push([knight.coords.x, knight.coords.y]);
            
            if (depthFirst(knight, sqVisited, path)) {
                return true;
            }

            path.pop();
            sqVisited.delete(newKey);
            knight.coords.x = originalX; 
            knight.coords.y = originalY;
        }
    }

    return false; 
}