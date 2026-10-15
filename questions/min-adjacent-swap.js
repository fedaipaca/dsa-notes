/*
### Problem Statement: Minimum Adjacent Swaps to Group 0s and 1s

Given an array `nums` containing only `0`s and `1`s. You are allowed to swap only **adjacent** elements.

Your goal is to rearrange the array so that:
- All `0`s are on one side
- All `1`s are on the other side

In other words, the final array must be either:
- `000...0111...1` (All 0s on the left, all 1s on the right)
- `111...1000...0` (All 1s on the left, all 0s on the right)

Return the **minimum number of adjacent swaps** required to reach either valid target state.

---

### Examples

**Example 1:**
Input: nums = [0, 1, 0, 1]
Output: 1
Explanation: 
- Target state [0, 0, 1, 1]: Swap nums[1] and nums[2] -> [0, 0, 1, 1] (1 swap)
- Target state [1, 1, 0, 0]: Requires 3 swaps
Minimum swaps = min(1, 3) = 1

**Example 2:**
Input: nums = [1, 1, 0, 0]
Output: 0
Explanation: The array is already in a valid target state (all 1s on the left, all 0s on the right).

**Example 3:**
Input: nums = [1, 0, 1, 0, 0, 1]
Output: 4
Explanation:
- Target state [0, 0, 0, 1, 1, 1]: Requires 5 swaps
- Target state [1, 1, 1, 0, 0, 0]: Requires 4 swaps
Minimum swaps = min(5, 4) = 4

---

### Constraints
* 1 <= nums.length <= 10^5
* nums[i] is either 0 or 1.
*/


function minAdjacentSwaps(nums) {
    console.log({ input: nums })
    if (nums.length <= 1) {
        return 0;
    }

    const zeroFirst = [...nums];
    const oneFirst = [...nums];

    let zeroSwap = 0;
    for (let i = 0; i < zeroFirst.length; i++) {
        if (zeroFirst[i] === 0) {
            let j = i;
            while (j !== 0 && zeroFirst[j - 1] !== 0) {
                [zeroFirst[j - 1], zeroFirst[j]] = [zeroFirst[j], zeroFirst[j - 1]];
                j--;
                zeroSwap++;
            }
        }
    }


    let oneSwap = 0;
    console.log({ oneFirst });
    for (let i = 0; i < oneFirst.length; i++) {
        if (oneFirst[i] === 1) {
            let j = i;
            while (j !== 0 && oneFirst[j - 1] !== 1) {
                [oneFirst[j - 1], oneFirst[j]] = [oneFirst[j], oneFirst[j - 1]];
                j--;
                oneSwap++;
            }
        }
    }

    return Math.min(zeroSwap, oneSwap)

}


/* ============================================================
   TESTS
   ============================================================ */

const tests = [
    {
        input: [0, 1, 0, 1],
        expected: 1
    },
    {
        input: [1, 0, 1, 0],
        expected: 1
    },
    {
        input: [0, 0, 1, 1],
        expected: 0
    },
    {
        input: [1, 1, 0, 0],
        expected: 0
    },
    {
        input: [1, 0, 0, 1, 0],
        expected: 2
    },
    {
        input: [1, 0, 1, 0, 1, 0],
        expected: 3
    },
    {
        input: [0, 1, 0, 1, 0],
        expected: 3
    },
    {
        input: [1, 0, 0, 0, 1, 1],
        expected: 3
    },
    {
        input: [0, 1, 1, 0, 1, 0],
        expected: 4
    },
    {
        input: [1, 1, 0, 1, 0, 0],
        expected: 1
    },
    {
        input: [0],
        expected: 0
    },
    {
        input: [1],
        expected: 0
    },
    {
        input: [0, 0, 0],
        expected: 0
    },
    {
        input: [1, 1, 1],
        expected: 0
    }
];


let passed = 0;

for (let i = 0; i < tests.length; i++) {
    const { input, expected } = tests[i];

    console.log(
        `Test for ${i + 1}: | ` +
        `Input: [${input}] | `
    );

    const actual = minAdjacentSwaps(input);

    if (actual === expected) {
        console.log(`Test ${i + 1}: PASS`);
        passed++;
    } else {
        console.log(
            `Test FAIL | ` +
            `Expected: ${expected} | ` +
            `Got: ${actual}`
        );
    }

    console.log('=================')
}

console.log(`\n${passed}/${tests.length} tests passed.`);