class Heap<T> {
    private compare: (a: T, b: T) => number;
    private data: T[];

    constructor(compare: (a: T, b: T) => number, items: T[] = []) {
        this.compare = compare;
        this.data = [...items];
        this.heapify();
    }

    private heapify() {
        const lastIdx = this.data.length - 1;
        const lastParentIdx = Math.floor((lastIdx - 1) / 2);

        for (let parentIdx = lastParentIdx; parentIdx >= 0; parentIdx--) {
            this.siftDown(parentIdx);
        }
    }

    peek(): T | undefined {
        return this.data[0];
    }

    pop(): T | undefined {
        if(this.data.length === 0){
            return;
        }

        const best = this.data[0];
        const last = this.data.pop()!;

        if(this.data.length > 0){
            this.data[0] = last;
            
            if(this.data.length > 1){
                this.siftDown(0);
            }
        }

        return best;
    }

    push(item: T){
        this.data.push(item);
        this.siftUp(this.data.length - 1);
    }


    private siftDown(parentIdx: number) {
        while (true) {
            const leftChildIdx = 2 * parentIdx + 1;
            const rightChildIdx = 2 * parentIdx + 2;
            let bestIdx = parentIdx;

            if (leftChildIdx < this.data.length && this.compare(this.data[leftChildIdx], this.data[bestIdx]) < 0) {
                bestIdx = leftChildIdx;
            }

            if (rightChildIdx < this.data.length && this.compare(this.data[rightChildIdx], this.data[bestIdx]) < 0) {
                bestIdx = rightChildIdx;
            }

            if(bestIdx === parentIdx){
                break;
            }

            [this.data[bestIdx], this.data[parentIdx]] = [this.data[parentIdx], this.data[bestIdx]];

            parentIdx = bestIdx;
        }
    }

    private siftUp(childIdx: number){
        while(childIdx > 0){
            const parentIdx = Math.floor((childIdx - 1)/ 2);

            if(this.compare(this.data[parentIdx], this.data[childIdx]) <= 0){
                break;
            }

            [this.data[parentIdx], this.data[childIdx]] = [this.data[childIdx], this.data[parentIdx]];

            childIdx = parentIdx;
        }
    }

}