import test from 'node:test';
import assert from 'node:assert/strict';

// ==================== PROBLEM ====================
/*
Minimum Time to Synchronize Servers

Developers at Amazon have deployed an application with a distributed database stored on `total_servers` different servers, numbered from `1` to `total_servers`, connected in a circular fashion (i.e., server `1` is connected to `2`, `2` to `3`, ..., and `total_servers` connects back to `1`).

A subset of $n$ servers represented by an integer array `servers` needs to transfer data to synchronize with each other. Data transfer between any two directly connected servers takes `1` unit of time.

Starting from any server, return the minimum total time required to transfer data to all other servers in the target subset.

Examples:

Example 1:
- Input: total_servers = 8, servers = [2, 6, 8]
- Output: 4
- Explanation: One path goes from 2 to 6 to 8 taking 6 units of time. The other path goes from 2 to 8 to 6 and takes 4 units of time. Return the shorter path length, 4.

Example 2:
- Input: total_servers = 5, servers = [1, 5]
- Output: 1
- Explanation: The two servers are directly connected, taking only 1 unit of time to share the data.

Example 3:
- Input: total_servers = 10, servers = [4, 6, 2, 9]
- Output: 7
- Explanation: An optimal strategy is to start from server 2 and go to 4, then 6, then 9. It takes $2 + 2 + 3 = 7$ units of time.

Constraints:
- $1 \le \text{total\_servers} \le 10^9$
- $1 \le n \le 10^5$
- $1 \le \text{servers}[i] \le \text{total\_servers}$
*/

// ==================== SOLUTION ====================
function solve(totalServers: number, servers: number[]): number {
    if (servers.length < 2) {
        return 0;
    }

    servers.sort((a, b) => a - b);

    let maxGap = servers.at(0)! + totalServers - servers.at(-1)!;

    for (let i = 0; i < servers.length - 1; i++) {
        const gap = servers[i + 1] - servers[i];
        maxGap = Math.max(maxGap, gap);
    }

    return totalServers - maxGap;
}

// ==================== TESTS ====================
test('example 1', () => {
    assert.strictEqual(solve(8, [2, 6, 6, 8]), 4);
});

test('example 2', () => {
    assert.strictEqual(solve(5, [1, 5]), 1);
});

test('example 3', () => {
    assert.strictEqual(solve(10, [4, 6, 2, 9]), 7);
});

test('example 4', () => {
    assert.strictEqual(solve(20, [1, 2, 15, 16]), 7);
});

test('edge case: one target server requires no transfer', () => {
    assert.strictEqual(solve(1, [1]), 0);
});

test('edge case: every server on a four-server ring', () => {
    assert.strictEqual(solve(4, [1, 2, 3, 4]), 3);
});

test('edge case: targets meet across the wraparound boundary', () => {
    assert.strictEqual(solve(1_000_000_000, [1, 1_000_000_000]), 1);
});
