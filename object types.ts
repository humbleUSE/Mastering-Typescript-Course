// Object type experiments: properties, composition, generics, arrays, and tuples.
// Some expressions are intentionally invalid to demonstrate compiler diagnostics.
//NOTE: Object Types
{
	// anonymous
	function _greet(person: { name: string; age: number }) {
		return `Hello${person.name}`;
	}

	interface Person {
		// @ts-expect-error - later declaration intentionally explores incompatible modifiers.
		age: number;
		// @ts-expect-error - later declaration intentionally explores incompatible modifiers.
		name: string;
	}

	function __greet(person: Person) {
		return `Hello${person.name}`;
	}

	type PersonType = {
		name: string;
		age: number;
	};

	function greet(person: PersonType) {
		return `Hello${person.name}`;
	}

	const person = {
		age: 2,
		name: "jude",
	};

	_greet(person);
	__greet(person);
	greet(person);

	// OPTIONAL PROPERTIES
	interface PaintOptions {
		shape: Shape;
		xPos?: number;
		yPos?: number;
	}

	type Shape = {
		name: string;
	};

	function getShape(): Shape {
		return { name: Math.ceil(Math.random() * 2) > 1 ? "square" : "circle" };
	}

	// @ts-expect-error - placeholder function intentionally leaves its parameter unused.
	function _paintShape(opts: PaintOptions) {
		//
	}

	function __paintShape(opts: PaintOptions) {
		opts.xPos; // no error yet!

		// rerrors only when xPos is required to be a number
		// @ts-expect-error - optional `yPos` may be undefined until checked or defaulted.
		const newYPos = opts.yPos + 2;

		// @ts-expect-error - `dd` is intentionally not a PaintOptions property.
		opts.dd;
	}

	// FIX: default properties
	function paintShape({ shape, xPos = 0, yPos = 0 }: PaintOptions) {
		xPos;
		shape;
		yPos;
	}

	const shape = getShape(); // returns a Shape object
	console.log({ shape });

	// all possible configurations
	paintShape({ shape });
	paintShape({ shape, xPos: 23 });
	paintShape({ shape, yPos: 23 });
	paintShape({ shape, xPos: 23, yPos: 12 });

	console.clear();
	// Readonly properties
	interface SomeType {
		readonly prop: string;
	}

	function doSomething(obj: SomeType) {
		// we can read from "obj.prop".
		obj.prop;
		// But we can't re-assign it.
		// @ts-expect-error - readonly prevents assigning to this property.
		obj.prop = "new value";
	}

	// readonly doesn't mean immutability
	interface Home {
		readonly resident: { name: string; age: number };
	}

	function visitForBirthday(home: Home) {
		console.log(`Happy birthday ${home.resident}!`);
		home.resident.age++;
	}

	function evict(home: Home) {
		// @ts-expect-error - the resident reference is readonly, even though its nested fields are mutable.
		home.resident = { age: 23, name: "kate" };
	}

	interface Person {
		// @ts-expect-error - conflicts with the earlier mutable `Person.age` declaration.
		readonly age: number;
		// @ts-expect-error - conflicts with the earlier mutable `Person.name` declaration.
		readonly name: string;
	}
	interface ReadonlyPerson {
		readonly age: number;
		readonly name: string;
	}

	const writablePerson: Person = { age: 32, name: "Joel" };

	// works!
	const readonlyPerson: ReadonlyPerson = writablePerson;

	console.log(`readonlyPerson.age ${readonlyPerson.age}`);
	writablePerson.age++;
	console.log(`readonlyPerson.age ${readonlyPerson.age}`);

	// INDEX SIGNATURES
	interface StringArray {
		[index: number]: string;
	}
	function getStringArray() {
		return [..."0123"];
	}
	const _myArray = getStringArray();
	const secondItem = _myArray[1];
	console.log(_myArray);
	// indexing myArray by a non-number errors!
	for (const num of _myArray) {
		// console.log(myArray[num]);
	}

	// indexing by a number must give a string in return
	for (const num of _myArray) {
		// console.log(myArray[Number(num)]);
	}

	// Supporting multiple types of indexers
	interface Animal {
		name: string;
	}
	// sub-type
	interface Dog extends Animal {
		breed: string;
	}

	interface NotOkay {
		// @ts-expect-error - number-indexed values must satisfy the string index's Dog type.
		[inde: number]: Animal; // error dog is a sub type of Animal

		[index: string]: Dog;
	}

	// every properties must match their index type
	interface NumberDictionary {
		length: number;
		// @ts-expect-error - every named property must match the string index value type.
		name: string;
		[index: string]: number;
	}

	// except if the index signature is a union type
	interface NumberOrStringDictionary {
		length: number; // ok, length is a number
		name: string; // ok name is a string
		[index: string]: number | string;
	}

	interface ReadonlyStringArray {
		readonly [index: number]: string;
	}

	function getReadonlyStringArray(): ReadonlyStringArray {
		return [..."12345"];
	}
	const myArray: ReadonlyStringArray = getReadonlyStringArray();
	const num = myArray[2]; // reading allowed
	// @ts-expect-error - readonly index signatures disallow writes.
	myArray[2] = "new number";

	console.log(myArray); // changes still takes effect at runtime.

	// Excess Property Checks
	interface _SquareConfig {
		color?: string;
		width?: number;
	}

	function _createSquare(config: _SquareConfig): {
		color: string;
		area: number;
	} {
		return {
			area: config.width ? config.width ** 2 : 20,
			color: config.color || "red",
		};
	}

	// 1.  excess property checking for object literals is strictly enforced
	// @ts-expect-error - excess-property checking catches the misspelled `color` key.
	let _mySquare = _createSquare({ colour: "red", width: 100 });
	// 2.  assigning to a variable as long as the type has a common
	// property, passes.
	const obj = { colour: "red", width: 100 };
	_mySquare = _createSquare(obj);
	_mySquare = _createSquare({ opacity: 0.5, width: 100 } as _SquareConfig);

	// 3.  A better approach
	interface SquareConfig {
		color?: string;
		width?: number;
		[propName: string]: unknown;
	}

	function createSquare(config: SquareConfig): { color: string; area: number } {
		return {
			area: config.width ? config.width ** 2 : 20,
			color: config.color || "red",
		};
	}
	let mySquare = createSquare({ colour: "red", width: 100 });
	mySquare = createSquare({ color: "pink", pos: { x: 10, y: 15 }, width: 10 });

	// Extending Types
	interface BasicAddress {
		city: string;
		country: string;
		name?: string;
		postalCode: string;
		street: string;
	}

	interface AddressWithUnit extends BasicAddress {
		unit: string;
	}

	// interfaces can also extend from multiple types.
	interface Colorful {
		color: string;
	}

	interface Circle {
		radius: number;
	}

	interface _ColourfulCircle extends Colorful, Circle {}

	const _cc: _ColourfulCircle = { color: "red", radius: 40 };

	// INTERSECTION TYPES
	interface Colorful {
		color: string;
	}

	interface Circle {
		radius: number;
	}

	type ColourfulCircle = Colorful & Circle;
	const cc: ColourfulCircle = { color: "red", radius: 40 };

	function draw(circle: ColourfulCircle) {
		console.log(`Color was ${circle.color}`);
		console.log(`Radius was ${circle.radius}`);
	}

	// okay
	draw({ color: "blue", radius: 42 });

	// oops
	// @ts-expect-error - the property is intentionally misspelled (`radius`).
	draw({ color: "red", raidus: 42 });

	// INTERFACE EXTENSION VS. INTERSECTION
	// 1. with interfaces
	interface Person {
		name: string;
	}

	interface Person {
		// @ts-expect-error - declaration merging rejects a conflicting property type.
		name: number;
	}

	// 2. with a type alias
	interface Person1 {
		name: string;
	}
	interface Person2 {
		name: number;
	}

	type Staff = Person1 & Person2;
	// @ts-expect-error
	declare let staffer: Staff;
	// staffer.name;

	// Generic Object Types
	// 1. use 'any' type
	interface _Box {
		contents: any;
	}

	// 2. use 'unknown' type
	interface __Box {
		contents: unknown;
	}

	const x: __Box = { contents: "string-value" };
	// we could check 'x.contents'
	if (typeof x.contents === "string") {
		console.log(x.contents.toLocaleLowerCase());
	}
	// or we could use a type assertion
	console.log((x.contents as string).toLocaleLowerCase());

	// 3. scaffold each Box type for every type of contents
	interface _NumberBox {
		contents: number;
	}
	interface _stringBox {
		contents: string;
	}

	interface _BooleanBox {
		contents: boolean;
	}

	// Usage:
	function _setContents(box: _stringBox, newContents: string): void;
	function _setContents(box: _NumberBox, newContents: number): void;
	function _setContents(box: _BooleanBox, newContents: boolean): void;
	function _setContents(box: { contents: any }, newContents: any) {
		box.contents = newContents;
	}
	// 4. Optimal solution: Use generic object type
	interface BoxInterface<Type> {
		contents: Type;
	}

	// usage:
	let _boxString: BoxInterface<string>;
	let _boxBoolean: BoxInterface<boolean>;
	let _boxNumber: BoxInterface<number>;

	_boxString = { contents: "string" };
	_boxBoolean = { contents: true };
	_boxNumber = { contents: 1234 };

	_boxString.contents;

	// avoiding overload by using generics
	function setContents<Type>(box: BoxInterface<Type>, newContents: Type) {
		box.contents = newContents;
	}

	type stringBox = BoxInterface<string>;

	// usage:
	const box: stringBox = { contents: "strings" };
	setContents(box, "new strings");

	// type aliases can also be generic
	type BoxType<Type> = {
		contents: Type;
	};

	// using type aliases to descripbe more than just object types. exploring generic helper types.
	type orNull<T> = T | null;
	type oneOrMany<T> = T | T[];
	type oneOrManyOrNull<T> = orNull<oneOrMany<T>>;

	// usage:
	type oneOrManyOrNullStrings = oneOrManyOrNull<string>;

	let vv: oneOrManyOrNullStrings = null;
	vv = "first";
	vv = ["first", "second"];
	// @ts-expect-error - this alias permits strings, string arrays, or null only.
	vv = 123;

	// end of block
}
// The Array Type
// @ts-expect-error - parameter is intentionally unused in this type illustration.
function doSomething(value: Array<string>) {
	// ...
}

