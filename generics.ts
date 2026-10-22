// GENERICS: INTRODUCTION

// Generics preserve relationships between input and output types without resorting to `any`.

// Try changing the arguments below and inspect the inferred types in your editor.

// Identity function
function _identity(arg: number): number {
	return arg;
}
function __identity(arg: any): any {
	return arg;
}

// return "type" info is lost
let _output = __identity(12);
_output = __identity("12");
_output = __identity(true);

// the fix: using type parameters
function identity<T>(arg: T): T {
	return arg;
}

// usage:
// explicitly setting the type argument, here as 'string'
const stringOutput = identity<string>("12");
// using type inference
const stringOutput2 = identity("12");

const numberOutput = identity(12);
const booleanOutput = identity(true);

// Working with Generic Type Variable
function _loggingIdentity<T>(arg: T): T {
	// @ts-expect-error - unconstrained T does not guarantee a `length` property.
	console.log(arg.length);
	return arg;
}

// working with array of type T.
function __loggingIdentity<T>(arg: T[]): T[] {
	console.log(arg.length); // works!
	return arg;
}

// GENERIC TYPES
function _identityFunc<T>(arg: T): T {
	return arg;
}
{
	// Type of generic functions:
	const myIdentity_: <Input>(arg: Input) => Input = _identityFunc;
}
{
	// as a call signature
	const myIdentity: <T>(arg: T) => T = identity;
}
{
	// GENERIC INTERFACES
	interface GenericIdentityFn {
		// biome-ignore lint/style/useShorthandFunctionType: <>
		<T>(arg: T): T;
	}

	const _myIdentity2: GenericIdentityFn = identity;
}
{
	// moving the type parameter to be a parameter of the whole
	// interface
	interface GenericIdentityFn<T> {
		// biome-ignore lint/style/useShorthandFunctionType: <>
		(arg: T): T;
	}

	const _myIdentity: GenericIdentityFn<number> = identity;
}

/* NOTE: Understanding when to put the type parameter directly on the call signature and when to put it on the interface itself will be helpful in describing what aspects of a type are generic. */

// GENERIC CLASSES
class GenericNumber<NumType> {
	// @ts-expect-error - definite-assignment study: fields are assigned after construction below.
	zeroValue: NumType;
	// @ts-expect-error - definite-assignment study: assigned immediately after construction below.
	add: (x: NumType, y: NumType) => NumType;
}

const myGenericNumber = new GenericNumber<number>();
myGenericNumber.zeroValue = 0;
myGenericNumber.add = (x, y) => x + y;

/* NOTE: Just as with interface, putting the type parameter on the class itself lets us make sure all of the properties of the class are working with the same type.  */

{
	// Generic Constraints
	interface Lengthwise {
		length: number;
	}

	function loggingIdentity<T extends Lengthwise>(arg: T): T {
		arg.length; // works
		return arg;
	}

	loggingIdentity({ length: 10, value: 3 });
	loggingIdentity([1, 2]);
	loggingIdentity("123");
	// @ts-expect-error - numbers do not satisfy the `Lengthwise` constraint.
	loggingIdentity(3);
}

// USING TYPE PARAMETER IN GENERIC CONSTRAINTS
function getProperty<Type, Key extends keyof Type>(obj: Type, key: Key) {
	return obj[key];
}

const x = { a: 1, b: 2, c: 3, d: 4 };

getProperty(x, "a"); // works
// @ts-expect-error - only keys present on `x` are accepted.
getProperty(x, "m");

// GENERIC PARAMETER DEFAULTS
