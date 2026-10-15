import test from 'node:test';
import assert from 'node:assert/strict';

// ==================== PROBLEM ====================
/*
Warehouse Shipment Allocation

You are given an integer array `capacities`, where `capacities[i]` represents the initial capacity of the i-th warehouse. You are also given two integers, `shipment` and `backup`.

You must select exactly one warehouse to handle a new shipment. The selected warehouse's capacity must be at least `shipment`. All other n - 1 remaining warehouses must collectively have a combined total capacity of at least `backup`.

If a warehouse's current capacity is insufficient, you can upgrade it by adding capacity. 

Find the minimum total capacity upgrade required across all warehouses to satisfy both the primary shipment requirement and the remaining backup capacity requirement.

Examples:

Example 1:
- Input: capacities = [2, 5, 3], shipment = 6, backup = 7           10,5,2   s=6    b=10  |    2,5,10   s=6    b=5
- Output: 3
- Explanation:
  - Choose warehouse 1 (capacity 5) for the shipment. Upgrade its capacity from 5 to 6 (cost = 1).
  - The remaining warehouses are 0 and 2 with capacities [2, 3] (sum = 5).
  - To reach the backup requirement of 7, increase total remaining capacity by 2 (cost = 2).
  - Total minimum upgrade required = 1 + 2 = 3.

Example 2:
- Input: capacities = [10, 20, 30], shipment = 15, backup = 25
- Output: 0
- Explanation:
  - Choose warehouse 2 (capacity 30 >= 15) or warehouse 1 (capacity 20 >= 15).
  - Choosing warehouse 2 leaves warehouses 0 and 1 with total capacity 10 + 20 = 30 >= 25.
  - No upgrades are required, so the minimum total upgrade is 0.

Constraints:
- n == capacities.length
- 2 <= n <= 10^5
- 1 <= capacities[i] <= 10^9
- 1 <= shipment <= 10^9
- 1 <= backup <= 10^9
*/

// ==================== SOLUTION ====================
function solve(capacities: number[], shipment: number, backup: number): number {
  let sum = 0;
  
  for(const c of capacities){
    sum += c;
  }

  let totalExtras = Infinity;

  for(const c of capacities){
    const remainCap = sum - c;

    let extraBackup = 0;
    if(remainCap < backup){
        extraBackup = backup - remainCap;
    }

    let extraShip = 0;
    if(c < shipment){
        extraShip = shipment - c;
    }

    totalExtras = Math.min(totalExtras, extraBackup + extraShip)
  }

  return totalExtras;
}

// ==================== TESTS ====================
test('example 1', () => {
  assert.strictEqual(solve([2, 5, 3], 6, 7), 3);
});

test('example 2', () => {
  assert.strictEqual(solve([10, 20, 30], 15, 25), 0);
});

test('minimum number of warehouses already meet both requirements', () => {
  assert.strictEqual(solve([1, 1], 1, 1), 0);
});

test('all capacities require upgrades', () => {
  assert.strictEqual(solve([1, 1], 5, 5), 8);
});

test('choose a warehouse with spare capacity to reduce total upgrades', () => {
  assert.strictEqual(solve([10, 1, 1], 5, 5), 3);
});
