class MinStack {
  // Each entry remembers the minimum of itself and everything below it.
  private items: { value: number; min: number }[] = [];

  push(value: number): void {
    let min = value;
    if (this.items.length > 0) {
      min = Math.min(value, this.getMin());
    }
    this.items.push({ value, min });
  }

  pop(): void {
    this.items.pop();
  }

  top(): number {
    return this.items[this.items.length - 1].value;
  }

  getMin(): number {
    return this.items[this.items.length - 1].min;
  }
}


const stack = new MinStack();

stack.push(2);
stack.push(3)

console.log(stack.top())
console.log(typeof stack.top())
console.log(stack.pop())
console.log(stack.getMin())
console.log(typeof stack.getMin())