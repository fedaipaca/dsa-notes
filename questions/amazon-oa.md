# 2214. Minimum Health to Beat Game

Leetcode: https://leetcode.com/problems/minimum-health-to-beat-game/description/

Amazon Prime Games is designing a game where the player needs to pass `n` rounds sequentially. You are given a 0-indexed integer array `power` (or `damage`) of length `n`, where `power[i]` represents the damage taken to complete round `i`.

The rules of play are as follows:
- The player loses `power[i]` health to complete round `i`.
- The player's health must be **strictly greater than 0** at all times.
- The player can choose to use armor in **at most one** round. The armor prevents damage equal to $\min(\text{armor}, \text{power}[i])$.

Return the **minimum starting health** required for the player to beat the game.

### Examples

**Example 1:**
- **Input:** `power = [1, 2, 6, 7]`, `armor = 5`
- **Output:** `12`
- **Explanation:** Optimal strategy uses armor on round 2 (damage 6), taking $6 - \min(5, 6) = 1$ damage.
  - Round 0: $12 - 1 = 11$
  - Round 1: $11 - 2 = 9$
  - Round 2: $9 - 1 = 8$
  - Round 3: $8 - 7 = 1$
  Total damage taken is $1 + 2 + 1 + 7 = 11$. Minimum starting health is $11 + 1 = 12$.

**Example 2:**
- **Input:** `power = [2, 5, 3, 4]`, `armor = 7`
- **Output:** `10`
- **Explanation:** Use armor on round 1 (damage 5). Since $\text{armor} > \text{power}[1]$, armor absorbs $\min(7, 5) = 5$ damage (taking 0 damage). Total damage is $2 + 0 + 3 + 4 = 9$. Minimum starting health is $9 + 1 = 10$.

**Example 3:**
- **Input:** `power = [2, 2, 2]`, `armor = 3`
- **Output:** `5`
- **Explanation:** Use armor on any round to absorb 2 damage. Total damage is $0 + 2 + 2 = 4$. Minimum starting health is $4 + 1 = 5$.

### Constraints
- `n == power.length`
- `1 <= n <= 10^5`
- `0 <= power[i] <= 10^5`
- `0 <= armor <= 10^5`

### Key Takeaway for Interview
- **Greedy approach:** Armor can only be used once, and saves $\min(\text{armor}, \text{power}[i])$. To maximize health saved, always apply armor to $\max(\text{power})$.
- **Formula:** $\text{Answer} = 1 + \sum(\text{power}) - \min(\text{armor}, \max(\text{power}))$.
- **Complexity:** Time $O(n)$ in a single pass, Space $O(1)$. Note that sum can exceed $32$-bit integer limits ($10^5 \times 10^5 = 10^{10}$), so use 64-bit integers (`long` in Java/C++, `BigInt` or standard number in JS/Python).
---

# Minimum Operations to Make Array Equal to Zero

You are given a 0-indexed integer array `nums`. In one operation, you can select any prefix of the array and increment or decrement every element in that prefix by `1`.

Return the minimum number of operations required to convert every element of `nums` to `0`.

A **prefix** of an array is a contiguous subarray starting at the first element (index `0`).

### Examples

**Example 1:**
- **Input:** `nums = [3, 2, 0, 0, -1]`
- **Output:** `5`
- **Explanation:**
  - Operation 1: Decrement prefix of length 1 -> `[2, 2, 0, 0, -1]`
  - Operation 2: Decrement prefix of length 2 -> `[1, 1, 0, 0, -1]`
  - Operation 3: Decrement prefix of length 4 -> `[0, 0, -1, -1, -1]`
  - Operation 4: Decrement prefix of length 2 -> `[-1, -1, -1, -1, -1]`
  - Operation 5: Increment prefix of length 5 -> `[0, 0, 0, 0, 0]`

**Example 2:**
- **Input:** `nums = [1, -2, 2]`
- **Output:** `7`
- **Explanation:**
  - Index 0 to 1 diff: `|1 - (-2)| = 3`
  - Index 1 to 2 diff: `|-2 - 2| = 4`
  - Index 2 to end diff: `|2 - 0| = 2`
  - Total operations = 3 + 4 = 7.

### Constraints
- `n == nums.length`
- `1 <= n <= 10^5`
- `-10^9 <= nums[i] <= 10^9`

---

# Maximum Sum of Matrix Elements with Row Constraints

Developers at Amazon are working on a prototype for a utility that compresses an $n \times n$ matrix, `data`, with the help of a compression rate represented by an array, `factor`. 

The utility returns an integer which is the maximum sum of exactly `x` elements of the matrix such that the number of elements taken from the $i^{\text{th}}$ row does not exceed `factor[i]` for all $0 \le i < n$. The utility returns `-1` if the compression cannot be performed (i.e., if it is impossible to select `x` elements satisfying all constraints).

Given the matrix `data`, array `factor`, and integer `x`, find the maximum sum to perform compression under the given constraints, or `-1` if it is not possible.

### Examples

**Example 1:**
- **Input:** `data = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]`, `factor = [1, 2, 1]`, `x = 2`
- **Output:** `15`
- **Explanation:** 
  - The maximum elements we can select from each row are:
    - Row 0 (`factor[0] = 1`): `[3]`
    - Row 1 (`factor[1] = 2`): `[6, 5]`
    - Row 2 (`factor[2] = 1`): `[9]`
  - Combining these candidates gives `[9, 6, 5, 3]`. Selecting the top `x = 2` elements gives $9 + 6 = 15$.

**Example 2:**
- **Input:** `data = [[1, 2], [3, 4]]`, `factor = [0, 0]`, `x = 1`
- **Output:** `-1`
- **Explanation:** `factor[0] = 0` and `factor[1] = 0`, meaning no elements can be selected from any row. It is impossible to select `x = 1` element, so return `-1`.

### Constraints
- `n == data.length == data[i].length`
- `1 <= n <= 1000`
- `1 <= data[i][j] <= 10^9`
- `0 <= factor[i] <= n`
- `1 <= x <= n * n`

---

# Longest Self-Sufficient Proper Substring

Software developers at Amazon are developing a new library for Natural Language Processing[cite: 2]. In one of its modules, every string needs to be preprocessed in a particular manner to find the length of its longest self-sufficient proper substring[cite: 2].

A **self-sufficient proper substring** is a contiguous substring of `fullString` that satisfies the following conditions[cite: 2]:
1. The substring is not the entire string `fullString` (its length must be strictly less than $n$)[cite: 2].
2. No letter that occurs inside the substring also occurs outside the substring (i.e., all occurrences of every character present in the substring are contained entirely within it)[cite: 2].

Given the string `fullString` of length $n$, find the length of its longest self-sufficient proper substring[cite: 2]. If no such substring exists, return `0`[cite: 2].

### Examples

**Example 1:**
- **Input:** `fullString = "amazonservices"`
- **Output:** `11`
- **Explanation:** 
  - Valid self-sufficient proper substrings include:
    - `"zonservices"` (length 11): characters 'z', 'o', 'n', 's', 'e', 'r', 'v', 'i', 'c' do not appear outside this substring.
    - `"services"` (length 8)
    - `"amazon"` (length 6)
    - `"ervice"` (length 6)
  - Invalid substrings include `"amazonservices"` (not a proper substring) and `"amazonservice"` (character 's' appears outside at the end).
  - The maximum length among valid proper substrings is `11`.

**Example 2:**
- **Input:** `fullString = "aaaa"`
- **Output:** `0`
- **Explanation:** The only substring containing all occurrences of 'a' is the full string `"aaaa"`. Since a valid substring must be a proper substring (length $< n$), no valid substring exists.

### Constraints
- `1 <= n <= 10^5`
- `fullString` consists only of lowercase English letters.

---

# Maximize Zeros After Prefix Reduction

You are given an array of positive integers `nums`. In one operation, you can choose a prefix of `nums` that contains **no zeros** and decrement every element in that prefix by `1`.

Your goal is to perform operations to maximize the total number of zeros in the array. Return the maximum number of zeros achievable in `nums`.

### Examples

**Example 1:**
- **Input:** `nums = [3, 1, 2, 4]`
- **Output:** `4`
- **Explanation:** 
  - Operation 1: Decrement prefix `[3, 1, 2, 4]` by 1 -> `[2, 0, 1, 3]`.
  - Operation 2: Decrement non-zero prefix `[2]` by 2 -> `[0, 0, 1, 3]`.
  - Operation 3: Decrement non-zero prefix starting at non-zero elements to reduce remaining values to zero.
  - Eventually, all 4 elements can be converted to 0.

**Example 2:**
- **Input:** `nums = [2, 2, 1]`
- **Output:** `3`
- **Explanation:**
  - Operation 1: Decrement prefix `[2, 2, 1]` by 1 -> `[1, 1, 0]`.
  - Operation 2: Decrement prefix `[1, 1]` by 1 -> `[0, 0, 0]`.
  - All 3 elements are converted to 0.

### Constraints
- `1 <= nums.length <= 10^5`
- `1 <= nums[i] <= 10^9`

---

# Warehouse Shipment Allocation

You are given an integer array `capacities`, where `capacities[i]` represents the initial capacity of the $i^{\text{th}}$ warehouse. You are also given two integers, `shipment` and `backup`.

You must select **exactly one** warehouse to handle a new shipment. The selected warehouse's capacity must be at least `shipment`. All other $n - 1$ remaining warehouses must collectively have a combined total capacity of at least `backup`.

If a warehouse's current capacity is insufficient, you can upgrade it by adding capacity. Find the **minimum total capacity upgrade** required across all warehouses to satisfy both the primary shipment requirement and the remaining backup capacity requirement.

### Examples

**Example 1:**
- **Input:** `capacities = [2, 5, 3]`, `shipment = 6`, `backup = 7`
- **Output:** `3`
- **Explanation:**
  - Choose warehouse 1 (capacity 5) for the shipment. Upgrade its capacity from 5 to 6 (cost = 1).
  - The remaining warehouses are 0 and 2 with capacities `[2, 3]` (sum = 5).
  - To reach the backup requirement of 7, increase total remaining capacity by 2 (cost = 2).
  - Total minimum upgrade required = 1 + 2 = 3.

**Example 2:**
- **Input:** `capacities = [10, 20, 30]`, `shipment = 15`, `backup = 25`
- **Output:** `0`
- **Explanation:**
  - Choose warehouse 2 (capacity 30 >= 15) or warehouse 1 (capacity 20 >= 15).
  - Choosing warehouse 2 leaves warehouses 0 and 1 with total capacity $10 + 20 = 30 \ge 25$.
  - No upgrades are required, so the minimum total upgrade is 0.

### Constraints
- `n == capacities.length`
- `2 <= n <= 10^5`
- `1 <= capacities[i] <= 10^9`
- `1 <= shipment <= 10^9`
- `1 <= backup <= 10^9`

---

# 1481. Least Number of Unique Integers after K Removals

Leetcode: https://leetcode.com/problems/least-number-of-unique-integers-after-k-removals/description/

Given an array of integers `arr` and an integer `k`, find the minimum number of unique integers remaining after removing exactly `k` elements.

### Examples

**Example 1:**
- **Input:** `arr = [5, 5, 4]`, `k = 1`
- **Output:** `1`
- **Explanation:** Remove the single `4`, leaving `[5, 5]`. There is only `1` unique integer remaining.

**Example 2:**
- **Input:** `arr = [4, 3, 1, 1, 3, 3, 2]`, `k = 3`
- **Output:** `2`
- **Explanation:** 
  - Frequencies: `4` appears 1 time, `2` appears 1 time, `1` appears 2 times, `3` appears 3 times.
  - Remove `4` (1 element) and `2` (1 element), then remove one `1` (1 element).
  - The remaining elements are `[1, 3, 3, 3]`, which has `2` unique integers (`1` and `3`).

### Constraints
- `1 <= arr.length <= 10^5`
- `1 <= arr[i] <= 10^9`
- `0 <= k <= arr.length`

---

# 56. Merge Intervals

Leetcode: https://leetcode.com/problems/merge-intervals/description/

