// Narrowing lets TypeScript refine a union based on runtime checks and control flow.
//* Narrowing
function padleft(padding: number | string, input: string): string {
	if (typeof padding === "number") return "".repeat(padding) + input;

	return padding + input;
}
console.log(typeof null);
console.log(typeof undefined);
console.log(true && []);
console.log(false && []);

function printAllBasic(strs: string | string[] | null) {
	if (strs && typeof strs === "object") {
		for (const str of strs) {
			console.log(str);
		}
	} else if (typeof strs === "string") {
		console.log(strs);
	} else {
		// do nothing
	}
}

// console.log(typeof null);
// console.log(typeof undefined);
// console.log(true && []);

// @ts-expect-error
console.log("" && "[empty string]");
// @ts-expect-error
console.log([] && "[empty array]");

// nullish coalescence
console.log("\nnullish coalescence");
// @ts-expect-error
console.log("" ?? true, "[empty string]");
// @ts-expect-error
console.log(0 ?? [1]);
// @ts-expect-error
console.log([] ?? "[empty array]");
// @ts-expect-error
console.log(null ?? [null]);
// @ts-expect-error
console.log(undefined ?? [undefined]);

// Understanding Narrowing
function printAll(arg: string | string[] | null) {
	// typeof null == object too!
	if (arg && typeof arg === "object") {
		console.log(`arg: ${arg.constructor.name}`);
	} else if (typeof arg === "string") {
		if (arg.length === 0) {
			console.log(`${arg}arg: empty string`);
			return;
		}
		console.log(`arg: ${arg}`);
	} else {
		// do nothing
		console.log(`arg: ${arg}`);
	}
}

console.clear();
console.log("\nprintAll tests:");
// printAll(undefined); // error!
printAll(null);
printAll("");
printAll("non-empty string");

function printAll2(arg: string | string[] | null) {
	if (arg) {
		// array<string> or non-empty string:
		Array.isArray(arg)
			? console.log(`arg: ${arg.constructor.name}`)
			: console.log("arg: non-empty string");
		return;
	} else {
		// Narrowing: falsy value check for '' or null
		arg === null
			? console.log(`arg: ${null}`)
			: console.log("arg: empty string");
	}
}

console.log(`\nprintAll2 tests:`);
printAll2("");
printAll2(null);
printAll2("non-empty string");
printAll2([..."123"]);

function multiplyAll(values: number[] | undefined, factor: number) {
	return Array.isArray(values) ? values.map((n) => n * factor) : values;
}

console.log(multiplyAll([1, 2, 3], 2));

// Equality narrowing
function example(x: string | number, y: string | boolean) {
	if (x === y) {
		// both are of type string
		x.toUpperCase();
		y.toUpperCase();
	} else {
		console.log(x);
		console.log(y);
	}
}

// refactor to explicitly remove null:
function printAll3(arg: string | string[] | null) {
	if (arg !== null) {
		// array<string> or non-empty string:
		Array.isArray(arg)
			? console.log(`arg: ${arg.constructor.name}`)
			: console.log("arg: non-empty string");
		return;
	} else {
		// only  null here:
		console.log(`arg: ${null}`);
	}
}

// JavaScript’s looser equality checks
console.log(null == undefined);
console.log(null === undefined);

interface Container {
	value: number | null | undefined;
}

function multiplyValue(container: Container, factor: number) {
	if (container.value != null) {
		// loose equality strips null and undefined
		const result = container.value * factor;
		console.log(container.value, result);
	}
}

console.clear();
multiplyValue({ value: null }, 4);
multiplyValue({ value: undefined }, 4);
multiplyValue({ value: 2 }, 8);

// FIXME: the in operator narrowing:
{
	type Fish = { swim: () => "swimming" };
	type Bird = { fly: () => "flying" };
	type Human = { swim?: () => "swimming"; fly?: () => "flying" };

	function move(animal: Fish | Bird | Human) {
		if ("swim" in animal) {
			animal;
		} else {
			animal;
		}
	}
}

// Assignments
let x = Math.random() < 0.5 ? 10 : "s";
x = 1;
x = "one";
// x = true; // error!

// Control flow analysis
function example2() {
	// declared the variable here
	let x: string | number | boolean;

	x = Math.random() < 0.5;
	x; // boolean

	if (Math.random() < 0.5) {
		x = "hello";
		x; // string
	} else {
		x = 100;
		x; // number
	}

	x = true; // boolean last return type
	return x;
}

// Classes
class Fish {
	swim = () => "swimming";
	toString() {
		return "Fish";
	}
}
class Bird {
	fly = () => "flying";
}

// type predicates:
function isFish(pet: Fish | Bird): pet is Fish {
	return (pet as Fish).swim != undefined;
}
function isBird(pet: Fish | Bird): pet is Bird {
	return (pet as Bird).fly !== undefined;
}

function fishFactory() {
	return new Fish();
}
function birdFactory() {
	return new Bird();
}

const pet = Math.random() > 0.3 ? fishFactory() : birdFactory();

if (isFish(pet)) {
	pet.swim();
} else {
	pet.fly();
}

const zoo = [
	birdFactory(),
	fishFactory(),
	fishFactory(),
	birdFactory(),
	fishFactory(),
];

const aquarium = zoo.filter(isFish);

for (const fish of aquarium) {
	console.log(fish.swim());
}

// Discriminated unions
interface Shape2 {
	kind: "circle" | "squares";
	radius?: number;
	sideLength?: number;
}

const shape: Shape2 = { kind: "circle", radius: 2, sideLength: 4 };

// @ts-expect-error - this early example is incomplete for the square case.
function getArea(shape: Shape2) {
	if (shape.kind === "circle") {
		const result = Math.PI * shape.radius! ** 2;

		return result;
	}
}

interface Circle {
	kind: "circle";
	radius: number;
}

interface Square {
	kind: "square";
	sideLength: number;
}

type Shape = Circle | Square;

function getArea2(shape: Shape) {
	// @ts-expect-error - this deliberately omits narrowing and fails for the square variant.
	return Math.PI * shape.radius ** 2;
}

function getArea3(shape: Shape) {
	if (shape.kind === "circle") {
		shape;
		return Math.PI * shape.radius ** 2;
	}

	shape;
	return shape.sideLength ** 2;
}

// using a switch statement and exhaustiveness checking
function getArea4(shape: Shape) {
	switch (shape.kind) {
		case "circle":
			shape; // circle
			return Math.PI * shape.radius ** 2;
		case "square":
			shape; // square
			return shape.sideLength ** 2;
		default: {
			const _exhaustiveCheck: never = shape;
			return _exhaustiveCheck;
		}
	}
}

interface Triangle {
	kind: "triangle";
	sideLength: number;
}

type ShapeCRS = Shape | Triangle;
// using a switch statement and exhaustiveness checking
function getArea5(shape: ShapeCRS) {
	switch (shape.kind) {
		case "circle":
			shape; // circle
			return Math.PI * shape.radius ** 2;
		case "square":
			shape; // square
			return shape.sideLength ** 2;
		default: {
			// @ts-expect-error - Triangle has no matching case yet; add one to restore exhaustiveness.
			const _exhaustiveCheck: never = shape;
			return _exhaustiveCheck;
		}
	}
}
