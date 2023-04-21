#  Enumeration

##  Enumeration

Using enum we can define some constants with names. Use enums to clearly express intent or to create a differentiated set of use cases. TypeScript supports numeric and string-based enums.

###  Number enumeration

First let's look at numeric enums, which should be familiar if you've used other programming languages.

```typescript
enum Direction {
    Up = 1,
    Down,
    Left,
    Right
}
```

As above, we defined a number enumeration, `Up` is initialized to `1` . The remaining members will auto-grow from `1` . In other words, the value of `Direction.Up` is `1` , `Down` is `2` , `Left` is `3` , and `Right` is `4` .

We can also not use initializers at all:

```typescript
enum Direction {
    Up,
    Down,
    Left,
    Right,
}
```

Now, `Up` has a value of `0` , `Down` has a value of `1` and so on. This self-growth behavior is useful when we don't care about the value of the member, but be aware that the value of each enumeration member is different.

Using enumerations is simple: access enumeration members by enumeration properties, and enumeration types by enumeration name:

```typescript
enum Response {
    No = 0,
    Yes = 1,
}

function respond(recipient: string, message: Response): void {
    // ...
}

respond("Princess Caroline", Response.Yes)
```

Numeric enums can be mixed into [ computed and constant members (see below) ](enums.md#computed-and-constant-members). In short, members without initializers either come first, or must come after numeric enums initialized with numeric constants or other constant enum members. In other words, the following situations are not allowed:

```typescript
enum E {
    A = getSomeValue(),
    B, // Error! Enum member must have initializer.
}
```

###  String enumeration

The concept of string enums is simple, but there are subtle [ runtime differences ](enums.md#enums-at-runtime). In a string enum, each member must be initialized with a string literal, or with another string enum member.

```typescript
enum Direction {
    Up = "UP",
    Down = "DOWN",
    Left = "LEFT",
    Right = "RIGHT",
}
```

Since string enums have no self-growth behavior, string enums can be serialized very well. In other words, if you're debugging and have to read the runtime value of a numeric enum, the value is often hard to read - it doesn't convey useful information (although [reverse mapping]( enums.md # enums-at-runtime) will help), string enums allow you to provide a run-time meaningful and readable value, independent of the name of the enum member.

###  Heterogeneous enums

Enums can technically mix string and number members, but it doesn't seem like you're going to do that:

```typescript
enum BooleanLikeHeterogeneousEnum {
    No = 0,
    Yes = "YES",
}
```

We don't recommend doing this unless you really want to take advantage of the behavior of the JavaScript runtime.

###  Computed and constant members

Each enumeration member takes a value, which can be _constant_ or _computed_ . Enumeration members are considered constants when the following conditions are met:

* It is the first member of the enum and has no initializer, in which case it is assigned the value `0` :

  ```typescript
  // E.X is constant:
  enum  E { X }
  ```

* It has no initializer and the enumeration member preceding it is a _number_constant . In this case, the value of the current enumeration member is the value of its previous enumeration member plus 1.

  ```typescript
  // All enum members in 'E1' and 'E2' are constant.
  enum E1 { X, Y, Z }
  enum E2 {
      A = 1, B, C
  }
  ```

* Enumeration members are initialized using _constant enumeration_expression_ . Constant enum expressions are a subset of TypeScript expressions that can be evaluated at compile time. An expression is a constant enumeration expression when it satisfies one of the following conditions:

  1. An enumeration expression literal (mainly a string literal or a numeric literal)
  2. A reference to a previously defined constant enumeration member (which may be defined in a different enumeration type)
  3. Constant enumeration expressions with parentheses
  4. One of the unary operators `+` , `-` , `~` is applied to a constant enumeration expression
  5. Constant enumeration expressions are used as binary operators `+` , `-` , `*` , `/` , `%` , `<<` , ` >>` , `>>>` , ` The operation object of &` , ​​`|` , `^` .

  If the constant enumeration expression evaluates to `NaN` or `Infinity` , an error will be reported at the compilation stage.

In all other cases enumeration members are treated as computed values.

```typescript
enum FileAccess {
    // constant members
    None,
    Read    = 1 << 1,
    Write   = 1 << 2,
    ReadWrite  = Read | Write,
    // computed member
    G = "123".length
}
```

###  Joint enumeration and enumeration member type

There exists a special subset of noncomputed constant enum members: literal enum members. A literal enum member is a constant enum member with no initial value, or a value initialized to

* any string literal (eg: `"foo"` , `"bar"` , `"baz"` )
* any numeric literal (eg: `1` , `100` )
* Number literals with the unary `-` notation applied (eg: `-1` , `-100` )

When all enumeration members have literal enumeration values, it has a special semantics.

First, enum members become types! For example, we can say that certain members _can only_ be values ​​of enum members:

```typescript
enum ShapeKind {
    Circle,
    Square,
}

interface Circle {
    kind: ShapeKind.Circle;
    radius: number;
}

interface Square {
    kind: ShapeKind.Square;
    sideLength: number;
}

let c: Circle = {
    kind: ShapeKind.Square, // Error! Type 'ShapeKind.Square' is not assignable to type 'ShapeKind.Circle'.
    radius: 100,
}
```

Another change is that the enum type itself becomes a _union_ of each enum member . While we haven't discussed [ union types ](advanced-types.md#union-types), just know that with union enums, the type system can take advantage of the fact that it knows the set of values ​​in the enum. Thus, TypeScript is able to catch silly mistakes made when comparing values. For example:

```typescript
enum E {
    Foo,
    Bar,
}

function f(x: E) {
    if (x !== E.Foo || x !== E.Bar) {
        //             ~~~~~~~~~~~
        // Error! This condition will always return 'true' since the types 'E.Foo' and 'E.Bar' have no overlap.
    }
}
```

In this example, we first check that `x` is not `E.Foo` . If this check is passed, then `||` will short circuit and the body of the `if` statement will be executed. However, this check fails, then ` x` _can only_ be `E.Foo` , so there is no reason to check whether it is `E.Bar` .

###  Enumeration at runtime

Enums are objects that actually exist at runtime. For example the following enum:

```typescript
enum E {
    X, Y, Z
}
```

can be passed to the function

```typescript
function f(obj: { X: number }) {
    return obj.X;
}

// No problem, because 'E' contains a numeric attribute 'X'.
f(E);
```

###  Enumeration at compile time

Although an enum is an object that actually exists at runtime, the `keyof` keyword behaves differently than it does when applied to an object. `keyof typeof` should be used to get a type representing all string `key`s in the enum .

```typescript
enum LogLevel {
    ERROR, WARN, INFO, DEBUG
}

/**
* Equivalent to:
* type LogLevelStrings = 'ERROR' | 'WARN' | 'INFO' | 'DEBUG';
 */
type LogLevelStrings = keyof typeof LogLevel;

function printImportant(key: LogLevelStrings, message: string) {
    const num = LogLevel[key];
    if (num <= LogLevel.WARN) {
       console.log('Log level key is: ', key);
       console.log('Log level value is: ', num);
       console.log('Log level message is: ', message);
    }
}
printImportant('ERROR', 'This is a message');
```

####  Reverse mapping

In addition to creating an object with property names as object members, numeric enum members also have a _reverse mapping_ , from enum values ​​to enum names. For example, in the following example:

```typescript
enum Enum {
    A
}
let a = Enum.A;
let nameOfA = Enum[a]; // "A"
```

TypeScript might compile this code to the following JavaScript:

```javascript
var Enum;
(function (Enum) {
    Enum[Enum["A"] = 0] = "A";
})(Enum || (Enum = {}));
var a = Enum.A;
var nameOfA = Enum[a]; // "A"
```

In the generated code, the enum type is compiled into an object, which contains forward mapping ( `name` - >  `value` ) and reverse mapping ( `value` - >  `name` ). References to enum members are always generated as property accesses and never inline code.

Note that _does not_ generate reverse mappings for string enum members.

#### `const` enum 

In most cases, enumeration is a very effective solution. However in some cases the requirements are strict. To avoid the overhead of extra generated code and additional indirect access to enum members, we can use `const` enums. Constant enums are defined by using the `const` modifier on the enum .

```typescript
const enum Enum {
    A = 1,
    B = A * 2
}
```

Constant enumerations can only use constant enumeration expressions, and unlike regular enumerations, they are deleted at compile time. Constant enum members are inlined where they are used. This is possible because const enums do not allow calculated members.

```typescript
const enum Directions {
    Up,
    Down,
    Left,
    Right
}

let directions = [Directions.Up, Directions.Down, Directions.Left, Directions.Right]
```

The generated code is:

```javascript
var directions = [0 /* Up */, 1 /* Down */, 2 /* Left */, 3 /* Right */];
```

##  External enum

External enumerations are used to describe the shape of an existing enumeration type.

```typescript
declare enum Enum {
    A = 1,
    B,
    C = 2
}
```

There is an important difference between external enumerations and non-external enumerations. In normal enumerations, members without initializers are treated as constant members. For non-constant external enums, no initializers are considered computed.
