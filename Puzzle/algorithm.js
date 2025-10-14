export function bestFirst(qf, priorityQueue) {
  const allNodes = [];
  const path = [];
  let result = false;

  while (!priorityQueue.isEmpty()) {
    const current = priorityQueue.extractMin();
    allNodes.push(current);

    const expandedGoal = current.expand(priorityQueue, qf);
    if (expandedGoal) {
      result = expandedGoal;
      break;
    }
  }

  if (!result) return [];

  // reconstruir ruta
  let pathNode = result;
  while (pathNode) {
    path.push(pathNode);
    pathNode = pathNode.parent;
  }
  path.reverse();
  return path;
}