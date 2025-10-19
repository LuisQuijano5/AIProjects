export function bestFirstMaze(priorityQueue) {
    const allNodes = [];
    const paths = [];
    let bestPathIndex = -1;
    let bestValue = -1;

    while (!priorityQueue.isEmpty()) {
        const current = priorityQueue.extractMin();
        allNodes.push(current);
        current.expand(priorityQueue);

        if(current.inDest){
            if(bestPathIndex === -1 || current.value < bestValue) {
                bestPathIndex = paths.length;
                bestValue = current.value;
            }
            let pathNode = current; 
            let path = [];
            while(pathNode) {
                path.push(pathNode);
                pathNode = pathNode.parent;
            }
            path.reverse();
            paths.push(path);
        }
    }

    return {bestPathIndex, paths};
}