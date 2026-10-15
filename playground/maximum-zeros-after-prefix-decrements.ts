import test from 'node:test';
import assert from 'node:assert/strict';

// ==================== PROBLEM ====================
/*
Maximum Zeros After Prefix Decrements

You are given an integer array nums of positive integers.

In one operation, you may choose an index k (1 <= k <= nums.length) such that the first k elements of nums (the prefix nums[0..k-1]) contain no zeros, and decrease each element in that prefix by 1.

You may perform any number of operations (including none). Return the maximum number of zeros that can be present in nums after performing the operations.

Examples:
- Input: nums = [3, 1, 2, 4]
  Output: 2
  Explanation:
  - Choose k = 4: nums becomes [2, 0, 1, 3].
  - Choose k = 1 twice: nums becomes [0, 0, 1, 3].
  Now every prefix of length >= 3 contains a zero, so elements 2 and 4 can never be reduced.
  The array has 2 zeros, and this is the maximum.

- Input: nums = [2, 2, 1]
  Output: 3
  Explanation:
  - Choose k = 3: nums becomes [1, 1, 0].
  - Choose k = 2: nums becomes [0, 0, 0].
  All 3 elements are zero.

- Input: nums = [1, 2, 3]
  Output: 1
  Explanation:
  - Choose k = 1: nums becomes [0, 2, 3].
  Every non-empty prefix now contains a zero, so no further operation is possible.

- Input: nums = [5, 4, 3, 2, 1]
  Output: 5
  Explanation:
  Apply k = 5 once, k = 4 once, k = 3 once, k = 2 once, and k = 1 once.
  Every element is reduced to 0.

Constraints:
- 1 <= nums.length <= 10^5
- 1 <= nums[i] <= 10^9
*/
// 2, 5, 2
// ==================== SOLUTION ====================
function solve(nums: number[]): number {
  if(nums.length < 2){
    return nums.length;
  }

  let min = nums[0];
  let count = 1;

  for(let i = 1; i < nums.length; i++){
    if(nums[i] <= min){
        count++;
        min = Math.min(min, nums[i])
    }
  }

  return count;
}

// ==================== TESTS ====================
test('example 1', () => {
  assert.strictEqual(solve([3, 1, 2, 4]), 2);
});

test('example 2', () => {
  assert.strictEqual(solve([2, 2, 1]), 3);
});

test('example 3', () => {
  assert.strictEqual(solve([1, 2, 3]), 1);
});

test('example 4', () => {
  assert.strictEqual(solve([5, 4, 3, 2, 1]), 5);
});

test('minimum valid input: single element can always reach zero', () => {
  assert.strictEqual(solve([7]), 1);
});

test('input-shape variation: all equal elements can all be reduced together', () => {
  assert.strictEqual(solve([3, 3, 3]), 3);
});

test('input-shape variation: strictly increasing elements allow only index 0 to reach zero', () => {
  assert.strictEqual(solve([2, 5, 8]), 1);
});

test('boundary transition: valley in middle prevents later elements exceeding valley minimum', () => {
  assert.strictEqual(solve([4, 1, 4]), 2);
});

test('ordinary unseen case: peak in middle allows flanking elements to reach zero', () => {
  assert.strictEqual(solve([2, 5, 2]), 2);
});
