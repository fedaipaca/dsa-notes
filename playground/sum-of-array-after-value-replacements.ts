// @ts-nocheck
import test from 'node:test';
import assert from 'node:assert/strict';

// ==================== PROBLEM ====================
/*
Sum of Array After Value Replacements

You are given an integer array `entries` and a 2D integer array `transactions`, where `transactions[i] = [old_v, new_v]`.

For each transaction `[old_v, new_v]`, perform the following steps sequentially:
1. Find all indices in `entries` where `entries[idx] == old_v`.
2. Replace the value at those indices with `new_v`.
3. Calculate the sum of all elements in `entries` after the update.

Return an array of integers representing the sum of `entries` after each transaction.

Examples:
- Input: entries = [1, 2, 2, 3], transactions = [[2, 4], [1, 3], [4, 1]]
  Output: [12, 14, 8]
  Explanation:
    - Initial array: [1, 2, 2, 3] (sum = 8).
    - Transaction 1 [2, 4]: Replace all 2s with 4. Array becomes [1, 4, 4, 3]. Sum = 12.
    - Transaction 2 [1, 3]: Replace all 1s with 3. Array becomes [3, 4, 4, 3]. Sum = 14.
    - Transaction 3 [4, 1]: Replace all 4s with 1. Array becomes [3, 1, 1, 3]. Sum = 8.

- Input: entries = [5, 5, 5], transactions = [[5, 10], [10, 2]]
  Output: [30, 6]
  Explanation:
    - Transaction 1 [5, 10]: Array becomes [10, 10, 10]. Sum = 30.
    - Transaction 2 [10, 2]: Array becomes [2, 2, 2]. Sum = 6.

Constraints:
- 1 <= entries.length <= 10^5
- 1 <= entries[i] <= 10^9
- 1 <= transactions.length <= 10^5
- transactions[i].length == 2
- 1 <= old_v, new_v <= 10^9
*/

// ==================== SOLUTION ====================

function sumAfterReplacements(entries: number[], transactions: number[][]): number[] {
  const entryFreq = new Map<number, number>();
  let sumOfEntries = 0;

  for(const entry of entries){
    sumOfEntries += entry;
    entryFreq.set(entry, (entryFreq.get(entry) || 0) + 1);
  }

  let result = [];
  for(const [oldV, newV] of transactions){
    const diff = newV - oldV;
    const oldVFreq = entryFreq.get(oldV) || 0;

    sumOfEntries += diff * oldVFreq;

    let updatedFreq = oldVFreq;
    
    if(entryFreq.has(newV)){
      const newVFreq = entryFreq.get(newV);
      updatedFreq += newVFreq;
    }

    entryFreq.delete(oldV);
    entryFreq.set(newV, updatedFreq);

    result.push(sumOfEntries);
  }

  return result;

}

// ==================== TESTS ====================
test('example 1', () => {
  assert.deepStrictEqual(
    sumAfterReplacements(
      [1, 2, 2, 3],
      [
        [2, 4],
        [1, 3],
        [4, 1],
      ]
    ),
    [12, 14, 8]
  );
});

test('example 2', () => {
  assert.deepStrictEqual(
    sumAfterReplacements(
      [5, 5, 5],
      [
        [5, 10],
        [10, 2],
      ]
    ),
    [30, 6]
  );
});

test('edge case: transaction target value not present in entries', () => {
  assert.deepStrictEqual(sumAfterReplacements([1, 2, 3], [[4, 10]]), [6]);
});

test('edge case: single element entry with multiple transactions', () => {
  assert.deepStrictEqual(
    sumAfterReplacements(
      [10],
      [
        [10, 20],
        [20, 5],
        [99, 100],
      ]
    ),
    [20, 5, 5]
  );
});

test('edge case: transaction replaces with identical value', () => {
  assert.deepStrictEqual(sumAfterReplacements([1, 2, 3], [[2, 2]]), [6]);
});

test('edge case: cascade where replaced elements merge and are replaced again', () => {
  assert.deepStrictEqual(
    sumAfterReplacements(
      [1, 2, 3],
      [
        [1, 2],
        [2, 5],
      ]
    ),
    [7, 13]
  );
});

test('edge case: single transaction on all identical elements', () => {
  assert.deepStrictEqual(sumAfterReplacements([2, 2], [[2, 3]]), [6]);
});

test('edge case: large numbers', () => {
  assert.deepStrictEqual(
    sumAfterReplacements([1_000_000_000, 1_000_000_000], [[1_000_000_000, 2_000_000_000]]),
    [4_000_000_000]
  );
});
