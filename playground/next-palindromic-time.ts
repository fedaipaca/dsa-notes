import test from 'node:test';
import assert from 'node:assert/strict';

// ==================== PROBLEM ====================
/*
Next Palindromic Time

Given a 24-hour time string `time` in the format "HH:MM", return the next closest valid time in 24-hour format that forms a palindrome.

A time "HH:MM" is considered a palindrome if the digits read the same forwards and backwards (i.e., HH[0] == MM[1] and HH[1] == MM[0]). If the next palindromic time occurs on the following day, wrap around to "00:00".

Examples:
- Input: time = "12:20"
  Output: "12:21"
  Explanation: The next valid time where hours and minutes form a palindrome is "12:21".
- Input: time = "23:59"
  Output: "00:00"
  Explanation: After "23:59", the next palindromic time occurs on the next day at "00:00".

Constraints:
- `time` is a valid 24-hour time string in "HH:MM" format.
- `00 <= HH <= 23`
- `00 <= MM <= 59`
*/

// ==================== SOLUTION ====================
function nextPalindromicTime(time: string): string {
    const [hour, min] = time.split(":");
    
    let totalMins = parseInt(hour) * 60 + parseInt(min);
    const totalMinsDay = 60 * 24;

    for(let i = 0; i < totalMinsDay; i++){
        totalMins = (totalMins + 1) % totalMinsDay;

        const h = Math.floor(totalMins / 60);
        const m = totalMins % 60;

        const hh = h.toString().padStart(2, "0");
        const mm = m.toString().padStart(2, "0");

        if(hh[0] === mm[1] && hh[1] === mm[0]){
            return hh + ":" + mm;
        }
    }

    return "";
}

// ==================== TESTS ====================
test('example 1', () => {
    assert.strictEqual(nextPalindromicTime('12:20'), '12:21');
});

test('example 2', () => {
    assert.strictEqual(nextPalindromicTime('23:59'), '00:00');
});

test('edge case: starts at midnight', () => {
    assert.strictEqual(nextPalindromicTime('00:00'), '01:10');
});

test('edge case: input is already palindromic', () => {
    assert.strictEqual(nextPalindromicTime('12:21'), '13:31');
});