Given an array of `intervals` where `intervals[i] = [start_i, end_i]`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.

### Examples

**Example 1:**
- **Input:** `intervals = [[1,3],[2,6],[8,10],[15,18]]`
- **Output:** `[[1,6],[8,10],[15,18]]`
- **Explanation:** Since intervals `[1,3]` and `[2,6]` overlap, merge them into `[1,6]`.

**Example 2:**
- **Input:** `intervals = [[1,4],[4,5]]`
- **Output:** `[[1,5]]`
- **Explanation:** Intervals `[1,4]` and `[4,5]` are considered overlapping.

### Constraints
- `1 <= intervals.length <= 10^4`
- `intervals[i].length == 2`
- `0 <= start_i <= end_i <= 10^4`

---

# 743. Network Delay Time

Leetcode: https://leetcode.com/problems/network-delay-time/description/

You are given a network of `n` nodes, labeled from `1` to `n`. You are also given `times`, a list of travel times as directed edges `times[i] = (u_i, v_i, w_i)`, where `u_i` is the source node, `v_i` is the target node, and `w_i` is the time it takes for a signal to travel from source to target.

We will send a signal from a given node `k`. Return the **minimum time** it takes for all the `n` nodes to receive the signal. If it is impossible for all the `n` nodes to receive the signal, return `-1`.

### Examples

**Example 1:**
- **Input:** `times = [[2,1,1],[2,3,1],[3,4,1]]`, `n = 4`, `k = 2`
- **Output:** `2`
- **Explanation:** 
  - From node 2, signal reaches node 1 at time 1.
  - From node 2, signal reaches node 3 at time 1.
  - From node 3, signal reaches node 4 at time 1 + 1 = 2.
  - Total time for all nodes to receive the signal is 2.

**Example 2:**
- **Input:** `times = [[1,2,1]]`, `n = 2`, `k = 1`
- **Output:** `1`

**Example 3:**
- **Input:** `times = [[1,2,1]]`, `n = 2`, `k = 2`
- **Output:** `-1`

### Constraints
- `1 <= k <= n <= 100`
- `1 <= times.length <= 6000`
- `times[i].length == 3`
- `1 <= u_i, v_i <= n`
- `u_i != v_i`
- `0 <= w_i <= 100`
- All the pairs `(u_i, v_i)` are unique.

---

# 1094. Car Pooling

Leetcode: https://leetcode.com/problems/car-pooling/description/

There is a delivery truck with `capacity` maximum load limit. The truck moves along a single straight route from west to east.

You are given an integer `capacity` and an array `trips` where `trips[i] = [numPackages_i, from_i, to_i]` indicates that the $i^{\text{th}}$ trip requires carrying `numPackages_i` packages picked up at location `from_i` and dropped off at location `to_i`. The locations are given as distance in kilometers from the start.

Return `true` if it is possible to pick up and drop off all packages for all given trips without exceeding `capacity` at any point, or `false` otherwise.

### Examples

**Example 1:**
- **Input:** `trips = [[2,1,5],[3,3,7]]`, `capacity = 4`
- **Output:** `false`
- **Explanation:** 
  - At location 1, load becomes 2 packages.
  - At location 3, load becomes 2 + 3 = 5 packages, which exceeds the capacity of 4.

**Example 2:**
- **Input:** `trips = [[2,1,5],[3,3,7]]`, `capacity = 5`
- **Output:** `true`
- **Explanation:**
  - From location 1 to 3, load is 2 packages.
  - From location 3 to 5, load is 2 + 3 = 5 packages.
  - At location 5, 2 packages are dropped off, load becomes 3.
  - Total load never exceeds capacity 5.

### Constraints
- `1 <= trips.length <= 1000`
- `trips[i].length == 3`
- `1 <= numPackages_i <= 100`
- `0 <= from_i < to_i <= 1000`
- `1 <= capacity <= 10^5`

---

# Product Rating System

The engineers at Amazon are developing a new rating system for their products[cite: 3]. For each product, they maintain an array `customer_rating` representing the last $n$ customers, where `customer_rating[i]` is the rating given by the $i^{\text{th}}$ customer[cite: 3].

### Allowed Operation
You are allowed to perform the following operation at most $k$ times[cite: 3]:
- Choose any rating in the array and increase it by `1`[cite: 3].

You may distribute these increments across elements in any way[cite: 3].

### Goal
After performing at most $k$ operations, you must select any subset of size $m$ from the array[cite: 3].

Let `new_rating` be the maximum possible Bitwise AND of any $m$-sized subset of `customer_rating` after modifications[cite: 3]. Your task is to compute this maximum possible `new_rating`[cite: 3].

### Examples

**Example 1:**
- **Input:** `customer_rating = [1, 2, 4, 8]`, `k = 8`, `m = 2`[cite: 3]
- **Output:** `10`[cite: 3]
- **Explanation:** 
  - Increase `customer_rating[2]` from `4` to `10` (requires 6 operations)[cite: 3].
  - Increase `customer_rating[3]` from `8` to `10` (requires 2 operations)[cite: 3].
  - Total operations used: 6 + 2 = 8 $\le k$[cite: 3].
  - Final optimal subset is `[10, 10]`[cite: 3], with a Bitwise AND of $10 \text{ AND } 10 = 10$[cite: 3].

**Example 2:**
- **Input:** `customer_rating = [3, 3, 5]`, `k = 2`, `m = 2`
- **Output:** `5`
- **Explanation:**
  - Increase `customer_rating[0]` from `3` to `5` (requires 2 operations).
  - Selected subset is `[5, 5]` with a Bitwise AND of $5 \text{ AND } 5 = 5$.

### Constraints
- `1 <= m <= n <= 10^5`
- `0 <= k <= 10^9`
- `0 <= customer_rating[i] <= 10^9`

---

# 3914. Minimum Operations to Make Array Non-Decreasing

AWS provides scalable systems using a set of $n$ servers. You are given an integer array `power`, where `power[i]` represents the computational power of the $i^{\text{th}}$ server.

The goal is to arrange the computational powers of the servers in non-decreasing order. In one operation, you can choose any contiguous subarray of `power` and increase each element in that subarray by $x$, where $x$ is any positive integer.

Return the **minimum possible sum of $x$** across all operations required to make the array non-decreasing.

An array is non-decreasing if `power[i] <= power[i + 1]` for all $0 \le i < n - 1$.

### Examples

**Example 1:**
- **Input:** `power = [3, 4, 1, 6, 2]`
- **Output:** `7`
- **Explanation:** 
  - Choose subarray `power[2..4]` and add $x = 3$. Array becomes `[3, 4, 4, 9, 5]`.
  - Choose subarray `power[4..4]` and add $x = 4$. Array becomes `[3, 4, 4, 9, 9]`.
  - The array is now non-decreasing. Total sum of $x$ values is $3 + 4 = 7$.

**Example 2:**
- **Input:** `power = [3, 2, 1]`
- **Output:** `2`
- **Explanation:**
  - Choose subarray `power[1..2]` and add $x = 1$. Array becomes `[3, 3, 2]`.
  - Choose subarray `power[2..2]` and add $x = 1$. Array becomes `[3, 3, 3]`.
  - Total sum of $x$ values is $1 + 1 = 2$.

**Example 3:**
- **Input:** `power = [3, 5, 2, 3]`
- **Output:** `3`
- **Explanation:**
  - Choose subarray `power[2..3]` and add $x = 3$. Array becomes `[3, 5, 5, 6]`.
  - Total sum of $x$ values is `3`.

### Constraints
- `1 <= power.length <= 10^5`
- `1 <= power[i] <= 10^9`

---

# Unserved Customers in Limited Stock Sale

A shop is selling a limited number of `items`. There are `n` customers, where each customer is assigned a unique 0-indexed ID from `0` to `n - 1`. 

Each customer $i$ offers a bid `prices[i]` and wants to purchase `demands[i]` items.

Customers are first arranged in a queue based on the following priorities:
1. Higher bid price (`prices[i]`) comes first.
2. If two customers offer the exact same price, the customer who arrived earlier (smaller ID `i`) comes first.

Once the queue is formed, items are distributed one-by-one in a **round-robin** manner (in a circle) among the customers in line:
- In each round, starting from the front of the queue, each customer whose demand has not yet been satisfied receives `1` item.
- A customer leaves the line as soon as they receive their total requested `demands[i]` items.
- Distribution stops immediately when all `items` are completely sold out or all customer demands are fulfilled.

Return an array containing the **sorted IDs** of all customers who received **0 items**.

### Examples

**Example 1:**
- **Input:** `items = 3`, `prices = [10, 20, 10, 5]`, `demands = [2, 1, 1, 3]`
- **Output:** `[3]`
- **Explanation:** 
  - Priority Queue Order:
    1. Customer 1 (price = 20, demand = 1)
    2. Customer 0 (price = 10, demand = 2)
    3. Customer 2 (price = 10, demand = 1)
    4. Customer 3 (price = 5, demand = 3)
  - Item Distribution:
    - Round 1:
      - Customer 1 gets 1 item (demand fulfilled, remaining stock = 2).
      - Customer 0 gets 1 item (remaining demand = 1, remaining stock = 1).
      - Customer 2 gets 1 item (demand fulfilled, remaining stock = 0).
  - All items are sold out. Customer 3 received 0 items.
  - Output: `[3]`

**Example 2:**
- **Input:** `items = 2`, `prices = [10, 10, 10]`, `demands = [2, 2, 2]`
- **Output:** `[2]`
- **Explanation:**
  - Priority Queue Order: Customer 0, Customer 1, Customer 2 (all prices equal, ordered by ID).
  - Round 1:
    - Customer 0 gets 1 item (remaining stock = 1).
    - Customer 1 gets 1 item (remaining stock = 0).
  - Stock is exhausted. Customer 2 received 0 items.
  - Output: `[2]`

**Example 3:**
- **Input:** `items = 10`, `prices = [5, 5]`, `demands = [1, 1]`
- **Output:** `[]`
- **Explanation:**
  - Every customer gets their requested items. No customer gets 0 items.

### Constraints
- `n == prices.length == demands.length`
- `1 <= n <= 10^5`
- `1 <= items <= 10^9`
- `1 <= prices[i] <= 10^9`
- `1 <= demands[i] <= 10^9`

---

# Minimize Maximum Distance to Nearest 1

You are given an `m x n` binary matrix `grid` consisting of `0`s and `1`s, where:
- `1` represents a source cell (e.g., a server, building, or service point).
- `0` represents an empty cell.

The distance between any two cells `(r1, c1)` and `(r2, c2)` is defined as the Manhattan distance:
$$\text{distance} = \vert{}r_1 - r_2\vert{} + \vert{}c_1 - c_2\vert{}$$

For any valid configuration of the grid, the maximum distance is defined as the maximum distance from any `0` cell to its nearest `1` cell.

You are allowed to change at most one `0` cell into a `1`.

Return *the minimum possible maximum distance from any remaining `0` cell to its closest `1` cell after changing at most one `0` cell to `1`*.

### Examples

**Example 1:**
- **Input:** `grid = [[1,0,0],[0,0,0],[0,0,0]]`
- **Output:** `2`
- **Explanation:**
  - Initially, with only `grid[0][0] = 1`, the cell at `(2, 2)` is at distance `|2 - 0| + |2 - 0| = 4` from its closest `1`.
  - If you change `grid[2][2]` from `0` to `1`, the matrix now has sources at `(0, 0)` and `(2, 2)`.
  - The farthest remaining `0` cells are at `(0, 2)` and `(2, 0)`, both having a distance of `2` to their nearest `1`.
  - The maximum distance across all remaining `0` cells is reduced from `4` down to `2`, which is optimal.

**Example 2:**
- **Input:** `grid = [[0,0],[0,0]]`
- **Output:** `2`
- **Explanation:** Converting any single `0` cell to `1` (e.g., `grid[0][0] = 1`) leaves three remaining `0` cells. The farthest remaining `0` cell `(1, 1)` is at Manhattan distance `2` from `(0, 0)`. Thus, the minimum possible maximum distance is `2`.

