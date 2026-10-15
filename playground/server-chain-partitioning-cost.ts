import test from 'node:test';
import assert from 'node:assert/strict';

// ==================== PROBLEM ====================
/*
Server Chain Partitioning Cost (LeetCode 2551)
Leetcode: https://leetcode.com/problems/put-marbles-in-bags/description/

There is a linear chain of n servers numbered from 1 to n, where the cost parameter associated with the ith server is represented by the array cost. These servers need to be partitioned into exactly k different server chains.

The cost of partitioning a server chain servers[i : j] is defined as cost[i] + cost[j]. The total cost is the sum of the partitioning cost of each server chain.

Given an array cost and an integer k, find the minimum and maximum possible total cost of the operations and return them in the form of an array of size 2: [minimum_cost, maximum_cost].

Note: Partitioning an array means splitting the array sequentially into two or more non-empty contiguous parts where each element belongs to exactly one partition. For example, for an array [1, 2, 3, 4, 5], a valid partition into 3 parts would be [[1], [2, 3], [4, 5]], while [[1, 2], [2, 3], [4, 5]] and [[1, 3], [2, 4, 5]] are invalid partitions.

Examples:
- Input: cost = [1, 2, 3, 2, 5], k = 3
  Output: [14, 18]
  Explanation:
    The possible valid partitions into k = 3 server chains and their respective costs are:
    - [[1], [2], [3, 2, 5]] -> (1 + 1) + (2 + 2) + (3 + 5) = 2 + 4 + 8 = 14
    - [[1, 2, 3], [2], [5]] -> (1 + 3) + (2 + 2) + (5 + 5) = 4 + 4 + 10 = 18
    - [[1, 2], [3], [2, 5]] -> (1 + 2) + (3 + 3) + (2 + 5) = 3 + 6 + 7 = 16
    - [[1], [2, 3], [2, 5]] -> (1 + 1) + (2 + 3) + (2 + 5) = 2 + 5 + 7 = 14
    - [[1, 2], [3, 2], [5]] -> (1 + 2) + (3 + 2) + (5 + 5) = 3 + 5 + 10 = 18
    The minimum and maximum possible partition costs are 14 and 18, respectively. Thus, the resulting array is [14, 18].

Constraints:
- 1 <= n <= 10^5
- 1 <= k <= n
- 1 <= cost[i] <= 10^9
*/
// solve([1, 2, 3, 2, 5], 3), [14, 18]
// ==================== SOLUTION ====================
function solve(cost: number[], k: number): [number, number] {
    const partSums = [];

    for(let i = 0; i < cost.length - 1; i++){
        partSums.push(cost[i] + cost[i + 1]);
    }

    partSums.sort((a,b)=> a-b);

    console.log({partSums})

    const defaultCost = cost[0] + cost.at(-1)!
    let minCost = defaultCost;
    let maxCost = defaultCost;

    for(let i = 0; i < k-1; i++){
        minCost += partSums[i];
        maxCost += partSums.at(-1 - i)!;
    }

    console.log({minCost, maxCost})

    return [minCost, maxCost];
}

// ==================== TESTS ====================
test('example 1: k in middle with multiple valid partition combinations', () => {
  assert.deepStrictEqual(solve([1, 2, 3, 2, 5], 3), [14, 18]);
});

test('minimum valid input: single element, k = 1', () => {
  assert.deepStrictEqual(solve([7], 1), [14, 14]);
});

test('boundary transition: k = 1 with multiple elements', () => {
  assert.deepStrictEqual(solve([4, 2, 8], 1), [12, 12]);
});

test('boundary transition: k = n (every element forms its own partition)', () => {
  assert.deepStrictEqual(solve([1, 3, 5], 3), [18, 18]);
});

test('input-shape variation: all elements equal', () => {
  assert.deepStrictEqual(solve([3, 3, 3, 3], 2), [12, 12]);
});

test('ordinary unseen case: k in middle with distinct pair sums', () => {
  assert.deepStrictEqual(solve([1, 5, 2, 6, 3], 3), [17, 21]);
});
