export class MinHeap {
    constructor() {
        this.heap = [];
    }

    getParentIndex(i) {
        return Math.floor((i - 1) / 2);
    }

    getLeftChildIndex(i) {
        return 2 * i + 1;
    }

    getRightChildIndex(i) {
        return 2 * i + 2;
    }

    swap(i1, i2) {
        [this.heap[i1], this.heap[i2]] = [this.heap[i2], this.heap[i1]];
    }

    insert(element) {
        this.heap.push(element);
        this.bubbleUp();
    }

    bubbleUp() {
        let index = this.heap.length - 1;
        const element = this.heap[index];

        while (index > 0) {
            const parentIndex = this.getParentIndex(index);
            const parent = this.heap[parentIndex];

            if (element.value >= parent.value) { //sube el hijo
                break;
            }

            this.swap(index, parentIndex);
            index = parentIndex;
        }
    }

    extractMin() {
        if (this.heap.length === 0) {
            return null;
        }
        if (this.heap.length === 1) {
            return this.heap.pop();
        }

        const min = this.heap[0];//??
        this.heap[0] = this.heap.pop();
        this.bubbleDown();

        return min;
    }

    bubbleDown() {
        let index = 0;

        while (true) {
            const leftChildIndex = this.getLeftChildIndex(index);
            const rightChildIndex = this.getRightChildIndex(index);
            let largestIndex = index;

            if (leftChildIndex < this.heap.length && this.heap[leftChildIndex].value < this.heap[largestIndex].value) {
                largestIndex = leftChildIndex;
            }

            if (rightChildIndex < this.heap.length && this.heap[rightChildIndex].value < this.heap[largestIndex].value) {
                largestIndex = rightChildIndex;
            }

            if (largestIndex === index) {
                break;
            }

            this.swap(index, largestIndex);
            index = largestIndex;
        }
    }

    size() {
        return this.heap.length;
    }

    isEmpty() {
        return this.heap.length === 0;
    }

    peek() {
        return this.heap.length > 0 ? this.heap[0] : null;
    }
}