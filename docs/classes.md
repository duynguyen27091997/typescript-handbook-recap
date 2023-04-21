#  Classes

##  Introduction

Traditional JavaScript programs use functions and prototype-based inheritance to create reusable components, but it can be tricky for programmers familiar with using object-oriented methods, because they use class-based inheritance and objects are constructed from classes of. Starting with ECMAScript 2015, aka ECMAScript 6, JavaScript programmers will be able to use a class-based object-oriented approach. With TypeScript, we allow developers to use these features now, and compile JavaScript to run on all major browsers and platforms without waiting for the next JavaScript version.

##  Class

Here's an example of using a class:

```typescript
class Greeter {
    greeting: string;
    constructor(message: string) {
        this.greeting = message;
    }
    greet() {
        return "Hello, " + this.greeting;
    }
}
let greeter = new Greeter("world");
```

If you have used C \# or Java, you will be very familiar with this syntax. We declare a `Greeter` class. This class has 3 members: a property called `greeting` , a constructor, and a `greet` method.

You'll notice that we use `this` whenever we refer to any class member . It means that we are accessing a member of a class.

In the last line, we use `new` to construct an instance of the `Greeter` class. It calls the previously defined constructor, creates a new object of type `Greeter` , and executes the constructor to initialize it.

##  Inheritance

In TypeScript, we can use common object-oriented patterns. One of the most fundamental patterns in class-based programming is to allow the use of inheritance to extend existing classes.

See the example below:

```typescript
class Animal {
    move(distanceInMeters: number = 0) {
        console.log(`Animal moved ${distanceInMeters}m.`);
    }
}
class Dog extends Animal {
    bark() {
        console.log('Woof! Woof!');
    }
}
const dog = new Dog();
dog.bark();
dog.move(10);
dog.bark();
```

This example shows the most basic inheritance: a class inherits properties and methods from a base class. Here, `Dog` is a _derived class_ that derives from the `Animal` _base class_ via the `extends` keyword. A derived class is usually called a _subclass_ and a base class is usually called a _superclass_ .

Because `Dog` inherits the functionality of `Animal` , we can create an instance of `Dog` that can `bark()` and `move()` .

Let's look at a more complex example.

```typescript
class Animal {
    name: string;
    constructor(theName: string) { this.name = theName; }
    move(distanceInMeters: number = 0) {
        console.log(`${this.name} moved ${distanceInMeters}m.`);
    }
}
class Snake extends Animal {
    constructor(name: string) { super(name); }
    move(distanceInMeters = 5) {
        console.log("Slithering...");
        super.move(distanceInMeters);
    }
}
class Horse extends Animal {
    constructor(name: string) { super(name); }
    move(distanceInMeters = 45) {
        console.log("Galloping...");
        super.move(distanceInMeters);
    }
}
let sam = new Snake("Sammy the Python");
let tom: Animal = new Horse("Tommy the Palomino");
sam.move();
tom.move(34);
```

This example demonstrates some features not mentioned above. This time, we use the `extends` keyword to create two subclasses of `Animal` : `Horse` and `Snake` .

The difference from the previous example is that the derived class contains a constructor that _must_ call `super()` , which executes the base class constructor. Also, we _must_ call `super()` before accessing `this` properties in the constructor . This is an important rule enforced by TypeScript.

This example demonstrates how a method of a superclass can be overridden in a subclass. Both the `Snake` class and the `Horse` class create the `move` method, which overrides the `move` method inherited from `Animal` , so that the `move` method has different functions according to different classes. Note that even though `tom` is declared as `Animal` type, because its value is `Horse` , when `tom.move(34)` is called , it will call the method rewritten in `Horse` :

```text
Slithering...
Sammy the Python moved 5m.
Galloping...
Tommy the Palomino moved 34m.
```

##  public, private and protected modifiers

###  defaults to `public`

In the above example, we can freely access the members defined in the program. If you have a better understanding of classes in other languages, you will notice that we did not use `public` for decoration in the previous code ; for example, C \# requires that you must explicitly use `public` to specify that the member is visible. In TypeScript, members are `public` by default .

