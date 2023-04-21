# Generics

##  Introduction

In software engineering, we not only create consistent well-defined APIs, but also consider reusability. Components can not only support current data types, but also future data types, which provides you with very flexible functions when creating large-scale systems.

In languages ​​like C # and Java, `generics` can be used to create reusable components, a component can support multiple types of data. This allows users to use components with their own data types.

##  Generic Hello World

Let's create our first example of using generics: the identity function. This function returns whatever value is passed into it. You can think of this function as an `echo` command.

Without generics, this function might look like this:

```typescript
function identity(arg: number): number {
    return arg;
}
```

Alternatively, we use the `any` type to define functions:

```typescript
function identity(arg: any): any {
    return arg;
}
```

Using `any` type will cause this function to accept `arg` parameter of any type, so some information is lost: the type passed in should be the same as the type returned. If we pass in a number, we just know that any type of value may be returned.

Therefore, we need a way to make the type of the return value the same as the type of the incoming parameter. Here, we use _type variable_ , which is a special kind of variable that is only used to represent types rather than values.

```typescript
function identity<T>(arg: T): T {
    return arg;
}
```

We added the type variable `T` to identity . `T` helps us capture the type passed in by the user (for example: `number` ), and then we can use this type. Then we used `T` again as the return type. Now we can know that the parameter type is the same as the return value type. This allows us to keep track of information about the types used in the function.

We call this version of the `identity` function generic because it can be applied to multiple types. Unlike using `any` , it does not lose information, like the first example preserves accuracy, passing in numeric types and returning numeric types.

After we define a generic function, it can be used in two ways. The first is to pass in all parameters, including type parameters:

```typescript
let output = identity<string>("myString");  // type of output will be 'string'
```

Here we explicitly specify that `T` is of `string` type, and pass it to the function as a parameter, and use `<>` to enclose it instead of `()` .

The second method is more general. Using _type inference_ -- that is, the compiler will automatically help us determine the type of T according to the parameters passed in:

```typescript
let output = identity("myString");  // type of output will be 'string'
```

Note that we don't have to use the angle brackets ( `<>` ) to explicitly pass in the type; the compiler can look at the value of `myString` and set `T` as its type. Type inference helps us keep our code lean and highly readable. If the compiler cannot automatically deduce the type, it can only pass in the type of T explicitly as above. In some complicated cases, this may occur.

##  Using generic variables

When using generics to create a generic function like `identity` , the compiler requires you to use the generic type correctly in the function body. In other words, you must treat these parameters as any or all types.

Look at the `identity` example from earlier :

```typescript
function identity<T>(arg: T): T {
    return arg;
}
```

If we want to print out the length of `arg` at the same time . We will most likely do:

```typescript
function loggingIdentity<T>(arg: T): T {
    console.log(arg.length);  // Error: T doesn't have .length
    return arg;
}
```

If we did, the compiler would complain that we used the `.length` attribute of `arg` , but there is nowhere to say that `arg` has this attribute. Remember, these type variables represent arbitrary types, so someone using this function may pass in a number, and numbers don't have a `.length` property.

Now suppose we want to manipulate arrays of type `T` instead of `T` directly . Since we are working with arrays, the `.length` property should exist. We can create this array like any other array:

```typescript
function loggingIdentity<T>(arg: T[]): T[] {
    console.log(arg.length);  // Array has a .length, so no more error
    return arg;
}
```

You can understand the type of `loggingIdentity` in this way : the generic function `loggingIdentity` , receives the type parameter `T` and the parameter `arg` , it is an array of element type `T` , and returns an array of element type `T` . If we pass in an array of numbers, an array of numbers will be returned, since `T` is of type `number` . This allows us to use the generic variable T as part of the type, rather than the entire type, increasing flexibility.

We can also implement the above example like this:

```typescript
function loggingIdentity<T>(arg: Array<T>): Array<T> {
    console.log(arg.length);  // Array has a .length, so no more error
    return arg;
}
```

If you have used other languages, you may already be familiar with this syntax. In the next section, we will introduce how to create custom generics like `Array<T>` .

##  Generic Type

In the previous section, we created the identity generic function, which can be applied to different types. In this section, we look at the types of functions themselves, and how to create generic interfaces.

The type of a generic function is no different from the type of a non-generic function, except that there is a type parameter at the front, like a function declaration:

```typescript
function identity<T>(arg: T): T {
    return arg;
}

let myIdentity: <T>(arg: T) => T = identity;
```

We can also use different generic parameter names, as long as they correspond in quantity and usage.

```typescript
function identity<T>(arg: T): T {
    return arg;
}

let myIdentity: <U>(arg: U) => U = identity;
```

We can also define generic functions using object literals with a call signature:

```typescript
function identity<T>(arg: T): T {
    return arg;
}

let myIdentity: {<T>(arg: T): T} = identity;
```

