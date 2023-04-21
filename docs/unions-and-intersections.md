# Union  type and intersection type

## Introduction

So far the manual has covered atomic object types.
However, as you model more types, you'll find yourself looking for tools that allow you to compose existing types rather than create them from scratch.

Intersection types and union types are one way to combine types.

## Union type

Sometimes, you'll come across a library that expects an argument to be a `number` or a `string` .
For example the following function:

```ts twoslash
/**
 * Takes a string and adds "padding" to the left.
 * If 'padding' is a string, then 'padding' is appended to the left side.
 * If 'padding' is a number, then that number of spaces is added to the left side.
 */
function padLeft(value: string, padding: any) {
  if (typeof padding === "number") {
    return Array(padding + 1).join(" ") + value;
  }
  if (typeof padding === "string") {
    return padding + value;
  }
  throw new Error(`Expected string or number, got '${typeof padding}'.`);
}

padLeft("Hello world", 4); // returns "    Hello world"
```

In the example above, the problem with `padLeft` is that its `padding` parameter is of type `any` .
This means that we can call it with parameter types other than `number` and `string` , and TypeScript will accept it.

```ts twoslash
declare function padLeft(value: string, padding: any): string;
// ---cut---
// Passes at compile time but fails at runtime.
let indentedString = padLeft("Hello world", true);
```

In traditional object-oriented programming, we would abstract these two types by creating a type with a layered structure.
While this is more explicit, it's also a bit of an overkill.
One benefit of the original version of `padLeft` is that we can pass primitives directly.
This means that the usage is simple and concise.
And if we just want to use a function that already exists elsewhere, this new approach doesn't help either.

Instead of `any` , we can use the _union_type_ for the `padding` parameter :

```ts twoslash
// @errors: 2345
/**
* Takes a string and adds "padding" to the left.
* If 'padding' is a string, then 'padding' is appended to the left side.
* If 'padding' is a number, then that number of spaces is added to the left side.
*/
function padLeft(value: string, padding: string | number) {
  // ...
}

let indentedString = padLeft("Hello world", true);
```

A union type indicates that the type of a value can be one of several types.
We use vertical bars ( `|` ) to separate different types, so `number | string | boolean` is a type that can be a value of `number` , `string` or `boolean` .

##  Union with public fields

If we have a value of a union type, we can only access members common to all types in the union.

```ts twoslash
// @errors: 2339

interface Bird {
  fly(): void;
  layEggs(): void;
}

interface Fish {
  swim(): void;
  layEggs(): void;
}

declare function getSmallPet(): Fish | Bird;

let pet = getSmallPet();
pet.layEggs();

// only one of two possible types is available
pet.swim();
```

Union types can be a bit tricky here, but it just takes a little intuition to get used to.
If a value is of type `A|B` , we can only be _certain_ that it has members that both `A`  _ and _  `B` have.
In this example, `Bird` has a member called `fly` .
We cannot determine whether a variable of type `Bird|Fish` has a `fly` method.
If the variable is indeed `Fish` at runtime , calling `pet.fly()` will fail.

##  Discriminated union

A common technique for using unions is to have a single field of a literal type, which you can use to narrow down the current types that TypeScript may have. For example, we'll create a union of three types that have a shared field.

```ts
type NetworkLoadingState = {
  state: "loading";
};

type NetworkFailedState = {
  state: "failed";
  code: number;
};

type NetworkSuccessState = {
  state: "success";
  response: {
    title: string;
    duration: number;
    summary: string;
  };
};

// Create a type that represents only one of the above types, but you're not yet sure which it is.
type NetworkState =
  | NetworkLoadingState
  | NetworkFailedState
  | NetworkSuccessState;
```

The above types all start with a field called `state` , and then they also have fields of their own.

| NetworkLoadingState | NetworkFailedState | NetworkSuccessState |
| ------------------- | ------------------ | ------------------- |
| state | state | state |
| | code | response |

Given that the `state` field is common in every type of `NetworkState` - your code can safely access it without existence checks.

With `state` as a literal type, you can compare the value of `state` with the corresponding string and TypeScript will know which type is currently in use.

| NetworkLoadingState | NetworkFailedState | NetworkSuccessState |
| ------------------- | ------------------ | ------------------- |
| "loading" | "failed" | "success" |

In this example, you can use a `switch` statement to narrow down which type is represented at runtime:

```ts twoslash
// @errors: 2339
type NetworkLoadingState = {
  state: "loading";
};

type NetworkFailedState = {
  state: "failed";
  code: number;
};

type NetworkSuccessState = {
  state: "success";
  response: {
    title: string;
    duration: number;
    summary: string;
  };
};
// ---cut---
type NetworkState =
  | NetworkLoadingState
  | NetworkFailedState
  | NetworkSuccessState;

function logger(state: NetworkState): string {
  // Right now, TypeScript doesn't know which of the three possible types state is.
  // attempting to access a property not shared by all types will raise an error
  state.code;
  // By selecting state, TypeScript can narrow the scope of the union in code flow analysis
  switch (state.state) {
    case "loading":
      return "Downloading...";
    case "failed":
      // The type here must be NetworkFailedState, so accessing the `code` field is safe.
      return `Error ${state.code} downloading`;
    case "success":
      return `Downloaded ${state.response.title} - ${state.response.summary}`;
  }
}
```

##  Union exhaustiveness check

We want the compiler to tell us when we haven't covered all variants of discriminated unions.
For example, if we add `NetworkFromCachedState` to `NetworkState` , we also need to update `logger` :

```ts twoslash
// @errors: 2366
type NetworkLoadingState = { state: "loading" };
type NetworkFailedState = { state: "failed"; code: number };
type NetworkSuccessState = {
  state: "success";
  response: {
    title: string;
    duration: number;
    summary: string;
  };
};
// ---cut---
type NetworkFromCachedState = {
  state: "from_cache";
  id: string;
  response: NetworkSuccessState["response"];
};

type NetworkState =
  | NetworkLoadingState
  | NetworkFailedState
  | NetworkSuccessState
  | NetworkFromCachedState;

function logger(s: NetworkState) {
  switch (s.state) {
    case "loading":
      return "loading request";
    case "failed":
      return `failed with code ${s.code}`;
    case "success":
      return "got response";
  }
}
```

There are two ways to achieve this.
The first way is to turn on [ `strictNullChecks` ](/tsconfig#strictNullChecks) and specify the return type:

```ts twoslash
// @errors: 2366
type NetworkLoadingState = { state: "loading" };
type NetworkFailedState = { state: "failed"; code: number };
type NetworkSuccessState = { state: "success" };
type NetworkFromCachedState = { state: "from_cache" };

type NetworkState =
  | NetworkLoadingState
  | NetworkFailedState
  | NetworkSuccessState
  | NetworkFromCachedState;

// ---cut---
function logger(s: NetworkState): string {
  switch (s.state) {
    case "loading":
      return "loading request";
    case "failed":
      return `failed with code ${s.code}`;
    case "success":
      return "got response";
  }
}
```

Because `switch` is no longer exhaustive, TypeScript knows that functions may sometimes return `undefined` .
If you have an explicit return type `string` , then you will get an error that the return type is actually `string | undefined` .
However, this approach is rather subtle, and besides, [ `strictNullChecks` ](/tsconfig#strictNullChecks) doesn't always work for legacy code.

The second way is to use the `never` type that the compiler uses to check for exhaustion :

```ts twoslash
// @errors: 2345
type NetworkLoadingState = { state: "loading" };
type NetworkFailedState = { state: "failed"; code: number };
type NetworkSuccessState = { state: "success" };
type NetworkFromCachedState = { state: "from_cache" };

type NetworkState =
  | NetworkLoadingState
  | NetworkFailedState
  | NetworkSuccessState
  | NetworkFromCachedState;
// ---cut---
function assertNever(x: never): never {
  throw new Error("Unexpected object: " + x);
}

function logger(s: NetworkState): string {
  switch (s.state) {
    case "loading":
      return "loading request";
    case "failed":
      return `failed with code ${s.code}`;
    case "success":
      return "got response";
    default:
      return assertNever(s);
  }
}
```

Here, `assertNever` checks whether `s` is of type `never` — that is, the type that remains after all other cases are removed.
If you forget this case, then `s` will have an actual type and you will get a type error.
This method requires you to define an extra function, but it's more obvious when you forget, since the error message includes the missing type name.

##  Cross type

Intersection types are closely related to union types, but they are used very differently.
Intersection types combine multiple types into one.
This allows you to add existing types together to get a single type with all the functionality you need.
For example, `Person & Serializable & Loggable` is a type that is all of `Person` , `Serializable` _ and _ `Loggable` .
This means that objects of this type will have all members of these three types.

For example, if you have network requests with consistent error handling, then you can separate the error handling into its own type, merged with the type corresponding to a single response type.

```ts twoslash
interface ErrorHandling {
  success: boolean;
  error?: { message: string };
}

interface ArtworksData {
  artworks: { title: string }[];
}

interface ArtistsData {
  artists: { name: string }[];
}

// These interfaces are combined to have consistent error handling, and their own data

type ArtworksResponse = ArtworksData & ErrorHandling;
type ArtistsResponse = ArtistsData & ErrorHandling;

const handleArtistsResponse = (response: ArtistsResponse) => {
  if (response.error) {
    console.error(response.error.message);
    return;
  }

  console.log(response.artists);
};
```