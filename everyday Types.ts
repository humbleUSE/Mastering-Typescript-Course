// Everyday types: annotations, inference, objects, unions, and nullability.
// These small examples are intended for experimentation in the TypeScript compiler.
// import { styleText } from "node:util";

// MASTERING TYPESCRIPT

const msg = "hi";

console.log(msg.toLocaleLowerCase());

// msg()

const user = {
	age: 26,
	name: "dan",
};

// console.log(user.location);

function flipCoin() {
	// return Math.random<0.5;
}

// flipCoin()

// const value = Math.random() > 0.5 ? "a" : "b";

// if (value !=='a') console.log(value);
// else if(value==='b')console.log(value);
console.log(String(new Date()));

function greet(person: string, date: Date) {
	console.log(`Hello ${person}, today is ${date.toDateString()}`);
}

greet("usifo emma", new Date());

declare let arr: Array<number>;
// arr = [1, 2];

const obj: any = { x: 0 };

// obj.plane();
// obj.random();
obj.last = "last";
const n = obj;
console.log(n);

const name = "alice";
const name2 = "alice" as const;
const name3 = "alice";

async function getFavoriteNumber(): Promise<number> {
	return await Promise.resolve(26);
}

const names = ["Alice", "Bob", "Eve"] as const;
const names2 = ["Alice", "Bob", "Eve"];

names.forEach((name) => {
	console.log(name);
});

names2.forEach((name) => {
	console.log(name);
});

type Point = {
	x: number;
	y: number;
	z?: number;
};

function printCoord(pt: Point) {
	if (pt.z !== undefined) return console.log(pt.x, pt.y, pt.z);
	else return console.log(pt.x, pt.y);
}

// printCoord({ x: 1});
printCoord({ x: 1, y: 2 });
printCoord({ x: 1, y: 2, z: 3 });

function printName(obj: { first: string; last?: string }) {
	// console.log(obj.last?.toLocaleLowerCase());

	// if (obj.last !== undefined) return console.log(obj.last?.toLocaleLowerCase());

	console.log(obj.last?.toLowerCase());
}

//* Union types
const p = "post" as const;
type ID = string | number;

function printId(id: ID) {
	// const idType = typeof id;

	if (typeof id === "string") console.log(id.toUpperCase());
	else console.log(typeof id);
}

printId(22);
printId("22");
// printId({ Id: 22 }); //! error

interface Animal {
	name: string;
}

interface Bear extends Animal {
	honey: boolean;
}

interface Animal {
	fang: boolean;
}

const _x = "hello" as unknown as number;
console.log(_x);

const x2: "hello" = "hello";
// x2='howdy'

interface Options {
	width: number;
}
// @ts-expect-error - this type-only demonstration intentionally doesn't use its parameter.
function configure(x: Options | "auto" | "manual") {
	// ...
}

configure({ width: 2 });
configure("auto");
configure("manual");
// configure('ai')

// @ts-expect-error - this type-only demonstration intentionally doesn't use its parameter.
function configure2(x: boolean) {
	//
}

configure2(true);
configure2(false);
// configure2(!`inodeyo`)  return a === b ? 0 : a > b ? 1 : -1;

// Literal Inference
interface Obj2 {
	count: 0;
}
const obj2: Obj2 = { count: 0 };
// if (true) obj2.count = 1; // error!

const obj3 = { count: 0 };
console.log(typeof obj3);

declare function handleRequest(url: string, method: "GET" | "POST"): unknown;

const req = { method: "GET", url: "https://example.com" } as const;
// req.method='PUT' //! error
// handleRequest(req.url, req.method);

//* null and undefined
function doSomething(x: string | null) {
	if (x === null) return;

	console.log(x.toLocaleLowerCase());
}

//* non-null Assertion Operator
function liveDangerously(x?: number | null) {
	console.log(x!.toFixed);
}