This leads us to write our first generic interface. Let's take the object literal in the above example and use it as an interface:

```typescript
interface GenericIdentityFn {
    <T>(arg: T): T;
}

function identity<T>(arg: T): T {
    return arg;
}

let myIdentity: GenericIdentityFn = identity;
```

As a similar example, we might want to treat a generic parameter as a parameter of the entire interface. In this way, we can clearly know which generic type is used (for example: `Dictionary<string> instead of just Dictionary` ). In this way, other members in the interface can also know the type of this parameter.

```typescript
interface GenericIdentityFn<T> {
    (arg: T): T;
}

function identity<T>(arg: T): T {
    return arg;
}

let myIdentity: GenericIdentityFn<number> = identity;
```

Note that our example has changed slightly. Generic functions are no longer described, but non-generic function signatures are included as part of the generic type. When we use `GenericIdentityFn` , we have to pass in a type parameter to specify the generic type (here: `number` ), which locks the type used in the code later. For describing which parts of a type are part of a generic, it is helpful to understand when to put parameters in a call signature and when to put them in an interface.

In addition to generic interfaces, we can also create generic classes. Note that generic enums and generic namespaces cannot be created.

##  Generic class

Generic classes look similar to generic interfaces. Generic classes enclose the generic type using ( `<>` ), following the class name.

```typescript
class GenericNumber<T> {
    zeroValue: T;
    add: (x: T, y: T) => T;
}

let myGenericNumber = new GenericNumber<number>();
myGenericNumber.zeroValue = 0;
myGenericNumber.add = function(x, y) { return x + y; };
```

Using the `GenericNumber` class is quite intuitive, and as you may have noticed, there is nothing restricting it to only use the `number` type. Strings or other more complex types can also be used.

```typescript
let stringNumeric = new GenericNumber<string>();
stringNumeric.zeroValue = "";
stringNumeric.add = function(x, y) { return x + y; };

console.log(stringNumeric.add(stringNumeric.zeroValue, "test"));
```

As with interfaces, placing the generic type directly after the class can help us confirm that all properties of the class are using the same type.

As we said in the [ class ](classes.md) section, a class has two parts: a static part and an instance part. The generic class refers to the type of the instance part, so the static properties of the class cannot use this generic type.

##  Generic constraints

You should remember the previous example, we sometimes want to operate on a set of values ​​of a certain type, and we know what properties this set of values ​​has. In the `loggingIdentity` example, we want to access the `length` property of `arg` , but the compiler cannot prove that each type has a `length` property, so it reports an error.

```typescript
function loggingIdentity<T>(arg: T): T {
    console.log(arg.length);  // Error: T doesn't have .length
    return arg;
}
```

Instead of operating on any type, we want to limit the function to any type with a `.length` property. As long as the type passed in has this property, we allow it, that is to say at least contain this property. To do this, we need to list the constraints on T.

To do this, we define an interface to describe the constraints. Create an interface with a `.length` property and use this interface with the `extends` keyword to implement constraints:

```typescript
interface Lengthwise {
    length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
    console.log(arg.length);  // Now we know it has a .length property, so no more error
    return arg;
}
```

Now the generic function is constrained so it no longer applies to any type:

```typescript
loggingIdentity(3);  // Error, number doesn't have a .length property
```

We need to pass in a value that conforms to the constraint type and must contain the required attributes:

```typescript
loggingIdentity({length: 10, value: 3});
```

###  Using type parameters in generic constraints

You can declare a type parameter that is constrained by another type parameter. For example, now we want to get this property from an object using the property name. And we want to make sure that this property exists on the object `obj` , so we need to use a constraint between these two types.

```typescript
function getProperty<T, K extends keyof T>(obj: T, key: K) {
    return obj[key];
}

let x = { a: 1, b: 2, c: 3, d: 4 };

getProperty(x, "a"); // okay
getProperty(x, "m"); // error: Argument of type 'm' isn't assignable to 'a' | 'b' | 'c' | 'd'.
```

###  Using class types in generics

When TypeScript uses generics to create factory functions, it needs to refer to the class type of the constructor. for example,

```typescript
function create<T>(c: {new(): T; }): T {
    return new c();
}
```

A more advanced example uses prototype properties to infer and constrain the relationship of constructors to class instances.

```typescript
class BeeKeeper {
    hasMask: boolean;
}

class ZooKeeper {
    nametag: string;
}

class Animal {
    numLegs: number;
}

class Bee extends Animal {
    keeper: BeeKeeper;
}

class Lion extends Animal {
    keeper: ZooKeeper;
}

function createInstance<A extends Animal>(c: new () => A): A {
    return new c();
}

createInstance(Lion).keeper.nametag;  // typechecks!
createInstance(Bee).keeper.hasMask;   // typechecks!
```
