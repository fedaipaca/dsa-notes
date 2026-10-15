---
name: playground-problem
description: 'Scaffold a new TypeScript file in playground/ for a coding interview or LeetCode-style question. Verifies and corrects flawed examples from the problem statement before generating. Use when the user pastes/references an interview question (e.g. from questions/amazon-interview-questions.md or any LeetCode/OA problem) and wants a runnable file created with the problem statement, an empty place to write the solution, and node:test test cases. Triggers: "create a playground file for this", "scaffold this problem", "add this question to playground", "set up a file so I can code this". Only creates the file — never implements the solution or runs it.'
argument-hint: 'Paste or reference the interview question to scaffold'
---

# Playground Problem Scaffold

Creates one ready-to-code `.ts` file in `playground/` for a single interview question. The user writes the
solution and runs the file themselves with `node <file>.ts` (Node has native TS type-stripping here — no
build step). Never implement the solution and never run the file — just create it.

## When to Use

- User supplies (pastes, selects, or references by name) an interview/LeetCode-style question and asks for
  a file/scaffold/playground entry for it.
- Works for questions with a LeetCode number, and for original/non-LeetCode questions (e.g. from
  `questions/amazon-interview-questions.md`).

## Procedure

### 1. Determine the filename

- If the question has a known LeetCode number, use: `<number>-<kebab-slug-of-title>.ts`
  (e.g. `2506-count-pairs-of-similar-strings.ts`).
- If it has no LeetCode number (a custom/company-original question), use: `<kebab-slug-of-title>.ts`
  (e.g. `next-palindromic-time.ts`).
- Slug rules: lowercase, spaces/punctuation → single hyphens, strip articles like "the"/"a" only if it
  keeps the name clear.
- Place the file at `playground/<filename>.ts`. If a file with that name already exists, ask the user
  before overwriting.

### 2. Verify and correct problem examples

Online assessments, company-specific questions, and copied problem statements frequently contain flaws
in their worked examples: arithmetic errors in explanations, incorrect expected outputs, mislabeled
indices, or inputs violating stated constraints. Before generating the file, verify every example:

1. **Trace each example by hand against the formal rules:**
   - Follow the problem's stated rules and operations strictly on the provided input.
   - Check if the derived result matches the provided example `Output`.
   - Check if the step-by-step `Explanation` accurately reflects the state transitions and math.
   - Check if the `Input` satisfies all stated `Constraints`.
2. **Identify and classify discrepancies:**
   - *Incorrect output:* The example input and rules are valid, but the printed output is mathematically
     or logically wrong.
   - *Flawed explanation:* The output is correct, but intermediate steps, arithmetic, or intermediate
     arrays in the explanation contradict the rules.
   - *Input typo / constraint mismatch:* The input has an obvious typo, or the explanation uses different
     values than the input field, or the input violates a stated constraint.
3. **Correct the example:**
   - Determine the intended problem mechanics and resolve the contradiction.
   - Recompute the true correct output and write an accurate step-by-step explanation.
   - If an input typo caused the inconsistency, adjust the input and re-verify.
4. **Document corrections in the Problem comment:**
   - In the block comment, preserve clarity by presenting the corrected example.
   - Explicitly annotate any correction directly under the example with a clear note:
     `[Note: Corrected from original problem text: <brief explanation of the discrepancy and fix>]`.
   - Ensure the generated test suite tests the **corrected** example with the verified input and output.

### 3. Build the file from this template

Use this below template for structural reference. Replace every illustrative input and output
placeholder with concrete values from the problem before creating the file. In particular, infer a
problem-specific `solve` signature and ensure each test passes the required arguments and an explicit
expected value. Never leave comment-only assertion arguments or add TypeScript suppression directives.
The file must have exactly these sections, in this order, separated by the same banner-comment style:

1. **Problem** — the full problem statement as a block comment: title, description, verified/corrected
   examples (input/output/explanation with any correction notes), and constraints.
