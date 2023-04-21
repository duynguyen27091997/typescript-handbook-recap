#  Literal type

##  Introduction

A literal is a more specific subtype of a collective type. Meaning: `"Hello World"` is a `string` , but a `string` is not a `"Hello World"` in the type system .

There are currently three sets of literal types available in TypeScript: strings, numbers, and booleans. By using literal types, you can specify certain values ​​that a string, number, or boolean must contain.

##  Literal volume narrowed

When you declare a variable with `var` or `let` , you are actually telling the compiler that the contents of this variable may be changed. In contrast, declaring an object with const tells TypeScript that the object will never be changed.

```TypeScript
// We're making a guarantee that this variable
// helloWorld will never change, by using const.

// So, TypeScript sets the type to be "Hello World" not string
const helloWorld = "Hello World";

// On the other hand, a let can change, and so the compiler declares it a string
let hiWorld = "Hi World";
```

Going from an infinite number of possible examples ( infinitely many values ​​for the `string` variable) to a smaller, definite number of examples (in the example above, there is only one possible value for `"Hello World"` ) is It's called narrowing.

##  String literal type

Literal types can be combined with actual string values ​​through union associations, type guards, and type aliases. With these features, we can take a string and make it behave like an enum.

```TypeScript
type Easing = "ease-in" | "ease-out" | "ease-in-out";

class UIElement {
  animate(dx: number, dy: number, easing: Easing) {
    if (easing === "ease-in") {
      // ...
    } else if (easing === "ease-out") {
    } else if (easing === "ease-in-out") {
    } else {
      // It's possible that someone could reach this
      // by ignoring your types though.
    }
  }
}

let button = new UIElement();
button.animate(0, 0, "ease-in");
button.animate(0, 0, "uneasy");
// Error: Argument of type '"uneasy"' is not assignable to parameter of type 'Easing'.
```

You can pass three allowed strings, but if you pass other strings you will get the following error:

```TypeScript
Argument of type '"uneasy"' is not assignable to parameter of type '"ease-in" | "ease-out" | "ease-in-out"'
```

String literals can be overloaded individually in the same way:

```TypeScript
function createElement(tagName: "img"): HTMLImageElement;
function createElement(tagName: "input"): HTMLInputElement;
// ... more overloads ...
function createElement(tagName: string): Element {
  // ... code goes here ...
}
```

##  Number literal type

TypeScript also has number literal types, which behave the same as the string literal types above.

```TypeScript
function rollDice(): 1 | 2 | 3 | 4 | 5 | 6 {
  return (Math.floor(Math.random() * 6) + 1) as 1 | 2 | 3 | 4 | 5 | 6;
}

const result = rollDice();
```

Numeric literal types are often used to describe configuration values:

```TypeScript
interface MapConfig {
  lng: number;
  lat: number;
  tileSize: 8 | 16 | 32;
}

setupMap({ lng: -73.935242, lat: 40.73061, tileSize: 16 });
```

##  Boolean literal type

TypeScript also has boolean literal types, which you can use to constrain objects where certain properties are related to each other.

```TypeScript
interface ValidationSuccess {
  isValid: true;
  reason: null;
};

interface ValidationFailure {
  isValid: false;
  reason: string;
};

type ValidationResult =
  | ValidationSuccess
  | ValidationFailure;
```