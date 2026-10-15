# Runtime Bounds Cheat Sheet — Boundary Thinking

## 0. Notation Primer: Big-O, Big-Ω, Big-Θ

When we analyze an algorithm, we want to know how its runtime grows as the input size ($N$) grows. We use three mathematical symbols to describe this growth. Think of them as the **Ceiling**, the **Floor**, and the **Exact Fit**.

To understand them, let's look at a simple algorithm: finding a specific number in an unsorted array (Linear Search).

### **1. Big-$\Omega$ (Omega): The Best Case (The Floor)**

Big-$\Omega$ describes the **lower bound** of an algorithm. It answers: *"What is the absolute fastest this algorithm could possibly finish if we get extremely lucky?"*

* **Example:** In our Linear Search, what if the number we are looking for is at the very first index? The loop runs exactly once.
* **Notation:** $\Omega(1)$ (Constant time).
* **When to use it:** Rarely. Relying on extreme luck is dangerous in software engineering, so we almost never evaluate algorithms by their Big-$\Omega$.

### **2. Big-$O$ (Omicron / "Big O"): The Worst Case (The Ceiling)**

Big-$O$ describes the **upper bound** of an algorithm. It answers: *"What is the absolute longest this algorithm will take if we have the worst possible luck?"*

* **Example:** In our Linear Search, what if the number is at the very last index, or not in the array at all? We have to check every single element.
* **Notation:** $O(N)$ (Linear time).
* **When to use it:** All the time. We design systems to survive the worst-case scenario. If your system can handle the Big-$O$, it can handle anything.

### **3. Big-$\Theta$ (Theta): The Exact Bound (The Tight Fit)**

Big-$\Theta$ means the algorithm scales at the **exact same rate** in both the best case and the worst case. The floor and the ceiling are the same.

* **Example:** What if instead of searching, our algorithm was simply "print every number in the array"?
* Best case? We print $N$ numbers. $\Omega(N)$.
* Worst case? We print $N$ numbers. $O(N)$.
* Because the best and worst cases are identical, we say this algorithm is exactly **$\Theta(N)$**.


* **When to use it:** Mathematically, this is the most accurate way to describe an algorithm with predictable, unchanging behavior.

---

### **The Industry Secret: Why do we only say "Big O"?**

Here is a common point of confusion: mathematically, Big-$O$ is just an upper limit. If an algorithm takes $N$ steps, it is technically $O(N)$, but it is *also* mathematically correct to say it is $O(N^2)$ or $O(N^{100})$, because those are also "ceilings" above $N$.

Therefore, when an interviewer asks, *"What is the time complexity?"* they are technically asking for the tightest possible bound—which is Big-$\Theta$.

**So why does everyone say "Big O"?**

Because it is an industry-wide colloquialism. In software engineering, when we say "Big O," we are universally agreeing to mean: **"What is the tightest possible Big-$O$ upper bound in the worst-case scenario?"** Do not be the candidate who argues with an interviewer that an algorithm is technically $\Theta(N)$ instead of $O(N)$. Accept the industry shorthand. Use Big-$O$ to describe the tight worst-case ceiling, and use that as your baseline for optimization.

### **Quick Recall Cheat Sheet**

| Symbol | Name | Meaning | Interview Translation |
| --- | --- | --- | --- |
| **$\Omega$** | Big-Omega | Lower Bound (Best Case) | *"If we get extremely lucky, how fast is it?"* |
| **$O$** | Big-O | Upper Bound (Worst Case) | *"If everything goes wrong, how slow is it?"* |
| **$\Theta$** | Big-Theta | Tight Bound (Exact Case) | *"Best and worst case are exactly the same."* |
---

## 1. Why We Need Boundaries

Before designing any algorithm, spend ~60 seconds trapping the optimal solution's runtime between a **floor** (no correct solution can be faster) and a **ceiling** (the optimal is at least this fast). This gives you a *target window*: you instantly know how fast you're aiming for, when your idea isn't good enough, and — crucially — when to stop optimizing because you've provably hit the floor.

---

## 2. The Boundary Diagram

```
      IMPOSSIBLE ZONE                TARGET WINDOW                WASTEFUL ZONE
  (no solution exists here)     (optimal lives in here)      (your idea is too slow)
 ◄──────────────────────────╫═════════════════════════════╫──────────────────────────►
                          FLOOR                        CEILING
                            │                             │
              max(output-size, task-based)         min(naive, TLE)

  faster ◄─────────────────────────── runtime ───────────────────────────► slower
```

**1. Output-size bound (floor).** You can't run faster than the time needed to *write your output*. If the worst-case output has S items, the floor is Ω(S). Ask: *"How big can the answer itself get?"*

**2. Task-based bound (floor).** You must *read* every part of the input that could change the answer. Unstructured input where any element matters → Ω(n). Structured input (sorted, heap, BST) may let you skip → floor can drop below n. Ask: *"If I skipped one element, could I be wrong?"*

