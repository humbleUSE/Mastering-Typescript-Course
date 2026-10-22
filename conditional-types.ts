// Conditional types select a result type based on a type-level assignability check.
interface Animal {
	live(): void;
}

interface Dog extends Animal {
	woof(): void;
}

type Example1 = Dog extends Animal ? number : string;

type Example2 = RegExp extends Animal ? number : string;

// usage: The problem
interface IdLabel {
	id: number /* some fields */;
}

interface NameLabel {
	name: string /* other fields  */;
}

// Approach 1: Using function overloads
function _createLabel(id: number): IdLabel;
function _createLabel(name: string): NameLabel;
function _createLabel(nameOrId: string | number): IdLabel | NameLabel;
// @ts-expect-error - handbook stub; the implementation is intentionally unimplemented.
function _createLabel(nameOrId: string | number): IdLabel | NameLabel {
	throw "unimplemented";
}

// The solution: Using conditional types
type NameOrLabel<T extends string | number> = T extends number
	? IdLabel
	: NameLabel;

// @ts-expect-error - handbook stub; the implementation is intentionally unimplemented.
function createLabel<T extends string | number>(idOrName: T): NameOrLabel<T> {
	throw "unimplemented";
}

const a = createLabel("typescript");

const b = createLabel(2.8);

const c = createLabel(Math.random() ? "hello" : 42);

// Conditional Type constraints
// NOTE: TS don't know type parameter T
// @ts-expect-error - unconstrained T may not have a `message` key.
type _MessageOf<T> = T["message"];
// FIX: Constrain T.
type MessageOf<T extends { message: unknown }> = T["message"];

interface Email {
	message: string;
}

type EmailMessageContents = MessageOf<Email>;

// @ts-expect-error - Dog does not declare the required `message` property.
type DogMessageContents = MessageOf<Dog>;

// Example with Arrays: type Flatten flattens array types to their
// element types, but leaves them alone otherwise:
type Flatten<T> = T extends any[] ? T[number] : T;

// Extracts out the element type.
interface User {
	id: string;
	name: string;
	profession: string;
}

type Str = Flatten<string[]>;
type _OrdinaryNumber = Flatten<number>;
type Num = Flatten<number[]>;
declare type usersArray = User[][];
type Users = Flatten<usersArray>; // Flatten usersArray

// Inferring within Conditional Types using the infer keyword:
type Flatten2<Type> = Type extends Array<infer Item> ? Item : Type;
type Flatten3<Type> = Type extends (infer Item)[] ? Item : Type;

// useful helper type aliases using the infer keyword.
type GetReturnType<Type> = Type extends (...args: never[]) => infer Return
	? Return
	: never;

type Num3 = GetReturnType<() => number>;
type str3 = GetReturnType<(x: string) => string>;
type Bools = GetReturnType<(a: boolean, b: boolean) => boolean[]>;

// Distributive Conditional Types:
type _ToArray<Type> = Type extends any ? Type[] : never;
type ToArray<Type> = [Type] extends [any] ? Type[] : never;
type _strArrOrNumArr = _ToArray<string | number>;
type strArrOrNumArr = ToArray<string | number>;