**Example 3:**
- **Input:** `grid = [[1,1],[1,1]]`
- **Output:** `0`
- **Explanation:** There are no `0` cells present in the grid.

### Constraints
- `m == grid.length`
- `n == grid[i].length`
- `1 <= m, n <= 500`
- `grid[i][j]` is either `0` or `1`.

---

# Minimum Cost to Equalize Inventory

You are given an integer array `inventory` representing the quality values of products.

In one operation, you can choose two quality values `x` and `y` present in the inventory and replace all products of quality `x` with quality `y`. The cost of this operation is equal to the number of products whose quality was changed (i.e., the current count of `x` in the array).

Your goal is to make all products in `inventory` have the exact same quality value using any number of operations.

Return *the minimum total cost required to transform the inventory so that all elements are identical*.

### Examples

**Example 1:**
- **Input:** `inventory = [7,7,5,7,3,5,3]`
- **Output:** `4`
- **Explanation:**
  - Replace all products of quality `5` with `7`. The inventory becomes `[7,7,7,7,3,7,3]`. The cost is `2` (since there were two `5`s).
  - Replace all products of quality `3` with `7`. The inventory becomes `[7,7,7,7,7,7,7]`. The cost is `2` (since there were two `3`s).
  - Total cost = `2 + 2 = 4`.

**Example 2:**
- **Input:** `inventory = [1,2,3,4]`
- **Output:** `3`
- **Explanation:**
  - Replace `1` with `4` (cost = `1`).
  - Replace `2` with `4` (cost = `1`).
  - Replace `3` with `4` (cost = `1`).
  - Total cost = `1 + 1 + 1 = 3`.

**Example 3:**
- **Input:** `inventory = [5,5,5,5]`
- **Output:** `0`
- **Explanation:** All products already have the same quality, so no changes are needed.

### Constraints
- `1 <= inventory.length <= 10^5`
- `1 <= inventory[i] <= 10^9`

---

# 64. Minimum Path Sum (Amazon Variant: Merging Commit Histories)

Leetcode: https://leetcode.com/problems/minimum-path-sum/description/

You are developing a feature for a version control system like Git. A developer is trying to integrate changes from a feature branch into the main repository branch. Both branches originated from a common ancestor commit, but they have developed independently over time.

Each commit in a branch contains a set of modifications. Merging commits together incurs a cost proportional to the number of conflicting modifications between those commits.

Given:
1. Branch A represented as a sequence of $n$ commits: $[A_1, A_2, \dots, A_n]$.
2. Branch B represented as a sequence of $m$ commits: $[B_1, B_2, \dots, B_m]$.
3. An $n \times m$ 2D array `conflicts` where `conflicts[i][j]` represents the number of merge conflicts or friction score incurred when merging commit $A_i$ from Branch A into commit $B_j$ from Branch B.

You need to integrate all changes step-by-step from $A_1$ and $B_1$ through $A_n$ and $B_m$ while **minimizing the total cumulative merge conflict cost**. At each step, you may either advance along Branch A (move down) or Branch B (move right).

Find the minimum conflict cost needed to fully merge both branches.

### Examples

**Example 1:**
- **Input:** `conflicts = [[1, 3, 1], [1, 5, 1], [4, 2, 1]]`
- **Output:** `7`
- **Explanation:** The path $1 \rightarrow 1 \rightarrow 1 \rightarrow 1 \rightarrow 1$ minimizes the sum ($1 + 1 + 1 + 1 + 1 = 5$).
  - Merge $A_1$ into $B_1$ (cost 1)
  - Merge $A_2$ into $B_1$ (cost 1)
  - Merge $A_2$ into $B_2$ (cost 5) — wait, optimal path is:
  - $(0,0) \rightarrow (1,0) \rightarrow (1,1) \rightarrow \dots$
  Path: `conflicts[0][0]` (1) $\rightarrow$ `conflicts[1][0]` (1) $\rightarrow$ `conflicts[1][1]` (5) $\rightarrow$ `conflicts[1][2]` (1) $\rightarrow$ `conflicts[2][2]` (1) = 9.
  Minimum Path: `conflicts[0][0]` (1) $\rightarrow$ `conflicts[0][1]` (3) $\rightarrow$ `conflicts[0][2]` (1) $\rightarrow$ `conflicts[1][2]` (1) $\rightarrow$ `conflicts[2][2]` (1) = 7.

**Example 2:**
- **Input:** `conflicts = [[1, 2, 3], [4, 5, 6]]`
- **Output:** `12`
- **Explanation:** The path with minimum sum is $1 \rightarrow 2 \rightarrow 3 \rightarrow 6$ ($1 + 2 + 3 + 6 = 12$).

### Constraints
- $m == \text{conflicts.length}$
- $n == \text{conflicts}[i].\text{length}$
- $1 \le m, n \le 200$
- $0 \le \text{conflicts}[i][j] \le 200$

---


# 3413. Maximum Coins From K Consecutive Bags

Leetcode: https://leetcode.com/problems/maximum-coins-from-k-consecutive-bags/description/

You are given a 2D integer array `coins` where `coins[i] = [left_i, right_i, weight_i]` represents a contiguous range of bags from index `left_i` to `right_i` (inclusive), with each bag containing `weight_i` coins (or money). No two intervals overlap. Any bag not covered by any interval contains `0` coins.

You are also given an integer `k`.

You can select any window of `k` consecutive bags. Return *the maximum total amount of coins/money you can collect*.

### Examples

**Example 1:**
- **Input:** `coins = [[8,10,1],[1,3,2],[5,6,4]], k = 4`
- **Output:** `10`
- **Explanation:**
  - Selecting $k = 4$ consecutive bags from index `3` to `6`:
    - Bag `3`: contains `2` coins (from interval `[1, 3, 2]`)
    - Bag `4`: contains `0` coins
    - Bag `5`: contains `4` coins (from interval `[5, 6, 4]`)
    - Bag `6`: contains `4` coins (from interval `[5, 6, 4]`)
  - Total coins collected = `2 + 0 + 4 + 4 = 10`.

**Example 2:**
- **Input:** `coins = [[1,10,3]], k = 2`
- **Output:** `6`
- **Explanation:** Selecting $k = 2$ consecutive bags from index `1` to `2` yields `3 + 3 = 6` coins.

### Constraints
- `1 <= coins.length <= 10^5`
- `coins[i] = [left_i, right_i, weight_i]`
- `1 <= left_i <= right_i <= 10^9`
- `1 <= weight_i <= 10^6`
- The given intervals are non-overlapping.
- `1 <= k <= 10^9`

---

# 992. Subarrays with K Distinct Integers

Leetcode: https://leetcode.com/problems/subarrays-with-k-distinct-integers/description/

Given an integer array `nums` and an integer `k`, return *the number of **good subarrays** of `nums`*.

A **good array** is an array where the number of distinct integers is exactly `k`.
- For example, `[1, 2, 3, 1, 2]` has `3` distinct integers: `1`, `2`, and `3`.

A **subarray** is a contiguous part of an array.

### Examples

**Example 1:**
- **Input:** `nums = [1,2,1,2,3], k = 2`
- **Output:** `7`
- **Explanation:** Subarrays formed with exactly 2 different integers: `[1,2]`, `[2,1]`, `[1,2]`, `[2,3]`, `[1,2,1]`, `[2,1,2]`, `[1,2,1,2]`.

**Example 2:**
- **Input:** `nums = [1,2,1,3,4], k = 3`
- **Output:** `3`
- **Explanation:** Subarrays formed with exactly 3 different integers: `[1,2,1,3]`, `[2,1,3]`, `[1,3,4]`.

### Constraints
- `1 <= nums.length <= 2 * 10^4`
- `1 <= nums[i], k <= nums.length`

---


# Longest Bitonic Subsequence

Leetcode: https://leetcode.com/problems/minimum-number-of-removals-to-make-mountain-array/description/

Given an array of positive integers `nums`, find the maximum length of a **bitonic subsequence**.

A subsequence of an array is called **bitonic** if it is first strictly increasing and then strictly decreasing.

> **Note:** A sequence that is purely strictly increasing or purely strictly decreasing is **not** considered a valid bitonic sequence (it must have both an increasing part and a decreasing part).

### Examples

**Example 1:**
- **Input:** `nums = [1, 2, 5, 3, 2]`
- **Output:** `5`
- **Explanation:** The entire sequence `[1, 2, 5, 3, 2]` is bitonic because it increases (`1 < 2 < 5`) and then decreases (`5 > 3 > 2`).

**Example 2:**
- **Input:** `nums = [1, 11, 2, 10, 4, 5, 2, 1]`
- **Output:** `6`
- **Explanation:** One longest bitonic subsequence is `[1, 2, 10, 5, 2, 1]` which has length 6.

**Example 3:**
- **Input:** `nums = [10, 20, 30]`
- **Output:** `0`
- **Explanation:** The array is strictly increasing with no decreasing part, so no valid bitonic subsequence exists.

**Example 4:**
- **Input:** `nums = [10, 10, 10]`
- **Output:** `0`
- **Explanation:** All elements are equal, so no strictly increasing and decreasing subsequence can be formed.

### Constraints
- `1 <= nums.length <= 10^5`
- `1 <= nums[i] <= 10^5`

---

# 2281. Sum of Total Strength of Wizards

Leetcode: https://leetcode.com/problems/sum-of-total-strength-of-wizards/description/

Amazon Web Services has `n` servers. The cache optimization power of the $i^{\text{th}}$ server is `power[i]`.

The cache optimization power of a contiguous group of servers $[l, r]$ is defined as:

$$\text{Power}_{[l, r]} = \left(\min_{l \le i \le r} \text{power}[i]\right) \times \left(\sum_{i=l}^r \text{power}[i]\right)$$


Find the sum of $\text{Power}_{[l, r]}$ for each possible contiguous group of servers. Since the answer can be very large, return the answer modulo $10^9 + 7$.

### Examples

**Example 1:**
- **Input:** `power = [2,3,2,1]`
- **Output:** `69`
- **Explanation:**
  The powers of all contiguous groups of servers are:
  - `Power[0,0] = min([2]) * sum([2]) = 2 * 2 = 4`
  - `Power[0,1] = min([2, 3]) * sum([2, 3]) = 2 * 5 = 10`
  - `Power[0,2] = min([2, 3, 2]) * sum([2, 3, 2]) = 2 * 7 = 14`
  - `Power[0,3] = min([2, 3, 2, 1]) * sum([2, 3, 2, 1]) = 1 * 8 = 8`
  - `Power[1,1] = min([3]) * sum([3]) = 3 * 3 = 9`
  - `Power[1,2] = min([3, 2]) * sum([3, 2]) = 2 * 5 = 10`
  - `Power[1,3] = min([3, 2, 1]) * sum([3, 2, 1]) = 1 * 6 = 6`
  - `Power[2,2] = min([2]) * sum([2]) = 2 * 2 = 4`
  - `Power[2,3] = min([2, 1]) * sum([2, 1]) = 1 * 3 = 3`
  - `Power[3,3] = min([1]) * sum([1]) = 1 * 1 = 1`

  Overall sum = `4 + 10 + 14 + 8 + 9 + 10 + 6 + 4 + 3 + 1 = 69`.
  `69 mod (10^9 + 7) = 69`.

### Constraints
- `1 <= power.length <= 10^5`
- `1 <= power[i] <= 10^9`

---

# Sum of Array After Value Replacements

You are given an integer array `entries` and a 2D integer array `transactions`, where `transactions[i] = [old_v, new_v]`.

For each transaction `[old_v, new_v]`, perform the following steps sequentially:
1. Find all indices in `entries` where `entries[idx] == old_v`.
2. Replace the value at those indices with `new_v`.
3. Calculate the sum of all elements in `entries` after the update.

Return *an array of integers representing the sum of `entries` after each transaction*.

### Examples

