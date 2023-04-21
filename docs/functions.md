#  Functions

##  Introduction

Functions are the foundation of JavaScript applications. It helps you implement abstraction layers, mock classes, information hiding and modules. In TypeScript, although classes, namespaces and modules are already supported, functions are still the main place to define behavior . TypeScript adds extra functionality to JavaScript functions to make it easier for us to use.

##  Function

Like JavaScript, TypeScript functions can create named and anonymous functions. You are free to choose the approach that suits your application, whether defining a series of API functions or functions that are used only once.

These two types of functions in JavaScript can be quickly recalled by the following example:

```typescript
// Named function
function add(x, y) {
    return x + y;
}

// Anonymous function
let myAdd = function(x, y) { return x + y; };
```

In JavaScript, functions can use variables outside the body of the function. When a function does this, we say it 'captures' these variables. Why this is possible and the pros and cons are beyond the scope of this article, but a deep understanding of this mechanism can be very helpful when learning JavaScript and TypeScript.

```typescript
let z = 100;

function addToZ(x, y) {
    return x + y + z;
}
```

##  Function type

###  Define the type for the function

Let's add types to the function above:

```typescript
function add(x: number, y: number): number {
    return x + y;
}

let myAdd = function(x: number, y: number): number { return x + y; };
```

We can add types to each parameter before adding the return type to the function itself. TypeScript can automatically infer the return type from the return statement, so we usually omit it.

###  Write the complete function type

Now that we have specified the type for the function, let's write the full type of the function.

```typescript
let myAdd: (x:number, y:number) => number =
    function(x: number, y: number): number { return x + y; };
```

Function types consist of two parts: parameter types and return value types. Both parts are needed when writing a complete function type. We write out the argument types in the form of an argument list, specifying a name and type for each argument. The name is just for readability. We can also write:

```typescript
let myAdd: (baseValue: number, increment: number) => number =
    function(x: number, y: number): number { return x + y; };
```

As long as the parameter types match, it is considered a valid function type, regardless of whether the parameter names are correct.

The second part is the return value type. For return values, we use the \( `=>` \) symbol before the function and the return type to make it clear. As mentioned before, the return value type is a necessary part of the function type, if the function does not return any value, you must also specify the return value type as `void` instead of leaving it blank.

The type of a function is simply composed of parameter types and return value. Captured variables used in functions are not reflected in the type. In fact, these variables are the hidden state of the function and are not part of the composition API.

###  Inferred type

As you try this example, you'll notice that the TypeScript compiler recognizes the types correctly even with types on only one side of the equation:

```typescript
// myAdd has the full function type
let myAdd = function(x: number, y: number): number { return x + y; };

// The parameters `x` and `y` have the type number
let myAdd: (baseValue: number, increment: number) => number =
    function(x, y) { return x + y; };
```

This is called "categorization by context" and is a type of type inference. It helps us better specify types for programs.

##  Optional parameters and default parameters

Every function parameter in TypeScript is required. This does not mean that `null` or `undefined` cannot be passed as parameters, but that the compiler checks that the user has passed a value for each parameter. The compiler also assumes that only these parameters will be passed into the function. In short, the number of arguments passed to a function must match the number of arguments the function expects.

```typescript
function buildName(firstName: string, lastName: string) {
    return firstName + " " + lastName;
}

let result1 = buildName("Bob");                  // error, too few parameters
let result2 = buildName("Bob", "Adams", "Sr.");  // error, too many parameters
let result3 = buildName("Bob", "Adams");         // ah, just right
```

In JavaScript, each parameter is optional and can be passed or not. When no parameter is passed, its value is undefined. In TypeScript, we can use `?` next to the parameter name to realize the function of optional parameters. For example, we want to make last name optional:

```typescript
function buildName(firstName: string, lastName?: string) {
    if (lastName)
        return firstName + " " + lastName;
    else
        return firstName;
}

let result1 = buildName("Bob");  // works correctly now
let result2 = buildName("Bob", "Adams", "Sr.");  // error, too many parameters
let result3 = buildName("Bob", "Adams");  // ah, just right
```

