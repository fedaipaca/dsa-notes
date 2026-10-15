import test from 'node:test';
import assert from 'node:assert/strict';

// ==================== PROBLEM ====================
/*
Maximum System Throughput (LeetCode 1561)
Leetcode: https://leetcode.com/problems/maximum-number-of-coins-you-can-get/description/

The developers at Amazon are working on optimizing their database query times. There are n host servers, where the throughput of the ith host server is given by host_throughput[i].

These host servers are grouped into clusters of size three. The throughput of a cluster, denoted as cluster_throughput, is defined as the median of the host_throughput values of the three servers in the cluster. Each server can be part of at most one cluster, and some servers may remain unused.

The total system throughput, called system_throughput, is the sum of the throughputs of all the clusters formed. The task is to find the maximum possible system_throughput.

Note: The median of a cluster of three host servers is the throughput of the 2nd server when the three throughputs are sorted in either ascending or descending order.

Examples:
- Input: host_throughput = [4, 6, 3, 5, 4, 5]
  Output: 9
  Explanation: Here, n = 6, and the host throughput array is [4, 6, 3, 5, 4, 5]. The maximum number of clusters that can be formed is 2. One optimal way to form the clusters is to select the 1st, 2nd, and 3rd host servers for the first cluster [4, 6, 3] (median = 4), and the 4th, 5th, and 6th host servers for the second cluster [5, 4, 5] (median = 5). Thus, the system_throughput is 4 + 5 = 9.
- Input: host_throughput = [2, 3, 4, 3, 4] 2,3,3,4,4
  Output: 4
  Explanation: The maximum number of clusters that can be formed is 1, and two host servers will remain unused. One possible cluster is formed by selecting the 1st, 3rd, and 5th host servers [2, 4, 4], giving a median of 4.

Constraints:
- 1 <= n <= 10^5
- 1 <= host_throughput[i] <= 10^9
*/

// ==================== SOLUTION ====================
function solve(hostThroughput: number[]): number {
  hostThroughput.sort((a,b) => a-b);

  let left = 0;
  let right = hostThroughput.length - 2;
  let sum = 0;

  while(left < right){
    sum += hostThroughput[right];
    right -= 2;
    left += 1;
  }

  return sum;
}

// ==================== TESTS ====================
test('example 1', () => {
  assert.strictEqual(solve([4, 6, 3, 5, 4, 5]), 9);
});

test('example 2', () => {
  assert.strictEqual(solve([2, 3, 4, 3, 4]), 4);
});

test('fewer than three servers cannot form a cluster', () => {
  assert.strictEqual(solve([5]), 0);
});

test('one cluster uses the best available median', () => {
  assert.strictEqual(solve([1, 100, 2]), 2);
});

test('four servers can form only one cluster', () => {
  assert.strictEqual(solve([1, 2, 3, 4]), 3);
});

test('duplicate throughputs contribute one median per cluster', () => {
  assert.strictEqual(solve([7, 7, 7, 7, 7, 7, 7]), 14);
});
