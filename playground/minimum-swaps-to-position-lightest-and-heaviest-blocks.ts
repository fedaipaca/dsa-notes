import test from 'node:test';
import assert from 'node:assert/strict';

// ==================== PROBLEM ====================
/*
Minimum Swaps to Position Lightest and Heaviest Blocks
Leetcode: https://leetcode.com/problems/semi-ordered-permutation/description/

Imagine you are shopping on Amazon.com for weightlifting equipment. The equipment consists of a stack of n blocks, each with a distinct weight.

The array blocks represents the weights of the blocks from top to bottom (1-indexed). The weightlifting equipment is considered good if:
- The block at the top (blocks[1]) is the lightest block in the stack.
- The block at the bottom (blocks[n]) is the heaviest block in the stack.

In one move, you can swap the order of adjacent blocks. Return the minimum number of moves required to form good weightlifting equipment.

Examples:
- Input: blocks = [3, 2, 1]
  Output: 3
  Explanation: 
    - Move 1: Swap first and second blocks -> blocks = [2, 3, 1]
    - Move 2: Swap second and third blocks -> blocks = [2, 1, 3]
    - Move 3: Swap first and second blocks -> blocks = [1, 2, 3]

- Input: blocks = [2, 4, 3, 1, 6]
  Output: 3
  Explanation: 
    - Move 1: Swap third and fourth blocks -> blocks = [2, 4, 1, 3, 6]
    - Move 2: Swap second and third blocks -> blocks = [2, 1, 4, 3, 6]
    - Move 3: Swap first and second blocks -> blocks = [1, 2, 4, 3, 6]

- Input: blocks = [4, 11, 9, 10, 12]
  Output: 0
  Explanation: The blocks are already in their correct positions (blocks[1] is the minimum and blocks[5] is the maximum).

Constraints:
- 2 <= n <= 10^5
- 1 <= blocks[i] <= 10^9 for all 1 <= i <= n
- blocks consists of distinct integers.
*/

// ==================== SOLUTION ====================
function minimumSwaps(blocks: number[]): number {
  let minPos = 0;
  let maxPos = blocks.length - 1;

  for(let i = 0; i < blocks.length; i++){
    if(blocks[i] < blocks[minPos]){
        minPos = i;
    }
    if(blocks[i] > blocks[maxPos]){
        maxPos = i;
    }
  }

  let ops = minPos + blocks.length - maxPos - 1;

  if(minPos > maxPos){
    ops--;
  }

  return ops;
}

// ==================== TESTS ====================
test('example 1', () => {
  assert.strictEqual(minimumSwaps([3, 2, 1]), 3);
});

test('example 2', () => {
  assert.strictEqual(minimumSwaps([2, 4, 3, 1, 6]), 3);
});

test('example 3', () => {
  assert.strictEqual(minimumSwaps([4, 11, 9, 10, 12]), 0);
});

test('edge case: minimal array of length 2 already in order', () => {
  assert.strictEqual(minimumSwaps([1, 2]), 0);
});

test('edge case: minimal array of length 2 in reverse order', () => {
  assert.strictEqual(minimumSwaps([2, 1]), 1);
});

test('edge case: worst case with min at end and max at start', () => {
  assert.strictEqual(minimumSwaps([5, 4, 3, 2, 1]), 7);
});

test('edge case: lightest already at top, heaviest needs moving', () => {
  assert.strictEqual(minimumSwaps([1, 5, 2, 4, 3]), 3);
});

test('edge case: heaviest already at bottom, lightest needs moving', () => {
  assert.strictEqual(minimumSwaps([3, 4, 1, 2, 5]), 2);
});

test('edge case: min index greater than max index requires cross deduction', () => {
  assert.strictEqual(minimumSwaps([10, 1, 5, 2]), 3);
});