Optional parameters must follow required parameters. If we want the first name to be optional in the above example, then we must adjust their positions to put the first name behind.

In TypeScript, we can also provide a default value for a parameter when the user does not pass this parameter or the passed value is `undefined` . They are called parameters with default initialization values. Let's modify the above example to set the default value of last name to `"Smith"` .

```typescript
function buildName(firstName: string, lastName = "Smith") {
    return firstName + " " + lastName;
}

let result1 = buildName("Bob");                  // works correctly now, returns "Bob Smith"
let result2 = buildName("Bob", undefined);       // still works, also returns "Bob Smith"
let result3 = buildName("Bob", "Adams", "Sr.");  // error, too many parameters
let result4 = buildName("Bob", "Adams");         // ah, just right
```

The parameters with default initialization after all the required parameters are optional. Like optional parameters, they can be omitted when calling the function. That is, optional parameters share the parameter type with the default parameter at the end.

```typescript
function buildName(firstName: string, lastName?: string) {
    // ...
}
```

and

```typescript
function buildName(firstName: string, lastName = "Smith") {
    // ...
}
```

share the same type `(firstName: string, lastName?: string) => string` . In function types, the default value of a default parameter is not shown, only that it is an optional parameter.

Unlike ordinary optional parameters, parameters with default values ​​do not need to be placed after required parameters. If a parameter with a default value appears before a required parameter, the user must explicitly pass in the `undefined` value to get the default value. For example, let's rewrite the last example so that `firstName` is an argument with a default value:

```typescript
function buildName(firstName = "Will", lastName: string) {
    return firstName + " " + lastName;
}

let result1 = buildName("Bob");                  // error, too few parameters
let result2 = buildName("Bob", "Adams", "Sr.");  // error, too many parameters
let result3 = buildName("Bob", "Adams");         // okay and returns "Bob Adams"
let result4 = buildName(undefined, "Adams");     // okay and returns "Will Adams"
```

##  Remaining parameters

Required parameters, default parameters and optional parameters have one thing in common: they represent a certain parameter. Sometimes, you want to manipulate multiple parameters at the same time, or you don't know how many parameters will be passed in. In JavaScript, you can use `arguments` to access all passed parameters.

In TypeScript, you can collect all parameters into a variable:

```typescript
function buildName(firstName: string, ...restOfName: string[]) {
  return firstName + " " + restOfName.join(" ");
}

let employeeName = buildName("Joseph", "Samuel", "Lucas", "MacKinzie");
```

The remaining parameters are treated as an unlimited number of optional parameters. There can be none, or any number. The compiler creates the parameter array with the name you give after the ellipsis ( `...` ), and you can use this array within the body of the function.

This ellipsis is also used on function type definitions with remaining parameters:

```typescript
function buildName(firstName: string, ...restOfName: string[]) {
  return firstName + " " + restOfName.join(" ");
}

let buildNameFun: (fname: string, ...rest: string[]) => string = buildName;
```

## `this` 

