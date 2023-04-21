#  Interfaces

##  Introduction

One of the core principles of TypeScript is type checking the _structure_ that values ​​have . It is sometimes called "duck typing" or "structural subtyping". In TypeScript, the role of interfaces is to name these types and define contracts for your code or third-party code.

##  A preliminary study of the interface

Let's use a simple example to observe how the interface works:

```typescript
function printLabel(labeledObj: { label: string }) {
  console.log(labeledObj.label);
}

let myObj = { size: 10, label: "Size 10 Object" };
printLabel(myObj);
```

The type checker looks at calls to `printLabel` . `printLabel` takes one parameter and requires this object parameter to have a property named `label` of type `string` . It should be noted that the object parameter we pass in will actually contain many properties, but the compiler will only check that those required properties exist and their types match. However, sometimes TypeScript is not so lenient, we will explain it a little bit below.

Let's rewrite the above example, this time using an interface to describe: it must contain a `label` property of type `string` :

```typescript
interface LabeledValue {
  label: string;
}

function printLabel(labeledObj: LabeledValue) {
  console.log(labeledObj.label);
}

let myObj = { size: 10, label: "Size 10 Object" };
printLabel(myObj);
```

The `LabeledValue` interface is like a name to describe the requirements in the above example. It represents an object of type `string` with a `label` property . It should be noted that we cannot say that the object passed to `printLabel` implements this interface like in other languages . We will only care about the shape of the value. As long as the passed-in object satisfies the necessary conditions mentioned above, then it is allowed.

It is also worth mentioning that the type checker does not check the order of the attributes, as long as the corresponding attribute exists and the type is correct.

##  Optional attributes

Not all properties in an interface are required. Some are only present under certain conditions, or not at all. Optional attributes are often used when applying the "option bags" pattern, that is, only some of the attributes in the parameter object passed to the function are assigned values.

Here is an example with "option bags" applied:

```typescript
interface SquareConfig {
  color?: string;
  width?: number;
}

function createSquare(config: SquareConfig): { color: string; area: number } {
  let newSquare = { color: "white", area: 100 };
  if (config.color) {
    newSquare.color = config.color;
  }
  if (config.width) {
    newSquare.area = config.width * config.width;
  }
  return newSquare;
}

let mySquare = createSquare({ color: "black" });
```

Interfaces with optional attributes are similar to ordinary interface definitions, except that a `?` symbol is added after the optional attribute name definition.

One of the benefits of optional attributes is that the attributes that may exist can be predefined, and the second advantage is that errors when referencing attributes that do not exist can be caught. For example, if we deliberately misspell the name of the `color` property in `createSquare` , we will get an error message:

```typescript
interface SquareConfig {
  color?: string;
  width?: number;
}

function createSquare(config: SquareConfig): { color: string; area: number } {
  let newSquare = { color: "white", area: 100 };
  if (config.clor) {
    // Error: Property 'clor' does not exist on type 'SquareConfig'
    newSquare.color = config.clor;
  }
  if (config.width) {
    newSquare.area = config.width * config.width;
  }
  return newSquare;
}

let mySquare = createSquare({ color: "black" });
```

##  Read-only attribute

Some object properties can only change their values ​​when the object is first created. You can specify read-only properties with `readonly` before the property name :

```typescript
interface Point {
  readonly x: number;
  readonly y: number;
}
```

You can construct a `Point` by assigning it to an object literal . After assignment, `x` and `y` can no longer be changed.

```typescript
let p1: Point = { x: 10, y: 20 };
p1.x = 5; // error!
```

TypeScript has a `ReadonlyArray<T>` type, which is similar to `Array<T>` , but removes all variable methods, so it can ensure that the array cannot be modified after it is created:

```typescript
let a: number[] = [1, 2, 3, 4];
let ro: ReadonlyArray<number> = a;
ro[0] = 12; // error!
ro.push(5); // error!
ro.length = 100; // error!
a = ro; // error!
```

In the last line of the above code, you can see that it is not possible to assign the entire `ReadonlyArray` to a normal array. But you can rewrite it with a type assertion:

```typescript
a = ro as number[];
```

### `readonly` vs `const` 