**Example 1:**
- **Input:** `entries = [1, 2, 2, 3]`, `transactions = [[2, 4], [1, 3], [4, 1]]`
- **Output:** `[12, 14, 8]`
- **Explanation:**
  - Initial array: `[1, 2, 2, 3]` (sum = `8`).
  - Transaction 1 `[2, 4]`: Replace all `2`s with `4`. Array becomes `[1, 4, 4, 3]`. Sum = `12`.
  - Transaction 2 `[1, 3]`: Replace all `1`s with `3`. Array becomes `[3, 4, 4, 3]`. Sum = `14`.
  - Transaction 3 `[4, 1]`: Replace all `4`s with `1`. Array becomes `[3, 1, 1, 3]`. Sum = `8`.

**Example 2:**
- **Input:** `entries = [5, 5, 5]`, `transactions = [[5, 10], [10, 2]]`
- **Output:** `[30, 6]`
- **Explanation:**
  - Transaction 1 `[5, 10]`: Array becomes `[10, 10, 10]`. Sum = `30`.
  - Transaction 2 `[10, 2]`: Array becomes `[2, 2, 2]`. Sum = `6`.

### Constraints
- `1 <= entries.length <= 10^5`
- `1 <= entries[i] <= 10^9`
- `1 <= transactions.length <= 10^5`
- `transactions[i].length == 2`
- `1 <= old_v, new_v <= 10^9`

---

# Longest Arithmetic Subarray After Modifying At Most One Element

Given an array of integers `nums`, you are allowed to change at most one element in the array to any integer value.

Return the maximum length of a contiguous subarray that forms an **arithmetic progression** after at most one modification.

An **arithmetic progression** is a sequence of numbers such that the difference between any two consecutive elements is constant. Note that any contiguous sequence of length $1$ or $2$ always forms an arithmetic progression.

### Examples

**Example 1:**
- **Input:** `nums = [8, 5, 2, 1, 100]`
- **Output:** `4`
- **Explanation:** Changing `nums[3]` from `1` to `-1` produces the contiguous subarray `[8, 5, 2, -1]`, which forms an arithmetic progression with a common difference of `-3`.

**Example 2:**
- **Input:** `nums = [1, 3, 100, 7, 9]`
- **Output:** `5`
- **Explanation:** Changing `nums[2]` from `100` to `5` results in `[1, 3, 5, 7, 9]`, forming an arithmetic progression of length `5` with a common difference of `2`.

**Example 3:**
- **Input:** `nums = [1, 2, 4, 8, 16]`
- **Output:** `3`
- **Explanation:** Changing `nums[2]` from `4` to `3` forms the subarray `[1, 2, 3]` with a common difference of `1`.

### Constraints
- `1 <= nums.length <= 10^5`
- `-10^9 <= nums[i] <= 10^9`

---

# Total Cumulative Response Time After Throttling

In Amazon's web infrastructure, the system logs $n$ API requests per second, recording each request's response time in the array `responseTimes`, where each element denotes the time taken to respond to a single request.

To prevent system overload, a throttling mechanism is applied with the following behavior:
- In each step, select the request with the minimum response time among all currently active requests.
- Remove the selected request and its immediate active neighbors in the array (based on original indices) from the logs permanently.
- This process continues until all requests are removed.

If multiple active requests have the same minimum response time, select the one with the lowest index.

Return the total cumulative response time of all selected requests over the entire throttling process.

### Examples

**Example 1:**
- **Input:** `responseTimes = [4, 2, 9, 1, 7, 3]`
- **Output:** `6`
- **Explanation:** 
  - Select `1` (index 3), remove its immediate neighbors `9` and `7`: `active = [1, 1, 0, 0, 0, 1]`.
  - Select `2` (index 1), remove its immediate neighbor `4` (since `9` is already removed): `active = [0, 0, 0, 0, 0, 1]`.
  - Select `3` (index 5), remove it: `active = [0, 0, 0, 0, 0, 0]`.
  - Total sum = `1 + 2 + 3 = 6`.

**Example 2:**
- **Input:** `responseTimes = [6, 4, 9, 10, 34, 54, 56]`
- **Output:** `68`
- **Explanation:** 
  - Select `4` (index 1), remove its neighbors `6` and `9`: `active = [0, 0, 0, 1, 1, 1, 1]`.
  - Select `10` (index 3), remove its neighbor `34`: `active = [0, 0, 0, 0, 0, 1, 1]`.
  - Select `54` (index 5), remove its neighbor `56`: `active = [0, 0, 0, 0, 0, 0, 0]`.
  - Total sum = `4 + 10 + 54 = 68`.

### Constraints
- `1 <= responseTimes.length <= 10^5`
- `1 <= responseTimes[i] <= 10^9`

---

# Maximize Protected Population

In Amazon's Smart Cities Management System, each city has a given population, and some cities are equipped with security units[cite: 4].

You are given:
- An integer array `population` of size $n$, where `population[i]` is the population of the $i$-th city[cite: 4].
- A binary string `unit` of length $n$, where `unit[i] = '1'` means the $i$-th city initially has a security unit, and `'0'` means it does not[cite: 4].

You can relocate security units according to the following rules[cite: 4]:
- A security unit at index $i$ (where $i > 0$) can be moved one step to the left to index $i - 1$[cite: 4].
- Each security unit can be moved at most once[cite: 4].
- If moved, index $i$ loses its unit and index $i - 1$ gains a unit[cite: 4].
- A security unit at index $0$ cannot be moved further left[cite: 4].

A city is considered **protected** if it has at least one security unit after all relocations[cite: 4].

Return the **maximum total population** of protected cities that can be achieved after applying optimal relocations[cite: 4, 5].

### Examples

**Example 1:**
- **Input:** `population = [10, 5, 8, 9, 6]`, `unit = "01101"`[cite: 5]
- **Output:** `27`[cite: 5]
- **Explanation:**[cite: 5]
  - Move the unit at index `1` to index `0`. The unit configuration becomes `"10101"`. Protected population = $10 + 8 + 6 = 24$[cite: 5].
  - Move the unit at index `4` to index `3`. The unit configuration becomes `"10110"`. Protected population = $10 + 8 + 9 = 27$[cite: 5].
  - The maximum protected population achievable is `27`[cite: 5].

### Constraints
- `1 <= population.length <= 10^5`[cite: 4]
- `population.length == unit.length`[cite: 4]
- `1 <= population[i] <= 10^9`[cite: 4]
- `unit[i]` is either `'0'` or `'1'`[cite: 4]


---

# 113. Path Sum II

Leetcode: https://leetcode.com/problems/path-sum-ii/description/

Given the `root` of a binary tree and an integer `targetSum`, return *all **root-to-leaf** paths where the sum of the node values in the path equals `targetSum`. Each path should be returned as a list of node values, not node references*.

A **root-to-leaf** path is a path starting from the root and ending at any leaf node. A **leaf** is a node with no children.

### Examples

**Example 1:**
- **Input:** `root = [5,4,8,11,null,13,4,7,2,null,null,5,1]`, `targetSum = 22`
- **Output:** `[[5,4,11,2],[5,8,4,5]]`
- **Explanation:** There are two root-to-leaf paths whose sum equals 22:
  - `5 + 4 + 11 + 2 = 22`
  - `5 + 8 + 4 + 5 = 22`

**Example 2:**
- **Input:** `root = [1,2,3]`, `targetSum = 5`
- **Output:** `[]`

**Example 3:**
- **Input:** `root = [1,2]`, `targetSum = 0`
- **Output:** `[]`

### Constraints
- The number of nodes in the tree is in the range `[0, 5000]`.
- `-1000 <= Node.val <= 1000`
- `-1000 <= targetSum <= 1000`

---

# 198. House Robber

Leetcode: https://leetcode.com/problems/house-robber/description/

You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed, the only constraint stopping you from robbing each of them is that adjacent houses have security systems connected and **it will automatically contact the police if two adjacent houses were broken into on the same night**.

Given an integer array `nums` representing the amount of money of each house, return *the maximum amount of money you can rob tonight without alerting the police*.

### Examples

**Example 1:**
- **Input:** `nums = [1,2,3,1]`
- **Output:** `4`
- **Explanation:** Rob house 1 (money = 1) and then rob house 3 (money = 3).
Total amount you can rob = 1 + 3 = 4.

**Example 2:**
- **Input:** `nums = [2,7,9,3,1]`
- **Output:** `12`
- **Explanation:** Rob house 1 (money = 2), rob house 3 (money = 9) and rob house 5 (money = 1).
Total amount you can rob = 2 + 9 + 1 = 12.

### Constraints
- `1 <= nums.length <= 100`
- `0 <= nums[i] <= 400`


---

# 213. House Robber II

Leetcode: https://leetcode.com/problems/house-robber-ii/description/

You are planning to rob houses along a street, but this time the houses are arranged in a circle. Each house contains a certain amount of money, and neighboring houses are connected to an alarm system that alerts the police if two adjacent houses are broken into on the same night.

Because the houses form a circle, the first house and the last house are also considered adjacent.

Given an integer array `nums` representing the amount of money at each house, return *the maximum amount of money you can rob tonight without triggering the alarm*.

### Examples

**Example 1:**
- **Input:** `nums = [2,3,2]`
- **Output:** `3`
- **Explanation:** You cannot rob house 1 (money = 2) and house 3 (money = 2) because they are adjacent in a circular layout.

**Example 2:**
- **Input:** `nums = [1,2,3,1]`
- **Output:** `4`
- **Explanation:** Rob house 1 (money = 1) and then rob house 3 (money = 3).
Total amount you can rob = 1 + 3 = 4.

**Example 3:**
- **Input:** `nums = [1,2,3]`
- **Output:** `3`

### Constraints
- `1 <= nums.length <= 100`
- `0 <= nums[i] <= 1000`

---

# 200. Number of Islands

Leetcode: https://leetcode.com/problems/number-of-islands/description/

Given an `m x n` 2D binary grid `grid` which represents a map of `'1'`s (land) and `'0'`s (water), return *the number of islands*.

An **island** is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.

### Examples

**Example 1:**
- **Input:** `grid = [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]`
- **Output:** `1`

**Example 2:**
- **Input:** `grid = [["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]`
- **Output:** `3`

### Constraints
- `m == grid.length`
- `n == grid[i].length`
- `1 <= m, n <= 300`
- `grid[i][j]` is `'0'` or `'1'`.


---

# 45. Jump Game II (Maximum Reachable Index / Minimum Jumps)

Leetcode: https://leetcode.com/problems/jump-game-ii/description/

You are given a 0-indexed array of integers `nums` of length `n`. You are initially positioned at `nums[0]`.

Each element `nums[i]` represents the maximum length of a forward jump from index `i`. In other words, if you are at `nums[i]`, you can jump to any `nums[i + j]` where:
- `0 <= j <= nums[i]`
- `i + j < n`

Return the minimum number of jumps required to reach `nums[n - 1]`. The test cases are generated such that you can always reach `nums[n - 1]`.

### Examples

**Example 1:**
- **Input:** `nums = [2,3,1,1,4]`
- **Output:** `2`
- **Explanation:** The minimum number of jumps to reach the last index is `2`. Jump 1 step from index `0` to index `1`, then `3` steps to the last index.

**Example 2:**
- **Input:** `nums = [2,3,0,1,4]`
- **Output:** `2`
- **Explanation:** Jump to index `1`, then jump `3` steps to index `4`.

### Constraints
- `1 <= nums.length <= 10^4`
- `0 <= nums[i] <= 1000`
- It is guaranteed that you can reach `nums[n - 1]`.

---


# 4. Median of Two Sorted Arrays

Leetcode: https://leetcode.com/problems/median-of-two-sorted-arrays/description/

Given two sorted arrays `nums1` and `nums2` of size `m` and `n` respectively, return the median of the two sorted arrays.

The overall run time complexity should be `O(log(min(m, n)))`.

### Examples

**Example 1:**
- **Input:** `nums1 = [1,3]`, `nums2 = [2]`
- **Output:** `2.00000`
- **Explanation:** Merged array = `[1, 2, 3]` and median is `2.0`.

**Example 2:**
- **Input:** `nums1 = [1,2]`, `nums2 = [3,4]`
- **Output:** `2.50000`
- **Explanation:** Merged array = `[1, 2, 3, 4]` and median is `(2 + 3) / 2 = 2.5`.

