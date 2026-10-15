import test from 'node:test';
import assert from 'node:assert/strict';

// ==================== PROBLEM ====================
/*
Maximum Sum of Matrix Elements with Row Constraints

Developers at Amazon are working on a prototype for a utility that compresses an n x n matrix, `data`, with the help of a compression rate represented by an array, `factor`. 

The utility returns an integer which is the maximum sum of exactly `x` elements of the matrix such that the number of elements taken from the i-th row does not exceed `factor[i]` for all 0 <= i < n. The utility returns `-1` if the compression cannot be performed (i.e., if it is impossible to select `x` elements satisfying all constraints).

Given the matrix `data`, array `factor`, and integer `x`, find the maximum sum to perform compression under the given constraints, or `-1` if it is not possible.

Examples:
- Input: data = [[1, 2, 3], [4, 5, 6], [7, 8, 9]], factor = [1, 2, 1], x = 2
  Output: 15
  Explanation: 
    - The maximum elements we can select from each row are:
      - Row 0 (factor[0] = 1): [3]
      - Row 1 (factor[1] = 2): [6, 5]
      - Row 2 (factor[2] = 1): [9]
    - Combining these candidates gives [9, 6, 5, 3]. Selecting the top x = 2 elements gives 9 + 6 = 15.

- Input: data = [[1, 2], [3, 4]], factor = [0, 0], x = 1
  Output: -1
  Explanation: factor[0] = 0 and factor[1] = 0, meaning no elements can be selected from any row. It is impossible to select x = 1 element, so return -1.

Constraints:
- n == data.length == data[i].length
- 1 <= n <= 1000
- 1 <= data[i][j] <= 10^9
- 0 <= factor[i] <= n
- 1 <= x <= n * n
*/

// ==================== SOLUTION ====================

function solve(data: number[][], factor: number[], x: number): number {
    let selected = [];

    for (let i = 0; i < factor.length; i++) {
        let fCount = factor[i];

        if (fCount !== 0) {
            data[i].sort((a, b) => b - a);
            console.log('data-', i, ": ", data[i])
            for (let j = 0; j < fCount; j++) {
                selected.push(data[i][j])
            }

            console.log({ selected })
        }
    }

    selected.sort((a, b) => b - a);

    if(!selected.length || selected.length < x){
        return -1;
    }

    let sum = 0;

    for (let i = 0; i < x; i++) {
        sum += selected[i]
    }

    return sum;

}

// ==================== TESTS ====================
test('example 1', () => {
    assert.strictEqual(
        solve(
            [
                [1, 2, 3],
                [4, 5, 6],
                [7, 8, 9],
            ],
            [1, 2, 1],
            2,
        ),
        15,
    );
});

test('example 2', () => {
    assert.strictEqual(
        solve(
            [
                [1, 2],
                [3, 4],
            ],
            [0, 0],
            1,
        ),
        -1,
    );
});

test('minimum valid input: 1x1 matrix with sufficient factor', () => {
    assert.strictEqual(solve([[42]], [1], 1), 42);
});

test('sum of factor limits strictly less than x returns -1', () => {
    assert.strictEqual(
        solve(
            [
                [4, 2],
                [1, 3],
            ],
            [1, 0],
            2,
        ),
        -1,
    );
});

test('exact capacity limit where total available factor equals x', () => {
    assert.strictEqual(
        solve(
            [
                [5, 1],
                [3, 7],
            ],
            [1, 1],
            2,
        ),
        12,
    );
});

test('multiple elements selected per row with unsorted inputs', () => {
    assert.strictEqual(
        solve(
            [
                [5, 1, 2],
                [9, 10, 8],
                [3, 4, 2],
            ],
            [2, 1, 2],
            4,
        ),
        22,
    );
});

test('matrix with duplicate values across rows', () => {
    assert.strictEqual(
        solve(
            [
                [7, 7],
                [7, 7],
            ],
            [2, 1],
            3,
        ),
        21,
    );
});