The easiest way to judge whether to use `readonly` or `const` is to see whether to use it as a variable or as an attribute. Use `const` if used as a variable , and `readonly` if used as an attribute .

##  Additional property checks

We used interfaces in the first example, and TypeScript lets us pass `{ size: number; label: string; }` into functions that only expect `{ label: string; }` . We've already looked at optional attributes and know that they are useful in the "option bags" pattern.

However, naively combining the two is like shooting yourself in the foot with JavaScript. For example, take the `createSquare` example:

```typescript
interface SquareConfig {
  color?: string;
  width?: number;
}

function createSquare(config: SquareConfig): { color: string; area: number } {
  // ...
}

let mySquare = createSquare({ colour: "red", width: 100 });
```

Note that the parameter passed to `createSquare` is spelled `colour` instead of `color` . In JavaScript, this fails silently.

You could argue that this program is already correctly typed, since the `width` property is compatible, there is no `color` property, and the extra `colour` property is meaningless.

However, TypeScript will consider this code to be potentially buggy. Object literals are treated specially and subject to _extra property checking_ when assigning them to variables or passing them as parameters. If an object literal has any properties that the "target type" does not contain, you will get an error.

```typescript
// error: Object literal may only specify known properties, but 'colour' does not exist in type 'SquareConfig'. Did you mean to write 'color'?
let mySquare = createSquare({ colour: "red", width: 100 });
```

Bypassing these checks is very simple. The easiest way is to use a type assertion:

```typescript
let mySquare = createSquare({ width: 100, opacity: 0.5 } as SquareConfig);
```

However, the best way is to be able to add a string index signature, provided that you can determine that this object may have some extra properties for special purposes. If `SquareConfig` has `color` and `width` properties of the type defined above , and _will_ also have any number of other properties, then we can define it like this:

```typescript
interface SquareConfig {
  color?: string;
  width?: number;
  [propName: string]: any;
}
```

We'll get to index signatures later, but what we're saying here is that a `SquareConfig` can have any number of properties, and as long as they're not `color` and `width` , then it doesn't matter what their type is.

There is one last way of skipping these checks, which may surprise you, and it is to assign this object to another variable: since ` squareOptions` is not checked for additional properties, the compiler will not report an error.

```typescript
let squareOptions = { colour: "red", width: 100 };
let mySquare = createSquare(squareOptions);
```

The above method only works well when there are common properties between `squareOptions` and `SquareConfig` . In this example, this property is `width` . If there is no common object attribute between variables, an error will be reported. For example:

```typescript
let squareOptions = { colour: "red" };
let mySquare = createSquare(squareOptions);
```

Note that in simple code like the above, you probably shouldn't bypass these checks. For complex object literals that contain methods and internal state, you may need to use these tricks, but most extra property checking errors are real bugs. That is, if you encounter errors detected by additional type checking, such as "option bags", you should review your type declarations. Here, if passing a `color` or `colour` property to `createSquare` is supported , you should modify the `SquareConfig` definition to reflect this.

##  Function type

Interfaces can describe the various shapes that objects in JavaScript can have. In addition to describing ordinary objects with properties, interfaces can also describe function types.

In order to use an interface to represent a function type, we need to define a calling signature for the interface. It is like a function definition with only parameter list and return type. Each parameter in the parameter list requires a name and a type.

```typescript
interface SearchFunc {
  (source: string, subString: string): boolean;
}
```

After this definition, we can use this function type interface like any other interface. The following example shows how to create a variable of function type and assign a function of the same type to this variable.

```typescript
let mySearch: SearchFunc;
mySearch = function(source: string, subString: string) {
  let result = source.search(subString);
  return result > -1;
};
```

For type checking of function types, the parameter names of the function do not need to match the names defined in the interface. For example, let's rewrite the above example using the following code:

```typescript
let mySearch: SearchFunc;
mySearch = function(src: string, sub: string): boolean {
  let result = src.search(sub);
  return result > -1;
};
```

The parameters of the function will be checked one by one, and the parameter types at the corresponding positions are required to be compatible. If you don't want to specify the type, TypeScript's type system will infer the parameter type, because the function is directly assigned to the `SearchFunc` type variable. The return type of a function is inferred from its return value ( `false` and `true` in this case ).