**3. Naive bound (ceiling).** The optimal can't be slower than the brute force you can already describe. Ask: *"What does try-everything cost?"*

**4. TLE (Time Limit Exceeded) bound (ceiling).** The problem-setter chose the constraint `n ≤ ...` so the intended solution passes in ~1 second (~10⁸ simple ops). Decode the constraint into the slowest complexity that fits. Ask: *"What does max n permit?"*

Take **max** of the two floors, **min** of the two ceilings. The optimal solution lives in `[floor, ceiling]`. Aim at the floor.

---

## 3. The Worked Interview Example

> **Interviewer:** "You are given an unsorted array of $N$ integers, where $N$ can be up to $10^5$, and an integer $K$. Return the $K$ most frequent elements."

Before writing a single line of code, let's find our boundaries to build our target window.

### 1. Output-Size Lower Bound (The Return Floor)

*What is the absolute minimum time needed just to write the answer?*

You have to return $K$ elements, so you physically cannot run faster than $\Omega(K)$. However, since $K \le N$, this is a weak constraint. It doesn't limit us much.
**Floor candidate: $\Omega(K)$.**

### 2. Task-Based Lower Bound (The Read Floor)

*What is the absolute minimum time needed to guarantee a correct answer?*

The array is unsorted. If you skip reading even a single element, its frequency count could be off by one, potentially changing the entire top $K$ list. Therefore, every correct algorithm *must* inspect all $N$ elements.
**Floor candidate: $\Omega(N)$.**

➡ **Actual Floor = The stricter of the two = max(Ω(K), Ω(N)) = Ω(N).**


### 3. Naive Upper Bound (The Brute Force Ceiling)

*What is the most obvious, unoptimized way to solve this?*

For every single element, scan the entire array to count how many times it appears, then sort those counts. Checking every element against every other element takes $O(N^2)$.
**Ceiling candidate: $O(N^2)$.**

### 4. TLE (Time Limit Exceeded) Upper Bound (The Constraint Ceiling)

*What does the platform (or interviewer) expect based on input limits?*

Modern CPUs handle roughly **$10^7$ to $10^8$ operations per second**. We can use the given constraints to immediately rule out slow algorithms.

**The TLE Decoding Table (Rule of Thumb)**

| Max $N$ Given | Target Complexity | Sanity Check (Ops at Max $N$) | Hints At... |
| --- | --- | --- | --- |
| N $\le 10$ | **$O(N!)$** | $10! \approx 3.6 \times 10^6 $ (Passes) | Try all permutations |
| N $\le 20$ | **$O(2^N)$** | $2^{20} \approx 10^6$ (Passes) | Subsets, Backtracking, Bitmask DP |
| N $\le 500$ | **$O(N^3)$** | $500^3 \approx 1.2 \times 10^8$ (Borderline) | 3D DP, Floyd-Warshall |
| N $\le 5,000$ | **$O(N^2)$** | $5000^2 \approx 2.5 \times 10^7$ (Passes) | 2D DP, Nested Loops |
| N $\le 10^6$ | **$O(N \log N)$** | $10^6 \times 20 \approx 2 \times 10^7$ (Passes) | Sorting, Heaps, Two Pointers |
| N $\le 10^8$ | **$O(N)$** | $10^8$ (Barely passes) | Single Pass, Hash Maps |
| N $\ge 10^9$ | **$O(\log N)$ or $O(1)$** | $10^9 \approx 30 ops (log) $ (Passes) | Binary search, math formula |


**Applying the Table to our Example:**
Our problem states $N = 10^5$.
If we use our $O(N^2)$ brute force, $10^5 \times 10^5 = 10^{10}$ operations. That is a massive TLE (Time Limit Exceeded). Looking at the table, for $N = 10^5$, the slowest acceptable complexity is $O(N \log N)$.
**Ceiling candidate: $O(N \log N)$.**

➡ **Actual Ceiling = The tightest bound we know works = min($O(N^2)$, $O(N \log N)$) = $O(N \log N)$.**

---

## Finding the Target Window

We have now established our bracket:

* **Floor:** $\Omega(N)$
* **Ceiling:** $O(N \log N)$

**TARGET WINDOW:** `[ Ω(N)  ...  O(N log N) ]`

**How to use this out loud in the interview:**
*"The brute force is $O(N^2)$, but with $N=10^5$, that's too slow. I need something $O(N \log N)$ or better. I also have to read every number, so I can't do better than $O(N)$."*

1. **Ceiling Hit:** "I could count frequencies in a hash map, then sort the unique keys by frequency. That's **$O(N \log N)$**. This works!"
2. **Squeezing the Window:** "I don't need to sort *everything*, just the top $K$. If I use a Min-Heap of size $K$, the time drops to **$O(N \log K)$**. That's much better."
3. **Hitting the Floor:** "Can I reach $O(N)$? Frequencies are strictly bounded between $1$ and $N$. If I use Bucket Sort (an array of arrays where the index is the frequency), I can find the top $K$ in exactly **$O(N)$** time."

