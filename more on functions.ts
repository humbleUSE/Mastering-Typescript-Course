// Function typing examples, including signatures, generics, overloads, and `this`.
// A few examples intentionally illustrate type errors; see their nearby annotations.
// MORE ON FUNCTIONS
//
// Function type expressions

type greeterFunction = (msg: string) => void;

function greeter(fn: greeterFunction) {
	fn("hello");
}

function printToConsole(msg: string) {
	console.log(msg);
}

function printToConsole2(msg: string, to: string) {
	console.log(`${to}: ${msg}`);
}

greeter(printToConsole);
// @ts-expect-error - greeter supplies one argument, but this callback requires two.
greeter(printToConsole2);

// CALL SIGNATURES

// An object with a "Call Signature"  e.g a function
type DescribableFunction = {
	description: string;
	(someArg: number): boolean;
};

function doSomething(fn: DescribableFunction) {
	console.log(`${fn.description} returned: ${fn(6)}`);
}

function myFunc(someArg: number) {
	return someArg > 3;
}

myFunc.description = "default description";

doSomething(myFunc);

// CONSTRUCT SIGNATURES

type SomeConstructor = {
	// @ts-expect-error - `SomeObject` is intentionally undefined in this signature example.
	new (s: string): SomeObject;
};

function fn(ctor: SomeConstructor) {
	return new ctor("hello");
}

interface CallOrConstruct {
	(n?: number): string; // call signature
	new (s: string): Date; // construct signature
}

function fn2(__ctor: CallOrConstruct) {
	// @ts-expect-error - use the parameter name `__ctor` from this demonstration.
	ctor(10); // callable as function
	// @ts-expect-error - use the parameter name `__ctor` from this demonstration.
	new ctor("10"); // callable as constructor
}

// GENERIC FUNCTIONS
function _firstElement(arr: any[]) {
	return arr[0];
}

_firstElement([1, 2, 3]);

function firstElement<Type>(arr: Type[]): Type | undefined {
	return arr[0];
}

const a = [][0];
firstElement([]);
firstElement([1, 2, 3]);
firstElement(["a", "b", "c"]);

// INFERENCE
export function map<Input, Output>(
	arr: Input[],
	fn: (n: Input) => Output,
): Output[] {
	return arr.map(fn);
}

map([1, 2, 3], (n) => 2 * n);
map(["1", "2", "3"], parseInt);

// CONSTRAINTS
function longest<T extends { length: number }>(a: T, b: T): T {
	return a.length > b.length ? a : b;
}

const longerArray = longest([1, 2], [1, 2, 3]);
const longerString = longest("12", "123");
// @ts-expect-error - numbers do not have the `length` required by the constraint.
const notOK = longest(10, 100);

function minimumLength<Type extends { length: number }>(
	obj: Type,
	minimum: number,
): Type {
	// @ts-expect-error - returning only `length` would not preserve the specific subtype `Type`.
	return obj.length >= minimum ? obj : { length: minimum };
}

// works fine
const arr = minimumLength([1, 2, 3], 1);
// 'arr' get the value {length:6}
const arr2 = minimumLength([1, 2, 3], 6);
// and crashes here because arrays have a slice()
// methods, but not the returned object!
// console.log(arr2.slice(0,-1)); // fatal error!

// SPECIFYING TYPE ARGUMENTS
function combine<Type>(arr1: Type[], arr2: Type[]): Type[] {
	return arr1.concat(arr2);
}

// @ts-expect-error - both arrays must share one inferred element type.
combine([1, 2, 3], ["hello"]);
combine<string | number>([1, 2, 3], ["hello"]); // works!

// Guidelines for Writing Good Generic Functions
function firstElement1<Type>(arr: Type[]) {
	return arr[0];
}

function firstElement2<Type extends any[]>(arr: Type) {
	return arr[0];
}

// a: number (good)
const _f = firstElement1([1, 2, 3]);
// b: any (bad)
const _f2 = firstElement2([1, 2, 3]);

// Use Fewer Type Parameters
function filter<Type>(arr: Type[], func: (arg: Type) => boolean): Type[] {
	return arr.filter(func);
}
function filter2<Type, Func extends (arg: Type) => boolean>(
	arr: Type[],
	func: Func,
): Type[] {
	return arr.filter(func);
}

const stringArray = filter(["0", "1"], (s) => !parseInt(s, 10));

const stringArray2 = filter2(["1", "0"], (s) => !parseInt(s, 10));

console.log(stringArray);
console.log(stringArray2);
console.clear();
// Optional Parameters in Callbacks
// @ts-expect-error - callback is intentionally unused in this incomplete implementation.
function myForEach(arr: any[], callback: (arg: any, index?: number) => void) {
	for (let i = 0; i < arr.length; i++) {
		// setTimeout(() => callback(arr[i]), 2000);
	}
}
// @ts-expect-error - callback index is optional, so it may be undefined.
myForEach([1, 2, 3], (a, i) => console.log(i.toFixed()));

// myForEach([1, 2, 3], (n, index) => console.log(index.toFixed()));