```typescript
let mySearch: SearchFunc;
mySearch = function(src, sub) {
  let result = src.search(sub);
  return result > -1;
};
```

If we let this function return a number or a string, the type checker will warn us that the return type of the function does not match the definition in the `SearchFunc` interface.

```typescript
let mySearch: SearchFunc;

// error: Type '(src: string, sub: string) => string' is not assignable to type 'SearchFunc'.
// Type 'string' is not assignable to type 'boolean'.
mySearch = function(src, sub) {
  let result = src.search(sub);
  return "string";
};
```

##  Indexable types

Similar to using interfaces to describe function types, we can also describe types that can be "retrieved by index", such as `a[10]` or `ageMap["daniel"]` . Indexable types have an _index signature_ , which describes the type of object indexed, and the corresponding index return type. Let's look at an example:

```typescript
interface StringArray {
  [index: number]: string;
}

let myArray: StringArray;
myArray = ["Bob", "Fred"];

let myStr: string = myArray[0];
```

In the example above, we defined the `StringArray` interface, which has an index signature. This index signature means that when indexing `StringArray` with `number` , you will get a return value of type `string` .

Typescript supports two types of index signatures: strings and numbers. Both types of indexes can be used at the same time, but the return value of the numeric index must be a subtype of the return value type of the string index. This is because when indexing with a `number` , JavaScript converts it to a `string` and then indexes the object. That is to say, using `100` (a `number` ) to index is equivalent to using `"100"` (a `string` ) to index, so the two need to be consistent.

```typescript
class Animal {
  name: string;
}
class Dog extends Animal {
  breed: string;
}
// Error: Use a numeric string index, sometimes you get a completely different Animal!
interface NotOkay {
  [x: number]: Animal;
  [x: string]: Dog;
}
```

String index signatures describe `dictionary` schemas well , and they also ensure that all attributes match their return type. Because the string index declares both `obj.property` and `obj["property"]` are available. In the following example, the type of `name` does not match the string index type, so the type checker gives an error message:

```typescript
interface NumberDictionary {
  [index: string]: number;
  length: number; // Yes, length is of type number
  name: string; // Error, the type of `name` does not match the type of the index type return value
}
```

But if the index signature is a union type that includes property types, then using properties of different types is allowed.

```typescript
interface NumberOrStringDictionary {
   [index: string]: number | string;
   length: number;  // ok, length is a number
   name: string;    // ok, name is a string
}
```

Finally, you can set the index signature to be read-only, which prevents assignment to the index:

```typescript
interface ReadonlyStringArray {
  readonly [index: number]: string;
}
let myArray: ReadonlyStringArray = ["Alice", "Bob"];
myArray[2] = "Mallory"; // error!
```

You cannot set `myArray[2]` because the index signature is read-only.

##  Class type

###  Implement the interface

Like the basic function of interfaces in C \# or Java, TypeScript can also use it to explicitly force a class to conform to a certain contract.

```typescript
interface ClockInterface {
  currentTime: Date;
}

class Clock implements ClockInterface {
  currentTime: Date = new Date();
  constructor(h: number, m: number) {}
}
```

You can also describe a method in an interface and implement it in a class, like the `setTime` method below:

```typescript
interface ClockInterface {
  currentTime: Date;
  setTime(d: Date): void;
}

class Clock implements ClockInterface {
  currentTime: Date = new Date();
  setTime(d: Date) {
    this.currentTime = d;
  }
  constructor(h: number, m: number) {}
}
```

An interface describes the public part of a class, not both public and private parts. It won't help you check if a class has some private members.

###  The difference between the static part of the class and the instance part

When you work with classes and interfaces, you need to know that classes have two types: the type of the static part and the type of the instance. You'll notice that when you define an interface with a constructor signature and try to define a class that implements that interface, you get an error:

```typescript
interface ClockConstructor {
  new (hour: number, minute: number);
}

class Clock implements ClockConstructor {
  currentTime: Date;
  constructor(h: number, m: number) {}
}
```

This is because when a class implements an interface, only its instance part is type checked. The constructor exists in the static part of the class, so it is not covered by the check.

Therefore, we should directly manipulate the static part of the class. Looking at the example below, we define two interfaces, `ClockConstructor` for constructors and `ClockInterface` for instance methods. For convenience we define a constructor `createClock` that creates an instance with the type passed in.