You can also explicitly mark a member as `public` . We can rewrite the `Animal` class above in the following way :

```typescript
class Animal {
    public name: string;
    public constructor(theName: string) { this.name = theName; }
    public move(distanceInMeters: number) {
        console.log(`${this.name} moved ${distanceInMeters}m.`);
    }
}
```

###  Understanding `private`

When a member is marked `private` , it cannot be accessed outside the class in which it is declared. for example:

```typescript
class Animal {
    private name: string;
    constructor(theName: string) { this.name = theName; }
}
new  Animal ( " Cat " ).name ; // Error : 'name' is private.
```

TypeScript uses a structural type system. When we compare two different types, we don't care where they come from, we consider their types to be compatible if the types of all members are compatible.

However, the situation is different when we compare types with `private` or `protected` members. If one of the types contains a `private` member, then the two types are considered to be compatible only if the other type also has such a `private` member, and both are from the same declaration. This rule is also used for `protected` members.

Let's look at an example that better illustrates this:

```typescript
class Animal {
    private name: string;
    constructor(theName: string) { this.name = theName; }
}
class Rhino extends Animal {
    constructor() { super("Rhino"); }
}
class Employee {
    private name: string;
    constructor(theName: string) { this.name = theName; }
}
let animal = new Animal("Goat");
let rhino = new Rhino();
let employee = new Employee("Bob");
animal = rhino;
animal  =  employee ; // Error: Animal is not compatible with Employee.
```

In this example, there are two classes `Animal` and `Rhino` , and `Rhino` is a subclass of the `Animal` class. There is also an `Employee` class whose type looks to be the same as `Animal` . We create several instances of these classes and assign values ​​to each other to see what happens. Since `Animal` and `Rhino` share the private member definition `private name: string` from `Animal` , they are compatible. However `Employee` is not the case. When assigning `Employee` to `Animal` , I get an error saying that their types are incompatible. Although `Employee` also has a private member `name` , it is clearly not the one defined in `Animal` .

###  Understanding `protected`

The `protected` modifier behaves much like the `private` modifier, but with one difference, `protected` members are still accessible in derived classes. For example:

```typescript
class Person {
    protected name: string;
    constructor(name: string) { this.name = name; }
}
class  Employee  extends  Person {
    private department: string;
    constructor(name: string, department: string) {
        super(name)
        this.department = department;
    }
    public getElevatorPitch() {
        return `Hello, my name is ${this.name} and I work in ${this.department}.`;
    }
}
let howard = new Employee("Howard", "Sales");
console.log(howard.getElevatorPitch());
console . log ( howard . name ); // error
```

Note that we cannot use `name` outside the `Person` class , but we can still access it through the instance methods of the `Employee` class, because `Employee` is derived from `Person` .

Constructors can also be marked `protected` . This means that this class cannot be instantiated outside of its containing class, but can be inherited. for example,

```typescript
class Person {
    protected name: string;
    protected constructor(theName: string) { this.name = theName; }
}
// Employee can inherit from Person
class  Employee  extends  Person {
    private department: string;
    constructor(name: string, department: string) {
        super(name);
        this.department = department;
    }
    public getElevatorPitch() {
        return `Hello, my name is ${this.name} and I work in ${this.department}.`;
    }
}
let howard = new Employee("Howard", "Sales");
let john =  new  Person ( " John " ); // Error: 'Person' constructor is protected.
```

##  Readonly modifier

You can make a property read-only using the `readonly` keyword. Read-only properties must be initialized at declaration time or in the constructor.

```typescript
class  Octopus {
    readonly name: string;
    readonly numberOfLegs: number = 8;
    constructor (theName: string) {
        this.name = theName;
    }
}
let dad = new Octopus("Man with the 8 strong legs");
dad . name  =  " Man with the 3-piece suit " ; // Error! name is read-only.
```

###  Parameter properties

