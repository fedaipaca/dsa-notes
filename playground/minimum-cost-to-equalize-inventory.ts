import test from 'node:test';
import assert from 'node:assert/strict';

// ==================== PROBLEM ====================
/*
Minimum Cost to Equalize Inventory

You are given an integer array `inventory` representing the quality values of products.

In one operation, you can choose two quality values `x` and `y` present in the inventory and replace all products of quality `x` with quality `y`. The cost of this operation is equal to the number of products whose quality was changed (i.e., the current count of `x` in the array).

Your goal is to make all products in `inventory` have the exact same quality value using any number of operations.

Return the minimum total cost required to transform the inventory so that all elements are identical.

Examples:
- Input: inventory = [7,7,5,7,3,5,3]
  Output: 4
  Explanation:
    - Replace all products of quality 5 with 7. The inventory becomes [7,7,7,7,3,7,3]. The cost is 2 (since there were two 5s).
    - Replace all products of quality 3 with 7. The inventory becomes [7,7,7,7,7,7,7]. The cost is 2 (since there were two 3s).
    - Total cost = 2 + 2 = 4.

- Input: inventory = [1,2,3,4]
  Output: 3
  Explanation:
    - Replace 1 with 4 (cost = 1).
    - Replace 2 with 4 (cost = 1).
    - Replace 3 with 4 (cost = 1).
    - Total cost = 1 + 1 + 1 = 3.

- Input: inventory = [5,5,5,5]
  Output: 0
  Explanation: All products already have the same quality, so no changes are needed.

Constraints:
- 1 <= inventory.length <= 10^5
- 1 <= inventory[i] <= 10^9
*/

// ==================== SOLUTION ====================
function minCostToEqualizeInventory(inventory: number[]): number {
    if(!inventory.length){
        return 0;
    }

    const freq = new Map<number, number>();
    let maxFreq = 0;

    for(const item of inventory){
        const count = (freq.get(item) || 0) + 1;
        freq.set(item, count);
        maxFreq = Math.max(maxFreq, count);
    }

    return inventory.length - maxFreq;
}

// ==================== TESTS ====================
test('example 1', () => {
  assert.strictEqual(minCostToEqualizeInventory([7, 7, 5, 7, 3, 5, 3]), 4);
});

test('example 2', () => {
  assert.strictEqual(minCostToEqualizeInventory([1, 2, 3, 4]), 3);
});

test('example 3', () => {
  assert.strictEqual(minCostToEqualizeInventory([5, 5, 5, 5]), 0);
});

test('edge case: single element', () => {
  assert.strictEqual(minCostToEqualizeInventory([42]), 0);
});

test('edge case: two distinct elements', () => {
  assert.strictEqual(minCostToEqualizeInventory([1, 2]), 1);
});

test('edge case: large values up to 10^9', () => {
  assert.strictEqual(minCostToEqualizeInventory([1_000_000_000, 1_000_000_000, 5]), 1);
});

test('edge case: all elements unique', () => {
  assert.strictEqual(minCostToEqualizeInventory([10, 20, 30, 40, 50]), 4);
});