const myArray: string[] = ["hello", "world"];

// either of these works!
doSomething(myArray);
doSomething(["hello", "world"]);

// The ReadonlyArray Type
// Array: read\write allowed.
function doStuffMutable(values: Array<string>) {
	// we can read from 'values'...
	const copy = values.slice();
	console.log(`The first value is ${values[0]}`);

	// ... and we can't mutate 'values'
	values.push("hello");
}

// ReadonlyArray permits reads but not writes; a separate name keeps this example independently runnable.
function doStuffReadonly(values: ReadonlyArray<string>) {
	// we can read from 'values'...
	const copy = values.slice();
	console.log(`The first value is ${values[0]}`);

	// ... but we can't mutate 'values'
	// @ts-expect-error - readonly arrays expose no mutating `push` method.
	values.push("hello");
}

const roArray: ReadonlyArray<string> = ["red", "green"];

// `readonly string[]` is shorthand for ReadonlyArray<string>.
function doStuffReadonlySyntax(values: readonly string[]) {
	// We can read from 'values' ...
	const copy = values.slice();
	console.log(`The first value is ${values[0]}`);

	// ...but we can't mutate 'values'.
	// @ts-expect-error - readonly arrays expose no mutating `push` method.
	values.push("hello");
}

//  TUPLE TYPES
type StringNumberPair = [string, number];

