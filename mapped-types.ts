// Mapped types derive a new type by iterating over the keys of an existing type.

type OptionsFlag<Type> = {
	[Property in keyof Type]: boolean;
};

// usage:
type Features = {
	darkMode: () => void;
	newUserProfile: () => void;
};

type FeatureOptions = OptionsFlag<Features>;

// Mapping Modifiers

// Removes 'readonly' attributes from a type's properties
type CreateMutable<Type> = {
	-readonly [Property in keyof Type]: Type[Property];
};

type LockedAccount = {
	readonly id: string;
	readonly name: string;
};

type UnlockedAccount = CreateMutable<LockedAccount>;

// Removes 'optional' attributes from a type's properties

type Concrete<Type> = {
	[Property in keyof Type]-?: Type[Property];
};

type MaybeUser = {
	id: string;
	name?: string;
	age?: number;
};

type User = Concrete<MaybeUser>;

// Key Remapping via as
type MappedTypeWithNewProperties<Type> = {
	// @ts-expect-error - placeholder key type; replace `_NewKeyType` with a real remapping expression.
	[Properties in keyof Type as _NewKeyType]: Type[Properties];
};

type Getters<Type> = {
	[Property in keyof Type as `get${Capitalize<Property & string>}`]: () => Type[Property];
};

interface Person {
	age: number;
	location: string;
	name: string;
}

type LazyPerson = Getters<Person>;

// Remove the 'kind' property
type RemoveKindField<T> = {
	[P in keyof T as Exclude<P, "kind">]: T[P];
};
interface Circle {
	kind: "circle";
	radius: number;
}

type KindlessCircle = RemoveKindField<Circle>;

// Mapping over arbitrary unions
type EventConfig<Events extends { kind: string }> = {
	[E in Events as E["kind"]]: (event: E) => void;
};

type SquareEvent = { kind: "square"; x: number; y: number };
type CircleEvent = { kind: "circle"; radius: number };

type Config = EventConfig<SquareEvent | CircleEvent>;