In the above example, we had to define a read-only member `name` and a constructor parameter `theName` in the `Person` class . This is done so that the value of `theName` can be accessed after the `Octopus` constructor has been executed . This situation often occurs. The _parameter attribute_ is convenient for us to define and initialize a member in one place. The following example is a modified version of the previous `Animal` class, using parameter properties:

```typescript
class Animal {
    constructor(private name: string) { }
    move(distanceInMeters: number) {
        console.log(`${this.name} moved ${distanceInMeters}m.`);
    }
}
```

Notice how we dropped `theName` and just used the `private name: string` parameter in the constructor to create and initialize the `name` member. We combined declaration and assignment into one place.

Parameter properties are declared by adding an access-qualifier to the constructor parameter. Qualifying a parameter property with `private` declares and initializes a private member; the same is true for `public` and `protected` .

##  Accessors

TypeScript supports intercepting access to object members via getters/setters. It can help you effectively control access to object members.

Let's see how to rewrite a simple class to use `get` and `set` . First, we start with an example that doesn't use accessors.

```typescript
class Employee {
    fullName: string;
}
let employee = new Employee();
employee.fullName = "Bob Smith";
if (employee.fullName) {
    console.log(employee.fullName);
}
```

It is convenient to allow setting `fullName` arbitrarily , but we still want to enforce certain constraints when setting `fullName` .

In this release, we've added a `setter` to check the length of `newName` to ensure it meets the maximum length limit for database fields. If it is not satisfied, then we throw an error to tell the client that something went wrong.

To preserve the original functionality, we also add a `getter` to read `fullName` .

```typescript
const fullNameMaxLength = 10;
class Employee {
    private _fullName: string;
    get fullName(): string {
        return this._fullName;
    }
    set fullName(newName: string) {
        if (newName && newName.length > fullNameMaxLength) {
            throw new Error("fullName has a max length of " + fullNameMaxLength);
        }
        this._fullName = newName;
    }
}
let employee = new Employee();
employee.fullName = "Bob Smith";
if (employee.fullName) {
    alert(employee.fullName);
}
```

To demonstrate that the accessor we wrote now checks the length, we can assign the name a value longer than `10` characters and verify that we get an error.

There are a few things to note about accessors:

First, accessors require that you set your compiler to output ECMAScript 5 or higher. Downgrading to ECMAScript 3 is not supported. Second, accessors with only `get` and no `set` are automatically inferred to be `readonly` . This is helpful when generating `.d.ts` files from code, as users utilizing this property will see that they are not allowed to change its value.

##  Static properties

So far, we've only discussed class instance members, properties that are initialized only when the class is instantiated. We can also create static members of classes, properties that exist on the class itself rather than on an instance of the class. In this example, we use `static` to define `origin` , because it is a property that is used by all grids. When each instance wants to access this property, it must add the class name before `origin` . Just like using `this.` prefix on instance properties to access properties, here we use `Grid.` to access static properties.

```typescript
class Grid {
    static origin = {x: 0, y: 0};
    calculateDistanceFromOrigin(point: {x: number; y: number;}) {
        let xDist = (point.x - Grid.origin.x);
        let yDist = (point.y - Grid.origin.y);
        return Math.sqrt(xDist * xDist + yDist * yDist) / this.scale;
    }
    constructor (public scale: number) { }
}
let grid1 = new Grid(1.0);  // 1x scale
let grid2 = new Grid(5.0);  // 5x scale
console.log(grid1.calculateDistanceFromOrigin({x: 10, y: 10}));
console.log(grid2.calculateDistanceFromOrigin({x: 10, y: 10}));
```

##  Abstract class

Abstract classes are used as base classes for other derived classes. They are generally not instantiated directly. Unlike interfaces, abstract classes can contain the implementation details of members (except for abstract functions in abstract classes, other functions can contain concrete implementations). The `abstract` keyword is used to define abstract classes and define abstract methods inside abstract classes.

