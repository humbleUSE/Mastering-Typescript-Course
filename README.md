# Mastering TypeScript Course

[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Bun](https://img.shields.io/badge/Bun-000000?logo=bun&logoColor=white)](https://bun.sh/)

A hands-on TypeScript learning repository focused on practical examples, type-system exploration, and real-world patterns that help developers understand how TypeScript works in practice.

## Overview

This project is a personal study repo for mastering TypeScript, beginning with everyday types and progressing into narrowing, generics, mapped types, conditional types, and advanced type transformations.

Each file is designed to be read, experimented with, and modified. The goal is not to memorize syntax, but to build an intuition for how TypeScript models values, constraints, and relationships.

## Topics Covered

- Everyday types
- Type inference and annotation
- Object types and interfaces
- Unions, literals, and nullability
- Type narrowing and guards
- Function types and overloads
- Generics and constraints
- Mapped types and remapping
- Conditional types and `infer`
- Template literal types

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/)
- TypeScript

### Install dependencies

```bash
bun install
```

### Run a file directly

```bash
bun run "everyday Types.ts"
```

### Type-check the project

```bash
bun run build
```

## Learning Approach

The examples are intentionally exploratory. Some files include intentionally invalid TypeScript code with `@ts-expect-error` to show how the compiler responds to mistakes and how to reason about correct fixes.

This makes the repo a useful companion to the official TypeScript Handbook and a practical tool for strengthening your understanding of type-driven development.

## Project Structure

```text
Mastering-Typescript-Course/
├── everyday Types.ts
├── narrowing.ts
├── object types.ts
├── more on functions.ts
├── generics.ts
├── mapped-types.ts
├── conditional-types.ts
├── Template Literal Types.ts
├── tsconfig.json
├── package.json
├── README.md
└── bun.lock
```

## Notes

This repository is educational and intentionally demonstrates type-system concepts in isolation. It is not a production app or framework project.

## License

No license has been added yet.

---

A focused TypeScript learning project designed to build practical understanding through examples and experimentation.