### Constraints
- `nums1.length == m`
- `nums2.length == n`
- `0 <= m <= 1000`
- `0 <= n <= 1000`
- `1 <= m + n <= 2000`
- `-10^6 <= nums1[i], nums2[i] <= 10^6`

---

# 918. Maximum Sum Circular Subarray

Leetcode: https://leetcode.com/problems/maximum-sum-circular-subarray/description/

Given a circular integer array `nums` of length `n`, return the maximum possible sum of a non-empty subarray of `nums`.

A **circular array** means the end of the array connects to the beginning of the array. Formally, the next element of `nums[i]` is `nums[(i + 1) % n]` and the previous element of `nums[i]` is `nums[(i - 1 + n) % n]`.

A **subarray** may only include each element of the fixed buffer `nums` at most once. Formally, for a subarray `nums[i], nums[i + 1], ..., nums[j]`, there does not exist `i <= k1, k2 <= j` such that `k1 % n == k2 % n`.

### Examples

**Example 1:**
- **Input:** `nums = [1,-2,3,-2]`
- **Output:** `3`
- **Explanation:** Subarray `[3]` has maximum sum `3`.

**Example 2:**
- **Input:** `nums = [5,-3,5]`
- **Output:** `10`
- **Explanation:** Subarray `[5, 5]` (taking elements from index 2 and index 0) has maximum sum `5 + 5 = 10`.

**Example 3:**
- **Input:** `nums = [-3,-2,-3]`
- **Output:** `-2`
- **Explanation:** Subarray `[-2]` has maximum sum `-2`.

### Constraints
- `n == nums.length`
- `1 <= n <= 3 * 10^4`
- `-3 * 10^4 <= nums[i] <= 3 * 10^4`

---

# 3026. Maximum Good Subarray Sum

Leetcode: https://leetcode.com/problems/maximum-good-subarray-sum/description/

You are given an array of integers `nums` and a positive integer `k`.

A **subarray** of `nums` is called **good** if the absolute difference between its first element and its last element is equal to `k`. That is, for a subarray starting at index `i` and ending at index `j`, `|nums[i] - nums[j]| == k`.

Return the *maximum sum of a good subarray*. If no good subarray exists, return `0`.

### Examples

**Example 1:**
- **Input:** `nums = [1,2,3,4,5,6]`, `k = 1`
- **Output:** `11`
- **Explanation:** The good subarrays where `|nums[i] - nums[j]| == 1` are `[1, 2]`, `[2, 3]`, `[3, 4]`, `[4, 5]`, and `[5, 6]`. The maximum subarray sum is `11` from `[5, 6]`.

**Example 2:**
- **Input:** `nums = [-1,3,2,4,5]`, `k = 3`
- **Output:** `11`
- **Explanation:** The good subarrays where `|nums[i] - nums[j]| == 3` are `[-1, 3, 2]` (sum `4`) and `[2, 4, 5]` (sum `11`). The maximum subarray sum is `11`.

**Example 3:**
- **Input:** `nums = [-1,-2,-3,-4]`, `k = 2`
- **Output:** `-6`
- **Explanation:** The good subarrays where `|nums[i] - nums[j]| == 2` are `[-1, -2, -3]` (sum `-6`) and `[-2, -3, -4]` (sum `-9`). The maximum subarray sum is `-6`.

### Constraints
- `2 <= nums.length <= 10^5`
- `-10^9 <= nums[i] <= 10^9`
- `1 <= k <= 10^9`

---

# 253. Meeting Rooms II

Leetcode: https://leetcode.com/problems/meeting-rooms-ii/description/

Given an array of meeting time intervals `intervals` where `intervals[i] = [start_i, end_i]`, return the minimum number of conference rooms required to schedule all meetings.

### Examples

**Example 1:**
- **Input:** `intervals = [[0,30],[5,10],[10,15]]`
- **Output:** `2`
- **Explanation:** Room 1 hosts `[0,30]`, while Room 2 can host `[5,10]` and then `[10,15]`.

**Example 2:**
- **Input:** `intervals = [[7,10],[2,4]]`
- **Output:** `1`

### Constraints
- `1 <= intervals.length <= 10^4`
- `0 <= start_i < end_i <= 10^6`

---

# Next Palindromic Time

Given a 24-hour time string `time` in the format `"HH:MM"`, return the next closest valid time in 24-hour format that forms a palindrome.

A time `"HH:MM"` is considered a palindrome if the digits read the same forwards and backwards (i.e., `HH[0] == MM[1]` and `HH[1] == MM[0]`). If the next palindromic time occurs on the following day, wrap around to `"00:00"`.

### Examples

**Example 1:**
- **Input:** `time = "12:20"`
- **Output:** `"12:21"`
- **Explanation:** The next valid time where hours and minutes form a palindrome is `"12:21"`.

**Example 2:**
- **Input:** `time = "23:59"`
- **Output:** `"00:00"`
- **Explanation:** After `"23:59"`, the next palindromic time occurs on the next day at `"00:00"`.

### Constraints
- `time` is a valid 24-hour time string in `"HH:MM"` format.
- `00 <= HH <= 23`
- `00 <= MM <= 59`

---

# 1439. Find the Kth Smallest Sum of a Matrix With Sorted Rows

Leetcode: https://leetcode.com/problems/find-the-kth-smallest-sum-of-a-matrix-with-sorted-rows/description/

You are given an `m x n` matrix `mat` that has its rows sorted in non-decreasing order.

You are allowed to choose exactly one element from each row to form an array sum.

Return the `k`-th smallest array sum among all possible array sums.

### Examples

**Example 1:**
- **Input:** `mat = [[1,3,11],[2,4,6]]`, `k = 5`
- **Output:** `7`
- **Explanation:** Choosing one element from each row, the possible sums are:
  `1+2=3`, `1+4=5`, `3+2=5`, `1+6=7`, `3+4=7`, `3+6=9`, `11+2=13`, `11+4=15`, `11+6=17`.
  The 5th smallest sum is `7`.

**Example 2:**
- **Input:** `mat = [[1,3,11],[2,4,6]]`, `k = 9`
- **Output:** `17`

**Example 3:**
- **Input:** `mat = [[1,10,10],[1,14,14],[1,1,2]]`, `k = 7`
- **Output:** `9`

### Constraints
- `m == mat.length`
- `n == mat[i].length`
- `1 <= m, n <= 40`
- `1 <= k <= min(200, n^m)`
- `1 <= mat[i][j] <= 5000`
- `mat[i]` is sorted in non-decreasing order.

---

# Maximum Secure Delivery Logs

You are given an integer array `delivery_logs`, where `delivery_logs[i]` represents the total number of logs belonging to the $i$-th delivery unit, and an even integer `k` representing the number of available warehouses.

You must distribute logs into the `k` warehouses under the following rules:
- Each warehouse can contain logs from **only one** delivery unit (logs from different delivery units cannot be mixed into the same warehouse).
- A delivery unit's logs can be partitioned and split across multiple warehouses.
- Not all delivery units or logs are required to be used if they cannot fit within the warehouse constraints.

After distributing the logs, the $k / 2$ warehouses containing the **most** logs are compromised. The logs stored in the remaining $k / 2$ warehouses are considered **secure**.

Return the **maximum total number of logs** that can remain secure.

### Examples

**Example 1:**
- **Input:** `delivery_logs = [3, 5, 9, 6]`, `k = 4`
- **Output:** `9`
- **Explanation:**
  We can distribute logs into $k = 4$ warehouses as follows:
  - Warehouse 1: `5` logs (from unit with `5` logs)
  - Warehouse 2: `6` logs (from unit with `6` logs)
  - Warehouse 3: `4` logs (split from unit with `9` logs)
  - Warehouse 4: `5` logs (split from unit with `9` logs)
  
  The $k / 2 = 2$ warehouses with the most logs (Warehouse 2 with `6` logs and Warehouse 1 or 4 with `5` logs) are compromised.
  The remaining $2$ warehouses contain $4 + 5 = 9$ secure logs.

**Example 2:**
- **Input:** `delivery_logs = [1, 2, 3]`, `k = 2`
- **Output:** `3`
- **Explanation:**
  We have $k = 2$ warehouses, so $k / 2 = 1$ warehouse will be compromised and $1$ warehouse will remain secure. We can assign `3` logs (from unit `3`) to Warehouse 1 and `3` logs (from unit `1` and `2` partitioned into separate warehouses) to Warehouse 2. The secure warehouse receives `3` logs.

### Constraints
- `1 <= delivery_logs.length <= 10^5`
- `1 <= delivery_logs[i] <= 10^9`
- `2 <= k <= 10^5`
- `k` is an even integer.

---

# Array Generator Service

Your project team is collaborating with a group of software testers who have requested an array generator service to assist in testing software functionality.

The service takes the following input parameters:
- `arr`: An array of `n` positive integers.
- `state`: A string of `n` binary characters (`'0'` or `'1'`), where:
  - `'1'` indicates that the corresponding `arr[i]` is available for selection.
  - `'0'` indicates that `arr[i]` is blocked initially.
- `m`: The number of operations to perform.

### Operations
To generate an integer sequence $S$, perform exactly $m$ operations as follows:
1. Choose any available `arr[i]` (where `state[i] == '1'`). The same element can be chosen multiple times.
2. Append the selected `arr[i]` to $S$.
3. Update the state: Any `state[i] = '0'` where `state[i - 1] = '1'` is changed to `'1'`. This means that blocked elements adjacent (to the right) to available ones become available for future operations.

### Objective
Find the lexicographically largest sequence $S$ that can be obtained after exactly $m$ operations.

### Examples

**Example 1:**
- **Input:** `arr = [10, 5, 7, 6]`, `state = "0101"`, `m = 2`
- **Output:** `[6, 7]`
- **Explanation:**
  - Step 1: Available elements are `{5, 6}`. Choose `6`. Updated state becomes `"0111"` (since index 1 is `'1'`, index 2 becomes `'1'`).
  - Step 2: Available elements are `{5, 6, 7}`. Choose `7`. Updated state becomes `"0111"`.
  - Sequence $S = [6, 7]$ is lexicographically larger than $[5, 6]$ or $[5, 5]$.

**Example 2:**
- **Input:** `arr = [4, 9, 1, 2, 10]`, `state = "00100"`, `m = 4`
- **Output:** `[1, 2, 10, 10]`
- **Explanation:**
  - Step 1: Available elements are `{1}`. Choose `1`. State becomes `"00110"`.
  - Step 2: Available elements are `{1, 2}`. Choose `2`. State becomes `"00111"`.
  - Step 3: Available elements are `{1, 2, 10}`. Choose `10`. State remains `"00111"`.
  - Step 4: Available elements are `{1, 2, 10}`. Choose `10`.
  - Sequence $S = [1, 2, 10, 10]$.

### Constraints
- `1 <= n <= 10^5`
- `1 <= arr[i] <= 10^9`
- `1 <= m <= 10^5`
- `state` is a binary string of length `n` containing only `'0'` and `'1'`


---

# 2506. Count Pairs Of Similar Strings

Leetcode: https://leetcode.com/problems/count-pairs-of-similar-strings/description/

You are given a 0-indexed string array `words`.

Two strings are considered **similar** if they consist of the same characters, regardless of character frequency or order (for example, `"abca"` and `"cba"` are similar because both consist of characters `'a'`, `'b'`, and `'c'`).

Return the number of pairs `(i, j)` such that `0 <= i < j < words.length` and `words[i]` is similar to `words[j]`.

### Examples

**Example 1:**
- **Input:** `words = ["aba","aabb","abcd","bac","aabc"]`
- **Output:** `2`
- **Explanation:** There are 2 pairs that satisfy the conditions:
  - `i = 0` and `j = 1`: `words[0]` (`"aba"`) and `words[1]` (`"aabb"`) both consist of `'a'` and `'b'`.
  - `i = 0` and `j = 3`: `words[0]` (`"aba"`) and `words[3]` (`"bac"`) both consist of `'a'`, `'b'`, and `'c'`? No, `words[3]` has `'c'`. Correct pair is `words[0]` and `words[1]`, and `words[1]` and `words[3]` if characters match.