2. **Solution** — a function signature matching the problem's inputs/outputs (infer reasonable
   TypeScript types from the constraints/examples), with an empty/TODO body. Do not implement logic.
   Throw or return a placeholder so the file still type-checks and runs.
3. **Tests** — using only `node:test` and `node:assert/strict` (no external test libraries). Do not wrap
   tests in a `describe` block; use flat `test(...)` calls so they execute and print results automatically
   when the file is run directly with `node` (no `--test` flag needed).

```ts
import test from 'node:test';
import assert from 'node:assert/strict';

// ==================== PROBLEM ====================
/*
<Title> (LeetCode <number> if applicable)
Leetcode: <url, if applicable>

<Full problem description copied from the source question.>

Examples:
- Input: ...
  Output: ...
  Explanation: ...
  [Note: Corrected from original problem text: ...] (only if an error was found and fixed)

Constraints:
- ...
*/

// ==================== SOLUTION ====================
function solve(/* params inferred from the problem */): unknown {
  // TODO: implement
  throw new Error('not implemented');
}

// ==================== TESTS ====================
// One test per verified worked example from the question.
test('example 1', () => {
  assert.deepStrictEqual(solve(/* example 1 input */), undefined /* TODO: replace with verified example 1 output */);
});

// Additional tests for edge cases implied by the constraints
// (min/max size, duplicates, boundary values, special-cased results, etc.).
test('edge case: <description>', () => {
  assert.deepStrictEqual(solve(/* edge case input */), undefined /* TODO: replace with expected output */);
});
```

The inline snippet is a structural example, not a finished problem scaffold. Replace the `solve`
signature and every input/output placeholder; use `assert.strictEqual` instead of
`assert.deepStrictEqual` when the expected result is a primitive.

### 4. Write a compact correctness test matrix, not unit tests

These are correctness checks across the input space, not code-structure unit tests. The examples alone are
rarely sufficient: choose small, independently verifiable inputs that distinguish plausible but incorrect
solutions (off-by-one errors, a wrong greedy choice, mishandled duplicates, or an omitted result branch).

For each problem:

- Add one `test()` per verified/corrected example given in the question, asserting the exact verified output.
- Add at least three additional tests when the constraints permit. Together with the examples, cover each
  applicable category below. Do not add a redundant test merely to reach the count; explain the behavior in
  the test name instead.
  - **Minimum valid input:** empty input only when allowed; otherwise a single item, shortest string, or
    smallest valid value.
  - **Ordinary unseen case:** a small non-example input with enough structure to exercise the main logic.
  - **Boundary transition:** a case just across a meaningful threshold, such as the first/last index,
    carry or wrap-around, a tie, a change from possible to impossible, or an exact capacity limit.
  - **Input-shape variation:** duplicates/all-equal values, reversed or already-solved order, negative or
    zero values, overlapping intervals, repeated characters, or a nontrivial tree/graph shape, when allowed
    and relevant.
  - **Required special result:** every documented special result or branch, such as no solution/`-1`, a
    tie-breaking rule, an empty result, or multiple valid-looking choices.
- Derive expected outputs by hand from the problem statement. Keep assertions on literal expected outputs;
  never calculate an oracle by calling the same untested function differently.
- Keep inputs small enough that a candidate can inspect them during an interview. Use a near-boundary value
  rather than constructing a huge maximum-constraint fixture unless size itself is the behavior under test.
- Use `assert.deepStrictEqual` for arrays/objects and `assert.strictEqual` for primitives.

Before creating the file, mentally check that removing any one extra test would leave a distinct behavior
uncovered. If a category is inapplicable, omit it rather than inventing an artificial case.

### 5. Create the file and stop

- Use the file-creation tool to write the file exactly once.
- Do not run the file, do not implement the solution body, and do not modify other files.
- Report back:
  1. The created file path.
  2. A summary of tests added (example tests + edge cases).
  3. Any corrections made to problem examples (original vs. corrected output/input/explanation and reasoning).
