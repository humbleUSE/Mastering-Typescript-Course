// Template literal types build string literal types from other types and literal text.

type World = "world";

type Greeting = `hello ${World}`;

type EmailLocaleIDs = "welcome_email" | "email_heading";

type AllLocaleIDs = `${EmailLocaleIDs}_id`;
type Lang = "en" | "fr";

type LocaleMessageIDs = `${Lang}_${AllLocaleIDs}`;

// String Unions in Types:
// the power in template literals come when defining a
// new string based on information inside a type.

const baseObj = { age: 26, firstName: "Saoirse", lastName: "Ronan" };

// function makeWatchedObject(baseObj: any) {
//   baseObj.on = (eventName: unknown, callback: unknown) => { };

//   return baseObj;
// }

type PropEventSource<Type> = {
	on<Key extends string & keyof Type>(
		eventName: `${Key}Changed`,
		callback: (newValue: Type[Key]) => void,
	): void;
};

/// create a 'watched object' with an "on" method
// so that you can watch for changes to properties
declare function makeWatchedObject<Type>(
	obj: Type,
): Type & PropEventSource<Type>;

const person = makeWatchedObject(baseObj);
person.on("firstNameChanged", () => {
	console.log("firstName changed");
});
person.on("ageChanged", () => {});
// @ts-expect-error - the misspelled property name should be rejected.
person.on("firtNameChanged", () => {});