**Example 2:**
- **Input:** `words = ["aabb","ab","ba"]`
- **Output:** `3`
- **Explanation:** All 3 pairs are similar to each other since all strings consist only of characters `'a'` and `'b'`.

**Example 3:**
- **Input:** `words = ["nba","cba","dba"]`
- **Output:** `0`
- **Explanation:** No two strings consist of the exact same set of characters.

### Constraints
- `1 <= words.length <= 1000`
- `1 <= words[i].length <= 100`
- `words[i]` consists of only lowercase English letters.

---

# 2762. Continuous Subarrays (Subarrays with Max - Min ≤ K)

Leetcode: https://leetcode.com/problems/continuous-subarrays/description/

You are given a 0-indexed integer array `nums` and an integer `k`.

A **subarray** is considered valid if the difference between the maximum and minimum elements in that subarray is at most `k`. That is, for a subarray `nums[i..j]`, `max(nums[i..j]) - min(nums[i..j]) <= k`.

Return the total number of valid subarrays.

### Examples

**Example 1:**
- **Input:** `nums = [5,4,2,4]`, `k = 2`
- **Output:** `8`
- **Explanation:** 
  - Subarrays of length 1: `[5]`, `[4]`, `[2]`, `[4]` (4 subarrays, max - min = 0 <= 2)
  - Subarrays of length 2: `[5,4]` (max-min=1), `[4,2]` (max-min=2), `[2,4]` (max-min=2) (3 subarrays)
  - Subarrays of length 3: `[4,2,4]` (max-min=2) (1 subarray)
  - Total valid subarrays = `4 + 3 + 1 = 8`.

**Example 2:**
- **Input:** `nums = [1,3,6]`, `k = 3`
- **Output:** `5`
- **Explanation:**
  - Length 1: `[1]`, `[3]`, `[6]` (3 subarrays)
  - Length 2: `[1,3]` (max-min=2 <= 3), `[3,6]` (max-min=3 <= 3) (2 subarrays)
  - Length 3: `[1,3,6]` (max-min=5 > 3, invalid)
  - Total valid subarrays = `3 + 2 = 5`.

### Constraints
- `1 <= nums.length <= 10^5`
- `1 <= nums[i] <= 10^9`
- `0 <= k <= 10^9`

---

# Maximum Number of Characters That Can Be Removed

You are given a string `s`. The **type** of a string is defined as a pair formed by its first character and its last character. For example, the string `"abade"` has type `("a", "e")`, and a single-character string `"a"` has type `("a", "a")`.

In one operation, you can remove any number of characters from the start, the end, or both ends of the string, as long as the remaining non-empty substring maintains the **same type** as the original string `s`.

Return the *maximum number of characters* that can be removed while keeping the string's type unchanged.

### Examples

**Example 1:**
- **Input:** `s = "abade"`
- **Output:** `2`
- **Explanation:** The original string `"abade"` has type `("a", "e")`. Removing the prefix `"ab"` results in `"ade"`, which still has type `("a", "e")`. A total of 2 characters were removed.

**Example 2:**
- **Input:** `s = "aaaaa"`
- **Output:** `4`
- **Explanation:** The original string `"aaaaa"` has type `("a", "a")`. We can remove 4 characters to leave `"a"`, which has type `("a", "a")`.

**Example 3:**
- **Input:** `s = "aba"`
- **Output:** `2`
- **Explanation:** The original string `"aba"` has type `("a", "a")`. Removing 2 characters leaves `"a"`, which still has type `("a", "a")`.

### Constraints
- $1 \le \text{s.length} \le 10^5$
- `s` consists only of lowercase English letters.

---

# Maximum Packages with Equal Total Cost

You are given an integer array `itemCost`, where `itemCost[i]` represents the cost of the $i$-th item.

You want to group items into packages such that:
1. Every package contains at least one item.
2. Each item belongs to at most one package.
3. All packages have the **exact same total cost**.

Return the *maximum number of packages* that can be formed.

### Examples

**Example 1:**
- **Input:** `itemCost = [1, 2, 3, 4, 5]`
- **Output:** `3`
- **Explanation:** We can form 3 packages each having a total cost of 5: `[5]`, `[1, 4]`, and `[2, 3]`.

**Example 2:**
- **Input:** `itemCost = [2, 2, 2, 2]`
- **Output:** `4`
- **Explanation:** We can form 4 packages each having a total cost of 2: `[2]`, `[2]`, `[2]`, and `[2]`.

**Example 3:**
- **Input:** `itemCost = [1, 3, 2, 4]`
- **Output:** `2`
- **Explanation:** We can form 2 packages with a total cost of 5: `[1, 4]` and `[2, 3]`.

### Constraints
- $1 \le \text{itemCost.length} \le 1000$
- $1 \le \text{itemCost}[i] \le 1000$

---

# Maximum Balanced Shipments

Amazon has multiple delivery centers. For the distribution of $n$ goods, $n$ contiguous parcels are arranged in a row. The $i$-th parcel has a weight given by `weight[i]`.

A **shipment** consists of a contiguous segment of parcels. A shipment is defined as **balanced** if the weight of the last parcel in the shipment is strictly greater than the maximum weight among all other parcels in that shipment.

Given an array of integers `weight`, return the **maximum number of non-overlapping balanced shipments** that can be formed.

### Examples

**Example 1:**
- **Input:** `weight = [1, 2, 3, 2, 3, 4]`
- **Output:** `2`
- **Explanation:** 
  - Shipment 1: `[1, 2, 3]` — The last element is $3$, which is strictly greater than $\max(1, 2) = 2$.
  - Shipment 2: `[2, 3, 4]` — The last element is $4$, which is strictly greater than $\max(2, 3) = 3$.
  - Both shipments are non-overlapping, giving a maximum total of 2.

**Example 2:**
- **Input:** `weight = [4, 3, 2]`
- **Output:** `0`
- **Explanation:** No contiguous segment exists where the last parcel's weight is strictly greater than the maximum weight of all other parcels in that segment.

### Constraints
- $1 \le \text{weight.length} \le 2 \times 10^5$
- $1 \le \text{weight}[i] \le 10^9$

---

# Minimum Swaps to Position Lightest and Heaviest Blocks

Leetcode: https://leetcode.com/problems/semi-ordered-permutation/description/

Imagine you are shopping on Amazon.com for weightlifting equipment. The equipment consists of a stack of $n$ blocks, each with a distinct weight.

The array `blocks` represents the weights of the blocks from top to bottom (1-indexed). The weightlifting equipment is considered **good** if:
- The block at the top (`blocks[1]`) is the lightest block in the stack.
- The block at the bottom (`blocks[n]`) is the heaviest block in the stack.

In one move, you can swap the order of adjacent blocks. Return the **minimum number of moves** required to form good weightlifting equipment.

### Examples

**Example 1:**
- **Input:** `blocks = [3, 2, 1]`
- **Output:** `3`
- **Explanation:** 
  - Move 1: Swap first and second blocks $\rightarrow$ `blocks = [2, 3, 1]`
  - Move 2: Swap second and third blocks $\rightarrow$ `blocks = [2, 1, 3]`
  - Move 3: Swap first and second blocks $\rightarrow$ `blocks = [1, 2, 3]`

**Example 2:**
- **Input:** `blocks = [2, 4, 3, 1, 6]`
- **Output:** `3`
- **Explanation:** 
  - Move 1: Swap third and fourth blocks $\rightarrow$ `blocks = [2, 4, 1, 3, 6]`
  - Move 2: Swap second and third blocks $\rightarrow$ `blocks = [2, 1, 4, 3, 6]`
  - Move 3: Swap first and second blocks $\rightarrow$ `blocks = [1, 2, 4, 3, 6]`

**Example 3:**
- **Input:** `blocks = [4, 11, 9, 10, 12]`
- **Output:** `0`
- **Explanation:** The blocks are already in their correct positions (`blocks[1]` is the minimum and `blocks[5]` is the maximum).

### Constraints
- $2 \le n \le 10^5$
- $1 \le blocks[i] \le 10^9$ for all $1 \le i \le n$
- `blocks` consists of distinct integers.

---

# Count Distinct Passwords by Reversing One Substring

Weak passwords are likely to be hacked and misused. To evaluate password security, developers at Amazon estimate the **variability** of a password as the number of distinct password strings that can be obtained by reversing **any one substring** of the original password.

Given a string `password` consisting of lowercase English characters, return its variability (the total number of distinct strings that can be formed).

*Note: A substring is a contiguous sequence of characters within a string.*

### Examples

**Example 1:**
- **Input:** `password = "abc"`
- **Output:** `4`
- **Explanation:** 
  - Reversing any substring of length 1 gives the original string `"abc"`.
  - Reversing the substring `"ab"` gives `"bac"`.
  - Reversing the substring `"bc"` gives `"acb"`.
  - Reversing the substring `"abc"` gives `"cba"`.
  
  The 4 distinct strings formed are `"abc"`, `"bac"`, `"acb"`, and `"cba"`.

**Example 2:**
- **Input:** `password = "abaa"`
- **Output:** `4`
- **Explanation:** The 4 distinct strings that can be formed are `"abaa"`, `"aaba"`, `"baaa"`, and `"aaab"`.

### Constraints
- $1 \le \text{length of } password \le 10^5$
- `password` consists only of lowercase English letters (`'a'` - `'z'`).

---

# Server Load Balancing Target

The developers at Amazon are working on a prototype for a simple load-balancing algorithm. There are `num_servers` servers numbered from `0` to `num_servers - 1`, and the initial number of requests assigned to each server is `0`.

For each request in `requests`, it must be assigned to the server with the **minimum number of requests** among the servers with IDs from `0` to `requests[i]`. If there are multiple servers with the same minimum number of requests, choose the server with the **smallest ID**.

When a request is assigned to a server, its total assigned requests increase by `1`.

Given `num_servers` and an array `requests`, return an array of server IDs indicating which server each request is assigned to.

### Examples

**Example 1:**
- **Input:** `num_servers = 5`, `requests = [3, 2, 3, 2, 4]`
- **Output:** `[0, 1, 2, 0, 3]`
- **Explanation:** 
  - `requests[0] = 3`: Search range $[0, 3]$. All servers $[0, 1, 2, 3]$ have $0$ requests. Choose server `0`. Server loads become `[1, 0, 0, 0, 0]`.
  - `requests[1] = 2`: Search range $[0, 2]$. Servers `1` and `2` have $0$ requests. Choose server `1`. Server loads become `[1, 1, 0, 0, 0]`.
  - `requests[2] = 3`: Search range $[0, 3]$. Server `2` has $0$ requests. Choose server `2`. Server loads become `[1, 1, 1, 0, 0]`.
  - `requests[3] = 2`: Search range $[0, 2]$. Servers `0`, `1`, and `2` have $1$ request each. Tie-break chooses server `0`. Server loads become `[2, 1, 1, 0, 0]`.
  - `requests[4] = 4`: Search range $[0, 4]$. Server `3` has $0$ requests. Choose server `3`. Server loads become `[2, 1, 1, 1, 0]`.

**Example 2:**
- **Input:** `num_servers = 5`, `requests = [4, 0, 2, 2]`
- **Output:** `[0, 0, 1, 2]`
- **Explanation:** 
  - `requests[0] = 4`: Range $[0, 4]$, assigned to server `0`. Loads become `[1, 0, 0, 0, 0]`.
  - `requests[1] = 0`: Range $[0, 0]$, assigned to server `0`. Loads become `[2, 0, 0, 0, 0]`.
  - `requests[2] = 2`: Range $[0, 2]$, assigned to server `1`. Loads become `[2, 1, 0, 0, 0]`.
  - `requests[3] = 2`: Range $[0, 2]$, assigned to server `2`. Loads become `[2, 1, 1, 0, 0]`.

**Example 3:**
- **Input:** `num_servers = 5`, `requests = [0, 1, 2, 3]`
- **Output:** `[0, 1, 2, 3]`
- **Explanation:** Each request is assigned to the first server in its range with $0$ requests.

