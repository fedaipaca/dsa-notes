import test from 'node:test';
import assert from 'node:assert/strict';

// ==================== PROBLEM ====================
/*
Longest Self-Sufficient Proper Substring

Software developers at Amazon are developing a new library for Natural Language Processing. In one of its modules, every string needs to be preprocessed in a particular manner to find the length of its longest self-sufficient proper substring.

A self-sufficient proper substring is a contiguous substring of fullString that satisfies the following conditions:
1. The substring is not the entire string fullString (its length must be strictly less than n).
2. No letter that occurs inside the substring also occurs outside the substring (i.e., all occurrences of every character present in the substring are contained entirely within it).

Given the string fullString of length n, find the length of its longest self-sufficient proper substring. If no such substring exists, return 0.

Examples:                                         
- Input: fullString = "amazonservices"
  Output: 11
  Explanation:
    - Valid self-sufficient proper substrings include:
      - "zonservices" (length 11): characters 'z', 'o', 'n', 's', 'e', 'r', 'v', 'i', 'c' do not appear outside this substring.
      - "services" (length 8)
      - "amazon" (length 6)
      - "ervice" (length 6)
    - Invalid substrings include "amazonservices" (not a proper substring) and "amazonservice" (character 's' appears outside at the end).
    - The maximum length among valid proper substrings is 11.

- Input: fullString = "aaaa"
  Output: 0
  Explanation: The only substring containing all occurrences of 'a' is the full string "aaaa". Since a valid substring must be a proper substring (length < n), no valid substring exists.

Constraints:
- 1 <= n <= 10^5
- fullString consists only of lowercase English letters.
*/
// aaaa
// ==================== SOLUTION ====================
function solve(fullString: string): number {
    const strLen = fullString.length;

    if (strLen <= 1) {
        return 0;
    }

    const firstOcc = new Map<string, number>();
    const lastOcc = new Map<string, number>();

    for(let i = 0; i < strLen; i++){
        const currChar = fullString[i];
        
        if(!firstOcc.has(currChar)){
            firstOcc.set(currChar, i)
        }

        lastOcc.set(currChar, i);
    }

    let maxSubLen = 0;

    for(const [startChar, startIdx] of firstOcc){
        let lastIdx = lastOcc.get(startChar)!;

        for(let i = startIdx; i < strLen; i++){
            const currChar = fullString[i];

            if(firstOcc.get(currChar)! < startIdx){
                break;
            }

            lastIdx = Math.max(lastIdx, lastOcc.get(currChar)!)

            if(i === lastIdx){
                const currLen = lastIdx - startIdx + 1;
                
                if(currLen < strLen){
                    maxSubLen = Math.max(maxSubLen, currLen);
                }
            }
        }
    }

    return maxSubLen;
}

// ==================== TESTS ====================
test('example 1', () => {
    assert.strictEqual(solve('amazonservices'), 11);
});

test('example 2', () => {
    assert.strictEqual(solve('aaaa'), 0);
});

test('minimum valid input: single character string has no proper substring', () => {
    assert.strictEqual(solve('a'), 0);
});

test('boundary: two distinct characters allow length 1 proper substring', () => {
    assert.strictEqual(solve('ab'), 1);
});

test('ordinary case: nested character spans allow internal self-sufficient substring', () => {
    assert.strictEqual(solve('abcba'), 3);
});

test('input-shape variation: disjoint character blocks return the largest block', () => {
    assert.strictEqual(solve('aaaabb'), 4);
});

test('boundary transition: interleaved characters restrict solution to isolated center character', () => {
    assert.strictEqual(solve('abacaba'), 1);
});