// @ts-expect-error - the callback's index parameter is intentionally unused here.
myForEach([1, 2, 3], (n, index) => console.log(`num: ${n}`));

// FUNCTION OVERLOADS
// @ts-expect-error - this overload is intentionally incompatible with the implementation below.
function makeDate(timestamp: number): Date;
function makeDate(m: number, d: number, y: number): Date;
function makeDate(mOrTimestamp: number, d: number, y: number): Date {
	if (d != undefined && y != undefined) {
		return new Date(y, mOrTimestamp, d);
	} else {
		return new Date(mOrTimestamp);
	}
}

const d1 = makeDate(1234567);
const d2 = makeDate(1, 3, 2026);
// @ts-expect-error - these overloads intentionally omit a two-argument form.
const d3 = makeDate(1, 3);

console.log(d2);

function _fn(x: string): void;
// function _fn(): void; // function implementation can't be seen from the outside
function _fn() {
	// ...
}
// Expected to be able to call with zero arguments
// @ts-expect-error - only the one-string-argument overload is exposed.
_fn();

// @ts-expect-error - this overload omits a return annotation as a type-checking example.
function _len(s: string);
// @ts-expect-error - this overload omits a return annotation as a type-checking example.
function _len(arr: any[]);
function _len(x: any) {
	return x.length;
}

// test it
_len("");
_len([0]);
// @ts-expect-error - overload call signatures do not accept this union argument.
_len(Math.random() > 0.5 ? "high" : [0]);

function len(x: any[] | string) {
	return x.length;
}

len(Math.random() > 0.5 ? "high" : [0]);

// DECLARING this IN A FUNCTION

interface User {
	admin: boolean;
	becomeAdmin: () => void;
	id: number;
}

// create a users array
const users: User[] = [];

for (const num of [..."12345"]) {
	const rand = Math.ceil(Math.random() * 6) > 3;
	users.push({
		admin: rand,
		becomeAdmin() {
			this.admin = true;
		},
		id: Number(num),
	});
}

// console.log(users);

// create a User object
const user: User = {
	admin: false,
	becomeAdmin() {
		this.admin = true;
	},
	id: 123,
};

// Experimenting with this in ts
// declare the function
function greet(this: User) {
	console.log(`user ID: ${this.id}`);
}

// greet()
// call the function
greet.call(user);

interface DB {
	// method syntax
	filterUsers(filter: (this: User) => boolean): User[];
}

interface DB2 {
	db: User[];
	// property syntax
	filterUsers: (filter: (this: User) => boolean) => User[];
}

// implementation
class DBUser implements DB {
	constructor() {
		for (const num of [..."123456789"]) {
			const rand = Math.ceil(Math.random() * 6) > 3;
			this.#db.push({
				admin: rand,
				becomeAdmin() {
					this.admin = true;
				},
				id: Number(num),
			});
		}
		// output the current db array
		// console.log(this.#db);
	}
	#db: User[] = [];

	filterUsers(predicate: (this: User) => boolean): User[] {
		return this.#db.filter((user) => predicate.call(user));
	}
}

const db = new DBUser();
export const admins = db.filterUsers(function () {
	return this.admin;
});

// Unknown type
function f1(a: any) {
	a.b(); // OK!
}

function f2(a: unknown) {
	// @ts-expect-error - unknown must be narrowed before accessing members.
	a.b();
}

function safeParse(s: string): unknown {
	return JSON.parse(s);
}

const someRandomString = JSON.stringify({ user });
// Need to be careful with "obj"
const obj = safeParse(someRandomString);

console.log(obj);

// Never type
function fail(msg: string): never {
	throw new Error(msg);
}

// Rest Parameter and Arguments
function multiply(n: number, ...m: number[]) {
	return m.map((x) => n * x);
}

// Rest Arguments
const _args = [1, 2];
const args = [1, 2] as const;

multiply(3, ..._args); // ok: passed to rest parameter
multiply(3, ...args); // ok: same
// @ts-expect-error
const _angle = Math.atan2(..._args); // error! not a tuple/rest param
const angle = Math.atan2(...args); // ok passed as tuple here

// PARAMETER DESTRUCTURING
// @ts-expect-error - untyped destructuring parameters are implicit `any` under strict mode.
function _sum({ a, b, c }) {
	console.log(a + b + c);
}

function __sum({ a, b, c }: { a: number; b: number; c: number }) {
	console.log(a + b + c);
}

// BEST FIX
type ABC = {
	a: number;
	b: number;
	c: number;
};

function sum({ a, b, c }: ABC) {
	console.log(a + b + c);
}

type VF = () => void;
const vf: VF = () => true;
const vf2: VF = () => {
	return true;
};

const v1 = vf();
const v2 = vf2();

// will return true though
console.log(typeof v1, typeof v2);
console.log(v1, v2);

const src = [1, 2, 3];
const dst = [0];

src.forEach((ele) => dst.push(ele));

// these will mandate a non-void return type (not used in context)
function __f2(): void {
	// @ts-expect-error
	return true;
}

const __f3 = (): void => {
	// @ts-expect-error
	return true;
};

const ___f3 = (): void => {
	// @ts-expect-error
	return true;
};
