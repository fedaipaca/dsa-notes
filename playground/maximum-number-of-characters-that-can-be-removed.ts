import test from 'node:test';
import assert from 'node:assert/strict';

// ==================== PROBLEM ====================
/*
Maximum Number of Characters That Can Be Removed

You are given a string `s`. The type of a string is defined as a pair formed by its first character and its last character. For example, the string "abade" has type ("a", "e"), and a single-character string "a" has type ("a", "a").

In one operation, you can remove any number of characters from the start, the end, or both ends of the string, as long as the remaining non-empty substring maintains the same type as the original string `s`.

Return the maximum number of characters that can be removed while keeping the string's type unchanged.

Examples:
- Input: s = "abade" |  "abeaede" a: 0,1,3  e: 2,4,6
  Output: 2
  Explanation: The original string "abade" has type ("a", "e"). Removing the prefix "ab" results in "ade", which still has type ("a", "e"). A total of 2 characters were removed.
- Input: s = "aaaaa"
  Output: 4
  Explanation: The original string "aaaaa" has type ("a", "a"). We can remove 4 characters to leave "a", which has type ("a", "a").
- Input: s = "aba"
  Output: 2
  Explanation: The original string "aba" has type ("a", "a"). Removing 2 characters leaves "a", which still has type ("a", "a").

Constraints:
- 1 <= s.length <= 10^5
- s consists only of lowercase English letters.
*/

// ==================== SOLUTION ====================
function solve(s: string): number {
    if(s.length < 2){
        return 0;
    }

    if(s[0] === s.at(-1)){
        return s.length - 1;
    }

    const startIdx = [];
    const endIdx = [];
    // abade
    for(let i = 0; i < s.length; i++){
        if(s[i] === s[0]){
            startIdx.push(i); // 0, 2
        }
        if(s[i] === s.at(-1)){
            endIdx.push(i); // 4
        }
    }

    let minDist = Infinity;
    let sIdx = startIdx.length - 1; // 1
    let eIdx = endIdx.length - 1; // 0

    while(sIdx >= 0 && eIdx >= 0){
        const diff = endIdx[eIdx] - startIdx[sIdx];
        if(diff === 0){
            minDist = 0;
            break;
        } else if(diff < 0){
            sIdx--;
        } else {
            minDist = Math.min(minDist, diff); // 2
            eIdx--;
        }
    }

    return s.length - (minDist + 1); // 5 - 2 + 1

}

// ==================== TESTS ====================
test('example 1', () => {
  assert.strictEqual(solve('abade'), 2);
});

test('example 2', () => {
  assert.strictEqual(solve('aaaaa'), 4);
});

test('example 3', () => {
  assert.strictEqual(solve('aba'), 2);
});

test('edge case: single-character string', () => {
  assert.strictEqual(solve('a'), 0);
});

test('edge case: distinct endpoints occur only at the boundaries', () => {
  assert.strictEqual(solve('abcde'), 0);
});

test('edge case: repeated matching endpoints', () => {
  assert.strictEqual(solve('abca'), 3);
});
