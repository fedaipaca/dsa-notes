# Graphs: An Incremental Study Guide (TypeScript)

> **How to use this guide**
> - Work through the levels **in order**. Each level adds **one new idea** on top of the previous ones.
> - **🎓 Teaching problems** come with full solutions. Read them, close the file, then **re-type them from memory**.
> - **🏋️ Practice problems** have no solutions. Each one has a short hint telling you which idea from the level it trains.
> - For muscle memory, re-solve each practice problem **3 days later** and again **1 week later** without looking at your old code.

---

## Table of Contents

0. [The Mental Model: What Is a Graph?](#level-0--the-mental-model-what-is-a-graph)
1. [Representing a Graph in Code](#level-1--representing-a-graph-in-code)
2. [Traversal I: DFS (Depth-First Search)](#level-2--traversal-i-dfs)
3. [Traversal II: BFS (Breadth-First Search)](#level-3--traversal-ii-bfs)
4. [Grids Are Graphs in Disguise](#level-4--grids-are-graphs-in-disguise)
5. [Connected Components and Graph Copying](#level-5--connected-components-and-graph-copying)
6. [Node State Beyond "Visited": Bipartite / 2-Coloring](#level-6--node-state-beyond-visited-bipartite--2-coloring)
7. [BFS for Shortest Paths (Unweighted) and Multi-Source BFS](#level-7--bfs-for-shortest-paths-and-multi-source-bfs)
8. [Directed Graphs: Cycle Detection and Topological Sort](#level-8--directed-graphs-cycle-detection-and-topological-sort)
9. [Union-Find (Disjoint Set Union)](#level-9--union-find-disjoint-set-union)
10. [Weighted Shortest Paths: Dijkstra](#level-10--weighted-shortest-paths-dijkstra)
11. [Where to Go Next](#level-11--where-to-go-next)
12. [Cheat Sheets: Pattern Triggers, Complexities, Pitfalls, Interview Script](#level-12--cheat-sheets)

---

## Level 0 — The Mental Model: What Is a Graph?

A **graph** is a set of **things** and the **relationships** between them.

- **Vertex (node):** a thing, such as a city, a user, a course, or a grid cell.
- **Edge:** a relationship between two vertices, such as a road, a friendship, a prerequisite, or adjacency between cells.

> 💡 **Mental model:** Trees, linked lists and grids are all graphs with extra rules.
> - A **linked list** is a graph where every node has at most 1 outgoing edge.
> - A **tree** is a connected graph with **no cycles** (and exactly `V - 1` edges).
> - A **grid** is a graph where each cell connects to its 4 (or 8) neighbours.
>
> If you can do DFS on a tree, you are already about 80% of the way to DFS on a graph. The only new ingredient is **cycles**, which means **you need a `visited` set**.

### Vocabulary you must know cold

| Term | Meaning | Example |
|---|---|---|
| **Undirected** | Edge goes both ways: `A — B` | Facebook friendship |
| **Directed** | Edge has a direction: `A → B` | Twitter "follows", course prerequisites |
| **Weighted** | Edge has a cost | Road with a distance |
| **Unweighted** | Every edge costs the same (count as 1) | "Number of hops" |
| **Neighbour** | Nodes directly connected to a node | — |
| **Degree** | Number of edges touching a node | — |
| **In-degree / Out-degree** | (Directed) incoming / outgoing edge count | "How many prerequisites do I have?" |
| **Path** | Sequence of nodes connected by edges | — |
| **Cycle** | Path that starts and ends at the same node | `A → B → C → A` |
| **Connected component** | A maximal group of nodes that can all reach each other | Islands on a map |
| **DAG** | **D**irected **A**cyclic **G**raph | Build systems, course schedules |
| **Implicit graph** | Graph never given as edges; you generate neighbours on the fly | Grids, word ladders, lock combinations |

### Picture it

```
Undirected            Directed (DAG)         Weighted
  0 — 1                 0 → 1                 0 —(4)— 1
  |   |                 ↓   ↓                 |       |
  3 — 2                 2 → 3                (1)     (2)
                                              |       |
                                              3 —(5)— 2
```

---

## Level 1 — Representing a Graph in Code

Interviewers rarely give you a ready-made graph object. They give you **raw input**, and step one is always to **turn the input into something you can traverse**.

### Common input formats

| Input format | Example | What you do |
|---|---|---|
| **Edge list** | `edges = [[0,1],[1,2]]` | Build an adjacency list |
| **Adjacency matrix** | `isConnected[i][j] === 1` | Use directly, or convert |
| **Adjacency list** | `graph[0] = [1, 3]` | Use directly |
| **Grid** | `grid[r][c]` | Neighbours = 4 directions (Level 4) |
| **Implicit rules** | "change one letter at a time" | Generate neighbours on the fly (Level 7) |

### The three representations

```
Graph:  0 — 1, 0 — 2, 1 — 2, 2 — 3

Edge list:          [[0,1],[0,2],[1,2],[2,3]]

Adjacency list:     0: [1, 2]
                    1: [0, 2]
                    2: [0, 1, 3]
                    3: [2]

Adjacency matrix:      0 1 2 3
                    0 [0 1 1 0]
                    1 [1 0 1 0]
                    2 [1 1 0 1]
                    3 [0 0 1 0]
```

| | Space | "Are u and v connected?" | "List neighbours of u" | Use when |
|---|---|---|---|---|
| Edge list | O(E) | O(E) | O(E) | Input only; also Kruskal / Union-Find |
| **Adjacency list** | **O(V + E)** | O(deg(u)) | **O(deg(u))** | **Default choice (~95% of problems)** |
| Adjacency matrix | O(V²) | **O(1)** | O(V) | Dense graphs, small V, or given as input |

> ✅ **Rule of thumb:** Always convert to an **adjacency list** unless the input is already a matrix or a grid.

### 🎓 Template: build an adjacency list

```ts
/**
 * Builds an adjacency list from an edge list.
 * Nodes are assumed to be labelled 0..n-1.
 */
function buildGraph(n: number, edges: number[][], directed = false): number[][] {
  // Array.from with a factory gives each node its OWN array.
  // ⚠️ new Array(n).fill([]) would share ONE array between all nodes — a classic bug.
  const graph: number[][] = Array.from({ length: n }, () => []);

  for (const [u, v] of edges) {
    graph[u].push(v);
    if (!directed) graph[v].push(u); // undirected: add the reverse edge too
  }
  return graph;
}
```

**Complexity:** Time O(V + E), Space O(V + E).
**Built-ins:** `Array.from({length: n}, fn)` is O(n). `push` is O(1) amortized.

**When labels are not 0..n-1** (strings, sparse IDs), use a `Map`:

```ts
function buildGraphFromLabels(edges: [string, string][]): Map<string, string[]> {
  const graph = new Map<string, string[]>();
  for (const [u, v] of edges) {
    if (!graph.has(u)) graph.set(u, []);
    if (!graph.has(v)) graph.set(v, []);
    graph.get(u)!.push(v);
    graph.get(v)!.push(u);
  }
  return graph;
}
```

`Map.get / set / has` are O(1) on average.

### 🏋️ Practice: representation and degree (no traversal yet)

These train you to read input and think in terms of degrees and edges.

| # | Problem | Hint |
|---|---|---|
| 1 | [1791. Find Center of Star Graph](https://leetcode.com/problems/find-center-of-star-graph/) | Which node appears in every edge? There is an O(1) trick. |
| 2 | [997. Find the Town Judge](https://leetcode.com/problems/find-the-town-judge/) | Directed graph. Track in-degree and out-degree. You don't need an adjacency list. |
| 3 | [1615. Maximal Network Rank](https://leetcode.com/problems/maximal-network-rank/) | Degrees plus an O(1) "are they connected?" check. Which representation gives O(1)? |

---

## Level 2 — Traversal I: DFS

**New idea:** visiting every reachable node. **DFS goes deep first**, then backtracks.

> 💡 **Mental model:** Exploring a maze with one hand on the wall. Go as far as you can, and when you hit a dead end, walk back to the last junction and try a new corridor.

### The one difference from tree DFS

```
Tree DFS:  visit(node) → visit(children)
Graph DFS: visit(node) → mark visited → visit(neighbours that are NOT visited)
```

Without `visited`, a cycle like `0 — 1 — 0` loops forever.

### 🎓 Template: recursive DFS

```ts
function dfsRecursive(graph: number[][], start: number): number[] {
  const visited: boolean[] = new Array(graph.length).fill(false);
  const order: number[] = [];

  const explore = (node: number): void => {
    visited[node] = true;        // 1. mark
    order.push(node);            // 2. "process" the node
    for (const neighbour of graph[node]) {
      if (!visited[neighbour]) { // 3. recurse only into unvisited
        explore(neighbour);
      }
    }
  };

  explore(start);
  return order;
}
```

### 🎓 Template: iterative DFS (explicit stack)

Use this when recursion depth could blow the JS call stack (roughly 10k frames, depending on the engine).

```ts
function dfsIterative(graph: number[][], start: number): number[] {
  const visited: boolean[] = new Array(graph.length).fill(false);
  const order: number[] = [];
  const stack: number[] = [start];

  while (stack.length > 0) {
    const node = stack.pop()!;      // pop() is O(1): LIFO
    if (visited[node]) continue;    // a node can be pushed more than once; skip duplicates
    visited[node] = true;
    order.push(node);

    for (const neighbour of graph[node]) {
      if (!visited[neighbour]) stack.push(neighbour);
    }
  }
  return order;
}
```

**Complexity (both):** Time **O(V + E)**, because each node is visited once and each edge is examined once (twice for undirected). Space **O(V)** for `visited` plus the recursion or stack depth.

`boolean[]` vs `Set<number>`: both give O(1) lookups. An array is faster and lighter when nodes are `0..n-1`. Use a `Set` for strings or sparse IDs.

### Trace

```
graph: 0:[1,2]  1:[0,3]  2:[0]  3:[1]

explore(0) → visited{0}         order [0]
  explore(1) → visited{0,1}     order [0,1]
    0 visited, skip
    explore(3) → visited{0,1,3} order [0,1,3]
  explore(2) → visited{0,1,3,2} order [0,1,3,2]
```

### 🏋️ Practice: DFS on adjacency lists

| # | Problem | Hint |
|---|---|---|
| 1 | [1971. Find if Path Exists in Graph](https://leetcode.com/problems/find-if-path-exists-in-graph/) | Build graph, DFS from `source`, check whether `destination` was visited. **Your first real graph problem.** Solve it both recursively and iteratively. |
| 2 | [841. Keys and Rooms](https://leetcode.com/problems/keys-and-rooms/) | Input is already an adjacency list. Can DFS from room 0 visit all rooms? |
| 3 | [797. All Paths From Source to Target](https://leetcode.com/problems/all-paths-from-source-to-target/) | DAG, so no `visited` needed. DFS plus backtracking with a `path` array. |

---

## Level 3 — Traversal II: BFS

**New idea:** visit nodes **level by level**, all nodes at distance 1, then distance 2, and so on.

> 💡 **Mental model:** A stone dropped in a pond. The ripples expand outward one ring at a time. This is why **BFS finds shortest paths in unweighted graphs** (Level 7).

### ⚠️ TypeScript-specific trap: `Array.shift()` is O(n)

`queue.shift()` re-indexes the whole array, which turns BFS into O(V²). In interviews, use a **head pointer**:

```ts
const queue: number[] = [start];
let head = 0;
while (head < queue.length) {
  const node = queue[head++]; // O(1) dequeue
  // ...
}
```

Mentioning this out loud is a strong senior signal.

### 🎓 Template: BFS

```ts
function bfs(graph: number[][], start: number): number[] {
  const visited: boolean[] = new Array(graph.length).fill(false);
  const order: number[] = [];
  const queue: number[] = [start];
  let head = 0;

  visited[start] = true; // ✅ mark when ENQUEUING, not when dequeuing

  while (head < queue.length) {
    const node = queue[head++];
    order.push(node);

    for (const neighbour of graph[node]) {
      if (!visited[neighbour]) {
        visited[neighbour] = true; // mark now so no one else enqueues it
        queue.push(neighbour);
      }
    }
  }
  return order;
}
```

> ❗ **Why mark on enqueue?** If you mark on dequeue, the same node can be added to the queue many times by different neighbours. That is still correct, but it wastes time and memory, and on dense graphs or grids it can cause TLE.

### 🎓 Template: level-by-level BFS (you'll use this constantly)

```ts
function bfsByLevel(graph: number[][], start: number): number[][] {
  const visited = new Array(graph.length).fill(false);
  const levels: number[][] = [];
  const queue: number[] = [start];
  let head = 0;
  visited[start] = true;

  while (head < queue.length) {
    const levelEnd = queue.length; // snapshot: everything up to here is the current level
    const level: number[] = [];

    while (head < levelEnd) {
      const node = queue[head++];
      level.push(node);
      for (const nb of graph[node]) {
        if (!visited[nb]) {
          visited[nb] = true;
          queue.push(nb);
        }
      }
    }
    levels.push(level);
  }
  return levels; // levels[d] = all nodes at distance d from start
}
```

**Complexity:** Time **O(V + E)**, Space **O(V)**.

### DFS vs BFS: when to pick which

| Need | Pick |
|---|---|
| Just "visit everything" or "is it reachable?" | Either (DFS is usually shorter to write) |
| **Shortest path / minimum steps** (unweighted) | **BFS** |
| Explore all paths, backtracking | DFS |
| Cycle detection in directed graphs | DFS (3-color) or BFS (Kahn's) |
| Very deep graphs (risk of stack overflow) | BFS or iterative DFS |

### 🏋️ Practice: BFS

| # | Problem | Hint |
|---|---|---|
| 1 | [1971. Find if Path Exists in Graph](https://leetcode.com/problems/find-if-path-exists-in-graph/) | Same problem as Level 2, now solve it with BFS. Compare the two codes side by side. |
| 2 | [841. Keys and Rooms](https://leetcode.com/problems/keys-and-rooms/) | Same: redo it with BFS and a head pointer. |

> Re-solving the same problem with a different traversal is deliberate. It isolates the traversal as the only thing that changes.

---

## Level 4 — Grids Are Graphs in Disguise

**New idea:** an **implicit graph**. Nobody hands you edges. Each cell `(r, c)` is a node and its neighbours are the 4 adjacent cells.

```
        (r-1,c)
           ↑
(r,c-1) ← (r,c) → (r,c+1)
           ↓
        (r+1,c)
```

### The grid toolkit

```ts
const DIRS: [number, number][] = [[1, 0], [-1, 0], [0, 1], [0, -1]]; // down, up, right, left
// 8 directions: add [1,1],[1,-1],[-1,1],[-1,-1]

const inBounds = (r: number, c: number, rows: number, cols: number) =>
  r >= 0 && r < rows && c >= 0 && c < cols;
```

**Visited tricks for grids:**
1. **Mutate the grid in place** (e.g. turn `'1'` into `'0'`). Saves memory. Ask the interviewer if mutation is allowed.
2. Use a `boolean[][]` visited matrix.
3. Use a `Set<string>` with key `` `${r},${c}` ``. Simple but slower, since string building isn't free. Alternatively encode as `r * cols + c` (a number).

### 🎓 Teaching Problem: [200. Number of Islands](https://leetcode.com/problems/number-of-islands/)
*Asked very frequently at Amazon, Meta, Google, Microsoft, Bloomberg.*

**1. Problem Understanding**
Given an `m x n` grid of `'1'` (land) and `'0'` (water), count the islands. An island is land connected **horizontally or vertically**.

**2. Approach (think out loud)**
- *"Land cells connected to each other form a group. Counting groups means counting **connected components**."*
- *"The grid is an implicit graph: each cell is a node, the 4 neighbours are its edges."*
- **Trigger words:** "connected", "group", "region", "island" → **DFS/BFS flood fill**.
- Strategy: scan every cell. When I find unvisited land, that's a **new island** → `count++`, then flood-fill (DFS) to "sink" the whole island so I never count it again.

**3. Solution**

```ts
function numIslands(grid: string[][]): number {
  const rows = grid.length;
  const cols = grid[0].length;
  let islands = 0;

  // Flood fill: turn every connected '1' into '0' ("sink" the island).
  const sink = (r: number, c: number): void => {
    // Base case: out of bounds or not land
    if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] !== '1') return;

    grid[r][c] = '0'; // mark visited by mutating

    sink(r + 1, c);
    sink(r - 1, c);
    sink(r, c + 1);
    sink(r, c - 1);
  };

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === '1') {
        islands++;   // found the first cell of a new island
        sink(r, c);  // erase the entire island
      }
    }
  }
  return islands;
}
```

**4. Complexity**
- Time: **O(m · n)**. Each cell is sunk at most once, and each cell checks 4 neighbours.
- Space: **O(m · n)** worst case for the recursion stack (a grid that is all land, snaking). With in-place mutation there is no extra visited structure.

**5. Edge Cases & interview talking points**
- All water → 0. All land → 1.
- **Diagonals don't count**. Confirm with the interviewer.
- If mutating input isn't allowed, use a `visited` matrix.
- A 300×300 all-land grid means recursion depth up to 90,000, which can overflow the JS stack. Mention a **BFS** or iterative version as the production-safe alternative.

### 🏋️ Practice: grid traversal

| # | Problem | Hint |
|---|---|---|
| 1 | [733. Flood Fill](https://leetcode.com/problems/flood-fill/) | Simplest flood fill. Edge case: what if `newColor === oldColor`? |
| 2 | [463. Island Perimeter](https://leetcode.com/problems/island-perimeter/) | Each land cell adds 4, minus shared sides. Traversal is optional; think about why. |
| 3 | [695. Max Area of Island](https://leetcode.com/problems/max-area-of-island/) | Number of Islands, but DFS **returns** a count: `1 + sum(dfs(neighbours))`. |
| 4 | [1020. Number of Enclaves](https://leetcode.com/problems/number-of-enclaves/) | **Reverse thinking:** first sink all land connected to the **border**, then count what's left. |
| 5 | [130. Surrounded Regions](https://leetcode.com/problems/surrounded-regions/) | Same "start from the border" trick as 1020. |
| 6 | [417. Pacific Atlantic Water Flow](https://leetcode.com/problems/pacific-atlantic-water-flow/) | Two DFS passes from the two oceans, flowing **uphill**. Answer = intersection. |

---

## Level 5 — Connected Components and Graph Copying

**New idea:** the "loop over all nodes, start a traversal from each unvisited node" pattern on a **general graph**, plus using a `Map` as a visited structure that **stores data**.

You already did this on grids. Now apply it to adjacency lists, where some nodes may be completely disconnected.

### 🎓 Template: count connected components

```ts
function countComponents(n: number, edges: number[][]): number {
  const graph = buildGraph(n, edges); // from Level 1
  const visited = new Array(n).fill(false);
  let components = 0;

  const dfs = (node: number): void => {
    visited[node] = true;
    for (const nb of graph[node]) {
      if (!visited[nb]) dfs(nb);
    }
  };

  // The outer loop is the key: it catches nodes that are unreachable from node 0.
  for (let i = 0; i < n; i++) {
    if (!visited[i]) {
      components++;
      dfs(i);
    }
  }
  return components;
}
```

**Complexity:** Time O(V + E), Space O(V + E).

> 🔑 **Key insight:** A single DFS from node 0 only reaches node 0's component. **Disconnected graphs need the outer loop.** Forgetting it is one of the most common graph bugs.

### Visited as a `Map`: when "visited" needs to remember something

In [133. Clone Graph](https://leetcode.com/problems/clone-graph/) the visited structure becomes `Map<originalNode, clonedNode>`. It answers both "have I seen this?" and "what is its copy?". The same idea appears later as `Map<node, color>` (Level 6) and `Map<node, distance>` (Level 7).

### 🏋️ Practice: components and copying

| # | Problem | Hint |
|---|---|---|
| 1 | [547. Number of Provinces](https://leetcode.com/problems/number-of-provinces/) | Count components, but the input is an **adjacency matrix**. Neighbours of `i` = all `j` with `isConnected[i][j] === 1`. |
| 2 | [133. Clone Graph](https://leetcode.com/problems/clone-graph/) | `Map<Node, Node>` from original to clone. Create the clone **before** recursing into neighbours (handles cycles). Popular at Meta and Google. |
| 3 | [1319. Number of Operations to Make Network Connected](https://leetcode.com/problems/number-of-operations-to-make-network-connected/) | Answer is `components - 1`, but check first: are there enough cables? (You'll solve it again with Union-Find in Level 9.) |
| 4 | [2316. Count Unreachable Pairs of Nodes in an Undirected Graph](https://leetcode.com/problems/count-unreachable-pairs-of-nodes-in-an-undirected-graph/) | Find each component's **size**, then combine sizes with a little math. Watch for overflow-sized results. |

---

## Level 6 — Node State Beyond "Visited": Bipartite / 2-Coloring

**New idea:** each node carries a **state** richer than true/false. Here the state is a color. This is the stepping stone to 3-state cycle detection in Level 8.

**Bipartite graph:** you can split the nodes into two groups so that **every edge crosses between groups** (no edge inside a group). Equivalently, you can 2-color the graph so that no two neighbours share a color, or the graph has **no odd-length cycle**.

> 💡 **Trigger words:** "split into two groups", "two teams", "dislikes", "no two adjacent ... same".

### 🎓 Teaching Problem: [785. Is Graph Bipartite?](https://leetcode.com/problems/is-graph-bipartite/)
*Asked at Meta, Amazon, Google.*

**1. Problem Understanding**
Given an undirected graph as an adjacency list (possibly **disconnected**), return `true` if it's bipartite.

**2. Approach (think out loud)**
- *"If I color a node red, all its neighbours must be blue, their neighbours red, and so on. The coloring is forced, so I can just try it with BFS and look for a conflict."*
- *"Conflict = a neighbour already has the **same** color as me → not bipartite."*
- *"The graph may be disconnected, so I need the outer loop from Level 5."*

**3. Solution**

```ts
function isBipartite(graph: number[][]): boolean {
  const n = graph.length;
  // color[i]: 0 = uncolored (unvisited), 1 = red, -1 = blue
  const color: number[] = new Array(n).fill(0);

  for (let start = 0; start < n; start++) {
    if (color[start] !== 0) continue; // already handled in an earlier component

    color[start] = 1;
    const queue: number[] = [start];
    let head = 0;

    while (head < queue.length) {
      const node = queue[head++];
      for (const nb of graph[node]) {
        if (color[nb] === 0) {
          color[nb] = -color[node]; // give the opposite color
          queue.push(nb);
        } else if (color[nb] === color[node]) {
          return false;             // same color on both ends of an edge
        }
      }
    }
  }
  return true;
}
```

**4. Complexity:** Time O(V + E), Space O(V).

**5. Edge cases:** isolated nodes (trivially fine), disconnected components (outer loop), graph with no edges (`true`).

### 🏋️ Practice: 2-coloring

| # | Problem | Hint |
|---|---|---|
| 1 | [886. Possible Bipartition](https://leetcode.com/problems/possible-bipartition/) | Same as 785, but **you** build the graph from an edge list (1-indexed). Try DFS this time. |
| 2 | [1557. Minimum Number of Vertices to Reach All Nodes](https://leetcode.com/problems/minimum-number-of-vertices-to-reach-all-nodes/) | Warm-up for directed graphs: which nodes have in-degree 0? No traversal needed. |

---

## Level 7 — BFS for Shortest Paths and Multi-Source BFS

**New idea:** in an **unweighted** graph, the BFS level at which you first reach a node **is** its shortest distance from the start.

> 💡 **Why it works:** BFS processes all nodes at distance `d` before any node at distance `d + 1`. So the first time BFS touches a node, it arrived by the shortest route.

> 🔔 **Trigger words:** "minimum number of steps / moves / transformations", "shortest path", "fewest", **and** edges have no weights (or all weights are equal) → **BFS**.

### 🎓 Teaching Problem A: [1091. Shortest Path in Binary Matrix](https://leetcode.com/problems/shortest-path-in-binary-matrix/)
*Asked at Amazon, Meta, Google.*

**1. Problem Understanding**
`n x n` grid of 0s (open) and 1s (blocked). Find the length (counted in **cells**) of the shortest clear path from top-left to bottom-right, moving in **8 directions**. Return `-1` if impossible.

**2. Approach**
- Grid = implicit graph (Level 4), with 8 neighbours instead of 4.
- "Shortest" + unweighted → BFS (this level).
- Store the distance alongside each cell in the queue.

**3. Solution**

```ts
function shortestPathBinaryMatrix(grid: number[][]): number {
  const n = grid.length;
  if (grid[0][0] === 1 || grid[n - 1][n - 1] === 1) return -1; // start or end blocked

  const DIRS8: [number, number][] = [
    [1, 0], [-1, 0], [0, 1], [0, -1],
    [1, 1], [1, -1], [-1, 1], [-1, -1],
  ];

  // Queue entries: [row, col, pathLengthInCells]
  const queue: [number, number, number][] = [[0, 0, 1]];
  let head = 0;
  grid[0][0] = 1; // mark visited (mutating; ask first or use a visited matrix)

  while (head < queue.length) {
    const [r, c, dist] = queue[head++];
    if (r === n - 1 && c === n - 1) return dist; // first arrival = shortest

    for (const [dr, dc] of DIRS8) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < n && nc >= 0 && nc < n && grid[nr][nc] === 0) {
        grid[nr][nc] = 1; // mark on enqueue
        queue.push([nr, nc, dist + 1]);
      }
    }
  }
  return -1;
}
```

**4. Complexity:** Time **O(n²)**, since each cell is enqueued at most once with 8 checks each. Space **O(n²)** for the queue.

**5. Edge cases:** `n === 1` with `grid[0][0] === 0` → answer `1`. Blocked start or end → `-1`.

---

### Multi-Source BFS

**New twist:** what if there are **many starting points** spreading at the same time (fire, rot, infection, "distance to nearest X")?

> 💡 **Trick:** put **all** sources in the queue at distance 0 **before** BFS starts. It behaves as if a single "super-source" connects to every real source.

> 🔔 **Trigger words:** "nearest", "spread simultaneously", "every minute, all ... adjacent", "distance from each cell to the closest ...".

### 🎓 Teaching Problem B: [994. Rotting Oranges](https://leetcode.com/problems/rotting-oranges/)
*Very frequently asked at Amazon; also Microsoft and Meta.*

**1. Problem Understanding**
Grid cells: `0` empty, `1` fresh, `2` rotten. Every minute, rotten oranges rot their 4 neighbours. Return the minutes until no fresh orange remains, or `-1` if impossible.

**2. Approach**
- *"Rot spreads from **all** rotten oranges at once → multi-source BFS."*
- *"Each BFS level = one minute → level-by-level BFS from Level 3."*
- *"I'll count fresh oranges up front. If any remain at the end, they're unreachable → `-1`."*

**3. Solution**

```ts
function orangesRotting(grid: number[][]): number {
  const rows = grid.length;
  const cols = grid[0].length;
  const DIRS: [number, number][] = [[1, 0], [-1, 0], [0, 1], [0, -1]];

  const queue: [number, number][] = [];
  let fresh = 0;

  // 1. Seed the queue with ALL sources; count fresh oranges.
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 2) queue.push([r, c]);
      else if (grid[r][c] === 1) fresh++;
    }
  }

  let minutes = 0;
  let head = 0;

  // 2. Level-by-level BFS. Stop early once nothing is fresh.
  while (head < queue.length && fresh > 0) {
    const levelEnd = queue.length;
    while (head < levelEnd) {
      const [r, c] = queue[head++];
      for (const [dr, dc] of DIRS) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] === 1) {
          grid[nr][nc] = 2; // rot it (also marks visited)
          fresh--;
          queue.push([nr, nc]);
        }
      }
    }
    minutes++; // one full level processed = one minute passed
  }

  return fresh === 0 ? minutes : -1;
}
```

**4. Complexity:** Time **O(m · n)**, Space **O(m · n)**.

**5. Edge cases:**
- No fresh oranges at all → `0` (the `fresh > 0` condition handles it).
- Fresh oranges but no rotten ones → `-1`.
- A fresh orange walled off by empty cells → `-1`.

### 🏋️ Practice: BFS shortest path and multi-source

| # | Problem | Hint |
|---|---|---|
| 1 | [1926. Nearest Exit from Entrance in Maze](https://leetcode.com/problems/nearest-exit-from-entrance-in-maze/) | Single-source grid BFS. The entrance itself doesn't count as an exit. |
| 2 | [542. 01 Matrix](https://leetcode.com/problems/01-matrix/) | Multi-source: seed with **all 0s**, BFS outward. Don't BFS from every 1, which is O((mn)²). |
| 3 | [1162. As Far from Land as Possible](https://leetcode.com/problems/as-far-from-land-as-possible/) | Multi-source from all land cells. The answer is the last level reached. |
| 4 | [286. Walls and Gates](https://leetcode.com/problems/walls-and-gates/) *(Premium; free mirror on neetcode.io / lintcode 663)* | Multi-source from all gates. |
| 5 | [752. Open the Lock](https://leetcode.com/problems/open-the-lock/) | **Implicit graph**: each 4-digit combo is a node with 8 neighbours. Dead-ends = blocked nodes. |
| 6 | [127. Word Ladder](https://leetcode.com/problems/word-ladder/) | Implicit graph: words differing by one letter are neighbours. Generate neighbours by changing each letter a–z and checking a `Set`. A classic at Amazon, Meta, Google. |

---

## Level 8 — Directed Graphs: Cycle Detection and Topological Sort

**New idea:** in **directed** graphs, "visited" alone can't detect cycles. You need to know whether a node is **still on the current DFS path**. This extends the "node state" idea from Level 6 to **3 states**.

### Why 2 states fail in directed graphs

```
0 → 1 → 2
 ↘     ↗
   3 ──
```
DFS from 0 visits 1, 2, then backtracks and visits 3 → 2. Node 2 is "visited", but **there is no cycle**: 2 isn't an ancestor of 3 on the current path. With just a visited flag you'd report a false cycle.

### 3-color DFS

| State | Meaning |
|---|---|
| `0` UNVISITED (white) | Not seen yet |
| `1` VISITING (gray) | **On the current recursion path** |
| `2` VISITED (black) | Fully explored; no cycle reachable through it |

**Cycle ⇔ you reach a VISITING (gray) node.** That's a **back edge** to an ancestor.

### Topological sort

A **topological order** of a DAG lists nodes so that every edge `u → v` has `u` before `v`. Think "do prerequisites first".
- It exists **if and only if** the graph has **no cycle**.
- Two classic algorithms: **Kahn's (BFS + in-degree)** and **DFS post-order (reversed)**.

> 🔔 **Trigger words:** "prerequisites", "dependencies", "order of tasks / builds / courses", "must happen before", "is it possible to finish all ..." → **topological sort / cycle detection**.

### 🎓 Teaching Problem: [207. Course Schedule](https://leetcode.com/problems/course-schedule/)
*One of the most asked graph problems: Amazon, Meta, Google, Microsoft, Uber.*

**1. Problem Understanding**
`numCourses` courses (0..n-1). `prerequisites[i] = [a, b]` means *to take `a` you must first take `b`*. Can you finish all courses?

**2. Approach (think out loud)**
- *"Courses are nodes. A prerequisite `[a, b]` is a directed edge `b → a` (b comes before a)."*
- *"I can't finish if there's a circular dependency → **cycle detection in a directed graph**."*
- Two approaches, and it's worth knowing both:
  - **A. Kahn's algorithm:** repeatedly take courses with **in-degree 0** (no remaining prerequisites). If we take all `n`, there's no cycle.
  - **B. 3-color DFS:** look for a back edge.

**3a. Solution: Kahn's algorithm (BFS)**

```ts
function canFinish(numCourses: number, prerequisites: number[][]): boolean {
  const graph: number[][] = Array.from({ length: numCourses }, () => []);
  const indegree: number[] = new Array(numCourses).fill(0);

  for (const [course, pre] of prerequisites) {
    graph[pre].push(course); // edge: pre → course
    indegree[course]++;      // course has one more unmet prerequisite
  }

  // Start with every course that has no prerequisites.
  const queue: number[] = [];
  for (let i = 0; i < numCourses; i++) {
    if (indegree[i] === 0) queue.push(i);
  }

  let head = 0;
  let taken = 0;
  while (head < queue.length) {
    const node = queue[head++];
    taken++; // queue order IS a valid topological order

    for (const next of graph[node]) {
      indegree[next]--;                       // one prerequisite satisfied
      if (indegree[next] === 0) queue.push(next); // all prerequisites met
    }
  }

  // Nodes in a cycle never reach in-degree 0, so they're never taken.
  return taken === numCourses;
}
```

**3b. Solution: 3-color DFS**

```ts
function canFinishDFS(numCourses: number, prerequisites: number[][]): boolean {
  const graph: number[][] = Array.from({ length: numCourses }, () => []);
  for (const [course, pre] of prerequisites) graph[pre].push(course);

  const UNVISITED = 0, VISITING = 1, VISITED = 2;
  const state: number[] = new Array(numCourses).fill(UNVISITED);

  const hasCycle = (node: number): boolean => {
    if (state[node] === VISITING) return true;  // back edge → cycle
    if (state[node] === VISITED) return false;  // already proven safe

    state[node] = VISITING; // entering: node is on the current path
    for (const next of graph[node]) {
      if (hasCycle(next)) return true;
    }
    state[node] = VISITED;  // leaving: node is off the path and safe
    return false;
  };

  for (let i = 0; i < numCourses; i++) {
    if (hasCycle(i)) return false; // outer loop again (disconnected parts)
  }
  return true;
}
```

> 💡 **DFS topological order bonus:** push each node to a list **when it becomes VISITED** (post-order). **Reversing** that list gives a topological order.

**4. Complexity (both):** Time **O(V + E)**, Space **O(V + E)**.

**5. Edge cases:** no prerequisites → `true`. Self-loop `[a, a]` → cycle → `false`. Duplicate edges (Kahn's handles them since in-degree counts each copy).

**Which one to present?** Kahn's is iterative (no stack overflow) and directly produces the order, which makes it a great default. Mention the DFS version as an alternative to show depth.

### 🏋️ Practice: directed cycles and topological sort

| # | Problem | Hint |
|---|---|---|
| 1 | [210. Course Schedule II](https://leetcode.com/problems/course-schedule-ii/) | Return the order itself. Kahn's queue order is the answer (or `[]` on a cycle). |
| 2 | [802. Find Eventual Safe States](https://leetcode.com/problems/find-eventual-safe-states/) | 3-color DFS: safe ⇔ ends as VISITED without hitting VISITING. (Or Kahn's on the **reversed** graph.) |
| 3 | [1462. Course Schedule IV](https://leetcode.com/problems/course-schedule-iv/) | Topological order plus propagating "prerequisite sets". |
| 4 | [2115. Find All Possible Recipes from Given Supplies](https://leetcode.com/problems/find-all-possible-recipes-from-given-supplies/) | Kahn's with **string** nodes, so use `Map`s. Supplies start with in-degree 0. |
| 5 | [269. Alien Dictionary](https://leetcode.com/problems/alien-dictionary/) *(Premium; free on neetcode.io / lintcode 892)* | Build edges by comparing adjacent words, then topological sort. Watch the `["abc","ab"]` invalid case. Meta and Airbnb favourite. |

---

## Level 9 — Union-Find (Disjoint Set Union)

**New idea:** a data structure that answers **"are `a` and `b` in the same component?"** and **"merge these two components"** in nearly O(1) each, **without traversal**. It works best when **edges arrive one at a time**.

> 💡 **Mental model:** each component is a club with one **president** (root). Every member points toward someone in the club, and following pointers upward leads to the president.
> - `find(x)` → who's the president of x's club?
> - `union(a, b)` → merge two clubs: one president now reports to the other.

**Two optimizations make it fast:**
1. **Path compression** (in `find`): after finding the root, point every node on the path **directly** at it.
2. **Union by rank/size:** attach the **shorter** tree under the taller one so trees stay flat.

With both, each operation is **O(α(n))**, the inverse Ackermann function, which is at most 4 for any realistic input. **Say "effectively constant" in the interview.**

### 🎓 Template: Union-Find

```ts
class UnionFind {
  private parent: number[];
  private rank: number[];
  public components: number;

  constructor(n: number) {
    this.parent = Array.from({ length: n }, (_, i) => i); // each node is its own root
    this.rank = new Array(n).fill(0);
    this.components = n;
  }

  find(x: number): number {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]); // path compression
    }
    return this.parent[x];
  }

  /** Returns false if a and b were ALREADY connected (i.e. this edge forms a cycle). */
  union(a: number, b: number): boolean {
    let rootA = this.find(a);
    let rootB = this.find(b);
    if (rootA === rootB) return false;

    // Union by rank: hang the shorter tree under the taller one.
    if (this.rank[rootA] < this.rank[rootB]) [rootA, rootB] = [rootB, rootA];
    this.parent[rootB] = rootA;
    if (this.rank[rootA] === this.rank[rootB]) this.rank[rootA]++;

    this.components--;
    return true;
  }

  connected(a: number, b: number): boolean {
    return this.find(a) === this.find(b);
  }
}
```

**Complexity:** construction O(n). `find` and `union` amortized **O(α(n)) ≈ O(1)**. Space O(n).

### 🎓 Teaching Problem: [684. Redundant Connection](https://leetcode.com/problems/redundant-connection/)
*Asked at Google, Amazon, Meta.*

**1. Problem Understanding**
A tree with `n` nodes (labelled **1..n**) had **one extra edge** added. Return the edge that can be removed to make it a tree again (if several, return the one that appears **last** in the input).

**2. Approach**
- *"A tree plus one edge = exactly one cycle. The redundant edge is the one that connects two nodes that are **already connected**."*
- *"Edges arrive one by one, and I keep asking 'already connected?' → **Union-Find**."*
- *"Processing edges in input order, the first edge whose `union` fails is the one that closes the cycle, and it's the last cycle edge in the input."*

**3. Solution**

```ts
function findRedundantConnection(edges: number[][]): number[] {
  const n = edges.length;           // a tree with n nodes + 1 edge has n edges
  const uf = new UnionFind(n + 1);  // +1 because nodes are 1-indexed

  for (const [u, v] of edges) {
    if (!uf.union(u, v)) return [u, v]; // already connected → this edge closes a cycle
  }
  return []; // unreachable for valid input
}
```

**4. Complexity:** Time **O(n · α(n)) ≈ O(n)**, Space **O(n)**.

**5. Talking point:** a DFS solution exists (for each new edge, check whether `u` can already reach `v`), but it's O(n²). Union-Find is the expected optimal answer.

### DFS/BFS vs Union-Find

| Situation | Prefer |
|---|---|
| Static graph, need paths / distances / order | DFS / BFS |
| **Edges added dynamically**, repeated "connected?" queries | **Union-Find** |
| Undirected cycle detection while adding edges | Union-Find |
| Grouping by **equivalence** (same email → same person, `a == b`) | Union-Find |
| **Directed** graphs | DFS / BFS (Union-Find does **not** handle direction) |

### 🏋️ Practice: Union-Find

| # | Problem | Hint |
|---|---|---|
| 1 | [547. Number of Provinces](https://leetcode.com/problems/number-of-provinces/) | Redo it with Union-Find. Answer = `uf.components`. |
| 2 | [1319. Number of Operations to Make Network Connected](https://leetcode.com/problems/number-of-operations-to-make-network-connected/) | Redo it with Union-Find. Failed unions = spare cables. |
| 3 | [261. Graph Valid Tree](https://leetcode.com/problems/graph-valid-tree/) *(Premium; free on neetcode.io / lintcode 178)* | Valid tree ⇔ exactly `n - 1` edges **and** no union fails. |
| 4 | [990. Satisfiability of Equality Equations](https://leetcode.com/problems/satisfiability-of-equality-equations/) | Union all `==` first, then check every `!=`. |
| 5 | [721. Accounts Merge](https://leetcode.com/problems/accounts-merge/) | Union accounts that share an email. Map email → first account index. Meta and Google favourite. |

---

## Level 10 — Weighted Shortest Paths: Dijkstra

**New idea:** when edges have **different non-negative weights**, BFS's "first arrival = shortest" breaks, because a path with more hops might be cheaper. Dijkstra fixes this by always expanding the **cheapest known node next**, using a **min-heap** instead of a FIFO queue.

> 💡 **Mental model:** BFS where the queue is replaced by a priority queue ordered by **total distance so far**. Since weights are non-negative, once a node is popped with distance `d`, nothing popped later can give it a shorter distance.

> 🔔 **Trigger words:** "minimum cost / time / effort", "weighted", "cheapest path", "network delay", non-negative weights → **Dijkstra**.
> ❗ Negative weights → Dijkstra is **wrong**. Use Bellman-Ford.

### TypeScript has no built-in heap

- LeetCode's TS/JS environment includes `@datastructures-js/priority-queue` (`MinPriorityQueue`, `PriorityQueue`).
- In a real interview, **ask** whether you can assume a heap exists. If not, here is a compact one to memorize:

```ts
class MinHeap<T> {
  private data: T[] = [];
  constructor(private compare: (a: T, b: T) => number) {}

  get size(): number {
    return this.data.length;
  }

  push(value: T): void {                 // O(log n)
    this.data.push(value);
    this.bubbleUp(this.data.length - 1);
  }

  pop(): T | undefined {                 // O(log n)
    if (this.data.length === 0) return undefined;
    const top = this.data[0];
    const last = this.data.pop()!;
    if (this.data.length > 0) {
      this.data[0] = last;
      this.sinkDown(0);
    }
    return top;
  }

  private bubbleUp(i: number): void {
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (this.compare(this.data[i], this.data[parent]) >= 0) break;
      [this.data[i], this.data[parent]] = [this.data[parent], this.data[i]];
      i = parent;
    }
  }

  private sinkDown(i: number): void {
    const n = this.data.length;
    while (true) {
      let smallest = i;
      const left = 2 * i + 1;
      const right = 2 * i + 2;
      if (left < n && this.compare(this.data[left], this.data[smallest]) < 0) smallest = left;
      if (right < n && this.compare(this.data[right], this.data[smallest]) < 0) smallest = right;
      if (smallest === i) break;
      [this.data[i], this.data[smallest]] = [this.data[smallest], this.data[i]];
      i = smallest;
    }
  }
}
```

### 🎓 Teaching Problem: [743. Network Delay Time](https://leetcode.com/problems/network-delay-time/)
*The canonical Dijkstra problem. Asked at Amazon, Google, Meta.*

**1. Problem Understanding**
`n` nodes (1..n), directed weighted edges `times[i] = [u, v, w]`. A signal is sent from `k`. Return the time for **all** nodes to receive it, or `-1` if some node is unreachable.

**2. Approach**
- *"Time for all nodes to receive it = the **maximum** of the shortest distances from `k`."*
- *"Weighted, non-negative → Dijkstra."*
- *"I'll use 'lazy' Dijkstra: push duplicates into the heap and skip stale entries when popped. That's simpler than a decrease-key operation."*

**3. Solution**

```ts
function networkDelayTime(times: number[][], n: number, k: number): number {
  // Weighted adjacency list: graph[u] = [[v, w], ...]
  const graph: [number, number][][] = Array.from({ length: n + 1 }, () => []);
  for (const [u, v, w] of times) graph[u].push([v, w]);

  const dist: number[] = new Array(n + 1).fill(Infinity);
  dist[k] = 0;

  // Heap entries: [distanceSoFar, node], ordered by distance.
  const heap = new MinHeap<[number, number]>((a, b) => a[0] - b[0]);
  heap.push([0, k]);

  while (heap.size > 0) {
    const [d, node] = heap.pop()!;
    if (d > dist[node]) continue; // stale entry: a shorter path was already found

    for (const [next, weight] of graph[node]) {
      const candidate = d + weight;
      if (candidate < dist[next]) {  // "relaxation"
        dist[next] = candidate;
        heap.push([candidate, next]);
      }
    }
  }

  let answer = 0;
  for (let i = 1; i <= n; i++) {
    if (dist[i] === Infinity) return -1; // unreachable node
    answer = Math.max(answer, dist[i]);
  }
  return answer;
}
```

**4. Complexity**
- Time: **O(E log E)**, often written **O((V + E) log V)**. Each edge can push one heap entry, and each push or pop is O(log heapSize).
- Space: **O(V + E)** for the graph, `dist` and heap.

**5. Edge cases:** source is the only node → `0`. Unreachable node → `-1`. Multiple edges between the same pair are fine.

### BFS vs Dijkstra (connect the levels)

| | BFS (Level 7) | Dijkstra (Level 10) |
|---|---|---|
| Edge weights | All equal | Non-negative, varied |
| Container | FIFO queue | Min-heap by distance |
| When is a node final? | First time it's enqueued | First time it's **popped** |
| Time | O(V + E) | O((V + E) log V) |

### 🏋️ Practice: Dijkstra

| # | Problem | Hint |
|---|---|---|
| 1 | [1514. Path with Maximum Probability](https://leetcode.com/problems/path-with-maximum-probability/) | Dijkstra with a **max**-heap, multiplying probabilities instead of adding. |
| 2 | [1631. Path With Minimum Effort](https://leetcode.com/problems/path-with-minimum-effort/) | Grid (Level 4) plus Dijkstra. A path's cost = **max** single step, not the sum. |
| 3 | [778. Swim in Rising Water](https://leetcode.com/problems/swim-in-rising-water/) | Same shape as 1631. |
| 4 | [787. Cheapest Flights Within K Stops](https://leetcode.com/problems/cheapest-flights-within-k-stops/) | The stop limit breaks plain Dijkstra. Try **Bellman-Ford limited to k+1 rounds**, or BFS by level. |

---

## Level 11 — Where to Go Next

Once Levels 0–10 feel automatic, these round out the graph topics asked at senior level.

| Topic | One-line idea | Practice |
|---|---|---|
| **Minimum Spanning Tree** (Prim / Kruskal) | Cheapest set of edges connecting all nodes. Kruskal = sort edges + Union-Find (Level 9). Prim = Dijkstra-like heap (Level 10). | [1584. Min Cost to Connect All Points](https://leetcode.com/problems/min-cost-to-connect-all-points/) |
| **Bellman-Ford** | Relax all edges V−1 times; handles negative weights and detects negative cycles. | [787. Cheapest Flights Within K Stops](https://leetcode.com/problems/cheapest-flights-within-k-stops/) |
| **Floyd-Warshall** | All-pairs shortest paths, O(V³). | [1334. Find the City With the Smallest Number of Neighbors at a Threshold Distance](https://leetcode.com/problems/find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance/) |
| **Eulerian path** (Hierholzer) | Use every edge exactly once. | [332. Reconstruct Itinerary](https://leetcode.com/problems/reconstruct-itinerary/) |
| **Bridges / articulation points** (Tarjan) | Edges whose removal disconnects the graph. | [1192. Critical Connections in a Network](https://leetcode.com/problems/critical-connections-in-a-network/) |
| **Graph + DP / state-space BFS** | Node = (position, extra state such as keys or remaining moves). | [864. Shortest Path to Get All Keys](https://leetcode.com/problems/shortest-path-to-get-all-keys/), [1293. Shortest Path in a Grid with Obstacles Elimination](https://leetcode.com/problems/shortest-path-in-a-grid-with-obstacles-elimination/) |

Curated lists for more reps: the **NeetCode 150 → "Graphs" and "Advanced Graphs"** sections, and the **Graph** modules on algo.monster.

---

## Level 12 — Cheat Sheets

### 🔔 Pattern triggers: "If you see X, think Y"

| You read... | Think... | Level |
|---|---|---|
| "connected", "group", "region", "island", "province" | DFS/BFS + outer loop (count components) | 4, 5 |
| A 2D grid of cells | Implicit graph with 4/8 directions | 4 |
| "surrounded", "can't reach the border" | Start traversal **from the border** (reverse thinking) | 4 |
| "copy / clone the graph" | DFS + `Map<old, new>` | 5 |
| "two groups", "two teams", "dislikes" | Bipartite / 2-coloring | 6 |
| "minimum steps / moves / transformations" (no weights) | **BFS** | 7 |
| "nearest X from every cell", "spreads every minute" | **Multi-source BFS** | 7 |
| "change one character / digit at a time" | Implicit graph + BFS | 7 |
| "prerequisites", "dependencies", "order of tasks" | **Topological sort** (Kahn's) / 3-color DFS | 8 |
| "can all tasks be finished?" (directed) | Directed cycle detection | 8 |
| Edges arriving one by one, "already connected?" | **Union-Find** | 9 |
| "redundant edge", "valid tree" (undirected) | Union-Find | 9 |
| "same email / equal variables → merge" | Union-Find | 9 |
| "minimum cost / time", non-negative weights | **Dijkstra** | 10 |
| "connect all points at minimum cost" | MST (Kruskal / Prim) | 11 |

### ⏱️ Complexity table

| Algorithm | Time | Space |
|---|---|---|
| Build adjacency list | O(V + E) | O(V + E) |
| DFS / BFS | O(V + E) | O(V) |
| Grid DFS / BFS | O(R · C) | O(R · C) |
| Topological sort (Kahn's / DFS) | O(V + E) | O(V + E) |
| Union-Find (n ops, with both optimizations) | O(n · α(n)) ≈ O(n) | O(V) |
| Dijkstra (binary heap) | O((V + E) log V) | O(V + E) |
| Bellman-Ford | O(V · E) | O(V) |
| Floyd-Warshall | O(V³) | O(V²) |
| Kruskal MST | O(E log E) | O(V + E) |

**TS built-ins to remember:**
`push` / `pop` O(1) amortized · **`shift` / `unshift` O(n)** (use a head pointer) · `Map` / `Set` get, set, has, delete O(1) average · `Array.from({length:n}, fn)` and `fill` O(n) · `sort` O(n log n).

### 🐞 Top pitfalls

1. **Forgetting `visited`** → infinite loop on cycles.
2. **Forgetting the outer loop** → missed disconnected components.
3. **`new Array(n).fill([])`** → every node shares the same array. Use `Array.from({ length: n }, () => [])`.
4. **Marking visited on dequeue in BFS** → duplicate enqueues and TLE.
5. **`queue.shift()`** → O(n) per dequeue in JS.
6. **Using 2-state visited for directed cycle detection** → false positives. Use 3 colors.
7. **Wrong edge direction** in prerequisite problems (`[a, b]` means `b → a`).
8. **1-indexed nodes** → allocate `n + 1`.
9. **Undirected graph: adding only one direction** of each edge.
10. **Dijkstra with negative weights**, or forgetting the stale-entry check `if (d > dist[node]) continue`.
11. **Deep recursion on big grids** → JS stack overflow. Mention BFS or iterative DFS.

### 🗣️ Interview script for any graph problem (think out loud)

1. **Identify the graph:** *"What are the nodes? What are the edges? Directed or undirected? Weighted?"*
2. **Clarify:** *"Can the graph be disconnected? Are there cycles or self-loops? Are nodes 0- or 1-indexed? Can I mutate the input?"*
3. **Choose a representation:** *"I'll convert the edge list into an adjacency list, O(V + E)."*
4. **Match the pattern** using the trigger table, and **say the trigger out loud**: *"We need the minimum number of steps in an unweighted graph, so BFS gives the shortest path."*
5. **Code the template**, then adapt it to the problem.
6. **Dry-run** a tiny example, including a cycle and a disconnected node.
7. **State complexity** in terms of V and E (or R × C for grids).
8. **Mention alternatives and trade-offs:** DFS vs BFS, Kahn's vs 3-color, DFS vs Union-Find, recursion depth.

---

### ✅ Progress Checklist

- [ ] L1: Can build an adjacency list from memory (both array and `Map` versions)
- [ ] L2: Can write recursive **and** iterative DFS without looking
- [ ] L3: Can write BFS with a head pointer and level-by-level BFS without looking
- [ ] L4: Solved Number of Islands + 6 grid practice problems
- [ ] L5: Comfortable with the "outer loop" component pattern and Clone Graph
- [ ] L6: Can 2-color a graph with BFS **and** DFS
- [ ] L7: Can do single-source and multi-source BFS; solved Word Ladder
- [ ] L8: Can write **both** Kahn's and 3-color DFS for Course Schedule
- [ ] L9: Can write the Union-Find class from memory in under 3 minutes
- [ ] L10: Can write a MinHeap + Dijkstra from memory
- [ ] L11: Tried at least one MST and one Bellman-Ford problem