Learning how to use `this` correctly in JavaScript is a rite of passage. Since TypeScript is a superset of JavaScript, TypeScript programmers also need to figure out how `this` works and be able to find out where it goes wrong when there is a bug. Fortunately, TypeScript can notify you where `this` is used incorrectly. If you want to understand how `this` works in JavaScript , first read [ Understanding JavaScript Function Invocation and "this" ] by Yehuda Katz (http://yehudakatz.com/2011/08/11/understanding-javascript -function-invocation-and-this/). Yehuda's article explains the inner workings of `this` in great detail, so we'll just give a brief introduction here.

### `this` and arrow functions 

In JavaScript, the value of `this` is specified when the function is called. This is a powerful and flexible feature, but you need to spend some time figuring out what the context of the function call is. But as we all know, this is not an easy thing to do, especially when returning a function or passing a function as an argument.

Let's see an example:

```typescript
let deck = {
    suits: ["hearts", "spades", "clubs", "diamonds"],
    cards: Array(52),
    createCardPicker: function() {
        return function() {
            let pickedCard = Math.floor(Math.random() * 52);
            let pickedSuit = Math.floor(pickedCard / 13);

            return {suit: this.suits[pickedSuit], card: pickedCard % 13};
        }
    }
}

let cardPicker = deck.createCardPicker();
let pickedCard = cardPicker();

alert("card: " + pickedCard.card + " of " + pickedCard.suit);
```

You can see that `createCardPicker` is a function, and it returns a function. If we try to run this program, we will find that it does not pop up a dialog box but reports an error. Because `this` in the function returned by `createCardPicker` is set to `window` instead of `deck` object. Because we just called `cardPicker()` independently . Top-level non-method calls will treat `this` as `window` . (Note: In strict mode, `this` is `undefined` instead of `window` ).

To fix this, we can bind the correct `this` when the function is returned . That way, no matter how you use it later, it will refer to the bound 'deck' object. We need to change the function expression to use ECMAScript 6 arrow syntax. Arrow functions can save the value of `this` when the function is created , not when it is called:

```typescript
let deck = {
    suits: ["hearts", "spades", "clubs", "diamonds"],
    cards: Array(52),
    createCardPicker: function() {
        // NOTE: the line below is now an arrow function, allowing us to capture 'this' right here
        return () => {
            let pickedCard = Math.floor(Math.random() * 52);
            let pickedSuit = Math.floor(pickedCard / 13);

            return {suit: this.suits[pickedSuit], card: pickedCard % 13};
        }
    }
}

let cardPicker = deck.createCardPicker();
let pickedCard = cardPicker();

alert("card: " + pickedCard.card + " of " + pickedCard.suit);
```

Even better, TypeScript will warn you that you made a mistake if you set the `--noImplicitThis` flag to the compiler. It will point out that `this` in `this.suits[pickedSuit]` is of type `any` .

### `this` parameter 

Unfortunately, the type of `this` in `this.suits[pickedSuit]` is still `any` . This is because `this` comes from the function expression in the object literal. The modified method is to provide an explicit `this` parameter. The `this` parameter is a fake parameter that appears first in the parameter list:

```typescript
function f(this: void) {
    // make sure `this` is unusable in this standalone function
}
```

Let's add some interfaces to the example, `Card` and `Deck` , to make type reuse clear and easy:

```typescript
interface Card {
    suit: string;
    card: number;
}
interface Deck {
    suits: string[];
    cards: number[];
    createCardPicker(this: Deck): () => Card;
}
let deck: Deck = {
    suits: ["hearts", "spades", "clubs", "diamonds"],
    cards: Array(52),
    // NOTE: The function now explicitly specifies that its callee must be of type Deck
    createCardPicker: function(this: Deck) {
        return () => {
            let pickedCard = Math.floor(Math.random() * 52);
            let pickedSuit = Math.floor(pickedCard / 13);

            return {suit: this.suits[pickedSuit], card: pickedCard % 13};
        }
    }
}

let cardPicker = deck.createCardPicker();
let pickedCard = cardPicker();

alert("card: " + pickedCard.card + " of " + pickedCard.suit);
```

Now TypeScript knows that `createCardPicker` expects to be called on some `Deck` object. That is to say, `this` is of `Deck` type, not `any` , so `--noImplicitThis` will not report an error.

#### `this` parameter  in the callback function

You may have also seen `this` in a callback function throwing an error when you pass a function into a library function to be called later . Because when the callback function is called, it will be called as a normal function, `this` will be `undefined` . With a little change, you can pass the `this` parameter to avoid errors. First, the author of the library function specifies the type of `this` :

```typescript
interface UIElement {
    addClickListener(onclick: (this: void, e: Event) => void): void;
}
```

`this: void` means that `addClickListener` expects `onclick` to be a function and it does not need a `this` type. Then, add a type annotation for `this` in the calling code :

```typescript
class Handler {
    info: string;
    onClickBad(this: Handler, e: Event) {
        // oops, used this here. using this callback would crash at runtime
        this.info = e.message;
    }
}
let h = new Handler();
uiElement.addClickListener(h.onClickBad); // error!
```

After specifying the type of `this` , you explicitly state that `onClickBad` must be called on the instance of `Handler` . Then TypeScript will detect that `addClickListener` requires a function with `this: void` . Change `this` type to fix this error:

```typescript
class Handler {
    info: string;
    onClickGood(this: void, e: Event) {
        // can't use this here because it's of type void!
        console.log('clicked!');
    }
}
let h = new Handler();
uiElement.addClickListener(h.onClickGood);
```

Since `onClickGood` specifies `this` type as `void` , it is legal to pass `addClickListener` . Of course, this also means that `this.info` cannot be used . If you want both, you have to use arrow functions:

```typescript
class Handler {
    info: string;
    onClickGood = (e: Event) => { this.info = e.message }
}
```

This works because arrow functions use the outer `this` , so you can always pass them to functions expecting `this: void` . The downside is that each `Handler` object creates an arrow function. Methods, on the other hand, are only created once, added to the prototype chain of `Handler` . They are shared between different `Handler` objects.

##  Overload

JavaScript itself is a dynamic language. It is very common in JavaScript for functions to return different types of data depending on the parameters passed in.

```typescript
let suits = ["hearts", "spades", "clubs", "diamonds"];

function pickCard(x): any {
    // Check to see if we're working with an object/array
    // if so, they gave us the deck and we'll pick the card
    if (typeof x == "object") {
        let pickedCard = Math.floor(Math.random() * x.length);
        return pickedCard;
    }
    // Otherwise just let them pick the card
    else if (typeof x == "number") {
        let pickedSuit = Math.floor(x / 13);
        return { suit: suits[pickedSuit], card: x % 13 };
    }
}

let myDeck = [{ suit: "diamonds", card: 2 }, { suit: "spades", card: 10 }, { suit: "hearts", card: 4 }];
let pickedCard1 = myDeck[pickCard(myDeck)];
alert("card: " + pickedCard1.card + " of " + pickedCard1.suit);

let pickedCard2 = pickCard(15);
alert("card: " + pickedCard2.card + " of " + pickedCard2.suit);
```

The `pickCard` method returns two different types depending on the incoming parameters. If an object representing a playing card is passed in, the function is to draw a card from it. If the user wants to draw a card, we tell him what card was drawn. But how is this represented in the type system.

The method is to provide multiple function type definitions for the same function to perform function overloading. The compiler will process the function call according to this list. Let's overload the `pickCard` function.

```typescript
let suits = ["hearts", "spades", "clubs", "diamonds"];

function pickCard(x: {suit: string; card: number; }[]): number;
function pickCard(x: number): {suit: string; card: number; };
function pickCard(x): any {
    // Check to see if we're working with an object/array
    // if so, they gave us the deck and we'll pick the card
    if (typeof x == "object") {
        let pickedCard = Math.floor(Math.random() * x.length);
        return pickedCard;
    }
    // Otherwise just let them pick the card
    else if (typeof x == "number") {
        let pickedSuit = Math.floor(x / 13);
        return { suit: suits[pickedSuit], card: x % 13 };
    }
}

let myDeck = [{ suit: "diamonds", card: 2 }, { suit: "spades", card: 10 }, { suit: "hearts", card: 4 }];
let pickedCard1 = myDeck[pickCard(myDeck)];
alert("card: " + pickedCard1.card + " of " + pickedCard1.suit);

let pickedCard2 = pickCard(15);
alert("card: " + pickedCard2.card + " of " + pickedCard2.suit);
```

After this change, the overloaded `pickCard` function will perform correct type checking when called.

It is similar to the process flow in JavaScript in order for the compiler to choose the correct type of check. It looks up the list of overloads, trying to use the first overload definition. Use this if it matches. Therefore, when defining overloading, be sure to put the most precise definition first.

Note that `function pickCard(x): any` is not part of the overload list, so there are only two overloads: one that takes an object and the other that takes a number. Calling `pickCard` with other arguments will generate an error.