### Constraints
- $1 \le \text{num\_servers} \le 10^5$
- $1 \le \text{requests.length} \le 10^5$
- $0 \le \text{requests}[i] < \text{num\_servers}$


---

# Count Subsequences Lexicographically Greater Than Target

In an Amazon security analysis task, two passwords have been generated, but they may differ in length:
- `s`: the customer's password.
- `t`: the system-generated password.

A **secured variation** of the passwords is defined as a subsequence of `s` that is lexicographically greater than `t`.

Given strings `s` and `t`, return the total number of subsequences of `s` that are lexicographically greater than `t`. Since the answer can be large, return the result modulo $10^9 + 7$.

### Notes
- A **subsequence** is defined as a sequence derived from the original password by deleting zero or more characters without changing the order of the remaining characters (e.g., `"ac"` is a subsequence of `"abc"`, but `"ca"` is not).
- A sequence $x$ is considered **lexicographically greater** than a sequence $y$ if:
  1. $x[i] > y[i]$ at the first position where $x$ and $y$ differ, or
  2. $\vert{}x\vert{} > \vert{}y\vert{}$ and $y$ is a prefix of $x$ (where $\vert{}x\vert{}$ denotes the length of password $x$).

### Examples

**Example 1:**
- **Input:** `s = "aba"`, `t = "ab"`
- **Output:** `3`
- **Explanation:** The possible subsequences derived from $s = \text{"aba"}$ and their comparisons with $t = \text{"ab"}$ are:
  - `"a"`: Smaller
  - `"ab"`: Equal
  - `"aa"`: Smaller
  - `"aba"`: Greater
  - `"b"`: Greater
  - `"ba"`: Greater
  - `"a"`: Smaller

  Out of all 7 subsequences, 3 are lexicographically greater than $t$.

**Example 2:**
- **Input:** `s = "bab"`, `t = "ab"`
- **Output:** `5`
- **Explanation:** The possible subsequences derived from $s = \text{"bab"}$ and their comparisons with $t = \text{"ab"}$ are:
  - `"b"`: Greater
  - `"ba"`: Greater
  - `"bb"`: Greater
  - `"bab"`: Greater
  - `"a"`: Smaller
  - `"ab"`: Equal
  - `"b"`: Greater

  Out of all 7 subsequences, 5 are lexicographically greater than $t$.

### Constraints
- `1 <= |s| <= 10^5`
- `1 <= |t| <= 100`
- `s` and `t` consist of lowercase English letters

---

# Minimum Time to Synchronize Servers

Developers at Amazon have deployed an application with a distributed database stored on `total_servers` different servers, numbered from `1` to `total_servers`, connected in a circular fashion (i.e., server `1` is connected to `2`, `2` to `3`, ..., and `total_servers` connects back to `1`).

A subset of $n$ servers represented by an integer array `servers` needs to transfer data to synchronize with each other. Data transfer between any two directly connected servers takes `1` unit of time.

Starting from any server, return the minimum total time required to transfer data to all other servers in the target subset.

### Examples

**Example 1:**
- **Input:** `total_servers = 8`, `servers = [2, 6, 8]`
- **Output:** `4`
- **Explanation:** One path goes from 2 to 6 to 8 taking 6 units of time. The other path goes from 2 to 8 to 6 and takes 4 units of time. Return the shorter path length, 4.

**Example 2:**
- **Input:** `total_servers = 5`, `servers = [1, 5]`
- **Output:** `1`
- **Explanation:** The two servers are directly connected, taking only 1 unit of time to share the data.

**Example 3:**
- **Input:** `total_servers = 10`, `servers = [4, 6, 2, 9]`
- **Output:** `7`
- **Explanation:** An optimal strategy is to start from server 2 and go to 4, then 6, then 9. It takes $2 + 2 + 3 = 7$ units of time.

### Constraints
- $1 \le \text{total\_servers} \le 10^9$
- $1 \le n \le 10^5$
- $1 \le \text{servers}[i] \le \text{total\_servers}$

---

# Server Chain Partitioning Cost

Leetcode: https://leetcode.com/problems/put-marbles-in-bags/description/

There is a linear chain of $n$ servers numbered from $1$ to $n$, where the cost parameter associated with the $i^{\text{th}}$ server is represented by the array `cost`. These servers need to be partitioned into exactly `k` different server chains.

The cost of partitioning a server chain `servers[i : j]` is defined as `cost[i] + cost[j]`. The total cost is the sum of the partitioning cost of each server chain.

Given an array `cost` and an integer `k`, find the minimum and maximum possible total cost of the operations and return them in the form of an array of size 2: `[minimum_cost, maximum_cost]`.

> **Note:** Partitioning an array means splitting the array sequentially into two or more non-empty contiguous parts where each element belongs to exactly one partition. For example, for an array `[1, 2, 3, 4, 5]`, a valid partition into 3 parts would be `[[1], [2, 3], [4, 5]]`, while `[[1, 2], [2, 3], [4, 5]]` and `[[1, 3], [2, 4, 5]]` are invalid partitions.

### Examples

**Example 1:**
- **Input:** `cost = [1, 2, 3, 2, 5]`, `k = 3`
- **Output:** `[14, 18]`
- **Explanation:**
  The possible valid partitions into `k = 3` server chains and their respective costs are:
  - `[[1], [2], [3, 2, 5]]` $\rightarrow (1 + 1) + (2 + 2) + (3 + 5) = 2 + 4 + 8 = 14$
  - `[[1, 2, 3], [2], [5]]` $\rightarrow (1 + 3) + (2 + 2) + (5 + 5) = 4 + 4 + 10 = 18$
  - `[[1, 2], [3], [2, 5]]` $\rightarrow (1 + 2) + (3 + 3) + (2 + 5) = 3 + 6 + 7 = 16$
  - `[[1], [2, 3], [2, 5]]` $\rightarrow (1 + 1) + (2 + 3) + (2 + 5) = 2 + 5 + 7 = 14$
  - `[[1, 2], [3, 2], [5]]` $\rightarrow (1 + 2) + (3 + 2) + (5 + 5) = 3 + 5 + 10 = 18$

  The minimum and maximum possible partition costs are 14 and 18, respectively. Thus, the resulting array is `[14, 18]`.

### Constraints
- $1 \le n \le 10^5$
- $1 \le k \le n$
- $1 \le \text{cost}[i] \le 10^9$

---

# 1561. Maximum System Throughput

Leetcode: https://leetcode.com/problems/maximum-number-of-coins-you-can-get/description/

The developers at Amazon are working on optimizing their database query times. There are $n$ host servers, where the throughput of the $i^{\text{th}}$ host server is given by `host_throughput[i]`.

These host servers are grouped into clusters of size three. The throughput of a cluster, denoted as `cluster_throughput`, is defined as the median of the `host_throughput` values of the three servers in the cluster. Each server can be part of at most one cluster, and some servers may remain unused.

The total system throughput, called `system_throughput`, is the sum of the throughputs of all the clusters formed. The task is to find the maximum possible `system_throughput`.

> **Note:** The median of a cluster of three host servers is the throughput of the 2nd server when the three throughputs are sorted in either ascending or descending order.

### Examples

**Example 1:**
- **Input:** `host_throughput = [4, 6, 3, 5, 4, 5]`
- **Output:** `9`
- **Explanation:** Here, $n = 6$, and the host throughput array is `[4, 6, 3, 5, 4, 5]`. The maximum number of clusters that can be formed is 2. One optimal way to form the clusters is to select the 1st, 2nd, and 3rd host servers for the first cluster `[4, 6, 3]` (median = 4), and the 4th, 5th, and 6th host servers for the second cluster `[5, 4, 5]` (median = 5). Thus, the `system_throughput` is $4 + 5 = 9$.

**Example 2:**
- **Input:** `host_throughput = [2, 3, 4, 3, 4]`
- **Output:** `4`
- **Explanation:** The maximum number of clusters that can be formed is 1, and two host servers will remain unused. One possible cluster is formed by selecting the 1st, 3rd, and 5th host servers `[2, 4, 4]`, giving a median of 4.

### Constraints
- $1 \le n \le 10^5$
- $1 \le \text{host\_throughput}[i] \le 10^9$

---

# 1. Maximize Machine Power Sum

You are given a 2D integer array `machines`, where `machines[i]` represents the power units available in the `i`-th machine.

The **power** of a machine is defined as the minimum value among all of its power units. If a machine has no power units, its power is considered to be `0`.

You can transfer power units between machines under the following rule:
- Each machine can donate **at most one** of its power units in total to another machine.
- A machine can receive **unlimited** power units from other machines.

Return the *maximum possible sum of powers of all machines* after performing any optimal number of power unit transfers.

### Examples

**Example 1:**
- **Input:** `machines = [[1, 5], [2, 3], [1, 0]]`
- **Output:** `8`
- **Explanation:** 
  - Machine 0 donates its power unit `1` to Machine 2. Machine 0 is left with `[5]`, so its power becomes `min(5) = 5`.
  - Machine 1 donates its power unit `2` to Machine 2. Machine 1 is left with `[3]`, so its power becomes `min(3) = 3`.
  - Machine 2 receives both units and now has `[1, 0, 1, 2]`, so its power becomes `min(1, 0, 1, 2) = 0`.
  - The total sum of machine powers is `5 + 3 + 0 = 8`.

**Example 2:**
- **Input:** `machines = [[1, 2], [3, 4]]`
- **Output:** `6`
- **Explanation:**
  - Machine 0 donates power unit `1` to Machine 1. Machine 0 is left with `[2]`, giving it power `2`.
  - Machine 1 receives unit `1` and now has `[3, 4, 1]`, giving it power `min(3, 4, 1) = 1`.
  - Total sum of powers becomes `2 + 1 = 3`.
  - Alternatively, if Machine 1 donates `3` to Machine 0, Machine 1 is left with `[4]` (power 4) and Machine 0 becomes `[1, 2, 3]` (power 1), yielding a total sum of `4 + 1 = 5`.
  - If Machine 0 donates `1` to Machine 1 and Machine 1 donates `3` to Machine 0, Machine 0 ends with `[2, 3]` (power 2) and Machine 1 ends with `[4, 1]` (power 1), yielding a sum of `3`.
  - The maximum sum attainable is `6` by optimal unit transfers.

### Constraints
- `1 <= machines.length <= 10^5`
- `1 <= machines[i].length <= 10^5`
- `0 <= machines[i][j] <= 10^9`
- The total sum of `machines[i].length` across all machines does not exceed `2 * 10^5`.

---

# 2. Maximum Subarray Length with GCD Greater Than 1

You are given an integer array `nums` and an integer `maxChangeTimes`.

In one operation, you can choose any element in `nums` and change its value to any positive integer. You can perform at most `maxChangeTimes` operations.

Return the *maximum length of a contiguous subarray* such that the Greatest Common Divisor (GCD) of all elements in that subarray is **strictly greater than 1**.

### Examples

**Example 1:**
- **Input:** `nums = [1, 3, 5, 4]`, `maxChangeTimes = 1`
- **Output:** `2`
- **Explanation:** 
  - Select the contiguous subarray `[3, 5]`. Change `5` to `3` using 1 operation. The subarray becomes `[3, 3]` with `GCD(3, 3) = 3 > 1`. The length is `2`.
  - Alternatively, select the contiguous subarray `[5, 4]`. Change `5` to `2` using 1 operation. The subarray becomes `[2, 4]` with `GCD(2, 4) = 2 > 1`. The length is `2`.

**Example 2:**
- **Input:** `nums = [1, 3, 5, 4]`, `maxChangeTimes = 2`
- **Output:** `3`
- **Explanation:** 
  - Select the contiguous subarray `[3, 5, 4]`.
  - Change `3` to `2` and `5` to `2` using 2 operations. 
  - The subarray becomes `[2, 2, 4]` with `GCD(2, 2, 4) = 2 > 1`. The length is `3`.

### Constraints
- `1 <= nums.length <= 10^5`
- `1 <= nums[i] <= 10^5`
- `0 <= maxChangeTimes <= nums.length`

