# 🧭 Mastering Time & Space Complexity for Trees and Graphs (TypeScript Edition)

> **Goal:** By the end of this guide you should be able to look at any tree or graph solution and *derive* its time and space complexity yourself. You won't need to memorize them.
>
> **How to use it:** Read each section in order. Each **🧪 Study Problem** gives the problem and a solution, then asks you for the complexity. **Answer before you open the hidden answer.** Saying your reasoning out loud is good practice for the interview itself.

---

## Table of Contents

0. [The One Mental Model You Need: "Charge the Work"](#0-the-one-mental-model-you-need-charge-the-work)
1. [Trees (Binary Trees First)](#1-trees-binary-trees-first)
2. [Graph Representations: List vs Map vs Matrix](#2-graph-representations-list-vs-map-vs-matrix)
3. [Core Traversals: BFS & DFS on Graphs and Grids](#3-core-traversals-bfs--dfs-on-graphs-and-grids)
4. [The Most Frequent Graph Problems](#4-the-most-frequent-graph-problems)
5. [Weighted Graphs: Dijkstra, Bellman-Ford, Floyd-Warshall, MST](#5-weighted-graphs-dijkstra-bellman-ford-floyd-warshall-mst)
6. [Exponential Graph Problems (Backtracking on Graphs)](#6-exponential-graph-problems-backtracking-on-graphs)
7. [TypeScript Traps That Silently Ruin Your Complexity](#7-typescript-traps-that-silently-ruin-your-complexity)
8. [The 6-Step Complexity Checklist + Cheat Sheet](#8-the-6-step-complexity-checklist--cheat-sheet)
9. [Final Exam](#9-final-exam)

---

## 0. The One Mental Model You Need: "Charge the Work"

Most people go wrong on graph complexity because they **multiply nested loops**:

```ts
for (const node of nodes) {          // V times
  for (const nei of graph[node]) {   // "up to V times"?
    ...
  }
}
// ❌ "So it's O(V²)!"  or  ❌ "O(V · E)!"
```

The inner loop does **not** run its maximum every time. A node with 2 neighbors runs it twice, and a node with 0 neighbors runs it zero times.

### ✅ The correct technique: amortized accounting

Instead of asking *"how many times does the inner loop run per outer iteration?"*, ask:

> **"Over the entire algorithm, how many times is each vertex touched, and how many times is each edge touched?"**

Then add it up:

```
Total time = (work per vertex × V) + (work per edge × E)
```

For the inner loop above, summing over all nodes gives:

```
Σ deg(v) for all v  =  E        (directed graph: each edge stored once)
Σ deg(v) for all v  =  2E       (undirected graph: each edge stored twice)
```

That second line is called the **Handshaking Lemma**. If 3 people each shake hands with 2 others, you count 6 "hand-ends" but only 3 handshakes. In the same way, every undirected edge `u—v` shows up in both `u`'s list and `v`'s list.

So the loop costs **O(V) for the outer part + O(E) for all inner iterations combined = O(V + E)**.

> 🔑 **Memorize this sentence for interviews:**
> *"Each vertex is visited once, and each edge is examined once (twice if undirected), so it's O(V + E)."*

### Why do we write `V + E` and not just `E` or just `V`?

Because either one can dominate:

| Graph type | Relationship | `O(V + E)` becomes |
|---|---|---|
| Tree | E = V − 1 | O(V) |
| Sparse graph (roads, social graphs) | E ≈ V | O(V) |
| Dense graph | E ≈ V² | O(V²) |
| Many isolated nodes | E ≈ 0 | O(V), and you still have to look at every node |

`V + E` covers every case. The maximum number of edges is:
- Directed: `V(V−1)` → O(V²)
- Undirected: `V(V−1)/2` → O(V²)

So **E is always O(V²)**, and **log E is always O(log V)**, because `log V² = 2 log V`. You'll use that fact in Dijkstra later.

### Space: two different questions

Always separate these:

1. **Input space.** This is the graph itself. It's usually given to you, so you often don't count it. If **you build** the adjacency list, you count it.
2. **Auxiliary space.** This is the extra memory your algorithm uses: `visited`, queue, stack, **recursion call stack**, maps, and so on.

> 💬 In an interview, say it explicitly: *"Building the adjacency list takes O(V + E) space. On top of that, the visited set and the queue take O(V)."*

---

## 1. Trees (Binary Trees First)

A tree is a graph with **V nodes and exactly V − 1 edges**, connected, with no cycles. Because `E = V − 1`, **O(V + E) collapses to O(n)**. Most tree complexities follow from that.

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

### 1.1 The two numbers that matter: `n` and `h`

- **n** = number of nodes. It drives **time**, because a full traversal touches each node once.
- **h** = height. It drives **space for DFS**, because the recursion stack holds one frame per level of the current path.

```
Balanced tree (h = log n)        Skewed tree (h = n), basically a linked list
         4                        1
       /   \                       \
      2     6                       2
     / \   / \                       \
    1   3 5   7                       3
                                       \
                                        4
```

| Tree shape | Height h | DFS stack space |
|---|---|---|
| Balanced / complete | O(log n) | O(log n) |
| Skewed / worst case | O(n) | O(n) |
| Unknown (default in interviews) | O(h), worst O(n) | **O(h)**, and say "O(n) worst case" |

> 🔑 **Interview phrasing:** *"Time is O(n) because we visit each node once. Space is O(h) for the recursion stack. That's O(log n) if the tree is balanced and O(n) if it's skewed."*

### 1.2 Why DFS on a tree is O(n): the "visit once" proof

```ts
function dfs(node: TreeNode | null): void {
  if (node === null) return;   // O(1)
  // ... O(1) work here ...
  dfs(node.left);
  dfs(node.right);
}
```

- Each node is entered **exactly once**, so there are n calls with real work.
- Each node makes 2 calls, so there are about **n + 1 calls on `null`**. Each of those is O(1).
- Total: n × O(1) + (n + 1) × O(1) = **O(n)**.

**The rule:** `Time = (number of calls) × (work per call, excluding recursive calls)`.

If the per-call work is **not** O(1), for example copying an array or calling another O(n) function inside, you multiply. Watch for that.

### 1.3 BFS (level order) on a tree: space is the *width*

```ts
function levelOrder(root: TreeNode | null): number[][] {
  const result: number[][] = [];
  if (!root) return result;

  const queue: TreeNode[] = [root];
  let head = 0; // index pointer: avoids O(n) Array.shift()

  while (head < queue.length) {
    const levelSize = queue.length - head;
    const level: number[] = [];
    for (let i = 0; i < levelSize; i++) {
      const node = queue[head++];
      level.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    result.push(level);
  }
  return result;
}
```

- **Time:** O(n). Each node is pushed once and popped once.
- **Space:** O(w), where w is the maximum width. In a perfect tree, the last level holds about **n/2** nodes, so the space is **O(n)**.

> 💡 Note: with the `head` pointer trick, the array actually keeps every node, so the memory is O(n) regardless. Using a real queue, or slicing per level, gives O(w). Either way the worst case is O(n).

**DFS vs BFS space on trees, side by side:**

| Shape | DFS (O(h)) | BFS (O(w)) |
|---|---|---|
| Balanced | O(log n) ✅ small | O(n) ❌ big (wide bottom level) |
| Skewed | O(n) ❌ | O(1) ✅ (width is 1) |

That's a nice trade-off to bring up in interviews.

---

### 🧪 Study Problem 1.1 — Maximum Depth of Binary Tree (LC 104)

*Asked often at Amazon, Meta, and Google as a warm-up.*

```ts
function maxDepth(root: TreeNode | null): number {
  if (root === null) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}
```

**🤔 What are the time and space complexities?**

<details>
<summary>👉 Answer</summary>

- **Time: O(n).** Each node is visited exactly once, and the work per call is O(1) (`Math.max` of 2 numbers is O(1)).
- **Space: O(h).** That's the recursion stack depth. O(log n) when balanced, O(n) when skewed.

**Why not O(1) space?** There are no extra data structures, but **recursion is not free**. Every pending call holds a stack frame. A beginner mistake is to say "no extra arrays, so O(1)".
</details>

---

### 🧪 Study Problem 1.2 — Balanced Binary Tree (LC 110), naive version

```ts
function height(node: TreeNode | null): number {
  if (!node) return 0;
  return 1 + Math.max(height(node.left), height(node.right));
}

function isBalanced(root: TreeNode | null): boolean {
  if (!root) return true;
  const diff = Math.abs(height(root.left) - height(root.right));
  return diff <= 1 && isBalanced(root.left) && isBalanced(root.right);
}
```

**🤔 Time complexity? Careful: the per-call work is not O(1).**

<details>
<summary>👉 Answer</summary>

`isBalanced` is called on every node (n calls), and **each call runs `height()` on its subtree**, which costs O(size of that subtree).

So we need: **Σ (subtree size) over all nodes**. Another way to count it: each node gets counted once for **every ancestor** it has, which is its depth.

- **Balanced tree:** each node has about log n ancestors → **O(n log n)**
- **Skewed tree:** subtree sizes are n, n−1, n−2, … → n(n+1)/2 → **O(n²)**

**Space: O(h)**, recursion depth.

This counting trick, *"each node is counted once per ancestor"*, comes up again and again with nested tree recursion.
</details>

### 🧪 Study Problem 1.3 — Balanced Binary Tree, optimal version

```ts
function isBalanced(root: TreeNode | null): boolean {
  // Returns the height, or -1 as a sentinel meaning "unbalanced"
  const check = (node: TreeNode | null): number => {
    if (!node) return 0;
    const left = check(node.left);
    if (left === -1) return -1;
    const right = check(node.right);
    if (right === -1) return -1;
    if (Math.abs(left - right) > 1) return -1;
    return 1 + Math.max(left, right);
  };
  return check(root) !== -1;
}
```

**🤔 Time and space?**

<details>
<summary>👉 Answer</summary>

- **Time: O(n).** We compute the height **bottom-up** and return it, so each node is processed once with O(1) work.
- **Space: O(h).**

**Lesson:** when a top-down solution recomputes something for every subtree, have the recursion **return that value upward**. That usually turns O(n²) into O(n). Interviewers love seeing this improvement.
</details>

---

### 🧪 Study Problem 1.4 — Path Sum II (LC 113): return all root-to-leaf paths that sum to target

*Commonly asked at Amazon and Microsoft.*

```ts
function pathSum(root: TreeNode | null, target: number): number[][] {
  const result: number[][] = [];
  const path: number[] = [];

  const dfs = (node: TreeNode | null, remaining: number): void => {
    if (!node) return;
    path.push(node.val);
    remaining -= node.val;

    if (!node.left && !node.right && remaining === 0) {
      result.push([...path]); // COPY the path: this costs O(path length)
    }

    dfs(node.left, remaining);
    dfs(node.right, remaining);
    path.pop(); // backtrack
  };

  dfs(root, target);
  return result;
}
```

**🤔 Time? Hint: what does `[...path]` cost, and how many times can it happen?**

<details>
<summary>👉 Answer</summary>

- The traversal itself is **O(n)**. `push` and `pop` are O(1) amortized.
- The copy `[...path]` costs **O(h)** and can run once per leaf. There are up to L leaves.
- Total: **O(n + L·h)**.

Worst case: think of a "broom" tree, a chain of n/2 nodes that then fans out into about n/2 leaves. Each leaf's path has length about n/2, so (n/2)·(n/2) = **O(n²)**.

- Balanced tree: L ≈ n/2, h = log n → **O(n log n)**
- Standard interview answer: **O(n²) worst case**

**Space:**
- Auxiliary: O(h) for the recursion and the `path` array.
- The output can be O(n²) in the worst case, so mention it separately: *"plus the output size"*.

**Lesson:** **copying is hidden work.** `[...arr]`, `arr.slice()`, `JSON.stringify`, and string concatenation all cost O(length).
</details>

---

### 🧪 Study Problem 1.5 — Lowest Common Ancestor of a **BST** (LC 235)

```ts
function lowestCommonAncestor(root: TreeNode, p: TreeNode, q: TreeNode): TreeNode {
  let node: TreeNode = root;
  while (true) {
    if (p.val < node.val && q.val < node.val) node = node.left!;
    else if (p.val > node.val && q.val > node.val) node = node.right!;
    else return node; // they split here (or one of them is this node)
  }
}
```

**🤔 Time and space?**

<details>
<summary>👉 Answer</summary>

- **Time: O(h).** We walk **one path** downward and never visit both subtrees. That's O(log n) balanced, O(n) skewed.
- **Space: O(1).** It's iterative with no stack.

**Lesson:** if the algorithm goes **down a single path** instead of visiting every node, time is **O(h)**, not O(n). This is the BST advantage: searching, inserting, LCA, floor/ceil.

Compare with LCA in a **general binary tree** (LC 236). That one has to search both sides, so it's O(n) time and O(h) space.
</details>

---

### 🧪 Study Problem 1.6 — Diameter of Binary Tree (LC 543)

*Commonly asked at Meta and Google.*

```ts
function diameterOfBinaryTree(root: TreeNode | null): number {
  let best = 0;
  const depth = (node: TreeNode | null): number => {
    if (!node) return 0;
    const l = depth(node.left);
    const r = depth(node.right);
    best = Math.max(best, l + r); // path passing through this node
    return 1 + Math.max(l, r);
  };
  depth(root);
  return best;
}
```

**🤔 Time and space?**

<details>
<summary>👉 Answer</summary>

**O(n) time, O(h) space.** It uses the same "return height upward" pattern as Problem 1.3. If you had written a helper `height()` and called it from every node, it would be O(n²) worst case, like Problem 1.2.
</details>

### 📌 Tree Summary

| Pattern | Time | Space |
|---|---|---|
| Visit every node (DFS / BFS) | O(n) | DFS O(h), BFS O(w) |
| Walk one root-to-leaf path (BST ops) | O(h) | O(1) iterative / O(h) recursive |
| Call an O(subtree) helper at every node | O(n log n) to O(n²) | O(h) |
| Copy the path at every leaf | O(n · h), worst O(n²) | O(h) + output |
| Build a tree from n items (e.g., n BST inserts) | O(n · h): O(n log n) balanced, O(n²) skewed | O(n) |

---

## 2. Graph Representations: List vs Map vs Matrix

Most interview problems give you an **edge list**, like `edges = [[0,1],[1,2],...]`, or a matrix. **Your first step, and its cost, is converting it.** Let's look at the three options.

Running example: **V = 4, undirected edges** `[[0,1],[0,2],[1,2],[2,3]]`

```
    0 ——— 1
     \   /
      \ /
       2 ——— 3
```

### 2.1 Adjacency List (array of arrays)

Use it when nodes are labeled `0..n-1`.

```ts
function buildAdjList(n: number, edges: number[][]): number[][] {
  // Array.from with a factory creates n DISTINCT arrays: O(n)
  // ⚠️ new Array(n).fill([]) is a bug: all n slots would share ONE array
  const graph: number[][] = Array.from({ length: n }, () => []);

  for (const [u, v] of edges) {   // E iterations
    graph[u].push(v);             // O(1) amortized
    graph[v].push(u);             // undirected: add both directions
  }
  return graph;
}
// graph = [[1,2], [0,2], [0,1,3], [2]]
```

**Build cost:**
- Time: O(V) to create the empty lists + O(E) to push edges = **O(V + E)**
- Space: V list headers + 2E entries (undirected) = **O(V + E)**

### 2.2 Adjacency Map (`Map<key, neighbors>`)

Use it when nodes are **strings, sparse IDs, or not known ahead of time**: words, airport codes, user IDs, `"r,c"` coordinates.

```ts
function buildAdjMap(edges: string[][]): Map<string, string[]> {
  const graph = new Map<string, string[]>();
  for (const [u, v] of edges) {
    if (!graph.has(u)) graph.set(u, []);   // O(1) average
    if (!graph.has(v)) graph.set(v, []);
    graph.get(u)!.push(v);
    graph.get(v)!.push(u);
  }
  return graph;
}
// edges like [["JFK","SFO"], ["SFO","ATL"]]
```

**Build cost:**
- Time: **O(V + E)** on average. `Map.get/set/has` are O(1) average in V8 because they're hash tables.
- Space: **O(V + E)**, with a bigger constant factor than an array because of hashing overhead.

> 💡 **String keys aren't free.** Hashing a string of length L costs O(L). For word graphs (Word Ladder), that L shows up in the complexity. For short IDs we treat it as O(1).

**Variant: `Map<string, Set<string>>`** gives O(1) "is there an edge u→v?" checks and removes duplicate edges automatically. It's used in Alien Dictionary, for example.

### 2.3 Adjacency Matrix (2D array)

```ts
function buildAdjMatrix(n: number, edges: number[][]): boolean[][] {
  // Creating n rows of n cells: O(n²) time and space, even with zero edges!
  const matrix: boolean[][] = Array.from({ length: n }, () => new Array(n).fill(false));
  for (const [u, v] of edges) {
    matrix[u][v] = true;
    matrix[v][u] = true;
  }
  return matrix;
}
//      0  1  2  3
// 0 [  F, T, T, F ]
// 1 [  T, F, T, F ]
// 2 [  T, T, F, T ]
// 3 [  F, F, T, F ]
```

**Build cost:**
- Time: O(V²) to initialize + O(E) to fill = **O(V²)**, because E ≤ V² anyway
- Space: **O(V²)**, **no matter how many edges there are**

### 2.4 Operation cost comparison (this table is very important)

| Operation | Adj. List (array) | Adj. Map | Adj. Matrix |
|---|---|---|---|
| **Build** | O(V + E) | O(V + E) avg | **O(V²)** |
| **Space** | O(V + E) | O(V + E) | **O(V²)** |
| Is there an edge u→v? | O(deg(u)) | O(deg(u)), or O(1) with Set | **O(1)** ✅ |
| Iterate neighbors of u | **O(deg(u))** ✅ | **O(deg(u))** ✅ | O(V) ❌ (scan the whole row) |
| Add edge | O(1) | O(1) avg | O(1) |
| Remove edge | O(deg(u)) | O(1) with Set | O(1) |
| Add vertex | O(1) amortized | O(1) avg | O(V²) (rebuild) |
| **Full BFS/DFS** | **O(V + E)** | **O(V + E)** | **O(V²)** |

**Why does BFS on a matrix cost O(V²)?** To find u's neighbors, you have to scan all V cells in row u, even if only one is `true`. You do that for V vertices, so V × V = **O(V²)**. The matrix makes you pay for the edges that *could* exist, not the ones that do.

### 2.5 When to choose which

| Situation | Choose | Why |
|---|---|---|
| Nodes are `0..n-1`, sparse graph (most interviews) | **Adjacency list** | Fastest and leanest. O(V + E) everywhere |
| Nodes are strings / arbitrary IDs / discovered on the fly | **Adjacency map** | No index mapping needed |
| Need frequent "does edge u→v exist?" checks | **Matrix**, or Map of Sets | O(1) lookup |
| Dense graph (E ≈ V²), small V (≤ ~1000) | **Matrix** | Same asymptotics, simpler, cache-friendly |
| Floyd-Warshall (all-pairs shortest paths) | **Matrix** | The algorithm is naturally a V×V table |
| Input is already a matrix (`isConnected[i][j]`) | Use it directly | Converting costs O(V²) anyway |
| Grid problems (islands, mazes) | **Don't build anything** | The grid *is* the graph. Neighbors come from 4 directions |

> 💬 **Interview phrasing:** *"Since the graph is sparse and nodes are 0 to n−1, I'll use an adjacency list. It's O(V + E) to build and lets BFS run in O(V + E) instead of O(V²) with a matrix."*

### 2.6 Grids: the implicit graph

A grid of R rows × C columns is a graph where:
- **V = R · C** (every cell is a vertex)
- Each cell has **at most 4 neighbors**, so **E ≤ 4V**, which is O(R · C)

So **O(V + E) = O(RC + 4RC) = O(R · C)**. With 8 directions it's still O(R · C), because 8 is a constant.

```ts
const DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]];
// neighbors of (r, c): (r+dr, c+dc) if in bounds. No adjacency structure needed.
```

---

### 🧪 Study Problem 2.1 — What does building cost?

You're given `n` and `edges` of length `m`, for a **directed** graph. You build an adjacency list, and then a **matrix** too.

**🤔 What are the time and space of each?**

<details>
<summary>👉 Answer</summary>

- **List:** O(n + m) time, O(n + m) space. Directed means one entry per edge (m entries, not 2m), but asymptotically it's the same.
- **Matrix:** O(n²) time and space. Initialization dominates, so the m edges don't change the bound.

If n = 100,000 and m = 200,000: the list has about 300K entries 👍, but the matrix has 10¹⁰ cells 💥, which is about 10 GB with booleans. **This is why constraints matter.** When you see n up to 10⁵, a matrix is impossible.
</details>

### 🧪 Study Problem 2.2 — Find the Town Judge (LC 997)

```ts
function findJudge(n: number, trust: number[][]): number {
  // score = in-degree − out-degree. The judge has score n − 1.
  const score = new Array<number>(n + 1).fill(0); // O(n)
  for (const [a, b] of trust) {                   // O(E)
    score[a]--;
    score[b]++;
  }
  for (let i = 1; i <= n; i++) {                  // O(n)
    if (score[i] === n - 1) return i;
  }
  return -1;
}
```

**🤔 Time and space?**

<details>
<summary>👉 Answer</summary>

- **Time: O(V + E)** = O(n + trust.length)
- **Space: O(V)**. We never built an adjacency structure. We only stored **degrees**.

**Lesson:** not every graph problem needs an adjacency list. If only **degree counts** matter, space drops to O(V).
</details>

---

## 3. Core Traversals: BFS & DFS on Graphs and Grids

### 3.1 BFS on an adjacency list

```ts
function bfs(graph: number[][], start: number): number[] {
  const n = graph.length;
  const visited = new Array<boolean>(n).fill(false); // O(V) space
  const order: number[] = [];
  const queue: number[] = [start];
  let head = 0;                                      // O(1) dequeue
  visited[start] = true;                             // mark WHEN ENQUEUING

  while (head < queue.length) {
    const node = queue[head++];
    order.push(node);
    for (const nei of graph[node]) {
      if (!visited[nei]) {
        visited[nei] = true;
        queue.push(nei);
      }
    }
  }
  return order;
}
```

**Charge the work** (Section 0):
- Each vertex enters the queue **at most once**, because `visited` guarantees it → O(V)
- When a vertex is dequeued, we scan its list once. Over all vertices that's Σ deg = O(E)
- **Time: O(V + E). Space: O(V)** for visited + queue (plus O(V + E) for the graph if you built it)

> ⚠️ **Mark visited when you enqueue, not when you dequeue.** If you mark on dequeue, a node can be enqueued many times, once by each neighbor, before it's processed. The queue can then grow to O(E) and you do extra work. It's still correct, but sloppier.

### 3.2 DFS: recursive and iterative

```ts
function dfsRecursive(graph: number[][], start: number): void {
  const visited = new Set<number>();
  const go = (node: number): void => {
    visited.add(node);
    for (const nei of graph[node]) {
      if (!visited.has(nei)) go(nei);
    }
  };
  go(start);
}

function dfsIterative(graph: number[][], start: number): void {
  const visited = new Set<number>();
  const stack: number[] = [start];
  while (stack.length) {
    const node = stack.pop()!;           // O(1)
    if (visited.has(node)) continue;
    visited.add(node);
    for (const nei of graph[node]) {
      if (!visited.has(nei)) stack.push(nei);
    }
  }
}
```

- **Time: O(V + E)** for both
- **Space:**
  - Recursive: O(V) for visited + **O(V) recursion depth** in the worst case. Picture a graph that's one long chain.
  - Iterative (this version): the stack may hold duplicates, so it's **O(E)** in the worst case. O(V + E) overall is a safe answer.

> 🔥 **JS/TS-specific:** V8's call stack overflows at roughly 10,000 frames, depending on the engine and frame size. If V can be 10⁵ (for example, a 1000×1000 grid), **recursive DFS can crash** with "Maximum call stack size exceeded". Mentioning this and offering iterative DFS or BFS is a strong senior-level signal.

### 3.3 Visiting ALL components (the outer loop)

```ts
for (let v = 0; v < n; v++) {
  if (!visited[v]) dfs(v);
}
```

Does the outer loop × the DFS make it O(V · (V + E))? **No.** `visited` is shared, so across **all** DFS calls each vertex and edge is processed once. The outer loop adds only O(V) for its own checks. Total: **O(V + E)**.

### 3.4 Why `visited` is non-negotiable

Without `visited`, a graph with a cycle (0→1→0) loops **forever**. In a DAG, you'd re-explore shared sub-paths, which can be **exponential** work. `visited` is what turns "explore all paths" into "explore all nodes".

---

### 🧪 Study Problem 3.1 — Number of Islands (LC 200)

*Probably the single most asked graph problem: Amazon, Meta, Google, Microsoft, Bloomberg.*

```ts
function numIslands(grid: string[][]): number {
  const R = grid.length, C = grid[0].length;
  let count = 0;

  const sink = (r: number, c: number): void => {
    if (r < 0 || c < 0 || r >= R || c >= C || grid[r][c] !== "1") return;
    grid[r][c] = "0"; // mark visited by mutating: no extra visited set
    sink(r + 1, c);
    sink(r - 1, c);
    sink(r, c + 1);
    sink(r, c - 1);
  };

  for (let r = 0; r < R; r++) {
    for (let c = 0; c < C; c++) {
      if (grid[r][c] === "1") {
        count++;
        sink(r, c);
      }
    }
  }
  return count;
}
```

**🤔 Time and space? (Remember the outer loop discussion.)**

<details>
<summary>👉 Answer</summary>

- **Time: O(R · C).** The double loop visits every cell once. Each land cell is sunk once and then becomes "0", so it never starts work again. Each sunk cell makes 4 O(1) calls. Total O(RC).
- **Space: O(R · C)** worst case for the recursion stack. If the whole grid is land, the DFS can snake through every cell, giving a depth of R·C.

**BFS alternative:** the queue holds at most about O(min(R, C)) cells at once for a flood fill (a diagonal "wave front"), but many people answer O(RC) to be safe. Both are acceptable if you explain.

**Follow-up you might get:** "Don't modify the input." Then you add a `visited` boolean grid, which is still O(RC) space.
</details>

### 🧪 Study Problem 3.2 — Number of Provinces (LC 547)

*The input is an n×n adjacency matrix `isConnected`.*

```ts
function findCircleNum(isConnected: number[][]): number {
  const n = isConnected.length;
  const visited = new Array<boolean>(n).fill(false);
  let provinces = 0;

  const dfs = (i: number): void => {
    visited[i] = true;
    for (let j = 0; j < n; j++) {          // scan the WHOLE row
      if (isConnected[i][j] === 1 && !visited[j]) dfs(j);
    }
  };

  for (let i = 0; i < n; i++) {
    if (!visited[i]) {
      provinces++;
      dfs(i);
    }
  }
  return provinces;
}
```

**🤔 Is this O(V + E)?**

<details>
<summary>👉 Answer</summary>

**No: it's O(n²) time.** Each of the n vertices is DFS'd once, and each DFS call scans a **full row of n cells** to find its neighbors (Section 2.4). n × n = O(n²).

**Space: O(n)** for visited + recursion depth (the matrix is input).

Is O(n²) bad here? **No, it's optimal.** Just reading the input matrix is already O(n²). The rule: **you can't beat the size of the input** (unless you can skip parts of it).
</details>

### 🧪 Study Problem 3.3 — Rotting Oranges (LC 994): multi-source BFS

*Commonly asked at Amazon.*

```ts
function orangesRotting(grid: number[][]): number {
  const R = grid.length, C = grid[0].length;
  const queue: [number, number][] = [];
  let fresh = 0;

  for (let r = 0; r < R; r++) {
    for (let c = 0; c < C; c++) {
      if (grid[r][c] === 2) queue.push([r, c]); // ALL rotten oranges start together
      else if (grid[r][c] === 1) fresh++;
    }
  }

  const DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  let minutes = 0, head = 0;

  while (head < queue.length && fresh > 0) {
    const size = queue.length - head;
    for (let i = 0; i < size; i++) {
      const [r, c] = queue[head++];
      for (const [dr, dc] of DIRS) {
        const nr = r + dr, nc = c + dc;
        if (nr >= 0 && nc >= 0 && nr < R && nc < C && grid[nr][nc] === 1) {
          grid[nr][nc] = 2;
          fresh--;
          queue.push([nr, nc]);
        }
      }
    }
    minutes++;
  }
  return fresh === 0 ? minutes : -1;
}
```

**🤔 Many sources start at once. Does that multiply the cost by the number of sources?**

<details>
<summary>👉 Answer</summary>

**No.** Multi-source BFS is just BFS where the queue starts with several nodes. Every cell is still enqueued **at most once**, because we flip it to 2 when we enqueue it.

- **Time: O(R · C)**
- **Space: O(R · C)** for the queue

Running a separate BFS from **each** rotten orange would cost O(k · RC). Multi-source BFS avoids that. Remember this as an optimization pattern: *"distance to nearest X"* → put all X's in the queue at the start.
</details>

---

## 4. The Most Frequent Graph Problems

### 🧪 Study Problem 4.1 — Clone Graph (LC 133)

*Asked at Meta, Amazon, and Google.*

```ts
class GraphNode {
  val: number;
  neighbors: GraphNode[];
  constructor(val = 0, neighbors: GraphNode[] = []) {
    this.val = val;
    this.neighbors = neighbors;
  }
}

function cloneGraph(node: GraphNode | null): GraphNode | null {
  if (!node) return null;
  const clones = new Map<GraphNode, GraphNode>(); // original → copy (also acts as "visited")

  const dfs = (orig: GraphNode): GraphNode => {
    const existing = clones.get(orig);
    if (existing) return existing;
    const copy = new GraphNode(orig.val);
    clones.set(orig, copy);                // register BEFORE recursing (handles cycles)
    for (const nei of orig.neighbors) copy.neighbors.push(dfs(nei));
    return copy;
  };

  return dfs(node);
}
```

**🤔 Time and space?**

<details>
<summary>👉 Answer</summary>

- **Time: O(V + E).** Each node is cloned once, and each adjacency entry is processed once (pushed into the copy).
- **Space: O(V)** for the map + recursion stack. The **output graph** itself is O(V + E). Mention it separately: *"plus O(V + E) for the cloned graph, which is required output."*
</details>

### 🧪 Study Problem 4.2 — Course Schedule II (LC 210): Topological Sort (Kahn's BFS)

*A favorite at Google, Amazon, Meta, and Uber. Anything shaped like "dependencies/prerequisites/build order" is a topological sort.*

```ts
function findOrder(numCourses: number, prerequisites: number[][]): number[] {
  const graph: number[][] = Array.from({ length: numCourses }, () => []);
  const inDegree = new Array<number>(numCourses).fill(0);

  for (const [course, pre] of prerequisites) {
    graph[pre].push(course);   // edge: pre → course
    inDegree[course]++;
  }

  // Start with every course that has no prerequisites
  const queue: number[] = [];
  for (let i = 0; i < numCourses; i++) if (inDegree[i] === 0) queue.push(i);

  const order: number[] = [];
  let head = 0;
  while (head < queue.length) {
    const node = queue[head++];
    order.push(node);
    for (const next of graph[node]) {
      if (--inDegree[next] === 0) queue.push(next);
    }
  }

  // If we couldn't take every course, there's a cycle
  return order.length === numCourses ? order : [];
}
```

**🤔 Time and space? Break it into phases.**

<details>
<summary>👉 Answer</summary>

| Phase | Time |
|---|---|
| Create empty lists + inDegree | O(V) |
| Fill edges | O(E) |
| Initial queue scan | O(V) |
| BFS: each node dequeued once, each edge decremented once | O(V + E) |
| **Total** | **O(V + E)** |

**Space: O(V + E)**: graph O(V + E), inDegree/queue/order O(V).

**Pro tip:** when the solution has phases, **add them**. Sequential phases add; nested work multiplies. The biggest term wins.
</details>

### 🧪 Study Problem 4.3 — Detect a Cycle in a Directed Graph (DFS with 3 colors)

```ts
function hasCycle(n: number, edges: number[][]): boolean {
  const graph: number[][] = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) graph[u].push(v);

  // 0 = unvisited, 1 = on the current path (visiting), 2 = done
  const state = new Array<number>(n).fill(0);

  const dfs = (u: number): boolean => {
    state[u] = 1;
    for (const v of graph[u]) {
      if (state[v] === 1) return true;             // back edge → cycle
      if (state[v] === 0 && dfs(v)) return true;
    }
    state[u] = 2;
    return false;
  };

  for (let i = 0; i < n; i++) {
    if (state[i] === 0 && dfs(i)) return true;
  }
  return false;
}
```

**🤔 Why is it important that nodes become `2` (done) and are never re-explored?**

<details>
<summary>👉 Answer</summary>

- **Time: O(V + E). Space: O(V + E)** (graph) / O(V) auxiliary.

If you only used "on path / not on path" without the **done** state, a node reachable through many paths would be re-explored every time. In a DAG with many diamond shapes, that becomes **exponential**. The "done" state is the memoization that keeps it linear.
</details>

### 🧪 Study Problem 4.4 — Is Graph Bipartite? (LC 785)

```ts
function isBipartite(graph: number[][]): boolean {
  const n = graph.length;
  const color = new Array<number>(n).fill(-1);

  for (let start = 0; start < n; start++) {
    if (color[start] !== -1) continue;
    color[start] = 0;
    const queue = [start];
    let head = 0;
    while (head < queue.length) {
      const u = queue[head++];
      for (const v of graph[u]) {
        if (color[v] === -1) {
          color[v] = 1 - color[u];
          queue.push(v);
        } else if (color[v] === color[u]) {
          return false;
        }
      }
    }
  }
  return true;
}
```

**🤔 Time and space?**

<details>
<summary>👉 Answer</summary>

**O(V + E) time, O(V) auxiliary space.** It's plain BFS over every component (Section 3.3), and the `color` array doubles as `visited`. The graph is given as an adjacency list, so we don't count building it.
</details>

### 🧪 Study Problem 4.5 — Number of Connected Components with Union-Find (LC 323)

```ts
function countComponents(n: number, edges: number[][]): number {
  const parent = Array.from({ length: n }, (_, i) => i);
  const rank = new Array<number>(n).fill(0);

  const find = (x: number): number => {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]]; // path compression (halving)
      x = parent[x];
    }
    return x;
  };

  const union = (a: number, b: number): boolean => {
    let ra = find(a), rb = find(b);
    if (ra === rb) return false;
    if (rank[ra] < rank[rb]) [ra, rb] = [rb, ra];
    parent[rb] = ra;                         // union by rank
    if (rank[ra] === rank[rb]) rank[ra]++;
    return true;
  };

  let components = n;
  for (const [a, b] of edges) {
    if (union(a, b)) components--;
  }
  return components;
}
```

**🤔 What does each `find` cost, and what's the total?**

<details>
<summary>👉 Answer</summary>

- With **both** path compression and union by rank, each operation is **O(α(n)) amortized**. α is the inverse Ackermann function, which is **≤ 4 for any input that fits in the universe**. Treat it as effectively O(1), but name it correctly.
- **Time: O(V + E · α(V))** ≈ O(V + E). O(V) to initialize, plus E unions.
- **Space: O(V)** for parent + rank. We never built an adjacency list.

| Union-Find variant | Per operation |
|---|---|
| No optimizations | O(n) worst case (degenerates into a chain) |
| Only union by rank/size | O(log n) |
| Only path compression | O(log n) amortized |
| **Both** | **O(α(n)) amortized** |

**When to prefer Union-Find over DFS:** edges arrive **one at a time** (dynamic connectivity), "Redundant Connection" (LC 684), Kruskal's MST, "Accounts Merge" (LC 721).
</details>

### 🧪 Study Problem 4.6 — Word Ladder (LC 127): where string costs matter

*A classic at Amazon, Meta, and LinkedIn.*

```ts
function ladderLength(beginWord: string, endWord: string, wordList: string[]): number {
  const words = new Set(wordList);            // O(N · L) to hash N words of length L
  if (!words.has(endWord)) return 0;

  const queue: string[] = [beginWord];
  let head = 0, steps = 1;
  words.delete(beginWord);

  while (head < queue.length) {
    const size = queue.length - head;
    for (let s = 0; s < size; s++) {
      const word = queue[head++];
      if (word === endWord) return steps;
      const chars = word.split("");             // O(L)
      for (let i = 0; i < chars.length; i++) {  // L positions
        const original = chars[i];
        for (let code = 97; code <= 122; code++) { // 26 letters
          chars[i] = String.fromCharCode(code);
          const candidate = chars.join("");     // O(L) to build the string
          if (words.has(candidate)) {           // O(L) to hash it
            words.delete(candidate);            // remove = mark visited
            queue.push(candidate);
          }
        }
        chars[i] = original;
      }
    }
    steps++;
  }
  return 0;
}
```

**🤔 Let N = number of words and L = word length. What's the time? Count carefully: what's the cost of ONE candidate?**

<details>
<summary>👉 Answer</summary>

Charge the work per dequeued word:
- Each word is dequeued **at most once** → N words
- For each: L positions × 26 letters = 26L candidates
- For each candidate: build the string **O(L)** + hash lookup **O(L)** → O(L)

**Time: O(N · 26 · L · L) = O(N · L²)**
**Space: O(N · L)** for the set and queue of strings

**The big lesson:** here, **an "O(1)" Set lookup is really O(L)**, because hashing a string reads every character. For problems where string length is a real input parameter, include it. Interviewers at senior level notice this.

Why not build a full adjacency graph first? Comparing all pairs of words costs O(N² · L). That's worse when N is large, which is why we generate neighbors on the fly.
</details>

---

## 5. Weighted Graphs: Dijkstra, Bellman-Ford, Floyd-Warshall, MST

> TypeScript has **no built-in heap/priority queue**. In interviews, you either write a quick binary heap or say *"assume a MinPriorityQueue with O(log n) push/pop"*. LeetCode provides `@datastructures-js/priority-queue`.

A minimal binary heap, with cost **push O(log n), pop O(log n), peek O(1)**:

```ts
class MinHeap<T> {
  private data: T[] = [];
  constructor(private compare: (a: T, b: T) => number) {}
  get size(): number { return this.data.length; }

  push(item: T): void {                       // O(log n): sift up
    this.data.push(item);
    let i = this.data.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.compare(this.data[i], this.data[p]) >= 0) break;
      [this.data[i], this.data[p]] = [this.data[p], this.data[i]];
      i = p;
    }
  }

  pop(): T | undefined {                      // O(log n): sift down
    if (this.data.length === 0) return undefined;
    const top = this.data[0];
    const last = this.data.pop()!;
    if (this.data.length > 0) {
      this.data[0] = last;
      let i = 0;
      const n = this.data.length;
      while (true) {
        const l = 2 * i + 1, r = l + 1;
        let smallest = i;
        if (l < n && this.compare(this.data[l], this.data[smallest]) < 0) smallest = l;
        if (r < n && this.compare(this.data[r], this.data[smallest]) < 0) smallest = r;
        if (smallest === i) break;
        [this.data[i], this.data[smallest]] = [this.data[smallest], this.data[i]];
        i = smallest;
      }
    }
    return top;
  }
}
```

### 🧪 Study Problem 5.1 — Network Delay Time (LC 743): Dijkstra

*Asked at Google, Amazon, and Uber.*

```ts
function networkDelayTime(times: number[][], n: number, k: number): number {
  const graph: [number, number][][] = Array.from({ length: n + 1 }, () => []);
  for (const [u, v, w] of times) graph[u].push([v, w]);

  const dist = new Array<number>(n + 1).fill(Infinity);
  dist[k] = 0;
  const heap = new MinHeap<[number, number]>((a, b) => a[0] - b[0]); // [distance, node]
  heap.push([0, k]);

  while (heap.size > 0) {
    const [d, u] = heap.pop()!;
    if (d > dist[u]) continue;              // stale entry: skip it ("lazy deletion")
    for (const [v, w] of graph[u]) {
      const nd = d + w;
      if (nd < dist[v]) {
        dist[v] = nd;
        heap.push([nd, v]);
      }
    }
  }

  let max = 0;
  for (let i = 1; i <= n; i++) max = Math.max(max, dist[i]);
  return max === Infinity ? -1 : max;
}
```

**🤔 Time and space? Hint: how many items can go into the heap in total?**

<details>
<summary>👉 Answer</summary>

Charge the work:
- Each **edge** relaxation can push at most one entry → up to **E pushes** (the heap may hold stale duplicates)
- Each push/pop costs O(log(heap size)) = O(log E)
- Each vertex's adjacency list is scanned once (the stale check skips repeats) → O(V + E)

**Time: O((V + E) log E)**, and since log E ≤ 2 log V, that's **O((V + E) log V)**. You'll often see it written **O(E log V)** for connected graphs.

**Space: O(V + E)**: the graph, plus the heap can hold O(E) entries, plus dist O(V).

**Why the `log`?** BFS uses a plain queue with O(1) operations. Dijkstra needs "the closest unfinished node next", and a heap delivers that in O(log n). **BFS + heap = Dijkstra**, so O(V + E) gets a log factor.

**Key condition:** Dijkstra requires **non-negative weights**.
</details>

### 🧪 Study Problem 5.2 — Cheapest Flights Within K Stops (LC 787): Bellman-Ford style

*Commonly asked at Amazon and Airbnb.*

```ts
function findCheapestPrice(n: number, flights: number[][], src: number, dst: number, k: number): number {
  let prices = new Array<number>(n).fill(Infinity);
  prices[src] = 0;

  for (let i = 0; i <= k; i++) {            // k + 1 rounds (k stops = k + 1 edges)
    const next = [...prices];               // copy: O(V)
    for (const [u, v, w] of flights) {      // relax EVERY edge: O(E)
      if (prices[u] !== Infinity && prices[u] + w < next[v]) {
        next[v] = prices[u] + w;
      }
    }
    prices = next;
  }
  return prices[dst] === Infinity ? -1 : prices[dst];
}
```

**🤔 Time and space?**

<details>
<summary>👉 Answer</summary>

- Each round: copy O(V) + relax all E edges O(E)
- k + 1 rounds → **Time: O(k · (V + E))**
- **Space: O(V)**. Just two price arrays. No adjacency list needed; we loop over the edge list directly.

**Classic Bellman-Ford** (no stop limit) runs **V − 1 rounds**, so **O(V · E)**. It's slower than Dijkstra but **handles negative weights** and can **detect negative cycles** (if a V-th round still improves something, there's a negative cycle).
</details>

### 🧪 Study Problem 5.3 — Floyd-Warshall (all-pairs shortest paths)

*Used in LC 1334, "Find the City With the Smallest Number of Neighbors at a Threshold Distance".*

```ts
function floydWarshall(n: number, edges: number[][]): number[][] {
  const dist = Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => (i === j ? 0 : Infinity))
  );
  for (const [u, v, w] of edges) {
    dist[u][v] = Math.min(dist[u][v], w);
    dist[v][u] = Math.min(dist[v][u], w);
  }
  for (let mid = 0; mid < n; mid++)          // try each node as an intermediate stop
    for (let i = 0; i < n; i++)
      for (let j = 0; j < n; j++)
        if (dist[i][mid] + dist[mid][j] < dist[i][j])
          dist[i][j] = dist[i][mid] + dist[mid][j];
  return dist;
}
```

**🤔 Time and space?**

<details>
<summary>👉 Answer</summary>

- **Time: O(V³).** Three nested loops, each running exactly V times. Here simple loop multiplication *is* correct, because every loop always runs fully.
- **Space: O(V²)** for the distance matrix.

**When to pick it:** V ≤ ~400 and you need distances between **all pairs**. Alternative: run Dijkstra from every node → O(V · (V + E) log V), which is better for sparse graphs.
</details>

### 🧪 Study Problem 5.4 — Min Cost to Connect All Points (LC 1584): MST

**Option A, Kruskal** (sort edges + Union-Find):

```ts
function minCostConnectPoints(points: number[][]): number {
  const n = points.length;
  const edges: [number, number, number][] = [];
  for (let i = 0; i < n; i++)
    for (let j = i + 1; j < n; j++) {
      const d = Math.abs(points[i][0] - points[j][0]) + Math.abs(points[i][1] - points[j][1]);
      edges.push([d, i, j]);
    }
  edges.sort((a, b) => a[0] - b[0]);             // sort E edges

  const parent = Array.from({ length: n }, (_, i) => i);
  const find = (x: number): number => {
    while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x]; }
    return x;
  };

  let cost = 0, used = 0;
  for (const [d, a, b] of edges) {
    const ra = find(a), rb = find(b);
    if (ra !== rb) {
      parent[ra] = rb;
      cost += d;
      if (++used === n - 1) break;               // an MST has exactly n − 1 edges
    }
  }
  return cost;
}
```

**🤔 Points form a complete graph. What is E here, and what dominates?**

<details>
<summary>👉 Answer</summary>

- Every pair is an edge → **E = n(n−1)/2 = O(n²)**
- Building edges: O(n²)
- **Sorting: O(E log E) = O(n² log n²) = O(n² log n)** ← dominates. JS `Array.prototype.sort` is O(k log k) for k elements (V8 uses TimSort).
- Union-Find over E edges: O(E · α(n))
- **Time: O(n² log n). Space: O(n²)** for the edge list.

**General Kruskal: O(E log E). General Prim (with a heap): O(E log V).**

**Better for this dense graph:** Prim's algorithm with a simple array (no heap) runs in **O(n²)** time and **O(n)** space. For dense graphs, the simple array version beats the heap version. A great point to bring up.
</details>

---

## 6. Exponential Graph Problems (Backtracking on Graphs)

Once you **un-mark** a node after visiting it (backtracking), you're no longer exploring each node once. You're exploring **every path**. The number of paths can be exponential.

### 🧪 Study Problem 6.1 — All Paths From Source to Target (LC 797), in a DAG

```ts
function allPathsSourceTarget(graph: number[][]): number[][] {
  const target = graph.length - 1;
  const result: number[][] = [];
  const path: number[] = [0];

  const dfs = (node: number): void => {
    if (node === target) {
      result.push([...path]);    // O(V) copy
      return;
    }
    for (const next of graph[node]) {
      path.push(next);
      dfs(next);
      path.pop();
    }
  };

  dfs(0);
  return result;
}
```

**🤔 There's no `visited` set. Why is that OK, and what's the complexity?**

<details>
<summary>👉 Answer</summary>

It's a **DAG**, so there are no cycles and recursion can't loop forever. But nodes **are** revisited through different paths, on purpose.

**How many paths can there be?** If every node i connects to every j > i, then each of the V−2 middle nodes is either in a path or not. That's **2^(V−2) paths**.

- **Time: O(2^V · V).** Up to 2^V paths, each copied in O(V).
- **Space: O(V)** recursion + path. The **output** can be O(2^V · V).

**Recognize it:** "return **all** paths/combinations" → the output size itself is exponential, so no algorithm can be faster than the output.
</details>

### 🧪 Study Problem 6.2 — Word Search (LC 79): backtracking on a grid

*Commonly asked at Amazon, Microsoft, and Bloomberg.*

```ts
function exist(board: string[][], word: string): boolean {
  const R = board.length, C = board[0].length;

  const dfs = (r: number, c: number, i: number): boolean => {
    if (i === word.length) return true;
    if (r < 0 || c < 0 || r >= R || c >= C || board[r][c] !== word[i]) return false;

    const saved = board[r][c];
    board[r][c] = "#";                  // mark as used on THIS path
    const found =
      dfs(r + 1, c, i + 1) || dfs(r - 1, c, i + 1) ||
      dfs(r, c + 1, i + 1) || dfs(r, c - 1, i + 1);
    board[r][c] = saved;                // UN-mark: backtrack
    return found;
  };

  for (let r = 0; r < R; r++)
    for (let c = 0; c < C; c++)
      if (dfs(r, c, 0)) return true;
  return false;
}
```

**🤔 Let L = word length. How many paths can start from one cell?**

<details>
<summary>👉 Answer</summary>

- The first step has up to 4 directions. Every later step has at most **3**, because you can't go back to the cell you came from.
- From one start cell: about 4 · 3^(L−1) = **O(3^L)** paths
- There are R·C start cells

**Time: O(R · C · 3^L). Space: O(L)** recursion depth (the path is at most L long).

**Compare to Number of Islands:** that one never un-marks, so each cell is processed once → O(RC). Here, un-marking lets the same cell be reused on different paths → exponential.

> 🔑 **"Do I ever un-mark visited?"** No → polynomial (usually O(V + E)). Yes → probably exponential, so count the branching factor^depth.
</details>

---

## 7. TypeScript Traps That Silently Ruin Your Complexity

| Code | Real cost | Why it matters in graphs |
|---|---|---|
| `queue.shift()` | **O(n)**: re-indexes the whole array | BFS becomes **O(V²)**. Use a `head` index or a real deque |
| `queue.push()` / `stack.pop()` | O(1) amortized | ✅ Fine |
| `arr.unshift(x)` | O(n) | Same problem as `shift` |
| `arr.includes(x)` / `arr.indexOf(x)` | O(n) | Using an array as `visited` → O(V) per check. Use `Set` or a boolean array |
| `new Set()` / `Map` get/set/has/delete | O(1) average | ✅, but string keys cost O(key length) to hash |
| `` visited.add(`${r},${c}`) `` | O(digits) to build the string + hashing, plus allocation | Fine asymptotically, but slow. Prefer `r * C + c` (a number) or a boolean grid |
| `[...arr]`, `arr.slice()`, `Array.from(arr)` | O(n) | Hidden O(n) inside loops or at every leaf (Problem 1.4) |
| `arr.concat(x)` inside recursion | O(n) per call | Creates a new array each time. Use push/pop backtracking instead |
| `str + char` in a loop | O(length) per concat (copy) | Building paths as strings → quadratic. Use arrays and `join` once |
| `arr.sort()` | O(n log n) time, O(n) space (TimSort) | Kruskal, sorting edges. Also: default sort is **lexicographic**! Always pass `(a, b) => a - b` |
| `Array.from({ length: n }, () => [])` | O(n) | ✅ Correct way to build an adjacency list |
| `new Array(n).fill([])` | O(n), but **a bug** | All slots point to the **same** array |
| `Object.keys(obj)` / `Object.entries(obj)` | O(k) | Calling it inside a loop multiplies cost |
| `JSON.stringify(x)` as a memo key | O(size of x) | Hidden cost on every call |
| `Math.max(...arr)` | O(n), and **crashes** for huge arrays (argument limit) | Use a loop or `reduce` for large arrays |
| Recursion depth > ~10k | Stack overflow | Use iterative DFS or BFS for large graphs/grids |

### 🧪 Study Problem 7.1 — Spot the bug in this BFS

```ts
function bfsSlow(graph: number[][], start: number): number[] {
  const visited: number[] = [start];
  const queue: number[] = [start];
  const order: number[] = [];
  while (queue.length) {
    const node = queue.shift()!;
    order.push(node);
    for (const nei of graph[node]) {
      if (!visited.includes(nei)) {
        visited.push(nei);
        queue.push(nei);
      }
    }
  }
  return order;
}
```

**🤔 Real time complexity? It looks like O(V + E).**

<details>
<summary>👉 Answer</summary>

Two hidden linear operations:
1. `queue.shift()` is O(V), done V times → **O(V²)**
2. `visited.includes(nei)` is O(V), done for **every edge** → **O(E · V)**

**Real time: O(V² + E·V) = O(V · E)** for a connected graph. On a graph with 10⁵ nodes and edges, that's about 10¹⁰ operations → Time Limit Exceeded.

**Fix:** a `head` pointer instead of `shift`, and a `boolean[]` or `Set` instead of `includes`. That brings it back to **O(V + E)**.
</details>

---

## 8. The 6-Step Complexity Checklist + Cheat Sheet

### ✅ The checklist: run through this for every graph solution

1. **Name your variables.** V (nodes), E (edges), or R×C for grids, n and h for trees, and L for string length if it matters.
2. **Cost of building.** Adjacency list/map → O(V + E). Matrix → O(V²). Nothing (grid, given list) → O(1).
3. **Charge the traversal.** How many times is each **vertex** processed? Each **edge**? With a visited set that's once each → O(V + E). Don't multiply loops blindly.
4. **Per-touch cost.** Is the work per vertex/edge really O(1)? Look for heaps (log), string hashing (L), copies (length), `shift`/`includes` (n), and helper calls on subtrees.
5. **Do you ever un-mark visited?** If yes, you're counting **paths**, not nodes → branching^depth (exponential).
6. **Space = structure + auxiliary.** Graph you built, visited, queue/stack/heap, **recursion depth**, plus output size (mention it separately).

Then **add sequential phases** and keep the dominant term.

### 📋 Cheat sheet

| Algorithm / Problem | Time | Space (aux.) | Notes |
|---|---|---|---|
| Tree DFS (any traversal) | O(n) | O(h) | h = log n balanced, n skewed |
| Tree BFS (level order) | O(n) | O(w) ≤ O(n) | |
| BST search/insert/delete | O(h) | O(1) iterative | |
| Build adjacency list / map | O(V + E) | O(V + E) | |
| Build adjacency matrix | O(V²) | O(V²) | Regardless of E |
| BFS / DFS (adjacency list) | O(V + E) | O(V) | |
| BFS / DFS (matrix) | O(V²) | O(V) | Row scan per node |
| Grid BFS / DFS / flood fill | O(R·C) | O(R·C) | V = RC, E ≤ 4V |
| Multi-source BFS | O(V + E) | O(V) | Not k × BFS |
| Connected components (DFS/BFS) | O(V + E) | O(V) | Shared visited |
| Union-Find (rank + compression) | O(V + E·α(V)) | O(V) | α ≤ 4 in practice |
| Topological sort (Kahn / DFS) | O(V + E) | O(V + E) | Cycle detection too |
| Cycle detection, directed (3 colors) | O(V + E) | O(V) | |
| Bipartite check | O(V + E) | O(V) | |
| Clone graph | O(V + E) | O(V) + output | |
| Dijkstra (binary heap) | O((V + E) log V) | O(V + E) | Non-negative weights only |
| Bellman-Ford | O(V · E) | O(V) | Negative weights OK |
| K-limited Bellman-Ford | O(k · (V + E)) | O(V) | LC 787 |
| Floyd-Warshall | O(V³) | O(V²) | All pairs |
| Kruskal MST | O(E log E) | O(V + E) | Sort dominates |
| Prim MST (heap) | O(E log V) | O(V + E) | |
| Prim MST (array, dense graph) | O(V²) | O(V) | Best for complete graphs |
| 0-1 BFS (deque) | O(V + E) | O(V) | Weights are only 0 or 1 |
| All paths in a DAG | O(2^V · V) | O(V) + output | Exponential |
| Grid word search (backtracking) | O(R·C·3^L) | O(L) | Exponential in L |
| Word Ladder | O(N · L²) | O(N · L) | String hashing costs L |

### 🧠 Memory tricks

- **"V + E = Visit Everything once."** Any traversal with a permanent visited set.
- **"Heap adds a log."** BFS → Dijkstra, O(V + E) → O((V + E) log V).
- **"Matrix makes you pay for the edges that could exist."** O(V²) no matter what.
- **"Un-mark = exponential."** Backtracking explores paths, not nodes.
- **"Tree time = n, tree space = h."**
- **"Can't beat the input."** If the input is a V×V matrix, O(V²) is optimal.
- **"Phases add, nesting multiplies, but only if the inner loop runs fully every time."**

### 💬 Interview script for stating complexity

> "Let V be the number of nodes and E the number of edges. Building the adjacency list costs O(V + E) time and space. The BFS visits each node once because of the visited set, and examines each edge at most twice since the graph is undirected, so the traversal is O(V + E). Overall time is O(V + E). Space is O(V + E) for the graph plus O(V) for the visited array and queue, so O(V + E) total."

---

## 9. Final Exam

Try each without looking back. Answers are hidden.

**Q1.** You run BFS from **every** node of a graph to find each node's farthest distance. Time?

<details><summary>👉 Answer</summary>

V separate BFS runs, each O(V + E) (visited is reset each time, so the "shared visited" argument doesn't apply) → **O(V · (V + E))**. Space O(V) per run, reused.
</details>

**Q2.** Pacific Atlantic Water Flow (LC 417): you start a DFS from every **ocean-border** cell, using **one shared visited grid per ocean**. Time?

<details><summary>👉 Answer</summary>

There are two oceans, each with a shared visited grid, so each cell is visited at most once per ocean → **O(R·C) time, O(R·C) space**. Running a separate DFS from *every cell* instead would be O((RC)²).
</details>

**Q3.** Shortest path in a binary matrix (LC 1091), 8 directions, BFS. Time?

<details><summary>👉 Answer</summary>

**O(n²)** for an n×n grid. 8 directions is still a constant, so E ≤ 8V = O(n²). Space O(n²).
</details>

**Q4.** Alien Dictionary (LC 269): N words, total characters C, alphabet of size U (≤ 26). You compare adjacent words to get edges, then topological sort. Time?

<details><summary>👉 Answer</summary>

Comparing adjacent pairs reads each character at most about twice → **O(C)**. The graph has U nodes and at most N−1 edges (one per adjacent pair) → topo sort O(U + N). **Total O(C)**, since U ≤ 26 and N ≤ C. Space O(U + N), effectively O(1) for the graph if you consider U constant, but say **O(U + min(U², N))** to be precise.
</details>

**Q5.** Serialize a binary tree with `result += node.val + ","` in a recursive DFS. Time?

<details><summary>👉 Answer</summary>

JS strings are immutable, so in the worst case each `+=` copies the whole string → O(n²). (V8 uses "rope" strings that often make this faster in practice, but don't rely on it in an interview.) **Safe answer and fix:** push into an array and `join(",")` once at the end → **O(n)**.
</details>

**Q6.** Dijkstra on a **grid** (Path With Minimum Effort, LC 1631). Time?

<details><summary>👉 Answer</summary>

V = R·C, E ≈ 4RC → O((V + E) log V) = **O(RC · log(RC))**. Space O(RC).
</details>

**Q7.** Redundant Connection (LC 684): n nodes, n edges, Union-Find. Time?

<details><summary>👉 Answer</summary>

**O(n · α(n)) ≈ O(n)** time, O(n) space. The first edge whose endpoints already share a root is the answer.
</details>

**Q8.** Number of Islands, but the grid is given as **one huge string** and you call `grid.split("\n")` once at the start. Does that change the complexity?

<details><summary>👉 Answer</summary>

No. Splitting is O(total length) = O(R·C), a **sequential phase** that adds to the O(R·C) traversal. Total stays **O(R·C)**. Sequential phases add; they don't multiply.
</details>

---

### 🎯 You're ready when you can…

- [ ] Explain **why** BFS is O(V + E) using the handshaking lemma, not loop multiplication
- [ ] Choose a list, map, or matrix and justify it with the operation table
- [ ] Say "O(h) space, O(log n) balanced, O(n) skewed" without thinking
- [ ] Spot hidden costs: copies, string hashing, `shift`, `includes`, helper calls on subtrees
- [ ] Tell polynomial traversal (permanent visited) from exponential backtracking (un-marked visited)
- [ ] Add the log for heaps and the α for Union-Find, and name both correctly
- [ ] Separate input space, auxiliary space, and output space out loud

**Next step:** take any 10 graph problems from the NeetCode 150 "Graphs" section, write out the complexity **before** you look at the solution, and check yourself against this guide.
