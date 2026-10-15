import test from 'node:test';
import assert from 'node:assert/strict';

// ==================== PROBLEM ====================
/*
Minimum Operations to Make Array Equal to Zero

You are given a 0-indexed integer array `nums`. In one operation, you can select any prefix of the array and increment or decrement every element in that prefix by `1`.

Return the minimum number of operations required to convert every element of `nums` to `0`.

A prefix of an array is a contiguous subarray starting at the first element (index `0`).

Examples:
- Input: nums = [3, 2, 0, 0, -1]
  Output: 5
  Explanation:
    - Operation 1: Decrement prefix of length 1 -> [2, 2, 0, 0, -1]
    - Operation 2: Decrement prefix of length 2 -> [1, 1, 0, 0, -1]
    - Operation 3: Decrement prefix of length 4 -> [0, 0, -1, -1, -1]
    - Operation 4: Decrement prefix of length 2 -> [-1, -1, -1, -1, -1]
    - Operation 5: Increment prefix of length 5 -> [0, 0, 0, 0, 0]

- Input: nums = [1, -2, 2]
  Output: 9
  Explanation: 
    - Index 0 to 1 diff: |1 - (-2)| = 3
    - Index 1 to 2 diff: |-2 - 2| = 4
    - Index 2 to end diff: |2 - 0| = 2
    - Total operations = 3 + 4 + 2 = 9.

Constraints:
- n == nums.length
- 1 <= n <= 10^5
- -10^9 <= nums[i] <= 10^9
*/

// ==================== SOLUTION ====================
function solve(nums: number[]): number {
    const n = nums.length;
    if (n === 0) return 0;

    let totalOperations = 0;

    // Accumulate absolute differences between adjacent elements
    for (let i = 0; i < n - 1; i++) {
        totalOperations += Math.abs(nums[i + 1] - nums[i]);
    }


    // Account for reducing the remaining final element (or uniform array) to 0
    totalOperations += Math.abs(nums[n - 1]);

    return totalOperations;
}

// ==================== TESTS ====================
test('example 1', () => {
    assert.strictEqual(solve([3, 2, 0, 0, -1]), 5);
});

test('example 2', () => {
    // The source explanation lists differences 3, 4, and 2, but has an arithmetic typo
    // stating "3 + 4 = 7" omitting the last diff: 3 + 4 + 2 = 9.
    assert.strictEqual(solve([1, -2, 2]), 9);
});

// test('minimum valid input: single non-zero element', () => {
//     assert.strictEqual(solve([5]), 5);
// });

// test('minimum valid input: single negative element', () => {
//     assert.strictEqual(solve([-7]), 7);
// });

// test('array already containing all zeros requires zero operations', () => {
//     assert.strictEqual(solve([0, 0, 0, 0]), 0);
// });

// test('all identical elements only require operations on full prefix', () => {
//     assert.strictEqual(solve([4, 4, 4]), 4);
// });

// test('ordinary unseen case with alternating positive and negative values', () => {
//     // diffs: |2 - 4| = 2, |4 - 1| = 3, |1 - 0| = 1 -> total = 6
//     assert.strictEqual(solve([2, 4, 1]), 6);
// });

// test('strictly increasing elements', () => {
//     // diffs: |1 - 2| = 1, |2 - 3| = 1, |3 - 0| = 3 -> total = 5
//     assert.strictEqual(solve([1, 2, 3]), 5);
// });