function doSomething2(pair: StringNumberPair) {
	const a = pair[0];

	const b = pair[1];

	// can't access an index that don't exist!
	// @ts-expect-error - this two-element tuple has no index 2.
	const c = pair[2];
	// ...
}

doSomething2(["hello", 42]);
// @ts-expect-error - the tuple's second element must be a number.
doSomething2(["hello", true]);

// tuples can be destructured
function hashString(stringHash: [string, number]) {
	const [inputString, hash] = stringHash;

	inputString.toLocaleLowerCase();

	hash.toFixed();
}

// tuples can have optional properties
type Either2dOr3d = [number, number, number?];
function setCoordinate(coord: Either2dOr3d) {
	const [x, y, z] = coord;
	x;
	y;
	z;
}

// tuples can have rest elements.
type StringnumberBooleans = [string, number, ...boolean[]];

// readonly tuples
const point = [3, 4] as const;

function _distanceFromOrigin([x, y]: [number, number]) {
	return Math.sqrt(x ** 2 + y ** 2);
}

function distanceFromOrigin([x, y]: readonly [number, number]) {
	return Math.sqrt(x ** 2 + y ** 2);
}

// @ts-expect-error - a readonly tuple cannot be passed as a mutable tuple.
_distanceFromOrigin(point);
distanceFromOrigin(point); // ok!