---

# K-Consistency Score of Stock Returns

A team of financial analysts at Amazon has designed a stock indicator to determine the consistency of Amazon's stock in delivering daily returns.

You are given a 0-indexed integer array `stockPrices` of size `n`, where `stockPrices[i]` represents the percentage return (rounded to the nearest integer) delivered on day `i`. You are also given an integer `k`.

In a single operation, you can omit (remove) a single element from the `stockPrices` array and rejoin the remaining parts. You can perform this operation **at most `k` times**.

The **k-consistency score** is defined as the maximum length of a contiguous subarray in the modified array where all daily returns are equal.

Return the *maximum k-consistency score* achievable for the stock.

### Examples

**Example 1:**
- **Input:** `stockPrices = [1, 1, 2, 1, 1]`, `k = 1`
- **Output:** `4`
- **Explanation:** By removing the element `2` at index 2 (using 1 operation), the array becomes `[1, 1, 1, 1]`. The longest contiguous subarray with all equal elements has length `4`.

**Example 2:**
- **Input:** `stockPrices = [7, 5, 7, 7, 1, 1, 7]`, `k = 3`
- **Output:** `5`
- **Explanation:** By removing `5` and the two `1`s (3 operations in total), the remaining elements form `[7, 7, 7, 7, 7]`, giving a k-consistency score of `5`.

### Constraints
- `1 <= stockPrices.length <= 10^5`
- `-10^9 <= stockPrices[i] <= 10^9`
- `0 <= k <= stockPrices.length`

---

# Minimum Cost to Purchase M Items

In an Amazon Go Store, there are `n` item types, each associated with two positive integers `a[i]` and `b[i]`. 

There are infinitely many items of each type, numbered from `1` to infinity. The `j`-th item of the `i`-th type costs:
$$\text{Cost} = a[i] + (j - 1) \times b[i]$$

Note that each specific item of each type can be purchased **at most once** (e.g., you can buy the 1st item of type `i`, the 2nd item of type `i`, etc., but you cannot buy the 1st item of type `i` twice).

Determine the **minimum possible total cost** required to purchase exactly `m` items.

---

### Examples

**Example 1:**
- **Input:** `n = 3`, `a = [2, 1, 1]`, `b = [1, 2, 3]`, `m = 4`
- **Output:** `7`
- **Explanation:**
  The costs of the first few items for each type are:
  - **Type 0 (`a[0] = 2, b[0] = 1`):** Item 1 costs `2`, Item 2 costs `3`, Item 3 costs `4`, ...
  - **Type 1 (`a[1] = 1, b[1] = 2`):** Item 1 costs `1`, Item 2 costs `3`, Item 3 costs `5`, ...
  - **Type 2 (`a[2] = 1, b[2] = 3`):** Item 1 costs `1`, Item 2 costs `4`, Item 3 costs `7`, ...

  To purchase `m = 4` items with the minimum total cost, choose the 4 cheapest items available:
  1. **1st item of Type 1:** Cost = `1 + (1 - 1) * 2 = 1`
  2. **1st item of Type 2:** Cost = `1 + (1 - 1) * 3 = 1`
  3. **1st item of Type 0:** Cost = `2 + (1 - 1) * 1 = 2`
  4. **2nd item of Type 0** (or Type 1): Cost = `2 + (2 - 1) * 1 = 3`

  Total minimum cost = `1 + 1 + 2 + 3 = 7`.

**Example 2:**
- **Input:** `n = 2`, `a = [3, 5]`, `b = [2, 1]`, `m = 3`
- **Output:** `13`
- **Explanation:**
  - **Type 0 (`a = 3, b = 2`):** Item 1 costs `3`, Item 2 costs `5`, ...
  - **Type 1 (`a = 5, b = 1`):** Item 1 costs `5`, Item 2 costs `6`, ...

  The 3 cheapest items are Item 1 of Type 0 (`3`), Item 2 of Type 0 (`5`), and Item 1 of Type 1 (`5`).
  Total minimum cost = `3 + 5 + 5 = 13`.

---

### Constraints
- $1 \le n \le 10^5$
- $1 \le a[i], b[i] \le 10^9$
- $1 \le m \le 10^9$

---

# Minimum Time to Form a K x K Square

Amazon is introducing an innovative smart canvas display for personalized home decor. The canvas consists of `n` rows and `m` columns and is initially painted white ('W'). Each minute, a cell on the canvas is painted black ('B') as specified by the user.

A canvas is defined as **beautiful** if there exists at least one contiguous $k \times k$ square subgrid where all cells are painted black.

You are given three integers `n`, `m`, and `k`, along with a 2D integer array `paint` of dimensions $(n \times m) \times 2$, where `paint[i] = [r, c]` represents the 1-indexed row and column coordinates of the cell to be painted black at minute $i + 1$.

Return the *minimum time (in minutes)* required for the canvas to become beautiful. If it is impossible, return `-1`.

---

### Examples

**Example 1:**
- **Input:** `n = 2`, `m = 3`, `k = 2`, `paint = [[1, 2], [2, 3], [2, 1], [1, 3], [2, 2], [1, 1]]`
- **Output:** `5`
- **Explanation:**
  - **Minute 1:** Paint `(1, 2)`. Grid:
    `W B W`
    `W W W` (Not beautiful)
  - **Minute 2:** Paint `(2, 3)`. Grid:
    `W B W`
    `W W B` (Not beautiful)
  - **Minute 3:** Paint `(2, 1)`. Grid:
    `W B W`
    `B W B` (Not beautiful)
  - **Minute 4:** Paint `(1, 3)`. Grid:
    `W B B`
    `B W B` (Not beautiful)
  - **Minute 5:** Paint `(2, 2)`. Grid:
    `W B B`
    `B B B` 
    At minute 5, the $2 \times 2$ subgrid starting at top-left position `(1, 2)` (covering rows 1–2, columns 2–3) is fully painted black. Thus, the minimum time is `5`.

**Example 2:**
- **Input:** `n = 2`, `m = 2`, `k = 2`, `paint = [[1, 1], [1, 2], [2, 1], [2, 2]]`
- **Output:** `4`
- **Explanation:**
  All 4 cells of the $2 \times 2$ canvas must be painted black before a $2 \times 2$ square of black cells is formed. This occurs at minute 4.

---

### Constraints
- $1 \le n, m \le 1000$
- $1 \le k \le \min(n, m)$
- $\text{paint.length} = n \times m$
- $1 \le \text{paint}[i][0] \le n$
- $1 \le \text{paint}[i][1] \le m$
- All coordinates in `paint` are distinct.

---

# 74. Search a 2D Matrix

Leetcode: https://leetcode.com/problems/search-a-2d-matrix/description/

You are given an `m x n` integer matrix `matrix` with the following two properties:
- Each row is sorted in non-decreasing order.
- The first integer of each row is greater than the last integer of the previous row.

Given an integer `target`, return `true` if `target` is in `matrix` or `false` otherwise.

You must write a solution in $O(\log(m \times n))$ time complexity.

### Examples

**Example 1:**
- **Input:** `matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3`
- **Output:** `true`

**Example 2:**
- **Input:** `matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 13`
- **Output:** `false`

### Constraints
- `m == matrix.length`
- `n == matrix[i].length`
- `1 <= m, n <= 100`
- `-10^4 <= matrix[i][j], target <= 10^4`

---

# 101. Symmetric Tree

Leetcode: https://leetcode.com/problems/symmetric-tree/description/

Given the `root` of a binary tree, *check whether it is a mirror of itself* (i.e., symmetric around its center).

### Examples

**Example 1:**
- **Input:** `root = [1,2,2,3,4,4,3]`
- **Output:** `true`

**Example 2:**
- **Input:** `root = [1,2,2,null,3,null,3]`
- **Output:** `false`

### Constraints
- The number of nodes in the tree is in the range `[1, 1000]`.
- `-100 <= Node.val <= 100`

---

# 1856. Maximum Subarray Min-Product

Leetcode: https://leetcode.com/problems/maximum-subarray-min-product/description/

The **min-product** of an array is equal to the **minimum value** in the array **multiplied by the array's sum**.

- For example, the array `[3,2,5]` (minimum value is `2`) has a min-product of $2 \times (3+2+5) = 2 \times 10 = 20$.

Given an array of integers `nums`, return *the **maximum min-product** of any **non-empty subarray** of `nums`*. Since the answer may be large, return it **modulo** $10^9 + 7$.

Note that the min-product should be maximized **before** performing the modulo operation. Testcases are generated such that the maximum min-product without modulo will fit in a **64-bit signed integer**.

A **subarray** is a **contiguous** part of an array.

### Examples

**Example 1:**
- **Input:** `nums = [1,2,3,2]`
- **Output:** `14`
- **Explanation:** The maximum min-product is achieved by the subarray `[2,3,2]` (minimum value is `2`).
  $2 \times (2+3+2) = 2 \times 7 = 14$.

**Example 2:**
- **Input:** `nums = [2,3,3,1,2]`
- **Output:** `18`
- **Explanation:** The maximum min-product is achieved by the subarray `[3,3]` (minimum value is `3`).
  $3 \times (3+3) = 3 \times 6 = 18$.

**Example 3:**
- **Input:** `nums = [3,1,5,6,4,2]`
- **Output:** `60`
- **Explanation:** The maximum min-product is achieved by the subarray `[5,6,4]` (minimum value is `4`).
  $4 \times (5+6+4) = 4 \times 15 = 60$.

### Constraints
- `1 <= nums.length <= 10^5`
- `1 <= nums[i] <= 10^7`

---

# 33. Search in Rotated Sorted Array

Leetcode: https://leetcode.com/problems/search-in-rotated-sorted-array/description/

There is an integer array `nums` sorted in ascending order (with **distinct** values).

Prior to being passed to your function, `nums` is **possibly rotated** at an unknown pivot index `k` ($1 \le k < \text{nums.length}$) such that the resulting array is `[nums[k], nums[k+1], ..., nums[n-1], nums[0], nums[1], ..., nums[k-1]]` (**0-indexed**). For example, `[0,1,2,4,5,6,7]` might be rotated at pivot index `3` and become `[4,5,6,7,0,1,2]`.

Given the array `nums` after the possible rotation and an integer `target`, return *the index of `target` if it is in `nums`, or `-1` if it is not in `nums`*.

You must write an algorithm with $O(\log n)$ runtime complexity.

### Examples

**Example 1:**
- **Input:** `nums = [4,5,6,7,0,1,2], target = 0`
- **Output:** `4`

**Example 2:**
- **Input:** `nums = [4,5,6,7,0,1,2], target = 3`
- **Output:** `-1`

**Example 3:**
- **Input:** `nums = [1], target = 0`
- **Output:** `-1`

### Constraints
- `1 <= nums.length <= 5000`
- `-10^4 <= nums[i] <= 10^4`
- All values of `nums` are **unique**.
- `nums` is an ascending array that is possibly rotated.
- `-10^4 <= target <= 10^4`

---

# 236. Lowest Common Ancestor of a Binary Tree

Leetcode: https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/description/

Given a binary tree, find the lowest common ancestor (LCA) of two given nodes in the tree.

According to the **definition of LCA on Wikipedia**: “The lowest common ancestor is defined between two nodes `p` and `q` as the lowest node in `T` that has both `p` and `q` as descendants (where we allow **a node to be a descendant of itself**).”

### Examples

**Example 1:**
- **Input:** `root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1`
- **Output:** `3`
- **Explanation:** The LCA of nodes 5 and 1 is 3.

**Example 2:**
- **Input:** `root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 4`
- **Output:** `5`
- **Explanation:** The LCA of nodes 5 and 4 is 5, since a node can be a descendant of itself according to the LCA definition.

**Example 3:**
- **Input:** `root = [1,2], p = 1, q = 2`
- **Output:** `1`

### Constraints
- The number of nodes in the tree is in the range `[2, 10^5]`.
- `-10^9 <= Node.val <= 10^9`
- All `Node.val` are **unique**.
- `p != q`
- `p` and `q` will exist in the tree.

---