# DSA Study Plan for 2026 FAANG Interviews
### Tailored for a JavaScript/TypeScript full-stack engineer

**Your default problem source:** NeetCode 150 (organized by pattern, which matches this plan) supplemented with LeetCode company-tagged lists in the final sections. Solve everything in JavaScript or TypeScript — the language you'll interview in.

---

## Section 1: Foundations — Complexity Analysis & JS-Specific Machinery

**Outcome:** You can state the time and space complexity of any code you write *without pausing*, including the hidden costs inside JavaScript built-ins. You can justify why a solution is optimal or admit it isn't. Complexity analysis is mandatory vocabulary in every FAANG round — failing to volunteer it unprompted is a common rejection reason.

**What to study:**
- Big-O, Big-Θ intuition: constant, log, linear, linearithmic, quadratic, exponential. Amortized analysis (why `Array.push` is O(1) amortized).
- Hidden costs in JS built-ins: `Array.prototype.sort` is O(n log n) *and needs a comparator for numbers*; `includes`/`indexOf`/`splice`/`shift` are O(n); spread and `slice` copy; string concatenation in loops.
- `Map`/`Set` vs plain objects: iteration order guarantees, key types, when each matters.
- What JS *lacks* that other languages have: no built-in heap/priority queue, no deque, no sorted map/TreeMap. Know the workarounds now so they don't surprise you mid-interview (you'll implement a heap in Section 7).
- Recursion mechanics: call stack, stack depth limits in V8 (~10k frames), converting recursion to explicit stacks.
- Number quirks: integer safety (`Number.MAX_SAFE_INTEGER`), `Math.floor` vs `| 0`, BigInt awareness.

**Practice:** No dedicated problems — instead, retroactively write complexity for the last 10 pieces of code you wrote at work.

---

## Section 2: Arrays, Strings & Hashing

**Outcome:** Given any array/string problem, you can identify within 2–3 minutes which pattern applies (two pointers, sliding window, prefix sum, hashing) and explain *why* before coding. This family is the single highest-frequency category at every company on your target list.

**What to study:**
- Hashing patterns: frequency counting, complement lookup (Two Sum family), grouping by canonical key (anagrams), seen-sets.
- Two pointers: opposite ends (sorted-array pair sums, container with most water), same direction (remove duplicates in-place), partitioning (Dutch national flag).
- Sliding window: fixed-size, variable-size with a validity condition (longest substring without repeating characters, minimum window substring), window + frequency map combo.
- Prefix sums: range sums, subarray sum equals K (prefix sum + hashmap — a classic Meta question), difference arrays.
- String fundamentals: character-code arithmetic (`charCodeAt`), building strings efficiently, palindrome checks.
- Matrix as 2D array: traversal orders, in-place rotation, spiral order.

**Representative problems:** Two Sum, Group Anagrams, Longest Substring Without Repeating Characters, Product of Array Except Self, Subarray Sum Equals K, Minimum Window Substring, Trapping Rain Water (hard — attempt after the rest).

---

## Section 3: Linked Lists, Stacks & Queues

