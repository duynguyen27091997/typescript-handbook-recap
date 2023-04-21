# Basic  types
  
##  Introduction

In order for a program to be valuable, we need to be able to handle the simplest data units: numbers, strings, structs, booleans, etc. TypeScript supports almost the same data types as JavaScript, and also provides practical enumeration types for our convenience.

## Boolean

The most basic data type is the simple true/false value, called `boolean` in JavaScript and TypeScript (and in other languages ​​as well).

```typescript
let isDone: boolean = false;
```

## Number

Like JavaScript, all numbers in TypeScript are floats or big integers. These floating-point numbers are of type `number` , and big integers are of type `bigint` . In addition to supporting decimal and hexadecimal literals, TypeScript also supports binary and octal literals introduced in ECMAScript 2015.

```typescript
let decLiteral: number = 6;
let hexLiteral: number = 0xf00d;
let binaryLiteral: number = 0b1010;
let octalLiteral: number = 0o744;
let bigLiteral: bigint = 100n;
```

## String

Another basic operation of a JavaScript program is to process text data on a web page or on the server side. Like in other languages, we use `string` to represent the text data type. Like JavaScript, strings can be represented using double quotes ( `"` ) or single quotes ( `'` ).

```typescript
let name: string = "bob";
name = "smith";
```