```typescript
abstract class Animal {
    abstract makeSound(): void;
    move(): void {
        console.log("roaming the earth...");
    }
}
```

An abstract method in an abstract class does not contain a concrete implementation and must be implemented in a derived class. The syntax of an abstract method is similar to that of an interface method. Both define method signatures but do not contain method bodies. However, abstract methods must contain the `abstract` keyword and may contain access modifiers.

```typescript
abstract class Department {
    constructor(public name: string) {
    }
    printName(): void {
        console.log('Department name: ' + this.name);
    }
    abstract printMeeting() :  void ; // Must be implemented in derived classes
}
class AccountingDepartment extends Department {
    constructor() {
        super ( ' Accounting and Auditing ' ); // must call super() in the constructor of the derived class
    }
    printMeeting(): void {
        console.log('The Accounting Department meets each Monday at 10am.');
    }
    generateReports(): void {
        console.log('Generating accounting reports...');
    }
}
let department :  Department ; // Allows to create a reference to an abstract type
department  =  new  Department (); // Error: cannot create an instance of an abstract class
department  =  new  AccountingDepartment (); // Allow instantiation and assignment of an abstract subclass
department.printName();
department.printMeeting();
department .generateReports (); // Error: Method does not exist in the declared abstract class
```

##  Advanced Tips

###  Constructor

When you declare a class in TypeScript, you are actually declaring many things at the same time. The first is the type of the _instance_ of the class.

```typescript
class Greeter {
    greeting: string;
    constructor(message: string) {
        this.greeting = message;
    }
    greet() {
        return "Hello, " + this.greeting;
    }
}
let greeter: Greeter;
greeter = new Greeter("world");
console.log(greeter.greet());
```

Here, we wrote `let greeter: Greeter` , which means that the instance of `Greeter` class is of type `Greeter` . This is an old habit for programmers who have used other object-oriented languages.

We also create a value called _constructor_ . This function will be called when we use `new` to create a class instance. Let's take a look at what the above code looks like after being compiled into JavaScript:

```typescript
let Greeter = (function () {
    function Greeter(message) {
        this.greeting = message;
    }
    Greeter.prototype.greet = function () {
        return "Hello, " + this.greeting;
    };
    return Greeter;
})();
let greeter;
greeter = new Greeter("world");
console.log(greeter.greet());
```

In the above code, `let Greeter` will be assigned as the constructor. When we call `new` and execute this function, we will get an instance of the class. This constructor also contains all the static properties of the class. From another perspective, we can think of a class as having two parts : _instance part_ and _static part_ .

Let's rewrite the example a bit to see the difference:

```typescript
class Greeter {
    static standardGreeting = "Hello, there";
    greeting: string;
    greet() {
        if (this.greeting) {
            return "Hello, " + this.greeting;
        }
        else {
            return Greeter.standardGreeting;
        }
    }
}
let greeter1: Greeter;
greeter1 = new Greeter();
console.log(greeter1.greet());
let greeterMaker: typeof Greeter = Greeter;
greeterMaker.standardGreeting = "Hey there!";
let greeter2: Greeter = new greeterMaker();
console.log(greeter2.greet());
```

In this example, `greeter1` is the same as we saw before. We instantiate the `Greeter` class and use this object. Same as what we saw before.

After that, we use the class directly. We create a variable called `greeterMaker` . This variable holds the class or saves the class constructor. Then we use `typeof Greeter` , meaning take the type of the Greeter class, not the instance type. Or more precisely, "tell me the type of the `Greeter` identifier", that is, the type of the constructor. This type contains all static members and constructors of the class. Then, just like before, we use `new` on `greeterMaker` to create an instance of `Greeter` .

###  Using classes as interfaces

As mentioned in the previous section, a class definition creates two things: an instance type of the class and a constructor. Because classes create types, you can use classes where interfaces are allowed.

```typescript
class Point {
    x: number;
    y: number;
}
interface Point3d extends Point {
    z: number;
}
let point3d: Point3d = {x: 1, y: 2, z: 3};
```