**Outcome:** You can manipulate pointers without drawing 10 diagrams — dummy-head technique, reversal, and fast/slow are muscle memory. You recognize monotonic-stack problems on sight (they're disguised often and are a favorite "medium that feels hard").

**What to study:**
- Linked lists: dummy/sentinel nodes, in-place reversal (iterative and recursive), fast/slow pointers (cycle detection, middle node), merging sorted lists, reordering.
- Stacks: matched pairs (valid parentheses), expression evaluation, min-stack design.
- **Monotonic stack:** next greater element, daily temperatures, largest rectangle in histogram. Understand the invariant, don't memorize the code.
- Queues and deques in JS: why `shift()` is O(n), implementing a queue with two stacks or a linked list, sliding window maximum with a monotonic deque.

**Representative problems:** Reverse Linked List, Linked List Cycle, Merge Two Sorted Lists, Reorder List, Valid Parentheses, Min Stack, Daily Temperatures, Largest Rectangle in Histogram, Sliding Window Maximum.

---

## Section 4: Binary Search

**Outcome:** You can write bug-free binary search on the first attempt (off-by-one errors here are an instant credibility hit) and — more importantly — you recognize "binary search on the answer space" problems, which don't look like search problems at all.

**What to study:**
- The canonical template: loop invariants, `lo <= hi` vs `lo < hi`, avoiding infinite loops, midpoint overflow (not an issue in JS, but say why).
- Variants: first/last occurrence, insertion point, search in rotated sorted array.
- Binary search on answer space: "minimize the maximum" / "maximize the minimum" problems (Koko Eating Bananas, Split Array Largest Sum, capacity to ship packages). The tell: a monotonic yes/no predicate over a numeric range.
- 2D binary search on sorted matrices.

**Representative problems:** Binary Search, Search in Rotated Sorted Array, Find Minimum in Rotated Sorted Array, Koko Eating Bananas, Median of Two Sorted Arrays (hard — this one shows up at Google).

---

## Section 5: Trees & Binary Search Trees

**Outcome:** Recursion on trees feels as natural as a for-loop. You can articulate the "what does this subtree return to its parent" framing out loud, which is exactly the narration interviewers want to hear.

**What to study:**
- Traversals: preorder/inorder/postorder (recursive *and* iterative with a stack), level-order with a queue (BFS).
- The recursive contract: define what the function returns for a subtree, trust it, combine. Apply to depth, balance, diameter, path sums.
- BST properties: inorder gives sorted order, validation with min/max bounds (not just parent-child comparison — a classic trap), kth smallest, lowest common ancestor.
- Tree construction: from preorder+inorder, serialization/deserialization.
- Passing state down vs bubbling results up vs using outer-scope variables — and being able to explain your choice.

**Representative problems:** Maximum Depth, Invert Binary Tree, Diameter of Binary Tree, Validate BST, Lowest Common Ancestor, Binary Tree Level Order Traversal, Kth Smallest in BST, Serialize and Deserialize Binary Tree, Binary Tree Maximum Path Sum (hard).

---

## Section 6: Graphs

**Outcome:** You can model a problem *as* a graph even when no graph is given (grids, prerequisite relationships, word transformations), choose BFS vs DFS deliberately, and implement topological sort and union-find from scratch. Graph questions are heavily represented in the "risen bar" at Google and Meta.

**What to study:**
- Representations: adjacency list (Map of arrays in JS), building graphs from edge lists, implicit graphs (grids).
- DFS: recursive and iterative, connected components, cycle detection (directed: three-color/state array; undirected: parent tracking).
- BFS: shortest path in unweighted graphs, multi-source BFS (rotting oranges), level-by-level processing.
- Grid problems as graphs: islands family, flood fill, boundary DFS.
- Topological sort: Kahn's algorithm (BFS + in-degree) and DFS-based. Course Schedule family.
- Union-Find: with path compression and union by rank — implement it enough times that you can write it in under 3 minutes.
- Weighted graphs: Dijkstra with a priority queue (you'll need your Section 7 heap), when Dijkstra fails (negative weights — awareness only), Prim's/Kruskal's at awareness level.

**Representative problems:** Number of Islands, Clone Graph, Rotting Oranges, Course Schedule I & II, Pacific Atlantic Water Flow, Redundant Connection, Word Ladder (hard), Network Delay Time.

---

## Section 7: Heaps & Priority Queues

**Outcome:** You own a heap implementation you've written from scratch in TypeScript at least 3 times and can reproduce under pressure — because JS has no built-in one and interviewers know it. You recognize top-K, K-way merge, and "scheduling" problems as heap problems immediately.

**What to study:**
- Binary heap mechanics: array representation, sift-up/sift-down, build-heap in O(n).
- Write a generic `MinHeap<T>` with a comparator. This is your reusable interview asset.
- Patterns: top-K elements (and when quickselect beats a heap), K-way merge (merge K sorted lists), two-heap technique (find median from data stream), scheduling/intervals with heaps (meeting rooms II).
- Know the negotiation move: some interviewers let you *assume* a heap exists — always ask, but be ready to build it.

**Representative problems:** Kth Largest Element, Top K Frequent Elements, K Closest Points to Origin, Merge K Sorted Lists, Find Median from Data Stream, Task Scheduler.

---

## Section 8: Backtracking & Recursion Depth

**Outcome:** You can draw the decision tree for any combinatorial problem before coding, state its branching factor and depth (that's your complexity answer), and implement the choose–explore–unchoose template cleanly.

**What to study:**
- The universal template: choice, constraint, goal. Path array + push/pop discipline.
- Subsets, permutations, combinations — and their "with duplicates" variants (the sort + skip trick).
- Constraint-satisfaction style: N-Queens, Sudoku solver (awareness), palindrome partitioning.
- Grid backtracking: Word Search.
- Pruning: when and how to cut branches early, and mentioning it aloud as an optimization.

**Representative problems:** Subsets I & II, Permutations, Combination Sum I & II, Word Search, Palindrome Partitioning, Letter Combinations of a Phone Number, N-Queens (hard).

---

## Section 9: Dynamic Programming

**Outcome:** You can take an unfamiliar DP problem and *derive* the recurrence out loud — state definition, transition, base case, iteration order — rather than trying to recall a memorized solution. Interviewers at Meta and Google are specifically calibrated to detect memorization vs derivation via follow-up twists.

**What to study:**
- The derivation ritual: (1) brute-force recursion, (2) identify overlapping subproblems, (3) memoize, (4) convert to bottom-up table, (5) optimize space. Practice narrating all five steps.
- 1D DP: climbing stairs family, house robber (linear and circular), coin change, longest increasing subsequence (O(n²) then O(n log n) with binary search), word break.
- 2D DP: unique paths, longest common subsequence, edit distance, grid path sums.
- Knapsack framing: 0/1 (partition equal subset sum), unbounded (coin change II). Understand the loop-order difference and why it matters.
- Interval/string DP at awareness level: longest palindromic substring/subsequence, burst balloons (hard, low frequency — don't over-invest).
- State machine DP: best time to buy/sell stock variants.

**Representative problems:** Climbing Stairs, House Robber I & II, Coin Change, Longest Increasing Subsequence, Word Break, Longest Common Subsequence, Edit Distance, Partition Equal Subset Sum, Decode Ways, Longest Palindromic Substring.

---

## Section 10: Intervals, Greedy & Sorting-Based Patterns

**Outcome:** You default to "sort first, then think" for interval and scheduling problems, and you can justify greedy choices with a one-sentence exchange argument instead of hand-waving.

**What to study:**
- Intervals: merge, insert, overlap detection, meeting rooms I & II (chronological ordering / sweep line, or heap), minimum arrows.
- Greedy: jump game family, gas station, partition labels. For each, practice stating *why* greedy works — that justification is the actual interview content.
- Sorting-adjacent: custom comparators in JS, quickselect (Kth largest without a heap), cyclic sort awareness, counting sort for bounded ranges.

**Representative problems:** Merge Intervals, Insert Interval, Non-overlapping Intervals, Meeting Rooms II, Jump Game I & II, Gas Station, Partition Labels.

---

## Section 11: Tries, Bit Manipulation & Design Questions

**Outcome:** You can handle the "design a data structure" question family — a Meta and Google staple that blends DSA with the practical-engineering signal all three reports emphasize.

**What to study:**
- Trie: implement insert/search/startsWith from scratch (Map-based nodes in JS), word search II awareness.
- Design questions: LRU Cache (doubly linked list + Map — **the** most-asked design question; also know JS `Map` preserves insertion order, which enables an elegant shortcut, but implement the classic version too), LFU awareness, Insert/Delete/GetRandom O(1), Design Twitter, Time-Based Key-Value Store.
- Bit manipulation (light): XOR tricks (single number), counting bits, checking/setting bits. Awareness level — low frequency for your targets, don't over-invest.

**Representative problems:** Implement Trie, LRU Cache, Insert Delete GetRandom O(1), Time Based Key-Value Store, Single Number, Design Twitter.

---

## Section 12: Interview Execution — The Layer That Actually Gets You Hired

**Outcome:** You solve problems the way interviews are *scored*, not the way LeetCode is scored. Per the reports: communication, edge-case discovery, self-testing, and complexity narration are now weighted as heavily as correctness — and Google's return to in-person means Google Doc / whiteboard fluency with zero autocomplete.

**What to study and drill:**
- A fixed protocol for every problem: restate the problem → ask 2–3 clarifying questions (input size, duplicates, empty input, value ranges) → propose brute force with complexity → propose optimization → get interviewer buy-in → code while narrating → trace through an example by hand → state edge cases and test them → state final complexity. Run this protocol on *every* practice problem from now on, even alone.
- Thinking aloud without rambling: practice the phrase patterns "I see two approaches...", "The tradeoff here is...", "Before I code, let me verify this handles...".
- Self-testing discipline: dry-run your code line by line with a small input before declaring done. "This should work now" without verification is an explicit rejection trigger (Stripe says so publicly; FAANG interviewers behave the same way).
- Environment hardening: solve at least 25% of your problems in a plain Google Doc or on paper — no syntax highlighting, no autocomplete. Google's loop is now 3–4 rounds in person.
- Handling being stuck: verbalize your invalidated hypotheses instead of going silent (the "epistemic humility" signal — admitting what you don't know while showing how you'd figure it out is rewarded, guessing confidently is penalized).

---

## Section 13: Consolidation — Mixed Sets, Company Tags & Mock Interviews

**Outcome:** You can solve *unlabeled* problems — no pattern hint from the section title — at a 2-medium-per-hour pace with full narration, which is precisely Meta's coding round format.

**What to study:**
- Mixed random sets: use LeetCode's random pick or a shuffled NeetCode 150 list. The skill being trained is pattern *identification*, which sectioned practice cannot train.
- Company-tagged problems (LeetCode Premium is worth it for these 2–3 months): Meta tags are famously predictive; Google tags less so but still directionally useful; Amazon tags moderate.
- Timed simulation: 45-minute single problems and 60-minute two-problem sets, with the Section 12 protocol, out loud, recorded. Watch your recordings — it's uncomfortable and extremely corrective.
- Mock interviews with humans: interviewing.io, Pramp/Exponent peer mocks, or a friend at a target company. Minimum 5 mocks before your first real onsite; treat the first 2 as sacrificial.
- Your redo list (see note-taking advice): every problem you failed or struggled with gets re-solved from a blank editor 3–7 days later, then again 2–3 weeks later.

---

## Priority guidance (where the ROI is)

Highest frequency for your targets, in rough order: arrays/strings/hashing → trees → graphs → DP → binary search → heaps → linked lists/stacks → backtracking → intervals/greedy → design questions → tries/bits. If time compresses, protect graphs, trees, and DP depth — that's where the "bar risen one standard deviation" shows up. Do not skip Section 12 to buy more problem volume; execution quality is the differentiator in 2026, not problem count.
