# Modern TypeScript: A Study Guide

> From fundamentals to type-level programming, written for engineers who already know JavaScript and want to write TypeScript the way strong teams write it today. The examples lean toward backend and full-stack work on Node.js.
>
> Current as of October 2026. Baseline: **TypeScript 7** (the native, Go-based compiler) and **Node.js 24 LTS** (24.12 or later). Where TypeScript 6 still matters, mainly for tools that use the compiler as a library, the guide says so.

---

## How to Use This Guide

This is a study guide, not a cheat sheet. Each chapter explains **what** a feature is, **why** it exists, **when** to reach for it, and **what goes wrong** when it's misused. Read Parts I and II in order the first time: each chapter builds on the ones before it, apart from a few clearly marked forward references. Parts III to V can be read in any order and revisited as reference.

Each chapter ends with **Key Takeaways**, which double as a quick refresher when you come back later. Chapters where practice pays off most also end with **Exercises**; solutions are in [Appendix D](#appendix-d-exercise-solutions). If you're preparing for interviews, [Appendix C](#appendix-c-typescript-interview-questions) collects the TypeScript questions that come up most often, with pointers back to the chapters that answer them.

A few conventions:

- `// ^?` comments show the type TypeScript infers at that position, the way an editor tooltip would.
- `// ❌` marks code that fails to compile or is considered bad practice. `// ✅` marks the recommended alternative.
- Unless stated otherwise, examples assume the strict configuration from Chapter 2 and run on Node.js 24 as ES modules.
- Relative imports use `.ts` extensions, the convention recommended in Chapter 2.

---

## Table of Contents

**Part I — Foundations**
1. [The TypeScript Mental Model](#1-the-typescript-mental-model)
2. [Getting Started](#2-getting-started)
3. [Everyday Types and Inference](#3-everyday-types-and-inference)
4. [Assertions, as const, and satisfies](#4-assertions-as-const-and-satisfies)
5. [The Special Types: any, unknown, never, void, null, undefined](#5-the-special-types-any-unknown-never-void-null-undefined)
6. [Object Types: type, interface, and Friends](#6-object-types-type-interface-and-friends)
7. [Functions](#7-functions)
8. [Unions and Narrowing](#8-unions-and-narrowing)
9. [Type Compatibility and Variance](#9-type-compatibility-and-variance)

**Part II — Building Abstractions**
10. [Type Operators: keyof, typeof, Indexed Access](#10-type-operators-keyof-typeof-indexed-access)
11. [Generics](#11-generics)
12. [Classes and Object-Oriented TypeScript](#12-classes-and-object-oriented-typescript)
13. [Modules, Imports, and Declaration Files](#13-modules-imports-and-declaration-files)
14. [Replacing enum and namespace](#14-replacing-enum-and-namespace)
15. [Configuration in Depth](#15-configuration-in-depth)

**Part III — Type-Level Programming**
16. [Built-in Utility Types](#16-built-in-utility-types)
17. [Mapped Types](#17-mapped-types)
18. [Conditional Types and infer](#18-conditional-types-and-infer)
19. [Template Literal Types](#19-template-literal-types)
20. [Reading and Debugging Types](#20-reading-and-debugging-types)

**Part IV — Real-World Patterns**
21. [Error Handling](#21-error-handling)
22. [Validating Data at the Boundaries](#22-validating-data-at-the-boundaries)
23. [Branded (Nominal) Types](#23-branded-nominal-types)
24. [Asynchronous Code](#24-asynchronous-code)
25. [Collections and Modern Built-ins](#25-collections-and-modern-built-ins)
26. [Immutability](#26-immutability)
27. [Sharing Types Across Service Boundaries](#27-sharing-types-across-service-boundaries)
28. [Designing Good Types](#28-designing-good-types)

**Part V — Team and Enterprise Standards**
29. [Linting and Formatting](#29-linting-and-formatting)
30. [Testing Your Types](#30-testing-your-types)
31. [Publishing Libraries](#31-publishing-libraries)
32. [Monorepos and Project References](#32-monorepos-and-project-references)
33. [Type-Checking Performance](#33-type-checking-performance)
34. [Migrating JavaScript to TypeScript](#34-migrating-javascript-to-typescript)
35. [Where TypeScript Is Unsound](#35-where-typescript-is-unsound)
36. [Anti-Patterns Checklist](#36-anti-patterns-checklist)

**Appendices**
- [Appendix A: Reference tsconfig Files](#appendix-a-reference-tsconfig-files)
- [Appendix B: Feature Timeline and Runtime Support](#appendix-b-feature-timeline-and-runtime-support)
- [Appendix C: TypeScript Interview Questions](#appendix-c-typescript-interview-questions)
- [Appendix D: Exercise Solutions](#appendix-d-exercise-solutions)
- [Appendix E: Further Reading](#appendix-e-further-reading)

---

# Part I — Foundations

## 1. The TypeScript Mental Model

Most TypeScript confusion comes from a fuzzy mental model rather than from any specific feature. Get these five ideas right and everything else becomes easier.

### 1.1 TypeScript is JavaScript plus a type layer that disappears

TypeScript code is JavaScript with type annotations added. Before your code runs, the types are **removed**. There is no TypeScript at runtime: no type information, no checks, nothing.

```ts
function greet(name: string): string {
  return `Hello, ${name}`;
}
```

becomes, at runtime:

```js
function greet(name) {
  return `Hello, ${name}`;
}
```

This has a consequence that trips up almost everyone at first:

```ts
type User = { id: number; name: string };

const data: User = JSON.parse(responseText); // compiles fine
// But nothing checked that responseText actually contains a User.
// If the server sends { id: "42" }, your "number" is a string at runtime.
```

TypeScript only knows what you tell it, and it trusts annotations and assertions you write. Data coming from outside your program (network, files, environment variables, message queues) must be validated at runtime. Chapter 22 covers how.

> **Rule of thumb:** types describe what you *believe* about values. The compiler checks that your code is consistent with those beliefs. It cannot check that the outside world agrees.

### 1.2 Types are sets of values

The most useful way to think about a type is as **the set of values it allows**.

| Type | Set of values |
|---|---|
| `boolean` | `{ true, false }` |
| `"red"` | `{ "red" }` (a single value) |
| `"red" \| "green"` | `{ "red", "green" }` |
| `number` | every number |
| `string \| number` | every string plus every number |
| `never` | the empty set (no values) |
| `unknown` | every value |

With this model, **assignability** is just "is a subset of":

```ts
const a: "red" = "red";
const b: string = a;     // ✅ {"red"} is a subset of all strings
const c: "red" = b;      // ❌ all strings is not a subset of {"red"}
```

It also explains unions and intersections for object types, which feel backwards at first:

```ts
type HasName = { name: string };
type HasAge = { age: number };

// Intersection: values that are in BOTH sets → objects with name AND age
type Person = HasName & HasAge;

// Union: values in EITHER set → objects with name, OR objects with age
type Either = HasName | HasAge;
```

An intersection of object types has *more* properties because it's a *smaller* set of values (only values satisfying both). Keep the set picture in mind and this stops being confusing.

### 1.3 Typing is structural, not nominal

In languages like Java or C#, a value has type `Point` only if it was created as a `Point`. TypeScript is **structural**: a value matches a type if it has the right shape, regardless of where it came from.

```ts
type Point = { x: number; y: number };

class Coordinate {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

const p: Point = new Coordinate(1, 2); // ✅ same shape, so compatible

const point3d = { x: 1, y: 2, z: 3 };
const q: Point = point3d; // ✅ extra properties are fine when assigning an existing value
```

Structural typing matches how JavaScript is actually written (duck typing), but it has consequences you'll see throughout this guide:

- Objects can carry extra properties you didn't declare, which is why `Object.keys(obj)` returns `string[]` instead of `(keyof T)[]` (Chapter 10).
- Two types with the same shape are interchangeable, so a `UserId` string and an `OrderId` string can be mixed up unless you use branded types (Chapter 23).

### 1.4 Checking and running are separate steps

TypeScript does two independent jobs:

1. **Type-checking**: analyzing your code for type errors.
2. **Transpiling**: stripping types to produce JavaScript.

Modern tooling separates these. Bundlers like esbuild, test runners like Vitest, and Node.js itself (Chapter 2) strip types **without checking them**, because checking is slow and stripping is nearly free. This means your code can run even when it has type errors.

The professional workflow is therefore:

- Editors check continuously as you type.
- Your build or dev server strips types quickly.
- CI runs `tsc --noEmit` (type-check only) and fails the pipeline on any error.

If nothing in your pipeline runs `tsc`, type errors can reach production.

### 1.5 The compiler changed; the language didn't

In 2026 the TypeScript compiler was rewritten:

- **TypeScript 6.0** (March 2026) was the last release of the original JavaScript-based compiler. It modernized defaults and deprecated legacy options.
- **TypeScript 7.0** (July 2026) is a native port written in Go, typically 8–12x faster on full builds, with parsing, checking, and emitting done in parallel. The type system is the same; options deprecated in 6.0 are now hard errors.

This guide targets TypeScript 7. As a code author, the *language* is identical to 6.0: what changed is speed, defaults, and which legacy options still exist. One practical caveat: TypeScript 7.0 ships without a stable programmatic API (expected in 7.1), so tools that use the compiler as a library, most notably typescript-eslint, still run on a TypeScript 6 installation for now. Chapter 29 covers how teams set that up.

### Key Takeaways

- Types are erased. Anything from outside your program must be validated at runtime.
- Think of types as sets of values; assignability means "subset of".
- TypeScript is structural: shape matters, not origin.
- Type-checking and running are separate. Always run `tsc --noEmit` in CI.
- TypeScript 7 is a faster compiler for the same language.

---

## 2. Getting Started

This chapter gets you from an empty folder to running and type-checking TypeScript on Node.js 24, with as little configuration as possible. Chapter 15 explains every option in depth once you've seen the features they control.

### 2.1 Installing

```bash
npm install -D typescript@^7 @types/node@^24
npx tsc --init
```

- TypeScript 7 installs from the regular `typescript` package, and `tsc` is the native compiler.
- Keep the `@types/node` major version equal to your Node.js major version (24). A newer type package describes APIs your runtime may not have.
- Install other `@types/*` packages only for libraries that don't ship their own types. Most modern libraries do.

> **One caveat about TypeScript 7.** Tools that use TypeScript as a library, most notably typescript-eslint, still need a TypeScript 6 installation until TypeScript 7.1 ships a stable programmatic API. You don't need it to follow Parts I–IV; Chapter 29 shows the setup.

### 2.2 Ways to run TypeScript

| Approach | Type-checks? | Typical use |
|---|---|---|
| `node src/main.ts` (type stripping) | No | Services, scripts, and CLIs on Node.js 24 |
| `tsc` (emit `.js` files) | Yes | Building libraries and services into `dist/` |
| `tsc --noEmit` | Yes (no output) | CI and pre-commit type-checking |
| `tsx` | No | Running TypeScript that uses non-erasable syntax, with watch mode |
| Bundler (esbuild, Rollup) | No | Bundled deployments, e.g. serverless functions |

**Node.js type stripping.** Node.js runs `.ts` files directly by replacing TypeScript syntax with whitespace. It was enabled by default in v23.6, stopped printing an experimental warning in v24.3, and has been marked **stable** since v24.12. Things to know:

- It **doesn't type-check**. A file full of type errors runs anyway.
- It **ignores `tsconfig.json`**. Node's own rules apply: ES modules vs CommonJS is decided by `package.json` `"type"` and the file extension (`.ts`, `.mts`, `.cts`), and relative imports need full file extensions.
- Because types are replaced with whitespace, line and column numbers are preserved, so stack traces point at the right place without source maps.
- It **refuses `.ts` files inside `node_modules`**, so published packages must ship JavaScript (Chapter 31).
- Type-only imports **must** use `import type`. Otherwise Node treats them as value imports, which fail at runtime.
- It only supports **erasable syntax**, described next.

### 2.3 Erasable syntax

Erasable syntax is TypeScript that can be deleted to leave valid JavaScript: annotations, `type`, `interface`, generics, `as`, `satisfies`, `import type`, and so on. The TypeScript documentation lists exactly which TypeScript-specific constructs are **not** erasable, because they have runtime behavior:

- `enum` declarations
- namespaces and modules with runtime code
- parameter properties in classes
- non-ECMAScript `import =` and `export =` assignments
- `<prefix>`-style type assertions

```ts
import foo = require("foo");          // ❌ import ... = require(...) alias

namespace container {                 // ❌ namespace with runtime code
  foo.method();
  export type Bar = string;
}

import Bar = container.Bar;           // ❌ import = alias

class Point {
  constructor(public x: number, public y: number) {} // ❌ parameter properties
}

export = Point;                       // ❌ export = assignment

enum Direction { Up, Down }           // ❌ enum declaration

const num = <number>1;                // ❌ <prefix>-style assertion (write `1 as number`)
```

The `erasableSyntaxOnly` compiler option turns each of these into a compile error, so you find out in your editor instead of when Node refuses to run the file. Pair it with `verbatimModuleSyntax`, which makes type-only imports explicit and disables import elision (Chapter 13).

One thing that is *not* on the list: **decorators**. They're ECMAScript syntax (a TC39 proposal), not TypeScript-specific syntax, so `erasableSyntaxOnly` doesn't flag them. But V8 in Node.js 24 doesn't implement decorators, so a file that uses them fails to parse under type stripping. Code with decorators always needs a compile step (Chapter 12).

Node.js also has an `--experimental-transform-types` flag that generates code for enums, namespaces, and parameter properties. Don't build on it. The modern standard is to **write erasable TypeScript everywhere**: it runs directly on Node.js, works with every fast transpiler, and keeps TypeScript a pure type layer over JavaScript. This guide follows that standard and shows the erasable alternative for each non-erasable feature (Chapters 12 and 14).

### 2.4 A minimal tsconfig

```jsonc
{
  "compilerOptions": {
    // What exists at runtime: Node.js 24
    "target": "es2025",
    "lib": ["es2025", "esnext.disposable"],
    "types": ["node"],

    // How modules work: exactly like Node.js
    "module": "nodenext",
    "verbatimModuleSyntax": true,
    "erasableSyntaxOnly": true,
    "rewriteRelativeImportExtensions": true,

    // How strict the checker is
    "strict": true,
    "noUncheckedIndexedAccess": true,

    // tsc only checks; Node runs the sources
    "noEmit": true,
    "skipLibCheck": true
  },
  "include": ["src", "test"]
}
```

This mirrors the configuration the Node.js documentation recommends for type stripping, plus the two strictness options every project should have. In brief:

- **`target`, `lib`, `types`** tell TypeScript which JavaScript features and global APIs exist. Node.js 24 supports the ES2025 feature set; `esnext.disposable` adds the types for `using` declarations (Chapter 24). `types: ["node"]` loads `@types/node`, because since TypeScript 6.0 no global type packages are loaded unless you list them.
- **`module: "nodenext"`** makes TypeScript resolve imports exactly the way Node.js does.
- **`verbatimModuleSyntax` and `erasableSyntaxOnly`** guarantee that what you write can be stripped safely.
- **`rewriteRelativeImportExtensions`** lets you write `.ts` in relative imports (see below).
- **`strict` and `noUncheckedIndexedAccess`** turn on the checks this guide assumes. `strict` is the default since TypeScript 6.0; writing it documents intent.
- **`noEmit`** means `tsc` only type-checks. If you later compile to `dist/`, see Appendix A.1.

Chapter 15 covers each option, and the stricter flags you'll want for production code, in depth.

### 2.5 Imports and file extensions

Under `"module": "nodenext"`, relative imports must include the file extension, because Node.js requires it at runtime:

```ts
import { parse } from "./parser";     // ❌ Node can't resolve this
import { parse } from "./parser.ts";  // ✅ the real source file
```

With `rewriteRelativeImportExtensions`, the same import works both when Node runs your sources and when `tsc` compiles them, because `tsc` rewrites `./parser.ts` to `./parser.js` in its output.

You'll also see projects write `./parser.js` in TypeScript source, naming the *output* file. That's correct for projects that are only ever compiled, but it doesn't work under type stripping, where no `.js` file exists. Pick one convention per project and let your linter enforce it; this guide uses `.ts`.

### 2.6 The everyday workflow

```jsonc
// package.json
{
  "type": "module",
  "engines": { "node": ">=24.12" },
  "scripts": {
    "dev": "node --watch src/main.ts",
    "start": "node src/main.ts",
    "typecheck": "tsc",
    "test": "vitest run"
  }
}
```

- Your **editor** type-checks continuously as you type.
- **Node** runs your sources directly, so there's no build step in development.
- **CI** runs `npm run typecheck` (which is `tsc` with `noEmit` from the config) and fails the pipeline on any error. With TypeScript 7 this is fast enough to also run in a pre-commit hook.

If nothing in your pipeline runs `tsc`, type errors reach production.

Running sources directly in production is a legitimate choice on Node.js 24. Compiling to `dist/` (Appendix A.1) is still common: it gives you an immutable build artifact, skips the stripping step at startup, and is required if you publish declaration files.

### Key Takeaways

- Install `typescript@^7` and the `@types/node` major that matches your runtime.
- Node.js 24 runs erasable TypeScript directly; it doesn't type-check and ignores `tsconfig.json`.
- The non-erasable constructs are `enum`, namespaces with runtime code, parameter properties, `import =`/`export =`, and `<T>`-style assertions. `erasableSyntaxOnly` rejects them.
- Decorators aren't flagged by `erasableSyntaxOnly`, but Node.js 24 can't run them.
- Write `.ts` in relative imports and enable `rewriteRelativeImportExtensions`.
- Always run `tsc` in CI.

---

## 3. Everyday Types and Inference

### 3.1 Primitive types

```ts
const title: string = "TypeScript";
const count: number = 42;
const big: bigint = 9_007_199_254_740_993n;
const done: boolean = false;
const key: symbol = Symbol("key");
const nothing: null = null;
const missing: undefined = undefined;
```

Always use the lowercase names. The capitalized `String`, `Number`, and `Boolean` refer to JavaScript's wrapper objects, which you essentially never want:

```ts
const bad: String = "hi";   // ❌ wrapper object type
const good: string = "hi";  // ✅ primitive type
```

### 3.2 Arrays and tuples

Two equivalent array syntaxes exist:

```ts
const ids: number[] = [1, 2, 3];
const names: Array<string> = ["Ada", "Linus"];
```

Most codebases use `T[]` for simple element types and `Array<T>` when the element type is complex, e.g. `Array<string | number>` reads better than `(string | number)[]`. Pick one convention and let the linter enforce it (`@typescript-eslint/array-type`).

A **tuple** is an array with a fixed length and a known type at each position:

```ts
const entry: [string, number] = ["age", 30];

// Named members document meaning; they don't change behavior
type Range = [start: number, end: number];

// Optional and rest elements
type Args = [command: string, ...flags: string[]];
type Point = [x: number, y: number, z?: number];
```

Tuples shine for small, positional return values:

```ts
function parseAddress(address: string): [host: string, port: number] {
  const [host = "localhost", port = "80"] = address.split(":");
  return [host, Number(port)];
}

const [host, port] = parseAddress("db.internal:5432");
```

When a tuple has more than two or three positions, or positions with the same type that are easy to swap, return an object instead. `{ start, end }` can't be accidentally reversed; `[start, end]` can.

### 3.3 Type inference: let TypeScript do the work

TypeScript infers types from values. You don't need to annotate everything:

```ts
const port = 8080;            // ^? 8080 (literal type, since const can't change)
let retries = 3;              // ^? number
const tags = ["a", "b"];      // ^? string[]
const user = { id: 1, name: "Ada" };
//    ^? { id: number; name: string }

const doubled = [1, 2, 3].map((n) => n * 2); // ^? number[]
```

Over-annotating is noise and can even make types worse (less precise):

```ts
const port: number = 8080;  // ❌ redundant, and loses the literal type 8080
const port2 = 8080;         // ✅
```

**Where to annotate** — the widely accepted guideline is: *annotate boundaries, infer internals.*

- **Function parameters**: always (they can't be inferred, except in callbacks).
- **Return types of exported functions and public methods**: recommended. An explicit return type is a contract: if you accidentally change what the function returns, the error appears in the function, not in some distant caller. It also speeds up type-checking and is required by `isolatedDeclarations` (Chapter 33).
- **Local variables**: let them be inferred, unless inference produces the wrong type (e.g., an empty array or a value initialized later).

```ts
// Empty arrays need help
const queue: string[] = [];

// Variables assigned later need help
let timer: ReturnType<typeof setTimeout> | undefined;
```

### 3.4 Contextual typing

Inference also flows *into* expressions from where they're used. Callback parameters get their types from the function receiving them:

```ts
const words = ["hello", "world"];

words.forEach((w) => {
  //           ^? string — inferred from the array's element type
  console.log(w.toUpperCase());
});

process.on("exit", (code) => {
  //                ^? number
  console.log(`Exiting with code ${code}`);
});
```

Don't annotate callback parameters that are already contextually typed. It's redundant and can hide mismatches.

### 3.5 Literal types and widening

A **literal type** is a type with exactly one value: `"GET"`, `404`, `true`.

```ts
type Method = "GET" | "POST" | "PUT" | "DELETE";

function request(method: Method, url: string) { /* ... */ }

request("GET", "/users");    // ✅
request("FETCH", "/users");  // ❌ not assignable to Method
```

TypeScript decides between the literal type and the general type through **widening**:

```ts
const a = "GET";          // ^? "GET"   — const can never change
let b = "GET";            // ^? string  — let can be reassigned to any string

const config = { method: "GET" };
//    ^? { method: string }  — object properties are mutable, so they widen
```

That last one causes a classic error:

```ts
const config = { method: "GET", url: "/users" };
request(config.method, config.url);
// ❌ Argument of type 'string' is not assignable to parameter of type 'Method'
```

The fixes, from most to least preferred:

```ts
// 1. Annotate the object with a type that has the literal
const config1: { method: Method; url: string } = { method: "GET", url: "/users" };

// 2. Use `as const` to make the whole object deeply readonly and literal
const config2 = { method: "GET", url: "/users" } as const;
//    ^? { readonly method: "GET"; readonly url: "/users" }

// 3. Use `satisfies` to check against a type while keeping literal inference (Chapter 4)
const config3 = { method: "GET", url: "/users" } satisfies { method: Method; url: string };
```

### Key Takeaways

- Use lowercase primitive types; never `String`, `Number`, `Boolean`, or `Object`.
- Use tuples for short positional data; objects when meaning matters.
- Annotate boundaries (parameters, exported return types); let inference handle internals.
- Understand widening: `const` keeps literal types, `let` and object properties widen.

---

## 4. Assertions, as const, and satisfies

There are four ways to connect a value with a type. They look similar and behave very differently.

| Syntax | What it does | Checked? |
|---|---|---|
| `const x: T = value` | Annotation: `x` has type `T`; `value` must be assignable to `T` | ✅ |
| `value satisfies T` | Checks `value` is assignable to `T`, but keeps the inferred type | ✅ |
| `value as const` | Infers the narrowest literal, deeply readonly type | ✅ (no target type) |
| `value as T` | Assertion: "treat this as `T`" | ⚠️ barely |

### 4.1 Annotation vs `satisfies`

An annotation **replaces** the inferred type with the annotated one. Sometimes that loses information:

```ts
type Theme = Record<string, string>;

const theme: Theme = {
  primary: "#0055ff",
  danger: "#ff3344",
};

theme.primary;  // string | undefined (with noUncheckedIndexedAccess) — we lost the known keys
theme.primray;  // no error! Record<string, ...> allows any key
```

`satisfies` **checks** the value against the type but keeps the precise inferred type:

```ts
const theme2 = {
  primary: "#0055ff",
  danger: "#ff3344",
} satisfies Theme;

theme2.primary; // ✅ string — known key, no undefined
theme2.primray; // ❌ property doesn't exist
```

`satisfies` is ideal for configuration objects, lookup tables, and route maps: you want validation against a contract *and* precise types for consumers.

```ts
type RouteConfig = Record<string, { path: string; auth: boolean }>;

export const routes = {
  home: { path: "/", auth: false },
  dashboard: { path: "/dashboard", auth: true },
  settings: { path: "/settings", auth: true },
} satisfies RouteConfig;

type RouteName = keyof typeof routes; // "home" | "dashboard" | "settings" (keyof and typeof: Chapter 10)
```

### 4.2 `as const`

`as const` makes TypeScript infer the narrowest type: literal types, readonly properties, and readonly tuples instead of arrays:

```ts
const sizes = ["sm", "md", "lg"];           // string[]
const sizes2 = ["sm", "md", "lg"] as const; // readonly ["sm", "md", "lg"]
```

`as const satisfies T` combines both: literal inference plus a contract check.

```ts
const PERMISSIONS = {
  admin: ["read", "write", "delete"],
  viewer: ["read"],
} as const satisfies Record<string, readonly ("read" | "write" | "delete")[]>;

type AdminPermission = (typeof PERMISSIONS)["admin"][number]; // "read" | "write" | "delete"
```

### 4.3 Type assertions with `as`

`as` tells the compiler to treat a value as a different type. It only allows assertions where the types overlap (one is assignable to the other), but within that rule it doesn't check anything:

```ts
const body = request.body as CreateUserInput; // trusts you; nothing checked the request body
const n = "hello" as number;                // ❌ types don't overlap
const n2 = "hello" as unknown as number;    // compiles — and is almost always a bug
```

`as unknown as T` (a double assertion) bypasses every check. In a code review, treat it as a red flag that needs a strong justification.

You may also see the older angle-bracket form, `<CreateUserInput>request.body`. It means the same as `as`, but it's TypeScript-only syntax with no JavaScript equivalent, so `erasableSyntaxOnly` rejects it (Chapter 2). Always use `as`.

**Legitimate uses** of `as`:

- Narrowing after you've performed a check TypeScript can't follow.
- Test code constructing partial fixtures.
- Interfacing with poorly typed libraries.

**Prefer instead**:

- An `instanceof` check when the value is a class instance, such as `error instanceof HttpError`.
- Narrowing with type guards.
- Runtime validation for external data (Chapter 22).
- `satisfies` when you just want a check.

### Key Takeaways

- Annotation sets the type; `satisfies` checks against a type while preserving inference.
- `as const` infers literal, readonly types; `as const satisfies T` adds a contract check.
- `as` is an unchecked assertion; `as unknown as T` is a red flag.
- Reach for `satisfies` and narrowing before `as`.
- Never use `<T>value` assertions; `erasableSyntaxOnly` rejects them.

---

## 5. The Special Types: any, unknown, never, void, null, undefined

These types sit at the edges of the type system. Understanding them precisely separates people who fight TypeScript from people who use it well.

### 5.1 `any`: turning the type checker off

`any` means "don't check this". A value of type `any` can be assigned to anything and anything can be done with it:

```ts
let value: any = "hello";
value.foo.bar();       // compiles, crashes at runtime
const n: number = value; // compiles, now a "number" holds a string
```

The real danger is that `any` is **contagious**. It spreads silently through your code:

```ts
const data = JSON.parse(text);  // JSON.parse returns any
const user = data.user;         // any
const age = user.age + 1;       // any — every type error from here on is invisible
```

Common sources of hidden `any`:

- `JSON.parse(...)`
- `await response.json()` (returns `Promise<any>`)
- Untyped third-party libraries
- `catch (e)` in non-strict configurations (strict makes it `unknown`)

Under `strict`, `noImplicitAny` stops you from accidentally *writing* untyped parameters, but explicit `any` and `any` returned from APIs still get through. The linter (Chapter 29) catches these with the `no-unsafe-*` rules.

> **Standard:** treat `any` as a code smell that requires a justification comment. In application code there is almost always a better option.

### 5.2 `unknown`: the safe alternative

`unknown` also accepts every value, but you can't *do* anything with it until you prove what it is:

```ts
function parseJson(text: string): unknown {
  return JSON.parse(text);
}

const result = parseJson('{"name":"Ada"}');

result.name;             // ❌ 'result' is of type 'unknown'

if (typeof result === "object" && result !== null && "name" in result) {
  console.log(result.name); // ✅ narrowed
}
```

Use `unknown` whenever a value's type isn't known yet: parsed JSON, `catch` variables, message payloads, user input. Then narrow it with checks (Chapter 8) or a validation library (Chapter 22).

`any` says "trust me". `unknown` says "prove it". Prefer `unknown`.

### 5.3 `never`: the impossible type

`never` is the empty set: no value has type `never`. It shows up in three places.

**Functions that never return** (they throw or loop forever):

```ts
function fail(message: string): never {
  throw new Error(message);
}
```

**Exhaustiveness checks**, where `never` proves you handled every case (covered fully in Chapter 8):

```ts
type Status = "active" | "suspended";

function label(status: Status): string {
  switch (status) {
    case "active": return "Active";
    case "suspended": return "Suspended";
    default: {
      const unreachable: never = status; // ✅ errors if a new Status is added but not handled
      throw new Error(`Unhandled status: ${String(unreachable)}`);
    }
  }
}
```

**Impossible combinations**, which collapse to `never`:

```ts
type Impossible = string & number; // ^? never — no value is both
```

### 5.4 `void`: "the return value doesn't matter"

`void` is the return type of functions that don't return a meaningful value:

```ts
function log(message: string): void {
  console.log(message);
}
```

A subtle but important rule: a **function type** returning `void` accepts functions that return something. The caller simply promises to ignore the result:

```ts
const results: number[] = [];

// forEach expects (value) => void, but push returns a number. That's allowed.
[1, 2, 3].forEach((n) => results.push(n));
```

This is deliberate: it lets you pass existing functions as callbacks without wrappers.

Use `void` for return types, and `undefined` when you mean the actual value `undefined` (e.g., `string | undefined`).

### 5.5 `null` and `undefined`

With `strictNullChecks` (part of `strict`), `null` and `undefined` are separate types that must be handled explicitly:

```ts
function findUser(id: number): User | undefined {
  return users.find((u) => u.id === id);
}

const user = findUser(1);
user.name;            // ❌ 'user' is possibly 'undefined'
user?.name;           // ✅ optional chaining → string | undefined
user?.name ?? "Guest"; // ✅ nullish coalescing → string
```

Use `??` instead of `||` for defaults: `||` also replaces `0`, `""`, and `false`, which are often valid values.

```ts
const pageSize = options.pageSize || 20; // ❌ pageSize 0 becomes 20
const pageSize2 = options.pageSize ?? 20; // ✅ only null/undefined become 20
```

**`null` or `undefined`?** A common team convention:

- Use `undefined` for "absent" inside your code. It's what JavaScript itself uses for missing properties, unset parameters, and `Array.prototype.find`.
- Use `null` where an external contract uses it: JSON APIs, SQL `NULL` columns, and libraries whose APIs return `null`.

Consistency matters more than which one you choose.

### 5.6 The non-null assertion `!`

`value!` tells TypeScript "this isn't null or undefined, trust me". It's an unchecked assertion: if you're wrong, you get a runtime crash with no warning.

```ts
const handler = handlers.get(eventType)!; // crashes later if no handler is registered
```

Prefer code that proves the value exists:

```ts
const handler = handlers.get(eventType);
if (!handler) throw new Error(`No handler registered for ${eventType}`);
handler(payload); // ✅ narrowed: no longer undefined
```

Reserve `!` for cases where an invariant is guaranteed but TypeScript can't see it, and leave a comment explaining why.

### 5.7 `object`, `{}`, and `Object`

These look similar and mean different things:

| Type | Meaning |
|---|---|
| `object` | any non-primitive value (objects, arrays, functions) |
| `{}` | any value except `null` and `undefined` — including strings and numbers! |
| `Object` | almost the same as `{}`; avoid |

```ts
const a: {} = "hello";  // ✅ surprising but true
const b: object = "hi"; // ❌ strings are primitives
```

For "some object with unknown keys", use `Record<string, unknown>`. For "any non-nullish value", use `NonNullable<unknown>` or just `{}` deliberately. Never use `Object`.

### Key Takeaways

- `any` disables checking and spreads; avoid it and catch it with linting.
- `unknown` is the safe "I don't know yet" type; narrow before use.
- `never` represents impossibility and powers exhaustiveness checks.
- `void` is for return types; `undefined` is for values.
- Use `?.` and `??`; avoid `!` unless an invariant is truly guaranteed.

---

## 6. Object Types: type, interface, and Friends

### 6.1 Describing object shapes

You can describe an object shape with a type alias or an interface:

```ts
type User = {
  id: number;
  name: string;
  email?: string;               // optional
  readonly createdAt: Date;     // can't be reassigned after creation
};

interface Product {
  sku: string;
  price: number;
  tags?: string[];
}
```

- `?` makes a property optional: it may be absent.
- `readonly` prevents reassignment through this type. It's a compile-time guarantee only, and it's shallow: `readonly tags: string[]` stops `obj.tags = []` but not `obj.tags.push("x")` (Chapter 26 covers deep immutability).

### 6.2 Index signatures and `Record`

When keys aren't known ahead of time, use an index signature or `Record`:

```ts
type Scores = { [playerName: string]: number };
type Scores2 = Record<string, number>; // equivalent, more common

const scores: Scores2 = { ada: 10, linus: 7 };
```

With `noUncheckedIndexedAccess`, reading a dynamic key correctly returns `number | undefined`, because the key might not exist:

```ts
const s = scores["grace"];
//    ^? number | undefined
```

`Record` is also great with a union of known keys, where it requires every key to be present:

```ts
type Locale = "en" | "tr" | "de";

const greetings: Record<Locale, string> = {
  en: "Hello",
  tr: "Merhaba",
  de: "Hallo",
}; // ❌ if any locale is missing
```

> If you're using an object as a dynamic dictionary that changes at runtime (adding and removing keys), prefer a `Map<K, V>`. It has clear semantics, preserves insertion order, accepts any key type, and doesn't collide with prototype properties.

### 6.3 Excess property checks

Structural typing allows extra properties, *except* when you write an object literal directly where a type is expected. This "freshness" check catches typos:

```ts
type Options = { timeout?: number; retries?: number };

const opts: Options = { timeout: 1000, retrys: 3 };
// ❌ Object literal may only specify known properties. Did you mean 'retries'?
```

But the check only applies to fresh literals:

```ts
const raw = { timeout: 1000, retrys: 3 };
const opts2: Options = raw; // ✅ no error — raw isn't a fresh literal
```

This is why it helps to annotate or use `satisfies` at the point where an object is created.

### 6.4 Methods: prefer property syntax

There are two ways to declare a function member:

```ts
interface Handlers {
  onConnect(socket: Socket): void;   // method syntax
  onMessage: (data: Buffer) => void; // property syntax
}
```

They look equivalent, but they're checked differently. Under `strictFunctionTypes`, **property syntax** parameters are checked soundly (contravariantly). **Method syntax** parameters are checked *bivariantly* for backward compatibility, which lets some unsafe assignments through:

```ts
interface Animal { name: string }
interface Dog extends Animal { bark(): void }

interface MethodStyle { handle(a: Animal): void }
interface PropertyStyle { handle: (a: Animal) => void }

const dogOnly = (d: Dog) => d.bark();

const m: MethodStyle = { handle: dogOnly };   // compiles — but will crash if given a Cat
const p: PropertyStyle = { handle: dogOnly }; // ❌ correctly rejected
```

Prefer property syntax in interfaces and types you write (enforceable with `@typescript-eslint/method-signature-style`). Classes still use normal method syntax, which is fine.

### 6.5 Extending and combining types

Interfaces extend; type aliases intersect:

```ts
interface Entity {
  id: string;
  createdAt: Date;
}

interface Customer extends Entity {
  name: string;
}

type Order = Entity & {
  total: number;
};
```

Conflicting properties behave differently. `extends` reports an error at the declaration; `&` silently produces `never`:

```ts
interface A { id: string }
interface B extends A { id: number } // ❌ clear error right here

type C = { id: string } & { id: number };
// No error, but C["id"] is `never`, so no value can ever satisfy C
```

### 6.6 `type` vs `interface`: which to use?

| Capability | `interface` | `type` |
|---|---|---|
| Object shapes | ✅ | ✅ |
| Unions, tuples, primitives, mapped and conditional types | ❌ | ✅ |
| `extends` with conflict errors | ✅ | (via `&`, silent `never`) |
| Declaration merging (reopening) | ✅ | ❌ |
| `implements` by classes | ✅ | ✅ (for object types) |
| Assignable to `Record<string, …>` (implicit index signature) | ❌ | ✅ |

**Implicit index signatures** are a difference that bites in practice. A `type` alias for an object literal type is assignable to `Record<string, unknown>`; an `interface` is not, because an interface could later be augmented with members the index signature doesn't allow:

```ts
type PointT = { x: number; y: number };
interface PointI { x: number; y: number }

declare const t: PointT;
declare const i: PointI;

const a: Record<string, unknown> = t; // ✅
const b: Record<string, unknown> = i; // ❌ Index signature for type 'string' is missing in type 'PointI'
```

You'll meet this with generic constraints like `T extends Record<string, unknown>`. If a generic only needs "some object type", constrain it with `T extends object`, which accepts both (Chapter 17 has an example).

**Declaration merging** means two `interface` declarations with the same name merge into one. It's essential for augmenting third-party types (Chapter 13), but surprising if it happens by accident.

**Performance**: the TypeScript team's performance guidance recommends interfaces with `extends` over large intersections, because the compiler caches interface relationships. This matters in big codebases.

A practical, widely used convention:

- Use **`interface`** for object shapes, especially public contracts that may be extended or implemented.
- Use **`type`** for everything else: unions, tuples, function types, mapped and conditional types, and aliases.

Some teams use `type` everywhere for consistency, which is also fine. What matters is consistency, enforced by `@typescript-eslint/consistent-type-definitions`.

### Key Takeaways

- Use `?` for optional and `readonly` for non-reassignable properties (shallow).
- Use `Record<K, V>` for keyed objects; prefer `Map` for dynamic dictionaries.
- Excess property checks only apply to fresh object literals.
- Prefer property syntax (`fn: () => void`) for function members in types.
- `interface` for object contracts, `type` for unions and type-level composition — or one consistently.
- Interfaces aren't assignable to `Record<string, …>`; constrain generics with `object` when both should work.

---

## 7. Functions

### 7.1 Parameter and return types

```ts
function calculateTotal(items: readonly CartItem[], taxRate: number): number {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return subtotal * (1 + taxRate);
}

const formatPrice = (amount: number, currency = "USD"): string =>
  new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
```

Note `readonly CartItem[]` in the parameter: it tells callers this function won't mutate their array, and it accepts both mutable and readonly arrays. Prefer `readonly` array parameters for functions that only read.

### 7.2 Optional, default, and rest parameters

```ts
function connect(host: string, port?: number): void {}      // port: number | undefined
function connect2(host: string, port = 5432): void {}       // port: number (default applied)
function sum(...values: number[]): number {
  return values.reduce((a, b) => a + b, 0);
}
```

### 7.3 Prefer options objects over long parameter lists

Positional parameters become unreadable past two or three, especially booleans:

```ts
// ❌ What do true and false mean here?
createUser("ada@example.com", "Ada", true, false);

// ✅ Self-documenting, order-independent, easy to extend
type CreateUserOptions = {
  email: string;
  name: string;
  isAdmin?: boolean;
  sendWelcomeEmail?: boolean;
};

function createUser({ email, name, isAdmin = false, sendWelcomeEmail = true }: CreateUserOptions) {
  // ...
}

createUser({ email: "ada@example.com", name: "Ada", isAdmin: true });
```

### 7.4 Function types

```ts
type Comparator<T> = (a: T, b: T) => number;
type EventHandler = (event: { type: string; payload: unknown }) => void;

const byAge: Comparator<{ age: number }> = (a, b) => a.age - b.age;
```

When a function type also has properties, use a call signature:

```ts
type Counter = {
  (): number;      // callable
  reset: () => void;
  count: number;
};
```

### 7.5 Overloads

Overloads let one function have several distinct signatures:

```ts
function toArray(value: string): string[];
function toArray(value: number): number[];
function toArray(value: string | number): (string | number)[] {
  return [value];
}

const a = toArray("x"); // ^? string[]
const b = toArray(1);   // ^? number[]
```

The last signature (the **implementation signature**) is not visible to callers; only the overloads above it are.

Overloads are often overused. **Prefer a union or a generic when possible**, because they're simpler and compose better:

```ts
// ❌ Unnecessary overloads
function len(x: string): number;
function len(x: unknown[]): number;
function len(x: string | unknown[]): number { return x.length; }

// ✅ A union does the same job
function len2(x: string | readonly unknown[]): number {
  return x.length;
}
```

Use overloads when the **return type depends on the argument** in a way a union or a simple generic can't express cleanly, typically a small, closed set of distinct call shapes, such as `readConfig(path)` returning `Config` and `readConfig(path, { raw: true })` returning `string`. When the mapping is a lookup from a key to a type, a generic over a lookup type (`get<K extends keyof Settings>(key: K): Settings[K]`) is usually cleaner than a stack of overloads.

### 7.6 Type predicates: custom type guards

A function returning `value is T` teaches TypeScript how to narrow:

```ts
type Cat = { kind: "cat"; meow: () => void };
type Dog = { kind: "dog"; bark: () => void };

function isCat(pet: Cat | Dog): pet is Cat {
  return pet.kind === "cat";
}

function speak(pet: Cat | Dog) {
  if (isCat(pet)) {
    pet.meow(); // ✅ pet: Cat
  } else {
    pet.bark(); // ✅ pet: Dog
  }
}
```

The predicate is a promise *you* make. TypeScript doesn't verify that the body actually checks what it claims, so keep guards small and obviously correct.

Since TypeScript 5.5, simple guards are **inferred** automatically, which finally makes `filter` work as expected:

```ts
const values = [1, undefined, 2, undefined, 3];

const numbers = values.filter((v) => v !== undefined);
//    ^? number[]   (before TS 5.5 this was (number | undefined)[])
```

### 7.7 Assertion functions

An assertion function throws if a condition fails, and narrows afterwards:

```ts
function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function assertIsString(value: unknown): asserts value is string {
  if (typeof value !== "string") throw new TypeError(`Expected string, got ${typeof value}`);
}

function handle(input: unknown) {
  assertIsString(input);
  input.toUpperCase(); // ✅ input: string from here on
}
```

These are useful for invariants and test helpers. One gotcha: TypeScript requires every name in an assertion call to have an explicit type annotation. Declare assertion functions with `function`, or give an arrow function's variable an explicit type:

```ts
// ❌ Calling this errors: "Assertions require every name in the call target
//    to be declared with an explicit type annotation."
const assertPositive = (n: number): asserts n => { if (n <= 0) throw new Error(); };

// ✅ Explicitly typed variable
const assertPositive2: (n: number) => asserts n = (n) => {
  if (n <= 0) throw new Error("Expected a positive number");
};
```

### 7.8 The `this` parameter

You can declare what `this` must be with a fake first parameter, which is erased at compile time:

```ts
type Counter = { count: number };

function increment(this: Counter, by: number): void {
  this.count += by;
}

const counter: Counter = { count: 0 };
increment.call(counter, 1); // ✅
increment(1);               // ❌ The 'this' context of type 'void' is not assignable to method's 'this' of type 'Counter'
```

In modern code, arrow functions and classes make this rare, but you'll see it in library types.

### Key Takeaways

- Annotate parameters; annotate return types of exported functions.
- Use `readonly T[]` for array parameters you don't mutate.
- Use options objects instead of long or boolean parameter lists.
- Prefer unions and generics over overloads; use overloads when the return type depends on the input.
- Use type predicates and assertion functions to teach TypeScript about your checks.

---

## 8. Unions and Narrowing

Unions plus narrowing are the heart of everyday TypeScript. Master this chapter and you'll write safer code than most TypeScript users.

### 8.1 Control flow analysis

TypeScript tracks how a value's possible type changes as code executes. Each check removes possibilities:

```ts
function format(value: string | number | null): string {
  if (value === null) {
    return "—";
  }
  // value: string | number

  if (typeof value === "number") {
    return value.toFixed(2);
    // value: number
  }

  return value.trim();
  // value: string
}
```

This is called **narrowing**. You write ordinary JavaScript checks, and TypeScript understands them.

### 8.2 Narrowing techniques

**`typeof`** for primitives:

```ts
if (typeof x === "string") { /* string */ }
if (typeof x === "function") { /* callable */ }
```

Remember `typeof null === "object"`. Always check `x !== null` alongside `typeof x === "object"`.

**Truthiness**:

```ts
function greet(name?: string) {
  if (name) {
    return `Hi ${name}`; // string
  }
  return "Hi there";
}
```

Be careful: truthiness also excludes `0`, `""`, `NaN`, and `false`. For numbers and strings where those are valid, compare against `undefined` or `null` explicitly.

**Equality**:

```ts
function compare(a: string | number, b: string | boolean) {
  if (a === b) {
    // both must be string here
    a.toUpperCase();
  }
}
```

**`in`** for checking property existence:

```ts
type Fish = { swim: () => void };
type Bird = { fly: () => void };

function move(animal: Fish | Bird) {
  if ("swim" in animal) {
    animal.swim();
  } else {
    animal.fly();
  }
}
```

**`instanceof`** for classes:

```ts
function describe(value: Date | string) {
  return value instanceof Date ? value.toISOString() : value;
}
```

**`Array.isArray`**:

```ts
function normalize(input: string | readonly string[]): readonly string[] {
  return Array.isArray(input) ? input : [input];
}
```

### 8.3 Discriminated unions

A **discriminated union** is a union of object types that share a literal property (the *discriminant*, often called `kind`, `type`, or `status`). Checking that property narrows to exactly one member:

```ts
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "rectangle"; width: number; height: number }
  | { kind: "triangle"; base: number; height: number };

function area(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;       // shape: circle variant
    case "rectangle":
      return shape.width * shape.height;        // shape: rectangle variant
    case "triangle":
      return (shape.base * shape.height) / 2;   // shape: triangle variant
  }
}
```

Discriminated unions are the single most important modeling tool in TypeScript. Compare these two ways of modeling an async request:

```ts
// ❌ A bag of optionals: allows nonsense states
type RequestState = {
  isLoading: boolean;
  data?: User[];
  error?: Error;
};
// Is { isLoading: true, data: [...], error: someError } valid? The type says yes.

// ✅ A discriminated union: only valid states can exist
type RequestState2 =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: User[] }
  | { status: "error"; error: Error };

function render(state: RequestState2): string {
  switch (state.status) {
    case "idle":    return "Press load";
    case "loading": return "Loading…";
    case "success": return `${state.data.length} users`;   // data is guaranteed here
    case "error":   return `Failed: ${state.error.message}`; // error is guaranteed here
  }
}
```

The second version makes illegal states unrepresentable. You can't access `data` without first proving the request succeeded. This idea comes up again in Chapter 28.

### 8.4 Exhaustiveness checking

What happens when someone adds `{ kind: "hexagon"; side: number }` to `Shape`? Because `area` declares a `number` return type, TypeScript reports *Function lacks ending return statement and return type does not include 'undefined'*. That helps, but the error points at the signature rather than the missing case, and it disappears entirely if the function returns `void` or has a `default` branch. The robust approach is an explicit exhaustiveness check that names the missing case:

```ts
import { inspect } from "node:util";

function assertNever(value: never, message = "Unexpected value"): never {
  // inspect() never throws, unlike JSON.stringify (circular data, BigInt)
  throw new Error(`${message}: ${inspect(value)}`);
}

function area(shape: Shape): number {
  switch (shape.kind) {
    case "circle":    return Math.PI * shape.radius ** 2;
    case "rectangle": return shape.width * shape.height;
    case "triangle":  return (shape.base * shape.height) / 2;
    default:
      return assertNever(shape); // ❌ compile error if any variant is unhandled
  }
}
```

In the `default` branch, every handled variant has been narrowed away. If all cases are covered, `shape` is `never` and the call compiles. If a variant is missing, `shape` is that variant, which isn't assignable to `never`, so you get a compile error pointing at the exact spot to update.

A lighter variant uses `satisfies`:

```ts
default:
  shape satisfies never;
  throw new Error("Unreachable");
```

The linter rule `@typescript-eslint/switch-exhaustiveness-check` enforces this across a codebase.

### 8.5 Narrowing pitfalls

**Narrowing doesn't survive into callbacks for reassignable variables**, because the callback might run after a reassignment:

```ts
let current: string | undefined = getValue();

if (current) {
  setTimeout(() => {
    current.toUpperCase(); // ❌ 'current' is possibly 'undefined'
  });
}

current = undefined; // this later assignment is why the narrowing can't be trusted
```

Fixes: use `const`, or copy into a `const` inside the check (`const value = current;`). Since TypeScript 5.4, narrowing *is* preserved in closures when the variable isn't reassigned after the closure is created, so this mostly bites when a variable genuinely is reassigned later.

**Narrowing an object property is invalidated by mutation** that TypeScript can see, and by nothing it can't. TypeScript assumes function calls don't change properties it has narrowed, which is usually right but technically unsound. Don't rely on narrowed properties across code that mutates the object.

**`Array.isArray` narrows to `any[]`** when the input is `unknown`. Validate elements before trusting them:

```ts
function sumAll(input: unknown): number {
  if (Array.isArray(input) && input.every((x) => typeof x === "number")) {
    return input.reduce((a: number, b: number) => a + b, 0);
  }
  throw new TypeError("Expected an array of numbers");
}
```

### Key Takeaways

- TypeScript narrows types through normal JavaScript checks: `typeof`, `in`, `instanceof`, equality, truthiness.
- Discriminated unions are the primary tool for modeling states and variants.
- Use `assertNever` or `satisfies never` to make unhandled cases compile errors.
- Watch out for narrowing in callbacks and truthiness checks that exclude `0` or `""`.

### Exercises

1. Model a `PaymentResult` as a discriminated union: a successful payment has a `transactionId`; a declined one has a `reason` (`"insufficient_funds" | "card_expired" | "fraud_suspected"`); one that needs 3-D Secure has a `redirectUrl`. Write `describePayment(result)` with an exhaustiveness check.
2. Write a type guard `isNonEmptyString(value: unknown): value is string`. Then think about what happens in the `else` branch if the input type is `string | undefined`.

---

## 9. Type Compatibility and Variance

You've seen assignability as "is a subset of" (Chapter 1). This chapter makes that precise for functions and generic types, which is where most confusing error messages come from.

### 9.1 Assignability is checked structurally, member by member

When TypeScript checks whether `Source` is assignable to `Target`, it compares their members. For object types, every property the target requires must exist on the source with an assignable type. Extra properties on the source are fine (outside fresh object literals, Chapter 6).

```ts
interface Animal { name: string }
interface Dog extends Animal { bark: () => void }

const rex: Dog = { name: "Rex", bark: () => console.log("Woof") };
const animal: Animal = rex; // ✅ Dog has everything Animal requires
const dog: Dog = animal;    // ❌ Property 'bark' is missing
```

That rule is easy for plain objects. It gets interesting when the types appear *inside* other types: as function parameters, return types, or generic arguments.

### 9.2 Variance

**Variance** describes how assignability of a container type follows from assignability of the type inside it. With `Dog` assignable to `Animal`:

| Variance | Meaning | Example |
|---|---|---|
| **Covariant** | `F<Dog>` is assignable to `F<Animal>` (same direction) | return types, readonly properties, `readonly Dog[]` |
| **Contravariant** | `F<Animal>` is assignable to `F<Dog>` (opposite direction) | function parameters |
| **Invariant** | neither direction is safe | a mutable box you can both read and write |
| **Bivariant** | both directions allowed (unsound) | method-syntax parameters (Chapter 6) |

```ts
type Producer<T> = () => T;
type Consumer<T> = (value: T) => void;

declare let produceDog: Producer<Dog>;
declare let produceAnimal: Producer<Animal>;
produceAnimal = produceDog; // ✅ covariant: whoever expects an Animal is happy to get a Dog
produceDog = produceAnimal; // ❌ an Animal might not bark

declare let consumeAnimal: Consumer<Animal>;
declare let consumeDog: Consumer<Dog>;
consumeDog = consumeAnimal; // ✅ contravariant: a function that handles any Animal can handle a Dog
consumeAnimal = consumeDog; // ❌ it would be called with Cats too
```

The contravariant case feels backwards until you ask the right question: *who calls the function, and with what?* A `Consumer<Animal>` slot will be called with any animal, so only a function that accepts any animal is safe there.

This is exactly what `strictFunctionTypes` (part of `strict`) enforces for function-typed properties. Method-syntax members are exempt and checked bivariantly, which is why Chapter 6 recommends property syntax in your own types.

### 9.3 Function compatibility

Three more rules decide whether one function type is assignable to another:

**Fewer parameters are fine.** A function that ignores some arguments can be used where more are passed:

```ts
type Visitor = (value: string, index: number, all: readonly string[]) => void;

const logValue: Visitor = (value) => console.log(value); // ✅ ignoring extra arguments is safe
["a", "b"].forEach(logValue);
```

This is why you can pass `(x) => ...` to `map`, `forEach`, and event APIs that supply extra arguments.

**Return types are covariant.** A function returning `Dog` can stand in for one returning `Animal`. And a function returning *anything* can stand in for one returning `void`, because the caller promises to ignore the result (Chapter 5).

**Optional and rest parameters are compared loosely.** TypeScript treats an optional parameter in the target as compatible with a required one in the source, which is technically unsound but rarely bites in practice.

### 9.4 Arrays are covariant, and that's unsound

Mutable arrays should be invariant: you can both read from them and write to them. TypeScript makes them covariant anyway, for convenience:

```ts
const dogs: Dog[] = [rex];
const animals: Animal[] = dogs;   // ✅ allowed
animals.push({ name: "Tom" });    // compiles: Tom is an Animal...
dogs[1]?.bark();                  // 💥 runtime TypeError: bark is not a function
```

The fix is the same habit Chapter 7 recommends for other reasons: **accept `readonly T[]` in parameters** when you only read. A `readonly Animal[]` can't be pushed to, so covariance is safe:

```ts
function names(animals: readonly Animal[]): string[] {
  return animals.map((a) => a.name);
}

names(dogs); // ✅ safe: names() can't insert a non-dog into your array
```

### 9.5 Variance annotations: `in` and `out`

TypeScript normally *infers* the variance of a generic type by analyzing how its type parameter is used. Since TypeScript 4.7 you can declare it:

```ts
interface Source<out T> {        // covariant: T only comes out
  read: () => T;
}

interface Sink<in T> {           // contravariant: T only goes in
  write: (value: T) => void;
}

interface Channel<in out T> {    // invariant: both
  read: () => T;
  write: (value: T) => void;
}
```

TypeScript verifies that an annotation is consistent with how `T` is actually used, and reports an error if, say, an `out T` appears in a parameter position. Annotations document intent and can speed up checking of large recursive types. In application code you rarely need them; they matter mainly in libraries with complex generic types, or when an inferred variance is surprising and you want the compiler to hold the line.

### 9.6 Assignability vs comparability

Type assertions (`value as T`, Chapter 4) use a looser relation called **comparability**: the assertion is allowed if either type is assignable to the other, roughly. That's why `animal as Dog` compiles (a downcast is plausible), while `"hello" as number` doesn't (the types can't overlap). Comparability is about allowing plausible assertions, not proving them correct.

### Key Takeaways

- Assignability compares types member by member, structurally.
- Return types and readonly data are covariant; function parameters are contravariant.
- Fewer parameters are fine; any return type is fine where `void` is expected.
- Mutable arrays are covariant, which is unsound. Accept `readonly T[]` when you only read.
- `in`/`out` annotations declare variance explicitly; mostly a library tool.

---

# Part II — Building Abstractions

## 10. Type Operators: keyof, typeof, Indexed Access

### 10.1 `keyof`: the union of an object type's keys

```ts
type User = { id: number; name: string; email: string };

type UserKey = keyof User; // "id" | "name" | "email"

function pluck<T, K extends keyof T>(items: readonly T[], key: K): T[K][] {
  return items.map((item) => item[key]);
}

const emails = pluck(users, "email"); // ^? string[]
```

### 10.2 `typeof` in type position

In a type position, `typeof` gets the type of a *value*. This lets the value be the source of truth:

```ts
const defaultConfig = {
  apiUrl: "https://api.example.com",
  timeoutMs: 5000,
  retries: 3,
  features: { darkMode: true, beta: false },
};

type Config = typeof defaultConfig;
// { apiUrl: string; timeoutMs: number; retries: number; features: { darkMode: boolean; beta: boolean } }

function loadConfig(overrides: Partial<Config>): Config {
  return { ...defaultConfig, ...overrides };
}
```

Don't confuse it with the runtime `typeof x === "string"` operator. Same keyword, different context.

Combining them gives a pattern you'll use constantly:

```ts
const HTTP_STATUS = { ok: 200, notFound: 404, serverError: 500 } as const;

type StatusName = keyof typeof HTTP_STATUS;               // "ok" | "notFound" | "serverError"
type StatusCode = (typeof HTTP_STATUS)[StatusName];       // 200 | 404 | 500
```

### 10.3 Indexed access types

`T[K]` looks up the type of a property:

```ts
type Order = {
  id: string;
  customer: { id: string; name: string };
  lines: Array<{ sku: string; quantity: number }>;
};

type Customer = Order["customer"];           // { id: string; name: string }
type Line = Order["lines"][number];          // { sku: string; quantity: number }
type IdOrCustomer = Order["id" | "customer"]; // string | { id: string; name: string }
```

`[number]` on an array or tuple type gives the element type. It's how you get the union of an `as const` array's values, as you'll see again in Chapter 14.

### 10.4 Why `Object.keys` returns `string[]`

A frequent frustration:

```ts
const user = { id: 1, name: "Ada" };

Object.keys(user).forEach((key) => {
  console.log(user[key]);
  // ❌ Element implicitly has an 'any' type because 'string' can't be used to index type '{ id: number; name: string }'
});
```

It feels like `Object.keys(user)` should return `("id" | "name")[]`. It doesn't, because of structural typing (Chapter 1): an object typed as `{ id: number; name: string }` may actually have *more* properties at runtime. Claiming the keys are only `"id" | "name"` would be a lie.

Your options, from best to worst:

```ts
// 1. Iterate entries; values come typed as a union of the property types
for (const [key, value] of Object.entries(user)) {
  console.log(key, value);
}

// 2. Iterate a known list of keys you control
const fields = ["id", "name"] as const satisfies ReadonlyArray<keyof typeof user>;
for (const field of fields) {
  console.log(user[field]); // ✅ typed
}

// 3. Cast, when you know the object has no extra keys (e.g., you created it yourself)
for (const key of Object.keys(user) as Array<keyof typeof user>) {
  console.log(user[key]);
}
```

### Key Takeaways

- `keyof T` gives the union of keys; `T[K]` gives property types; `T[number]` gives element types.
- `typeof value` in type position turns a value into a type, so the value can be the source of truth.
- `Object.keys` returns `string[]` because objects can have extra properties at runtime.

### Exercises

1. Given `const LOG_LEVELS = { debug: 10, info: 20, warn: 30, error: 40 } as const;`, derive `LogLevel` (the key union) and `LogLevelValue` (the value union) without repeating any literal.
2. Write `indexBy(items, key)` that returns a `Map` from a property's value to the item, typed so `indexBy(users, "id")` returns `Map<string, User>` and `indexBy(users, "nope")` doesn't compile.

---

## 11. Generics

### 11.1 Why generics exist

Suppose you want a function that returns the first element of an array. Without generics you have bad choices:

```ts
function firstAny(arr: any[]): any { return arr[0]; }          // loses all type information
function firstUnknown(arr: unknown[]): unknown { return arr[0]; } // safe, but the caller must re-narrow
```

A **generic** function has a type parameter, a placeholder that's filled in at each call:

```ts
function first<T>(arr: readonly T[]): T | undefined {
  return arr[0];
}

const n = first([1, 2, 3]);       // ^? number | undefined
const s = first(["a", "b"]);      // ^? string | undefined
const u = first<User>([]);        // explicit type argument when inference has nothing to go on
```

Generics let you write code that works over many types while preserving the relationship between inputs and outputs. That relationship is the whole point: "whatever type goes in, the same type comes out".

### 11.2 Inference of type arguments

You rarely write type arguments yourself. TypeScript infers them from the arguments:

```ts
function pair<A, B>(a: A, b: B): [A, B] {
  return [a, b];
}

const p = pair("id", 42); // ^? [string, number]
```

Write explicit type arguments only when there's nothing to infer from (`first<User>([])`, `new Map<string, User>()`) or when inference picks something too wide.

### 11.3 Constraints

A bare `T` could be anything, so you can't access properties on it. Constraints with `extends` limit what `T` can be, and in return you can use what the constraint guarantees:

```ts
function longest<T extends { length: number }>(a: T, b: T): T {
  return a.length >= b.length ? a : b;
}

longest("hello", "hi");          // ✅ strings have length
longest([1, 2, 3], [1]);         // ✅ arrays have length
longest(10, 20);                 // ❌ number has no length
```

Note that the return type is `T`, not `{ length: number }`. Calling `longest("hello", "hi")` returns `string`, so the caller keeps full type information. That's the advantage over simply typing the parameters as `{ length: number }`.

A very common constraint uses `keyof` (Chapter 10) to tie two parameters together:

```ts
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { id: 1, name: "Ada", active: true };

getProperty(user, "name");   // ^? string
getProperty(user, "active"); // ^? boolean
getProperty(user, "email");  // ❌ "email" is not a key of user
```

### 11.4 Generic types and interfaces

Types can be generic too. This is how you model reusable containers:

```ts
type ApiResponse<T> = {
  data: T;
  meta: { requestId: string; timestamp: string };
};

type Paginated<T> = {
  items: T[];
  page: number;
  totalPages: number;
};

async function fetchUsers(): Promise<ApiResponse<Paginated<User>>> {
  // ...
}
```

Type parameters can have **defaults**:

```ts
type ApiError<TDetails = undefined> = {
  code: string;
  message: string;
  details: TDetails;
};

const e1: ApiError = { code: "NOT_FOUND", message: "Missing", details: undefined };
const e2: ApiError<{ field: string }> = {
  code: "INVALID",
  message: "Bad input",
  details: { field: "email" },
};
```

### 11.5 Generic classes: a TTL cache

Classes can be generic too. Here's a small cache whose key and value types are chosen per instance:

```ts
class TtlCache<K, V> {
  readonly #entries = new Map<K, { value: V; expiresAt: number }>();
  readonly #ttlMs: number;
  readonly #now: () => number;

  constructor(ttlMs: number, now: () => number = Date.now) {
    this.#ttlMs = ttlMs;
    this.#now = now; // injectable clock: tests can control time
  }

  get(key: K): V | undefined {
    const entry = this.#entries.get(key);
    if (!entry) return undefined;
    if (entry.expiresAt <= this.#now()) {
      this.#entries.delete(key);
      return undefined;
    }
    return entry.value;
  }

  set(key: K, value: V): void {
    this.#entries.set(key, { value, expiresAt: this.#now() + this.#ttlMs });
  }
}

const sessions = new TtlCache<string, Session>(15 * 60_000);
sessions.set("s_1", session);

const cached = sessions.get("s_1"); // ^? Session | undefined
sessions.set(42, session);          // ❌ number is not assignable to string
```

Explicit type arguments are needed here because the constructor's parameters don't mention `K` or `V`, so there's nothing to infer them from. A type-safe event emitter, which also needs mapped types, is built at the end of Chapter 17.

### 11.6 `const` type parameters

By default, TypeScript widens inferred literals. A `const` type parameter (TypeScript 5.0+) asks for the narrowest inference, as if the caller had written `as const`:

```ts
function defineRoutes<const T extends readonly string[]>(routes: T): T {
  return routes;
}

const routes = defineRoutes(["/home", "/about", "/users/:id"]);
//    ^? readonly ["/home", "/about", "/users/:id"]

type Route = (typeof routes)[number]; // "/home" | "/about" | "/users/:id"
```

This is how libraries build APIs that "remember" the exact values you pass in, such as route definitions, configuration keys, and state machines.

### 11.7 `NoInfer`

Sometimes a type parameter appears in several places, and you want only some of them to drive inference. `NoInfer<T>` (TypeScript 5.4+) blocks inference from a position:

```ts
function createStateMachine<S extends string>(config: {
  states: S[];
  initial: NoInfer<S>;
}) {
  return config;
}

createStateMachine({ states: ["idle", "loading", "done"], initial: "idle" });     // ✅
createStateMachine({ states: ["idle", "loading", "done"], initial: "finished" }); // ❌
```

Without `NoInfer`, TypeScript would infer `S` from *both* places and happily widen it to include `"finished"`, silently accepting the typo.

### 11.8 Guidelines for good generics

**A type parameter should relate two or more things.** If `T` appears only once, it usually isn't doing anything:

```ts
// ❌ T appears once; this is just a disguised `unknown` parameter
function logValue<T>(value: T): void { console.log(value); }

// ✅ Equivalent and simpler
function logValue2(value: unknown): void { console.log(value); }
```

**Beware return-only generics.** A type parameter that appears only in the return type is an unchecked cast in disguise:

```ts
// ❌ Looks type-safe, but nothing validates the data. It's `as T` hidden in a signature.
async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  return res.json();
}

const user = await getJson<User>("/api/user"); // a lie if the API returns something else
```

The honest version returns `unknown`, or accepts a schema that validates the data (Chapter 22).

**Use as few type parameters as possible**, constrain them, and give them meaningful names when there's more than one (`TInput`, `TOutput`, or `Key`, `Value`) rather than `T, U, V, W`.

### Key Takeaways

- Generics preserve the relationship between input and output types.
- Let TypeScript infer type arguments; provide them only when there's nothing to infer from.
- Use `extends` constraints and `K extends keyof T` to relate parameters.
- `const` type parameters capture literal types; `NoInfer` controls which positions drive inference.
- A type parameter used once, or only in the return type, is a red flag.

### Exercises

1. Implement `groupBy(items, keyFn)` returning `Partial<Record<K, T[]>>`, without using `Object.groupBy`.
2. What's wrong with `function parseJson<T>(text: string): T`? Rewrite it so the return type is backed by a runtime check.

---

## 12. Classes and Object-Oriented TypeScript

Modern TypeScript code uses classes less than Java or C# code does: plain objects, functions, and types handle most needs. But classes remain the right tool for stateful objects with behavior, domain entities with invariants, and many framework integrations. This chapter shows how to write them well.

### 12.1 Fields and initialization

```ts
class ShoppingCart {
  items: CartItem[] = [];
  readonly createdAt = new Date();
  discountCode: string | undefined;

  addItem(item: CartItem): void {
    this.items.push(item);
  }

  get total(): number {
    return this.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  }
}
```

With `strictPropertyInitialization` (part of `strict`), every field must be initialized in its declaration or in the constructor, or its type must include `undefined`. This prevents "field is undefined" bugs.

The definite assignment assertion `field!: Type` tells TypeScript "this will be initialized somewhere you can't see". Like the non-null assertion, it's unchecked. Use it only for framework-managed fields (e.g., dependency-injected properties) and prefer constructor initialization otherwise.

### 12.2 Access modifiers: `#private` vs `private`

TypeScript has `public` (default), `protected`, and `private` keywords. JavaScript itself has native private fields with `#`.

```ts
class BankAccount {
  #balance = 0;              // JavaScript private: enforced at runtime
  private auditLog: string[] = []; // TypeScript private: compile-time only

  deposit(amount: number): void {
    if (amount <= 0) throw new RangeError("Deposit must be positive");
    this.#balance += amount;
    this.auditLog.push(`deposit:${amount}`);
  }

  get balance(): number {
    return this.#balance;
  }
}

const account = new BankAccount();
account.#balance;        // ❌ syntax error, and inaccessible at runtime
account.auditLog;        // ❌ compile error...
(account as any).auditLog; // ...but fully accessible at runtime
```

| | `#field` | `private field` |
|---|---|---|
| Enforced at runtime | ✅ | ❌ |
| Visible in `JSON.stringify`, `Object.keys` | ❌ | ✅ |
| Accessible to tests via casts | ❌ | ✅ |
| Works with `protected`-style inheritance | ❌ | ✅ (`protected`) |

**Recommendation:** use `#` when privacy must be real: library code and domain objects protecting invariants. TypeScript's `private` remains acceptable in application code, and some frameworks expect it. Be consistent within a codebase.

A side effect worth knowing: a class with any private or protected member (either kind) is compatible only with itself and its subclasses, not with other classes of the same shape. Private members make classes effectively nominal.

### 12.3 Avoid parameter properties

TypeScript's parameter properties are a shorthand that declares and assigns fields in the constructor signature:

```ts
// ❌ Non-erasable: generates code, so it fails with erasableSyntaxOnly and Node type stripping
class UserService {
  constructor(private readonly repo: UserRepository, private readonly logger: Logger) {}
}
```

It's concise, but it's TypeScript-only syntax that emits JavaScript, which conflicts with the erasable-syntax standard. Write explicit fields instead:

```ts
// ✅ Erasable, and plain JavaScript once types are removed
class UserService {
  readonly #repo: UserRepository;
  readonly #logger: Logger;

  constructor(repo: UserRepository, logger: Logger) {
    this.#repo = repo;
    this.#logger = logger;
  }

  async getUser(id: string): Promise<User> {
    this.#logger.info(`Fetching user ${id}`);
    return this.#repo.findById(id);
  }
}
```

You'll still see parameter properties in older codebases and framework docs; NestJS, for example, uses them heavily for dependency injection. Inside framework code, follow the framework's conventions. A NestJS project compiles with `tsc` and legacy decorators anyway, so erasability matters less there.

### 12.4 `implements` and abstract classes

`implements` checks that a class satisfies an interface:

```ts
interface Cache<V> {
  get: (key: string) => V | undefined;
  set: (key: string, value: V) => void;
}

class MemoryCache<V> implements Cache<V> {
  #store = new Map<string, V>();

  get(key: string): V | undefined {
    return this.#store.get(key);
  }

  set(key: string, value: V): void {
    this.#store.set(key, value);
  }
}
```

Two important details:

1. `implements` is only a check. It doesn't change the class's type or infer parameter types for you; you still annotate the method parameters.
2. Code should depend on the **interface** (`Cache<V>`), not the class. That's what makes it easy to swap in a `RedisCache` or a test fake.

**Abstract classes** provide shared implementation plus required "holes":

```ts
abstract class Exporter {
  export(rows: readonly Row[]): string {
    return [this.header(), ...rows.map((r) => this.formatRow(r))].join("\n");
  }

  protected abstract header(): string;
  protected abstract formatRow(row: Row): string;
}

class CsvExporter extends Exporter {
  protected override header(): string { return "id,name"; }
  protected override formatRow(row: Row): string { return `${row.id},${row.name}`; }
}
```

Use an interface when you only need a contract. Use an abstract class when subclasses genuinely share behavior (the Template Method pattern above).

### 12.5 `override`

With `noImplicitOverride`, overriding a base method requires the `override` keyword. This catches two bugs: overriding by accident, and a base method being renamed while the subclass "override" silently becomes a new, unused method.

```ts
class Base {
  greet(): string { return "hi"; }
}

class Child extends Base {
  override greet(): string { return "hello"; }   // ✅
  override wave(): string { return "👋"; }        // ❌ no 'wave' in Base
}
```

### 12.6 Static members and static blocks

```ts
class IdGenerator {
  static #next = 1;
  static readonly PREFIX = "id_";

  static next(): string {
    return `${IdGenerator.PREFIX}${IdGenerator.#next++}`;
  }

  static {
    // runs once when the class is defined; reads the validated config module (Chapter 22), not raw process.env
    IdGenerator.#next = config.ID_SEED ?? 1;
  }
}
```

If a class has only static members, it should be a module with exported functions instead.

### 12.7 Decorators

TypeScript supports two incompatible decorator systems:

- **Standard decorators** (TypeScript 5.0+): the TC39 proposal, enabled by default with no flag.
- **Legacy decorators** (`experimentalDecorators: true`): the older TypeScript-specific version, still used by established backend frameworks such as NestJS and TypeORM. It also supports parameter decorators and `emitDecoratorMetadata`, which those frameworks rely on for dependency injection.

```ts
// A standard method decorator that logs calls
function logged<This, Args extends unknown[], Return>(
  target: (this: This, ...args: Args) => Return,
  context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Return>,
) {
  const name = String(context.name);
  return function (this: This, ...args: Args): Return {
    console.log(`→ ${name}`, args);
    return target.call(this, ...args);
  };
}

class Calculator {
  @logged
  add(a: number, b: number): number {
    return a + b;
  }
}
```

**Decorators and erasability.** Decorators are *not* on the `erasableSyntaxOnly` list (Chapter 2): that flag only rejects `enum`, namespaces with runtime code, parameter properties, `import =`/`export =`, and `<T>`-style assertions. Decorators are ECMAScript syntax rather than TypeScript-specific syntax, so the flag lets them through. The catch is the runtime: V8 in Node.js 24 doesn't implement decorators, so Node's type stripping can't run a file that uses them. Decorator code always needs a compile step (`tsc`, esbuild, or SWC).

Use decorators when a framework requires them. Avoid inventing decorator-heavy designs in plain application code, where a higher-order function is usually simpler.

### 12.8 Composition over inheritance

Deep inheritance hierarchies are brittle in any language. In TypeScript, prefer small interfaces and composition:

```ts
interface Notifier {
  send: (to: string, message: string) => Promise<void>;
}

class EmailNotifier implements Notifier {
  async send(to: string, message: string): Promise<void> { /* ... */ }
}

class SmsNotifier implements Notifier {
  async send(to: string, message: string): Promise<void> { /* ... */ }
}

class OrderService {
  readonly #notifier: Notifier;

  constructor(notifier: Notifier) {
    this.#notifier = notifier; // injected: swappable, testable
  }

  async confirm(order: Order): Promise<void> {
    await this.#notifier.send(order.customerContact, `Order ${order.id} confirmed`);
  }
}
```

**When to use classes vs functions?** A good heuristic: if you have state that methods operate on together, or you need multiple instances with their own state, use a class. If you have stateless operations on data, use functions and plain object types.

### 12.9 Class details worth knowing

**Class fields use standard JavaScript semantics.** With `useDefineForClassFields` (the default for ES2022+ targets), a field declaration *defines* a property on each instance, exactly as JavaScript does. One consequence: redeclaring a field in a subclass just to narrow its type would reset it to `undefined` after the base constructor ran. Use `declare` for a type-only redeclaration, which emits nothing and is erasable:

```ts
class HttpReply {
  body: unknown;
  constructor(body: unknown) {
    this.body = body;
  }
}

class JsonReply extends HttpReply {
  declare body: Record<string, unknown>; // refines the type; no runtime field is created
}
```

**Polymorphic `this` types** let fluent methods return the *subclass* type:

```ts
class QueryBuilder {
  #clauses: string[] = [];

  where(clause: string): this {
    this.#clauses.push(clause);
    return this;
  }
}

class UserQuery extends QueryBuilder {
  active(): this {
    return this.where("deleted_at IS NULL");
  }
}

new UserQuery().where("age > 18").active(); // ✅ where() returns UserQuery, so active() is available
```

**Constructor types** describe "a class whose instances are `T`". They're useful for helpers that receive classes as values:

```ts
type Constructor<T> = abstract new (...args: never[]) => T;

function isInstance<T>(value: unknown, ctor: Constructor<T>): value is T {
  return value instanceof ctor;
}

class HttpError extends Error {
  readonly status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

if (isInstance(error, HttpError)) {
  console.log(error.status); // error: HttpError
}
```

**Getters and setters may have different types** (TypeScript 5.1+), for example a setter that accepts `string | Date` while the getter always returns `Date`. Use this sparingly; asymmetric properties surprise readers.

You may also meet the `accessor` keyword (auto-accessors). It belongs to the standard decorators proposal and has the same runtime limitation: Node.js 24 can't run it without a compile step.

### Key Takeaways

- Initialize fields in declarations or the constructor; avoid `!` definite assignment.
- `#private` is real runtime privacy; `private` is compile-time only. Choose consciously and consistently.
- Avoid parameter properties in erasable codebases; declare fields explicitly.
- Depend on interfaces; use abstract classes only for shared behavior.
- Enable `noImplicitOverride` and use `override`.
- Prefer composition and constructor injection over inheritance.
- Decorators aren't rejected by `erasableSyntaxOnly`, but Node.js 24 can't run them; they need a compile step.
- Use `this` return types for fluent APIs and `declare` fields to refine inherited field types.

---

## 13. Modules, Imports, and Declaration Files

### 13.1 Everything is an ES module

Modern TypeScript is written as ES modules: `import` and `export`, never `require` and `module.exports` in source code. Any file containing a top-level `import` or `export` is a module with its own scope.

```ts
// math.ts
export function add(a: number, b: number): number {
  return a + b;
}

export const PI = 3.14159;

// app.ts
import { add, PI } from "./math.ts";
```

### 13.2 Type-only imports and `verbatimModuleSyntax`

Some imports are only used as types. They must not exist at runtime, because the exporting module may not export a runtime value with that name at all.

```ts
import type { User, Order } from "./models.ts";         // whole import is type-only
import { createUser, type CreateUserInput } from "./users.ts"; // inline type modifier

export type { User };                                    // type-only re-export
```

With `verbatimModuleSyntax`, the rule is simple and predictable:

- Imports **with** `type` are always removed.
- Imports **without** `type` are always kept.

This is what single-file transpilers and Node's type stripping assume, since they can't look at other files to discover what's a type. If you import a type without the `type` modifier, the import stays in the JavaScript output and fails at runtime because the module doesn't export it. The compiler flags this for you under `verbatimModuleSyntax`.

The linter rule `@typescript-eslint/consistent-type-imports` can auto-fix imports to the right form.

### 13.3 Named exports over default exports

Most style guides recommend named exports:

```ts
// ❌ Default export: every importer chooses a name, so names drift
export default class UserService {}
import Users from "./user-service.ts";
import UserSvc from "./user-service.ts";

// ✅ Named export: one name everywhere, better auto-imports and refactoring
export class UserService {}
import { UserService } from "./user-service.ts";
```

Default exports are still required where frameworks expect them (some routing conventions, lazy-loaded components, config files).

### 13.4 Barrel files

A barrel is an `index.ts` that re-exports everything from a folder:

```ts
// services/index.ts
export * from "./users.ts";
export * from "./orders.ts";
export * from "./billing.ts";
```

Barrels make imports pretty but have real costs in applications: importing one thing can load an entire folder's module graph, which slows test runners, dev servers, and type-checking; they make circular dependencies easy; and they can defeat tree-shaking. Many large codebases now ban internal barrels and import directly from the defining file. A **package's public entry point** is the legitimate place for a barrel.

### 13.5 Path aliases

To avoid `../../../utils`, use **subpath imports** in `package.json`. Node.js and TypeScript both understand them natively, so every tool sees the same mapping.

For a project that runs its sources directly with type stripping (Appendix A.2), the mapping can point straight at `src/`:

```jsonc
// package.json
{
  "imports": {
    "#src/*": "./src/*"
  }
}
```

```ts
import { formatDate } from "#src/utils/date.ts";
```

**If you compile to `dist/`, don't point the mapping at `src/`.** `rewriteRelativeImportExtensions` only rewrites *relative* imports, so in production Node would follow `#src/*` into your TypeScript sources, or to `.ts` files that don't exist in `dist/`. Use conditional targets with an extensionless specifier instead:

```jsonc
// package.json
{
  "imports": {
    "#src/*": {
      "source": "./src/*.ts",
      "default": "./dist/*.js"
    }
  }
}
```

```ts
import { formatDate } from "#src/utils/date"; // no extension: the mapping adds it
```

Add `"customConditions": ["source"]` to `tsconfig.json` so TypeScript resolves to the sources, and run development with `node --conditions=source src/main.ts`. Production runs `node dist/main.js` and gets the compiled files through `default`.

Newer Node.js releases and TypeScript 6.0+ also accept a bare `#/` prefix (`"#/*": "./src/*"`). Check that your exact Node.js version supports it before relying on it.

The older approach, `compilerOptions.paths`, only affects type-checking. Every other tool (runtime, bundler, test runner) then has to replicate the same mapping. `paths` still works (relative to the tsconfig, without `baseUrl`, which is removed in TypeScript 7), but subpath imports are the standards-based option.

### 13.6 Declaration files (`.d.ts`)

A declaration file contains only types: no implementations. It describes JavaScript that exists elsewhere. You meet them in three ways:

1. **Generated** by `tsc` with `declaration: true` when you publish a library.
2. **Shipped** by packages (`"types"` in their `package.json`) or by DefinitelyTyped as `@types/*`.
3. **Handwritten** by you, for untyped modules or global additions.

**Typing an untyped module:**

```ts
// types/legacy-geo.d.ts
declare module "legacy-geo" {
  export interface Coordinates {
    lat: number;
    lng: number;
  }
  export function distance(a: Coordinates, b: Coordinates): number;
}
```

Avoid the shorthand `declare module "legacy-geo";` with no body. It types everything from the module as `any`.

**Wildcard module declarations** such as `declare module "*.graphql" { ... }` type non-code imports that a bundler or loader handles. Backend services rarely need them; reading such files at runtime with `node:fs` is usually simpler.

### 13.7 Global and module augmentation

**Global augmentation** adds to global types. It must be inside a module file (one with an `import` or `export`):

```ts
// types/globals.d.ts
export {};

declare global {
  // Set during bootstrap, e.g. globalThis.__APP_VERSION__ = "1.4.2".
  // `var` is required: only var declarations become properties of globalThis.
  var __APP_VERSION__: string;
}
```

**Module augmentation** adds to a library's types using declaration merging. A classic example is attaching an authenticated user to Express requests:

```ts
// types/express.d.ts
import type { User } from "../src/models.ts";

declare module "express-serve-static-core" {
  interface Request {
    user?: User;
  }
}
```

Augmentation is powerful but global in effect. Keep augmentations in one clearly named `types/` folder so they're easy to find.

**A note on environment variables.** You may see `process.env` typed through augmentation of `NodeJS.ProcessEnv`. That only describes what you *hope* is set. The robust approach is to validate environment variables at startup with a schema and export a typed `config` object (Chapter 22).

### 13.8 Side-effect imports

An import with no bindings runs a module for its side effects:

```ts
import "./instrumentation.ts"; // e.g. OpenTelemetry setup that must run before anything else
```

Since TypeScript 6.0, `noUncheckedSideEffectImports` is on by default, so TypeScript reports side-effect imports it can't resolve. That catches typos in paths. If you import non-code files for their side effects through a loader or bundler, add a matching wildcard `declare module` so the import resolves.

### 13.9 JSON modules and dynamic imports

In ES modules, Node.js requires an **import attribute** to load JSON, and TypeScript enforces this under `"module": "nodenext"`:

```ts
import pkg from "../package.json" with { type: "json" };

console.log(pkg.version); // typed from the file's contents (requires resolveJsonModule)
```

Only the default import is allowed for JSON in ESM; `import { version } from "../package.json"` is an error.

**Dynamic imports** load a module lazily and return a promise:

```ts
const { generateReport } = await import("./reports/generate.ts");
```

Use them for heavy, rarely used code paths (CLI subcommands, optional integrations) and for optional dependencies that may not be installed.

**`import()` types** reference a type from another module without a top-level import:

```ts
type Config = import("./config.ts").Config;
```

They're mostly useful in JSDoc and declaration files; in TypeScript source, prefer a normal `import type`.

### Key Takeaways

- Write ES modules; use `import type` for types, enforced by `verbatimModuleSyntax`.
- Prefer named exports; avoid internal barrel files in applications.
- Use `package.json` subpath imports (`#src/*`) for aliases; use conditional targets if you compile to `dist/`.
- `.d.ts` files describe JavaScript that exists elsewhere; avoid body-less `declare module` shorthands.
- Keep global and module augmentations in a dedicated, discoverable location.
- Import JSON with `with { type: "json" }`; use dynamic `import()` for lazy or optional code paths.

---

## 14. Replacing enum and namespace

`enum` and `namespace` are TypeScript-only features that generate runtime code. Under the erasable-syntax standard, they're replaced with plain JavaScript plus types. You'll still encounter them in existing code, so it's worth knowing both the problem and the replacement.

### 14.1 What's wrong with `enum`

```ts
enum Direction {
  Up,
  Down,
}
```

compiles to:

```js
var Direction;
(function (Direction) {
  Direction[(Direction["Up"] = 0)] = "Up";
  Direction[(Direction["Down"] = 1)] = "Down";
})(Direction || (Direction = {}));
```

Problems:

- **It's not erasable.** It generates runtime code, so it fails under `erasableSyntaxOnly` and Node's type stripping.
- **Numeric enums have reverse mappings**: `Object.values(Direction)` returns `["Up", "Down", 0, 1]`, which surprises everyone.
- **Numeric enums are loosely typed**: any `number` variable is assignable to a numeric enum type.
- **Enums are nominal**, unlike the rest of TypeScript: you can't pass the string `"UP"` where a string enum `Direction.Up = "UP"` is expected, even though that's the runtime value. This makes them awkward at API boundaries where data arrives as plain strings.
- **`const enum`** inlines values but breaks under `isolatedModules` and across package boundaries.

### 14.2 Replacement 1: a union of string literals

For most cases, a union is all you need:

```ts
type Direction = "up" | "down" | "left" | "right";

function move(direction: Direction): void { /* ... */ }

move("up");    // ✅ autocomplete works, typos are errors
move("north"); // ❌
```

Unions are erasable, serialize naturally to JSON, and work with narrowing and exhaustiveness checks.

### 14.3 Replacement 2: an `as const` object

When you need named constants at runtime (to iterate, to reference as `Status.Active`, or to map to display labels), use an `as const` object and derive the type from it:

```ts
export const OrderStatus = {
  Pending: "pending",
  Paid: "paid",
  Shipped: "shipped",
  Cancelled: "cancelled",
} as const;

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];
//          ^? "pending" | "paid" | "shipped" | "cancelled"
```

The value and the type share a name, so usage reads exactly like an enum:

```ts
import { OrderStatus } from "./order-status.ts";

function canCancel(status: OrderStatus): boolean {
  return status === OrderStatus.Pending || status === OrderStatus.Paid;
}

canCancel(OrderStatus.Paid); // ✅
canCancel("paid");           // ✅ plain strings from an API work too

const allStatuses = Object.values(OrderStatus); // ["pending", "paid", "shipped", "cancelled"]
```

### 14.4 Replacement 3: an `as const` array

When you mainly need a list of allowed values (for validation, dropdowns, or iteration), start from an array:

```ts
export const ROLES = ["admin", "editor", "viewer"] as const;
export type Role = (typeof ROLES)[number]; // "admin" | "editor" | "viewer"

export function isRole(value: string): value is Role {
  return (ROLES as readonly string[]).includes(value);
}
```

The cast inside `isRole` is a known quirk: `ROLES.includes(value)` alone fails to compile because `includes` on a `readonly ["admin", ...]` tuple only accepts `Role`, but `value` is a `string`. Widening the array to `readonly string[]` is safe here.

### 14.5 Replacing namespaces with modules

Namespaces predate ES modules. Their job, grouping related code under a name, is done by modules today:

```ts
// ❌ Namespace (non-erasable when it contains values)
namespace Validation {
  export function isEmail(s: string): boolean { return s.includes("@"); }
}

// ✅ A module
// validation.ts
export function isEmail(s: string): boolean {
  return s.includes("@");
}

// consumer.ts — namespace-style access if you want it
import * as Validation from "./validation.ts";
Validation.isEmail("ada@example.com");
```

Type-only namespaces inside `declare` blocks (e.g., `declare global { namespace NodeJS { ... } }`) are erasable and still appear in declaration files. That's fine, since they generate no code.

### Key Takeaways

- Avoid `enum` and value `namespace` in new code; they're non-erasable and have surprising behavior.
- Use string literal unions by default.
- Use an `as const` object plus a derived type when you need runtime constants.
- Use an `as const` array plus `[number]` indexing when you need a list of allowed values.
- Use ES modules instead of namespaces.

---

## 15. Configuration in Depth

Chapter 2 gave you a minimal configuration. This chapter explains the options by group, so you can read any `tsconfig.json` and make deliberate choices. Complete reference configurations are in [Appendix A](#appendix-a-reference-tsconfig-files).

### 15.1 Strictness: how much the checker protects you

```jsonc
{
  "compilerOptions": {
    "strict": true,                             // default since TS 6.0; set explicitly anyway
    "noUncheckedIndexedAccess": true,           // arr[i] and record[key] include `undefined`
    "exactOptionalPropertyTypes": true,         // `x?: string` doesn't accept explicit `undefined`
    "noImplicitOverride": true,                 // subclass overrides require the `override` keyword
    "noImplicitReturns": true,                  // every code path must return
    "noFallthroughCasesInSwitch": true,         // forbids accidental switch fallthrough
    "noPropertyAccessFromIndexSignature": true  // dynamic keys must use bracket access
  }
}
```

`strict` is an umbrella that enables a family of checks: `noImplicitAny`, `strictNullChecks`, `strictFunctionTypes`, `strictBindCallApply`, `strictPropertyInitialization`, `useUnknownInCatchVariables`, and others. Since TypeScript 6.0 it defaults to `true`, but writing it explicitly documents intent.

The options after `strict` are **not** included in `strict`, but are considered best practice for new code:

- **`noUncheckedIndexedAccess`** is the most valuable. Without it, TypeScript lies about array and record access:

  ```ts
  const names: string[] = [];
  const first = names[0];
  //    ^? string              (without the flag — wrong, it's undefined!)
  //    ^? string | undefined  (with the flag — correct)
  ```

- **`exactOptionalPropertyTypes`** distinguishes "property missing" from "property present with value `undefined`", which matters for `Object.hasOwn`, spreading, and PATCH payloads where "absent" means "don't change" but `undefined` might mean "clear":

  ```ts
  type Settings = { theme?: "light" | "dark" };
  const s: Settings = { theme: undefined }; // ❌ with the flag: absent is allowed, explicit undefined is not
  ```

  It's stricter than some teams want. Enable it on greenfield projects; existing codebases can adopt it later.

- **`noPropertyAccessFromIndexSignature`** forces bracket access for keys that come from an index signature, so code that reads a key that may not exist looks different from code that reads a declared property:

  ```ts
  type Headers = { contentType: string; [name: string]: string };
  declare const headers: Headers;

  headers.contentType;      // ✅ declared property
  headers.authorization;    // ❌ with the flag
  headers["authorization"]; // ✅ visibly a dynamic lookup that may be missing
  ```

  `process.env` is an index signature, so this flag also makes every raw `process.env["X"]` read stand out, which is a useful nudge toward a validated config module (Chapter 22).

- **`noUnusedLocals` and `noUnusedParameters`** work, but they turn a style issue into a build failure, which is annoying in the middle of a refactor. Most teams leave unused-code detection to the linter (`@typescript-eslint/no-unused-vars`), where it can be a warning locally and an error in CI.

### 15.2 Modules: how imports are resolved and emitted

```jsonc
{
  "compilerOptions": {
    "module": "nodenext",                    // resolve and emit exactly like Node.js
    "verbatimModuleSyntax": true,            // imports/exports are emitted exactly as written
    "isolatedModules": true,                 // each file must be transpilable on its own
    "erasableSyntaxOnly": true,              // reject non-erasable TypeScript syntax
    "rewriteRelativeImportExtensions": true, // allow ./x.ts imports; emit ./x.js
    "resolveJsonModule": true                // allow typed JSON imports
  }
}
```

- **`module`** also sets `moduleResolution`, so don't set that separately.
  - **`"nodenext"`** models Node.js exactly: ESM vs CommonJS determined by `package.json` `"type"` and file extensions, relative imports need extensions, `exports` and `imports` maps are honored. It tracks the latest Node behavior, so its meaning can evolve between TypeScript releases.
  - **`"node20"`** (TypeScript 5.9+) is a stable snapshot of Node.js 20+ module behavior. It's a fine choice for Node.js 24 if you'd rather the setting never change under you.
  - **`"preserve"`** (implies `moduleResolution: "bundler"`) is for code a bundler processes. For a backend, that's mainly services bundled with esbuild for serverless deployment. Extensions are optional and bundler conventions apply.
- **`verbatimModuleSyntax`** makes import elision predictable: an import without the `type` modifier is kept in the output; one with `type` is removed. This is required for correct behavior with type stripping and single-file transpilers (Chapter 13).
- **`isolatedModules`** errors on constructs that need whole-program information to transpile, which single-file tools like esbuild and Node can't handle.
- **`erasableSyntaxOnly`** rejects the non-erasable constructs listed in Chapter 2.
- **`rewriteRelativeImportExtensions`** lets you write `./x.ts` in relative imports and rewrites them to `./x.js` when `tsc` emits. You may see **`allowImportingTsExtensions`** in older configs; it also permits `.ts` imports, but only together with `noEmit` (or `emitDeclarationOnly`), so it doesn't work for builds.
- **`resolveJsonModule`** types JSON imports from the file's contents. Under `nodenext`, ESM JSON imports also need an import attribute: `import pkg from "./package.json" with { type: "json" }` (Chapter 13).
- **`noUncheckedSideEffectImports`** (default `true` since TypeScript 6.0) reports side-effect imports like `import "./setup.ts"` that don't resolve, catching typos.
- **`customConditions`** adds export conditions to resolution, useful for pointing monorepo packages at their TypeScript sources (Chapter 32).

### 15.3 Emit and project layout

```jsonc
{
  "compilerOptions": {
    "target": "es2025",                          // syntax level of the output; Node.js 24 supports ES2025
    "lib": ["es2025", "esnext.disposable"],      // built-in APIs TypeScript believes exist
    "types": ["node"],                           // global type packages; default is [] since TS 6.0
    "rootDir": "src",
    "outDir": "dist",
    "declaration": true,                         // emit .d.ts files (libraries)
    "sourceMap": true,
    "skipLibCheck": true                         // don't type-check .d.ts files in node_modules
  },
  "include": ["src"]
}
```

- **`target`** controls which JavaScript syntax is downleveled. Since TypeScript 6.0 it defaults to the latest ECMAScript version (ES2025 at the time of writing). Set it explicitly to what your runtime supports; for Node.js 24 that's `es2025`.
- **`lib`** controls which built-in APIs TypeScript believes exist. If you call an API your `lib` doesn't include, you get an error, which is a feature: it stops you from calling APIs your runtime lacks. Don't add `esnext` libraries speculatively; add them when your runtime ships the feature. `esnext.disposable` is the exception worth making, because Node.js 24 supports `using` natively.
- **`types`** defaults to `[]` since TypeScript 6.0. Before 6.0, every `@types/*` package in `node_modules` was loaded globally. Now you list global type packages explicitly (`"node"`, `"vitest/globals"`, etc.).
- **`rootDir`** defaults to the directory containing `tsconfig.json` since TypeScript 6.0 (it used to be inferred). Set it to `src` so output lands in `dist/` rather than `dist/src/`.
- **`skipLibCheck`** is standard practice: it speeds up builds and avoids errors in third-party declaration files you can't fix.
- **`useDefineForClassFields`** defaults to `true` for ES2022+ targets and gives class fields standard JavaScript semantics (Chapter 12). Leave it alone unless a framework that relies on legacy decorators tells you otherwise.

### 15.4 Legacy options: removed in TypeScript 7

If you're reading older tutorials or upgrading a project, these default changes from TypeScript 6.0 matter:

| Option | Old behavior | Since TS 6.0 |
|---|---|---|
| `strict` | `false` | `true` |
| `module` | `commonjs` (for most targets) | `esnext` |
| `target` | `es5` | latest ES version |
| `types` | all `@types/*` packages | `[]` |
| `rootDir` | inferred from inputs | tsconfig directory |
| `noUncheckedSideEffectImports` | `false` | `true` |

These options were deprecated in 6.0 and are **hard errors in TypeScript 7**: `target: "es5"`, `downlevelIteration`, `moduleResolution: "node"` (also called `node10`) and `"classic"`, `module: "amd" | "umd" | "system"`, `outFile`, `baseUrl`, `esModuleInterop: false`, `allowSyntheticDefaultImports: false`, `alwaysStrict: false`, the legacy `module Foo {}` namespace syntax, `asserts` on imports (use `with`), and `/// <reference no-default-lib="true"/>` directives.

TypeScript 6.0 let you silence these temporarily with `"ignoreDeprecations": "6.0"`. TypeScript 7 doesn't, so when upgrading an old project, go through 6.0 first and fix every deprecation warning there.

If an old tutorial tells you to set `"moduleResolution": "node"` or rely on `baseUrl` for path aliases, that advice is outdated. Use `nodenext`/`node20` (or `bundler` via `preserve`), and use `package.json` subpath imports for aliases (Chapter 13).

### 15.5 One project, several configs

Real projects usually have more than one `tsconfig`:

- **`tsconfig.json`** at the root type-checks *everything*, including tests and scripts, with `noEmit`. This is what your editor and `npm run typecheck` use.
- **`tsconfig.build.json`** extends it, turns emit on, and excludes tests, so `dist/` contains only production code.

```jsonc
// tsconfig.build.json
{
  "extends": "./tsconfig.json",
  "compilerOptions": { "noEmit": false, "rootDir": "src", "outDir": "dist" },
  "include": ["src"],
  "exclude": ["src/**/*.test.ts"]
}
```

The mistake to avoid is the opposite arrangement: a single config that excludes tests from compilation, so nothing ever type-checks them. Appendix A shows complete versions of both files. Monorepos take the same idea further with a shared base config (Chapter 32).

### Key Takeaways

- Use `strict` plus `noUncheckedIndexedAccess` at minimum; add `exactOptionalPropertyTypes` and `noPropertyAccessFromIndexSignature` on new code.
- `module: "nodenext"` (or `"node20"`) for code Node runs; `"preserve"` only for bundled code.
- `verbatimModuleSyntax`, `erasableSyntaxOnly`, and `rewriteRelativeImportExtensions` keep code runnable by Node and by `tsc`.
- Align `target` and `lib` with Node.js 24 (`es2025`); list global types explicitly.
- Options deprecated in 6.0 are errors in 7; upgrade through 6.0.
- Type-check everything with one config; build production code with another.

---

# Part III — Type-Level Programming

Part III is about computing types from other types. The goal isn't to write clever puzzles; it's to keep a **single source of truth**. When one type is derived from another, changing the source updates everything automatically and the compiler shows you every place affected. It builds on the type operators from Chapter 10.

## 16. Built-in Utility Types

TypeScript ships a set of generic types for common transformations. Knowing them well saves you from writing (and maintaining) duplicate types.

### 16.1 Reshaping object types

Start from one source type:

```ts
interface User {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  role: "admin" | "member";
  createdAt: Date;
}
```

**`Partial<T>`** makes every property optional. Typical use: updates.

```ts
function updateUser(id: string, changes: Partial<Omit<User, "id" | "createdAt">>): Promise<User> {
  // ...
}

updateUser("u1", { name: "Ada Lovelace" }); // ✅
```

**`Required<T>`** is the opposite: every property required.

```ts
type ResolvedOptions = Required<ClientOptions>; // after defaults are applied
```

**`Readonly<T>`** makes every property `readonly` (shallow).

**`Pick<T, K>`** keeps only some properties; **`Omit<T, K>`** removes some:

```ts
type PublicUser = Omit<User, "passwordHash">;
type UserSummary = Pick<User, "id" | "name">;
type NewUser = Omit<User, "id" | "createdAt">;
```

Prefer `Pick` (an allowlist) over `Omit` (a denylist) for anything security-relevant. If someone later adds `twoFactorSecret` to `User`, `Omit<User, "passwordHash">` silently includes it in the "public" type; `Pick` doesn't.

**`Record<K, V>`** builds an object type from keys and a value type (Chapter 6).

### 16.2 Filtering unions

```ts
type DomainEvent =
  | { type: "orderPlaced"; orderId: string; total: number }
  | { type: "orderShipped"; orderId: string; carrier: string }
  | { type: "userDeleted"; userId: string };

type OrderPlaced = Extract<DomainEvent, { type: "orderPlaced" }>;    // keep matching members
type NotOrderPlaced = Exclude<DomainEvent, { type: "orderPlaced" }>; // remove matching members

type Defined = NonNullable<string | null | undefined>;        // string
```

### 16.3 Extracting from functions, promises, and classes

```ts
function createSession(userId: string, ttlSeconds: number) {
  return { token: crypto.randomUUID(), userId, expiresAt: Date.now() + ttlSeconds * 1000 };
}

type Session = ReturnType<typeof createSession>;
// { token: `${string}-${string}-${string}-${string}-${string}`; userId: string; expiresAt: number }

type SessionArgs = Parameters<typeof createSession>; // [userId: string, ttlSeconds: number]

async function fetchProfile(): Promise<{ bio: string }> { /* ... */ }
type Profile = Awaited<ReturnType<typeof fetchProfile>>; // { bio: string }

class Logger { constructor(level: "info" | "debug") {} }
type LoggerInstance = InstanceType<typeof Logger>;           // Logger
type LoggerArgs = ConstructorParameters<typeof Logger>;      // [level: "info" | "debug"]
```

`ReturnType` and `Parameters` are especially useful for working with third-party functions whose types aren't exported.

### 16.4 String manipulation types

```ts
type A = Uppercase<"hello">;     // "HELLO"
type B = Lowercase<"HELLO">;     // "hello"
type C = Capitalize<"hello">;    // "Hello"
type D = Uncapitalize<"Hello">;  // "hello"
```

These become powerful combined with template literal types (Chapter 19).

### 16.5 A pitfall: `Omit` and `Pick` on unions

`Omit` doesn't distribute over unions. Applied to a discriminated union, it collapses the union and loses variant-specific properties:

```ts
type Shape =
  | { kind: "circle"; radius: number; id: string }
  | { kind: "square"; size: number; id: string };

type ShapeInput = Omit<Shape, "id">;
// { kind: "circle" | "square" } — radius and size are gone!
```

The fix is a distributive version, which uses a conditional type (Chapter 18):

```ts
type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;

type ShapeInput2 = DistributiveOmit<Shape, "id">;
// { kind: "circle"; radius: number } | { kind: "square"; size: number } ✅
```

### Key Takeaways

- Derive variants (`Partial`, `Pick`, `Omit`, `Readonly`) from one source type instead of duplicating.
- Prefer `Pick` over `Omit` for security-sensitive shapes.
- Use `ReturnType`, `Parameters`, and `Awaited` to extract types from functions.
- `Omit` doesn't distribute over unions; use a `DistributiveOmit` helper for discriminated unions.

### Exercises

1. Implement `MyPick<T, K>` and `MyOmit<T, K>` without the built-ins (hint: mapped types and `Exclude`).
2. From the `User` interface above, build `UserUpdate`: `id` required and readonly, `passwordHash` and `createdAt` excluded, everything else optional.

---

## 17. Mapped Types

A mapped type builds a new object type by iterating over keys. All the object utilities in Chapter 16 are mapped types.

### 17.1 The basic form

```ts
type Flags<T> = {
  [K in keyof T]: boolean;
};

type Features = { darkMode: string; beta: number };
type FeatureFlags = Flags<Features>; // { darkMode: boolean; beta: boolean }
```

Read `[K in keyof T]` as "for each key `K` of `T`". Here's how `Partial` and `Readonly` are defined in the standard library:

```ts
type MyPartial<T> = { [K in keyof T]?: T[K] };
type MyReadonly<T> = { readonly [K in keyof T]: T[K] };
```

### 17.2 Modifiers

You can add (`+`, the default) or remove (`-`) the `readonly` and `?` modifiers:

```ts
type Mutable<T> = { -readonly [K in keyof T]: T[K] };
type Concrete<T> = { [K in keyof T]-?: T[K] }; // this is how Required<T> works
```

### 17.3 Key remapping with `as`

The `as` clause renames keys while mapping. Combined with template literal types, it generates related APIs automatically:

```ts
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

type Person = { name: string; age: number };

type PersonGetters = Getters<Person>;
// { getName: () => string; getAge: () => number }
```

(`string & K` is needed because keys can also be `number` or `symbol`, and `Capitalize` only accepts strings.)

### 17.4 Filtering keys

Remapping a key to `never` removes it. This lets you filter properties by their value type:

```ts
type PickByValue<T, V> = {
  [K in keyof T as T[K] extends V ? K : never]: T[K];
};

type Model = { id: string; count: number; label: string; active: boolean };

type StringFields = PickByValue<Model, string>; // { id: string; label: string }
```

### 17.5 A realistic example: form state

```ts
type FormState<T> = {
  values: T;
  errors: { [K in keyof T]?: string };
  touched: { [K in keyof T]?: boolean };
};

type SignupForm = { email: string; password: string; acceptTerms: boolean };

const state: FormState<SignupForm> = {
  values: { email: "", password: "", acceptTerms: false },
  errors: { email: "Required" },
  touched: { email: true },
};
```

Add a field to `SignupForm` and `values`, `errors`, and `touched` all update. That's the single-source-of-truth benefit in action.

### 17.6 Putting it together: a type-safe event emitter

This example combines generics, `keyof`, indexed access, and a mapped type. It guarantees that event names and their payloads always match:

```ts
class TypedEmitter<Events extends object> {
  #listeners: { [E in keyof Events]?: Array<(payload: Events[E]) => void> } = {};

  on<E extends keyof Events>(event: E, listener: (payload: Events[E]) => void): () => void {
    (this.#listeners[event] ??= []).push(listener);

    return () => {
      // Read the current array at unsubscribe time. Capturing the array from `on`
      // would go stale as soon as another unsubscribe replaces it.
      const current = this.#listeners[event];
      if (current) this.#listeners[event] = current.filter((l) => l !== listener);
    };
  }

  emit<E extends keyof Events>(event: E, payload: Events[E]): void {
    // Iterate a snapshot so listeners added during emit don't run in this round.
    for (const listener of [...(this.#listeners[event] ?? [])]) {
      listener(payload);
    }
  }
}

// Usage: an interface works because the constraint is `object`
interface AppEvents {
  userLoggedIn: { userId: string };
  cartUpdated: { itemCount: number };
  logout: undefined;
}

const events = new TypedEmitter<AppEvents>();

const unsubscribe = events.on("userLoggedIn", ({ userId }) => {
  console.log(userId); // userId: string
});

events.emit("cartUpdated", { itemCount: 3 }); // ✅
events.emit("cartUpdated", { count: 3 });     // ❌ wrong payload shape
events.emit("userSignedUp", {});              // ❌ unknown event
events.emit("logout", undefined);             // ✅ events without data pass undefined
unsubscribe();
```

Two design details are worth noticing:

- **The constraint is `object`, not `Record<string, unknown>`.** An `interface` has no implicit index signature, so `interface AppEvents` wouldn't satisfy `Record<string, unknown>` (Chapter 6). The emitter only needs `keyof Events` and `Events[E]`, which work on any object type.
- **The mapped type `{ [E in keyof Events]?: Array<...> }`** keeps storage in sync with the event map: each key's listener array is typed by that key's payload.

### Key Takeaways

- `[K in keyof T]: ...` maps over every key of `T`.
- `+`/`-` add or remove `readonly` and `?`.
- `as` remaps keys; mapping to `never` filters them out.
- Mapped types keep related shapes (values, errors, flags) in sync automatically.
- Constrain generics over object maps with `object`, so both interfaces and type aliases work.

### Exercises

1. Write `Nullable<T>`, which makes every property also accept `null`.
2. Write `Setters<T>`, which turns `{ name: string }` into `{ setName: (value: string) => void }`.

---

## 18. Conditional Types and infer

### 18.1 The basic form

A conditional type chooses between two types based on assignability, like a ternary at the type level:

```ts
type IsString<T> = T extends string ? true : false;

type A = IsString<"hello">; // true
type B = IsString<42>;      // false
```

### 18.2 Distribution over unions

When the checked type is a bare type parameter and you pass a union, the conditional is applied to **each member separately** and the results are unioned:

```ts
type ToArray<T> = T extends unknown ? T[] : never;

type C = ToArray<string | number>; // string[] | number[]   (not (string | number)[])
```

This is exactly how `Exclude` and `Extract` work:

```ts
type MyExclude<T, U> = T extends U ? never : T;
type D = MyExclude<"a" | "b" | "c", "a">; // "b" | "c"
```

To prevent distribution, wrap both sides in a tuple:

```ts
type ToArrayNonDist<T> = [T] extends [unknown] ? T[] : never;
type E = ToArrayNonDist<string | number>; // (string | number)[]
```

### 18.3 `infer`: extracting types from inside other types

`infer` declares a type variable to be captured during matching:

```ts
type ElementOf<T> = T extends ReadonlyArray<infer Item> ? Item : never;
type F = ElementOf<string[]>; // string

type FirstArg<T> = T extends (first: infer A, ...rest: never[]) => unknown ? A : never;
type G = FirstArg<(id: string, retries: number) => void>; // string

type UnwrapPromise<T> = T extends Promise<infer V> ? V : T;
type H = UnwrapPromise<Promise<number>>; // number
```

You've already used `infer` indirectly: `ReturnType`, `Parameters`, and `Awaited` are all defined with it.

An `infer` can carry a constraint, which is useful when parsing strings:

```ts
type ParseNumber<T> = T extends `${infer N extends number}` ? N : never;
type I = ParseNumber<"42">; // 42
```

### 18.4 Recursive types

Types can reference themselves, which is needed for nested structures:

```ts
type Json =
  | string
  | number
  | boolean
  | null
  | Json[]
  | { [key: string]: Json };

type DeepReadonly<T> = T extends (...args: never[]) => unknown
  ? T
  : T extends object
    ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
    : T;

type Settings = { theme: { colors: string[] } };
type FrozenSettings = DeepReadonly<Settings>;
// { readonly theme: { readonly colors: readonly string[] } }
```

### 18.5 When not to use conditional types

Conditional types are powerful and easy to overuse. A few cautions:

- **Readability matters.** If a teammate needs ten minutes to understand a type, it's probably too clever for application code. Libraries justify complex types because many users benefit from precise inference; most app code doesn't.
- **Conditional return types fight the implementation.** TypeScript can't narrow a generic `T` inside a function body to pick a branch of a conditional return type, so implementations end up full of casts:

  ```ts
  // ❌ Forces casts in the body
  function parse<T extends "number" | "date">(kind: T, raw: string): T extends "number" ? number : Date {
    return (kind === "number" ? Number(raw) : new Date(raw)) as T extends "number" ? number : Date;
  }

  // ✅ Overloads express the same contract with a checked implementation
  function parse2(kind: "number", raw: string): number;
  function parse2(kind: "date", raw: string): Date;
  function parse2(kind: "number" | "date", raw: string): number | Date {
    return kind === "number" ? Number(raw) : new Date(raw);
  }
  ```

- **Deep recursion is slow** and can hit the compiler's depth limits. Keep recursive types shallow where possible.

### Key Takeaways

- `T extends U ? X : Y` selects a type based on assignability.
- Conditionals distribute over unions when `T` is a bare type parameter; wrap in `[T]` to prevent that.
- `infer` captures types from inside other types.
- Prefer overloads over conditional return types for functions; keep app-level types readable.

### Exercises

1. Implement `MyAwaited<T>`, which unwraps nested promises.
2. Implement `ElementType<T>`: the element type for arrays, and `T` itself otherwise.
3. Implement `IsNever<T>`. Test it with `IsNever<never>` and explain why the obvious version fails.

---

## 19. Template Literal Types

Template literal types bring JavaScript's template string syntax to the type level.

### 19.1 Basics

```ts
type Greeting = `Hello, ${string}`;

const a: Greeting = "Hello, Ada"; // ✅
const b: Greeting = "Hi, Ada";    // ❌
```

With unions, they produce every combination:

```ts
type Size = "sm" | "md" | "lg";
type Variant = "primary" | "secondary";

type ButtonClass = `btn-${Variant}-${Size}`;
// "btn-primary-sm" | "btn-primary-md" | ... (6 members)
```

### 19.2 Practical uses

**Constraining string formats:**

```ts
type Duration = `${number}ms` | `${number}s` | `${number}m`;

function configureTimeout(operation: string, timeout: Duration): void { /* ... */ }

configureTimeout("db.query", "500ms"); // ✅
configureTimeout("db.query", "500");   // ❌
```

**Deriving event handler names:**

```ts
type Events = "click" | "hover" | "focus";
type HandlerName = `on${Capitalize<Events>}`; // "onClick" | "onHover" | "onFocus"
```

**Extracting route parameters**, a pattern used by type-safe routers:

```ts
type RouteParams<Path extends string> =
  Path extends `${string}:${infer Param}/${infer Rest}`
    ? { [K in Param | keyof RouteParams<Rest>]: string }
    : Path extends `${string}:${infer Param}`
      ? { [K in Param]: string }
      : {};

type P = RouteParams<"/users/:userId/posts/:postId">;
// { userId: string; postId: string }

function buildPath<Path extends string>(path: Path, params: RouteParams<Path>): string {
  return path.replace(/:(\w+)/g, (_, key: string) => (params as Record<string, string>)[key] ?? "");
}

buildPath("/users/:userId/posts/:postId", { userId: "1", postId: "9" }); // ✅
buildPath("/users/:userId", { id: "1" });                                // ❌
```

This is a good example of where a library-level type pays off: the type is complex, but every call site gets precise checking for free.

### Key Takeaways

- Template literal types describe string patterns and generate combinations from unions.
- Combine them with `Capitalize` and friends and with key remapping to derive names.
- Combined with `infer`, they can parse string literals, e.g. route parameters.

### Exercises

1. Write `EventName<T extends string>` so that `EventName<"order">` is `"orderCreated" | "orderUpdated" | "orderDeleted"`.
2. Write `Split<S, D>` that splits a string literal into a tuple: `Split<"a.b.c", ".">` is `["a", "b", "c"]`.

---

## 20. Reading and Debugging Types

Knowing features is half the job. The other half is figuring out *why* the compiler disagrees with you. This chapter covers the practical skills for that.

### 20.1 Read errors from the bottom up

TypeScript reports a mismatch as a chain: a general summary first, then increasingly specific reasons, indented. The most useful line is usually the **last** one.

```text
Argument of type '{ id: string; profile: { age: string; }; }' is not assignable to parameter of type 'User'.
  The types of 'profile.age' are incompatible between these types.
    Type 'string' is not assignable to type 'number'.
```

Read it in reverse: "a `string` was given where a `number` is expected, at `profile.age`, inside the argument". Then jump to where `profile.age` was created. The top line tells you *where* the check happened; the bottom tells you *what* is wrong.

### 20.2 Inspect types instead of guessing

- **Hover** in your editor. For a complex type, hover over each piece separately.
- **Name intermediate types** so you can hover them: `type Step1 = Parameters<typeof handler>;` then `type Step2 = Step1[0];`.
- **Use the TypeScript Playground** (typescriptlang.org/play). Select the TypeScript version you use, and write `// ^?` under an expression to pin its type inline, exactly like the examples in this guide.
- **Force an error that prints the type.** Assigning a value to `never` makes the compiler show you its type in the message:

  ```ts
  const probe: never = someValue; // ❌ Type '{ ...the full type... }' is not assignable to type 'never'
  ```

### 20.3 Make hovers readable with `Prettify`

Intersections and mapped types often display as an unreadable composition (`Omit<User, "passwordHash"> & { roles: Role[] }`) instead of the resulting shape. A tiny helper flattens them:

```ts
type Prettify<T> = { [K in keyof T]: T[K] } & {};

type AdminUser = Prettify<Omit<User, "passwordHash"> & { roles: Role[] }>;
// hover shows: { id: string; email: string; name: string; role: ...; createdAt: Date; roles: Role[] }
```

The mapped type rebuilds the object key by key; the `& {}` nudges the editor to display the computed result rather than the alias. Use it for types you hover often, especially in library APIs. It doesn't change assignability.

### 20.4 Reduce to a minimal reproduction

When a type error makes no sense, cut the problem down:

1. Copy the failing code into the Playground (or a scratch file).
2. Replace imported types with inline copies of just the members involved.
3. Delete everything that doesn't affect the error, one piece at a time.

Most of the time the cause becomes obvious halfway through. If it doesn't, you now have exactly what a colleague or an issue tracker needs.

### 20.5 Common error messages, decoded

| Message (abbreviated) | Usual cause | Usual fix |
|---|---|---|
| `'x' is possibly 'undefined'` | Optional value, `find`, `Map.get`, or index access with `noUncheckedIndexedAccess` | Narrow with a check, provide a default with `??`, or throw |
| `Object literal may only specify known properties` | Typo, or a property the type doesn't declare (excess property check) | Fix the name, or add the property to the type |
| `Type 'string' is not assignable to type '"GET" \| "POST"'` | Literal widened to `string` (Chapter 3) | Annotate, use `as const`, or `satisfies` |
| `Element implicitly has an 'any' type because expression of type 'string' can't be used to index type ...` | Indexing an object with an arbitrary `string`, often from `Object.keys` (Chapter 10) | Use `Object.entries`, a `keyof` type, or a `Map` |
| `Index signature for type 'string' is missing in type 'X'` | An `interface` passed where `Record<string, ...>` is required (Chapter 6) | Use a `type` alias, or loosen the constraint to `object` |
| `Argument of type 'X' is not assignable to parameter of type 'never'` | Calling a union of functions (parameters intersect), or pushing into an array inferred as `never[]` | Narrow first; annotate the empty array |
| `'T' could be instantiated with an arbitrary type which could be unrelated to ...` | Returning a concrete value where a generic `T` is promised | Return something derived from the inputs, or rethink the signature |
| `This comparison appears to be unintentional because the types ... have no overlap` | Comparing values that can never be equal, often after narrowing | Usually a real bug; check the logic |
| `Type instantiation is excessively deep and possibly infinite` | Recursive conditional or mapped type with no depth limit | Simplify, add a recursion limit, or use a less precise type |
| `Assertions require every name in the call target to be declared with an explicit type annotation` | Calling an assertion function declared as an untyped arrow (Chapter 7) | Use a `function` declaration or annotate the variable |

### 20.6 When types misbehave for no obvious reason

- **Check which configuration applies.** A file outside `include` isn't checked by your project config; a test file may be governed by a different `tsconfig`.
- **Check which TypeScript your editor runs.** Editors can use a bundled version or the workspace version. Make sure it matches the TypeScript 7 version in your `package.json`.
- **Restart the language server** after changing `tsconfig.json`, `package.json` `exports`, or installed packages.
- **Investigate module resolution** with `tsc --traceResolution` (why did this import resolve to that file?) and `tsc --explainFiles` (why is this file part of the program?). These flags exist in TypeScript 6; check `tsc --help` for their status in your TypeScript 7 version.

### Key Takeaways

- Read error chains from the last line up.
- Hover, name intermediate types, use `// ^?` in the Playground, or assign to `never` to print a type.
- `Prettify<T>` makes intersections readable.
- Shrink confusing errors to a minimal reproduction.
- Learn the common messages; most have a standard cause and fix.

### Exercises

1. A generic `TypedEmitter<Events extends Record<string, unknown>>` works with `type AppEvents = {...}` but fails with `interface AppEvents {...}` with "Index signature for type 'string' is missing". Explain why and give two fixes.
2. Write `Prettify` and use it to display the result of `Pick<User, "id"> & Partial<Pick<User, "name" | "email">>` as a single object type.

---

# Part IV — Real-World Patterns

## 21. Error Handling

### 21.1 `catch` variables are `unknown`

JavaScript can `throw` anything: strings, numbers, objects, `undefined`. Under `strict` (`useUnknownInCatchVariables`), the `catch` variable is therefore `unknown`, and you must narrow it:

```ts
try {
  await saveDocument(doc);
} catch (error) {
  //     ^? unknown
  if (error instanceof Error) {
    logger.error(error.message, { stack: error.stack });
  } else {
    logger.error("Non-error thrown", { error });
  }
}
```

A small helper keeps this tidy:

```ts
import { inspect } from "node:util";

export function toError(value: unknown): Error {
  if (value instanceof Error) return value;
  const message = typeof value === "string" ? value : inspect(value, { depth: 3 });
  return new Error(message, { cause: value });
}
```

An error-normalizing helper must never throw itself. `inspect` handles any value, while `JSON.stringify` throws on circular structures and `BigInt` and returns `undefined` for `undefined`, functions, and symbols. Passing the original as `cause` keeps it available for debugging.

```ts
```

The same applies to `.catch()` callbacks on promises, whose parameter is typed `any` by the standard library. Annotate it as `unknown` (`promise.catch((error: unknown) => ...)`), or prefer `try`/`await`. The lint rule `@typescript-eslint/use-unknown-in-catch-callback-variable` enforces this.

### 21.2 Custom error classes

Custom errors let callers distinguish failures with `instanceof` and carry structured context:

```ts
export class AppError extends Error {
  override readonly name: string = "AppError";
}

export class NotFoundError extends AppError {
  override readonly name = "NotFoundError";
  readonly resource: string;
  readonly id: string;

  constructor(resource: string, id: string, options?: ErrorOptions) {
    super(`${resource} ${id} not found`, options);
    this.resource = resource;
    this.id = id;
  }
}

export class ValidationError extends AppError {
  override readonly name = "ValidationError";
  readonly issues: ReadonlyArray<{ path: string; message: string }>;

  constructor(issues: ReadonlyArray<{ path: string; message: string }>, options?: ErrorOptions) {
    super(`Validation failed: ${issues.length} issue(s)`, options);
    this.issues = issues;
  }
}
```

Always pass the original error as `cause` when wrapping. It preserves the full chain for debugging:

```ts
try {
  return await db.users.findUniqueOrThrow({ where: { id } });
} catch (error) {
  throw new NotFoundError("User", id, { cause: error });
}
```

And at the edge (e.g., an HTTP handler), map errors to responses:

```ts
function toHttpStatus(error: unknown): number {
  if (error instanceof NotFoundError) return 404;
  if (error instanceof ValidationError) return 400;
  return 500;
}
```

### 21.3 Errors as values: the `Result` type

TypeScript doesn't track what a function throws. A signature `function getUser(id: string): Promise<User>` says nothing about the three ways it can fail. For **expected** failures, many teams return errors as values instead:

```ts
export type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };

export const ok = <T>(value: T): Result<T, never> => ({ ok: true, value });
export const err = <E>(error: E): Result<never, E> => ({ ok: false, error });
```

```ts
type WithdrawError =
  | { code: "INSUFFICIENT_FUNDS"; available: number }
  | { code: "ACCOUNT_FROZEN" }
  | { code: "LIMIT_EXCEEDED"; limit: number };

function withdraw(account: Account, amount: number): Result<Account, WithdrawError> {
  if (account.frozen) return err({ code: "ACCOUNT_FROZEN" });
  if (amount > account.dailyLimit) return err({ code: "LIMIT_EXCEEDED", limit: account.dailyLimit });
  if (amount > account.balance) return err({ code: "INSUFFICIENT_FUNDS", available: account.balance });
  return ok({ ...account, balance: account.balance - amount });
}

function withdrawalMessage(account: Account, amount: number): string {
  const result = withdraw(account, amount);

  if (!result.ok) {
    switch (result.error.code) {
      case "INSUFFICIENT_FUNDS": return `Only ${result.error.available} available`;
      case "ACCOUNT_FROZEN":     return "Account is frozen";
      case "LIMIT_EXCEEDED":     return `Daily limit is ${result.error.limit}`;
    }
  }

  return `New balance: ${result.value.balance}`; // narrowed: value exists here
}
```

The failure modes are now part of the type, and exhaustiveness checking forces callers to handle each one.

**Exceptions or results?** A balanced, widely used rule:

- Use **`Result`** for expected, recoverable domain failures the caller should handle (validation failures, business rule violations, "not found" in a lookup).
- Use **exceptions** for unexpected failures and bugs (programming errors, broken invariants, infrastructure outages) that should propagate to a top-level handler.

Libraries such as `neverthrow` and `Effect` offer richer versions of this idea. A hand-rolled `Result` like the one above covers most needs without adding a dependency or a new programming style your whole team must learn.

### Key Takeaways

- `catch` variables are `unknown`; narrow with `instanceof Error`.
- Use custom error classes with a `name` and structured fields; always chain with `cause`.
- Normalize unknown thrown values with `util.inspect`, never `JSON.stringify`.
- Return a `Result` for expected failures so they appear in types; throw for bugs and outages.

---

## 22. Validating Data at the Boundaries

### 22.1 Trust boundaries

Recall from Chapter 1: types are erased and can't check runtime data. Every place data enters your program is a **trust boundary**:

- HTTP request bodies, query strings, and headers
- Responses from external APIs
- Environment variables and configuration files
- Database rows (especially JSON columns)
- Message queues, webhooks, and messages between worker threads
- Cookies, URL path and query parameters, form submissions, file uploads
- `JSON.parse` of anything

At each boundary, data is `unknown` until validated. Inside the boundary, validated data can be trusted and fully typed.

### 22.2 Hand-written validation

For simple shapes, a type guard works:

```ts
type Coordinates = { lat: number; lng: number };

function isCoordinates(value: unknown): value is Coordinates {
  return (
    typeof value === "object" &&
    value !== null &&
    "lat" in value && typeof value.lat === "number" &&
    "lng" in value && typeof value.lng === "number"
  );
}
```

This quickly becomes tedious and error-prone for real payloads, and the guard can drift out of sync with the type. That's what schema libraries solve.

### 22.3 Schema validation libraries

The standard approach is to define a **schema** once and derive both runtime validation and the static type from it. The most widely used libraries are Zod, Valibot, and ArkType. The examples use Zod (version 4):

```ts
import { z } from "zod";

export const UserSchema = z.object({
  id: z.string().min(1),
  email: z.email(),
  name: z.string().min(1).max(100),
  role: z.enum(["admin", "member"]),
  age: z.number().int().positive().optional(),
  tags: z.array(z.string()).default([]),
});

export type User = z.infer<typeof UserSchema>;
// { id: string; email: string; name: string; role: "admin" | "member"; age?: number | undefined; tags: string[] }
```

There's one definition. The type can never drift from the validation logic.

**Input vs output types.** `z.infer` (an alias of `z.output`) is the type *after* parsing. When a schema uses `.default()`, `.transform()`, or `z.coerce`, the type it *accepts* is different: in `UserSchema`, `tags` may be omitted on input but is always present on output. Use `z.input` for raw data you're about to parse, such as a request body or a test fixture, and `z.infer`/`z.output` for the validated result:

```ts
type UserInput = z.input<typeof UserSchema>;   // tags?: string[] | undefined
type UserOutput = z.output<typeof UserSchema>; // tags: string[]
```

Parsing returns typed data or reports exactly what's wrong:

```ts
// parse() throws on invalid data
const user = UserSchema.parse(await response.json());

// safeParse() returns a discriminated union instead of throwing
const result = UserSchema.safeParse(body);
if (!result.success) {
  return reply.status(400).send({ issues: result.error.issues });
}
const validUser = result.data; // User
```

### 22.4 A typed, honest `fetch` wrapper

Compare this with the "return-only generic" anti-pattern from Chapter 11. The type parameter is now tied to a schema that actually checks the data:

```ts
import type { z } from "zod";

export async function fetchJson<S extends z.ZodType>(
  url: string,
  schema: S,
  init?: RequestInit,
): Promise<z.infer<S>> {
  const response = await fetch(url, init);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}`);
  }
  const data: unknown = await response.json();
  return schema.parse(data);
}

const user = await fetchJson("/api/users/1", UserSchema); // ^? User — validated
```

### 22.5 Library-agnostic validation with Standard Schema

Zod, Valibot, ArkType, and others implement **Standard Schema**, a shared interface. Frameworks and libraries that accept "a schema" (form libraries, routers, API frameworks) increasingly accept any Standard Schema–compliant validator, so you're not locked into one library. If you write a reusable utility, you can accept any of them:

```ts
import type { StandardSchemaV1 } from "@standard-schema/spec";

export async function validate<S extends StandardSchemaV1>(
  schema: S,
  input: unknown,
): Promise<StandardSchemaV1.InferOutput<S>> {
  const result = await schema["~standard"].validate(input);
  if (result.issues) {
    throw new Error(result.issues.map((i) => i.message).join("; "));
  }
  return result.value;
}
```

### 22.6 Validating configuration at startup

Environment variables are strings or missing. Validate them once, at startup, and export a typed object:

```ts
// config.ts
import { z } from "zod";

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  DATABASE_URL: z.url(),
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
});

export const config = EnvSchema.parse(process.env);
// The app fails fast at boot with a clear message if configuration is wrong,
// rather than crashing hours later on the first request that needs DATABASE_URL.
```

The rest of the codebase imports `config`, never `process.env` directly.

### Key Takeaways

- Every external input is `unknown` until validated.
- Define schemas once and derive types with `z.infer` (or the equivalent in your library).
- `z.infer` is the parsed output; use `z.input` for raw input when the two differ.
- Tie generic return types to a schema so the type is backed by a runtime check.
- Validate environment variables at startup and export a typed config.

---

## 23. Branded (Nominal) Types

### 23.1 The problem

Because typing is structural, types with the same shape are interchangeable:

```ts
type UserId = string;
type OrderId = string;

function cancelOrder(orderId: OrderId): void { /* ... */ }

const userId: UserId = "u_123";
cancelOrder(userId); // ✅ compiles — but it's a bug
```

Type aliases are just names; they don't create distinct types.

### 23.2 The brand pattern

A **branded type** adds a phantom property that exists only in the type system, making otherwise-identical types incompatible:

```ts
declare const brand: unique symbol;
type Brand<T, Name extends string> = T & { readonly [brand]: Name };

type UserId = Brand<string, "UserId">;
type OrderId = Brand<string, "OrderId">;

function cancelOrder(orderId: OrderId): void { /* ... */ }

const userId = "u_123" as UserId;
cancelOrder(userId);       // ❌ Type 'UserId' is not assignable to type 'OrderId'
cancelOrder("o_456");      // ❌ a plain string isn't an OrderId either
```

The brand property never exists at runtime. `declare const brand: unique symbol` creates a symbol type without emitting any code, so nobody can accidentally construct the property.

### 23.3 Smart constructors: brands that mean "validated"

Brands become really valuable when the only way to create one is through a function that validates:

```ts
type Email = Brand<string, "Email">;

function parseEmail(input: string): Email {
  const trimmed = input.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    throw new Error(`Invalid email: ${input}`);
  }
  return trimmed as Email; // the one sanctioned assertion
}

function sendWelcome(to: Email): void { /* ... */ }

sendWelcome("not-an-email");             // ❌
sendWelcome(parseEmail(form.email));     // ✅ guaranteed validated
```

Now `Email` doesn't just mean "a string"; it means "a string that has passed validation". Functions accepting `Email` never need to re-validate. This is the "parse, don't validate" principle, covered more in Chapter 28.

Other good candidates for brands:

- IDs from different tables (`UserId`, `OrderId`).
- Units (`Meters` vs `Feet`, `Cents` vs `Dollars`).
- Sanitized or trusted strings (`SafeHtml`, `SqlIdentifier`).
- Validated numbers (`PositiveInt`, `Percentage`).

Validation libraries support brands directly. Zod's `.brand()` produces a branded output type, so the only way to obtain one is to parse:

```ts
import { z } from "zod";

const OrderIdSchema = z.string().startsWith("o_").brand<"OrderId">();
type ZodOrderId = z.infer<typeof OrderIdSchema>; // a string branded "OrderId"

const orderId = OrderIdSchema.parse(request.params.id); // validated and branded in one step
```

Zod's brand and a hand-rolled `Brand` type are separate brands that aren't interchangeable, so pick one style per codebase. This is where branded types and the boundary validation from Chapter 22 meet: parse once at the edge, and the brand carries the proof inward.

### Key Takeaways

- Type aliases don't create distinct types; brands do.
- A brand is a phantom, type-only property; it costs nothing at runtime.
- Pair brands with validating constructors so the type proves the data was checked.

---

## 24. Asynchronous Code

### 24.1 Typing async functions

An `async` function always returns a `Promise`:

```ts
async function getUser(id: string): Promise<User> {
  const row = await db.findUser(id);
  if (!row) throw new NotFoundError("User", id);
  return toUser(row);
}
```

`Awaited<T>` gives the resolved type, unwrapping nested promises:

```ts
type A = Awaited<Promise<Promise<number>>>; // number
type UserResult = Awaited<ReturnType<typeof getUser>>; // User
```

### 24.2 Combinators keep tuple types

`Promise.all` preserves positional types:

```ts
const [user, orders, settings] = await Promise.all([
  getUser(id),        // Promise<User>
  getOrders(id),      // Promise<Order[]>
  getSettings(id),    // Promise<Settings>
]);
// user: User, orders: Order[], settings: Settings
```

`Promise.allSettled` returns a discriminated union per result, which narrows on `status`:

```ts
const results = await Promise.allSettled(urls.map((url) => fetch(url)));

for (const result of results) {
  if (result.status === "fulfilled") {
    console.log(result.value.status); // Response
  } else {
    console.error(result.reason);     // any — treat as unknown
  }
}
```

### 24.3 Floating promises

A promise that's never awaited or handled is a **floating promise**. If it rejects, the error is lost or crashes the process as an unhandled rejection:

```ts
async function handleRequest() {
  saveAuditLog(event);   // ❌ floating: errors vanish, and ordering isn't guaranteed
  await saveAuditLog(event); // ✅
}
```

The lint rule `@typescript-eslint/no-floating-promises` catches this, and it's one of the most valuable type-aware rules. When fire-and-forget is genuinely intended, make it explicit and handle errors:

```ts
void saveAuditLog(event).catch((error: unknown) => logger.warn("Audit log failed", { error }));
```

A related trap: passing an async function where a `void` callback is expected, like `array.forEach(async (x) => ...)`. The promises float. Use `for...of` with `await` for sequential work or `Promise.all` with `map` for parallel work. The rule `@typescript-eslint/no-misused-promises` flags this.

### 24.4 Cancellation with `AbortSignal`

Long-running operations should accept an `AbortSignal`, the standard cancellation mechanism across `fetch`, Node.js APIs, and most modern libraries:

```ts
async function searchProducts(query: string, signal?: AbortSignal): Promise<Product[]> {
  const response = await fetch(`${config.CATALOG_URL}/products?q=${encodeURIComponent(query)}`, { signal });
  if (!response.ok) throw new Error(`Catalog search failed: HTTP ${response.status}`);
  return ProductListSchema.parse(await response.json());
}

// Time out after 5 seconds
const products = await searchProducts("lamp", AbortSignal.timeout(5000));

// Cancel when either the user navigates away or the timeout fires
const controller = new AbortController();
const signal = AbortSignal.any([controller.signal, AbortSignal.timeout(5000)]);
const results = searchProducts("desk", signal);
controller.abort(); // e.g., when a newer search starts
```

### 24.5 `Promise.withResolvers`

When you need to resolve a promise from outside its executor, `Promise.withResolvers` (ES2024) replaces the old "deferred" pattern:

```ts
function waitForEvent<T>(emitter: TypedEmitter<Record<string, T>>, event: string): Promise<T> {
  const { promise, resolve } = Promise.withResolvers<T>();
  const off = emitter.on(event, (payload) => {
    off();
    resolve(payload);
  });
  return promise;
}
```

**`Promise.try`** (ES2025, supported by Node.js 24) calls a function that may be synchronous or asynchronous and always gives you a promise. A synchronous `throw` becomes a rejection instead of escaping the promise chain:

```ts
function loadPlugin(name: string): Promise<Plugin> {
  // registry.load may throw synchronously or return a promise; callers only handle rejections
  return Promise.try(() => registry.load(name));
}
```

### 24.6 Async iteration

Async generators produce values over time, which suits pagination and streams:

```ts
async function* fetchAllPages<T>(
  fetchPage: (cursor: string | undefined) => Promise<{ items: T[]; next?: string }>,
): AsyncGenerator<T, void, undefined> {
  let cursor: string | undefined;
  do {
    const page = await fetchPage(cursor);
    yield* page.items;
    cursor = page.next;
  } while (cursor);
}

for await (const customer of fetchAllPages(fetchCustomerPage)) {
  console.log(customer.id);
}
```

### 24.7 Explicit resource management: `using`

Resources that must be released (file handles, database connections, locks, temporary directories) traditionally need `try`/`finally`. The `using` declaration (TypeScript 5.2+, part of ECMAScript's explicit resource management) disposes a resource automatically when it goes out of scope:

```ts
class DbConnection implements AsyncDisposable {
  static async open(url: string): Promise<DbConnection> { /* ... */ }
  async query(sql: string): Promise<unknown[]> { /* ... */ }

  async [Symbol.asyncDispose](): Promise<void> {
    await this.close();
  }
  private async close(): Promise<void> { /* ... */ }
}

async function countUsers(): Promise<number> {
  await using conn = await DbConnection.open(config.DATABASE_URL);
  const rows = await conn.query("SELECT id FROM users");
  return rows.length;
} // conn[Symbol.asyncDispose]() runs here, even if query throws
```

- `using` works with objects implementing `[Symbol.dispose]()` (synchronous).
- `await using` works with `[Symbol.asyncDispose]()` (asynchronous).
- `DisposableStack` and `AsyncDisposableStack` manage several resources together.

Node.js 24 supports `using` natively. Keep `"esnext.disposable"` in `lib` (as in the Appendix A configs) so TypeScript knows about `Symbol.dispose`, `DisposableStack`, and related types. With a `target` below `esnext`, `tsc` downlevels `using` into equivalent `try`/`finally` code; under type stripping, Node runs it as written.

### Key Takeaways

- Annotate async functions as returning `Promise<T>`; use `Awaited` to unwrap.
- `Promise.all` preserves tuple types; `allSettled` gives a discriminated union.
- Never leave promises floating; enable `no-floating-promises` and `no-misused-promises`.
- Accept `AbortSignal` in long-running operations.
- `Promise.try` turns a sync-or-async call into a promise, so synchronous throws become rejections.
- Use `using`/`await using` for deterministic cleanup.

---

## 25. Collections and Modern Built-ins

Writing up-to-date TypeScript also means using up-to-date JavaScript. Unless noted, these APIs are all available in Node.js 24; your `lib` setting must include them too (the Appendix A configs use `es2025`).

### 25.1 Non-mutating array methods (ES2023)

Classic `sort`, `reverse`, and `splice` mutate the array in place, a frequent source of bugs (especially with shared or cached data). ES2023 added copying versions:

```ts
const scores = [42, 7, 19];

const ranked = scores.toSorted((a, b) => b - a);   // [42, 19, 7]; scores unchanged
const reversed = scores.toReversed();              // [19, 7, 42]
const withoutFirst = scores.toSpliced(0, 1);       // [7, 19]
const updated = scores.with(1, 100);               // [42, 100, 19]
```

These work on readonly arrays too, since they don't mutate. Also useful:

```ts
const last = scores.at(-1);                         // number | undefined
const lastBig = scores.findLast((s) => s > 10);    // 19
```

Always pass a comparator to `sort`/`toSorted` for numbers. The default sort compares strings: `[10, 9, 1].toSorted()` gives `[1, 10, 9]`.

### 25.2 Grouping (ES2024)

```ts
type Order = { id: string; customerId: string; status: "pending" | "paid" | "shipped"; total: number };

const byStatus = Object.groupBy(orders, (order) => order.status);
//    ^? Partial<Record<"pending" | "paid" | "shipped", Order[]>>

const paid = byStatus.paid ?? []; // a group may be missing, hence Partial

const byCustomer = Map.groupBy(orders, (order) => order.customerId); // Map<string, Order[]>
```

Notice the `Partial` in the result type. TypeScript models the reality that a group with no members isn't present.

### 25.3 `Map` and `Set`

```ts
const cache = new Map<string, User>();
cache.set(user.id, user);

const hit = cache.get("u1"); // User | undefined — always handle the miss

const visited = new Set<string>();
if (!visited.has(url)) visited.add(url);
```

ES2025 added set algebra methods:

```ts
const frontend = new Set(["ada", "linus", "grace"]);
const backend = new Set(["linus", "ken"]);

frontend.union(backend);               // Set {"ada", "linus", "grace", "ken"}
frontend.intersection(backend);        // Set {"linus"}
frontend.difference(backend);          // Set {"ada", "grace"}
frontend.symmetricDifference(backend); // Set {"ada", "grace", "ken"}
frontend.isSubsetOf(backend);          // false
```

TypeScript 6.0+ also ships types for the newer `Map` "upsert" methods, `getOrInsert` and `getOrInsertComputed`, which replace the `if (!map.has(k)) map.set(k, ...)` dance. **Node.js 24 doesn't implement them**, so keep them out of your `lib` and keep using `get` followed by `set` until your runtime ships them.

### 25.4 Iterator helpers (ES2025)

Iterators (from `Map`, `Set`, generators) now have lazy `map`, `filter`, `take`, `drop`, `flatMap`, `reduce`, `some`, `every`, `find`, and `toArray`:

```ts
const activeEmails = users
  .values()                         // iterator, not an array
  .filter((u) => u.active)
  .map((u) => u.email)
  .take(10)
  .toArray();                       // string[]
```

Because they're lazy, no intermediate arrays are created. This is useful for large collections and infinite generators.

### 25.5 Other modern essentials

```ts
// Deep clone of plain data (handles Date, Map, Set, cycles); not for class instances with methods
const copy = structuredClone(original);

// Own-property check (safer than obj.hasOwnProperty)
if (Object.hasOwn(payload, "email")) { /* ... */ }

// Safe regular expression from user input (types included since TS 6.0)
const pattern = new RegExp(RegExp.escape(userInput), "i");

// UUIDs without a dependency
const id = crypto.randomUUID();
```

**Dates.** TypeScript 6.0+ includes types for **Temporal**, the modern replacement for `Date` (immutable, time-zone aware, no zero-indexed months). **Node.js 24 doesn't ship Temporal**, so use a polyfill if you want its API today. Otherwise keep `Date` at the edges, and store and transmit timestamps as ISO strings or epoch milliseconds.

### 25.6 Iterables and generators

Anything with a `[Symbol.iterator]()` method works with `for...of`, spread, `Array.from`, and destructuring. A generator method is the easiest way to implement one:

```ts
class Paginated<T> implements Iterable<T> {
  readonly #pages: ReadonlyArray<readonly T[]>;

  constructor(pages: ReadonlyArray<readonly T[]>) {
    this.#pages = pages;
  }

  *[Symbol.iterator](): Generator<T, void, undefined> {
    for (const page of this.#pages) yield* page;
  }
}

const results = new Paginated([[1, 2], [3]]);
for (const n of results) console.log(n); // n: number
const all = [...results];                // number[]
```

`Generator<Yield, Return, Next>` has three type parameters: the type of each yielded value, the type returned when the generator finishes, and the type accepted by `next(value)`. Most generators are `Generator<T, void, undefined>`; annotate it on exported generators, like any public return type.

Two habits:

- **Accept `Iterable<T>`** in functions that only loop over their input, so callers can pass arrays, sets, map keys, or generators.
- **Generators get iterator helpers** (25.4), because generator objects are iterators: `numbers().filter(isEven).take(5).toArray()`.

### Key Takeaways

- Prefer `toSorted`, `toReversed`, `toSpliced`, and `with` over mutating methods.
- `Object.groupBy` returns a `Partial` record; handle missing groups.
- Use `Map`/`Set` and their modern methods; use iterator helpers for lazy pipelines.
- Keep `lib` aligned with the runtimes you support.
- Implement iterables with generator methods; accept `Iterable<T>` for read-only loops.

---

## 26. Immutability

Immutable data is easier to reason about, safer to share, and works naturally with UI frameworks that detect changes by reference. TypeScript gives you compile-time tools to enforce it.

### 26.1 The toolkit

```ts
// Readonly properties
type Point = { readonly x: number; readonly y: number };

// Readonly arrays — no push, pop, splice, sort, or index assignment
const ids: readonly string[] = ["a", "b"];
ids.push("c"); // ❌

// Readonly collections
const lookup: ReadonlyMap<string, number> = new Map([["a", 1]]);
const tags: ReadonlySet<string> = new Set(["x"]);

// Readonly<T> for a whole object (shallow)
type Config = Readonly<{ url: string; retries: number }>;

// as const for deeply readonly literals
const DEFAULTS = { retries: 3, backoff: { baseMs: 100, maxMs: 5000 } } as const;
```

### 26.2 Immutable updates

Produce new values instead of modifying old ones:

```ts
type State = Readonly<{
  user: Readonly<{ name: string; tags: readonly string[] }>;
  items: readonly Item[];
}>;

function renameUser(state: State, name: string): State {
  return { ...state, user: { ...state.user, name } };
}

function addItem(state: State, item: Item): State {
  return { ...state, items: [...state.items, item] };
}

function updateItem(state: State, index: number, item: Item): State {
  return { ...state, items: state.items.with(index, item) };
}
```

### 26.3 Protect internal state

Return readonly views from classes so callers can't mutate internals:

```ts
class TodoList {
  #items: Todo[] = [];

  get items(): readonly Todo[] {
    return this.#items; // callers can read but can't push into your internal array
  }

  add(todo: Todo): void {
    this.#items.push(todo);
  }
}
```

### 26.4 Limits to know

- **`readonly` is compile-time only.** At runtime the object is fully mutable. Use `Object.freeze` when you need runtime protection; TypeScript types its result as `Readonly<T>`.
- **`Readonly<T>` and `Object.freeze` are shallow.** Nested objects remain mutable unless you use `as const`, a `DeepReadonly` type (Chapter 18), or freeze recursively.
- **A known gap:** an object with `readonly` properties is still assignable to a type with mutable properties, so readonly-ness can be lost through assignment. Readonly *arrays*, by contrast, are correctly not assignable to mutable arrays.

```ts
type Mutable = { x: number };
const frozen: { readonly x: number } = { x: 1 };
const m: Mutable = frozen; // ✅ compiles (unsound but allowed)
m.x = 2;                   // mutates "readonly" data
```

### Key Takeaways

- Use `readonly`, `readonly T[]`, `ReadonlyMap`, `ReadonlySet`, and `as const`.
- Update with spreads and non-mutating array methods.
- Return readonly views of internal state.
- Readonly is compile-time and shallow; freeze when runtime protection matters.

---

## 27. Sharing Types Across Service Boundaries

Types inside one program are checked by the compiler. Types *between* programs, such as a service and its clients, two services talking over a queue, or a service and its database, are only as reliable as the process that keeps them in sync. This chapter covers how teams do that.

### 27.1 The problem: contracts drift

When a server and a client each declare their own `Order` type, nothing stops them from diverging. Even when both import the *same* type from a shared package, they may be **deployed at different times**: an old client talks to a new server, or the reverse. A shared TypeScript type is a compile-time promise; the bytes on the wire are a runtime fact. So the rule from Chapter 22 still applies: **validate at every process boundary**, even when both sides are TypeScript.

### 27.2 Choosing a source of truth

| Approach | Source of truth | How types reach consumers | Fits when |
|---|---|---|---|
| **Contract-first** | OpenAPI, GraphQL schema, or Protobuf file | Code generation (e.g. `openapi-typescript`, GraphQL Code Generator, `buf`/`ts-proto`) | Public or polyglot APIs; several teams or languages |
| **Schema-first in TypeScript** | Zod (or another Standard Schema) schemas in a shared package | Import schemas and inferred types; optionally generate OpenAPI from them | TypeScript on both sides, but you still want runtime validation and documentation |
| **TypeScript RPC** | Server router/procedure definitions | The client infers types from the server's exported router type (e.g. tRPC) | One team owns client and server in the same monorepo |
| **Database-first** | Database schema | ORM or query builder infers row types (e.g. Drizzle, Prisma, Kysely) | Persistence layer only; don't expose rows directly (27.4) |

There's no single right answer. What matters is that each contract has **exactly one source of truth**, everything else is derived from it, and a CI step fails when the derived artifacts are stale (regenerate and check for a diff).

### 27.3 A shared contracts package

For TypeScript-on-both-sides systems, a small package of schemas is a simple and robust middle ground:

```ts
// packages/contracts/src/orders.ts
import { z } from "zod";

export const OrderStatus = z.enum(["pending", "paid", "shipped", "cancelled"]);

export const CreateOrderRequest = z.object({
  customerId: z.string().min(1),
  lines: z.array(z.object({ sku: z.string(), quantity: z.number().int().positive() })).min(1),
});
export type CreateOrderRequest = z.infer<typeof CreateOrderRequest>;

export const OrderResponse = z.object({
  id: z.string(),
  status: OrderStatus,
  total: z.number(),
  createdAt: z.iso.datetime(), // dates travel as ISO strings, not Date objects
});
export type OrderResponse = z.infer<typeof OrderResponse>;
```

The server validates requests with the schema; the client validates responses with it:

```ts
// server
const input = CreateOrderRequest.parse(request.body);
const order = await orders.create(input);
return toOrderResponse(order); // typed as OrderResponse, so the compiler checks the shape we send

// client
const created = await fetchJson(`${config.ORDERS_URL}/orders`, OrderResponse, {
  method: "POST",
  body: JSON.stringify(payload satisfies CreateOrderRequest),
});
```

Note the `createdAt` field. JSON has no `Date`, so a type that says `Date` on the wire is a lie as soon as it's serialized. Keep wire types honest (strings, numbers, plain objects) and convert at the edges.

### 27.4 Keep layers separate: rows, domain, and DTOs

Database row types, domain types, and API types (DTOs) describe the same entity for different audiences. Letting one type serve all three couples your public API to your table layout and is how fields like `passwordHash` leak into responses.

```ts
// Persistence: inferred from the database schema by your ORM
type UserRow = { id: string; email: string; password_hash: string; created_at: Date; deleted_at: Date | null };

// Domain: what your business logic works with
type User = { id: UserId; email: Email; passwordHash: string; createdAt: Date };

// API: what you promise clients (an allowlist, Chapter 16)
type UserDto = { id: string; email: string; createdAt: string };

function toUser(row: UserRow): User { /* validate and brand fields */ }
function toUserDto(user: User): UserDto {
  return { id: user.id, email: user.email, createdAt: user.createdAt.toISOString() };
}
```

The mapping functions are boring by design. They're also the one place where a schema change in one layer shows up as a compile error in another.

### 27.5 Evolving contracts safely

- **Additive changes are safe**: new optional request fields, new response fields.
- **Removing or renaming fields, narrowing types, or making fields required are breaking.** Version the API or migrate in steps (add new, migrate clients, remove old).
- **Be strict about what you accept and tolerant about what you read.** A client that parses responses with a strict `z.enum` will start failing the day the server adds a new status. For fields that may grow, consider parsing unknown values into an explicit fallback (e.g. `"unknown"`) instead of rejecting the whole response, and make sure your `switch` statements handle it.
- Treat shared contract packages with semver discipline, exactly like a published library (Chapter 31).

### Key Takeaways

- A shared type is a compile-time promise; validate at every process boundary anyway.
- Pick one source of truth per contract (OpenAPI/GraphQL/Protobuf, shared schemas, RPC router, or DB schema) and derive the rest.
- Keep wire types JSON-honest: ISO strings, not `Date`.
- Separate row, domain, and DTO types, and map between them explicitly.
- Additive changes are safe; everything else needs versioning or a staged migration.

---

## 28. Designing Good Types

Everything so far has been about features. This chapter is about judgment: how experienced engineers decide what types to write.

### 28.1 Make illegal states unrepresentable

If your type allows a state that should never happen, someday it will. Model with discriminated unions so invalid combinations can't be expressed:

```ts
// ❌ Which fields go with which method? The type doesn't say.
type Payment = {
  method: "card" | "bank" | "wallet";
  cardNumber?: string;
  expiry?: string;
  iban?: string;
  walletId?: string;
};

// ✅ Each method carries exactly its own data
type Payment2 =
  | { method: "card"; cardLast4: string; expiry: string }
  | { method: "bank"; iban: string }
  | { method: "wallet"; walletId: string };
```

A useful smell: **several optional properties that are "sometimes required together"** usually mean a union is hiding in your type.

### 28.2 Parse, don't validate

A *validating* function checks data and returns nothing useful: `isValidEmail(s): boolean`. Afterwards, the type is still `string`, so every function downstream must either re-check or trust.

A *parsing* function checks data and returns a **more precise type**: `parseEmail(s): Email`. The type system now carries the proof (Chapter 23). Do the parsing once, at the boundary, and the rest of your code works with types that can't be invalid.

```ts
// Boundary: unknown → precise domain types
const order = OrderSchema.parse(requestBody);   // Order, with branded ids and validated fields

// Core: functions accept only precise types, no defensive checks needed
function applyDiscount(order: Order, code: DiscountCode): Order { /* ... */ }
```

### 28.3 Keep a single source of truth

When two types describe the same thing, they will drift apart. Derive instead of duplicating:

| Source of truth | Derived with |
|---|---|
| A runtime schema | `z.infer<typeof Schema>` |
| A constant object or array | `typeof X`, `keyof typeof X`, `(typeof X)[number]` |
| A function | `ReturnType`, `Parameters` |
| A base entity type | `Pick`, `Omit`, `Partial`, mapped types |
| A database schema | your ORM's generated or inferred types |
| An API contract | types generated from OpenAPI or GraphQL schemas |

### 28.4 Replace booleans with unions

Booleans multiply states and hide meaning:

```ts
// ❌ 4 combinations, one of which (isDraft && isPublished) is nonsense
type Post = { isDraft: boolean; isPublished: boolean };

// ✅ Exactly the valid states, and easy to extend with "scheduled" later
type Post2 = { status: "draft" | "published" | "archived" };
```

The same applies to function parameters: `render(true)` is unreadable; `render({ mode: "compact" })` is not.

### 28.5 Accept broad inputs, return precise outputs

Make functions easy to call and their results easy to use:

```ts
// Accept: readonly arrays, minimal interfaces (only what you use)
function totalPrice(items: ReadonlyArray<{ price: number; quantity: number }>): number {
  return items.reduce((sum, i) => sum + i.price * i.quantity, 0);
}

// Return: specific types
function getStatus(order: Order): "open" | "closed" { /* ... */ } // not `string`
```

Asking for `ReadonlyArray<{ price: number; quantity: number }>` instead of `CartItem[]` means the function works with cart items, order lines, invoice rows, or test fixtures, as long as they have the two fields it actually uses.

### 28.6 Depend on small interfaces

Define what a module *needs* from its dependencies as small interfaces or function types, rather than importing concrete implementations:

```ts
type Clock = { now: () => Date };
type SendEmail = (to: Email, subject: string, body: string) => Promise<void>;

function createPasswordReset(deps: { clock: Clock; sendEmail: SendEmail; tokens: TokenStore }) {
  return async function requestReset(email: Email): Promise<void> {
    const token = await deps.tokens.create(email, { expiresAt: addHours(deps.clock.now(), 1) });
    await deps.sendEmail(email, "Reset your password", `Token: ${token}`);
  };
}
```

Tests can now pass a fixed clock and a fake email sender, with no mocking library required.

### 28.7 Don't over-engineer types

Precise types are valuable up to the point where they cost more than they save. Signs you've gone too far:

- A type takes longer to understand than the code it describes.
- Error messages from your types are pages long and unreadable.
- Type-checking noticeably slows down because of deep recursion or huge unions.
- You need casts inside the implementation to satisfy your own types.

Libraries can justify complex types because thousands of call sites benefit. Application code usually benefits more from simple, explicit types and a few well-placed discriminated unions.

### 28.8 Document public types

Types say *what*; JSDoc says *why* and *how*. Editors show JSDoc on hover, so it's worth writing for exported APIs:

```ts
/**
 * Retries an async operation with exponential backoff.
 *
 * @param operation - The function to retry. Receives the attempt number (starting at 1).
 * @param options.maxAttempts - Total attempts including the first. Defaults to 3.
 * @throws The last error if every attempt fails.
 *
 * @example
 * const data = await retry(() => fetchJson(url, Schema), { maxAttempts: 5 });
 */
export async function retry<T>(
  operation: (attempt: number) => Promise<T>,
  options: { maxAttempts?: number; baseDelayMs?: number } = {},
): Promise<T> {
  // ...
}

/** @deprecated Use {@link retry} instead. Will be removed in v3. */
export const retryAsync = retry;
```

`@deprecated` shows the API as struck-through in editors, and the lint rule `@typescript-eslint/no-deprecated` flags its usages.

### Key Takeaways

- Use discriminated unions to make invalid states impossible.
- Parse at boundaries into precise types; don't re-validate everywhere.
- Derive types from a single source of truth.
- Replace boolean flags with literal unions.
- Accept broad, minimal inputs; return precise outputs.
- Keep types as simple as the problem allows, and document public APIs with JSDoc.

---

# Part V — Team and Enterprise Standards

## 29. Linting and Formatting

### 29.1 Compiler vs linter

The compiler answers "is this type-correct?". A linter answers "is this a good idea?". Many bugs are type-correct: a floating promise, an `any` leaking from a library, a condition that's always true, an unhandled union member. A **type-aware linter** uses the compiler's type information to catch these.

### 29.2 typescript-eslint

typescript-eslint is the standard linter setup for TypeScript. A modern flat config with type-aware rules:

```js
// eslint.config.js
import eslint from "@eslint/js";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";

export default defineConfig(
  eslint.configs.recommended,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,               // uses your tsconfig(s) automatically
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      // Not part of any preset; enable explicitly
      "@typescript-eslint/switch-exhaustiveness-check": "error",
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/method-signature-style": ["error", "property"],
    },
  },
  {
    files: ["**/*.js", "**/*.mjs"],
    extends: [tseslint.configs.disableTypeChecked],
  },
);
```

`strictTypeChecked` is the opinionated preset most teams with high standards adopt. `recommendedTypeChecked` is a gentler starting point for existing codebases.

**Rules worth understanding.** Most are in `strictTypeChecked` or `stylisticTypeChecked`. `switch-exhaustiveness-check` and `consistent-type-imports` are in no preset and must be enabled explicitly, as in the config above:

| Rule | Catches |
|---|---|
| `no-explicit-any` | explicit `any` annotations |
| `no-unsafe-assignment`, `-member-access`, `-call`, `-return`, `-argument` | `any` leaking from libraries and `JSON.parse` |
| `no-floating-promises` | promises that are never awaited or handled |
| `no-misused-promises` | async functions passed where `void` callbacks are expected |
| `switch-exhaustiveness-check` | `switch` statements missing union members |
| `consistent-type-imports` | imports of types without `type` |
| `no-unnecessary-condition` | conditions that are always true or false per the types |
| `prefer-nullish-coalescing` | `\|\|` used where `??` is intended |
| `only-throw-error` | throwing strings and other non-`Error` values |
| `no-deprecated` | usages of APIs marked `@deprecated` |
| `restrict-template-expressions` | `${object}` producing `[object Object]` |

**Linting with TypeScript 7.** Type-aware linting runs on TypeScript's programmatic API, and TypeScript 7.0 ships without a stable one (expected in 7.1). Until typescript-eslint supports TypeScript 7, the common setup is two installations side by side: TypeScript 7 for `tsc` (type-checking and builds, where the speedup matters), and a TypeScript 6 installation, typically added under an npm alias, that typescript-eslint loads. Because the type system is the same in 6 and 7, both see the same types. The exact package wiring is still settling, so follow the current typescript-eslint installation docs rather than copying a recipe from a blog post.

**Faster alternatives.** Biome and Oxlint are Rust-based linters that are dramatically faster and are adding type-aware rules. They're increasingly popular, sometimes alongside typescript-eslint for the type-aware rules they don't yet cover. typescript-eslint remains the most complete rule set.

### 29.3 Formatting

Use a formatter (Prettier, or Biome's formatter) and never argue about formatting in code review. Turn off any lint rules that conflict with the formatter. Formatting is not linting.

### 29.4 Enforce it in CI

A typical quality gate, run on every pull request:

```jsonc
// package.json
{
  "scripts": {
    "typecheck": "tsc --noEmit",
    "lint": "eslint .",
    "format:check": "prettier --check .",
    "test": "vitest run",
    "check": "npm run typecheck && npm run lint && npm run format:check && npm run test"
  }
}
```

Run fast checks (format, lint on changed files) in a pre-commit hook, and everything in CI. Code that fails type-checking never merges.

### Key Takeaways

- Use a type-aware linter; `tsc` alone misses many real bugs.
- Start from typescript-eslint's `strictTypeChecked` (or `recommendedTypeChecked` for legacy code).
- Separate formatting (Prettier/Biome) from linting.
- Gate merges on typecheck, lint, format, and tests.

---

## 30. Testing Your Types

### 30.1 Why test types?

For application code, ordinary tests plus the compiler are usually enough. But utility types, generic helpers, and library APIs have *type behavior* that's part of their contract: "this function infers the route params", "this type rejects unknown keys". Those deserve tests too.

### 30.2 `@ts-expect-error` as a negative test

`@ts-expect-error` asserts that the next line **has** a type error. If the error disappears, the directive itself becomes an error:

```ts
// @ts-expect-error — cancelOrder must not accept a UserId
cancelOrder(userId);
```

That makes it the right tool for "this should not compile" tests, and the right alternative to `@ts-ignore` everywhere else: `@ts-ignore` silences errors forever, even after they're fixed, while `@ts-expect-error` tells you when it's no longer needed. Always add a reason after it.

### 30.3 Type assertions in Vitest

Vitest includes `expectTypeOf` for compile-time assertions:

```ts
import { describe, expectTypeOf, it } from "vitest";
import { buildPath, type RouteParams } from "./router.ts";

describe("RouteParams", () => {
  it("extracts named params", () => {
    expectTypeOf<RouteParams<"/users/:id/posts/:postId">>().toEqualTypeOf<{
      id: string;
      postId: string;
    }>();
  });

  it("requires params for buildPath", () => {
    expectTypeOf(buildPath).parameter(0).toBeString();
    // @ts-expect-error — missing postId
    buildPath("/users/:id/posts/:postId", { id: "1" });
  });
});
```

Run with `vitest --typecheck` (or enable `typecheck` in the Vitest config) so these assertions are checked. And make sure `tsc` checks your test files at all: if your build config excludes tests, the root `tsconfig.json` must include them (Chapter 15, Appendix A), or type errors in tests go unnoticed.

### 30.4 Typing test doubles

Type your fakes and mocks against the real interfaces, so tests break when the contract changes:

```ts
import { vi } from "vitest";

const sendEmail = vi.fn<SendEmail>().mockResolvedValue(undefined);
const clock: Clock = { now: () => new Date("2026-01-01T00:00:00Z") };

const requestReset = createPasswordReset({ clock, sendEmail, tokens: fakeTokenStore });
```

Use builder functions for fixtures instead of casting partial objects:

```ts
function buildUser(overrides: Partial<User> = {}): User {
  return {
    id: "u_1",
    email: "ada@example.com",
    name: "Ada",
    role: "member",
    tags: [],
    ...overrides,
  };
}

const admin = buildUser({ role: "admin" }); // full, valid User
```

When a test genuinely needs only part of a large object, `{ ... } satisfies Partial<T>` combined with a single documented cast is acceptable in test code. Avoid scattering `as any` through tests.

### Key Takeaways

- Test the type behavior of utilities and library APIs.
- Use `@ts-expect-error` (with a reason) for negative tests; never `@ts-ignore`.
- Use Vitest's `expectTypeOf` with `--typecheck`.
- Type test doubles against real interfaces; use fixture builders instead of casts.

---

## 31. Publishing Libraries

### 31.1 Package format

The ecosystem has largely moved to **ESM-first** packages. Current Node.js LTS versions can `require()` ES modules (as long as they don't use top-level `await`), which removes most of the historical need to publish dual CommonJS/ESM builds. Unless you have a specific CommonJS audience, publish ESM only.

```jsonc
// package.json
{
  "name": "@acme/retry",
  "version": "1.0.0",
  "type": "module",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "default": "./dist/index.js"
    },
    "./testing": {
      "types": "./dist/testing.d.ts",
      "default": "./dist/testing.js"
    }
  },
  "files": ["dist"],
  "sideEffects": false,
  "engines": { "node": ">=22.12" }
}
```

- `exports` defines exactly which entry points are public; everything else is private.
- The `types` condition must come **first** in each entry.
- `sideEffects: false` lets bundlers tree-shake unused exports.
- `engines` documents the oldest Node.js you test against. 22.12 is the first 22.x release where `require()` of ES modules works without a flag, so CommonJS consumers can still load an ESM-only package.

### 31.2 Compiler settings for libraries

```jsonc
{
  "compilerOptions": {
    "module": "nodenext",
    "declaration": true,
    "declarationMap": true,         // "Go to definition" jumps to your .ts source
    "isolatedDeclarations": true,   // forces explicit types on exports; enables fast parallel .d.ts generation
    "sourceMap": true
  }
}
```

`isolatedDeclarations` requires every exported function and constant to have explicit types that can be emitted without type inference. That sounds strict, but it's good practice for public APIs anyway: your published types never change by accident because an implementation detail changed.

### 31.3 Don't publish raw TypeScript for Node

Node's type stripping deliberately refuses to run `.ts` files inside `node_modules`. Publish compiled JavaScript plus `.d.ts` files. (Internal packages inside a monorepo are a different story; see Chapter 32.)

### 31.4 Verify before publishing

Packaging mistakes are common and invisible to the compiler. Two tools catch them:

- **Are The Types Wrong?** (`@arethetypeswrong/cli`) checks that your types resolve correctly under every module resolution mode consumers might use.
- **publint** checks `package.json` for common errors in `exports`, `files`, and entry points.

Run both in CI for every library.

### 31.5 Types are part of your API

Changing a public type can break consumers as surely as changing behavior. Narrowing a parameter type, adding a required property, removing a union member from a return type, or changing a generic's constraint are breaking changes that warrant a major version. Mark replacements with `@deprecated` before removing anything.

### Key Takeaways

- Publish ESM with an `exports` map, `types` condition first.
- Use `declaration`, `declarationMap`, and `isolatedDeclarations`.
- Publish compiled JS plus `.d.ts`, not raw `.ts`.
- Validate packages with Are The Types Wrong? and publint.
- Treat public type changes with semver discipline.

---

## 32. Monorepos and Project References

### 32.1 Shared configuration

Put shared compiler options in a base config and extend it:

```jsonc
// tsconfig.base.json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "verbatimModuleSyntax": true,
    "erasableSyntaxOnly": true,
    "skipLibCheck": true
  }
}

// packages/api/tsconfig.json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": { "module": "nodenext", "rootDir": "src", "outDir": "dist", "types": ["node"] },
  "include": ["src"]
}
```

Community-maintained bases (the `@tsconfig/*` packages, e.g. for specific Node.js versions) are a reasonable starting point too.

### 32.2 Project references

In larger monorepos, **project references** split type-checking into independently buildable units, so changing one package only re-checks what depends on it:

```jsonc
// packages/web/tsconfig.json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": { "composite": true, "rootDir": "src", "outDir": "dist" },
  "references": [{ "path": "../shared" }]
}

// tsconfig.json (root)
{
  "files": [],
  "references": [{ "path": "packages/shared" }, { "path": "packages/api" }, { "path": "packages/web" }]
}
```

```bash
tsc --build        # builds everything in dependency order, incrementally
```

Every referenced project must set `composite: true` (which also turns on `declaration`), and its `include` must cover all of its source files. TypeScript 7 parallelizes project reference builds, which makes this structure much faster in large repositories.

### 32.3 Internal packages

Packages that are only consumed inside the monorepo can skip a build step by pointing their `exports` at TypeScript sources, as long as every consumer's toolchain (bundler, test runner, type stripping in the app) handles `.ts`. Workspace tooling (pnpm, npm, or Yarn workspaces, often with Turborepo or Nx for task orchestration) links them together. Decide per package: published packages are built; internal packages may not need to be.

A clean way to do this is a **custom export condition**. The internal package's `exports` points a `source` condition at TypeScript and `default` at compiled output. Consumers inside the monorepo add `"customConditions": ["source"]` to their tsconfig (and run Node with `--conditions=source` in development), while production and anything outside the monorepo use the compiled files:

```jsonc
// packages/shared/package.json
{
  "name": "@acme/shared",
  "type": "module",
  "exports": {
    ".": {
      "source": "./src/index.ts",
      "types": "./dist/index.d.ts",
      "default": "./dist/index.js"
    }
  }
}
```

### Key Takeaways

- Share options with `extends`; keep per-package configs small.
- Use project references and `tsc --build` for large monorepos.
- Internal-only packages may export TypeScript sources directly; published ones are built.
- A `source` export condition plus `customConditions` lets monorepo consumers use TypeScript sources directly.

---

## 33. Type-Checking Performance

TypeScript 7's native compiler makes most projects dramatically faster, but code patterns still matter in large codebases, and editor responsiveness depends on them.

### 33.1 Habits that keep checking fast

- **Annotate return types of exported functions.** The compiler doesn't have to infer them at every use, and `.d.ts` emit is cheaper. `isolatedDeclarations` enforces this.
- **Prefer interfaces with `extends` over big intersections.** Interface relationships are cached; intersections are recomputed.
- **Name complex types.** A named type alias is computed once; the same inline type repeated across files may be recomputed.
- **Avoid huge unions.** Unions with thousands of members (often generated by template literal types) make every comparison expensive.
- **Keep recursive and conditional types shallow.**
- **Scope your project.** Use precise `include`, explicit `types`, and `skipLibCheck: true`.
- **Use incremental builds** (`incremental: true` or project references) so unchanged files aren't rechecked.

### 33.2 Diagnosing slowness

```bash
tsc --noEmit --extendedDiagnostics   # time and memory per phase, type counts
tsc --noEmit --generateTrace trace   # detailed trace to find expensive types
```

These flags exist in TypeScript 6; check `tsc --help` for their status in your TypeScript 7 version. The TypeScript team's "Performance" wiki page on GitHub explains how to read these outputs.

### Key Takeaways

- Explicit return types, interfaces over intersections, and named types keep checking fast.
- Avoid giant unions and deep recursion.
- Measure with `--extendedDiagnostics` and `--generateTrace` before optimizing.

---

## 34. Migrating JavaScript to TypeScript

If you inherit a JavaScript codebase, migrate incrementally rather than all at once:

1. **Add TypeScript with `allowJs` and `checkJs`.** TypeScript type-checks your JavaScript using inference and JSDoc. Start by fixing the errors it finds; many are real bugs.

   ```js
   // @ts-check
   /** @param {{ price: number; quantity: number }[]} items */
   export function total(items) {
     return items.reduce((sum, i) => sum + i.price * i.quantity, 0);
   }
   ```

2. **Turn on `strict` from the start** if you can. Migrating loosely and tightening later means touching every file twice. If the error count is overwhelming, enable strictness per directory using separate tsconfigs, or temporarily allow `// @ts-expect-error` with a tracking ticket.
3. **Convert leaf modules first** (utilities, pure functions, constants), then work toward modules with more dependencies. Each converted file gives better types to everything that imports it.
4. **Add validation at boundaries early.** API handlers and external clients are where wrong assumptions hide.
5. **Track progress.** Count remaining `.js` files, `any` usages, and `@ts-expect-error` comments, and watch them go down.

### Key Takeaways

- Start with `allowJs` + `checkJs` and JSDoc.
- Prefer strict mode from the beginning; migrate leaves first.
- Validate boundaries early and measure progress.

---

## 35. Where TypeScript Is Unsound

TypeScript is deliberately **not** fully sound: some code compiles even though it can fail at runtime with a type error. The designers chose convenience and compatibility with JavaScript patterns over complete safety. Knowing exactly where the holes are is what lets you use the type system with confidence everywhere else.

| Hole | Example | Mitigation | Chapter |
|---|---|---|---|
| `any` | `JSON.parse`, `response.json()`, untyped libraries, explicit `any` | `unknown` + validation; `no-unsafe-*` lint rules | 5, 22, 29 |
| Type assertions | `x as User`, `x!`, `as unknown as T` | Narrowing, validation, `satisfies` | 4, 5 |
| Unchecked index access | `arr[i]` typed as `T` when it may be `undefined` | `noUncheckedIndexedAccess` | 15 |
| Array covariance | `const animals: Animal[] = dogs; animals.push(cat)` | `readonly T[]` parameters | 9 |
| Method parameter bivariance | Method-syntax members accept narrower parameter types | Property syntax (`fn: (x: T) => void`); `method-signature-style` lint rule | 6, 9 |
| Readonly is not enforced on assignment | `{ readonly x: number }` assignable to `{ x: number }` | Don't rely on `readonly` across ownership boundaries; `Object.freeze` when it matters | 26 |
| Narrowing across calls | A narrowed property is assumed unchanged after calling a function that might mutate it | Copy to a `const` before calling out; avoid mutation | 8 |
| Trusted predicates and assertions | `isUser(x): x is User` whose body checks the wrong thing | Keep guards tiny; prefer schemas; test guards | 7 |
| Predicate `false` branch | `isNonEmpty(s): s is string` returning `false` for `""` narrows `s` to *not string* in the else branch | Only write predicates whose `false` result really means "not that type" | 7, Appendix D |
| Return-only generics | `get<T>(url): Promise<T>` | Accept a schema, or return `unknown` | 11, 22 |
| Optional vs `undefined` | `{ x?: string }` accepts `{ x: undefined }` | `exactOptionalPropertyTypes` | 15 |
| Declaration files can lie | Outdated or wrong `@types/*` or hand-written `.d.ts` | Prefer libraries that ship their own types; validate data from untrusted libraries | 13 |
| Numeric enums | Any `number` is assignable to a numeric enum | Literal unions or `as const` objects | 14 |
| Wire types | A shared `Order` type with `createdAt: Date` that arrives as a string | Validate and convert at boundaries | 27 |

Two patterns cover almost every row:

1. **Make the compiler stricter** where a flag exists (`strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`) and let the type-aware linter catch `any` and floating promises.
2. **Validate at the edges.** Most runtime type errors in TypeScript codebases come from data that entered without being checked, not from the type system's internal holes.

### Key Takeaways

- TypeScript trades some soundness for ergonomics; the holes are known and finite.
- Compiler flags and lint rules close most of them.
- Runtime validation at boundaries closes the rest.

---

## 36. Anti-Patterns Checklist

Use this as a code review checklist. Each row links an outdated or risky habit to its modern replacement.

| ❌ Anti-pattern | ✅ Instead | Chapter |
|---|---|---|
| `any` for unknown data | `unknown` + narrowing or a schema | 5, 22 |
| `JSON.parse(x) as User` | `UserSchema.parse(JSON.parse(x))` | 22 |
| Return-only generics `get<T>(): T` | Accept a schema, or return `unknown` | 11, 22 |
| `as unknown as T` | Fix the types, or validate | 4 |
| `<T>value` assertions | `value as T` (and only when justified) | 2, 4 |
| Non-null `!` everywhere | Narrow with checks; throw on impossible states | 5 |
| `enum` | Literal unions or `as const` objects | 14 |
| `namespace`, `import x = require()`, `export =` | ES modules | 13, 14 |
| Constructor parameter properties | Explicit field declarations | 12 |
| `moduleResolution: "node"`, `baseUrl`, `target: "es5"` | `nodenext`/`node20`, subpath imports, `es2025` target (errors in TS 7) | 15 |
| Tests excluded from every `tsconfig` | Root config that type-checks tests; separate build config | 15, 30 |
| Bag of optional fields for states | Discriminated union | 8, 28 |
| Boolean flags (`isX`, `isY`) | Literal union status | 28 |
| `Omit` on a union | `DistributiveOmit` | 16 |
| `Omit` for public/security shapes | `Pick` (allowlist) | 16 |
| Generic constrained to `Record<string, unknown>` that must accept interfaces | `T extends object` | 6, 17 |
| `\|\|` for defaults | `??` | 5 |
| Method syntax in interfaces | Property syntax `fn: () => void` | 6 |
| Mutable array parameters | `readonly T[]` | 7, 9 |
| `String`, `Number`, `Object`, `Function`, `{}` types | `string`, `number`, `Record<string, unknown>`, specific function types | 3, 5 |
| `@ts-ignore` | `@ts-expect-error` with a reason | 30 |
| Imports of types without `type` | `import type` / inline `type` | 13 |
| Default exports by habit | Named exports | 13 |
| Internal barrel files | Direct imports | 13 |
| Subpath imports pointing at `src/` in compiled deployments | Conditional `imports` targets | 13 |
| Mutating `sort`/`reverse`/`splice` on shared data | `toSorted`/`toReversed`/`toSpliced`/`with` | 25 |
| Floating promises, `forEach(async ...)` | `await`, `Promise.all`, `for...of` | 24 |
| Throwing strings | `Error` subclasses with `cause` | 21 |
| `JSON.stringify` in error paths | `util.inspect` (never throws) | 21 |
| Reading `process.env` everywhere | Validated, typed config module | 22 |
| Sharing TypeScript types across services without validation | Shared schemas, validated on both sides | 27 |
| Database rows returned from APIs | Explicit DTOs and mapping functions | 27 |
| `try/finally` for cleanup | `using` / `await using` | 24 |
| Duplicated type definitions | Derived types from one source of truth | 28 |
| Clever, unreadable type gymnastics in app code | Simple types and discriminated unions | 18, 28 |

---

# Appendices

## Appendix A: Reference tsconfig Files

These are strong starting points for Node.js 24 and TypeScript 7. Each project uses two files: a root `tsconfig.json` that type-checks everything (including tests) without emitting, and, if you compile, a `tsconfig.build.json` that emits production code only.

### A.1 Node.js service or CLI, compiled to `dist/`

```jsonc
// tsconfig.json — editor + `npm run typecheck`
{
  "compilerOptions": {
    // Language and environment (Node.js 24)
    "target": "es2025",
    "lib": ["es2025", "esnext.disposable"],
    "types": ["node"],

    // Modules
    "module": "nodenext",
    "verbatimModuleSyntax": true,
    "isolatedModules": true,
    "erasableSyntaxOnly": true,
    "rewriteRelativeImportExtensions": true,
    "resolveJsonModule": true,

    // Strictness
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitOverride": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noPropertyAccessFromIndexSignature": true,

    // Checking only
    "noEmit": true,
    "skipLibCheck": true
  },
  "include": ["src", "test", "scripts"]
}
```

```jsonc
// tsconfig.build.json — `npm run build`
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "noEmit": false,
    "rootDir": "src",
    "outDir": "dist",
    "sourceMap": true,
    "incremental": true
  },
  "include": ["src"],
  "exclude": ["src/**/*.test.ts"]
}
```

```jsonc
// package.json (excerpt)
{
  "type": "module",
  "engines": { "node": ">=24.12" },
  "scripts": {
    "dev": "node --watch src/main.ts",
    "typecheck": "tsc",
    "build": "tsc -p tsconfig.build.json",
    "start": "node dist/main.js"
  }
}
```

Because imports use `.ts` extensions with `rewriteRelativeImportExtensions`, the same sources run directly in development (`node src/main.ts`) and compile to working `.js` for production.

### A.2 Node.js service run directly with type stripping

If you deploy sources and run them with `node src/main.ts`, you only need the root config from A.1. There's no build config and no `dist/`. Keep `noEmit: true`, and remember that type stripping doesn't check types, so `npm run typecheck` in CI is your only safety net.

### A.3 Published library

```jsonc
// tsconfig.json — type-check everything
{
  "compilerOptions": {
    "target": "es2023",
    "lib": ["es2023"],
    "types": [],

    "module": "nodenext",
    "verbatimModuleSyntax": true,
    "isolatedModules": true,
    "erasableSyntaxOnly": true,
    "rewriteRelativeImportExtensions": true,

    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitOverride": true,

    "noEmit": true,
    "skipLibCheck": true
  },
  "include": ["src", "test"]
}
```

```jsonc
// tsconfig.build.json — emit JS + declarations
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "noEmit": false,
    "rootDir": "src",
    "outDir": "dist",
    "declaration": true,
    "declarationMap": true,
    "isolatedDeclarations": true,
    "sourceMap": true
  },
  "include": ["src"],
  "exclude": ["src/**/*.test.ts"]
}
```

A slightly older `target` and `lib` than an application gives consumers on older runtimes room to adopt your library. If the library uses Node.js APIs, set `"types": ["node"]` and match `engines` in `package.json`.

### A.4 Bundled services

Services bundled with esbuild (common for serverless functions) can use `"module": "preserve"` with `noEmit: true`, because the bundler resolves imports and emits the output. Keep the same strictness flags.

---

## Appendix B: Feature Timeline and Runtime Support

### B.1 TypeScript versions

Useful for reading older code and knowing what you can rely on.

| Version | Notable additions |
|---|---|
| 4.7 | Variance annotations (`in`/`out`); `module: "node16"`/`"nodenext"` |
| 4.9 | `satisfies`; `in` narrowing for unlisted properties |
| 5.0 | Standard decorators; `const` type parameters; `verbatimModuleSyntax`; all enums become union enums |
| 5.1 | Unrelated types for getters and setters; easier implicit returns for `undefined`-returning functions |
| 5.2 | `using` / `await using` (explicit resource management); decorator metadata |
| 5.3 | Import attributes (`with { type: "json" }`); `switch (true)` narrowing |
| 5.4 | `NoInfer`; narrowing preserved in closures after last assignment; `module: "preserve"` |
| 5.5 | Inferred type predicates; `isolatedDeclarations`; regex syntax checking |
| 5.6 | Errors on always-truthy and always-nullish checks; iterator helper types; `noUncheckedSideEffectImports` (opt-in) |
| 5.7 | `rewriteRelativeImportExtensions`; checks for never-initialized variables; validated JSON imports under `nodenext`; ES2024 target |
| 5.8 | `erasableSyntaxOnly`; granular checks on branches in return expressions; `require()` of ESM under `nodenext` |
| 5.9 | `module: "node20"`; `import defer`; refreshed minimal `tsc --init` |
| 6.0 (Mar 2026) | Last JS-based compiler; new defaults (`strict`, `module: esnext`, latest `target`, `types: []`, `rootDir: "."`, `noUncheckedSideEffectImports`); legacy options deprecated; ES2025 target; Temporal, `RegExp.escape`, and `Map` upsert types |
| 7.0 (Jul 2026) | Native Go compiler, roughly 8–12x faster full builds; parallel parsing, checking, emitting, and project builds; 6.0 deprecations become errors; programmatic API expected in 7.1 |

### B.2 What Node.js 24 supports

| Feature | Node.js 24 | Chapter |
|---|---|---|
| Type stripping | Default since 23.6, no warning since 24.3, stable since 24.12 | 2 |
| `require()` of ES modules | ✅ (without top-level `await`) | 31 |
| Import attributes / JSON modules | ✅ | 13 |
| `using` / `await using`, `DisposableStack` | ✅ | 24 |
| Iterator helpers, `Set` methods, `Promise.try`, `RegExp.escape` (ES2025) | ✅ | 24, 25 |
| `Object.groupBy`, `Map.groupBy`, `Promise.withResolvers` (ES2024) | ✅ | 24, 25 |
| Decorators | ❌ (needs a compile step) | 12 |
| Temporal | ❌ (use a polyfill) | 25 |
| `Map.prototype.getOrInsert` / `getOrInsertComputed` | ❌ (types exist in TS 6+) | 25 |

When a feature has TypeScript types but your runtime lacks it, keep it out of `lib` so the compiler stops you from calling it.

---

## Appendix C: TypeScript Interview Questions

Questions that come up regularly in mid-level and senior interviews for TypeScript roles, with short model answers and where to read more. Interviewers care less about the exact words than about whether you can explain the *why* and give an example.

**1. What's the difference between `any`, `unknown`, and `never`?**
`any` disables checking and spreads silently. `unknown` accepts every value but forces you to narrow before use, so it's the safe choice for untrusted data. `never` is the empty type: no value has it, which makes it useful for functions that never return and for exhaustiveness checks. *(Chapter 5)*

**2. `type` or `interface`?**
Both describe object shapes. Interfaces support declaration merging and `extends` with clear conflict errors, and are cached well by the compiler; type aliases also express unions, tuples, mapped and conditional types. A common convention: interfaces for object contracts, types for everything else. Mention the implicit index signature difference as a bonus. *(Chapter 6)*

**3. What does "structural typing" mean, and what are its consequences?**
Compatibility depends on shape, not on declared names or origins. Consequences: objects may carry extra properties (so `Object.keys` returns `string[]`), and same-shaped types like `UserId` and `OrderId` strings are interchangeable unless branded. *(Chapters 1, 10, 23)*

**4. Compare an annotation, `satisfies`, and `as`.**
An annotation sets the variable's type and checks the value against it. `satisfies` checks the value but keeps its precise inferred type. `as` asserts a type with almost no checking. Prefer annotation or `satisfies`; justify every `as`. *(Chapter 4)*

**5. How do you model state so invalid combinations can't exist?**
Discriminated unions with a literal discriminant, plus an exhaustiveness check (`assertNever` or `satisfies never`) so adding a variant produces compile errors where it isn't handled. Contrast with a bag of optional fields. *(Chapters 8, 28)*

**6. Explain `function get<T, K extends keyof T>(obj: T, key: K): T[K]`.**
`K` is constrained to the keys of `T`, so invalid keys are rejected, and the return type is the type of that specific property via indexed access. The generics tie the inputs and output together. *(Chapters 10, 11)*

**7. Implement `Pick`, `Omit`, `ReturnType`, `Awaited`, or `DeepReadonly`.**
Mapped types with `keyof` for the first two, conditional types with `infer` for the next two, and a recursive mapped/conditional type for the last. Practice writing them from memory. *(Chapters 16–18, Appendix D)*

**8. What is a distributive conditional type?**
When a conditional type checks a bare type parameter, a union argument is split and the condition applied to each member, then the results are unioned. Wrapping both sides in a tuple (`[T] extends [U]`) turns distribution off. *(Chapter 18)*

**9. What are covariance and contravariance? Is TypeScript sound?**
Covariant positions (return types) follow the subtype direction; contravariant positions (parameters) reverse it. TypeScript is deliberately unsound in places: array covariance, method bivariance, assertions, `any`. Knowing the holes is a senior-level signal. *(Chapters 9, 35)*

**10. How do you type data from an API safely?**
Treat it as `unknown` and validate with a schema that also produces the static type (`z.infer`). Never `as`-cast parsed JSON, and avoid return-only generics like `get<T>()`. *(Chapters 11, 22)*

**11. Why do many teams avoid `enum`? What do they use instead?**
Enums generate runtime code (not erasable, so they don't run under Node's type stripping), numeric enums have reverse mappings and accept any number, and string enums are nominal, which is awkward for wire data. Use literal unions, or an `as const` object with a derived union type. *(Chapter 14)*

**12. What does `readonly` guarantee?**
Only that code using *that type* can't reassign the property, at compile time. It's shallow, absent at runtime, and lost when a readonly object is assigned to a mutable type. Use `Object.freeze` for runtime protection. *(Chapter 26)*

**13. What is type erasure, and why does it matter?**
Types are removed before code runs, so there are no runtime type checks. Anything crossing a trust boundary must be validated at runtime; `instanceof` works only for classes, not interfaces or type aliases. *(Chapters 1, 22)*

**14. How do you make two string IDs incompatible?**
Branded types: intersect the base type with a phantom property, and create values only through validating constructors. *(Chapter 23)*

**15. Which compiler options would you always enable?**
`strict`, `noUncheckedIndexedAccess`, `verbatimModuleSyntax`, `erasableSyntaxOnly`, and usually `exactOptionalPropertyTypes` and `noImplicitOverride`, with `tsc` in CI and a type-aware linter. Explain *why* for each. *(Chapters 2, 15, 29)*

**Common live-coding tasks:** a type-safe event emitter (Chapter 17), a typed `Result` type and a function returning it (Chapter 21), a generic `groupBy` or `indexBy` (Appendix D), a TTL or LRU cache class (Chapter 11), and parsing route parameters with template literal types (Chapter 19).

---

## Appendix D: Exercise Solutions

Try each exercise before reading its solution. Most have several valid answers; these are idiomatic ones.

### Chapter 8 — Unions and Narrowing

**8.1**

```ts
type PaymentResult =
  | { status: "succeeded"; transactionId: string }
  | { status: "declined"; reason: "insufficient_funds" | "card_expired" | "fraud_suspected" }
  | { status: "requires_3ds"; redirectUrl: string };

function describePayment(result: PaymentResult): string {
  switch (result.status) {
    case "succeeded":    return `Paid (${result.transactionId})`;
    case "declined":     return `Declined: ${result.reason}`;
    case "requires_3ds": return `Redirect the customer to ${result.redirectUrl}`;
    default:             return assertNever(result);
  }
}
```

**8.2**

```ts
function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}
```

This is fine for `unknown` input, but notice the trap: when the predicate returns `false`, TypeScript narrows the else branch to "not `string`". For an input typed `string | undefined`, the else branch would be narrowed to `undefined`, even though `""` also lands there. A predicate's `false` result must genuinely mean "not that type". For "non-empty", a branded type (`value is NonEmptyString`) is the honest alternative.

### Chapter 10 — Type Operators

**10.1**

```ts
const LOG_LEVELS = { debug: 10, info: 20, warn: 30, error: 40 } as const;

type LogLevel = keyof typeof LOG_LEVELS;               // "debug" | "info" | "warn" | "error"
type LogLevelValue = (typeof LOG_LEVELS)[LogLevel];    // 10 | 20 | 30 | 40
```

**10.2**

```ts
function indexBy<T, K extends keyof T>(items: readonly T[], key: K): Map<T[K], T> {
  return new Map(items.map((item): [T[K], T] => [item[key], item]));
}

const byId = indexBy(users, "id"); // Map<string, User>
```

The return-type annotation on the callback makes the array literal a tuple; without it, TypeScript infers `(T[K] | T)[]` and `Map` rejects it.

### Chapter 11 — Generics

**11.1**

```ts
function groupBy<T, K extends PropertyKey>(
  items: readonly T[],
  keyFn: (item: T) => K,
): Partial<Record<K, T[]>> {
  const groups: Partial<Record<K, T[]>> = {};
  for (const item of items) {
    (groups[keyFn(item)] ??= []).push(item);
  }
  return groups;
}
```

**11.2** `T` appears only in the return type, so the signature is an unchecked cast: `parse<User>(text)` claims to return a `User` without verifying anything. Either return `unknown`, or accept a schema so the type is backed by a check:

```ts
function parseJson<S extends z.ZodType>(text: string, schema: S): z.infer<S> {
  return schema.parse(JSON.parse(text));
}
```

### Chapter 16 — Utility Types

**16.1**

```ts
type MyPick<T, K extends keyof T> = { [P in K]: T[P] };
type MyOmit<T, K extends PropertyKey> = MyPick<T, Exclude<keyof T, K>>;
```

**16.2**

```ts
type UserUpdate = Readonly<Pick<User, "id">> & Partial<Omit<User, "id" | "passwordHash" | "createdAt">>;
```

### Chapter 17 — Mapped Types

**17.1** `type Nullable<T> = { [K in keyof T]: T[K] | null };`

**17.2**

```ts
type Setters<T> = {
  [K in keyof T as `set${Capitalize<string & K>}`]: (value: T[K]) => void;
};
```

### Chapter 18 — Conditional Types

**18.1** `type MyAwaited<T> = T extends PromiseLike<infer V> ? MyAwaited<V> : T;`

**18.2** `type ElementType<T> = T extends ReadonlyArray<infer E> ? E : T;`

**18.3** `type IsNever<T> = [T] extends [never] ? true : false;`

The naive `T extends never ? true : false` returns `never` for `IsNever<never>`: `never` is the empty union, and a distributive conditional over zero members produces zero results. Wrapping in a tuple disables distribution.

### Chapter 19 — Template Literal Types

**19.1**

```ts
type EventName<T extends string> = `${T}${"Created" | "Updated" | "Deleted"}`;

type OrderEvent = EventName<"order">; // "orderCreated" | "orderUpdated" | "orderDeleted"
```

**19.2**

```ts
type Split<S extends string, D extends string> =
  S extends `${infer Head}${D}${infer Tail}` ? [Head, ...Split<Tail, D>] : [S];

type Parts = Split<"orders.lines.sku", ".">; // ["orders", "lines", "sku"]
```

### Chapter 20 — Reading and Debugging Types

**20.1** An interface doesn't get an implicit index signature, because it could be augmented later with properties that wouldn't satisfy `Record<string, unknown>`; a type alias for an object literal type does. Fixes: declare `AppEvents` with `type`, or loosen the constraint to `Events extends object`, which accepts both and is all the emitter needs (Chapter 17).

**20.2**

```ts
type Prettify<T> = { [K in keyof T]: T[K] } & {};

type UserPatch = Prettify<Pick<User, "id"> & Partial<Pick<User, "name" | "email">>>;
// { id: string; name?: string; email?: string }
```

---

## Appendix E: Further Reading

- **TypeScript Handbook** — the official reference: https://www.typescriptlang.org/docs/handbook/intro.html
- **TypeScript release notes and blog** — the best way to stay current: https://devblogs.microsoft.com/typescript/
- **TSConfig reference** — every compiler option explained: https://www.typescriptlang.org/tsconfig/
- **TypeScript Playground** — test and share snippets, with version selection: https://www.typescriptlang.org/play
- **TypeScript Performance wiki** — https://github.com/microsoft/TypeScript/wiki/Performance
- **Node.js TypeScript docs** — type stripping details for your Node version: https://nodejs.org/api/typescript.html
- **typescript-eslint** — configs, rules, and current TypeScript 7 status: https://typescript-eslint.io
- **Standard Schema** — https://standardschema.dev
- **type-challenges** — graded type-level exercises, from easy to extreme: https://github.com/type-challenges/type-challenges
- **Effective TypeScript** by Dan Vanderkam (book, 2nd edition) — 83 specific ways to improve your TypeScript
- **Total TypeScript** by Matt Pocock — free and paid material on advanced and practical TypeScript: https://www.totaltypescript.com
- **"Parse, don't validate"** by Alexis King — the essay behind Chapter 28's core idea: https://lexi-lambda.github.io/blog/2019/11/05/parse-don-t-validate/
- **Are The Types Wrong?** — https://arethetypeswrong.github.io
- **publint** — https://publint.dev