You can also use _template strings_ , which can define multiline text and embedded expressions. This kind of string is surrounded by backticks ( \`  \` ), and embedded expressions in the form of `${ expr }`

```typescript
let name: string = `Gene`;
let age: number = 37;
let sentence: string = `Hello, my name is ${ name }.

I'll be ${ age + 1 } years old next month.`;
```

This has the same effect as defining `sentence` as follows :

```typescript
let sentence: string = "Hello, my name is " + name + ".\n\n" +
    "I'll be " + (age + 1) + " years old next month.";
```

## Array

TypeScript can manipulate array elements like JavaScript. There are two ways to define arrays. The first one can be followed by `[]` after the element type , which means an array composed of elements of this type:

```typescript
let list: number[] = [1, 2, 3];
```

The second way is to use the array generic, `Array<element type>` :

```typescript
let list: Array<number> = [1, 2, 3];
```

## Tuple

The tuple type allows representing an array with a known number and type of elements, which do not have to be of the same type. For example, you can define a pair of tuples whose values ​​are `string` and `number` .

```typescript
// Declare a tuple type
let x: [string, number];
// Initialize it
x = ['hello', 10]; // OK
// Initialize it incorrectly
x = [10, 'hello']; // Error
```

When accessing an element with a known index, the correct type is obtained:

```typescript
console.log(x[0].substr(1)); // OK
console.log(x[1].substr(1)); // Error, 'number' does not have 'substr'
```

An error will be reported when accessing an out-of-bounds element.

```typescript
x[3] = "world"; // Error, Property '3' does not exist on type '[string, number]'.

console.log(x[5].toString()); // Error, Property '5' does not exist on type '[string, number]'.
```

## Enum

The `enum` type is an addition to JavaScript's standard data types. Like other languages ​​such as C \# , enumeration types can be used to give friendly names to a set of values.

```typescript
enum Color {Red, Green, Blue}
let c: Color = Color.Green;
```

By default, elements are numbered starting from `0` . You can also manually specify the value of the member. For example, let's change the above example to start numbering from `1` :

```typescript
enum Color {Red = 1, Green, Blue}
let c: Color = Color.Green;
```

Or, use manual assignment for all:

```typescript
enum Color {Red = 1, Green = 2, Blue = 4}
let c: Color = Color.Green;
```

One of the conveniences provided by enumeration types is that you can get the name of the enumeration from its value. For example, we know that the value is 2, but we are not sure which name it maps to in Color, we can look up the corresponding name:

```typescript
enum Color {Red = 1, Green, Blue}
let colorName: string = Color[2];

console.log(colorName);   // display 'Green' because its value is 2 in the code above
```

## Unknown

When we are writing an application, we may need to describe a variable whose type we do not yet know. These values ​​can come from dynamic content, eg from the user, or we want to receive all possible types of values ​​in our API. In these cases, we want to let the compiler and future users know that the variable can be of any type. This time we will use the `unknown` type for it.

```typescript
let notSure: unknown = 4;
notSure = "maybe a string instead";

// OK, definitely a boolean
notSure = false;
```

If you have a variable of type `unknwon` , you can narrow down its type by performing `typeof` , comparisons, or more advanced type checking, which are discussed further in subsequent chapters:

```typescript
// @errors: 2322 2322 2322
declare const maybe: unknown;
// 'maybe' could be a string, object, boolean, undefined, or other types
const aNumber: number = maybe;

if (maybe === true) {
  // TypeScript knows that maybe is a boolean now
  const aBoolean: boolean = maybe;
  // So, it cannot be a string
  const aString: string = maybe;
}

if (typeof maybe === "string") {
  // TypeScript knows that maybe is a string
  const aString: string = maybe;
  // So, it cannot be a boolean
  const aBoolean: boolean = maybe;
}
```

## Any

Sometimes, we will want to assign a type to variables whose type is not clear at the programming stage. These values ​​may come from dynamic content, such as from user input or third-party code libraries. In this case, we don't want the type checker to check these values ​​and let them pass the compilation phase check directly. Then we can use `any` type to mark these variables:

```typescript
let notSure: any = 4;
notSure = "maybe a string instead";
notSure = false; // okay, definitely a boolean
```

The `any` type is useful when rewriting existing code , allowing you to optionally include or remove type checking at compile time. You might think that `Object` has a similar effect, as it does in other languages. But a variable of type `Object` just allows you to assign arbitrary values ​​to it - but you cannot call arbitrary methods on it, even if it does have these methods:

```typescript
let notSure: any = 4;
notSure.ifItExists(); // okay, ifItExists might exist at runtime
notSure.toFixed(); // okay, toFixed exists (but the compiler doesn't check)

let prettySure: Object = 4;
prettySure.toFixed(); // Error: Property 'toFixed' doesn't exist on type 'Object'.
```

> NOTE: `Object` should be avoided, use non-primitive `object` types instead, as in [Do's and Don'ts](../doc/handbook/declaration%20files/Do's%20and%20Don'ts.md) As said in.
The `any` type is also useful when you only know the type of some of the data . For example, you have an array that contains data of different types:

```typescript
let list: any[] = [1, true, "free"];

list[1] = 100;
```

## Void

In a way, the `void` type is like the opposite of the `any` type, which means there is no type. When a function doesn't return a value, you'll usually see void as the return type :

```typescript
function warnUser(): void {
    console.log("This is my warning message");
}
```

Declaring a variable of type `void` is useless, because you can only assign it to `null` (only if `--strictNullChecks` is not specified) and `undefined` :

```typescript
let unusable: void = undefined;
```

##  Null and Undefined

In TypeScript, both `undefined` and `null` have their own types called `undefined` and `null` respectively . Like `void` , their types themselves are not very useful:

```typescript
// Not much else we can assign to these variables!
let u: undefined = undefined;
let n: null = null;
```

By default `null` and `undefined` are subtypes of all types. That is to say, you can assign `null` and `undefined` to variables of type `number` .

However, when you specify the `--strictNullChecks` flag, `null` and `undefined` can only be assigned to `any` and their respective types (with the exception that `undefined` can also be assigned to a `void` type). This avoids _many_ common problems. Maybe somewhere you want to pass in a `string` or `null` or `undefined` , you can use the union type `string|null|undefined` .

Union types are an advanced topic, which we will discuss in a later chapter.

> NOTE: We encourage the use of `--strictNullChecks` wherever possible, but in this manual we assume this flag is turned off.
## Never

The `never` type represents the type of values ​​that never exist. For example, the `never` type is the return value type of a function expression or an arrow function expression that always throws an exception or never returns a value; variables may also be of type ` never` when they are never When constrained by true type guards.

The `never` type is a subtype of any type and is assignable to any type; however, _no_ type is a subtype of `never` or is assignable to a `never` type (other than `never` itself). Even `any` cannot be assigned to `never` .

Here are some functions that return `never` types:

```typescript
// A function that returns never must have an unreachable endpoint
function error(message: string): never {
    throw new Error(message);
}
// The inferred return value type is never
function fail() {
    return error("Something failed");
}
// A function that returns never must have an unreachable endpoint
function infiniteLoop(): never {
    while (true) {
    }
}
```

## Object

`object` represents a non-primitive type, that is, a type other than `number` , `string` , `boolean` , `bigint` , `symbol` , `null` or `undefined` .

Using the `object` type, APIs like `Object.create` can be better represented . For example:

```typescript
declare function create(o: object | null): void;

create({ prop: 0 }); // OK
create(null); // OK

create(42); // Error
create("string"); // Error
create(false); // Error
create(undefined); // Error
```

##  Type Assertion

Sometimes you'll run into a situation where you know more details about a value than TypeScript does. Usually this happens when you clearly know that an entity has a more specific type than it already has.

By _type assertion_ this is the way to tell the compiler, "Trust me, I know what I'm doing". Type assertions are like type conversions in other languages, but without special data checking and destructuring. It has no runtime impact, it only works during the compile phase. TypeScript assumes that you, the programmer, have performed the necessary checks.

Type assertions come in two flavors. One is the "angle bracket" syntax:

```typescript
let someValue: any = "this is a string";

let strLength: number = (<string>someValue).length;
```

Another for `as` syntax:

```typescript
let someValue: any = "this is a string";

let strLength: number = (someValue as string).length;
```

The two forms are equivalent. Which one to use is mostly a matter of personal preference; however, when you use JSX in TypeScript, only `as` syntax assertions are allowed.

##  About `let`

You may have noticed that we use the `let` keyword instead of the familiar JavaScript keyword `var` . `let` is a keyword introduced by ES2015, it is safer than `var` , so it is regarded as the standard way of declaring variables. We will introduce it in detail later, many common problems can be solved by using `let` , so use `let` instead of `var` whenever possible .

##  About Number, String, Boolean, Symbol and Object

It's easy to think that the types `Number` , `String` , `Boolean` , `Symbol` , and `Object` are the same as the lowercase versions we recommended above. But these types are not part of the basic types of the language, and should almost never be used as a type:

```typescript
// @errors: 2339
function reverse(s: String): String {
  return s.split("").reverse().join("");
}

reverse("hello world");
```

Instead, we should use `number` , `string` , `boolean` , `object` and `symbol`

```typescript
function reverse(s: string): string {
  return s.split("").reverse().join("");
}

reverse("hello world");
```