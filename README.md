# Mastering TypeScript

A personal, hands-on collection of TypeScript examples and experiments. This repository documents my learning journey through the language's type system, from everyday types to generics and advanced type transformations.

## Topics covered

| File | Concepts |
| --- | --- |
| `everyday Types.ts` | Type annotations, inference, object types, unions, literals, and nullability |
| `narrowing.ts` | Control-flow analysis, type guards, predicates, and discriminated unions |
| `object types.ts` | Interfaces, optional/readonly properties, index signatures, intersections, generics, arrays, and tuples |
| `more on functions.ts` | Function types, call/construct signatures, generics, overloads, `this`, and rest parameters |
| `generics.ts` | Generic functions, interfaces, classes, constraints, and defaults |
| `mapped-types.ts` | Mapped types, modifiers, key remapping, and union mapping |
| `conditional-types.ts` | Conditional types, `infer`, and distributive types |
| `Template Literal Types.ts` | Template literal types and type-safe property-change event names |

Examples are intentionally exploratory. Lines that demonstrate invalid code are labeled with `@ts-expect-error` and a nearby explanation. These are type-system exercises, not production patterns; if a marked line stops producing an error, TypeScript reports the unused directive.

## Requirements

- [Bun](https://bun.sh/) (used for running examples)
- TypeScript (the project currently declares `^7.0.2` as a peer dependency)

## Getting started

Install the project dependencies:

```bash
bun install
```

Run an individual example directly with Bun, for example:

```bash
bun run "everyday Types.ts"
```

To type-check/compile according to `tsconfig.json`:

```bash
bun run build
```

The examples are independent study files; there is no single application entry point. Intentional type errors are documented with `@ts-expect-error`, so the strict project build can still verify the examples and catch unexpected errors.

## Learning approach

Read each file alongside the corresponding [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html). Try changing the examples and observe how the compiler responds. Comments in the source call out the type-system behavior being explored.

## License

No license has been added yet. Add one before others reuse or redistribute this project.
