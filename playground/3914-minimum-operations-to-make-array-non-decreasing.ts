import test from 'node:test';
import assert from 'node:assert/strict';

// ==================== PROBLEM ====================
/*
3914. Minimum Operations to Make Array Non-Decreasing

AWS provides scalable systems using a set of n servers. You are given an integer array `power`, where `power[i]` represents the computational power of the i-th server.

The goal is to arrange the computational powers of the servers in non-decreasing order. In one operation, you can choose any contiguous subarray of `power` and increase each element in that subarray by x, where x is any positive integer.

Return the minimum possible sum of x across all operations required to make the array non-decreasing.

An array is non-decreasing if `power[i] <= power[i + 1]` for all 0 <= i < n - 1.

Examples:
- Input: power = [3, 4, 1, 6, 2]
  Output: 7
  Explanation: 
    - Choose subarray power[2..4] and add x = 3. Array becomes [3, 4, 4, 9, 5].
    - Choose subarray power[4..4] and add x = 4. Array becomes [3, 4, 4, 9, 9].
    - The array is now non-decreasing. Total sum of x values is 3 + 4 = 7.

- Input: power = [3, 2, 1]
  Output: 2
  Explanation: 
    - Choose subarray power[1..2] and add x = 1. Array becomes [3, 3, 2].
    - Choose subarray power[2..2] and add x = 1. Array becomes [3, 3, 3].
    - Total sum of x values is 1 + 1 = 2.

- Input: power = [3, 5, 2, 3]
  Output: 3
  Explanation: 
    - Choose subarray power[2..3] and add x = 3. Array becomes [3, 5, 5, 6].
    - Total sum of x values is 3.

Constraints:
- 1 <= power.length <= 10^5
- 1 <= power[i] <= 10^9
*/

// ==================== SOLUTION ====================
function solve(power: number[]): number {
    let totalX = 0;
    for(let i = 0; i < power.length - 1; i++){
        if(power[i] > power[i + 1]){
            totalX += power[i] - power[i + 1];
        }
    }

    return totalX;
}

// ==================== TESTS ====================
test('example 1', () => {
  assert.strictEqual(solve([3, 4, 1, 6, 2]), 7);
});

test('example 2', () => {
  assert.strictEqual(solve([3, 2, 1]), 2);
});

test('example 3', () => {
  assert.strictEqual(solve([3, 5, 2, 3]), 3);
});

test('minimum valid input: single server requires 0 operations', () => {
  assert.strictEqual(solve([5]), 0);
});

test('already non-decreasing array requires 0 operations', () => {
  assert.strictEqual(solve([1, 2, 3, 4]), 0);
});

test('all identical server powers require 0 operations', () => {
  assert.strictEqual(solve([7, 7, 7]), 0);
});

test('strictly decreasing array', () => {
  assert.strictEqual(solve([4, 3, 2, 1]), 3);
});

test('ordinary unseen case with dip that recovers partially below prefix maximum', () => {
  // power: [5, 1, 4] -> required increments: [0, 4, 1] -> min subarray sum of x = 4
  assert.strictEqual(solve([5, 1, 4]), 4);
});
