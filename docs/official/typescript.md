# TypeScript Documentation

**Repository Version:** ^5.9.0  
**Official Documentation:** https://www.typescriptlang.org/docs/  
**TypeScript Handbook:** https://www.typescriptlang.org/docs/handbook/intro.html  
**TSConfig Reference:** https://www.typescriptlang.org/tsconfig/  
**Playground:** https://www.typescriptlang.org/play/

## Table of Contents

1. [About TypeScript](#about-typescript)
2. [The TypeScript Handbook](#the-typescript-handbook)
3. [Everyday Types](#everyday-types)
4. [Functions](#functions)
5. [Object Types](#object-types)
6. [Classes](#classes)
7. [Generics](#generics)
8. [Type Manipulation](#type-manipulation)
9. [TSConfig Reference](#tsconfig-reference)
10. [TypeScript 5.9 Features](#typescript-59-features)
11. [Integration Patterns](#integration-patterns)
12. [Best Practices](#best-practices)
13. [Migration Guide](#migration-guide)
14. [Troubleshooting](#troubleshooting)

---

## About TypeScript

### Overview

TypeScript is a strongly typed programming language that builds on JavaScript, giving you better tooling at any scale. It adds static type definitions to JavaScript, enabling better IDE support, catch errors early, and improve code maintainability.

### Core Philosophy

Over 20 years after its introduction to the programming community, JavaScript is now one of the most widespread cross-platform languages ever created. Starting as a small scripting language for adding trivial interactivity to webpages, JavaScript has grown to be a language of choice for both frontend and backend applications of every size. While the size, scope, and complexity of programs written in JavaScript has grown exponentially, the ability of the JavaScript language to express the relationships between different units of code has not. Combined with JavaScript's rather peculiar runtime semantics, this mismatch between language and program complexity has made JavaScript development a difficult task to manage at scale.

The most common kinds of errors that programmers write can be described as type errors: a certain kind of value was used where a different kind of value was expected. This could be due to simple typos, a failure to understand the API surface of a library, incorrect assumptions about runtime behavior, or other errors. The goal of TypeScript is to be a static typechecker for JavaScript programs - in other words, a tool that runs before your code runs (static) and ensures that the types of the program are correct (typechecked).

### Prerequisites

If you are coming to TypeScript without a JavaScript background, with the intention of TypeScript being your first language, we recommend you first start reading the documentation on either the Microsoft Learn JavaScript tutorial or read [JavaScript at the Mozilla Web Docs](https://developer.mozilla.org/docs/Web/JavaScript/Guide). If you have experience in other languages, you should be able to pick up JavaScript syntax quite quickly by reading the handbook.

---

## The TypeScript Handbook

### Handbook Structure

The handbook is split into two sections:

#### The Handbook
The TypeScript Handbook is intended to be a comprehensive document that explains TypeScript to everyday programmers. You can read the handbook by going from top to bottom in the left-hand navigation.

You should expect each chapter or page to provide you with a strong understanding of the given concepts. The TypeScript Handbook is not a complete language specification, but it is intended to be a comprehensive guide to all of the language's features and behaviors.

A reader who completes the walkthrough should be able to:
- Read and understand commonly-used TypeScript syntax and patterns
- Explain the effects of important compiler options
- Correctly predict type system behavior in most cases

In the interests of clarity and brevity, the main content of the Handbook will not explore every edge case or minutiae of the features being covered. You can find more details on particular concepts in the reference articles.

#### Reference Files
The reference section below the handbook in the navigation is built to provide a richer understanding of how a particular part of TypeScript works. You can read it top-to-bottom, but each section aims to provide a deeper explanation of a single concept - meaning there is no aim for continuity.

---

## Everyday Types

### The Primitives: string, number, and boolean

JavaScript has three very commonly used primitives: string, number, and boolean. Each has a corresponding type in TypeScript. As you might expect, these are the same names you'd see if you used the JavaScript typeof operator on a value of those types:

- **string** represents string values like "Hello, world"
- **number** is for numbers like 42. JavaScript does not have a special runtime value for integers, so there's no equivalent to int or float - everything is simply number
- **boolean** is for the two values true and false

```typescript
// Primitive types
const name: string = "Hello, world";
const count: number = 42;
const isActive: boolean = true;
```

**Important Note:** The type names String, Number, and Boolean (starting with capital letters) are legal, but refer to some special built-in types that will very rarely appear in your code. Always use string, number, or boolean for types.

### Arrays

To specify the type of an array like [1, 2, 3], you can use the syntax number[]; this syntax works for any type (e.g. string[] is an array of strings, and so on). You may also see this written as Array<number>, which means the same thing. We'll learn more about the syntax T<U> when we cover generics.

```typescript
// Arrays
const clients: string[] = ["alpha", "beta"];
const numbers: Array<number> = [1, 2, 3];
const matrix: number[][] = [[1, 2], [3, 4]];
```

**Note:** [number] is a different thing (tuples) - refer to the section on Tuples.

### any

TypeScript also has a special type, any, that you can use whenever you don't want a particular value to cause typechecking errors.

When a value is of type any, you can access any properties of it (which will in turn be of type any), call it like a function, assign it to (or from) a value of any type, or pretty much anything else that's syntactically legal:

```typescript
let obj: any = { x: 0 };
// None of the following lines of code will throw compiler errors.
// Using `any` disables all further type checking, and it is assumed
// you know the environment better than TypeScript.
obj.foo();
obj();
obj.bar = 100;
obj = "hello";
const n: number = obj;
```

The any type is useful when you don't want to write out a long type just to convince TypeScript that a particular line of code is okay.

### noImplicitAny

When you don't specify a type, and TypeScript can't infer it from context, the compiler will typically default to any. You usually want to avoid this, though, because any isn't type-checked. Using the flag noImplicitAny will flag any implicit any as an error.

### Type Annotations on Variables

When you declare a variable using const, var, or let, you can optionally add a type annotation to explicitly specify the type of the variable:

```typescript
let myName: string = "Alice";
```

In most cases, this isn't necessary though. Wherever possible, TypeScript tries to automatically infer the types in your code. For example, the type of myName is inferred to be string, even though we didn't use a type annotation:

```typescript
// No type annotation needed -- 'myName' inferred as type 'string'
let myName = "Alice";
```

### Functions

#### Parameter Type Annotations
You can add type annotations to declare the types of parameters for a function:

```typescript
// Parameter type annotation
function greet(name: string) {
  console.log("Hello, " + name.toUpperCase());
}
```

When a parameter has a type annotation, arguments to that function will be checked:

```typescript
greet("World"); // OK
greet(42);      // Error: Argument of type 'number' is not assignable to parameter of type 'string'
```

#### Return Type Annotations
You can also add return type annotations. Return type annotations appear after the parameter list:

```typescript
function getFavoriteNumber(): number {
  return 26;
}
```

Much like variable type annotations, you usually don't need a return type annotation because TypeScript will infer the function's return type based on its return statements. The type annotation in the above example doesn't change anything. Some codebases will explicitly specify return types for documentation purposes, to prevent accidental changes, or just for personal preference.

#### Anonymous Functions
Anonymous functions are a bit different from function declarations. When a function appears in a place where TypeScript can determine how it's going to be called, the parameters of that function are automatically given types.

```typescript
// No type annotations here, but TypeScript can spot the bug
const names = ["Alice", "Bob", "Charlie"];

// Contextual typing for function
names.forEach(function (s) {
  console.log(s.toUpperCase()); // OK
  console.log(s.toUppercase()); // Error: Property 'toUppercase' does not exist on type 'string'. Did you mean 'toUpperCase'?
});
```

Even though the parameter s didn't have a type annotation, TypeScript used the types of the forEach function, along with the inferred type of the array, to determine the type that s will have. This process is called contextual typing.

### Object Types

Apart from primitives, the most common sort of type you'll encounter is an object type. This refers to any JavaScript value with properties, which is almost all of them! To define an object type, we simply list its properties and their types.

```typescript
// The parameter's type annotation is an object type
function printCoord(pt: { x: number; y: number }) {
  console.log("The coordinate's x value is " + pt.x);
  console.log("The coordinate's y value is " + pt.y);
}

printCoord({ x: 3, y: 7 });
```

Here, we annotated the parameter with a type with two properties - x and y - which are both of type number. You can use , or ; to separate the properties, and the last separator is optional either way.

The type part of each property is also optional. If you don't specify a type, it will be assumed to be any.

#### Optional Properties
Object types can also specify that some or all of their properties are optional. To do this, add a ? after the property name:

```typescript
function printName(obj: { first: string; last?: string }) {
  // ...
}
printName({ first: "Bob" });
printName({ first: "Alice", last: "Alisson" });
```

In JavaScript, if you access a property that doesn't exist, you'll get the value undefined rather than a runtime error. Because of this, when you read from an optional property, you'll have to check for undefined before using it:

```typescript
function printName(obj: { first: string; last?: string }) {
  // Error - might crash if 'obj.last' wasn't provided!
  console.log(obj.last.toUpperCase());
  
  // OK
  if (obj.last) {
    console.log(obj.last.toUpperCase());
  }
}
```

### Union Types

TypeScript's type system allows you to build new types out of existing ones using a large variety of operators. Now that we know how to write a few types, it's time to start combining them in interesting ways.

#### Defining a Union Type
The first way to combine types you might see is a union type. A union type is a type formed from two or more other types, representing values that may be any one of those types. We refer to each of these types as the union's members.

Let's write a function that can work with strings or numbers:

```typescript
function printId(id: number | string) {
  console.log("Your ID is: " + id);
}
printId(101);    // OK
printId("202");   // OK
```

#### Working with Union Types
It's easy to provide a value matching a union type - simply provide a type matching any of the union's members. If you have a value of a union type, how do you work with it?

TypeScript will only allow you to do things with the union if that thing is valid for every member of the union. For example, if you have the union string | number, you can't use methods that are only available on string:

```typescript
function printId(id: number | string) {
  console.log(id.toUpperCase()); // Error: Property 'toUpperCase' does not exist on type 'number'.
}
```

The solution is to narrow the union with code, the same as you would in JavaScript without type annotations. TypeScript can figure out a more specific type for a variable based on the code you write:

```typescript
function printId(id: number | string) {
  if (typeof id === "string") {
    // In this branch, id is of type 'string'
    console.log(id.toUpperCase());
  } else {
    // Here, id is of type 'number'
    console.log(id.toFixed());
  }
}
```

### Type Aliases

We've been using object types and union types by writing them directly in our type annotations. This is convenient, but it's common to want to use the same type more than once and refer to it by a single name.

A type alias is exactly that - a name for any type. The syntax for a type alias is:

```typescript
type Point = {
  x: number;
  y: number;
};

function printCoord(pt: Point) {
  console.log("The coordinate's x value is " + pt.x);
  console.log("The coordinate's y value is " + pt.y);
}
```

You can actually use a type alias to give a name to any type at all, not just an object type. For example, a type alias can name a union type:

```typescript
type ID = number | string;
```

### Interfaces

An interface declaration is another way to name an object type:

```typescript
interface Point {
  x: number;
  y: number;
}

function printCoord(pt: Point) {
  console.log("The coordinate's x value is " + pt.x);
  console.log("The coordinate's y value is " + pt.y);
}
```

#### Differences Between Type Aliases and Interfaces

Type aliases and interfaces are very similar, and in many cases you can choose between them freely. Almost all features of an interface are available in type, the key distinction is that an interface can be opened multiple times and always merges into one, while a type alias to a union type cannot be changed.

**Interface:**
```typescript
interface Window {
  title: string;
}

interface Window {
  ts: TypeScriptAPI;
}
```

**Type Alias:**
```typescript
type Window = {
  title: string;
};

// Error: Duplicate identifier 'Window'
type Window = {
  ts: TypeScriptAPI;
};
```

### Type Assertions

Sometimes you'll have information about the type of a value that TypeScript can't know about.

For example, if you're using document.getElementById, TypeScript only knows that this will return an HTMLElement, but you might know that your page will always have an HTMLCanvasElement with a given ID.

In this situation, you can use a type assertion to specify a more specific type:

```typescript
const myCanvas = document.getElementById("main_canvas") as HTMLCanvasElement;
```

Like a type annotation, type assertions are removed by the compiler and won't affect the runtime behavior of your code.

You can also use the angle-bracket syntax (except if the code is in a .tsx file), which is equivalent:

```typescript
const myCanvas = <HTMLCanvasElement>document.getElementById("main_canvas");
```

### Literal Types

In addition to the general types string and number, we can refer to specific strings and numbers in type positions.

By combining literals into unions, you can express a much more useful concept - for example, functions that only accept a certain set of values:

```typescript
function printText(s: string, alignment: "left" | "right" | "center") {
  // ...
}
printText("Hello, world", "left");   // OK
printText("G'day, mate", "centre");  // Error: Argument of type '"centre"' is not assignable to parameter of type '"left" | "right" | "center"'.
```

Numeric literal types work the same way:

```typescript
function compare(a: string, b: string): -1 | 0 | 1 {
  return a === b ? 0 : a > b ? 1 : -1;
}
```

Of course, you can combine these with other non-literal types:

```typescript
interface Options {
  width: number;
  height: number;
  color: string | "red" | "blue" | "green";
}
```

### null and undefined

JavaScript has two primitive values that are used to signal absent or uninitialized values: null and undefined. TypeScript has corresponding types of the same names. How these types behave depends on whether you have the strictNullChecks option on.

#### strictNullChecks off
With strictNullChecks off, values that might be null or undefined can still be accessed normally, and the values null and undefined can be assigned to any property. This is similar to how null and undefined behave in languages without null checks (like C#, Java, and less strict JavaScript). We recommend always turning on strictNullChecks if possible, but this guide will describe how they work under that mode.

#### strictNullChecks on
With strictNullChecks on, when a value is null or undefined, you have to test for those values before using methods or properties on that value.

```typescript
function doSomething(x: string | null) {
  if (x === null) {
    // do nothing
  } else {
    console.log("Hello, " + x.toUpperCase());
  }
}
```

#### Non-null Assertion Operator (Postfix !)
A new feature added in TypeScript 3.7 is the non-null assertion operator. Writing ! after any expression is effectively a type assertion that the value isn't null or undefined:

```typescript
function liveDangerously(x?: number | null) {
  // No error
  console.log(x!.toFixed());
}
```

Just like other type assertions, this doesn't change the runtime behavior of your code, so it's important to only use ! when you know that the value can't be null or undefined.

### Enums

Enums are one of the few features TypeScript has which is not a type-level extension of JavaScript. Enums allow a developer to define a set of named constants. Using enums can make it easier to document intent, or create a set of distinct cases. TypeScript provides both numeric and string-based enums.

### Less Common Primitives

It's worth mentioning the rest of the primitives in JavaScript which are also represented in the TypeScript type system.

#### bigint
From ES2020 onwards, there is a primitive in JavaScript used for very large integers - BigInt:

```typescript
const aBigNumber = 100n;
```

#### symbol
From ES2015 onwards, there is a primitive in JavaScript used to create unique references for object properties - Symbol:

```typescript
const firstName = Symbol("name");
const secondName = Symbol("name");

if (firstName === secondName) {
  // This condition will always return false since the types have different identities
}
```

---

## Functions

### Function Type Expressions

While we've written a lot of function type expressions already, we haven't yet really explored what the syntax actually looks like. The simplest way to describe a function is with function type expressions. These types are written similarly to arrow functions:

```typescript
function greeter(fn: (a: string) => void) {
  fn("Hello, World");
}

function printToConsole(s: string) {
  console.log(s);
}

greeter(printToConsole);
```

The syntax (a: string) => void means "a function with one parameter, named a, of type string, that doesn't have a return value". Just like with function declarations, if a parameter type isn't specified, it's implicitly any.

### Call Signatures

In JavaScript, functions can have properties in addition to being callable. However, function type expression syntax doesn't permit declaring properties. If we want to describe something callable with properties, we can write a call signature in an object type:

```typescript
type DescribableFunction = {
  description: string;
  (someArg: number): boolean;
};

function doSomething(fn: DescribableFunction) {
  console.log(fn.description + " returned " + fn(6));
}
```

### Construct Signatures

JavaScript functions can also be invoked with the new operator. TypeScript refers to these as constructors because they usually create a new object. You can write a construct signature by adding the new keyword in front of a call signature:

```typescript
type SomeConstructor = {
  new (s: string): SomeObject;
};

function fn(ctor: SomeConstructor) {
  return new ctor("hello");
}
```

### Generic Functions

It's common to want to write a function where the types of the input are related to the type of the output, or where the types of two inputs are related in some way. Let's consider a function that returns the first element of an array:

```typescript
function firstElement(arr: any[]) {
  return arr[0];
}
```

This function does its job, but unfortunately has the return type any. It would be better if the return type of the function also depended on the type of the array element.

TypeScript's generics can model this relationship. Generic functions are functions that are generic over one or more types:

```typescript
function firstElement<Type>(arr: Type[]): Type | undefined {
  return arr[0];
}
```

By adding a type parameter Type to the function and using it in two places, we've created a link between the input of the function (the array) and its output (the return value). Now when we call it, a more specific type comes out:

```typescript
// s is of type 'string'
const s = firstElement(["a", "b", "c"]);
// n is of type 'number'
const n = firstElement([1, 2, 3]);
// u is of type undefined
const u = firstElement([]);
```

#### Constraints
We've written some generic functions that can work on any value type. Sometimes we want to write a function that only works on a subset of values, and we want to constrain that subset.

To do this, we need to list the requirement as a constraint on what Type can be. To define a constraint, you create an interface that describes the constraint and use extends with the type parameter:

```typescript
interface Lengthwise {
  length: number;
}

function loggingIdentity<Type extends Lengthwise>(arg: Type): Type {
  console.log(arg.length); // Has a .length property, so no more error
  return arg;
}
```

Now the generic function is constrained to work on any type that has a length property:

```typescript
loggingIdentity(3); // Error: Argument of type 'number' is not assignable to parameter of type 'Lengthwise'.
loggingIdentity({ length: 10, value: 3 }); // OK
```

#### Working with Constrained Values
Here's a common scenario where you might want to work with the most specific type of the object you have:

```typescript
function getProperty<Type, Key extends keyof Type>(obj: Type, key: Key) {
  return obj[key];
}

let x = { a: 1, b: 2, c: 3, d: 4 };

getProperty(x, "a"); // has type 'number'
getProperty(x, "m"); // Error: Argument of type '"m"' is not assignable to parameter of type '"a" | "b" | "c" | "d"'.
```

### Specifying Type Arguments

TypeScript can usually infer the intended type arguments in a generic call, but not always. For example, imagine you wrote a function to combine two arrays:

```typescript
function combine<Type>(arr1: Type[], arr2: Type[]): Type[] {
  return arr1.concat(arr2);
}
```

Normally it would be an error to call this function with non-matching arrays:

```typescript
combine([1, 2], ["hello"]); // Error: Type 'string' is not assignable to type 'number'.
```

However, if you intend to do this, you can manually specify Type:

```typescript
combine<string | number>([1, 2], ["hello"]); // OK
```

### Guidelines for Writing Good Generic Functions

Writing generic functions is fun, and can be easy to get carried away with type parameters. Here are some guidelines for writing good generic functions.

#### Push Type Parameters Down
Here are two ways of writing a function that look similar:

```typescript
// First version
function firstElement1<Type>(arr: Type[]) {
  return arr[0];
}

// Second version
function firstElement2<Type extends any[]>(arr: Type) {
  return arr[0];
}
```

These two functions seem identical, but firstElement1 is a much better way to write this function. Its inferred return type is Type, but firstElement2's inferred return type is any because TypeScript has to resolve the arr[0] expression using the constraint type, rather than "waiting" to resolve the element during the call.

**Rule:** When possible, use the type parameter itself rather than constraining it.

#### Use Fewer Type Parameters
Here are another pair of functions that seem similar:

```typescript
// First version
function filter1<Type>(arr: Type[], func: (arg: Type) => boolean): Type[] {
  return arr.filter(func);
}

// Second version
function filter2<Type, Func extends (arg: Type) => boolean>(
  arr: Type[],
  func: Func
): Type[] {
  return arr.filter(func);
}
```

These functions are identical in what they're doing, but the first version is much simpler to read and use. It doesn't introduce unnecessary type parameters.

**Rule:** Always use as few type parameters as possible.

#### Type Parameters Should Appear Twice
Sometimes we forget that a type parameter might need to be used twice. For example, if we write a function that returns the first element of an array, but doesn't care about the type of the elements:

```typescript
function firstElement1<Type>(arr: Type[]) {
  return arr[0];
}

function firstElement2<Type>(arr: Type[]) {
  return arr[0] as Type;
}

// a: number (good)
const a = firstElement1([1, 2, 3]);

// b: any (bad)
const b = firstElement2([1, 2, 3]);
```

Remember, type parameters are for relating the types of multiple values. If a type parameter only appears in one location, it's not doing anything useful.

**Rule:** If a type parameter only appears in one place, strongly reconsider if you actually need it.

---

## Object Types

### Keyof Type Operator

The keyof type operator takes an object type and produces a string or numeric literal union of its keys:

```typescript
type Point = { x: number; y: number };
type P = keyof Point; // type P = "x" | "y"

type Arrayish = { [n: number]: unknown };
type A = keyof Arrayish; // type A = number

type Mapish = { [k: string]: boolean };
type M = keyof Mapish; // type M = string
```

### Typeof Type Operator

The typeof type operator can be used in a type context to refer to the type of a variable or property:

```typescript
let s = "hello";
let n: typeof s; // let n: string
```

This is useful for keeping types synchronized with their values:

```typescript
function f() {
  return { x: 10, y: 3 };
}
type P = ReturnType<typeof f>; // type P = { x: number; y: number; }
```

### Indexed Access Types

We can use an indexed access type to look up a specific property on another type:

```typescript
type Person = { age: number; name: string; alive: boolean };

type Age = Person["age"]; // type Age = number

type I1 = Person["age" | "name"]; // type I1 = string | number

type I2 = Person[keyof Person]; // type I2 = string | number | boolean

type AliveOrName = "alive" | "name";
type I3 = Person[AliveOrName]; // type I3 = string | boolean
```

You can also use indexed access types to get the type of an element in an array:

```typescript
const MyArray = [
  { name: "Alice", age: 15 },
  { name: "Bob", age: 23 },
  { name: "Eve", age: 38 },
];

type Person = typeof MyArray[number]; // type Person = { name: string; age: number; }

type Age = typeof MyArray[number]["age"]; // type Age = number

// Or
type Age2 = Person["age"]; // type Age2 = number
```

---

## Classes

### Class Members

Here's the most basic class - an empty one:

```typescript
class Point {}
```

This class isn't very useful yet, so let's start adding some members.

#### Fields
A field declaration creates a public writeable property on a class:

```typescript
class Point {
  x: number;
  y: number;
}

const pt = new Point();
pt.x = 0;
pt.y = 0;
```

Fields can also have initializers; these will run automatically when the class is instantiated:

```typescript
class Point {
  x = 0;
  y = 0;
}
```

The -strictPropertyInitialization flag controls whether class fields need to be initialized in the constructor.

#### readonly
Fields may be prefixed with the readonly modifier to prevent assignment to the field outside of the constructor:

```typescript
class Greeter {
  readonly name: string = "world";

  constructor(otherName?: string) {
    if (otherName !== undefined) {
      this.name = otherName;
    }
  }

  err() {
    this.name = "not ok"; // Cannot assign to 'name' because it is read-only
  }
}
```

#### Constructors
Class constructors are very similar to functions. You can add parameters with type annotations, default values, and overloads:

```typescript
class Point {
  x: number;
  y: number;

  // Normal signature with defaults
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
}
```

#### Methods
A function property on a class is called a method. Methods can use all the same type annotations as functions and constructors:

```typescript
class Point {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  distance(p: Point): number {
    let dx = p.x - this.x;
    let dy = p.y - this.y;

    return Math.sqrt(dx * dx + dy * dy);
  }
}
```

#### Getters / Setters
Classes can also have getters and setters:

```typescript
class C {
  _length = 0;
  get length() {
    return this._length;
  }
  set length(value) {
    this._length = value;
  }
}
```

#### Index Signatures
Classes can have index signatures:

```typescript
class MyClass {
  [s: string]: boolean | ((s: string) => boolean);

  check(s: string) {
    return this[s] as boolean;
  }
}
```

### Class Heritage

#### implements Clauses
You can use an implements clause to check that a class conforms to a particular interface. An interface describes the public side of the class, and doesn't include the private members:

```typescript
interface Pingable {
  ping(): void;
}

class Sonar implements Pingable {
  ping() {
    console.log("ping!");
  }
}

class Ball implements Pingable {
  // Class 'Ball' incorrectly implements interface 'Pingable'.
  // Property 'ping' is missing in type 'Ball' but required in type 'Pingable'.
  pong() {
    console.log("pong!");
  }
}
```

#### extends Clauses
Classes can extend from a base class. A derived class has all the properties and methods of its base class, and can also define additional members.

```typescript
class Animal {
  move() {
    console.log("Moving along!");
  }
}

class Dog extends Animal {
  bark() {
    console.log("Woof! Woof!");
  }
}

const dog = new Dog();
dog.move(); // OK
dog.bark(); // OK
```

### Member Visibility

#### public
The default visibility of class members is public. A public member can be accessed anywhere:

```typescript
class Greeter {
  public greet() {
    console.log("hi!");
  }
}

const g = new Greeter();
g.greet(); // OK
```

#### protected
Protected members are only visible to subclasses of the class they're declared in:

```typescript
class Greeter {
  public greet() {
    console.log("Hello, " + this.getName());
  }

  protected getName() {
    return "hi";
  }
}

class SpecialGreeter extends Greeter {
  public howl() {
    console.log("Howdy!");
  }
}

const g = new SpecialGreeter();
g.greet(); // OK
g.getName(); // Error: Property 'getName' is protected and only accessible within class 'Greeter' and its subclasses.
```

#### private
Private is like protected, but doesn't allow access to the member even from subclasses:

```typescript
class Base {
  private x = 0;
}

class Derived extends Base {
  showX() {
    console.log(this.x); // Error: Property 'x' is private and only accessible within class 'Base'.
  }
}
```

### Static Members

Classes can have static members. These members aren't associated with a particular instance of the class:

```typescript
class Grid {
  static origin = { x: 0, y: 0 };

  calculateDistanceFromOrigin(point: { x: number; y: number }) {
    let xDist = point.x - Grid.origin.x;
    let yDist = point.y - Grid.origin.y;

    return Math.sqrt(xDist * xDist + yDist * yDist);
  }
}
```

#### Special Static Names
In general, static members can't be referred to from class instances and derived classes. Some special names, like prototype, constructor, and name are reserved:

```typescript
class S {
  static name = "S!";
}

const s = new S();
console.log(s.name); // Error: Property 'name' does not exist on type 'S'. Did you mean to access the static member 'S.name' instead?
```

#### Why No Static Classes?
TypeScript (and JavaScript) don't have a construct called static class the same way as, for example, C# does. TypeScript's static classes are just regular objects with private constructors:

```typescript
class StaticClass {
  private constructor() {}
}
```

### Generic Classes

Classes, much like interfaces, can be generic. When a generic class is instantiated with new, its type parameters are inferred the same way as in a function call:

```typescript
class Box<Type> {
  contents: Type;

  constructor(value: Type) {
    this.contents = value;
  }
}

const stringBox = new Box("hello!"); // const stringBox: Box<string>
```

#### Type Parameters in Static Members
Static members can't refer to class type parameters:

```typescript
class Box<Type> {
  static defaultValue: Type; // Static members cannot reference class type parameters.
}
```

### this at Runtime in Classes

#### Arrow Functions
When a function is called as a method of an object, this refers to that object:

```typescript
class Deck {
  constructor(public cards: string[]) {}

  // This is an arrow function, so 'this' is captured correctly
  createCardPicker = () => {
    return () => {
      const pickedIndex = Math.floor(Math.random() * this.cards.length);
      return this.cards[pickedIndex];
    };
  };
}

const deck = new Deck(["A", "B", "C"]);
const cardPicker = deck.createCardPicker();
console.log(cardPicker()); // Works correctly
```

#### this parameters
In the previous section, we used arrow functions to solve the this problem. But there's another way to do it: specify a this parameter to the method:

```typescript
function fn(this: SomeType, x: number) {
  // ...
}
```

### this Types

In classes, a special type called this dynamically refers to the type of the current class. Let's see how this is useful:

```typescript
class Box {
  contents: string = "";

  set(value: string): this {
    this.contents = value;
    return this;
  }
}

class ClearableBox extends Box {
  clear() {
    this.contents = "";
  }
}

const a = new ClearableBox();
const b = a.set("hello"); // b: ClearableBox
```

### Parameter Properties

TypeScript offers special syntax for turning a constructor parameter into a class property with the same name and value. These are called parameter properties:

```typescript
class Params {
  constructor(
    public readonly x: number,
    protected y: number,
    private z: number
  ) {
    // No body necessary
  }

  showZ() {
    console.log(this.z);
  }
}

const p = new Params(1, 2, 3);
p.x; // (property) Params.x: number
p.y; // Error: Property 'y' is protected and only accessible within class 'Params' and its subclasses.
p.z; // Error: Property 'z' is private and only accessible within class 'Params'.
```

### abstract Classes and Members

Abstract classes are base classes from which other classes may be derived. They may not be instantiated directly. Unlike an interface, an abstract class may provide implementation details for its members:

```typescript
abstract class Department {
  constructor(public name: string) {}

  printName(): void {
    console.log("Department name: " + this.name);
  }

  abstract printMeeting(): void; // must be implemented in derived classes
}

class AccountingDepartment extends Department {
  constructor() {
    super("Accounting and Auditing");
  }

  printMeeting(): void {
    console.log("The accounting department meets at 10am sharp.");
  }

  generateReports(): void {
    console.log("Generating accounting reports...");
  }
}

let department: Department; // OK to create a reference to an abstract type
department = new Department(); // Error: Cannot create an instance of an abstract class.
department = new AccountingDepartment(); // OK to create and assign a non-abstract subclass
department.printName();
department.printMeeting();
department.generateReports(); // Error: Method 'generateReports' does not exist on type 'Department'.
```

---

## Generics

### Hello World of Generics

To start off, let's do the "hello world" of generics: a function that works on a list of any type:

```typescript
function identity<Type>(arg: Type): Type {
  return arg;
}
```

We could have written this without the generic type:

```typescript
function identity(arg: any): any {
  return arg;
}
```

But using any loses the information about what type was passed in and what type is returned. Instead, we need a way to capture the type of the argument in such a way that we can also use it to denote what is returned. Here, we used a type variable, a special kind of variable that works on types rather than values.

### Working with Generic Type Variables

When you start to use generics, you'll notice that when you create generic functions like identity, the compiler will enforce that you use the generic type in the body of the function correctly. That is, you'll actually be treating these types as if they could be any and all types.

Let's take our identity function from earlier:

```typescript
function identity<Type>(arg: Type): Type {
  return arg;
}
```

What if we want to also log the length of the argument, or its size, to the console each time it's called? We might be tempted to write this:

```typescript
function loggingIdentity<Type>(arg: Type): Type {
  console.log(arg.length); // Error: Property 'length' does not exist on type 'Type'.
  return arg;
}
```

The compiler is telling us that we're not guaranteed that Type has a length property, so we need to constrain this type.

### Generic Types

In this section, we'll explore the type of generic functions themselves, and how to create generic interfaces.

The type of generic functions is just like those of non-generic functions, with the type parameters listed first, similarly to function declarations:

```typescript
function identity<Type>(arg: Type): Type {
  return arg;
}

let myIdentity: <Type>(arg: Type) => Type = identity;
```

We could also have called the generic type parameter a different name in the type:

```typescript
let myIdentity: <Input>(arg: Input) => Input = identity;
```

As a more concrete example, let's write a generic interface that takes a type parameter:

```typescript
interface GenericIdentityFn<Type> {
  (arg: Type): Type;
}

function identity<Type>(arg: Type): Type {
  return arg;
}

let myIdentity: GenericIdentityFn<number> = identity;
```

### Generic Classes

A generic class has a similar shape to a generic interface. Generic classes have a generic type parameter list in angle brackets (<>) following the name of the class:

```typescript
class GenericNumber<NumType> {
  zeroValue: NumType;
  add: (x: NumType, y: NumType) => NumType;
}

let myGenericNumber = new GenericNumber<number>();
myGenericNumber.zeroValue = 0;
myGenericNumber.add = function (x, y) {
  return x + y;
};
```

This is a pretty literal use of the GenericNumber class, but you might have noticed that we created the class with no type arguments, and set the zeroValue and add properties later. This works, but it's better to be explicit about the types:

```typescript
let stringNumeric = new GenericNumber<string>();
stringNumeric.zeroValue = "";
stringNumeric.add = function (x, y) {
  return x + y;
};
```

### Generic Constraints

If you remember from earlier, we had to constraint the Type to have a length property. We can do this with an extends clause:

```typescript
interface Lengthwise {
  length: number;
}

function loggingIdentity<Type extends Lengthwise>(arg: Type): Type {
  console.log(arg.length); // Now we know it has a .length property, so no more error
  return arg;
}
```

#### Using Type Parameters in Generic Constraints
You can declare a type parameter that is constrained by another type parameter. For example, here we'd like to get a property from an object given its name:

```typescript
function getProperty<Type, Key extends keyof Type>(obj: Type, key: Key) {
  return obj[key];
}

let x = { a: 1, b: 2, c: 3, d: 4 };

getProperty(x, "a"); // works
getProperty(x, "m"); // error: Argument of type '"m"' is not assignable to parameter of type '"a" | "b" | "c" | "d"'.
```

### Using Class Types in Generics

When creating factories in TypeScript using generics, it is necessary to refer to class types by their constructor functions. For example:

```typescript
function create<Type>(c: { new(): Type }): Type {
  return new c();
}
```

### Generic Parameter Defaults

You can declare a default type for a generic type parameter:

```typescript
interface GenericIdentityFn<Type = string> {
  (arg: Type): Type;
}

function identity<Type>(arg: Type): Type {
  return arg;
}

let myIdentity: GenericIdentityFn = identity; // defaults to string
```

### Variance Annotations

TypeScript 5.9 introduces variance annotations for generic types, allowing you to specify how generic type parameters behave in terms of subtyping:

```typescript
interface Covariant<out T> {
  value: T;
}

interface Contravariant<in T> {
  consume(value: T): void;
}

interface Invariant<in out T> {
  value: T;
  consume(value: T): void;
}
```

---

## Type Manipulation

### Creating Types from Types

TypeScript's type system is very powerful and allows you to create new types from existing types. This is done through type manipulation.

### Mapped Types

A mapped type is a generic type which uses a union of PropertyKeys (typically created via a keyof) to iterate through keys to create a type:

```typescript
type OptionsFlags<Type> = {
  [Property in keyof Type]: boolean;
};

type FeatureFlags = {
  darkMode: () => void;
  newUserProfile: () => void;
};

type FeatureOptions = OptionsFlags<FeatureFlags>;
// type FeatureOptions = {
//   darkMode: boolean;
//   newUserProfile: boolean;
// }
```

### Conditional Types

At the heart of most useful programs, we have to make decisions based on input. JavaScript has conditional statements like if statements and the ternary operator that let us branch the code based on some condition. TypeScript has something similar at the type level. It's called a conditional type.

```typescript
interface Animal {
  live(): void;
}
interface Dog extends Animal {
  woof(): void;
}

type Example1 = Dog extends Animal ? number : string; // type Example1 = number
type Example2 = RegExp extends Animal ? number : string; // type Example2 = string
```

### Template Literal Types

Template literal types build on string literal types, and have the ability to expand into many string literal types through a union:

```typescript
type EventName<T extends string> = `on${Capitalize<T>}`;

type ClickEvent = EventName<"click">; // type ClickEvent = "onClick"
type HoverEvent = EventName<"hover">; // type HoverEvent = "onHover"
```

---

## TSConfig Reference

### Root Fields

Starting up are the root options in the TSConfig - these options relate to how your TypeScript or JavaScript project is set up.

### Compiler Options

#### Type Checking Options

**strict:** Enable all strict type-checking options. Enabling strict enables noImplicitAny, noImplicitThis, alwaysStrict, strictBindCallApply, strictNullChecks, strictFunctionTypes, strictPropertyInitialization, noImplicitReturns, and noFallthroughCasesInSwitch.

**noImplicitAny:** Raise error on expressions and declarations with an implied any type.

**strictNullChecks:** When strictNullChecks is true, null and undefined have their own distinct types and you'll get an error if you try to use them where a concrete value is expected.

**strictFunctionTypes:** When assigning functions, function parameters are checked contravariantly.

**exactOptionalPropertyTypes:** In strict mode, optional properties must be declared exactly as they are defined in the interface.

**noUncheckedIndexedAccess:** When accessing an index, the result must be checked for undefined.

#### Module Options

**module:** Specify what module code is generated.

**moduleResolution:** Specify how TypeScript looks up a file from a given module specifier.

**verbatimModuleSyntax:** Do not transform or elide any import or export statements that aren't specifically marked as type-only.

**isolatedModules:** Ensure that each file can be safely transpiled without relying on other imports.

**moduleDetection:** Control how TypeScript determines whether a file is a script or a module.

#### Emit Options

**declaration:** Generate .d.ts files from TypeScript and JavaScript files in your project.

**declarationMap:** Generate source maps for .d.ts files.

**sourceMap:** Generate source map files for emitted JavaScript files.

**outDir:** Specify an output folder for all emitted files.

#### Interop Constraints

**esModuleInterop:** Emit additional JavaScript to ease support for importing CommonJS modules.

**allowSyntheticDefaultImports:** Allow 'import x from y' when a module doesn't have a default export.

**forceConsistentCasingInFileNames:** Ensure that casing is correct in imports.

#### Language and Environment Options

**target:** Set the JavaScript language version for emitted JavaScript.

**lib:** Specify which library files are included in the compilation.

**jsx:** Specify what JSX code is generated.

**jsxImportSource:** Specify module specifier used to import the JSX factory functions when using jsx: react-jsx*.

#### Completeness Options

**skipLibCheck:** Skip type checking of declaration files.

**forceConsistentCasingInFileNames:** Ensure that casing is correct in imports.

### TypeScript 5.9 Default Configuration

When you run `tsc --init` with no other flags in TypeScript 5.9, you get the following default tsconfig.json:

```json
{
  // Visit https://aka.ms/tsconfig to read more about this file
  "compilerOptions": {
    // File Layout
    // "rootDir": "./src",
    // "outDir": "./dist",

    // Environment Settings
    // See also https://aka.ms/tsconfig_modules
    "module": "nodenext",
    "target": "esnext",
    "types": [],

    // For nodejs:
    // "lib": ["esnext"],
    // "types": ["node"],
    // and npm install -D @types/node

    // Other Outputs
    "sourceMap": true,
    "declaration": true,
    "declarationMap": true,

    // Stricter Typechecking Options
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,

    // Style Options
    // "noImplicitReturns": true,
    // "noImplicitOverride": true,
    // "noUnusedLocals": true,
    // "noUnusedParameters": true,
    // "noFallthroughCasesInSwitch": true,
    // "noPropertyAccessFromIndexSignature": true,

    // Recommended Options
    "strict": true,
    "jsx": "react-jsx",
    "verbatimModuleSyntax": true,
    "isolatedModules": true,
    "noUncheckedSideEffectImports": true,
    "moduleDetection": "force",
    "skipLibCheck": true
  }
}
```

---

## TypeScript 5.9 Features

### Minimal and Updated tsc --init

For a while, the TypeScript compiler has supported an --init flag that can create a tsconfig.json within the current directory. In the last few years, running tsc --init created a very "full" tsconfig.json, filled with commented-out settings and their descriptions.

However, given external feedback (and our own experience), we found it's common to immediately delete most of the contents of these new tsconfig.json files. When users want to discover new options, we find they rely on auto-complete from their editor, or navigate to the tsconfig reference on the website.

In TypeScript 5.9, a plain tsc --init with no other flags generates a minimal but opinionated tsconfig.json with modern defaults.

### Support for import defer

TypeScript 5.9 adds support for the import defer proposal, which allows you to defer the loading of imported modules until runtime:

```typescript
import defer { module } from "./module";
```

### Support for --module node20

TypeScript 5.9 adds support for the node20 module resolution mode, which integrates with Node's native ECMAScript Module support.

### Summary Descriptions in DOM APIs

The DOM lib definitions now include summary descriptions for better IDE support and documentation.

### Expandable Hovers (Preview)

New expandable hover functionality in editors for better type information display.

### Configurable Maximum Hover Length

You can now configure the maximum length of hover displays.

### Optimizations

#### Cache Instantiations on Mappers
Improved performance through better caching of type instantiations.

#### Avoiding Closure Creation in fileOrDirectoryExistsUsingSource
Optimizations to reduce memory usage and improve compilation speed.

### Notable Behavioral Changes

#### lib.d.ts Changes
Updated DOM type definitions to reflect the latest web standards.

#### Type Argument Inference Changes
Improved type argument inference in certain edge cases for better type accuracy.

---

## Integration Patterns

### React Integration

```typescript
// Component props
interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  variant = 'primary',
  disabled = false 
}) => {
  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`btn btn-${variant}`}
    >
      {children}
    </button>
  );
};

// Custom hooks with proper typing
function useApi<T>(url: string): {
  data: T | null;
  loading: boolean;
  error: string | null;
} {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(url)
      .then(response => response.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [url]);

  return { data, loading, error };
}
```

### Node.js Integration

```typescript
// Express route handler with proper typing
import { Request, Response, NextFunction } from 'express';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

const getUser = async (
  req: AuthenticatedRequest, 
  res: Response, 
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await userService.findById(id);
    
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    
    res.json(user);
  } catch (error) {
    next(error);
  }
};

// Database types
interface User {
  id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

interface CreateUserInput {
  email: string;
  password: string;
}

interface UserRepository {
  findById(id: string): Promise<User | null>;
  create(data: CreateUserInput): Promise<User>;
  update(id: string, data: Partial<User>): Promise<User>;
  delete(id: string): Promise<void>;
}
```

### API Types

```typescript
// API response types
interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  meta?: {
    pagination?: {
      page: number;
      limit: number;
      total: number;
    };
  };
}

// Error types
interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  stack?: string;
}

// Request types
interface PaginationParams {
  page?: number;
  limit?: number;
}

interface FilterParams {
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Combined request type
interface ListUsersQuery extends PaginationParams, FilterParams {
  role?: string;
}
```

### Configuration Types

```typescript
// Environment configuration
interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl: boolean;
  maxConnections: number;
}

interface AuthConfig {
  secret: string;
  expiresIn: string;
  refreshExpiresIn: string;
  bcryptRounds: number;
}

interface ServerConfig {
  port: number;
  host: string;
  cors: {
    origin: string | string[];
    credentials: boolean;
  };
  rateLimit: {
    windowMs: number;
    max: number;
  };
}

interface AppConfig {
  database: DatabaseConfig;
  auth: AuthConfig;
  server: ServerConfig;
  environment: 'development' | 'staging' | 'production';
  logLevel: 'error' | 'warn' | 'info' | 'debug';
}

// Configuration validation
function validateConfig(config: unknown): config is AppConfig {
  const cfg = config as any;
  return (
    cfg &&
    typeof cfg.database === 'object' &&
    typeof cfg.auth === 'object' &&
    typeof cfg.server === 'object' &&
    ['development', 'staging', 'production'].includes(cfg.environment)
  );
}
```

### Event Types

```typescript
// Event system types
interface BaseEvent {
  id: string;
  type: string;
  timestamp: Date;
  userId?: string;
  sessionId?: string;
}

interface AnalyticsEvent extends BaseEvent {
  type: 'analytics';
  payload: {
    category: string;
    action: string;
    label?: string;
    value?: number;
    properties?: Record<string, unknown>;
  };
}

interface UserEvent extends BaseEvent {
  type: 'user';
  payload: {
    action: 'login' | 'logout' | 'register' | 'update_profile';
    userId: string;
    properties?: Record<string, unknown>;
  };
}

interface SystemEvent extends BaseEvent {
  type: 'system';
  payload: {
    level: 'info' | 'warn' | 'error' | 'fatal';
    message: string;
    service: string;
    version: string;
    properties?: Record<string, unknown>;
  };
}

type Event = AnalyticsEvent | UserEvent | SystemEvent;

// Event handlers
type EventHandler<T extends Event = Event> = (event: T) => void | Promise<void>;

interface EventBus {
  on<T extends Event>(eventType: T['type'], handler: EventHandler<T>): void;
  off<T extends Event>(eventType: T['type'], handler: EventHandler<T>): void;
  emit<T extends Event>(event: T): Promise<void>;
}
```

---

## Best Practices

### Type Safety

1. **Enable strict mode in tsconfig.json**
   ```json
   {
     "compilerOptions": {
       "strict": true,
       "noImplicitAny": true,
       "strictNullChecks": true,
       "strictFunctionTypes": true
     }
   }
   ```

2. **Avoid `any` type - use `unknown` instead**
   ```typescript
   // Bad
   function processData(data: any): any {
     return data;
   }
   
   // Good
   function processData(data: unknown): unknown {
     return data;
   }
   
   // Better - be specific
   function processData(data: string): string {
     return data.toUpperCase();
   }
   ```

3. **Use type guards for runtime type checking**
   ```typescript
   function isString(value: unknown): value is string {
     return typeof value === 'string';
   }
   
   function processValue(value: unknown) {
     if (isString(value)) {
       // TypeScript knows value is string here
       console.log(value.toUpperCase());
     }
   }
   ```

4. **Prefer interfaces over type aliases for object shapes**
   ```typescript
   // Preferred
   interface User {
     id: string;
     name: string;
   }
   
   // Acceptable for unions or computed types
   type UserRole = 'admin' | 'user' | 'guest';
   type UserWithRole = User & { role: UserRole };
   ```

### Code Organization

1. **Use barrel exports for clean imports**
   ```typescript
   // types/index.ts
   export * from './user';
   export * from './api';
   export * from './config';
   
   // Usage
   import { User, ApiResponse, AppConfig } from './types';
   ```

2. **Organize types in separate files when they grow large**
   ```
   src/
     types/
       index.ts
       user.ts
       api.ts
       config.ts
       events.ts
   ```

3. **Use namespace for related types when appropriate**
   ```typescript
   namespace API {
     export interface Response<T> {
       data: T;
       success: boolean;
     }
     
     export interface Error {
       code: string;
       message: string;
     }
   }
   ```

### Performance

1. **Use `verbatimModuleSyntax` for better tree-shaking**
   ```json
   {
     "compilerOptions": {
       "verbatimModuleSyntax": true
     }
   }
   ```

2. **Enable `incremental` compilation for faster builds**
   ```json
   {
     "compilerOptions": {
       "incremental": true,
       "tsBuildInfoFile": ".tsbuildinfo"
     }
   }
   ```

3. **Use project references for large codebases**
   ```json
   {
     "compilerOptions": {
       "composite": true,
       "declaration": true,
       "declarationMap": true
     },
     "references": [
      { "path": "./common" },
      { "path": "./app" }
     ]
   }
   ```

4. **Configure `skipLibCheck` for faster compilation**
   ```json
   {
     "compilerOptions": {
       "skipLibCheck": true
     }
   }
   ```

### Error Handling

1. **Use discriminated unions for error handling**
   ```typescript
   type Result<T, E = Error> = 
     | { success: true; data: T }
     | { success: false; error: E };
   
   function asyncOperation(): Promise<Result<string>> {
     try {
       const data = await fetch('/api/data');
       return { success: true, data: await data.text() };
     } catch (error) {
       return { success: false, error: error as Error };
     }
   }
   ```

2. **Create specific error types**
   ```typescript
   class ValidationError extends Error {
     constructor(
       public field: string,
       public value: unknown,
       message: string
     ) {
       super(message);
       this.name = 'ValidationError';
     }
   }
   
   class NetworkError extends Error {
     constructor(
       public status: number,
       message: string
     ) {
       super(message);
       this.name = 'NetworkError';
     }
   }
   ```

---

## Migration Guide

### From JavaScript

#### 1. Gradual Adoption
- Start with `allowJs: true` to mix JS and TS
- Add type annotations to critical functions first
- Use `@ts-check` comments in JS files

#### 2. Common Issues
- Fix implicit any errors
- Handle null/undefined properly
- Configure module resolution correctly

#### 3. Migration Steps
1. **Setup TypeScript**
   ```bash
   npm install -D typescript @types/node @types/express
   npx tsc --init
   ```

2. **Rename files**
   ```bash
   # Rename .js files to .ts
   mv app.js app.ts
   
   # For JSX files
   mv component.js component.tsx
   ```

3. **Add types gradually**
   ```typescript
   // Start with @ts-check
   // @ts-check
   
   function calculateTotal(items) {
     return items.reduce((sum, item) => sum + item.price, 0);
   }
   
   // Then add types
   interface Item {
     price: number;
     name: string;
   }
   
   function calculateTotal(items: Item[]): number {
     return items.reduce((sum, item) => sum + item.price, 0);
   }
   ```

### From Older TypeScript Versions

#### 1. Update Configuration
- Remove deprecated options
- Add new strict checking options
- Update target and lib settings

#### 2. Handle Breaking Changes
- Review breaking changes in release notes
- Update type definitions
- Fix any compilation errors

---

## Troubleshooting

### Common Compiler Errors

1. **Cannot find module**
   - Check `moduleResolution` and `baseUrl` settings
   - Ensure correct file extensions
   - Verify module paths

2. **Implicit any**
   - Add explicit type annotations
   - Enable `noImplicitAny` to catch these early
   - Use `unknown` instead of `any`

3. **Strict null checks**
   - Use optional chaining (`?.`)
   - Use nullish coalescing (`??`)
   - Add proper null checks

4. **Property does not exist on type**
   - Check type definitions
   - Use type assertions if necessary
   - Extend interfaces if needed

### Performance Issues

1. **Slow compilation**
   - Enable `incremental: true`
   - Use `skipLibCheck: true`
   - Configure project references

2. **Memory usage**
   - Limit `maxNodeModuleJsDepth`
   - Use `exclude` in tsconfig
   - Optimize type definitions

3. **IDE performance**
   - Disable unused type checking
   - Use `tsconfig.build.json`
   - Configure VSCode settings

### Development Workflow

1. **Watch mode**
   ```bash
   npx tsc --watch
   ```

2. **Build scripts**
   ```json
   {
     "scripts": {
       "build": "tsc",
       "build:watch": "tsc --watch",
       "build:prod": "tsc --project tsconfig.build.json"
     }
   }
   ```

3. **Linting with TypeScript**
   ```bash
   npm install -D @typescript-eslint/parser @typescript-eslint/eslint-plugin
   ```

---

## Learning Resources

### Official Documentation
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [TSConfig Reference](https://www.typescriptlang.org/tsconfig/)
- [Playground](https://www.typescriptlang.org/play/)

### Key Handbook Sections
- [Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)
- [Creating Types from Types](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html)
- [Object Types](https://www.typescriptlang.org/docs/handbook/2/objects.html)
- [Functions](https://www.typescriptlang.org/docs/handbook/2/functions.html)
- [Classes](https://www.typescriptlang.org/docs/handbook/2/classes.html)
- [Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html)
- [Type Manipulation](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html)

### Release Notes
- [TypeScript 5.9 Release Notes](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-9.html)
- [TypeScript 5.8 Release Notes](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-8.html)
- [TypeScript 5.7 Release Notes](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-7.html)

### Community Resources
- [TypeScript GitHub](https://github.com/microsoft/TypeScript)
- [TypeScript Discord](https://discord.gg/typescript)
- [Stack Overflow TypeScript Tag](https://stackoverflow.com/questions/tagged/typescript)

---

*This documentation covers TypeScript ^5.9.0 as used in this repository. For the latest features, check the official TypeScript documentation.*