**Boom.** You hit the floor. The solution is mathematically optimal. You stop optimizing, state your logic confidently, and start writing code.

---

## 4. Three Interview-Style Examples (with spoken answers)

Each answer below is written the way you'd actually *say it out loud* in an interview, before coding.

---

### Example 1 — The tiny constraint (exponential is the intended answer)

> **Interviewer:** "Given an array of at most 20 positive integers, determine whether it can be split into two subsets with equal sums."

**What you say:**

"Before I design anything, let me bound the problem. The output is just true or false, so the output-size bound gives me nothing — Ω(1). For the task-based bound: the array is unstructured and every number affects the total sum, so if I skipped one element I could be wrong — I must read all n, giving a floor of Ω(n). For the ceiling: the brute force is to try every way of assigning each element to side A or side B — that's 2ⁿ assignments, so O(2ⁿ) is my naive ceiling. Now the interesting part: n is at most **20**. 2²⁰ is about a million operations — completely fine within a typical time budget. That tiny constraint is basically the problem telling me an exponential solution is the *intended* one. So my window is [Ω(n), O(2ⁿ)], and rather than hunt for some clever polynomial algorithm — this is actually a known NP-complete problem in general — I'll go straight to backtracking over subset choices, and prune branches where the running sum already exceeds half the total. If we want, I can also mention a DP over achievable sums as a refinement, but the constraint tells me brute force with pruning is fully acceptable here."

**The vision this example teaches:** a small n is *permission* to go exponential. Don't waste minutes searching for polynomial unicorns.

---

### Example 2 — The output-dominated problem (brute force is provably optimal)

> **Interviewer:** "Given an array of n integers and a target, return **all** pairs of indices (i, j) whose values sum to the target."

**What you say:**

"Let me first bound this. The key word in the problem is *all*. In the worst case — say the array is all zeros and the target is zero — *every* pair of indices is a valid answer, and there are n(n−1)/2, roughly n²/2 pairs. So the output itself can be Θ(n²) in size, which means merely writing the answer takes Ω(n²) — that's my output-size floor, and it dominates the Ω(n) task-based floor. For the ceiling, the naive solution is a double loop over all pairs, which is O(n²). Notice what just happened: my floor is Ω(n²) and my ceiling is O(n²) — the window has collapsed to a single point. The nested double loop isn't a lazy first draft here; it's *provably optimal*, because no algorithm can output n² pairs in less than n² time. So I'll write the two nested loops, collect matching pairs, and I'd flag to you that if the problem instead asked to *count* the pairs or return just *one* pair, the floor would drop to Ω(n) and I'd switch to a hash-map approach — the word 'all' is what forces quadratic."

**The vision this example teaches:** measure the output before optimizing. One word in the problem statement can raise the floor to meet the brute-force ceiling — and then you can defend the "naive" solution as optimal.

---

### Example 3 — The huge constraint + structured input (sub-linear is demanded)

> **Interviewer:** "You have a sorted array of up to 10⁹ distinct integers, and a value x. Return the index of the first element greater than or equal to x, or −1 if none exists."

**What you say:**

"Let me set boundaries first. The output is a single index — output-size bound is Ω(1), no help. For the task-based bound, normally I'd say I must read the whole input, but here the array is **sorted**, and that structure breaks the usual argument: examining the middle element tells me which half the answer is in without reading the other half at all. So the floor can legitimately be sub-linear — for comparison-based search on sorted data it's on the order of Ω(log n). For ceilings: the naive solution is a left-to-right scan, O(n). But the constraint says n can be **10⁹** — a linear scan is around a billion operations, which is at or past a one-second budget, so the TLE bound tells me even O(n) is not the intended solution. That tightens my ceiling to roughly O(log n). Now my window is essentially [Ω(log n), O(log n)] — the floor and ceiling meet, and they're both pointing at one thing: binary search. So I'll binary search for the leftmost element ≥ x, being careful with the classic off-by-one details: keep a candidate answer when arr[mid] ≥ x and move right when arr[mid] < x. That runs in about 30 comparisons even at n = 10⁹, and it's optimal for this model."

**The vision this example teaches:** structured input *lowers the floor*, and a huge constraint *lowers the ceiling* — when they squeeze together at log n, the problem has told you the algorithm before you've thought about code.

---

## 5. Pocket Summary

1. **Output big?** → floor rises (word "all" is a red flag). **Output tiny?** → rely on the task-based floor.
2. **Must read everything?** → floor is Ω(n). **Input sorted/structured?** → floor may drop below n.
3. **State the brute force** → instant ceiling + a fallback answer on the table.
4. **Decode `n ≤ ...` with the table** → the intended complexity, leaked by the problem-setter.
5. **Window = [max of floors, min of ceilings].** Design toward the floor; if you touch it, *say* "this is provably optimal because..." — that sentence is the interview highlight.