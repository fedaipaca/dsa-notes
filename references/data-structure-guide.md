# Data Structures JavaScript/TypeScript Doesn't Give You
### A study and reference guide for coding interviews, in TypeScript

## Contents

**Part 1: Core structures**
1. [Stack (+ Min Stack)](#1-stack)
2. [Queue](#2-queue)
3. [Singly Linked List (+ dummy node, + reversal)](#3-singly-linked-list)
4. [Doubly Linked List (+ sentinels, + reversal)](#4-doubly-linked-list)
5. [Deque](#5-deque-double-ended-queue)
6. [LRU Cache](#6-lru-cache)
7. [LFU Cache](#7-lfu-cache)
8. [Heap / Priority Queue (+ heapify, + Median Finder)](#8-heap-priority-queue)
9. [Binary Tree and Binary Search Tree](#9-binary-tree-and-binary-search-tree-bst)
10. [Trie](#10-trie-prefix-tree)
11. [Graph](#11-graph)

**Part 2: Less common structures**

12. [Monotonic Stack and Monotonic Queue](#12-monotonic-stack-and-monotonic-queue)
13. [Union-Find (Disjoint Set Union)](#13-union-find-disjoint-set-union-dsu)
14. [Sorted Set / TreeMap Alternatives](#14-sorted-set-treemap-alternatives)
15. [Fenwick Tree (Binary Indexed Tree)](#15-fenwick-tree-binary-indexed-tree)
16. [Segment Tree](#16-segment-tree)

**Reference**

17. [Choosing the Right Structure](#17-choosing-the-right-structure)

---

---

## How to Use This Document

This guide teaches the data structures you are likely to need in a coding interview that JavaScript and TypeScript don't include. Most interview environments (CoderPad, HackerRank, CodeSignal, a shared plain editor) don't give you a library either. If a problem needs a priority queue, you will write one.

This is study material, not a cheat sheet. The goal is for you to **understand** each structure so well that you can rebuild it from its idea, even if you forget the exact code. For that reason, every section follows the same path:

1. **Mental model.** A picture you can hold in your head.
2. **When to use it.** The signals in a problem statement that point to this structure, and *why* they point there.
3. **How it works.** Each operation step by step, with diagrams and traces.
4. **Implementation.** Minimal, readable TypeScript you can type in a few minutes.
5. **Complexity.** Big O for time and space, and the reasoning behind each number.
6. **Common mistakes.** The bugs candidates actually write.
7. **Remembering and explaining it.** How to rebuild the code from the idea, and how to talk about it out loud.

The document has two parts:

- **Part 1: Core structures.** You will meet these again and again: stack, queue, linked lists, deque, LRU/LFU caches, heap, binary search tree, trie, graph.
- **Part 2: Less common structures.** These show up less often but are still asked, especially at senior level: monotonic stack/queue, union-find, ordered-set (TreeMap) alternatives, Fenwick tree, segment tree.

Inside each part, sections go from simpler to more complex.

---

## What JavaScript Gives You and What It Doesn't

| Need | Built into JS? | What this guide does |
|---|---|---|
| Dynamic array, hash map, hash set | Yes: `Array`, `Map`, `Set` | Not covered. Use them directly |
| Stack | Yes, effectively: array `push`/`pop` are O(1) | Section 1 explains why, and when a class is still useful |
| Queue | No. `shift()` exists but costs O(n) | Section 2: array + head index |
| Linked list (singly / doubly) | No | Sections 3 and 4 |
| Deque (double-ended queue) | No. `unshift`/`shift` cost O(n) | Section 5 |
| LRU / LFU cache | No | Sections 6 and 7 |
| Heap / priority queue | No | Section 8, **the most important one to master** |
| Binary search tree | No | Section 9 |
| Trie | No | Section 10 |
| Graph | No | Section 11 |
| Monotonic stack / queue | No | Section 12 |
| Union-Find (Disjoint Set Union) | No | Section 13 |
| Sorted set / TreeMap | No | Section 14 |
| Fenwick tree, segment tree | No | Sections 15 and 16 |

---

## Implementing a Helper Structure During an Interview

When a problem needs a structure that the language doesn't have, you are solving two things at once: the helper structure and the actual problem. Handle it in this order.

**1. Say it out loud before you write it.**
For example: *"TypeScript has no built-in priority queue, so I'll write a small binary heap. Push and pop will be O(log n)."* This shows the interviewer that you know the language's limits. It also turns a silent pause into a visible decision.

**2. Ask whether a library is allowed.**
Some platforms preload libraries. LeetCode, for example, provides `@datastructures-js/priority-queue` for JavaScript and TypeScript. You could ask: *"Can I assume a priority queue is available, or would you like me to implement it?"* Many interviewers will let you assume it and focus on the main problem. Others want to see it built. Be ready for both answers.

**3. Implement only the operations the problem needs.**
If you need a heap for "kth largest element", you need `push`, `pop`, `peek` and `size`. You don't need `remove(x)`, `toArray()` or iterators. Say this too: *"I'll write a minimal version with just the operations this problem uses."* Less code means fewer bugs and more time for the actual problem.

**4. Write the helper first, then the solution.**
The solution depends on the helper, so the helper comes first. Keep it small and correct. Then write the solution that uses it.

**5. If time is short, stub it and come back.**
You can say: *"Let me assume a heap class with push and pop in O(log n). I'll write the solution first and implement the heap afterward."* Then really come back to it. An interviewer usually prefers a complete solution with a stubbed helper over a perfect helper and no solution.

---

## Conventions Used in the Code

- **Explicit class fields, no parameter properties.** TypeScript lets you write `constructor(private x: number)`, but some interview environments compile with settings (for example `erasableSyntaxOnly`) that reject it. Declaring the field and assigning it in the constructor always works, so every class here does that.
- **Empty structures return `undefined`.** For example, `pop()` on an empty stack returns `undefined` instead of throwing. That mirrors how JavaScript's own `Array.prototype.pop` behaves.
- **The `!` operator (non-null assertion).** Writing `node.next!` tells TypeScript "I know this is not `null` here." It is only used where the structure guarantees it. For example, sentinel nodes guarantee that a real node always has a neighbor. Every place it appears is explained.
- **No bitwise operators.** Index math uses `Math.floor(i / 2)` instead of `i >> 1`, and `x % 2 === 1` instead of `x & 1`. This is easier to read and harder to get wrong. The single exception is the Fenwick tree (Section 15), whose definition is built on a bit trick. That section explains it carefully and shows a non-bitwise alternative.
- **Full braces and one statement per line.** The code is written the way you should write it on a whiteboard or in an editor while explaining it: readable first.

---

# Part 1: Core Structures

---

## 1. Stack

### Mental model

A stack works like a pile of plates. You can only put a plate on the top, and you can only take a plate from the top. The last plate you put down is the first one you pick up. This rule is called **LIFO: Last In, First Out**.

```
push(1), push(2), push(3)            then pop() returns 3

   ┌───┐                                ┌───┐
   │ 3 │  ← top                         │ 2 │  ← top
   ├───┤                                ├───┤
   │ 2 │                                │ 1 │
   ├───┤                                └───┘
   │ 1 │
   └───┘
```

A stack has one open end, called the **top**, and every operation happens there:

| Operation | What it does |
|---|---|
| `push(x)` | Put `x` on top |
| `pop()` | Remove the top element and return it |
| `peek()` | Return the top element without removing it |
| `isEmpty()` | Check whether the stack has no elements |
| `size` | Number of elements |

### Why a JavaScript array already works as a stack

A JavaScript array keeps its elements in consecutive positions (index 0, 1, 2, …). Adding or removing at the **end** doesn't move any other element, so `push` and `pop` are O(1).

Now and then the engine has to grow the array's internal storage and copy the elements over. That copy costs O(n), but it happens so rarely (the capacity roughly doubles each time) that, averaged over many pushes, each push still costs O(1). This is what **amortized O(1)** means.

Adding or removing at the **front** (`unshift` / `shift`) is a different story: every other element has to move one position, which costs O(n). That's why a stack always uses the **end** of the array as its top.

### When to use a stack

The general signal is: **the most recent unfinished thing must be dealt with first.** Whenever the newest item is the one that matters next, a stack fits.

- **Matching and nesting.** Examples: Valid Parentheses, Decode String (`3[a2[c]]`), checking HTML tags.
  A closing bracket must match the *most recently opened* bracket that is still open. "Most recent and still open" is exactly the top of the stack.
- **Undo, back navigation, history.** The last action is the first one to undo.
- **Cancelling adjacent items.** Examples: Remove All Adjacent Duplicates in String, Asteroid Collision, Simplify Path (`/a/./b/../c`).
  Each new item only interacts with the item right before it. After a cancellation, the item before *that* one becomes the new neighbor, and it is exactly what the stack top shows after a pop.
- **Expression evaluation.** Examples: Evaluate Reverse Polish Notation, Basic Calculator.
  Operands wait on the stack until the operator that uses them arrives.
- **Next greater / next smaller element.** Examples: Daily Temperatures, Largest Rectangle in Histogram.
  These use a stack kept in sorted order, called a *monotonic stack*. Section 12 covers it.
- **Replacing recursion.** Recursion uses the program's call stack behind the scenes. You can keep your own stack instead, which avoids "Maximum call stack size exceeded" on very deep inputs.

### Implementation 1: use an array directly

In most interview problems you don't need a class at all. A plain array, used only at its end, is a stack:

```typescript
const stack: number[] = [];

// push: add to the top
stack.push(10);
stack.push(20);
stack.push(30);

// peek: read the top without removing it
const top = stack[stack.length - 1]; // 30

// pop: remove and return the top
const removed = stack.pop(); // 30, and the stack is now [10, 20]

// isEmpty and size
const isEmpty = stack.length === 0; // false
const size = stack.length; // 2
```

**Peeking with `at(-1)`.** Modern JavaScript (ES2022) arrays have an `at` method. A negative index counts from the end, so `at(-1)` is the last element:

```typescript
const stack: number[] = [10, 20];

const top = stack.at(-1); // 20, same as stack[stack.length - 1]
```

On an empty array, `at(-1)` returns `undefined`, and its TypeScript type is `number | undefined`, so TypeScript reminds you to handle the empty case. Very old environments may not have `at`. The `stack[stack.length - 1]` form works everywhere.

**Always check for an empty stack before you pop or peek.** On an empty array, `pop()` returns `undefined` and `stack[stack.length - 1]` is `stack[-1]`, which is also `undefined`. By default, TypeScript types `stack[stack.length - 1]` as `number`, not `number | undefined`, so it **will not** warn you. Guard explicitly:

```typescript
const stack: string[] = [];

if (stack.length === 0) {
  // Nothing to compare against. Handle this case explicitly,
  // e.g. in "Valid Parentheses" a closing bracket here means the input is invalid.
} else {
  const top = stack.pop();
  // ...use top
}
```

### Implementation 2: a Stack class

Write a class when the interviewer asks you to "implement a stack", when the stack is part of a larger design (like the Min Stack below), or when named methods make your solution easier to read.

```ts
class Stack<T> {
  private items: T[] = [];

  // Add an element to the top.
  push(x: T): void {
    this.items.push(x);
  }

  // Remove and return the top element (undefined if empty).
  pop(): T | undefined {
    return this.items.pop();
  }

  // Return the top element without removing it (undefined if empty).
  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  get size(): number {
    return this.items.length;
  }
}
```

**Trace:**

| Operation | Returns | `items` afterward (top is on the right) |
|---|---|---|
| `push(5)` | | `[5]` |
| `push(8)` | | `[5, 8]` |
| `peek()` | `8` | `[5, 8]` |
| `pop()` | `8` | `[5]` |
| `pop()` | `5` | `[]` |
| `pop()` | `undefined` | `[]` |

### Variation: Min Stack

**The problem:** design a stack that supports `push`, `pop`, `top` and `getMin`, all in O(1). This is LeetCode 155, one of the most frequently asked design warm-ups; it is commonly reported at Amazon, Bloomberg and Microsoft.

**The naive idea and why it fails.** You could keep one variable `min`. Pushing is easy: `min = Math.min(min, x)`. But when you pop the current minimum, what's the new minimum? You'd have to scan the whole stack, which is O(n).

**The key insight.** A stack only ever removes from the top. So while an element sits in the stack, **everything below it never changes**. That means "the minimum of this element and everything below it" is fixed at the moment you push it. Store that value together with the element. Then `getMin` is just "read the stored minimum of the top entry".

```
push(5)  → [ {5, min 5} ]
push(3)  → [ {5, min 5}, {3, min 3} ]
push(7)  → [ {5, min 5}, {3, min 3}, {7, min 3} ]   getMin() = 3
pop()    → [ {5, min 5}, {3, min 3} ]               getMin() = 3
pop()    → [ {5, min 5} ]                           getMin() = 5  ← the old minimum is back, for free
```

```ts
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
```

LeetCode guarantees that `top`, `pop` and `getMin` are never called on an empty stack, so this version doesn't guard. In a real interview, say that out loud or add the guard.

### Complexity

| Operation | Time | Why |
|---|---|---|
| `push` | O(1) amortized | Appends at the end; occasional internal resizing averages out |
| `pop` | O(1) | Removes from the end; nothing else moves |
| `peek` / `top` / `getMin` | O(1) | Reads one position |
| Space | O(n) | One slot per element (Min Stack stores two numbers per element, still O(n)) |

### Common mistakes

- **Popping or peeking an empty stack.** This is the classic bug in Valid Parentheses with input `")"`. Check `stack.length === 0` first.
- **Forgetting the final check.** In matching problems, leftover elements mean unmatched openers, so the answer is often `stack.length === 0`, not simply `true`.
- **Using `shift`/`unshift`.** That works at the wrong end and costs O(n).
- **Storing values when you need positions.** In problems about distances or widths (Daily Temperatures, histogram areas), push **indices**, and look up values through them.

### Remembering and explaining it

To rebuild it: *a stack is an array where I only touch the end.* Everything else follows.

To explain it: *"I'll use an array as a stack. Push and pop at the end are amortized O(1). I need a stack here because the most recently opened item is the one the next closing item must match."* Always connect the choice of structure to the **reason** in the problem.

### LeetCode practice

Work through these in order. They build stack muscle memory from direct push/pop use to monotonic stacks and expression parsing.

1. [20. Valid Parentheses](https://leetcode.com/problems/valid-parentheses/)
2. [155. Min Stack](https://leetcode.com/problems/min-stack/)
3. [150. Evaluate Reverse Polish Notation](https://leetcode.com/problems/evaluate-reverse-polish-notation/)
4. [394. Decode String](https://leetcode.com/problems/decode-string/)
5. [739. Daily Temperatures](https://leetcode.com/problems/daily-temperatures/)
6. [735. Asteroid Collision](https://leetcode.com/problems/asteroid-collision/)
7. [84. Largest Rectangle in Histogram](https://leetcode.com/problems/largest-rectangle-in-histogram/)
8. [42. Trapping Rain Water](https://leetcode.com/problems/trapping-rain-water/)
9. [224. Basic Calculator](https://leetcode.com/problems/basic-calculator/)

---

## 2. Queue

### Mental model

A queue works like a line at a coffee shop. People join at the **back** and leave from the **front**. The first person to arrive is the first person served. This rule is called **FIFO: First In, First Out**.

```
             back                       front
enqueue →  [  E    D    C    B    A  ]  → dequeue (A leaves first)
```

| Operation | What it does |
|---|---|
| `enqueue(x)` | Add `x` at the back |
| `dequeue()` | Remove the front element and return it |
| `peek()` | Return the front element without removing it |
| `isEmpty()` / `size` | Check how many elements are waiting |

### Why a plain JavaScript array is a trap here

The obvious approach is `push` to add at the back and `shift` to remove from the front. It works, but `shift()` is **O(n)**: after removing index 0, the engine moves every remaining element one position to the left so the array starts at index 0 again.

```
before shift():  [A, B, C, D, E]
after  shift():  [B, C, D, E]      ← B, C, D, E each moved one slot left
```

For a queue that processes n elements, that adds up to O(n²) in the worst case. With 10⁵ elements, that's billions of moves, and a solution that should pass will time out. Interviewers at strong companies do notice `shift()` in a BFS.

> Some JavaScript engines optimize `shift()` for small arrays, so you may not notice the problem in quick tests. You can't count on that for large inputs, and interviewers judge you on the documented complexity.

### When to use a queue

The general signal is: **process things in the order they arrived**, or **explore in "waves" outward from a starting point**.

- **Breadth-first search (BFS).** Examples: shortest path in an unweighted graph or grid, "minimum number of steps/moves", level-order traversal of a tree, Rotting Oranges, Word Ladder.
  BFS finishes everything at distance 1 before anything at distance 2. A queue enforces that order automatically, because everything discovered earlier leaves earlier.
- **Topological sort (Kahn's algorithm).** Tasks whose prerequisites are all done wait in a queue.
- **Order of arrival.** Examples: task scheduling, message processing, "number of recent calls in the last 3000 ms", rate limiters.
- **Simulations.** Examples: Dota2 Senate, card or ticket games, where participants take turns and go back to the end of the line.

### The idea: don't delete from the front, walk past it

Instead of physically removing the front element, keep an index called `head` that points at the current front. Dequeuing just moves `head` one step to the right. The elements to the left of `head` are "already served". They still sit in memory, but the queue ignores them.

```
enqueue A, B, C, D:
  items: [A, B, C, D]
          ↑
         head = 0          queue contents: A B C D

dequeue() → returns A:
  items: [A, B, C, D]
             ↑
            head = 1       queue contents: B C D

dequeue() → returns B, then enqueue E:
  items: [A, B, C, D, E]
                ↑
               head = 2    queue contents: C D E
```

- Front element: `items[head]`
- Number of elements: `items.length - head`
- Empty when `head === items.length`

Nothing ever moves, so every operation is O(1).

### Implementation

```ts
class Queue<T> {
  private items: T[] = [];
  private head = 0; // index of the current front element

  // Add to the back.
  enqueue(x: T): void {
    this.items.push(x);
  }

  // Remove and return the front element (undefined if empty).
  dequeue(): T | undefined {
    if (this.isEmpty()) {
      return undefined;
    }
    const front = this.items[this.head];
    this.head++; // "walk past" the front instead of deleting it
    return front;
  }

  // Return the front element without removing it.
  peek(): T | undefined {
    if (this.isEmpty()) {
      return undefined;
    }
    return this.items[this.head];
  }

  isEmpty(): boolean {
    return this.size === 0;
  }

  get size(): number {
    return this.items.length - this.head;
  }
}
```

### Optional improvement: reclaiming memory

The dead slots to the left of `head` are never freed. For interview problems that's almost always fine, because the queue's total lifetime is bounded by the input size. If memory matters (for example, a long-running service that keeps enqueuing and dequeuing), you can occasionally cut off the dead part.

The rule below compacts only when the dead part is large and makes up at least half of the array. Because of that, the O(n) copy happens rarely, and dequeue stays O(1) amortized.

```typescript
// Replacement for dequeue() in the Queue class above.
dequeue(): T | undefined {
  if (this.isEmpty()) {
    return undefined;
  }
  const front = this.items[this.head];
  this.head++;

  const deadSlots = this.head;
  if (deadSlots > 1000 && deadSlots * 2 >= this.items.length) {
    this.items = this.items.slice(this.head); // keep only the live part
    this.head = 0;
  }
  return front;
}
```

In an interview, you can mention this instead of writing it: *"The dead slots before head aren't reclaimed. If memory mattered, I'd slice them off once they're more than half the array."*

### Using the head-pointer idea without a class

Inside a single function, you often don't need a class. Use an array and a `head` variable directly. The loop condition `head < queue.length` means "the queue isn't empty", and new elements pushed during the loop are processed automatically when `head` reaches them.

```typescript
const queue: string[] = [];
let head = 0;

queue.push("task-1"); // enqueue
queue.push("task-2");

while (head < queue.length) {
  // dequeue: read the front, then move head forward
  const current = queue[head];
  head++;

  // ...process `current` here.
  // Anything you queue.push(...) now will be processed later, in order.
}
```

A second common pattern processes the queue **one level (wave) at a time**. For example, in "minimum steps" problems you need to know when one distance ends and the next begins. Instead of one queue, you keep the current level in an array and build the next level in a new array:

```typescript
let currentLevel: string[] = ["start"];
let steps = 0;

while (currentLevel.length > 0) {
  const nextLevel: string[] = [];

  for (const item of currentLevel) {
    // ...process `item`; add items for the next wave with nextLevel.push(...)
  }

  currentLevel = nextLevel; // move on to the next wave
  steps++;
}
```

This avoids dequeue entirely: each level is a fresh array you simply iterate over.

### Complexity

| Operation | Time | Why |
|---|---|---|
| `enqueue` | O(1) amortized | `push` at the end |
| `dequeue` | O(1) | Only the `head` index changes (amortized O(1) with compaction) |
| `peek` / `size` / `isEmpty` | O(1) | Index arithmetic |
| Space | O(total enqueued) | Dead slots are kept unless compacted |

### Common mistakes

- **Using `shift()` without comment.** If an input is tiny and you do use it, say that `shift` is O(n) and why it's acceptable here.
- **Checking `queue.length === 0` instead of `head === queue.length`.** With the head-pointer approach, the array is never physically empty after the first push.
- **In BFS, marking a node as visited when you dequeue it instead of when you enqueue it.** The same node can then be enqueued many times before it's processed. That's still correct, but it can blow up time and memory.

### Remembering and explaining it

To rebuild it: *don't delete the front, walk past it.* One array, one index.

To explain it: *"JavaScript's `shift` is O(n) because it re-indexes the whole array, so I'll keep a head index into the array instead. Enqueue and dequeue are both O(1)."*

### LeetCode practice

1. [232. Implement Queue using Stacks](https://leetcode.com/problems/implement-queue-using-stacks/)
2. [933. Number of Recent Calls](https://leetcode.com/problems/number-of-recent-calls/)
3. [622. Design Circular Queue](https://leetcode.com/problems/design-circular-queue/)
4. [649. Dota2 Senate](https://leetcode.com/problems/dota2-senate/)
5. [950. Reveal Cards In Increasing Order](https://leetcode.com/problems/reveal-cards-in-increasing-order/)
6. [1670. Design Front Middle Back Queue](https://leetcode.com/problems/design-front-middle-back-queue/)

---
## 3. Singly Linked List

### Mental model

A linked list is a chain of small boxes called **nodes**. Each node holds a value and an arrow (a reference) to the next node. The last node's arrow points to `null`. You keep a reference to the first node, the **head**, and reach everything else by following arrows.

```
head
 ↓
[ 1 | •]──→[ 2 | •]──→[ 3 | •]──→ null
  val next
```

### Arrays vs. linked lists

| | Array | Singly linked list |
|---|---|---|
| Memory layout | One continuous block | Separate nodes anywhere in memory, joined by references |
| Read the i-th element | O(1): jump straight to it | O(n): walk i steps from the head |
| Insert / delete at the front | O(n): everything shifts | O(1): change one or two references |
| Insert / delete in the middle | O(n): everything after it shifts | O(1) *if you already hold the previous node*, O(n) to find it |
| Extra memory | None per element | One `next` reference per node |

The main strength of a linked list: once you are at the right place, inserting or removing is just re-pointing arrows. Nothing shifts.

### When you'll see linked lists

In interviews you rarely *choose* a linked list. Usually the problem hands you one. Recognize these families:

- **Reversal.** Examples: Reverse Linked List, Reverse Linked List II (a sub-range), Reverse Nodes in k-Group, Palindrome Linked List (reverse the second half and compare).
- **Two pointers moving at different speeds (fast/slow).** Examples: middle of the list, detect a cycle (Floyd's algorithm), find where the cycle starts, remove the n-th node from the end.
- **Merging and splitting.** Examples: Merge Two Sorted Lists, Merge k Sorted Lists (with a heap, Section 8), Partition List, Reorder List, Sort List.
- **Deletion by condition.** Examples: Remove Linked List Elements, Remove Duplicates from Sorted List.
- **As a building block.** Linked lists give O(1) insert and delete at a known position, which is why queues, deques and LRU caches use them (Sections 4–7).

### The node

This is the exact shape LeetCode and most platforms use. Memorize it; you'll write it at the top of many solutions.

```ts
class ListNode {
  val: number;
  next: ListNode | null;

  constructor(val = 0, next: ListNode | null = null) {
    this.val = val;
    this.next = next;
  }
}
```

### Technique 1: the dummy node

**The problem it solves.** Many linked-list bugs come from the head being a special case. Consider "remove every node whose value equals `target`". Removing a node in the middle means making the *previous* node skip it. But the head **has no previous node**, so you end up writing separate code for it:

```ts
// WITHOUT a dummy node: the head needs its own loop.
function removeElementsNoDummy(head: ListNode | null, target: number): ListNode | null {
  // Special case: remove matching nodes at the very start.
  while (head !== null && head.val === target) {
    head = head.next;
  }
  // General case: remove matching nodes after the head.
  let current = head;
  while (current !== null && current.next !== null) {
    if (current.next.val === target) {
      current.next = current.next.next;
    } else {
      current = current.next;
    }
  }
  return head;
}
```

**The trick.** Create a fake node, the **dummy**, and place it in front of the real head. Now *every* real node, including the head, has a previous node. The special case disappears. When you're done, the real list starts at `dummy.next`, which is correct even if the original head was removed or the list became empty.

```
dummy ──→ [6] ──→ [1] ──→ [6] ──→ [2] ──→ null
  ↑
 prev starts here, so the real head [6] also has a "previous" node
```

```ts
// WITH a dummy node: one uniform loop.
function removeElements(head: ListNode | null, target: number): ListNode | null {
  const dummy = new ListNode(0, head);
  let prev = dummy;

  while (prev.next !== null) {
    if (prev.next.val === target) {
      // Skip the matching node. Do NOT move prev:
      // the new prev.next must be checked too.
      prev.next = prev.next.next;
    } else {
      prev = prev.next;
    }
  }

  return dummy.next;
}
```

**Trace** for list `6 → 1 → 6 → 2` and `target = 6`:

| Step | `prev` | `prev.next` | Action | List after `dummy` |
|---|---|---|---|---|
| 1 | dummy | 6 | matches, skip it | 1 → 6 → 2 |
| 2 | dummy | 1 | no match, move `prev` | 1 → 6 → 2 |
| 3 | 1 | 6 | matches, skip it | 1 → 2 |
| 4 | 1 | 2 | no match, move `prev` | 1 → 2 |
| 5 | 2 | null | loop ends | **1 → 2** |

**Building a new list with a dummy.** The same trick helps when you build a result list from scratch. A `tail` pointer starts at the dummy, and you keep attaching nodes after `tail`. You never need to ask "is the result list still empty?". Here it is in Merge Two Sorted Lists, one of the most common linked-list questions:

```ts
function mergeTwoLists(a: ListNode | null, b: ListNode | null): ListNode | null {
  const dummy = new ListNode();
  let tail = dummy; // last node of the result list so far

  while (a !== null && b !== null) {
    if (a.val <= b.val) {
      tail.next = a;
      a = a.next;
    } else {
      tail.next = b;
      b = b.next;
    }
    tail = tail.next;
  }

  // At most one list still has nodes. They are already sorted,
  // so attach the remainder as a whole.
  if (a !== null) {
    tail.next = a;
  } else {
    tail.next = b;
  }

  return dummy.next;
}
```

**Rule of thumb:** *if the head of the list might change, or you're building a new list, start with a dummy node and return `dummy.next`.*

### Technique 2: reversing a linked list

Reversal is the single most important linked-list skill. It's a problem on its own (LeetCode 206, asked everywhere), and it's a step inside many others (palindrome check, reorder list, reverse in k-groups, add two numbers II).

**The idea.** Walk through the list once, and turn each node's arrow around so it points to the node *before* it instead of the node after it.

The danger: once you change `current.next`, you lose your only way to reach the rest of the list. So before changing it, **save it**. That gives three pointers:

- `prev`: the already-reversed part (starts as `null`, because the old head becomes the new tail and must point to `null`)
- `current`: the node you're turning around now
- `next`: a saved reference to the rest of the list

Each step does four moves, always in this order:

1. **Save** the rest of the list: `next = current.next`
2. **Reverse** the arrow: `current.next = prev`
3. **Advance** `prev`: `prev = current`
4. **Advance** `current`: `current = next`

**Trace** for `1 → 2 → 3 → null`:

```
Start:
  prev = null     current = 1 → 2 → 3 → null

After step 1 (node 1 reversed):
  null ← 1        current = 2 → 3 → null
         ↑prev

After step 2 (node 2 reversed):
  null ← 1 ← 2    current = 3 → null
              ↑prev

After step 3 (node 3 reversed):
  null ← 1 ← 2 ← 3    current = null  → loop ends
                  ↑prev

prev is the new head: 3 → 2 → 1 → null
```

**Iterative version.** This is the one to use by default: O(n) time, O(1) extra space.

```ts
function reverseList(head: ListNode | null): ListNode | null {
  let prev: ListNode | null = null;
  let current = head;

  while (current !== null) {
    const next = current.next; // 1. save the rest of the list
    current.next = prev;       // 2. turn the arrow around
    prev = current;            // 3. prev moves forward
    current = next;            // 4. current moves forward
  }

  // current is null; prev is the last node we visited, which is the new head.
  return prev;
}
```

**Recursive version.** It's worth understanding because interviewers sometimes ask for it as a follow-up. The idea: *trust* the recursive call to reverse everything after the head, then fix up the head.

```
reverse(1 → 2 → 3):
  the recursive call reverses 2 → 3 into 3 → 2, and returns 3 (the new head)
  now node 2 is the tail of the reversed part, and it's still head.next
  make node 2 point back at head:   head.next.next = head    (2 → 1)
  and make head the new tail:       head.next = null          (1 → null)
  result: 3 → 2 → 1 → null
```

```ts
function reverseListRecursive(head: ListNode | null): ListNode | null {
  // Base case: an empty list or a single node is already reversed.
  if (head === null || head.next === null) {
    return head;
  }

  const newHead = reverseListRecursive(head.next); // reverse everything after head
  head.next.next = head; // the node after head now points back to head
  head.next = null;      // head becomes the tail
  return newHead;
}
```

The recursive version uses O(n) call-stack space. With about 10⁴ or more nodes, it can hit JavaScript's call-stack limit, so prefer the iterative version in interviews and mention this trade-off.

**Reversing only part of a list (LeetCode 92, Reverse Linked List II).** Reverse the nodes from position `left` to position `right` (1-indexed). This combines both techniques: the dummy node handles `left = 1`, and the reversal loop is the same four moves.

```
Input: 1 → 2 → 3 → 4 → 5, left = 2, right = 4

   before        sublist to reverse        after
     [1]    →   [2] → [3] → [4]     →      [5]

Result: 1 → 4 → 3 → 2 → 5
```

The plan:
1. Walk to the node **just before** the sublist (`before`). The dummy guarantees it exists even when `left = 1`.
2. Reverse exactly `right - left + 1` nodes with the usual loop. Afterward, `prev` is the new first node of the sublist, and `current` is the first node **after** the sublist.
3. Reconnect both ends. The old first node of the sublist (still `before.next`) is now its last node, so point it at `current`. Then point `before` at `prev`.

```ts
function reverseBetween(head: ListNode | null, left: number, right: number): ListNode | null {
  const dummy = new ListNode(0, head);

  // 1. Walk to the node just before position `left`.
  let before = dummy;
  for (let i = 1; i < left; i++) {
    before = before.next!; // positions are valid per the problem statement
  }

  // 2. Reverse `right - left + 1` nodes with the standard four moves.
  let prev: ListNode | null = null;
  let current = before.next;
  for (let i = 0; i < right - left + 1; i++) {
    const next = current!.next;
    current!.next = prev;
    prev = current;
    current = next;
  }

  // 3. Reconnect.
  const oldFirst = before.next!; // was the first node of the sublist, now its last
  oldFirst.next = current;       // connect to the part after the sublist
  before.next = prev;            // connect the part before to the new first node

  return dummy.next;
}
```

### A reusable SinglyLinkedList class

Some problems ask you to design the list yourself ("Design Linked List", LeetCode 707), or you may want a small list inside a larger design. This class combines the dummy node with a `tail` pointer:

- The **dummy** removes head special cases.
- The **tail** pointer makes `addLast` O(1) instead of walking the whole list.

The one thing to watch is `tail`. Any operation that adds the first node, removes the last node, or reverses the list must update it. Each of those places has a comment in the code below.

```ts
class SinglyLinkedList {
  private dummy = new ListNode();       // sentinel before the real head
  private tail: ListNode = this.dummy;  // last real node, or the dummy when empty
  size = 0;

  // O(1): insert at the front.
  addFirst(val: number): void {
    const node = new ListNode(val, this.dummy.next);
    this.dummy.next = node;
    if (this.tail === this.dummy) {
      this.tail = node; // the list was empty, so the new node is also the last node
    }
    this.size++;
  }

  // O(1): insert at the back, thanks to the tail pointer.
  addLast(val: number): void {
    const node = new ListNode(val);
    this.tail.next = node;
    this.tail = node;
    this.size++;
  }

  // O(1): remove from the front.
  removeFirst(): number | undefined {
    const first = this.dummy.next;
    if (first === null) {
      return undefined;
    }
    this.dummy.next = first.next;
    if (first === this.tail) {
      this.tail = this.dummy; // we removed the only node, so the list is empty again
    }
    this.size--;
    return first.val;
  }

  // O(n): remove the first node with this value. Returns true if one was found.
  remove(val: number): boolean {
    let prev = this.dummy;
    while (prev.next !== null) {
      if (prev.next.val === val) {
        if (prev.next === this.tail) {
          this.tail = prev; // removing the last node, so prev becomes the last node
        }
        prev.next = prev.next.next;
        this.size--;
        return true;
      }
      prev = prev.next;
    }
    return false;
  }

  // O(n) time, O(1) space: reverse the list in place.
  reverse(): void {
    let prev: ListNode | null = null;
    let current = this.dummy.next;

    // The current first node will become the last node.
    // If the list is empty, tail stays at the dummy.
    if (current !== null) {
      this.tail = current;
    }

    while (current !== null) {
      const next = current.next;
      current.next = prev;
      prev = current;
      current = next;
    }

    this.dummy.next = prev; // prev is the new first node
  }

  toArray(): number[] {
    const result: number[] = [];
    let current = this.dummy.next;
    while (current !== null) {
      result.push(current.val);
      current = current.next;
    }
    return result;
  }
}
```

### Helpers for testing your code

When you can run code (CoderPad, a local editor), converting between arrays and lists makes testing fast. Both helpers use the dummy technique.

```ts
function listFromArray(values: number[]): ListNode | null {
  const dummy = new ListNode();
  let tail = dummy;
  for (const value of values) {
    tail.next = new ListNode(value);
    tail = tail.next;
  }
  return dummy.next;
}

function listToArray(head: ListNode | null): number[] {
  const result: number[] = [];
  let current = head;
  while (current !== null) {
    result.push(current.val);
    current = current.next;
  }
  return result;
}
```

```typescript
// Example:
const reversed = reverseList(listFromArray([1, 2, 3]));
console.log(listToArray(reversed)); // [3, 2, 1]
```

### Complexity

| Operation | Time | Why |
|---|---|---|
| Access the i-th node | O(n) | Must walk from the head |
| Search for a value | O(n) | Must walk until found |
| Insert / delete at the head | O(1) | Change one or two references |
| Insert at the tail | O(1) with a tail pointer, O(n) without | Without it, you'd walk to the end first |
| Delete a node when you hold the **previous** node | O(1) | `prev.next = prev.next.next` |
| Reverse | O(n) time, O(1) space (iterative) | One pass, three pointers |
| Space | O(n) | One node per element |

### Common mistakes

- **Losing the rest of the list.** Changing `current.next` before saving it cuts the list in two. In reversal, always save `next` first.
- **Advancing `prev` right after a deletion.** After `prev.next = prev.next.next`, the new `prev.next` hasn't been checked yet. Advance only when you *didn't* delete.
- **Null checks for fast/slow pointers.** The condition is `fast !== null && fast.next !== null`, because the fast pointer jumps two nodes.
- **Forgetting to update `tail`** when the last node is removed, the first node is added, or the list is reversed.
- **Returning `head` instead of `dummy.next`.** If the original head was removed, `head` points at a node that's no longer in the list.

### Remembering and explaining it

To rebuild it:
- *If the head might change, start with a dummy and return `dummy.next`.*
- *Reversal: save, reverse, advance, advance (four lines, always in that order).*

To explain it: *"I'll add a dummy node in front of the head so removing the first node isn't a special case. At the end I return `dummy.next`."* Interviewers recognize this as a mark of experience.

### LeetCode practice

1. [206. Reverse Linked List](https://leetcode.com/problems/reverse-linked-list/)
2. [203. Remove Linked List Elements](https://leetcode.com/problems/remove-linked-list-elements/)
3. [141. Linked List Cycle](https://leetcode.com/problems/linked-list-cycle/)
4. [19. Remove Nth Node From End of List](https://leetcode.com/problems/remove-nth-node-from-end-of-list/)
5. [21. Merge Two Sorted Lists](https://leetcode.com/problems/merge-two-sorted-lists/)
6. [2. Add Two Numbers](https://leetcode.com/problems/add-two-numbers/)
7. [92. Reverse Linked List II](https://leetcode.com/problems/reverse-linked-list-ii/)
8. [143. Reorder List](https://leetcode.com/problems/reorder-list/)
9. [25. Reverse Nodes in k-Group](https://leetcode.com/problems/reverse-nodes-in-k-group/)

---

## 4. Doubly Linked List

### Mental model

In a doubly linked list, each node has **two** arrows: `next` (forward) and `prev` (backward). You can walk in both directions.

More importantly: **if you hold a reference to any node, you can remove it in O(1).** In a singly linked list, you need the *previous* node to remove a node, and finding it costs O(n). Here the node itself knows its previous node.

```
null ← [A] ⇄ [B] ⇄ [C] → null
```

### The technique: two sentinel nodes

A doubly linked list has even more edge cases than a singly linked one. Is the node the first one? The last one? The only one? Is the list empty?

The fix extends the dummy-node idea: put a fake node at **both** ends.

- `head` is a sentinel **before** the first real node.
- `tail` is a sentinel **after** the last real node.

The sentinels hold no data and are never removed. As a result, **every real node always has a real `prev` and a real `next`**, never `null`. Every insert and every removal looks exactly the same, wherever it happens.

```
   head ⇄ [A] ⇄ [B] ⇄ [C] ⇄ tail
  (fake)                    (fake)

Empty list:
   head ⇄ tail
```

- First real node: `head.next` (when it's `tail`, the list is empty)
- Last real node: `tail.prev` (when it's `head`, the list is empty)

### The two primitive operations

Every other operation is built from these two.

**1. `insertBetween(node, prev, next)`** links a new node between two neighbors. That takes four reference changes:

```
Before:   prev ⇄ next

          node.prev = prev          (node looks back at prev)
          node.next = next          (node looks forward at next)
          prev.next = node          (prev now looks forward at node)
          next.prev = node          (next now looks back at node)

After:    prev ⇄ node ⇄ next
```

Because `prev` and `next` are passed in as **parameters**, the order of these four lines doesn't matter. If you wrote the pointer changes inline, like `node.next = head.next; head.next.prev = node; ...`, the order would matter. Getting it wrong is a classic bug. Passing the neighbors in as parameters removes that risk.

**2. `remove(node)`** unlinks a node. It takes two reference changes: the neighbors point past the node, to each other.

```
Before:   P ⇄ node ⇄ N

          P.next = N
          N.prev = P

After:    P ⇄ N          (node is no longer reachable)
```

Then:
- `pushFront(x)` means `insertBetween(newNode, head, head.next)`
- `pushBack(x)` means `insertBetween(newNode, tail.prev, tail)`
- `popFront()` means `remove(head.next)`
- `popBack()` means `remove(tail.prev)`

### When to use a doubly linked list

- **O(1) removal of a specific node you already hold a reference to.** This is the reason LRU caches (Section 6), LFU caches (Section 7) and "All O(1) Data Structure" use it. A `Map` finds the node, and the list removes it in O(1).
- **A deque**, meaning push and pop at both ends in O(1) (Section 5).
- **Moving in both directions.** Examples: browser history (back and forward), a text editor cursor, Design Browser History, Design a Text Editor.

### Implementation

```ts
class DNode<T> {
  val: T;
  prev: DNode<T> | null = null;
  next: DNode<T> | null = null;

  constructor(val: T) {
    this.val = val;
  }
}

class DoublyLinkedList<T> {
  // Sentinels: they never hold real data and are never removed.
  // `undefined as T` is fine because nobody ever reads a sentinel's value.
  private head = new DNode<T>(undefined as T);
  private tail = new DNode<T>(undefined as T);
  size = 0;

  constructor() {
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  // Primitive 1: link `node` between two adjacent nodes.
  private insertBetween(node: DNode<T>, prev: DNode<T>, next: DNode<T>): DNode<T> {
    node.prev = prev;
    node.next = next;
    prev.next = node;
    next.prev = node;
    this.size++;
    return node;
  }

  // Primitive 2: unlink a real node in O(1) and return its value.
  // The `!` is safe: thanks to the sentinels, a real node always has both neighbors.
  remove(node: DNode<T>): T {
    node.prev!.next = node.next;
    node.next!.prev = node.prev;
    node.prev = null; // clean up so the removed node doesn't keep the list alive
    node.next = null;
    this.size--;
    return node.val;
  }

  // Returns the new node so callers (like an LRU cache) can keep a reference to it.
  pushFront(val: T): DNode<T> {
    return this.insertBetween(new DNode(val), this.head, this.head.next!);
  }

  pushBack(val: T): DNode<T> {
    return this.insertBetween(new DNode(val), this.tail.prev!, this.tail);
  }

  popFront(): T | undefined {
    if (this.size === 0) {
      return undefined; // never remove a sentinel
    }
    return this.remove(this.head.next!);
  }

  popBack(): T | undefined {
    if (this.size === 0) {
      return undefined;
    }
    return this.remove(this.tail.prev!);
  }

  peekFront(): T | undefined {
    if (this.size === 0) {
      return undefined;
    }
    return this.head.next!.val;
  }

  peekBack(): T | undefined {
    if (this.size === 0) {
      return undefined;
    }
    return this.tail.prev!.val;
  }

  isEmpty(): boolean {
    return this.size === 0;
  }

  // O(n): reverse the list in place (explained below).
  reverse(): void {
    let current: DNode<T> | null = this.head;
    while (current !== null) {
      const next: DNode<T> | null = current.next; // save before swapping
      current.next = current.prev;               // swap the two arrows
      current.prev = next;
      current = next;
    }
    // The old head sentinel is now at the far end and the old tail sentinel at the front.
    const oldHead = this.head;
    this.head = this.tail;
    this.tail = oldHead;
  }

  toArray(): T[] {
    const result: T[] = [];
    let current = this.head.next!;
    while (current !== this.tail) {
      result.push(current.val);
      current = current.next!;
    }
    return result;
  }
}
```

### Reversing a doubly linked list

In a doubly linked list, every connection is already stored in both directions. Reversing just means **swapping `prev` and `next` on every node**, including the two sentinels. Then the sentinels trade roles, so swap the `head` and `tail` references.

```
Before:
  head ⇄ [A] ⇄ [B] ⇄ tail

Swap prev/next on every node (the arrows now point the other way):
  head ⇆ [A] ⇆ [B] ⇆ tail      ← reading next-pointers from `tail` now gives B, A, head

Swap the sentinel references (head ↔ tail):
  head' ⇄ [B] ⇄ [A] ⇄ tail'    ← head' is the old tail, tail' is the old head
```

We walk forward using the saved `next` (the original next), because after the swap `current.next` points backward. No nodes are created, so any references held elsewhere (for example in a `Map`) stay valid. Time O(n), space O(1).

### Complexity

| Operation | Time | Why |
|---|---|---|
| `pushFront` / `pushBack` | O(1) | Four reference changes |
| `popFront` / `popBack` | O(1) | Two reference changes |
| `remove(node)` when you hold the node | O(1) | The node knows both neighbors |
| Search by value | O(n) | Must walk the list (pair it with a `Map` to avoid this) |
| `reverse` | O(n) time, O(1) space | Swap two arrows per node |
| Space | O(n) | Two references per node plus two sentinels |

### Common mistakes

- **Removing a sentinel.** Calling `popBack` on an empty list would unlink the `head` sentinel and corrupt the list. Always guard with `size === 0`.
- **Writing the four insert assignments inline in the wrong order.** Use the `insertBetween(node, prev, next)` helper so the order can't matter.
- **Forgetting that `remove` needs a node that is actually in the list.** Calling it twice on the same node breaks things, because after the first call its `prev`/`next` are `null`.

### Remembering and explaining it

To rebuild it: *two fake ends; `insertBetween` (four lines) and `remove` (two lines); everything else calls those two.*

To explain it: *"I'll use a doubly linked list with head and tail sentinels, so every real node always has two neighbors and there are no null checks. Removing a node I hold is O(1)."*

### LeetCode practice

1. [707. Design Linked List](https://leetcode.com/problems/design-linked-list/)
2. [430. Flatten a Multilevel Doubly Linked List](https://leetcode.com/problems/flatten-a-multilevel-doubly-linked-list/)
3. [1472. Design Browser History](https://leetcode.com/problems/design-browser-history/)
4. [432. All O`one Data Structure](https://leetcode.com/problems/all-oone-data-structure/)

---

## 5. Deque (Double-Ended Queue)

### Mental model

A deque (pronounced "deck") is a queue that is open at **both** ends. You can add and remove at the front and at the back.

```
pushFront →  [ front  ...  back ]  ← pushBack
popFront  ←                        → popBack
```

It combines a stack (one end) and a queue (both ends) in one structure.

### Why not a plain array?

`push` and `pop` at the back are O(1), but `unshift` (push to the front) and `shift` (pop from the front) are O(n), because every element has to move. A deque needs all four operations in O(1).

### When to use a deque

- **Sliding window maximum/minimum.** A deque kept in sorted order, the *monotonic queue* (Section 12), gives the max or min of every window in O(n) total.
- **0-1 BFS.** In a graph where edge weights are only 0 or 1, you push weight-0 neighbors to the **front** (same distance) and weight-1 neighbors to the **back** (distance + 1). That gives shortest paths without a heap.
- **Problems that consume from both ends.** Examples: palindrome checks, Design Circular Deque (LeetCode 641), Design Front Middle Back Queue.
- **Bounded history.** Examples: "keep the last k events". Push new events at the back, and drop the oldest from the front when there are more than k.

### Implementation A: reuse the doubly linked list (recommended)

The `DoublyLinkedList` from Section 4 **already is** a deque: `pushFront`, `pushBack`, `popFront`, `popBack`, `peekFront` and `peekBack` are all O(1). You learn one structure and get two uses.

```ts
class Deque<T> extends DoublyLinkedList<T> {}
```

If you would rather not rely on inheritance in an interview, just use `DoublyLinkedList` directly and call it a deque when you explain.

### Implementation B: circular buffer (optional; faster in practice)

A circular buffer stores elements in an array and lets indices **wrap around** from the end back to the start. It creates no node objects and has good memory locality. This is how most standard libraries implement deques.

**The state:**
- `buffer`: an array with some capacity
- `head`: the index of the front element
- `count`: how many elements are stored

The index of the back element is `head + count - 1`, wrapped around. "Wrapping" means taking the remainder after division by the capacity (`%`).

```
capacity = 8, head = 6, count = 4

index:   0    1    2    3    4    5    6    7
       [ C ][ D ][   ][   ][   ][   ][ A ][ B ]
                                      ↑ head

Logical order: A, B, C, D   (starting at head, wrapping around after index 7)
Back index = (6 + 4 - 1) % 8 = 9 % 8 = 1   → D
```

**The operations:**
- **pushBack:** write at `(head + count) % capacity`, then `count++`.
- **pushFront:** move `head` one step left (wrapping), write there, then `count++`.
- **popFront:** read at `head`, move `head` one step right (wrapping), then `count--`.
- **popBack:** read at `(head + count - 1) % capacity`, then `count--`.
- **When full:** create an array twice as large and copy the elements in logical order, starting at index 0.

**Negative remainders in JavaScript.** In JavaScript, `-1 % 8` is `-1`, not `7`. So moving `head` one step left must add the capacity first:

```typescript
const capacity = 8;
let head = 0;

head = (head - 1) % capacity;            // WRONG: head becomes -1
head = 0;
head = (head - 1 + capacity) % capacity; // RIGHT: head becomes 7
```

```ts
class CircularDeque<T> {
  private buffer: (T | undefined)[] = new Array(8);
  private head = 0;  // index of the front element
  private count = 0; // number of stored elements

  // Double the capacity and lay the elements out again from index 0.
  private grow(): void {
    const bigger: (T | undefined)[] = new Array(this.buffer.length * 2);
    for (let i = 0; i < this.count; i++) {
      bigger[i] = this.buffer[(this.head + i) % this.buffer.length];
    }
    this.buffer = bigger;
    this.head = 0;
  }

  pushBack(x: T): void {
    if (this.count === this.buffer.length) {
      this.grow();
    }
    const backSlot = (this.head + this.count) % this.buffer.length;
    this.buffer[backSlot] = x;
    this.count++;
  }

  pushFront(x: T): void {
    if (this.count === this.buffer.length) {
      this.grow();
    }
    // Step left with wrap-around. "+ length" avoids a negative remainder.
    this.head = (this.head - 1 + this.buffer.length) % this.buffer.length;
    this.buffer[this.head] = x;
    this.count++;
  }

  popFront(): T | undefined {
    if (this.count === 0) {
      return undefined;
    }
    const value = this.buffer[this.head];
    this.buffer[this.head] = undefined; // release the reference
    this.head = (this.head + 1) % this.buffer.length;
    this.count--;
    return value;
  }

  popBack(): T | undefined {
    if (this.count === 0) {
      return undefined;
    }
    const backIndex = (this.head + this.count - 1) % this.buffer.length;
    const value = this.buffer[backIndex];
    this.buffer[backIndex] = undefined;
    this.count--;
    return value;
  }

  peekFront(): T | undefined {
    if (this.count === 0) {
      return undefined;
    }
    return this.buffer[this.head];
  }

  peekBack(): T | undefined {
    if (this.count === 0) {
      return undefined;
    }
    return this.buffer[(this.head + this.count - 1) % this.buffer.length];
  }

  get size(): number {
    return this.count;
  }
}
```

**Trace** (starting capacity 4 for readability; `_` means an empty slot):

| Operation | `buffer` | `head` | `count` | Logical contents |
|---|---|---|---|---|
| start | `[_, _, _, _]` | 0 | 0 | |
| `pushBack(1)` | `[1, _, _, _]` | 0 | 1 | 1 |
| `pushBack(2)` | `[1, 2, _, _]` | 0 | 2 | 1 2 |
| `pushFront(0)` | `[1, 2, _, 0]` | 3 | 3 | 0 1 2 |
| `popBack()` → 2 | `[1, _, _, 0]` | 3 | 2 | 0 1 |
| `popFront()` → 0 | `[1, _, _, _]` | 0 | 1 | 1 |

### Complexity

| Operation | DLL-based | Circular buffer |
|---|---|---|
| push / pop at either end | O(1) | O(1) amortized (the occasional grow is O(n)) |
| peek at either end | O(1) | O(1) |
| Space | O(n) plus two references per element | O(capacity), at most about 2n |

### Common mistakes

- **Negative remainder** when stepping left: always use `(i - 1 + n) % n`.
- **Computing `size` from `buffer.length`.** The buffer's length is its capacity. The size is `count`.
- **Forgetting to reset `head` to 0 after growing.** The copy lays the elements out starting at index 0.

### Remembering and explaining it

To rebuild it: *"A deque is my doubly linked list. If I need raw speed, it's an array plus `head` plus `count`, with modulo for wrap-around."*

To explain it: *"JavaScript arrays have O(n) `shift` and `unshift`, so for O(1) operations at both ends I'll use a doubly linked list as a deque."*

### LeetCode practice

1. [641. Design Circular Deque](https://leetcode.com/problems/design-circular-deque/)
2. [950. Reveal Cards In Increasing Order](https://leetcode.com/problems/reveal-cards-in-increasing-order/)
3. [239. Sliding Window Maximum](https://leetcode.com/problems/sliding-window-maximum/)
4. [1438. Longest Continuous Subarray With Absolute Diff Less Than or Equal to Limit](https://leetcode.com/problems/longest-continuous-subarray-with-absolute-difference-less-than-or-equal-to-limit/)
5. [862. Shortest Subarray with Sum at Least K](https://leetcode.com/problems/shortest-subarray-with-sum-at-least-k/)
6. [1425. Constrained Subsequence Sum](https://leetcode.com/problems/constrained-subsequence-sum/)
7. [1696. Jump Game VI](https://leetcode.com/problems/jump-game-vi/)
8. [1499. Max Value of Equation](https://leetcode.com/problems/max-value-of-equation/)

---
## 6. LRU Cache

### Mental model

A cache stores a limited number of key-value pairs. When it is full and a new key arrives, something has to go. **LRU (Least Recently Used)** evicts the entry that hasn't been used for the longest time.

Every `get` or `put` of a key counts as a "use" and makes that key the **most recently used**. Picture a line of entries ordered by recency: each use moves an entry to the front, and evictions take the entry at the very back.

**Required operations, both in O(1):**
- `get(key)`: return the value, or -1 if it's missing, and mark the key as most recently used.
- `put(key, value)`: insert or update the key, and mark it as most recently used. If the cache is now over capacity, evict the least recently used key.

This is LeetCode 146. It's one of the most frequently asked design-coding questions of all, commonly reported at Amazon, Meta, Microsoft, Bloomberg, Google and many others. Know it cold.

### Why you need two structures

Each structure alone fails at one of the requirements:

| Need | Map alone | List alone | Map + doubly linked list |
|---|---|---|---|
| Find a key in O(1) | Yes | No, O(n) walk | Yes, the map points to the node |
| Move an entry to "most recent" in O(1) | No ordering | Yes, if you hold the node | Yes |
| Find and remove the least recent in O(1) | No ordering | Yes, it's at the end | Yes |

So the two structures cooperate:
- **`Map<key, node>`** answers "where is this key?" in O(1).
- **A doubly linked list** keeps entries in recency order: most recent right after `head`, least recent right before `tail`.

```
Map:   1 → nodeA     2 → nodeB     3 → nodeC

List:  head ⇄ [3:C] ⇄ [1:A] ⇄ [2:B] ⇄ tail
             most recent       least recent  ← evict tail.prev
```

**Why doubly linked?** To move a node to the front, you first remove it from its current position, and that needs the node's `prev`. A singly linked list would need an O(n) search to find it.

**Why does each node store its key?** When you evict `tail.prev`, you also have to delete it from the map, and the map is keyed by *key*. Without the key stored inside the node, you can't find the map entry to delete. This is the most common LRU bug.

### How the operations work

**`get(key)`**
1. Look the key up in the map. If it's missing, return -1.
2. Move its node to the front (remove it, then insert it right after `head`).
3. Return the node's value.

**`put(key, value)`**
1. If the key exists: update the node's value, move the node to the front, and you're done.
2. Otherwise: create a node, store it in the map, and insert it at the front.
3. If the map's size is now larger than the capacity, evict: take `tail.prev`, remove it from the list, and delete its key from the map.

**Trace** with `capacity = 2`:

| Operation | Returns | List (most recent → least recent) | Note |
|---|---|---|---|
| `put(1, 1)` | | [1] | |
| `put(2, 2)` | | [2, 1] | |
| `get(1)` | 1 | [1, 2] | 1 moves to the front |
| `put(3, 3)` | | [3, 1] | Over capacity: evict 2 (least recent) |
| `get(2)` | -1 | [3, 1] | 2 was evicted |
| `put(4, 4)` | | [4, 3] | Over capacity: evict 1 |
| `get(1)` | -1 | [4, 3] | |
| `get(3)` | 3 | [3, 4] | |
| `get(4)` | 4 | [4, 3] | |

### Implementation 1: Map + doubly linked list (what interviewers expect)

The list logic from Section 4 is written directly into the class here, because this is how you'll usually write it in an interview. Only two small helpers are needed.

```ts
class LRUNode {
  key: number; // needed to delete the map entry when this node is evicted
  val: number;
  prev: LRUNode | null = null;
  next: LRUNode | null = null;

  constructor(key: number, val: number) {
    this.key = key;
    this.val = val;
  }
}

class LRUCache {
  private capacity: number;
  private map = new Map<number, LRUNode>();
  private head = new LRUNode(0, 0); // sentinel on the most recent side
  private tail = new LRUNode(0, 0); // sentinel on the least recent side

  constructor(capacity: number) {
    this.capacity = capacity;
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  // Unlink a node from the list (it must currently be in the list).
  private removeNode(node: LRUNode): void {
    node.prev!.next = node.next;
    node.next!.prev = node.prev;
  }

  // Insert a node right after the head sentinel (the "most recent" position).
  private addToFront(node: LRUNode): void {
    const first = this.head.next!;
    node.prev = this.head;
    node.next = first;
    this.head.next = node;
    first.prev = node;
  }

  get(key: number): number {
    const node = this.map.get(key);
    if (node === undefined) {
      return -1;
    }
    // Mark as most recently used.
    this.removeNode(node);
    this.addToFront(node);
    return node.val;
  }

  put(key: number, value: number): void {
    const existing = this.map.get(key);
    if (existing !== undefined) {
      // Update in place and mark as most recently used. No eviction needed:
      // the number of keys didn't change.
      existing.val = value;
      this.removeNode(existing);
      this.addToFront(existing);
      return;
    }

    const node = new LRUNode(key, value);
    this.map.set(key, node);
    this.addToFront(node);

    if (this.map.size > this.capacity) {
      const leastRecent = this.tail.prev!;
      this.removeNode(leastRecent);
      this.map.delete(leastRecent.key); // this is why the node stores its key
    }
  }
}
```

Notice that `addToFront` saves `head.next` into `first` before changing anything. That is the same idea as passing neighbors in as parameters in Section 4: once both neighbors are saved in variables, the order of the four assignments no longer matters.

### Implementation 2: the JavaScript `Map` shortcut

A JavaScript `Map` **remembers insertion order**, and the language specification guarantees it. Iterating a `Map` yields keys from the oldest insertion to the newest. Two consequences:

- **Deleting a key and setting it again** moves it to the "newest" end. That's "mark as most recently used".
- **`map.keys().next().value`** is the oldest key. That's the least recently used key.

The `Map` itself is doing the doubly linked list's job:

```ts
class LRUCacheWithMapOrder {
  private capacity: number;
  private map = new Map<number, number>(); // iteration order = least → most recent

  constructor(capacity: number) {
    this.capacity = capacity;
  }

  get(key: number): number {
    if (!this.map.has(key)) {
      return -1;
    }
    const value = this.map.get(key)!;
    // Re-insert to move the key to the "most recent" end.
    this.map.delete(key);
    this.map.set(key, value);
    return value;
  }

  put(key: number, value: number): void {
    // Delete first so that re-setting moves the key to the "most recent" end.
    this.map.delete(key);
    this.map.set(key, value);

    if (this.map.size > this.capacity) {
      // The first key in iteration order is the least recently used.
      const oldestKey = this.map.keys().next().value;
      if (oldestKey !== undefined) {
        this.map.delete(oldestKey);
      }
    }
  }
}
```

**How to use this in an interview.** It's short and correct, but many interviewers consider it sidestepping the point of the question. A good approach: *"In JavaScript, a Map preserves insertion order, so I could implement this in a few lines. I assume you'd like to see the underlying mechanism, so I'll build it with a hash map and a doubly linked list."* That shows you know both approaches.

### Complexity

| Operation | Time | Why |
|---|---|---|
| `get` | O(1) | Map lookup, plus a constant number of pointer changes |
| `put` | O(1) | Map insert/delete, plus a constant number of pointer changes |
| Space | O(capacity) | At most `capacity` nodes and map entries (briefly capacity + 1 before an eviction) |

### Common mistakes

- **Not storing the key in the node.** Then you can't delete the evicted entry from the map.
- **Updating an existing key without moving it to the front.** An update is a "use".
- **Evicting before checking whether the key already exists.** Updating an existing key never needs an eviction.
- **Checking `map.size >= capacity` before inserting, and then evicting even for updates.** The simplest correct order is: insert, then check `map.size > capacity`.
- **Using `if (!node)` when values can be 0.** Here the map stores nodes, so it's safe. But in the Map-shortcut version, `if (!this.map.get(key))` would wrongly treat a stored value of `0` as missing. Use `has` or compare with `undefined`.

### Remembering and explaining it

To rebuild it: *"The map finds it, the list orders it. A 'use' is remove plus add-to-front. Overflow means evicting `tail.prev` and deleting its key from the map."*

To explain it: *"I need O(1) lookup, which means a hash map, and O(1) reordering and eviction, which means a doubly linked list with sentinels. The map stores key → node, and each node stores its key so eviction can clean up the map."*

### LeetCode practice

1. [146. LRU Cache](https://leetcode.com/problems/lru-cache/)

---

## 7. LFU Cache

### Mental model

LFU (**Least Frequently Used**) is the natural "hard" follow-up to LRU (LeetCode 460). Like LRU, it's a fixed-capacity cache. The difference is what gets evicted:

- Each key has a **use count** (frequency). Every `get` and every `put` on a key increments it. A newly inserted key starts at 1.
- When the cache is full, evict the key with the **lowest frequency**.
- **Tie-break:** if several keys share that lowest frequency, evict the **least recently used** among them.

So LFU is "a separate LRU order inside each frequency level".

```
frequency 1:  [key 5]                    ← newest keys (used once)
frequency 2:  [key 3, key 1]             ← key 3 used less recently than key 1
frequency 4:  [key 2]

minFrequency = 1  → the eviction victim is the least recent key at frequency 1: key 5
```

### When it's asked

It comes up as a follow-up in LRU interviews or as a standalone hard design question. Interviewers use it to see whether you can **combine** structures cleanly, and whether you can reason about the `minFrequency` invariant below.

### The structure

Three pieces, each with one job:

1. **`entries: Map<key, { value, freq }>`** finds a key's value and frequency in O(1).
2. **`buckets: Map<freq, Set<key>>`** keeps, for each frequency, the keys that currently have it. The `Set` preserves insertion order, so its first key is the least recently used key at that frequency. The Set plays the role that the doubly linked list played in LRU: add at the end, delete any key, and read the oldest are all O(1).
3. **`minFreq: number`** is the lowest frequency that currently has any keys. It tells you which bucket to evict from, without searching.

### Keeping `minFreq` correct without searching

`minFreq` only ever changes in two simple ways:

- **When a new key is inserted, `minFreq` becomes 1.** The new key has frequency 1, and nothing can be lower.
- **When a key is used, it moves from frequency `f` to `f + 1`.** If that key was the **last** key at frequency `f` **and** `f` was `minFreq`, then `minFreq` becomes `f + 1`. Why exactly `f + 1`? The key we just moved now sits at `f + 1`, and no other key was below `f` (because `f` was the minimum).

That's why no operation ever needs to scan for the minimum.

### How the operations work

**`touch(key)`** is the shared helper for "this key was used":
1. Read its current frequency `f`.
2. Remove the key from `buckets[f]`. If that bucket is now empty, delete it, and if `f === minFreq`, increment `minFreq`.
3. Set the key's frequency to `f + 1` and add the key at the end of `buckets[f + 1]`, creating the bucket if needed.

**`get(key)`**: if the key is missing, return -1. Otherwise `touch(key)` and return the value.

**`put(key, value)`**:
1. If the capacity is 0, do nothing.
2. If the key exists: update its value, `touch(key)`, and you're done.
3. If the cache is full: evict the **first** (oldest) key in `buckets[minFreq]`. Remove it from that bucket (deleting the bucket if it becomes empty) and from `entries`.
4. Insert the new key with frequency 1, add it to `buckets[1]`, and set `minFreq = 1`.

**Trace** with `capacity = 2` (the example from LeetCode 460). Keys are listed from least to most recent within each bucket:

| Operation | Returns | Buckets afterward | `minFreq` | Note |
|---|---|---|---|---|
| `put(1, 1)` | | 1: {1} | 1 | |
| `put(2, 2)` | | 1: {1, 2} | 1 | |
| `get(1)` | 1 | 1: {2}; 2: {1} | 1 | Key 1 moves up to frequency 2 |
| `put(3, 3)` | | 1: {3}; 2: {1} | 1 | Full: evict the oldest key at freq 1, which is **2** |
| `get(2)` | -1 | unchanged | 1 | |
| `get(3)` | 3 | 2: {1, 3} | 2 | Bucket 1 emptied and was `minFreq`, so `minFreq` becomes 2 |
| `put(4, 4)` | | 1: {4}; 2: {3} | 1 | Full: evict the oldest key at freq 2, which is **1** (tie broken by recency) |
| `get(1)` | -1 | unchanged | 1 | |
| `get(3)` | 3 | 1: {4}; 3: {3} | 1 | |
| `get(4)` | 4 | 2: {4}; 3: {3} | 2 | |

### Implementation

```ts
class LFUCache {
  private capacity: number;
  private entries = new Map<number, { value: number; freq: number }>();
  // freq → keys with that frequency, ordered from least to most recently used.
  private buckets = new Map<number, Set<number>>();
  private minFreq = 0;

  constructor(capacity: number) {
    this.capacity = capacity;
  }

  get(key: number): number {
    const entry = this.entries.get(key);
    if (entry === undefined) {
      return -1;
    }
    this.touch(key);
    return entry.value;
  }

  put(key: number, value: number): void {
    if (this.capacity === 0) {
      return;
    }

    const entry = this.entries.get(key);
    if (entry !== undefined) {
      entry.value = value;
      this.touch(key);
      return;
    }

    if (this.entries.size === this.capacity) {
      this.evict();
    }

    this.entries.set(key, { value, freq: 1 });
    this.addToBucket(key, 1);
    this.minFreq = 1; // a brand-new key always has the lowest possible frequency
  }

  // The key was used: move it from its frequency bucket to the next one.
  private touch(key: number): void {
    const entry = this.entries.get(key)!;
    const oldFreq = entry.freq;

    const oldBucket = this.buckets.get(oldFreq)!;
    oldBucket.delete(key);
    if (oldBucket.size === 0) {
      this.buckets.delete(oldFreq);
      if (this.minFreq === oldFreq) {
        this.minFreq = oldFreq + 1; // the moved key is now the lowest frequency
      }
    }

    entry.freq = oldFreq + 1;
    this.addToBucket(key, entry.freq);
  }

  // Remove the least recently used key among those with the lowest frequency.
  private evict(): void {
    const bucket = this.buckets.get(this.minFreq)!;
    const victim = bucket.values().next().value!; // first = least recently used
    bucket.delete(victim);
    if (bucket.size === 0) {
      this.buckets.delete(this.minFreq);
      // No need to fix minFreq here: put() sets it to 1 right after evicting.
    }
    this.entries.delete(victim);
  }

  private addToBucket(key: number, freq: number): void {
    let bucket = this.buckets.get(freq);
    if (bucket === undefined) {
      bucket = new Set<number>();
      this.buckets.set(freq, bucket);
    }
    bucket.add(key); // added at the end = most recently used in this bucket
  }
}
```

**About using `Set` instead of a linked list per frequency.** The textbook LFU keeps a doubly linked list for each frequency. A JavaScript `Set` gives the same guarantees: add at the end, delete any element and read the first element are all O(1), and the order is preserved by the specification. Say this explicitly in an interview. If the interviewer wants the "real" mechanism, replace each `Set<number>` with the `DoublyLinkedList` from Section 4 plus a `Map<key, node>` so you can find nodes.

### Complexity

| Operation | Time | Why |
|---|---|---|
| `get` | O(1) | Map lookups plus `Set` delete/add |
| `put` | O(1) | Same, plus reading the first element of one `Set` |
| Space | O(capacity) | Each key appears once in `entries` and once in exactly one bucket |

### Common mistakes

- **Forgetting the tie-break.** Within the lowest frequency, evict the *least recently used* key, which is the first one in the Set, not an arbitrary one.
- **Updating `minFreq` whenever a bucket empties.** Only update it when the emptied bucket's frequency **was** `minFreq`.
- **Forgetting that `put` on an existing key also counts as a use.** It must increase the frequency.
- **Capacity 0.** Without the early return, you'd try to evict from an empty cache.

### Remembering and explaining it

To rebuild it: *"`entries` for value and frequency, `buckets` of LRU-ordered sets per frequency, and `minFreq`. A use moves the key up one bucket. A new key resets `minFreq` to 1. Evict the first key of `buckets[minFreq]`."*

To explain it: *"It's LRU inside each frequency level. A key map gives O(1) lookup, frequency buckets give O(1) moves, and tracking the minimum frequency makes eviction O(1) without a search."*

### LeetCode practice

1. [460. LFU Cache](https://leetcode.com/problems/lfu-cache/)

---

## 8. Heap (Priority Queue)

**This is the most important structure in this guide.** Heaps appear in a large share of medium and hard interview problems, and JavaScript doesn't have one.

### Mental model

A **priority queue** is a collection where you can always take out the "best" element: the smallest, the largest, or the one with the highest priority by some rule. A **heap** is the standard way to implement it.

A (binary) heap is a binary tree with two rules:

1. **Shape rule. It's a *complete* binary tree.** Every level is completely filled except possibly the last, and the last level is filled **from left to right** with no gaps.
2. **Order rule (the heap property). Every parent is "better" than or equal to its children.** In a **min-heap**, every parent is ≤ its children, so the smallest element is at the root. In a **max-heap**, every parent is ≥ its children.

```
A valid min-heap:
              1
            /   \
          3       2
         / \     /
        7   4   5
```

**A heap is not sorted.** Looking at the example: 3 is on the left and 2 is on the right, and 7 sits below 3 while 5 sits below 2. Only the *vertical* relationship (parent vs. child) is guaranteed, not the horizontal one. This weaker rule is exactly why a heap can insert and remove in O(log n): it keeps only as much order as it needs to find the best element instantly.

### Storing the tree in an array

Because the tree is complete (no gaps), you can store it level by level in a plain array, with no node objects and no pointers:

```
Tree:                         Array (0-indexed):
              1               index:  0   1   2   3   4   5
            /   \             value: [1,  3,  2,  7,  4,  5]
          3       2
         / \     /             level 0: index 0
        7   4   5              level 1: indexes 1-2
                               level 2: indexes 3-5
```

Parent and child positions are computed with simple arithmetic:

| | 0-indexed (used in this guide) | 1-indexed (index 0 left unused) |
|---|---|---|
| Root | `0` | `1` |
| Left child of `i` | `2 * i + 1` | `2 * i` |
| Right child of `i` | `2 * i + 2` | `2 * i + 1` |
| Parent of `i` | `Math.floor((i - 1) / 2)` | `Math.floor(i / 2)` |
| Last element | `length - 1` | `length - 1` (the array has one unused slot) |
| Last parent (non-leaf) | `Math.floor((lastIdx - 1) / 2)` | `Math.floor(lastIdx / 2)` (lastIdx = last index of the array) |

Checking with the example: the node at index 1 (value 3) has children at indexes 3 and 4 (values 7 and 4), and its parent is `Math.floor((1 - 1) / 2) = 0` (value 1). ✔

**Which should you use?** The 0-indexed version works with a plain array and no wasted slot. The 1-indexed version has slightly simpler formulas, and many textbooks use it. Both are fine; just be consistent. The code below is 0-indexed, and its comments show what to change for 1-indexed.

### The two core moves

Every heap operation uses one of two repair moves. After a change, the tree still has the right *shape*, but one element may be in the wrong *place*. The two moves fix that.

**Sift up (bubble up).** Used after **inserting**.
The new element goes into the next free slot (the end of the array), which keeps the shape rule. It might be better than its parent, so compare it with its parent and swap while it is. Stop when it's no longer better than its parent, or when it reaches the root.

```
push(0) into [1, 3, 2, 7, 4, 5]:

Step 1: append at the end → [1, 3, 2, 7, 4, 5, 0]
              1
            /   \
          3       2
         / \     / \
        7   4   5   0   ← new, index 6; parent index = floor(5/2) = 2 (value 2)

Step 2: 0 < 2 → swap → [1, 3, 0, 7, 4, 5, 2]
              1
            /   \
          3       0     ← now index 2; parent index 0 (value 1)
         / \     / \
        7   4   5   2

Step 3: 0 < 1 → swap → [0, 3, 1, 7, 4, 5, 2]
              0         ← reached the root, stop
            /   \
          3       1
         / \     / \
        7   4   5   2
```

**Sift down (bubble down).** Used after **removing the root**.
You can't leave a hole at the root. Move the **last** element into the root (that keeps the shape), then repair: compare the element with **both** children, and swap it with the **better** child if that child is better than it. Repeat until neither child is better, or it has no children.

Why swap with the *better* of the two children? That child becomes the parent of the other child, so it must be better than both.

```
pop() on [1, 3, 2, 7, 4, 5]:

Step 1: save the root (1). Move the last element (5) to the root → [5, 3, 2, 7, 4]
              5
            /   \
          3       2
         / \
        7   4

Step 2: children of 5 are 3 and 2. The better (smaller) one is 2, and 2 < 5 → swap → [2, 3, 5, 7, 4]
              2
            /   \
          3       5     ← 5 is at index 2; its children would be at indexes 5 and 6, which don't exist → stop
         / \
        7   4

Returned 1. The heap is valid again.
```

### Heapify: building a heap from an existing array in O(n)

Often you already have all the elements up front (for example, "given an array, repeatedly take the smallest"). There are two ways to turn an array into a heap.

**Way 1: push the elements one by one.** Each push costs O(log n), so this is **O(n log n)**.

**Way 2: bottom-up heapify.** This is **O(n)**, and it's what the constructor below does. It's worth understanding, because interviewers like to ask *"how would you build the heap, and what does that cost?"*

**The idea.** Treat the array as a tree that doesn't satisfy the heap property yet. Every **leaf** is already a valid heap on its own, since it has no children to be out of order with. Leaves are the entire second half of the array. So start at the **last parent** and move backward to the root, calling **sift down** on each one. By the time you sift down a node, both of its subtrees are already valid heaps, so one sift-down fixes the whole subtree rooted at that node.

In code (n is the number of elements):

```typescript
// 0-indexed heap: the last parent is at Math.floor((lastIdx - 1) / 2), the root is at 0.
for (let i = Math.floor((lastIdx - 1) / 2); i >= 0; i--) {
  siftDown(i);
}

// 1-indexed heap: the last parent is at Math.floor(lastIdx / 2), the root is at 1.
for (let i = Math.floor(lastIdx / 2); i >= 1; i--) {
  siftDown(i);
}
```

**Worked example: heapify `[9, 5, 7, 1, 3, 8]` into a min-heap.**
lastIdx = 5, so the last parent is at index `Math.floor((5-1) / 2) = 2`.

```
Start:                       index: 0  1  2  3  4  5
              9               value: 9  5  7  1  3  8
            /   \
          5       7
         / \     /
        1   3   8

i = 2 (value 7): its only child is 8 (index 5). 7 < 8, so no swap.
              9
            /   \
          5       7   ✔ subtree ok
         / \     /
        1   3   8

i = 1 (value 5): children 1 (index 3) and 3 (index 4). The better one is 1, and 1 < 5 → swap.
              9               [9, 1, 7, 5, 3, 8]
            /   \
          1       7
         / \     /
        5   3   8             5 is now at index 3, which has no children → stop.

i = 0 (value 9): children 1 (index 1) and 7 (index 2). The better one is 1, and 1 < 9 → swap.
              1               [1, 9, 7, 5, 3, 8]
            /   \
          9       7
         / \     /
        5   3   8
    Continue sifting 9 down from index 1: children 5 and 3. The better one is 3, and 3 < 9 → swap.
              1               [1, 3, 7, 5, 9, 8]
            /   \
          3       7
         / \     /
        5   9   8             9 is now at index 4, which has no children → stop.

Result: [1, 3, 7, 5, 9, 8]. Every parent ≤ its children. ✔
```

**Why this is O(n) and not O(n log n).** Sift-down costs as much as the *height below* a node, not the height above it. Most nodes are near the bottom:
- About n/2 nodes are leaves, and we skip them (0 work).
- About n/4 nodes sit one level above the leaves and sift down at most 1 level.
- About n/8 nodes sift down at most 2 levels, and so on.

The total is n/4·1 + n/8·2 + n/16·3 + … which adds up to less than n. So it's O(n). Only a handful of nodes near the top pay the full log n cost. (This is a good point to raise at senior level.)

### The comparator

Instead of writing separate min-heap and max-heap classes, the heap takes a **comparator function** `compare(a, b)`, the same convention as `Array.prototype.sort`:

- `compare(a, b) < 0` means **`a` has higher priority**: it should come out before `b`.
- `compare(a, b) > 0` means `b` comes out first.
- `compare(a, b) === 0` means they're equal in priority.

So `(a, b) => a - b` gives a **min-heap** (smaller comes out first), and `(a, b) => b - a` gives a **max-heap**.

### Implementation

```ts
type Compare<T> = (a: T,b: T) => number;

class Heap<T> {
  private data: T[];
  private compare: Compare<T>;

  // compare(a, b) < 0 means `a` has higher priority (comes out first).
  // Pass initial items to build the heap in O(n) with heapify.
  constructor(compare: Compare<T>, items: T[] = []) {
    this.compare = compare;
    this.data = [...items]; // copy so we don't reorder the caller's array
    this.heapify();
  }

  // The best element, without removing it. O(1).
  peek(): T | undefined {
    return this.data[0]; // 1-indexed: this.data[1]
  }

  // Add an element. O(log n).
  push(value: T): void {
    this.data.push(value);                // keep the shape: fill the next free slot
    this.siftUp(this.data.length - 1);    // fix the order: move it up while it beats its parent
  }

  // Remove and return the best element. O(log n).
  pop(): T | undefined {
    if (this.data.length === 0) {
      return undefined;
    }

    const best = this.data[0];
    const last = this.data.pop()!;        // remove the last element...
    
    // With one original item, `pop()` already emptied the heap.
    if (this.data.length > 0) {
      this.data[0] = last;
    }

    // With two original items, one remains and is already a valid heap.
    if (this.data.length > 1) {
      this.siftDown(0);
    }

    // If the heap had one element, `last` WAS the root and the heap is now empty.
    return best;
  }

  // Bottom-up heapify: sift down every parent, from the last parent back to the root. O(n).
  private heapify(): void {
    const lastIdx = this.data.length - 1;
    const lastParentIdx = Math.floor((lastIdx - 1) / 2); // 1-indexed: Math.floor(lastIdx / 2)

    for (let parentIdx = lastParentIdx; parentIdx >= 0; parentIdx--) {  // 1-indexed: i >= 1
      this.siftDown(parentIdx);
    }
  }

  private siftUp(childIdx: number): void {
    while (childIdx > 0) {                           // 1-indexed: i > 1
      const parentIdx = Math.floor((childIdx - 1) / 2);     // 1-indexed: Math.floor(i / 2)
      
      if (this.compare(this.data[childIdx], this.data[parentIdx]) >= 0) {
        break; // not better than the parent: the order is correct
      }

      [this.data[childIdx], this.data[parentIdx]] = [this.data[parentIdx], this.data[childIdx]];

      childIdx = parentIdx;
    }
  }

  private siftDown(parentIdx: number): void {
    while (true) {
      const leftChildIdx = 2 * parentIdx + 1;        // 1-indexed: 2 * i
      const rightChildIdx = 2 * parentIdx + 2;      // 1-indexed: 2 * i + 1
      let bestIdx = parentIdx;

      // Find the best among the node and its (up to two) children.
      if (leftChildIdx < this.data.length && this.compare(this.data[leftChildIdx], this.data[bestIdx]) < 0) {
        bestIdx = leftChildIdx;
      }

      if (rightChildIdx < this.data.length && this.compare(this.data[rightChildIdx], this.data[bestIdx]) < 0) {
        bestIdx = rightChildIdx;
      }

      if (bestIdx === parentIdx) {
        break; // the node is better than both children: done
      }

      [this.data[parentIdx], this.data[bestIdx]] = [this.data[bestIdx], this.data[parentIdx]];

      parentIdx = bestIdx;
    }
  }

  // OPTIONAL CONVENIENCE METHODS

  get size(): number {
    return this.data.length;
  }

  isEmpty(): boolean {
    return this.data.length === 0;
  }

  // Internal heap order, not sorted order.
  toArray(): T[] {
    return [...this.data];
  }
}
```

**If you choose the 1-indexed version,** these are the changes. Start `data` with a placeholder at index 0 (for example `[undefined as T]`). Then `size` is `data.length - 1`, `isEmpty` checks `size === 0`, the root is `data[1]`, and in `pop` you compare against `1` instead of `0`. The index formulas and loop bounds are shown in the comments above.

### Using the heap

```typescript
// Min-heap of numbers: smallest first.
const minHeap = new Heap<number>((a, b) => a - b);
minHeap.push(5);
minHeap.push(1);
minHeap.push(3);
minHeap.pop(); // 1

// Max-heap of numbers: largest first.
const maxHeap = new Heap<number>((a, b) => b - a);

// Build from an existing array in O(n) (heapify).
const fromArray = new Heap<number>((a, b) => a - b, [9, 5, 7, 1, 3, 8]);
fromArray.peek(); // 1

// Tuples, e.g. [distance, node] in Dijkstra: smallest distance first.
const byDistance = new Heap<[number, number]>((a, b) => a[0] - b[0]);
byDistance.push([4, 2]);
byDistance.push([1, 7]);
byDistance.pop(); // [1, 7]

// Objects with a tie-break: higher frequency first, then alphabetical order.
const byFrequency = new Heap<{ word: string; freq: number }>((a, b) => {
  if (a.freq !== b.freq) {
    return b.freq - a.freq; // higher freq has higher priority
  }
  return a.word.localeCompare(b.word); // alphabetical for equal frequencies
});
```

### When to use a heap

The general signal is: **you repeatedly need the current smallest or largest element while the collection keeps changing.** If you only need it once, a single scan (O(n)) or a sort is enough. A heap pays off when items keep arriving and leaving.

- **Top k / kth element.** Examples: Kth Largest Element in an Array, Top K Frequent Elements, K Closest Points to Origin, Kth Largest Element in a Stream.
- **Merge k sorted sequences.** Examples: Merge k Sorted Lists, Find K Pairs with Smallest Sums, Kth Smallest Element in a Sorted Matrix. The heap holds the current front of each sequence.
- **Repeatedly combine or process the extreme element.** Examples: Last Stone Weight, Minimum Cost to Connect Sticks, Reorganize String, Task Scheduler.
- **Median or other running order statistics.** Example: Find Median from Data Stream (two heaps, below).
- **Scheduling and intervals.** Examples: Meeting Rooms II (a min-heap of end times), Single-Threaded CPU, IPO, Furthest Building You Can Reach.
- **Graph algorithms with weights.** Dijkstra's shortest path and Prim's minimum spanning tree both repeatedly pick the cheapest next step.

### Pattern: top k with a heap of size k

**Question:** find the k largest elements (or the kth largest) of n elements.

**Counterintuitive answer: use a *min*-heap, capped at size k.** Push each element. Whenever the heap grows past k, pop. What gets popped is the smallest element in the heap, which is the weakest candidate so far. At the end, the heap holds the k largest elements, and its root, the smallest of them, is the **kth largest**.

Why this beats sorting: the heap never holds more than k elements, so each operation costs O(log k). The total is **O(n log k)** time and **O(k)** space, versus O(n log n) for sorting. When k is much smaller than n, the difference is large. It also works on a **stream**, where you can't sort because the data never ends.

```ts
function findKthLargest(nums: number[], k: number): number {
  const heap = new Heap<number>((a, b) => a - b); // min-heap
  for (const num of nums) {
    heap.push(num);
    if (heap.size > k) {
      heap.pop(); // drop the smallest: it can't be in the top k
    }
  }
  return heap.peek()!; // the smallest of the k largest = the kth largest
}
```

### Design question: Find Median from Data Stream (two heaps)

This is LeetCode 295, a classic design question (commonly reported at Amazon, Google, Microsoft). Numbers arrive one by one, and at any time you must return the median.

**The idea.** Split the numbers into two halves:
- `low`: a **max-heap** holding the smaller half. Its root is the largest of the small numbers.
- `high`: a **min-heap** holding the larger half. Its root is the smallest of the large numbers.

Keep two invariants:
1. Every number in `low` is ≤ every number in `high`.
2. The sizes are balanced: `low.size === high.size` or `low.size === high.size + 1`.

Then the median sits at the heap roots: with an odd count it's `low.peek()`, and with an even count it's the average of the two roots.

```
Numbers so far: 5, 2, 8, 1, 9

low (max-heap):  [5, 2, 1]   root = 5
high (min-heap): [8, 9]      root = 8

Count is odd (5), so the median = low.peek() = 5
```

**Adding a number** takes three steps:
1. Push it into `low`.
2. Move `low`'s largest into `high`. This fixes invariant 1: the number might have belonged in the upper half.
3. If `high` is now bigger than `low`, move `high`'s smallest back into `low`. This fixes invariant 2.

```ts
class MedianFinder {
  private low = new Heap<number>((a, b) => b - a);  // max-heap: smaller half
  private high = new Heap<number>((a, b) => a - b); // min-heap: larger half

  addNum(num: number): void {
    this.low.push(num);
    this.high.push(this.low.pop()!); // keep every low ≤ every high
    if (this.high.size > this.low.size) {
      this.low.push(this.high.pop()!); // keep low the same size or one bigger
    }
  }

  findMedian(): number {
    if (this.low.size > this.high.size) {
      return this.low.peek()!;
    }
    return (this.low.peek()! + this.high.peek()!) / 2;
  }
}
```

`addNum` is O(log n) (a constant number of heap operations), `findMedian` is O(1), and space is O(n).

### Removing arbitrary elements: lazy deletion

A binary heap can't efficiently remove an element from the middle, because finding it takes O(n). When a problem needs removal (for example, a sliding window median where old elements leave the window), the standard technique is **lazy deletion**:

- Keep a `Map<value, count>` of elements that are "deleted but still physically in the heap".
- When you want to delete `x`, just increment its count in that map.
- Whenever you `peek` or `pop`, first discard any root elements that are marked as deleted, decrementing their counts.

Dijkstra's algorithm uses a relative of this idea. Instead of updating a node's distance inside the heap ("decrease-key"), you push a new `[distance, node]` pair, and when you pop a pair whose distance is worse than the best known distance for that node, you skip it as stale.

### Complexity

| Operation | Time | Why |
|---|---|---|
| `peek` | O(1) | The best element is always at the root |
| `push` | O(log n) | Sift up at most the tree's height, and a complete tree has height log n |
| `pop` | O(log n) | Sift down at most the tree's height |
| Build from n elements (heapify) | O(n) | Most nodes are near the bottom and move only a little |
| Build with n pushes | O(n log n) | n operations at O(log n) each |
| Search for / remove an arbitrary element | O(n) | The heap isn't sorted; use lazy deletion instead |
| Space | O(n) | One array slot per element |

### Common mistakes

- **Swapping with the wrong child in sift-down.** You must compare *both* children and swap with the better one. Swapping with the left child by default breaks the heap.
- **Forgetting the one-element case in `pop`.** After `data.pop()` removes the only element, don't write it back into index 0. The `if (this.data.length > 0)` guard handles this.
- **Getting the comparator backwards.** Remember that `a - b` means a min-heap. For "top k largest", the heap you want is a **min**-heap.
- **Comparator pitfalls.** `a - b` doesn't work for strings; use `a.localeCompare(b)`. If values can be `Infinity`, then `Infinity - Infinity` is `NaN`, and every comparison with `NaN` is false, which silently corrupts the heap. In that case, compare with `<` and `>` explicitly and return -1, 1 or 0.
- **Assuming the array is sorted.** Only `data[0]` is guaranteed to be the best. `data[1]` is **not** the second best.

### Remembering and explaining it

To rebuild it:
- *Push: add at the end, sift up.*
- *Pop: save the root, move the last element to the root, sift down (swapping with the better child).*
- *Index formulas (0-indexed): children `2i + 1` and `2i + 2`, parent `floor((i - 1) / 2)`.*
- *Heapify: sift down from the last parent back to the root.*

To explain it: *"JavaScript has no priority queue, so I'll write a binary heap backed by an array with a comparator. Push and pop are O(log n), peek is O(1), and building from an array is O(n) with bottom-up heapify."*

### LeetCode practice

1. [215. Kth Largest Element in an Array](https://leetcode.com/problems/kth-largest-element-in-an-array/)
2. [703. Kth Largest Element in a Stream](https://leetcode.com/problems/kth-largest-element-in-a-stream/)
3. [347. Top K Frequent Elements](https://leetcode.com/problems/top-k-frequent-elements/)
4. [973. K Closest Points to Origin](https://leetcode.com/problems/k-closest-points-to-origin/)
5. [295. Find Median from Data Stream](https://leetcode.com/problems/find-median-from-data-stream/)
6. [23. Merge k Sorted Lists](https://leetcode.com/problems/merge-k-sorted-lists/)
7. [373. Find K Pairs with Smallest Sums](https://leetcode.com/problems/find-k-pairs-with-smallest-sums/)
8. [502. IPO](https://leetcode.com/problems/ipo/)
9. [630. Course Schedule III](https://leetcode.com/problems/course-schedule-iii/)
10. [621. Task Scheduler](https://leetcode.com/problems/task-scheduler/)

---
## 9. Binary Tree and Binary Search Tree (BST)

### Mental model

A **binary tree** is a set of nodes where each node has at most two children, called `left` and `right`. The top node is the **root**, and nodes with no children are **leaves**. A binary tree has no ordering rule of its own.

A **binary search tree (BST)** is a binary tree with one extra rule, checked at **every** node:

> All values in the node's **left subtree** are smaller than the node, and all values in its **right subtree** are larger.

```
A valid BST:                          NOT a valid BST:
         8                                     8
       /   \                                 /   \
      3     10                              3     10
     / \      \                            / \
    1   6      14                         1   9    ← 9 > 3 is fine for its parent 3,
       / \                                            but 9 sits in 8's LEFT subtree,
      4   7                                           so it must be < 8. It isn't.
```

The right-hand example is the classic trap. Checking only "left child < parent < right child" isn't enough; the rule applies to **entire subtrees**.

**Why this rule is powerful:** at every node you know which side the target must be on, so a search throws away half of the remaining tree at each step (in a balanced tree). It's binary search, in tree form. And an **in-order traversal** (left subtree, node, right subtree) visits a BST's values in sorted order.

### When you'll see trees

- **The problem gives you a `TreeNode`.** That covers most tree problems: maximum depth, diameter, balanced check, lowest common ancestor, path sums, serialize/deserialize, level-order views. Those are traversal *algorithms*, so they're outside this guide, but they all use the node shape below.
- **BST-specific problems.** Examples: Validate BST, Kth Smallest in a BST, Lowest Common Ancestor of a BST, Insert/Delete in a BST, Convert Sorted Array to BST, BST Iterator.
- **"I need sorted data that changes": inserts, deletes, and "next larger / next smaller" lookups.** In Java you'd use a `TreeMap` (a self-balancing BST); in C++, a `std::set`. JavaScript has none. Section 14 covers what to do instead.

### The node

The exact shape LeetCode uses:

```ts
class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;

  constructor(val = 0, left: TreeNode | null = null, right: TreeNode | null = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}
```

### BST operations

#### Search

Start at the root. If the target is smaller, go left. If it's larger, go right. Stop when you find it or run out of tree.

```ts
function bstSearch(root: TreeNode | null, target: number): TreeNode | null {
  let current = root;
  while (current !== null && current.val !== target) {
    if (target < current.val) {
      current = current.left;
    } else {
      current = current.right;
    }
  }
  return current; // the matching node, or null if not found
}
```

Searching for 7 in the valid BST above: 8 (7 < 8, go left) → 3 (7 > 3, go right) → 6 (7 > 6, go right) → 7, found.

#### Insert

A new value always becomes a **new leaf**. Walk down exactly as in search, and when you reach an empty spot (`null`), that's where the value belongs.

The recursive version follows a pattern worth memorizing, because insert and delete both use it: **"recurse into the correct side, assign the result back to that child, and return the current node."**

- The base case `if (root === null) return new TreeNode(val)` creates the leaf.
- The assignment `root.left = bstInsert(root.left, val)` attaches it to its parent automatically. For all the nodes above, it simply reassigns the same child they already had.
- Returning `root` lets the caller keep its reference. For an empty tree, the new node *becomes* the root.

```ts
function bstInsert(root: TreeNode | null, val: number): TreeNode {
  if (root === null) {
    return new TreeNode(val); // found the empty spot
  }
  if (val < root.val) {
    root.left = bstInsert(root.left, val);
  } else {
    root.right = bstInsert(root.right, val); // duplicates go right (clarify this with the interviewer)
  }
  return root;
}
```

```typescript
// Usage: always reassign root, because inserting into an empty tree creates the root.
let root: TreeNode | null = null;
for (const value of [8, 3, 10, 1, 6]) {
  root = bstInsert(root, value);
}
```

#### Delete

Deletion is the one BST operation with real cases. First find the node, using the same "recurse into the correct side, reassign" pattern. Then there are three situations:

```
Case 1: leaf (no children)       → just remove it (return null to the parent)

Case 2: one child                → replace the node with its only child
          5                                5
         / \        delete 3              / \
        3   8         ───→               4   8
         \
          4

Case 3: two children             → the tricky one
```

**Case 3.** If you remove a node that has two children, something has to take its place, and that value must still be larger than everything on the left and smaller than everything on the right. The value that fits is the node's **in-order successor**: the **smallest value in its right subtree**. To find it, go right once, then go left as far as possible.

So: copy the successor's value into the node, then delete the successor from the right subtree. The successor has no left child (otherwise it wouldn't be the smallest), so deleting it is always Case 1 or Case 2.

```
Delete 3 (it has two children):
         8                        8                        8
       /   \                    /   \                    /   \
      3     10     copy 4      4     10     delete the  4     10
     / \      \    into 3's   / \      \    old 4 from / \      \
    1   6      14  node ───→ 1   6      14  the right  1   6      14
       / \                      / \         subtree ─→      \
      4   7                    4   7                         7

Successor of 3: go right once (6), then left as far as possible (4). So the successor is 4.
```

```ts
function bstDelete(root: TreeNode | null, key: number): TreeNode | null {
  if (root === null) {
    return null; // key not found
  }

  if (key < root.val) {
    root.left = bstDelete(root.left, key);
  } else if (key > root.val) {
    root.right = bstDelete(root.right, key);
  } else {
    // Found the node to delete.
    // Cases 1 and 2: zero or one child. Return the other side to the parent.
    if (root.left === null) {
      return root.right;
    }
    if (root.right === null) {
      return root.left;
    }

    // Case 3: two children. Find the in-order successor (smallest value in the right subtree).
    let successor = root.right;
    while (successor.left !== null) {
      successor = successor.left;
    }
    root.val = successor.val;                          // copy the successor's value here
    root.right = bstDelete(root.right, successor.val); // then delete the successor below
  }

  return root;
}
```

Notice that `if (root.left === null) return root.right;` covers **both** Case 1 (for a leaf, `root.right` is also `null`) and half of Case 2.

### Helper: building a tree from LeetCode's array format

LeetCode writes trees as level-order arrays with `null` for missing children. For example, `[3, 9, 20, null, null, 15, 7]` is:

```
      3
     / \
    9   20
       /  \
      15   7
```

When you can run code, this helper turns such an array into a tree so you can test your solution. It fills children level by level, using the queue-with-head-index idea from Section 2.

```ts
function buildTree(values: (number | null)[]): TreeNode | null {
  if (values.length === 0 || values[0] === null) {
    return null;
  }

  const root = new TreeNode(values[0]);
  const nodesToFill: TreeNode[] = [root]; // queue of nodes waiting for children
  let head = 0;
  let i = 1; // next value to place

  while (head < nodesToFill.length && i < values.length) {
    const node = nodesToFill[head];
    head++;

    const leftValue = values[i];
    i++;
    if (leftValue !== null && leftValue !== undefined) {
      node.left = new TreeNode(leftValue);
      nodesToFill.push(node.left);
    }

    const rightValue = values[i];
    i++;
    if (rightValue !== null && rightValue !== undefined) {
      node.right = new TreeNode(rightValue);
      nodesToFill.push(node.right);
    }
  }

  return root;
}
```

### Balanced vs. unbalanced

A BST's speed depends on its **height** (h), the number of levels from the root to the deepest leaf.

```
Balanced (inserted 4, 2, 6, 1, 3, 5, 7):     Degenerate (inserted 1, 2, 3, 4 in sorted order):
           4                                   1
         /   \                                  \
        2     6                                  2
       / \   / \                                  \
      1   3 5   7                                  3
                                                    \
   height ≈ log n                                    4     height = n, just a linked list
```

A plain BST doesn't rebalance itself. If values arrive in sorted order, it degenerates into a linked list, and every operation becomes O(n). Self-balancing BSTs (AVL trees, red-black trees) fix this with rotations. You are **almost never asked to implement them in an interview**, but you should know they exist and that they guarantee O(log n).

### Complexity

| Operation | Balanced tree | Degenerate tree | Why |
|---|---|---|---|
| Search | O(log n) | O(n) | One step per level: O(h) |
| Insert | O(log n) | O(n) | Walk down to a leaf position: O(h) |
| Delete | O(log n) | O(n) | Find the node plus find the successor, both O(h) |
| Min / max | O(log n) | O(n) | Walk to the far left or far right |
| Space | O(n) for the nodes | | Recursive operations also use O(h) call-stack space |

### Common mistakes

- **Validating a BST by comparing each node only with its direct children.** The rule is about whole subtrees. Pass down a valid range `(min, max)` as you recurse.
- **Forgetting to reassign the result of a recursive insert/delete** (`root.left = bstInsert(...)`). Without it, the new node is never attached.
- **Forgetting to reassign `root` at the call site.** Inserting into an empty tree, or deleting the root, returns a *different* root.
- **Duplicates.** Clarify with the interviewer: not allowed, go left, or go right? Pick one and be consistent.
- **Deep recursion on skewed trees.** With about 10⁴ or more nodes in a line, recursion can exceed the call stack. Mention that iterative versions exist.

### Remembering and explaining it

To rebuild it:
- *Search: go left if smaller, right if larger.*
- *Insert and delete: recurse into the correct side, reassign the child, return the node.*
- *Delete with two children: copy the successor (right once, then all the way left), then delete the successor.*

To explain it: *"In a BST, everything left of a node is smaller and everything right is larger, so each comparison discards a subtree. Operations cost O(h): O(log n) if balanced, O(n) in the worst case."*

### LeetCode practice

1. [104. Maximum Depth of Binary Tree](https://leetcode.com/problems/maximum-depth-of-binary-tree/)
2. [226. Invert Binary Tree](https://leetcode.com/problems/invert-binary-tree/)
3. [94. Binary Tree Inorder Traversal](https://leetcode.com/problems/binary-tree-inorder-traversal/)
4. [102. Binary Tree Level Order Traversal](https://leetcode.com/problems/binary-tree-level-order-traversal/)
5. [98. Validate Binary Search Tree](https://leetcode.com/problems/validate-binary-search-tree/)
6. [230. Kth Smallest Element in a BST](https://leetcode.com/problems/kth-smallest-element-in-a-bst/)
7. [235. Lowest Common Ancestor of a Binary Search Tree](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/)
8. [450. Delete Node in a BST](https://leetcode.com/problems/delete-node-in-a-bst/)
9. [105. Construct Binary Tree from Preorder and Inorder Traversal](https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/)
10. [297. Serialize and Deserialize Binary Tree](https://leetcode.com/problems/serialize-and-deserialize-binary-tree/)

---

## 10. Trie (Prefix Tree)

### Mental model

A trie (pronounced "try", from re*trie*val) stores a set of strings as a tree where **each edge is one character**. Following edges from the root spells out a string. Words that share a prefix share the same path, and they only branch apart where they differ.

Each node also has a flag, `isEnd`, that marks **"a complete word ends here"**. It's needed because a path can be a prefix of a word without being a word itself.

```
Words inserted: "car", "cat", "cart", "dog"

            (root)
            /    \
           c      d
           |      |
           a      o
          / \     |
         r*  t*   g*
         |
         t*

* = isEnd (a complete word ends at this node)

"car"  → root → c → a → r   (isEnd ✔) → a word
"ca"   → root → c → a       (isEnd ✘) → only a prefix, not a word
"cart" → root → c → a → r → t (isEnd ✔) → a word; it shares "car" with another word
"cab"  → root → c → a → (no 'b' child) → not present at all
```

### Why not just use a `Set<string>`?

A `Set` answers "is this exact word present?" in O(L) (hashing a string of length L). But it can't efficiently answer **"is there any word that starts with this prefix?"** or **"which words start with this prefix?"**. You'd have to check every word, which is O(total length of all words).

A trie answers prefix questions in **O(L)**, independent of how many words are stored, because the prefix is just a path from the root.

### When to use a trie

The general signal is **prefixes**, or **searching for many words at once**.

- **Prefix queries.** Examples: Implement Trie (LeetCode 208), autocomplete, Search Suggestions System, "starts with" checks.
- **Searching many words in a grid or text at once.** Example: Word Search II (LeetCode 212, a well-known hard problem). Instead of running a separate search for each word, you build a trie of all the words and walk the grid once, following trie edges. When a path in the grid has no trie edge, you stop early, because no word continues that way.
- **Dictionary word problems.** Examples: Replace Words (shortest root), Longest Word in Dictionary, Word Break (a trie can speed up the dictionary lookups).
- **Wildcard search.** Example: Design Add and Search Words Data Structure (LeetCode 211), where `.` matches any character. At a `.`, you try every child.
- **Maximum XOR of two numbers.** Example: LeetCode 421. This uses a *binary* trie: each number is inserted as its binary digits from most significant to least, and each node has at most two children, "0" and "1".

### How the operations work

**Insert(word):** start at the root. For each character, if the current node has no child for it, create one. Then move to that child. After the last character, mark the node with `isEnd = true`.

**Walk(string):** start at the root and follow one child per character. If a child is missing, return `null`, since the path doesn't exist. Otherwise return the node where the string ends.

Both lookups use Walk:
- **search(word):** walk the word, then check that the final node has `isEnd === true`.
- **startsWith(prefix):** walk the prefix, and check only that the path exists.

### Implementation

```ts
class TrieNode {
  children = new Map<string, TrieNode>(); // character → child node
  isEnd = false;                          // true if a complete word ends here
}

class Trie {
  private root = new TrieNode(); // the root represents the empty string

  insert(word: string): void {
    let node = this.root;
    for (const char of word) {
      let child = node.children.get(char);
      if (child === undefined) {
        child = new TrieNode();
        node.children.set(char, child);
      }
      node = child;
    }
    node.isEnd = true;
  }

  // Is this exact word stored?
  search(word: string): boolean {
    const node = this.walk(word);
    return node !== null && node.isEnd;
  }

  // Is there any stored word that starts with this prefix?
  startsWith(prefix: string): boolean {
    return this.walk(prefix) !== null;
  }

  // Follow the path for `text`. Returns the final node, or null if the path breaks.
  private walk(text: string): TrieNode | null {
    let node = this.root;
    for (const char of text) {
      const child = node.children.get(char);
      if (child === undefined) {
        return null;
      }
      node = child;
    }
    return node;
  }
}
```

**Trace** for inserting `"car"` and then `"cat"`:

| Step | Action |
|---|---|
| insert "car", `c` | root has no `c` → create it, move there |
| insert "car", `a` | `c` has no `a` → create it, move there |
| insert "car", `r` | `a` has no `r` → create it, move there. End of word: `r.isEnd = true` |
| insert "cat", `c` | root **has** `c` → just move there (shared prefix) |
| insert "cat", `a` | `c` **has** `a` → just move there |
| insert "cat", `t` | `a` has no `t` → create it. End of word: `t.isEnd = true` |
| `search("ca")` | walk reaches the `a` node, whose `isEnd` is false → **false** |
| `startsWith("ca")` | walk reaches the `a` node, so the path exists → **true** |

### Useful variations

**Counting words with a given prefix.** Add a `prefixCount` to each node and increment it along the path during insert. Then "how many stored words start with this prefix?" becomes: walk the prefix, and read `prefixCount` at the node where it ends (or return 0 if the path breaks). This is the core of Implement Trie II (LeetCode 1804) and of autocomplete ranking.

```ts
class CountingTrieNode {
  children = new Map<string, CountingTrieNode>();
  isEnd = false;
  prefixCount = 0; // number of inserted words that pass through this node
}

class CountingTrie {
  private root = new CountingTrieNode();

  insert(word: string): void {
    let node = this.root;
    for (const char of word) {
      let child = node.children.get(char);
      if (child === undefined) {
        child = new CountingTrieNode();
        node.children.set(char, child);
      }
      node = child;
      node.prefixCount++; // one more word passes through here
    }
    node.isEnd = true;
  }

  countWordsWithPrefix(prefix: string): number {
    let node = this.root;
    for (const char of prefix) {
      const child = node.children.get(char);
      if (child === undefined) {
        return 0;
      }
      node = child;
    }
    return node.prefixCount;
  }
}
```

**Storing the whole word at its end node.** In Word Search II, instead of `isEnd: boolean`, store `word: string | null` at the node where the word ends. When your grid search reaches that node, you have the word immediately, without rebuilding it from the path. Set it back to `null` after you report it, so the same word isn't reported twice.

**Array children instead of a `Map`.** If the alphabet is fixed (for example, only lowercase `a`–`z`), each node can hold an array of 26 slots. The index of a character is `char.charCodeAt(0) - 97` (97 is the character code of `'a'`). This is a bit faster and uses less memory per node, but the `Map` version is simpler and works for any characters. Use the `Map` version unless performance is raised.

```ts
class ArrayTrieNode {
  children: (ArrayTrieNode | null)[] = new Array(26).fill(null);
  isEnd = false;
}

function childIndex(char: string): number {
  return char.charCodeAt(0) - 97; // 'a' → 0, 'b' → 1, ..., 'z' → 25
}
```

### Complexity

Let L be the length of the word or prefix.

| Operation | Time | Why |
|---|---|---|
| `insert` | O(L) | One step per character |
| `search` / `startsWith` | O(L) | One step per character, independent of how many words are stored |
| Space | O(total characters of all inserted words) in the worst case | Shared prefixes are stored once, so it's often much less |

### Common mistakes

- **Treating "the path exists" as "the word exists".** `search("ca")` must be false if only `"car"` was inserted. That's the reason `isEnd` exists.
- **Forgetting to set `isEnd` at the end of `insert`.**
- **Creating a new child even when one already exists.** That would overwrite a shared prefix and lose words.

### Remembering and explaining it

To rebuild it: *"Walk the characters, create what's missing, mark the end. One `walk` helper powers both `search` (which also checks `isEnd`) and `startsWith`."*

To explain it: *"A trie shares common prefixes, so prefix lookups cost O(length of the prefix) no matter how many words are stored."*

### LeetCode practice

1. [208. Implement Trie (Prefix Tree)](https://leetcode.com/problems/implement-trie-prefix-tree/)
2. [211. Design Add and Search Words Data Structure](https://leetcode.com/problems/design-add-and-search-words-data-structure/)
3. [648. Replace Words](https://leetcode.com/problems/replace-words/)
4. [676. Implement Magic Dictionary](https://leetcode.com/problems/implement-magic-dictionary/)
5. [1268. Search Suggestions System](https://leetcode.com/problems/search-suggestions-system/)
6. [212. Word Search II](https://leetcode.com/problems/word-search-ii/)
7. [421. Maximum XOR of Two Numbers in an Array](https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array/)
8. [1804. Implement Trie II (Prefix Tree)](https://leetcode.com/problems/implement-trie-ii-prefix-tree/)

---

## 11. Graph

Graphs are among the most important interview topics. Many problems that don't *mention* graphs are graph problems underneath: course prerequisites, flight routes, friend networks, word transformations, grids. This section is about **representing** graphs, meaning turning the input into a structure you can work with. Traversals (BFS, DFS) and graph algorithms are outside the scope of this guide, but every one of them starts with the representation you build here.

### Vocabulary

| Term | Meaning | Example |
|---|---|---|
| **Vertex (node)** | A thing | A person, a city, a course, a grid cell |
| **Edge** | A connection between two vertices | A friendship, a flight, a prerequisite |
| **Undirected** | Edges go both ways | Friendship: if A is friends with B, B is friends with A |
| **Directed** | Edges have a direction (u → v) | "Course A must be taken before course B"; a one-way flight |
| **Weighted** | Each edge has a number (cost, distance, time) | A flight's price |
| **Neighbors** | The vertices directly connected to a vertex | |
| **Degree** | Number of edges touching a vertex | In directed graphs: **in-degree** (edges coming in) and **out-degree** (edges going out) |
| **Cycle** | A path that returns to its start | A → B → C → A |
| **DAG** | Directed Acyclic Graph: directed, with no cycles | Course prerequisites that can actually be completed |
| **Connected component** | A group of vertices all reachable from each other | Separate friend circles |
| **Sparse / dense** | Few edges (E close to V) / many edges (E close to V²) | Road networks are sparse |

V is the number of vertices and E the number of edges. Complexity for graphs is written in terms of both.

### How graphs appear in interview inputs

Recognizing the input format is half the work. The common forms are:

**1. An edge list plus a vertex count.**
`n = 4, edges = [[0, 1], [1, 2], [2, 0], [2, 3]]`
Examples: Number of Connected Components, Graph Valid Tree, Redundant Connection, Find if Path Exists.

**2. Prerequisite or dependency pairs.**
`numCourses = 4, prerequisites = [[1, 0], [2, 0], [3, 1], [3, 2]]`, where `[a, b]` means "to take a, you must first take b", so the edge is **b → a**.
Examples: Course Schedule I/II, Alien Dictionary (you derive the edges yourself), Parallel Courses.

**3. Weighted edges.**
`times = [[2, 1, 1], [2, 3, 1], [3, 4, 1]]` (from, to, weight)
Examples: Network Delay Time, Cheapest Flights Within K Stops, Path with Maximum Probability.

**4. Labeled vertices (strings).**
`tickets = [["JFK", "SFO"], ["JFK", "ATL"], ["SFO", "ATL"]]`, or `equations = [["a", "b"]], values = [2.0]`.
Examples: Reconstruct Itinerary, Evaluate Division, Accounts Merge.

**5. An adjacency list already given.**
`graph = [[1, 2], [0, 2], [0, 1]]`, where `graph[i]` lists the neighbors of vertex i.
Examples: Is Graph Bipartite, All Paths From Source to Target.

**6. A grid.** Each cell is a vertex, and its up/down/left/right neighbors are its edges.
Examples: Number of Islands, Rotting Oranges, Pacific Atlantic Water Flow, Shortest Path in Binary Matrix.

**7. An implicit graph.** The vertices and edges aren't listed. They're defined by a rule.
Examples: Word Ladder (words are vertices; two words are connected if they differ by one letter), Open the Lock (each 4-digit combination is a vertex; turning one wheel one step is an edge), Minimum Genetic Mutation.

**8. Node objects.**
```typescript
class GraphNode {
  val: number;
  neighbors: GraphNode[];
  constructor(val = 0, neighbors: GraphNode[] = []) {
    this.val = val;
    this.neighbors = neighbors;
  }
}
```
Example: Clone Graph, where the graph is given as a reference to one node.

### The three representations

Consider this undirected graph:

```
    0 ─── 1
    │   ╱
    │  ╱
    2 ─── 3

edges = [[0, 1], [0, 2], [1, 2], [2, 3]]
```

**Adjacency list.** For each vertex, the list of its neighbors:
```
0 → [1, 2]
1 → [0, 2]
2 → [0, 1, 3]
3 → [2]
```

**Adjacency matrix.** A V × V grid where `matrix[u][v] = 1` if there is an edge u–v:
```
     0  1  2  3
0  [ 0, 1, 1, 0 ]
1  [ 1, 0, 1, 0 ]
2  [ 1, 1, 0, 1 ]
3  [ 0, 0, 1, 0 ]
```

**Edge list.** Just the edges, as given: `[[0, 1], [0, 2], [1, 2], [2, 3]]`.

| | Adjacency list | Adjacency matrix | Edge list |
|---|---|---|---|
| Space | O(V + E) | O(V²) | O(E) |
| "Is there an edge u–v?" | O(degree of u), or O(1) with a `Set` | O(1) | O(E) |
| "List the neighbors of u" | O(degree of u) | O(V): scan a whole row | O(E) |
| Best for | **Almost everything: the default** | Small, dense graphs; frequent edge lookups | Algorithms that process edges one by one (Kruskal's MST, Bellman-Ford) |

**Why the adjacency list is the default:** traversals ask "what are my neighbors?" over and over. An adjacency list answers in time proportional to the actual number of neighbors. Most interview graphs are sparse, so a matrix would waste O(V²) memory and time scanning empty cells. With V = 10⁵, a matrix would need 10¹⁰ cells, which isn't possible.

### Why a `Map` for the adjacency list

You'll see two styles: an array of arrays (`number[][]`, indexed by vertex number) and a `Map` from vertex to neighbors. This guide prefers the `Map`:

- **It works for any vertex type.** Strings (`"JFK"`), numbers that aren't 0…n-1 (IDs like 1042, 58812), or coordinates encoded as keys. An array only works for dense integer IDs.
- **You don't need to know the vertex count in advance.** Vertices are added as you see them.
- **One pattern for every problem.** The same builder code handles numbered, labeled and weighted graphs.
- **A plain object `{}` is a worse choice.** Its keys are always converted to strings, so the number `1` and the string `"1"` collide. It also comes with inherited properties like `constructor`. A `Map` has neither problem.

When vertices are exactly `0 … n-1`, an array of arrays works just as well and is slightly faster. The difference is minor, so choose whichever makes the code clearer.

### Building an adjacency list

**Undirected, unweighted.** Add each edge in **both** directions:

```ts
function buildUndirectedGraph<T>(edges: [T, T][]): Map<T, T[]> {
  const graph = new Map<T, T[]>();

  for (const [u, v] of edges) {
    if (!graph.has(u)) {
      graph.set(u, []);
    }
    if (!graph.has(v)) {
      graph.set(v, []);
    }
    graph.get(u)!.push(v); // u → v
    graph.get(v)!.push(u); // v → u  (undirected: both directions)
  }

  return graph;
}
```

```typescript
const friends = buildUndirectedGraph<string>([
  ["alice", "bob"],
  ["bob", "carol"],
  ["dave", "erin"],
]);
// alice → [bob]
// bob   → [alice, carol]
// carol → [bob]
// dave  → [erin]
// erin  → [dave]
// Two separate friend circles (connected components): {alice, bob, carol} and {dave, erin}.
```

**Don't lose isolated vertices.** A vertex with no edges never appears in the edge list, so the builder above never adds it to the map. In problems like "count connected components among n vertices", each isolated vertex is its own component and must be counted. When you know the vertex set, initialize every vertex first:

```ts
function buildUndirectedGraphWithVertices(n: number, edges: [number, number][]): Map<number, number[]> {
  const graph = new Map<number, number[]>();

  // Make sure every vertex 0..n-1 exists, even if it has no edges.
  for (let vertex = 0; vertex < n; vertex++) {
    graph.set(vertex, []);
  }

  for (const [u, v] of edges) {
    graph.get(u)!.push(v);
    graph.get(v)!.push(u);
  }

  return graph;
}
```

```typescript
const graph = buildUndirectedGraphWithVertices(5, [[0, 1], [1, 2], [3, 4]]);
// 0 → [1]    1 → [0, 2]    2 → [1]    3 → [4]    4 → [3]
```

**Directed.** Add each edge in **one** direction only. For dependency problems, you usually also need each vertex's **in-degree** (how many edges point *into* it). Topological sort starts from the vertices with in-degree 0: the tasks with no remaining prerequisites.

```ts
function buildDirectedGraph(
  n: number,
  edges: [number, number][], // [from, to]
): { graph: Map<number, number[]>; inDegree: Map<number, number> } {
  const graph = new Map<number, number[]>();
  const inDegree = new Map<number, number>();

  for (let vertex = 0; vertex < n; vertex++) {
    graph.set(vertex, []);
    inDegree.set(vertex, 0);
  }

  for (const [from, to] of edges) {
    graph.get(from)!.push(to);                // one direction only
    inDegree.set(to, inDegree.get(to)! + 1);  // one more edge points into `to`
  }

  return { graph, inDegree };
}
```

**Worked example: Course Schedule.**
`numCourses = 4, prerequisites = [[1, 0], [2, 0], [3, 1], [3, 2]]`

Read the pairs carefully. `[1, 0]` means "to take course 1, you must first take course 0", so the edge goes **0 → 1** (from the prerequisite to the course it unlocks). Reversing the pair is the most common bug in this problem family.

```typescript
const prerequisites: [number, number][] = [[1, 0], [2, 0], [3, 1], [3, 2]];

// Convert [course, prerequisite] into edges [prerequisite, course].
const edges: [number, number][] = prerequisites.map(
  ([course, prerequisite]) => [prerequisite, course],
);

const { graph, inDegree } = buildDirectedGraph(4, edges);
```

Result:

```
     0
    ↙ ↘
   1   2          graph:     0 → [1, 2]    1 → [3]    2 → [3]    3 → []
    ↘ ↙
     3            inDegree:  0: 0          1: 1       2: 1       3: 2

Course 0 has in-degree 0: it has no prerequisites, so you can take it first.
Course 3 has in-degree 2: it needs both 1 and 2.
```

**Weighted.** Store each neighbor together with the edge's weight. An object `{ to, weight }` is more readable than a tuple `[to, weight]`, since you never have to remember which index is which.

```ts
type WeightedEdge<T> = { to: T; weight: number };

function buildWeightedDirectedGraph<T>(edges: [T, T, number][]): Map<T, WeightedEdge<T>[]> {
  const graph = new Map<T, WeightedEdge<T>[]>();

  for (const [from, to, weight] of edges) {
    if (!graph.has(from)) {
      graph.set(from, []);
    }
    if (!graph.has(to)) {
      graph.set(to, []); // include destinations even if they have no outgoing flights
    }
    graph.get(from)!.push({ to, weight });
  }

  return graph;
}
```

```typescript
// Example: flights with prices.
const flights = buildWeightedDirectedGraph<string>([
  ["IST", "LHR", 180],
  ["IST", "CDG", 150],
  ["CDG", "LHR", 60],
  ["LHR", "JFK", 400],
]);
// IST → [{ to: "LHR", weight: 180 }, { to: "CDG", weight: 150 }]
// CDG → [{ to: "LHR", weight: 60 }]
// LHR → [{ to: "JFK", weight: 400 }]
// JFK → []
//
// Two routes lead from IST to LHR: direct (180) and via CDG (150 + 60 = 210).
// The direct flight is cheaper, even though the first leg via CDG looked cheaper.
// That's why weighted problems need algorithms that compare whole paths, like Dijkstra.
```

For an **undirected** weighted graph (for example, roads), push `{ to: v, weight }` into `u`'s list **and** `{ to: u, weight }` into `v`'s list.

**Sets instead of arrays for neighbors.** Use `Map<T, Set<T>>` when you need to:
- check "is u connected to v?" in O(1),
- remove edges (for example, repeatedly removing leaves in Minimum Height Trees), or
- ignore duplicate edges in the input automatically.

### A Graph class

For design-style questions, or when a problem adds and removes edges over time, a small class keeps the code organized. It uses `Map<T, Set<T>>`, so every basic operation is O(1).

```ts
class Graph<T> {
  private adjacency = new Map<T, Set<T>>();
  private directed: boolean;

  constructor(directed = false) {
    this.directed = directed;
  }

  addVertex(vertex: T): void {
    if (!this.adjacency.has(vertex)) {
      this.adjacency.set(vertex, new Set());
    }
  }

  addEdge(from: T, to: T): void {
    this.addVertex(from);
    this.addVertex(to);
    this.adjacency.get(from)!.add(to);
    if (!this.directed) {
      this.adjacency.get(to)!.add(from);
    }
  }

  removeEdge(from: T, to: T): void {
    this.adjacency.get(from)?.delete(to);
    if (!this.directed) {
      this.adjacency.get(to)?.delete(from);
    }
  }

  hasEdge(from: T, to: T): boolean {
    return this.adjacency.get(from)?.has(to) ?? false;
  }

  neighbors(vertex: T): T[] {
    return [...(this.adjacency.get(vertex) ?? [])];
  }

  vertices(): T[] {
    return [...this.adjacency.keys()];
  }

  degree(vertex: T): number {
    return this.adjacency.get(vertex)?.size ?? 0; // out-degree if directed
  }
}
```

```typescript
const network = new Graph<string>(); // undirected
network.addEdge("alice", "bob");
network.addEdge("bob", "carol");

network.hasEdge("bob", "alice"); // true: undirected, so both directions exist
network.neighbors("bob");        // ["alice", "carol"]
network.degree("bob");           // 2

network.removeEdge("alice", "bob");
network.hasEdge("alice", "bob"); // false
```

### Adjacency matrix

Use one when V is small (roughly up to 1,000) and the graph is dense, or when you need O(1) edge lookups everywhere. Floyd-Warshall (all-pairs shortest paths) is the classic algorithm that works directly on a matrix.

```ts
function buildAdjacencyMatrix(n: number, edges: [number, number][], directed = false): boolean[][] {
  // Array.from creates a NEW inner array for each row (see the mistakes below).
  const matrix: boolean[][] = Array.from({ length: n }, () => new Array<boolean>(n).fill(false));

  for (const [u, v] of edges) {
    matrix[u][v] = true;
    if (!directed) {
      matrix[v][u] = true;
    }
  }

  return matrix;
}
```

For weighted graphs, store the weight instead of `true`, and use `Infinity` for "no edge".

### Grids as implicit graphs

In a grid, every cell `(row, col)` is a vertex, and its neighbors are the adjacent cells: up, down, left, right, and sometimes the 4 diagonals too. **Don't build an adjacency list for a grid.** It would just copy information you can compute on the spot. Instead, generate neighbors when you need them, with a direction list and a bounds check.

```
Direction offsets [rowChange, colChange]:

            (-1, 0)
               ↑
   (0, -1) ← cell → (0, +1)
               ↓
            (+1, 0)
```

```ts
const DIRECTIONS: [number, number][] = [
  [-1, 0], // up
  [1, 0],  // down
  [0, -1], // left
  [0, 1],  // right
];

function gridNeighbors(rows: number, cols: number, row: number, col: number): [number, number][] {
  const result: [number, number][] = [];

  for (const [rowChange, colChange] of DIRECTIONS) {
    const nextRow = row + rowChange;
    const nextCol = col + colChange;
    const insideGrid = nextRow >= 0 && nextRow < rows && nextCol >= 0 && nextCol < cols;
    if (insideGrid) {
      result.push([nextRow, nextCol]);
    }
  }

  return result;
}
```

```typescript
// A 3 × 3 grid:
gridNeighbors(3, 3, 0, 0); // [[1, 0], [0, 1]]                  corner: 2 neighbors
gridNeighbors(3, 3, 1, 1); // [[0, 1], [2, 1], [1, 0], [1, 2]]  center: 4 neighbors
```

For 8-directional movement (for example, Shortest Path in Binary Matrix), add the four diagonals: `[-1, -1], [-1, 1], [1, -1], [1, 1]`.

**Turning a cell into a single key.** You'll often need to store cells in a `Set` (visited) or a `Map` (distances). Arrays can't be used as keys directly: `[1, 2]` and another `[1, 2]` are different objects. Two options:

```typescript
const cols = 5;
const row = 1;
const col = 2;

// Option 1: a number (fast). Each cell gets a unique id from 0 to rows * cols - 1.
const id = row * cols + col;            // 1 * 5 + 2 = 7
const backToRow = Math.floor(id / cols); // 1
const backToCol = id % cols;             // 2

// Option 2: a string (simple and readable, but slower).
const key = `${row},${col}`;             // "1,2"
```

### Implicit graphs defined by a rule

Sometimes the vertices are all the values that *could* exist, and the edges follow a rule. Building the full graph up front could be enormous or wasteful. Instead, write a function that **generates the neighbors of one vertex on demand**. Your traversal then calls it exactly where it would otherwise read an adjacency list.

**Example: Open the Lock (LeetCode 752).** The lock has 4 wheels with digits 0–9. Each move turns one wheel one step up or down (9 wraps around to 0). Every 4-digit string is a vertex, and each has exactly 8 neighbors.

```ts
function lockNeighbors(combination: string): string[] {
  const result: string[] = [];

  for (let wheel = 0; wheel < 4; wheel++) {
    const digit = Number(combination[wheel]);
    for (const change of [1, -1]) {
      const newDigit = (digit + change + 10) % 10; // +10 keeps it non-negative: 0 - 1 → 9
      const neighbor =
        combination.slice(0, wheel) + String(newDigit) + combination.slice(wheel + 1);
      result.push(neighbor);
    }
  }

  return result;
}
```

```typescript
lockNeighbors("0000");
// ["1000", "9000", "0100", "0900", "0010", "0090", "0001", "0009"]
```

**Example: Word Ladder (LeetCode 127).** Words are vertices, and two words are connected if they differ in exactly one letter. Comparing every pair of words is O(N² · L). A standard trick groups words by **patterns** with one letter replaced by `*`. Two words are neighbors exactly when they share a pattern.

```
"hot" → patterns "*ot", "h*t", "ho*"
"dot" → patterns "*ot", "d*t", "do*"
"hit" → patterns "*it", "h*t", "hi*"

"*ot" groups ["hot", "dot"]  → hot and dot are neighbors
"h*t" groups ["hot", "hit"]  → hot and hit are neighbors
```

```ts
function buildPatternIndex(words: string[]): Map<string, string[]> {
  const index = new Map<string, string[]>(); // pattern → words matching it

  for (const word of words) {
    for (let i = 0; i < word.length; i++) {
      const pattern = word.slice(0, i) + "*" + word.slice(i + 1);
      if (!index.has(pattern)) {
        index.set(pattern, []);
      }
      index.get(pattern)!.push(word);
    }
  }

  return index;
}

function wordNeighbors(word: string, index: Map<string, string[]>): string[] {
  const result: string[] = [];
  for (let i = 0; i < word.length; i++) {
    const pattern = word.slice(0, i) + "*" + word.slice(i + 1);
    for (const candidate of index.get(pattern) ?? []) {
      if (candidate !== word) {
        result.push(candidate);
      }
    }
  }
  return result;
}
```

Building the index costs O(N · L²) (N words, L patterns each, and each pattern is a string of length L). That's much better than comparing all pairs when N is large.

### Complexity

| Representation | Space | Build time | Neighbors of u | Edge check u–v |
|---|---|---|---|---|
| Adjacency list (`Map<T, T[]>`) | O(V + E) | O(V + E) | O(degree) | O(degree) |
| Adjacency list (`Map<T, Set<T>>`) | O(V + E) | O(V + E) | O(degree) | O(1) |
| Adjacency matrix | O(V²) | O(V² + E) | O(V) | O(1) |
| Grid (implicit) | O(1) extra | none | O(1): at most 4 or 8 | O(1) |
| Rule-based (implicit) | O(1) extra | none | cost of generating them | cost of the rule |

Most graph traversals run in **O(V + E)** on an adjacency list: every vertex is processed once, and every edge is looked at once (or twice, if undirected).

### Common mistakes

- **`new Array(n).fill([])`.** This fills every slot with the **same** array object, so pushing a neighbor to one vertex pushes it to all of them. Always create a new array per slot:

  ```typescript
  const n = 3;

  const wrong: number[][] = new Array(n).fill([]);  // all slots share ONE array
  wrong[0].push(5);                                  // wrong is now [[5], [5], [5]]

  const right: number[][] = Array.from({ length: n }, () => []); // a new array per slot
  right[0].push(5);                                              // right is [[5], [], []]
  ```

- **Forgetting the reverse edge in undirected graphs.** You'd then be able to go from u to v but not back.
- **Reversing the direction of prerequisite pairs.** Read the statement carefully: `[a, b]` = "a requires b" means the edge is b → a.
- **Losing isolated vertices.** Initialize every known vertex when the problem gives you n or a vertex list.
- **Using a plain object as the adjacency map.** Keys become strings, so numeric keys come back as strings when you iterate, and keys like `"constructor"` collide with inherited properties.
- **Using an array as a `Set`/`Map` key for grid cells.** Two arrays with the same contents are different keys. Encode the cell as `row * cols + col` or as a string.

### Remembering and explaining it

To rebuild it:
- *Default to `Map<vertex, neighbors[]>`.*
- *Undirected: push both ways. Directed: one way, plus in-degree if order matters.*
- *Weighted: `{ to, weight }`.*
- *Grids and rule-based graphs: generate neighbors on demand, don't build lists.*

To explain it: *"First I'll convert the input into an adjacency list, a map from each vertex to its neighbors. It's O(V + E) space and gives me each vertex's neighbors in time proportional to its degree, which is what the traversal needs."* Say out loud whether the graph is directed or undirected, and whether it's weighted. Those two facts determine which algorithms apply.

### LeetCode practice

1. [200. Number of Islands](https://leetcode.com/problems/number-of-islands/)
2. [133. Clone Graph](https://leetcode.com/problems/clone-graph/)
3. [695. Max Area of Island](https://leetcode.com/problems/max-area-of-island/)
4. [207. Course Schedule](https://leetcode.com/problems/course-schedule/)
5. [210. Course Schedule II](https://leetcode.com/problems/course-schedule-ii/)
6. [399. Evaluate Division](https://leetcode.com/problems/evaluate-division/)
7. [743. Network Delay Time](https://leetcode.com/problems/network-delay-time/)
8. [127. Word Ladder](https://leetcode.com/problems/word-ladder/)
9. [1584. Min Cost to Connect All Points](https://leetcode.com/problems/min-cost-to-connect-all-points/)
10. [1192. Critical Connections in a Network](https://leetcode.com/problems/critical-connections-in-a-network/)

---

# Part 2: Less Common Structures

The structures in this part appear less often than those in Part 1, but they're still asked, especially in senior interviews and at companies known for hard problems. They build on Part 1: the monotonic queue uses the deque, and the sorted-set alternatives use ideas from the BST and heap sections.

---

## 12. Monotonic Stack and Monotonic Queue

### Mental model

A **monotonic** structure is a stack or deque whose elements are always kept in sorted order: always increasing, or always decreasing, from bottom to top (or from front to back).

It stays sorted with one simple rule: **before adding a new element, remove every element that would break the order.** Those elements are popped from the end where you add.

Why is it safe to throw elements away? Because the new element **dominates** them: it's at least as good an answer and it arrived later, so the removed elements can never be the answer to any future question.

```
Decreasing stack (bottom → top). Push 5, 3, 4:

push 5:  [5]
push 3:  [5, 3]           3 < 5, the order is fine
push 4:  4 > 3 → pop 3    3 can never be "the next greater" for anyone after 4 arrives
         [5, 4]
```

### Part A: Monotonic stack

#### When to use it

The signal is: **"for each element, find the nearest element to its left or right that is greater (or smaller)."**

- **Next greater element.** Examples: Next Greater Element I/II, Daily Temperatures ("how many days until a warmer day?"), Online Stock Span.
- **Nearest smaller element on both sides.** Examples: Largest Rectangle in Histogram, Maximal Rectangle, Sum of Subarray Minimums. For each bar, the nearest smaller bar on each side limits how wide a rectangle using it can be.
- **Keeping the "best so far" sequence while removing worse items.** Examples: Remove K Digits, Remove Duplicate Letters, Trapping Rain Water (one of the solutions).

#### How it works: next greater element

**Problem:** for each element, find the first element to its right that is strictly greater, or -1 if there isn't one.

The brute force checks every element to the right of every element, which is O(n²).

**The monotonic idea:** walk left to right, and keep a stack of indices whose "next greater" hasn't been found yet. Their values are in **decreasing** order from bottom to top. Why decreasing? If a smaller element sat below a larger one, the larger one would already have been its next greater element, and it would have been popped.

When a new value arrives, it is the answer for every waiting element that is smaller than it. Those are exactly the elements at the top of the stack, so pop them and record the answer. Then push the new element; it's waiting too.

**Trace** for `nums = [2, 1, 2, 4, 3]` (the stack stores indices; values are shown in parentheses):

| i | nums[i] | Popped (answer = nums[i]) | Stack after (bottom → top) | answer |
|---|---|---|---|---|
| 0 | 2 | none | [0 (2)] | [-1, -1, -1, -1, -1] |
| 1 | 1 | none (1 is not > 2) | [0 (2), 1 (1)] | unchanged |
| 2 | 2 | index 1 (1 < 2) → answer[1] = 2 | [0 (2), 2 (2)] | [-1, 2, -1, -1, -1] |
| 3 | 4 | index 2 (2 < 4) → answer[2] = 4; index 0 (2 < 4) → answer[0] = 4 | [3 (4)] | [4, 2, 4, -1, -1] |
| 4 | 3 | none | [3 (4), 4 (3)] | unchanged |

Indexes 3 and 4 are still waiting at the end, so they keep -1. Final answer: `[4, 2, 4, -1, -1]`.

```ts
function nextGreaterElements(nums: number[]): number[] {
  const answer: number[] = new Array(nums.length).fill(-1);
  const waiting: number[] = []; // indices; their values are decreasing from bottom to top

  for (let i = 0; i < nums.length; i++) {
    // nums[i] is the "next greater" for every waiting element smaller than it.
    while (waiting.length > 0 && nums[waiting[waiting.length - 1]] < nums[i]) {
      const index = waiting.pop()!;
      answer[index] = nums[i];
    }
    waiting.push(i); // nums[i] now waits for its own next greater element
  }

  return answer;
}
```

**Why store indices, not values?** With an index you can read the value (`nums[index]`), write the answer to the right slot, and compute distances. For example, Daily Temperatures needs `i - index`, the number of days waited.

#### The four variations

The direction you walk and the comparison you use decide what you find:

| You want | Stack order (bottom → top) | Pop while the top is… |
|---|---|---|
| Next **greater** to the right | Decreasing | `<` the new value |
| Next **smaller** to the right | Increasing | `>` the new value |
| Previous greater / smaller (to the left) | Same stacks as above | After popping, the element left on top is the answer for the new element |

Whether you pop on `<` or `<=` decides how **equal values** are treated ("strictly greater" or "greater or equal"). Read the problem statement for which one it wants.

### Part B: Monotonic queue

#### When to use it

The signal is: **"maximum or minimum of every sliding window."**

- **Sliding Window Maximum** (LeetCode 239, frequently reported at Amazon and Google): for each window of size k, return the maximum.
- **Longest Continuous Subarray With Absolute Diff ≤ Limit:** two monotonic queues, one for the window's max and one for its min.
- **Shortest Subarray with Sum at Least K (with negative numbers)**, **Jump Game VI**, **Constrained Subsequence Sum:** a monotonic queue finds the best previous value among the last k positions.

A heap can also give a window maximum, but removing the element that leaves the window is awkward (lazy deletion, Section 8), and each operation costs O(log n). The monotonic queue does it in O(1) amortized.

#### How it works

The window slides: elements enter at the **back** and leave from the **front** in arrival order, like a queue. We want the maximum at any moment.

Keep a deque whose values are **decreasing from front to back**:
- **Push x:** pop from the **back** every element smaller than x, then push x at the back. Those elements are smaller than x *and* will leave the window before x, so while x is in the window they can never be the maximum.
- **Max:** the **front** element.
- **Pop (an element leaves the window):** if the leaving element is the front, remove it from the front. If it isn't the front, it was already thrown away during some earlier push, so there's nothing to do.

**Trace** for `nums = [1, 3, -1, -3, 5, 3, 6, 7]`, `k = 3`:

In each step, the new element is pushed first, and then the element leaving the window is popped. This is the same order the code below uses.

| Step | Enters (push) | Leaves (pop) | Deque after (front → back) | Window | Max |
|---|---|---|---|---|---|
| 1 | 1 | | [1] | [1] | |
| 2 | 3 | | [3] (1 removed: smaller and older) | [1, 3] | |
| 3 | -1 | | [3, -1] | [1, 3, -1] | **3** |
| 4 | -3 | 1 (already removed in step 2, nothing to do) | [3, -1, -3] | [3, -1, -3] | **3** |
| 5 | 5 | 3 (already removed by 5's push) | [5] (5 removed 3, -1 and -3) | [-1, -3, 5] | **5** |
| 6 | 3 | -1 (already removed) | [5, 3] | [-3, 5, 3] | **5** |
| 7 | 6 | -3 (already removed) | [6] | [5, 3, 6] | **6** |
| 8 | 7 | 5 (already removed by 6's push) | [7] | [3, 6, 7] | **7** |

Result: `[3, 3, 5, 5, 6, 7]`.

In this example, every leaving element had already been thrown out. The front is removed explicitly only when the current maximum itself leaves the window. For example, with `nums = [9, 1, 2]` and `k = 2`, at step 3 the element 9 leaves while it's still the front, so `pop(9)` removes it and the maximum becomes 2.

#### Implementation

This uses the `Deque` from Section 5.

```ts
class MonotonicMaxQueue {
  // Values in decreasing order from front to back. The front is the current maximum.
  private deque = new Deque<number>();

  push(value: number): void {
    // Remove smaller values from the back: they can never be the maximum again.
    // Use strict < so equal values are kept; otherwise pop(value) could remove too early.
    while (!this.deque.isEmpty() && this.deque.peekBack()! < value) {
      this.deque.popBack();
    }
    this.deque.pushBack(value);
  }

  // Call when `value` leaves the window.
  pop(value: number): void {
    if (this.deque.peekFront() === value) {
      this.deque.popFront();
    }
    // Otherwise `value` was already removed by an earlier push.
  }

  max(): number | undefined {
    return this.deque.peekFront();
  }
}
```

**Using it for Sliding Window Maximum:**

```ts
function maxSlidingWindow(nums: number[], k: number): number[] {
  const window = new MonotonicMaxQueue();
  const result: number[] = [];

  for (let i = 0; i < nums.length; i++) {
    window.push(nums[i]);

    // Once the window is larger than k, the element at i - k leaves it.
    if (i >= k) {
      window.pop(nums[i - k]);
    }

    // The first full window ends at index k - 1.
    if (i >= k - 1) {
      result.push(window.max()!);
    }
  }

  return result;
}
```

**For a minimum queue,** flip the comparison in `push` to `>`: remove *larger* values from the back.

**Index-based version.** Many solutions store **indices** in the deque instead of values, and remove the front when it falls outside the window (when `frontIndex <= i - k`). It's the same idea. It's useful when you need positions, or when equal values make value-based removal confusing.

### Complexity

| | Time | Why |
|---|---|---|
| Process n elements (stack or queue) | O(n) total | Each element is pushed once and popped at most once |
| One push | O(1) amortized | A single push can pop many elements, but the total number of pops over all pushes can't exceed n |
| Peek / max | O(1) | Top of the stack / front of the deque |
| Space | O(n) for the stack, O(k) for a window queue | At most all elements, or all window elements, are waiting |

**The amortized argument** is worth saying out loud in interviews, because the nested `while` loop *looks* like O(n²): *"Each element is pushed once and popped at most once, so the inner loop runs at most n times in total across the whole algorithm. That makes it O(n)."*

### Common mistakes

- **Storing values when you need distances or positions.** Store indices.
- **Wrong comparison direction.** Write down the table above ("next greater → decreasing stack → pop while the top is smaller") before coding.
- **Mishandling equal values.** Decide deliberately between `<` and `<=`.
- **Recording results before the first window is full** (in sliding window problems).

### Remembering and explaining it

To rebuild it: *"The newcomer dominates the smaller, older elements, so kick them out from the back. Whatever survives stays sorted, and the answer is at the end."*

To explain it: *"I'll keep a monotonic stack of indices waiting for their next greater element. Each index is pushed and popped once, so the total time is O(n)."*

### LeetCode practice

1. [496. Next Greater Element I](https://leetcode.com/problems/next-greater-element-i/)
2. [739. Daily Temperatures](https://leetcode.com/problems/daily-temperatures/)
3. [84. Largest Rectangle in Histogram](https://leetcode.com/problems/largest-rectangle-in-histogram/)
4. [42. Trapping Rain Water](https://leetcode.com/problems/trapping-rain-water/)
5. [402. Remove K Digits](https://leetcode.com/problems/remove-k-digits/)
6. [239. Sliding Window Maximum](https://leetcode.com/problems/sliding-window-maximum/)
7. [862. Shortest Subarray with Sum at Least K](https://leetcode.com/problems/shortest-subarray-with-sum-at-least-k/)
8. [907. Sum of Subarray Minimums](https://leetcode.com/problems/sum-of-subarray-minimums/)
9. [456. 132 Pattern](https://leetcode.com/problems/132-pattern/)
10. [1019. Next Greater Node In Linked List](https://leetcode.com/problems/next-greater-node-in-linked-list/)

---

## 13. Union-Find (Disjoint Set Union, DSU)

### Mental model

Union-Find keeps track of elements split into **non-overlapping groups**. It answers two questions very fast:

- **`find(x)`: which group is x in?** It returns the group's representative, called its **root**.
- **`union(a, b)`: merge the group containing a with the group containing b.**

Two elements are in the same group exactly when `find(a) === find(b)`.

Each group is stored as a **tree**, and each element only knows its **parent**. The root is the element that is its own parent. To find the group of x, follow the parents up to the root.

```
parent = [0, 0, 1, 3, 3, 5]      (parent[i] is the parent of element i)

   Group A        Group B       Group C
      0              3             5
      |              |
      1              4
      |
      2

find(2): 2 → 1 → 0, and 0 is its own parent → root 0
find(4): 4 → 3 → root 3
2 and 4 are in different groups, because 0 ≠ 3.

union(2, 4): find both roots (0 and 3), then make one root the parent of the other:
parent[3] = 0
      0
     / \
    1   3
    |   |
    2   4        Now find(4) = 0 = find(2): same group.
```

### When to use Union-Find

The signal is: **groups that only ever merge (never split), and repeated questions of "are these two connected?"**

- **Connected components.** Examples: Number of Provinces, Number of Connected Components in an Undirected Graph, Number of Islands II (islands appear one by one, and you report the count after each).
- **Cycle detection in an undirected graph.** Examples: Redundant Connection, Graph Valid Tree. If an edge connects two elements that are **already** in the same group, that edge creates a cycle.
- **Kruskal's minimum spanning tree.** Examples: Min Cost to Connect All Points, Connecting Cities with Minimum Cost. Sort the edges by weight and add each edge only if it connects two different groups.
- **Grouping equivalent things.** Examples: Accounts Merge (accounts sharing an email are the same person), Similar String Groups, Satisfiability of Equality Equations (`a == b` merges groups, and `a != b` must then be in different groups), Smallest String With Swaps.

**Union-Find vs. BFS/DFS for connectivity:** if the graph is fixed and you need components once, a traversal works just as well. Union-Find shines when edges **arrive over time** and you must answer connectivity questions in between, since a traversal would have to restart from scratch each time.

### Step 1: the basic version

```ts
class NaiveUnionFind {
  parent: number[];

  constructor(n: number) {
    // Initially, every element is its own group (its own root).
    this.parent = Array.from({ length: n }, (_, i) => i);
  }

  find(x: number): number {
    while (this.parent[x] !== x) {
      x = this.parent[x]; // walk up to the root
    }
    return x;
  }

  union(a: number, b: number): void {
    const rootA = this.find(a);
    const rootB = this.find(b);
    if (rootA !== rootB) {
      this.parent[rootB] = rootA; // attach one tree under the other root
    }
  }
}
```

**The problem:** trees can become long chains. Union(0,1), then union(1,2), union(2,3), and so on can produce `0 ← 1 ← 2 ← … ← n`, and then `find` costs O(n). Two optimizations fix this. Together they make operations almost O(1).

### Step 2: union by size

When merging two trees, **attach the smaller tree under the root of the larger one.** Keep a `size` array that stores the number of elements in each root's tree.

```
Merging a tree of size 1 with a tree of size 3:

Bad (big under small):         Good (small under big):
    x                               r
    |                             / | \
    r          ← height 3        a  b  x     ← height stays 2
   / \
  a   b
```

An element's depth grows only when its tree is attached under a tree that is **at least as big**, which at least doubles the size of the tree it belongs to. A group can double at most log₂ n times, so every tree has height O(log n).

### Step 3: path compression

While `find` walks up to the root, it can **re-point the nodes it passes** so they sit closer to the root. The next `find` for any of those nodes will then be almost instant.

**Full path compression** (recursive): after finding the root, point every node on the path **directly** at the root.

```ts
function findWithFullCompression(parent: number[], x: number): number {
  if (parent[x] !== x) {
    parent[x] = findWithFullCompression(parent, parent[x]); // point x straight at the root
  }
  return parent[x];
}
```

**Path halving** (iterative, used in the final version below): on the way up, point each node at its **grandparent**. It's a single extra line, needs no recursion (so there's no call-stack risk on huge inputs), and is just as fast in practice.

```
Path halving during find(4), starting from the chain 4 → 3 → 2 → 1 → 0:

at 4: parent[4] = grandparent (2); jump to 2       4 → 2
at 2: parent[2] = grandparent (0); jump to 0       2 → 0
at 0: it's the root → stop

After: 4 → 2 → 0, and 3 → 2. The path is about half as long, and each later find shortens it further.
```

### Final implementation

```ts
class UnionFind {
  private parent: number[];
  private size: number[];  // size[root] = number of elements in that root's group
  components: number;      // current number of separate groups

  constructor(n: number) {
    this.parent = Array.from({ length: n }, (_, i) => i); // everyone is their own root
    this.size = new Array(n).fill(1);
    this.components = n;
  }

  find(x: number): number {
    while (this.parent[x] !== x) {
      // Path halving: point x at its grandparent, then move up.
      this.parent[x] = this.parent[this.parent[x]];
      x = this.parent[x];
    }
    return x;
  }

  // Merge the groups of a and b.
  // Returns false if they were already in the same group (in a graph: this edge closes a cycle).
  union(a: number, b: number): boolean {
    let rootA = this.find(a);
    let rootB = this.find(b);
    if (rootA === rootB) {
      return false;
    }

    // Union by size: make rootA the root of the larger tree.
    if (this.size[rootA] < this.size[rootB]) {
      const temp = rootA;
      rootA = rootB;
      rootB = temp;
    }

    this.parent[rootB] = rootA; // smaller tree goes under the larger one
    this.size[rootA] += this.size[rootB];
    this.components--;
    return true;
  }

  connected(a: number, b: number): boolean {
    return this.find(a) === this.find(b);
  }

  groupSize(x: number): number {
    return this.size[this.find(x)];
  }
}
```

**Trace** with 5 elements, detecting a cycle among edges `[0,1], [1,2], [3,4], [0,2]`:

| Operation | Roots before | Result | `components` | Note |
|---|---|---|---|---|
| start | | | 5 | {0} {1} {2} {3} {4} |
| `union(0, 1)` | 0, 1 | true | 4 | {0, 1} |
| `union(1, 2)` | 0, 2 | true | 3 | {0, 1, 2} |
| `union(3, 4)` | 3, 4 | true | 2 | {0, 1, 2} {3, 4} |
| `union(0, 2)` | 0, 0 | **false** | 2 | Already connected: edge [0, 2] closes the cycle 0–1–2–0 |

### Elements that aren't numbers 0…n-1

Union-Find works on array indices. When your elements are strings (emails, names) or coordinates, give each one an integer id the first time you see it:

```ts
class IdMapper<T> {
  private ids = new Map<T, number>();

  // Returns a stable integer id for `item`, assigning a new one on first sight.
  getId(item: T): number {
    let id = this.ids.get(item);
    if (id === undefined) {
      id = this.ids.size; // 0, 1, 2, ... in order of first appearance
      this.ids.set(item, id);
    }
    return id;
  }

  get count(): number {
    return this.ids.size;
  }
}
```

```typescript
// Example: which emails belong to the same person?
const pairs: [string, string][] = [
  ["a@x.com", "b@x.com"],
  ["b@x.com", "c@x.com"],
  ["d@x.com", "e@x.com"],
];

const mapper = new IdMapper<string>();
for (const [first, second] of pairs) {
  mapper.getId(first);
  mapper.getId(second);
}

const unionFind = new UnionFind(mapper.count);
for (const [first, second] of pairs) {
  unionFind.union(mapper.getId(first), mapper.getId(second));
}

unionFind.connected(mapper.getId("a@x.com"), mapper.getId("c@x.com")); // true
unionFind.components; // 2 people
```

For grid cells, use the same encoding as in the Graph section: `id = row * cols + col`.

### Complexity

| Operation | Time | Why |
|---|---|---|
| `find` / `union` / `connected` | O(α(n)) amortized | With both optimizations, trees stay extremely flat |
| With union by size only | O(log n) | Tree height is at most log₂ n |
| With neither optimization | O(n) worst case | Trees can become chains |
| Space | O(n) | The `parent` and `size` arrays |

**What is α(n)?** It's the inverse Ackermann function. It grows so slowly that it's **at most 4 for any input that could fit in the universe**. In an interview, say: *"amortized O(α(n)), which is effectively constant."*

### Common mistakes

- **Comparing parents instead of roots.** `parent[a] === parent[b]` doesn't mean "same group". Only `find(a) === find(b)` does.
- **Updating the size of the wrong root.** After deciding which root is bigger, add the smaller size to the **bigger** root.
- **Using `union` on elements instead of on roots** in custom versions. Always `find` first and link roots, never individual elements.
- **Expecting to split groups.** Union-Find can't undo a union. If groups must split, you need a different approach (for example, processing the operations in reverse order).

### Remembering and explaining it

To rebuild it: *"Every element points to a parent; the root is its own parent. `find` walks up, pointing each node at its grandparent. `union` finds both roots and puts the smaller tree under the bigger one."*

To explain it: *"Edges arrive one at a time and I need connectivity in between, so Union-Find fits. With union by size and path compression, each operation is amortized nearly O(1). And `union` returning false means the edge would create a cycle."*

### LeetCode practice

1. [684. Redundant Connection](https://leetcode.com/problems/redundant-connection/)
2. [547. Number of Provinces](https://leetcode.com/problems/number-of-provinces/)
3. [200. Number of Islands](https://leetcode.com/problems/number-of-islands/)
4. [721. Accounts Merge](https://leetcode.com/problems/accounts-merge/)
5. [1319. Number of Operations to Make Network Connected](https://leetcode.com/problems/number-of-operations-to-make-network-connected/)
6. [947. Most Stones Removed with Same Row or Column](https://leetcode.com/problems/most-stones-removed-with-same-row-or-column/)
7. [1202. Smallest String With Swaps](https://leetcode.com/problems/smallest-string-with-swaps/)
8. [1579. Remove Max Number of Edges to Keep Graph Fully Traversable](https://leetcode.com/problems/remove-max-number-of-edges-to-keep-graph-fully-traversable/)
9. [990. Satisfiability of Equality Equations](https://leetcode.com/problems/satisfiability-of-equality-equations/)

---

## 14. Sorted Set, TreeMap Alternatives

### What's missing

Java has `TreeMap` and `TreeSet`, C++ has `std::set` and `std::map`, and Python has the popular `sortedcontainers`. They're all **ordered** collections that keep elements sorted while supporting, in O(log n):

- insert and delete
- membership checks
- **floor(x)**: the largest element ≤ x
- **ceiling(x)**: the smallest element ≥ x
- first and last element (min and max)

JavaScript's `Map` and `Set` keep **insertion** order, not **sorted** order, and have no floor or ceiling. Under the hood, those language libraries use self-balancing BSTs (red-black trees), and implementing one of those in an interview is almost never expected. It's too long and too error-prone for the time available.

### When you'll need this

The signal is: **data changes (inserts and deletes) *and* you need "nearest value" questions or sorted order at any moment.**

- **My Calendar I / II** (LeetCode 729 / 731): does a new booking overlap the nearest existing bookings before and after it?
- **Contains Duplicate III**: is there a value within t of the current value among the last k values? (a ceiling query)
- **Count of Smaller Numbers After Self**, **Count of Range Sum**, **Reverse Pairs**: counting how many seen values fall below a threshold.
- **Stock Price Fluctuation**, **Exam Room**, **Seat Reservation Manager**: min, max or nearest queries over a changing set.
- **Sliding Window Median**: a sorted window of values.

### Your options in JavaScript

**Option 1: a sorted array with binary search.** This is the simplest and often good enough (implementation below).
- Lookups (has, floor, ceiling, rank) are O(log n) with binary search.
- Insert and delete are O(n), because `splice` shifts elements. In practice, `splice` is a fast memory move, so with up to about 10⁴–10⁵ operations this usually passes. State the trade-off out loud.

**Option 2: a heap with lazy deletion (Section 8).** Use it when you only ever need the **min** or the **max**, not floor/ceiling of arbitrary values. That gives O(log n) per operation.

**Option 3: a Fenwick tree or segment tree over compressed values (Sections 15–16).** Use it when the question is about **counting** ("how many seen values are less than x?"). Map each distinct value to its rank in sorted order, then count by ranks. That gives O(log n) per operation.

**Option 4: say what you'd use in another language.** *"In Java I'd use a TreeMap for O(log n) floor and ceiling. In TypeScript I'll use a sorted array with binary search, which makes inserts O(n). If that became the bottleneck, I'd switch to a balanced BST or a segment tree over compressed values."* That sentence shows you know the ideal tool, the practical choice and the trade-off.

### Implementation: SortedList

The whole structure rests on one helper, **lower bound**: *the index of the first element that is ≥ x* (or the array's length, if every element is smaller). It's also the position where x would be inserted to keep the array sorted.

A second helper, **upper bound**, is the same with one change: *the first element that is **> x***.

```
items = [10, 20, 20, 30]
index:    0   1   2   3

lowerBound(20) = 1    first element ≥ 20
upperBound(20) = 3    first element > 20
lowerBound(25) = 3    first element ≥ 25 (25 would be inserted here)
lowerBound(99) = 4    nothing is ≥ 99, so the array's length

Count of elements equal to 20 = upperBound(20) - lowerBound(20) = 2
Count of elements less than 25 = lowerBound(25) = 3
```

**How lower bound works.** Keep a search range `[low, high)`, where the answer is guaranteed to lie. Look at the middle element:
- If it's **less than x**, the answer must be strictly to its right, so `low = mid + 1`.
- Otherwise it's **≥ x**, so it could be the answer, or the answer is further left: `high = mid` (keep it in range).

When `low === high`, the range has shrunk to one position, and that's the answer.

Floor and ceiling then follow directly:
- **ceiling(x)** is the element at `lowerBound(x)`: the first element ≥ x.
- **floor(x)** is the element just **before** `upperBound(x)`: the last element ≤ x.

```ts
class SortedList {
  private items: number[] = [];

  get size(): number {
    return this.items.length;
  }

  // Index of the first element >= x (or items.length if none).
  lowerBound(x: number): number {
    let low = 0;
    let high = this.items.length;
    while (low < high) {
      const mid = Math.floor((low + high) / 2);
      if (this.items[mid] < x) {
        low = mid + 1; // mid is too small, so the answer is to the right
      } else {
        high = mid; // mid might be the answer, so keep it in range
      }
    }
    return low;
  }

  // Index of the first element > x (or items.length if none).
  upperBound(x: number): number {
    let low = 0;
    let high = this.items.length;
    while (low < high) {
      const mid = Math.floor((low + high) / 2);
      if (this.items[mid] <= x) {
        low = mid + 1; // the only difference from lowerBound: <= instead of <
      } else {
        high = mid;
      }
    }
    return low;
  }

  // O(n) because of splice: insert x while keeping the array sorted.
  add(x: number): void {
    this.items.splice(this.lowerBound(x), 0, x);
  }

  // O(n): remove one occurrence of x. Returns false if x isn't present.
  remove(x: number): boolean {
    const index = this.lowerBound(x);
    if (index < this.items.length && this.items[index] === x) {
      this.items.splice(index, 1);
      return true;
    }
    return false;
  }

  has(x: number): boolean {
    const index = this.lowerBound(x);
    return index < this.items.length && this.items[index] === x;
  }

  // Smallest element >= x, or undefined.
  ceiling(x: number): number | undefined {
    const index = this.lowerBound(x);
    return index < this.items.length ? this.items[index] : undefined;
  }

  // Largest element <= x, or undefined.
  floor(x: number): number | undefined {
    const index = this.upperBound(x) - 1;
    return index >= 0 ? this.items[index] : undefined;
  }

  // Number of elements strictly less than x (x's "rank").
  countLessThan(x: number): number {
    return this.lowerBound(x);
  }

  first(): number | undefined {
    return this.items[0];
  }

  last(): number | undefined {
    return this.items[this.items.length - 1];
  }
}
```

**Example: My Calendar I (LeetCode 729).** Book `[start, end)` intervals, and reject a booking if it overlaps an existing one. Keep the start times in a `SortedList` and the end times in a `Map`. A new booking can only collide with its two sorted neighbors: the booking that starts at or before it, and the one that starts after it.

```ts
class MyCalendar {
  private starts = new SortedList();
  private endByStart = new Map<number, number>();

  book(start: number, end: number): boolean {
    // Neighbor 1: the existing booking starting at or before `start`. Does it end after we begin?
    const previousStart = this.starts.floor(start);
    if (previousStart !== undefined && this.endByStart.get(previousStart)! > start) {
      return false;
    }

    // Neighbor 2: the existing booking starting at or after `start`. Does it begin before we end?
    const nextStart = this.starts.ceiling(start);
    if (nextStart !== undefined && nextStart < end) {
      return false;
    }

    this.starts.add(start);
    this.endByStart.set(start, end);
    return true;
  }
}
```

**A sorted map.** If you need sorted **keys with values** (a real TreeMap), combine a `SortedList` of keys with a `Map<key, value>`, as `MyCalendar` does above.

### Complexity (SortedList)

| Operation | Time | Why |
|---|---|---|
| `lowerBound` / `upperBound` / `has` / `floor` / `ceiling` / `countLessThan` | O(log n) | Binary search halves the range each step |
| `first` / `last` | O(1) | Read the ends of the array |
| `add` / `remove` | O(n) | `splice` shifts elements (a fast memory move in practice) |
| Space | O(n) | |

A balanced BST would make `add` and `remove` O(log n). Mention it; don't build it.

### Common mistakes

- **Off-by-one in floor.** Floor is `upperBound(x) - 1`, not `lowerBound(x) - 1`. The latter misses the case where x itself is in the list.
- **Infinite loops in binary search.** Use `high = mid` together with `low = mid + 1` and the condition `low < high`. If you mix these conventions, the loop may never shrink the range.
- **Calling `sort()` after every insert.** That's O(n log n) per insert, and JavaScript's default `sort()` compares numbers **as strings** unless you pass `(a, b) => a - b`.

### Remembering and explaining it

To rebuild it: *"Everything is lower bound: the first index with a value ≥ x. Upper bound is the same with `<=`. Ceiling is the element at the lower bound; floor is the element just before the upper bound."*

To explain it: *"JavaScript has no TreeMap, so I'll keep a sorted array. Lookups are O(log n) with binary search; inserts are O(n) because of the shifting, which is acceptable at these constraints."*

### LeetCode practice

1. [220. Contains Duplicate III](https://leetcode.com/problems/contains-duplicate-iii/)
2. [729. My Calendar I](https://leetcode.com/problems/my-calendar-i/)
3. [731. My Calendar II](https://leetcode.com/problems/my-calendar-ii/)
4. [352. Data Stream as Disjoint Intervals](https://leetcode.com/problems/data-stream-as-disjoint-intervals/)
5. [1847. Closest Room](https://leetcode.com/problems/closest-room/)
6. [2276. Count Integers in Intervals](https://leetcode.com/problems/count-integers-in-intervals/)

---
## 15. Fenwick Tree (Binary Indexed Tree)

### The problem it solves

You have an array of numbers, and you must repeatedly do two things in any mix:
1. **Update** one element (for example, `nums[3] += 5`).
2. **Query** the sum of a range (for example, the sum of `nums[2..7]`).

The two obvious approaches each make one of these slow:

| Approach | Update one element | Range sum | Why |
|---|---|---|---|
| Plain array | O(1) | O(n) | Summing a range means adding up every element in it |
| Prefix-sum array | O(n) | O(1) | `sum(l..r) = prefix[r] - prefix[l-1]`, but changing one element changes every prefix after it |
| **Fenwick tree** | **O(log n)** | **O(log n)** | Each prefix sum is split into O(log n) precomputed pieces |

When updates and queries are mixed, for example 10⁵ of each, both obvious approaches end up around 10¹⁰ operations. The Fenwick tree brings that down to about 10⁵ × 17.

### When to use it

- **Range sum with point updates.** Example: Range Sum Query – Mutable (LeetCode 307).
- **Counting problems over values.** Examples: Count of Smaller Numbers After Self, Count of Range Sum, Reverse Pairs, Create Sorted Array through Instructions, counting inversions.
  The trick: use the Fenwick tree as a **frequency table indexed by value**. "How many values seen so far are less than x?" is then a prefix sum over indexes less than x. Values are usually first **compressed** to ranks 0, 1, 2, … (shown later in this section).
- **Anywhere you'd want prefix sums, but the array keeps changing.**

The Fenwick tree works for operations that can be **undone by subtraction**: sum, count, XOR. For range **min/max**, use a segment tree (Section 16).

### The key idea: each cell covers a block

The Fenwick tree is an array `tree` indexed from **1** to n. (Index 0 is not used, for a reason explained below.) Each cell `tree[i]` stores the sum of a **block** of the original array that **ends at position i**. The block's length is the **lowest set bit** of i: the value of the rightmost `1` in i's binary form.

| i | binary | lowest set bit | `tree[i]` covers positions |
|---|---|---|---|
| 1 | 0001 | 1 | [1] |
| 2 | 0010 | 2 | [1..2] |
| 3 | 0011 | 1 | [3] |
| 4 | 0100 | 4 | [1..4] |
| 5 | 0101 | 1 | [5] |
| 6 | 0110 | 2 | [5..6] |
| 7 | 0111 | 1 | [7] |
| 8 | 1000 | 8 | [1..8] |

```
positions:   1    2    3    4    5    6    7    8
tree[8]:   [──────────────── 1..8 ────────────────]
tree[4]:   [────── 1..4 ──────]
tree[6]:                       [─ 5..6 ─]
tree[2]:   [─ 1..2 ─]
tree[1]:   [1]
tree[3]:             [3]
tree[5]:                       [5]
tree[7]:                                 [7]
```

The blocks fit together like this: **any prefix `[1..i]` can be written as at most log₂ n blocks**, and **any single position is inside at most log₂ n blocks**. Those two facts give O(log n) for both operations.

### Query: sum of positions 1..i

Start at i. Add `tree[i]`, which covers the block ending at i. Then jump to just before that block (subtract the lowest set bit) and repeat until you reach 0.

```
prefixSum(7):
  i = 7 (0111): add tree[7] → covers [7]      next i = 7 - 1 = 6
  i = 6 (0110): add tree[6] → covers [5..6]   next i = 6 - 2 = 4
  i = 4 (0100): add tree[4] → covers [1..4]   next i = 4 - 4 = 0 → stop

  [1..4] + [5..6] + [7] = [1..7] ✔   Only 3 additions instead of 7.
```

Each step removes one `1` bit from i, and i has at most log₂ n of them. So a query is O(log n).

### Update: add delta at position i

Every block that **contains** position i must change. Start at i (its own block contains it), then repeatedly **add** the lowest set bit to jump to the next larger block that also contains i.

```
update(3, delta):
  i = 3 (0011): tree[3] += delta   → [3] contains 3       next i = 3 + 1 = 4
  i = 4 (0100): tree[4] += delta   → [1..4] contains 3    next i = 4 + 4 = 8
  i = 8 (1000): tree[8] += delta   → [1..8] contains 3    next i = 8 + 8 = 16 > n → stop
```

So a query walks **down** (subtract the lowest set bit), and an update walks **up** (add the lowest set bit).

### Computing the lowest set bit

This is the one place in this guide that uses a **bitwise operator**, because the Fenwick tree is defined by binary structure. The standard expression is `i & -i`.

**Why does `i & -i` isolate the lowest set bit?** JavaScript's bitwise operators work on 32-bit integers in **two's complement**, where `-i` equals "flip every bit of i, then add 1".

```
i        = 12 = 0000 1100
flip     =      1111 0011
+1 (= -i)=      1111 0100      the +1 carries through the trailing 1s and stops at the first 0,
                               which is exactly where i had its lowest 1
i & -i   =      0000 0100 = 4  only that bit is 1 in both
```

Below the lowest set bit, i has zeros (so the AND is 0). At the lowest set bit, both numbers have a 1. Above it, `-i` has exactly the flipped bits of i, so the AND is 0 there too.

```ts
// The value of the rightmost 1 bit of i (i > 0). Examples: 12 → 4, 6 → 2, 7 → 1, 8 → 8.
function lowestSetBit(i: number): number {
  return i & -i;
}
```

**A version without bitwise operators.** If you'd rather avoid bit tricks entirely, the lowest set bit is the largest power of two that divides i:

```ts
function lowestSetBitNoBitwise(i: number): number {
  let bit = 1;
  while (i % (bit * 2) === 0) {
    bit *= 2; // i is divisible by the next power of two too, so keep going
  }
  return bit;
}
```

It gives identical results, but costs O(log i) per call instead of O(1), so updates and queries become O(log² n). That's still fast, but in an interview, `i & -i` with a one-sentence explanation is the expected form. If you don't want to rely on bits at all, a segment tree (Section 16) solves the same problems with plain arithmetic.

### Why 1-indexed?

The lowest set bit of 0 is 0. With index 0, the loops `i += lowestSetBit(i)` and `i -= lowestSetBit(i)` would never move, so the loop would never end. Starting at 1 avoids that. The class below takes **0-indexed** positions from the caller, like everything else in JavaScript, and converts them with `i + 1` in exactly one place per method.

### Implementation

```ts
class FenwickTree {
  private tree: number[]; // tree[1..n]; index 0 is unused

  constructor(n: number) {
    this.tree = new Array(n + 1).fill(0);
  }

  // Add `delta` to the element at `index` (0-indexed). O(log n).
  add(index: number, delta: number): void {
    let i = index + 1; // convert to 1-indexed
    while (i < this.tree.length) {
      this.tree[i] += delta;
      i += lowestSetBit(i); // walk UP to the next block that contains this position
    }
  }

  // Sum of elements [0..index] (0-indexed, inclusive). O(log n).
  prefixSum(index: number): number {
    let sum = 0;
    let i = index + 1; // convert to 1-indexed
    while (i > 0) {
      sum += this.tree[i];
      i -= lowestSetBit(i); // walk DOWN to the block just before this one
    }
    return sum;
  }

  // Sum of elements [left..right] (0-indexed, inclusive). O(log n).
  rangeSum(left: number, right: number): number {
    if (left === 0) {
      return this.prefixSum(right);
    }
    return this.prefixSum(right) - this.prefixSum(left - 1);
  }
}
```

**Building from an existing array.** Call `add(i, nums[i])` for every i. That's O(n log n), which is fine for interviews.

**Setting a value instead of adding to it** (as in LeetCode 307's `update(index, val)`): keep a copy of the current values, and add the **difference**.

```ts
class NumArray {
  private values: number[];
  private fenwick: FenwickTree;

  constructor(nums: number[]) {
    this.values = [...nums];
    this.fenwick = new FenwickTree(nums.length);
    for (let i = 0; i < nums.length; i++) {
      this.fenwick.add(i, nums[i]);
    }
  }

  update(index: number, value: number): void {
    const difference = value - this.values[index];
    this.values[index] = value;
    this.fenwick.add(index, difference);
  }

  sumRange(left: number, right: number): number {
    return this.fenwick.rangeSum(left, right);
  }
}
```

### Counting with a Fenwick tree: coordinate compression

For "how many earlier values are smaller than x?", the Fenwick tree is indexed **by value**: `add(value, 1)` records that a value was seen, and `prefixSum(x - 1)` counts the seen values ≤ x - 1. But values can be huge (10⁹) or negative, and you can't create an array that size. **Coordinate compression** maps each distinct value to its rank in sorted order, so the indexes become 0…k-1:

```ts
function compress(values: number[]): Map<number, number> {
  const sortedUnique = [...new Set(values)].sort((a, b) => a - b);
  const rankOf = new Map<number, number>();
  sortedUnique.forEach((value, rank) => {
    rankOf.set(value, rank);
  });
  return rankOf;
}
```

```typescript
// Values: [5000, -3, 5000, 42]  →  distinct sorted: [-3, 42, 5000]
// Ranks:  -3 → 0,   42 → 1,   5000 → 2
// A Fenwick tree of size 3 can now count them.
const rankOf = compress([5000, -3, 5000, 42]);
rankOf.get(5000); // 2
```

Comparisons are preserved (a < b exactly when rank(a) < rank(b)), which is all a counting query needs.

### Complexity

| Operation | Time | Why |
|---|---|---|
| `add` | O(log n) | Each step moves to a block at least twice as large |
| `prefixSum` / `rangeSum` | O(log n) | Each step removes one `1` bit from the index |
| Build with n adds | O(n log n) | |
| Space | O(n) | One cell per position |

### Common mistakes

- **Mixing 0-indexed and 1-indexed positions.** Convert with `+ 1` in exactly one place (at the start of each method), as above.
- **Using index 0 internally.** It causes an infinite loop.
- **Using it for min/max.** Min and max can't be "subtracted" to answer arbitrary ranges. Use a segment tree.
- **Forgetting coordinate compression** when values are large or negative.

### Remembering and explaining it

To rebuild it: *"Each cell covers a block ending at its index, as long as its lowest set bit. Query walks down: `i -= i & -i`. Update walks up: `i += i & -i`. Use 1-indexed internally."*

To explain it: *"A Fenwick tree gives me O(log n) point updates and prefix sums, because every prefix breaks into at most log n precomputed blocks."*

### LeetCode practice

1. [307. Range Sum Query - Mutable](https://leetcode.com/problems/range-sum-query-mutable/)
2. [315. Count of Smaller Numbers After Self](https://leetcode.com/problems/count-of-smaller-numbers-after-self/)
3. [493. Reverse Pairs](https://leetcode.com/problems/reverse-pairs/)
4. [1409. Queries on a Permutation With Key](https://leetcode.com/problems/queries-on-a-permutation-with-key/)
5. [1649. Create Sorted Array through Instructions](https://leetcode.com/problems/create-sorted-array-through-instructions/)
6. [2179. Count Good Triplets in an Array](https://leetcode.com/problems/count-good-triplets-in-an-array/)
7. [2426. Number of Pairs Satisfying Inequality](https://leetcode.com/problems/number-of-pairs-satisfying-inequality/)

---

## 16. Segment Tree

### Mental model

A segment tree is a binary tree built over an array, where **every node stores the answer for a range (segment) of the array**: its sum, its minimum, its maximum, and so on.

- The **root** covers the whole array `[0..n-1]`.
- Each node covering `[start..end]` splits at `mid = floor((start + end) / 2)`. The **left child** covers `[start..mid]` and the **right child** covers `[mid+1..end]`.
- **Leaves** cover a single position and store that element.
- Each internal node's value is the **combination** of its two children (for a sum tree: left + right).

```
nums = [5, 2, 6, 3]     sum segment tree:

                    node 0: [0..3] = 16
                   /                    \
       node 1: [0..1] = 7          node 2: [2..3] = 9
          /          \                /          \
 node 3: [0] = 5  node 4: [1] = 2  node 5: [2] = 6  node 6: [3] = 3
```

### Segment tree vs. Fenwick tree

| | Fenwick tree | Segment tree |
|---|---|---|
| Range sum with point updates | Yes, shorter code | Yes |
| Range **min / max / GCD** with point updates | No | **Yes** |
| Range updates ("add 5 to every element in [l..r]") | Only with tricks | Yes, with **lazy propagation** (advanced) |
| Code size | ~15 lines | ~40 lines |

Reach for a segment tree when the operation isn't a sum (min, max, GCD), or when you need something more flexible than prefix sums.

### When to use it

- **Range min / max / GCD query with point updates.** Examples: range minimum query, Longest Increasing Subsequence II, Maximum Sum Queries.
- **Range sum with point updates.** Example: Range Sum Query – Mutable. A Fenwick tree is shorter here, but either works.
- **Advanced (rare, mostly hard problems):** range updates with lazy propagation, "My Calendar III", "Falling Squares", "Count of Range Sum". Know that lazy propagation exists; learn it only if you're targeting very hard problems.

### Storing the tree in an array

Like a heap, a segment tree is stored in an array using index arithmetic. This guide uses the **same 0-indexed layout as the heap** (Section 8):

| | 0-indexed (used here) | 1-indexed (also common) |
|---|---|---|
| Root | `0` | `1` |
| Left child of `node` | `2 * node + 1` | `2 * node` |
| Right child of `node` | `2 * node + 2` | `2 * node + 1` |

**Why allocate `4 * n` slots?** When n isn't a power of two, the tree isn't perfectly complete, so its array positions aren't packed tightly. The deepest index can go beyond 2n. The tree has height at most ⌈log₂ n⌉ + 1 levels, which needs fewer than 4n array slots, so `4 * n` is always safe. It's the standard choice.

### The three operations

All three are recursive and carry along `(node, start, end)`: the current node and the range it covers.

**Build:** if `start === end`, this is a leaf, so store `nums[start]`. Otherwise build the left child and the right child, then set this node to `combine(left, right)`. This is O(n), because each node is built once.

**Point update (set `nums[index] = value`):** walk down toward the leaf for `index`, going left if `index <= mid` and right otherwise. Set the leaf, then **recompute every node on the way back up**. This is O(log n): one path from the root to a leaf.

**Range query `[left..right]`:** each node compares its range `[start..end]` with the query range, and there are only three cases:

1. **No overlap** (`right < start` or `end < left`): this node contributes nothing, so return the **identity** (0 for sum, +Infinity for min, -Infinity for max).
2. **Full overlap** (`left <= start` and `end <= right`): the node's whole range is inside the query, so return its stored value directly, **without going deeper**.
3. **Partial overlap:** ask both children and combine their answers.

**Trace: `query(1, 2)` on `nums = [5, 2, 6, 3]`** (the answer should be 2 + 6 = 8):

```
node 0 [0..3]: partial overlap with [1..2] → ask both children
├─ node 1 [0..1]: partial → ask both children
│  ├─ node 3 [0]: no overlap (0 < 1) → 0
│  └─ node 4 [1]: full overlap → 2
│     node 1 returns 0 + 2 = 2
└─ node 2 [2..3]: partial → ask both children
   ├─ node 5 [2]: full overlap → 6
   └─ node 6 [3]: no overlap (3 > 2) → 0
      node 2 returns 6 + 0 = 6
node 0 returns 2 + 6 = 8 ✔
```

**Why a query is O(log n):** at each level of the tree, at most two nodes are in the "partial overlap" case (the ones containing the query's left and right edges). Everything between them is fully covered and returns immediately. So the work is a small constant per level, and there are O(log n) levels.

### Implementation

The combine function and its identity are passed in, so the same class handles sum, min and max.

```ts
class SegmentTree {
  private n: number;
  private tree: number[];
  private combine: (a: number, b: number) => number;
  private identity: number; // a value that doesn't change the answer: 0 for sum, Infinity for min

  constructor(
    nums: number[],
    combine: (a: number, b: number) => number = (a, b) => a + b,
    identity = 0,
  ) {
    this.n = nums.length;
    this.combine = combine;
    this.identity = identity;
    this.tree = new Array(4 * this.n).fill(identity);
    if (this.n > 0) {
      this.build(nums, 0, 0, this.n - 1);
    }
  }

  // Set nums[index] = value. O(log n).
  update(index: number, value: number): void {
    this.updateNode(0, 0, this.n - 1, index, value);
  }

  // Combined value of nums[left..right] (inclusive). O(log n).
  query(left: number, right: number): number {
    return this.queryNode(0, 0, this.n - 1, left, right);
  }

  // `node` covers nums[start..end].
  // Children (0-indexed): 2 * node + 1 and 2 * node + 2.
  // For a 1-indexed tree (root = 1), use 2 * node and 2 * node + 1 instead.
  private build(nums: number[], node: number, start: number, end: number): void {
    if (start === end) {
      this.tree[node] = nums[start]; // leaf
      return;
    }
    const mid = Math.floor((start + end) / 2);
    const leftChild = 2 * node + 1;
    const rightChild = 2 * node + 2;
    this.build(nums, leftChild, start, mid);
    this.build(nums, rightChild, mid + 1, end);
    this.tree[node] = this.combine(this.tree[leftChild], this.tree[rightChild]);
  }

  private updateNode(node: number, start: number, end: number, index: number, value: number): void {
    if (start === end) {
      this.tree[node] = value; // reached the leaf for `index`
      return;
    }
    const mid = Math.floor((start + end) / 2);
    const leftChild = 2 * node + 1;
    const rightChild = 2 * node + 2;
    if (index <= mid) {
      this.updateNode(leftChild, start, mid, index, value);
    } else {
      this.updateNode(rightChild, mid + 1, end, index, value);
    }
    // Recompute this node from its (possibly changed) children.
    this.tree[node] = this.combine(this.tree[leftChild], this.tree[rightChild]);
  }

  private queryNode(node: number, start: number, end: number, left: number, right: number): number {
    // Case 1: no overlap.
    if (right < start || end < left) {
      return this.identity;
    }
    // Case 2: full overlap. Use the stored answer.
    if (left <= start && end <= right) {
      return this.tree[node];
    }
    // Case 3: partial overlap. Combine both halves.
    const mid = Math.floor((start + end) / 2);
    const leftAnswer = this.queryNode(2 * node + 1, start, mid, left, right);
    const rightAnswer = this.queryNode(2 * node + 2, mid + 1, end, left, right);
    return this.combine(leftAnswer, rightAnswer);
  }
}
```

**Using it for different operations:**

```typescript
const nums = [5, 2, 6, 3];

// Sum (the default).
const sums = new SegmentTree(nums);
sums.query(1, 2); // 8
sums.update(1, 10); // nums is now [5, 10, 6, 3]
sums.query(0, 1); // 15

// Minimum: combine with Math.min; the identity is Infinity (the minimum of Infinity and x is x).
const minimums = new SegmentTree(nums, (a, b) => Math.min(a, b), Infinity);
minimums.query(0, 3); // 2

// Maximum: combine with Math.max; the identity is -Infinity.
const maximums = new SegmentTree(nums, (a, b) => Math.max(a, b), -Infinity);
maximums.query(0, 1); // 5
```

### Complexity

| Operation | Time | Why |
|---|---|---|
| Build | O(n) | Each of the ~2n nodes is computed once |
| Point update | O(log n) | One root-to-leaf path, recomputed on the way back |
| Range query | O(log n) | At most two partial nodes per level, and O(log n) levels |
| Space | O(n) | 4n array slots; recursion adds O(log n) call-stack depth |

### Common mistakes

- **The wrong identity.** Using 0 as the identity for a *min* tree makes every query that touches a "no overlap" node return 0. Use `Infinity` for min and `-Infinity` for max.
- **Mixing the two index layouts.** If the root is 0, the children are `2 * node + 1` and `2 * node + 2`. If the root is 1, they're `2 * node` and `2 * node + 1`. Mixing them silently overwrites nodes.
- **Allocating `2 * n` for the recursive version.** That isn't always enough. Use `4 * n`.
- **Forgetting to recompute parents after an update.** The line after the recursive call in `updateNode` is what keeps every range answer correct.
- **Off-by-one in the split.** The left half is `[start..mid]` and the right half is `[mid + 1..end]`. Both must use the same `mid`.

### Remembering and explaining it

To rebuild it:
- *"Every node answers for a range. Build: leaves first, parents combine children."*
- *"Update: go down to the leaf, fix parents on the way back up."*
- *"Query: three cases. No overlap → identity, full overlap → stored value, partial → ask both children."*

To explain it: *"A segment tree stores the answer for every range in a balanced tree of ranges. Any query range splits into O(log n) stored ranges, so both queries and updates cost O(log n), and it works for min and max, which a Fenwick tree can't do."*

### LeetCode practice

1. [307. Range Sum Query - Mutable](https://leetcode.com/problems/range-sum-query-mutable/)
2. [699. Falling Squares](https://leetcode.com/problems/falling-squares/)
3. [715. Range Module](https://leetcode.com/problems/range-module/)
4. [2407. Longest Increasing Subsequence II](https://leetcode.com/problems/longest-increasing-subsequence-ii/)
5. [2569. Handling Sum Queries After Update](https://leetcode.com/problems/handling-sum-queries-after-update/)
6. [3165. Maximum Sum of Subsequence With Non-adjacent Elements](https://leetcode.com/problems/maximum-sum-of-subsequence-with-non-adjacent-elements/)

---
---

# Reference

## 17. Choosing the Right Structure

### Complexity summary

| Structure | Main operations | Time | Space |
|---|---|---|---|
| Stack (array) | push / pop / peek | O(1) (push amortized) | O(n) |
| Min Stack | push / pop / top / getMin | O(1) | O(n) |
| Queue (array + head index) | enqueue / dequeue / peek | O(1) (enqueue amortized) | O(n) |
| Singly linked list | insert/delete at head; insert at tail (with tail pointer) | O(1) | O(n) |
| | access by position / search | O(n) | |
| | reverse | O(n) time, O(1) space | |
| Doubly linked list | push/pop at both ends; remove a node you hold | O(1) | O(n) |
| Deque | push/pop at both ends | O(1) (amortized for the circular buffer) | O(n) |
| LRU cache | get / put | O(1) | O(capacity) |
| LFU cache | get / put | O(1) | O(capacity) |
| Binary heap | push / pop | O(log n) | O(n) |
| | peek | O(1) | |
| | heapify (build from n elements) | O(n) | |
| Binary search tree | search / insert / delete | O(h): O(log n) balanced, O(n) worst | O(n) |
| Trie | insert / search / startsWith | O(L), L = word length | O(total characters) |
| Graph (adjacency list) | list neighbors of u | O(degree of u) | O(V + E) |
| | edge check (with `Set`s) | O(1) | |
| Monotonic stack / queue | processing n elements | O(n) total, O(1) amortized each | O(n) |
| Union-Find | find / union / connected | O(α(n)), effectively O(1) | O(n) |
| SortedList (sorted array) | has / floor / ceiling / rank | O(log n) | O(n) |
| | add / remove | O(n) | |
| Fenwick tree | point add / prefix sum / range sum | O(log n) | O(n) |
| Segment tree | point update / range query | O(log n) | O(n) |
| | build | O(n) | |

### From problem wording to structure

| When the problem says or implies… | Reach for | Because |
|---|---|---|
| valid / balanced / nested / matching brackets or tags | Stack | The most recent unclosed item must be closed first |
| undo, back button, "cancel adjacent" items | Stack | The newest item interacts with the next one |
| next greater / next smaller / previous greater element, histogram areas | Monotonic stack | Elements waiting for an answer stay sorted, and each is resolved once |
| minimum steps, shortest path in an unweighted graph or grid, level by level | Queue (for BFS) | Processes everything at distance d before distance d + 1 |
| process in arrival order, recent requests in a time window | Queue | First in, first out |
| sliding window maximum / minimum | Monotonic deque | The front is always the window's answer; each element enters and leaves once |
| edge weights are only 0 and 1 | Deque (0-1 BFS) | Weight 0 goes to the front, weight 1 to the back |
| remove a specific item in O(1) while keeping order | Map + doubly linked list | The map finds the node, and the list unlinks it |
| least recently used / cache eviction | LRU cache | Map + doubly linked list |
| least frequently used, ties by recency | LFU cache | Frequency buckets of LRU-ordered sets + `minFreq` |
| top k, kth largest / smallest, k closest, k most frequent | Heap of size k | O(n log k) and works on streams |
| merge k sorted lists or arrays | Heap | Always pick the smallest current front |
| repeatedly take the min / max while items keep arriving | Heap | O(log n) per operation |
| median of a stream | Two heaps | The roots are the two middle elements |
| meeting rooms, scheduling by end time | Heap | The earliest-ending item is always at the root |
| weighted shortest path | Heap (for Dijkstra) | Always expand the cheapest known path next |
| sorted data with inserts, search by value | Binary search tree | O(h) search, insert, delete |
| prefix, starts with, autocomplete, many words at once | Trie | Prefix lookups cost O(prefix length) |
| maximum XOR of a pair | Binary trie | Walk the opposite bit greedily |
| edges, prerequisites, dependencies, flights, friendships | Graph as an adjacency list | Convert the input first, then traverse |
| course order, build order | Directed graph + in-degree | Start from vertices with no prerequisites |
| grid of cells, "islands", "spread" | Implicit grid graph | Generate neighbors with direction offsets |
| transform one state into another with small moves | Implicit graph | Generate neighbors by rule |
| connected components, merge groups, redundant edge, "are they connected?" with edges arriving | Union-Find | Near-O(1) merge and connectivity checks |
| next larger / next smaller **value** (not position) in a changing set, interval booking | SortedList (TreeMap substitute) | Floor/ceiling by binary search |
| range sums with updates, "count smaller after self", inversions | Fenwick tree | O(log n) prefix sums over a changing array |
| range min / max with updates | Segment tree | Stores min/max for every range in a tree |

### A practice plan

Reading is not enough. The goal is to **write each structure from a blank editor, from memory, while explaining it out loud**, the way you will in an interview. A plan that works:

1. **Learn one structure at a time, in the order of this document.** Read the section, close it, and write the implementation from memory. Then compare it with the guide and note what you got wrong. Those notes are your personal "common mistakes" list.
2. **Say the explanation out loud while typing.** Use the "Remembering and explaining it" part of each section as your script. In an interview, silent coding reads as uncertainty.
3. **Test immediately.** Use the traces in each section as test cases. For example, push the heapify example `[9, 5, 7, 1, 3, 8]` and pop everything; the output must come out sorted.
4. **Repeat on later days until it's automatic.** Space the repetitions out: the next day, three days later, a week later. Rough targets for writing each one from memory:

| Structure | Target time |
|---|---|
| Queue with head index | 2 minutes |
| ListNode + dummy node + reverse | 3 minutes |
| Doubly linked list with sentinels | 5 minutes |
| LRU cache (Map + doubly linked list) | 7 minutes |
| Heap (push, pop, sift up, sift down, heapify) | 7 minutes |
| Trie | 4 minutes |
| Graph builder (Map-based, directed + in-degree) | 3 minutes |
| Union-Find | 4 minutes |
| Min Stack, Monotonic stack / queue | 3 minutes each |
| SortedList (lower bound, floor, ceiling) | 5 minutes |
| LFU cache | 10 minutes |
| Fenwick tree | 4 minutes |
| Segment tree | 8 minutes |

5. **Then use them inside real problems.** A structure is only interview-ready once you've used it to solve problems under time pressure. Each section's "When to use" list names problems to practice with.

### LeetCode practice

For each problem, state the structure you chose, the required operations, and why the nearest alternative would be less suitable.

1. [146. LRU Cache](https://leetcode.com/problems/lru-cache/)
2. [23. Merge k Sorted Lists](https://leetcode.com/problems/merge-k-sorted-lists/)
3. [200. Number of Islands](https://leetcode.com/problems/number-of-islands/)
4. [207. Course Schedule](https://leetcode.com/problems/course-schedule/)
5. [239. Sliding Window Maximum](https://leetcode.com/problems/sliding-window-maximum/)
6. [307. Range Sum Query - Mutable](https://leetcode.com/problems/range-sum-query-mutable/)
7. [208. Implement Trie (Prefix Tree)](https://leetcode.com/problems/implement-trie-prefix-tree/)
8. [460. LFU Cache](https://leetcode.com/problems/lfu-cache/)