```typescript
interface ClockConstructor {
  new (hour: number, minute: number): ClockInterface;
}
interface ClockInterface {
  tick(): void;
}

function createClock(
  ctor: ClockConstructor,
  hour: number,
  minute: number
): ClockInterface {
  return new ctor(hour, minute);
}

class DigitalClock implements ClockInterface {
  constructor(h: number, m: number) {}
  tick() {
    console.log("beep beep");
  }
}
class AnalogClock implements ClockInterface {
  constructor(h: number, m: number) {}
  tick() {
    console.log("tick tock");
  }
}

let digital = createClock(DigitalClock, 12, 17);
let analog = createClock(AnalogClock, 7, 32);
```

Because the first parameter of `createClock` is of `ClockConstructor` type, in `createClock(AnalogClock, 7, 32)` , it will check whether `AnalogClock` conforms to the constructor signature.

Another easy way is to use class expressions:

```typescript
interface ClockConstructor {
  new (hour: number, minute: number);
}

interface ClockInterface {
  tick();
}

const Clock: ClockConstructor = class Clock implements ClockInterface {
  constructor(h: number, m: number) {}
  tick() {
    console.log("beep beep");
  }
};
```

##  Inheritance interface

Like classes, interfaces can also inherit from each other. This allows us to copy members from one interface to another, allowing for more flexibility in splitting interfaces into reusable modules.

```typescript
interface Shape {
  color: string;
}

interface Square extends Shape {
  sideLength: number;
}

let square = {} as Square;
square.color = "blue";
square.sideLength = 10;
```

An interface can inherit multiple interfaces to create a composite interface of multiple interfaces.

```typescript
interface Shape {
  color: string;
}

interface PenStroke {
  penWidth: number;
}

interface Square extends Shape, PenStroke {
  sideLength: number;
}

let square = {} as Square;
square.color = "blue";
square.sideLength = 10;
square.penWidth = 5.0;
```

##  Mixed type

We mentioned earlier that interfaces can describe the rich types in JavaScript. Because of JavaScript's dynamic and flexible nature, sometimes you want an object to have multiple types mentioned above at the same time.

An example is that an object can be used both as a function and as an object, with additional properties.

```typescript
interface Counter {
  (start: number): string;
  interval: number;
  reset(): void;
}

function getCounter(): Counter {
  let counter = function(start: number) {} as Counter;
  counter.interval = 123;
  counter.reset = function() {};
  return counter;
}

let c = getCounter();
c(10);
c.reset();
c.interval = 5.0;
```

When using JavaScript third-party libraries, you may need to fully define the type as above.

##  Interface inheritance class

When an interface inherits from a class type, it inherits the members of the class but not its implementation. It's as if the interface declares all the members that exist in the class, but does not provide the concrete implementation. Interfaces also inherit private and protected members of classes. This means that when you create an interface extending a class that has private or protected members, the interface type can only be implemented by that class or its subclasses.

This is useful when you have a large inheritance structure, but the point is that your code only works if the subclass has a certain property. In addition to inheriting from a base class, subclasses do not have to be related to each other. example:

```typescript
class Control {
  private state: any;
}

interface SelectableControl extends Control {
  select(): void;
}

class Button extends Control implements SelectableControl {
  select() {}
}

class TextBox extends Control {
  select() {}
}

class ImageControl implements SelectableControl {
// Error: Class 'ImageControl' incorrectly implements interface 'SelectableControl'.
//  Types have separate declarations of a private property 'state'.
  private state: any;
  select() {}
}
```

In the above example, `SelectableControl` contains all the members of `Control` , including the private member `state` . Because `state` is a private member, only subclasses of `Control` can implement the `SelectableControl` interface. Because only subclasses of `Control` can have a private member `state` declared in `Control` , this is required for compatibility of private members.

Inside the `Control` class, it is allowed to access the private member `state` through the instance of `SelectableControl` . In fact, `SelectableControl` is like `Control` and has a `select` method. The `Button` and `TextBox` classes are subclasses of `SelectableControl` (because they both inherit from `Control` and have a `select` method). As for the `ImageControl` class, it has its own private member `state` instead of inheriting `Control` , so it cannot implement `SelectableControl` .