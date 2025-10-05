export function bestFirst(qf, priorityQueue) {    
    const allNodes = [];
    const path = [];
    let result = false;
    while(heap){
        let current = priorityQueue.extractMax();
        allNodes.append(current);
        let result = current.expand(priorityQueue, qf);
        if (result){
            break;
        }
    }

    let pathNode = result;
    while (pathNode) {
        path.push(pathNode);
        pathNode = pathNode.parent;
    }
    path.reverse();

    return path;
}