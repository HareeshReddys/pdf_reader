# JavaScript interview reference

Generated from https://full-stack-interview-ecru.vercel.app/fullstack-dev/ for local search.
# Javascript Essentials

Source: https://full-stack-interview-ecru.vercel.app/fullstack-dev/javascript-essentials

## var let const; Variable Declarations; Block Scope vs Function Scope; Modern JavaScript Variables

- const is the default choice when the variable should not be reassigned.

- let is used when the value needs to change later.

- var is older and can create confusing scope issues.

- let and const are block-scoped, so they stay inside {} .

- In modern projects, use const first and let only when needed.

```
const userName = "John";
let score = 0;
score++;
```

## Conditional Statements; if else switch ternary; Branching In JavaScript; Decision Making

- Conditional statements help code make decisions.

- if-else is useful for simple conditions.

- switch is cleaner when checking one value against many cases.

- ternary is useful for short one-line conditions.

- Prefer === over == to avoid unexpected type conversion.

```
const buttonText = isLoggedIn ? "Logout" : "Login";
```

## Error Handling; try catch finally; JavaScript Error Handling; Handle Runtime Errors

- try-catch helps handle errors safely without breaking the full app.

- Put risky code like API calls inside try .

- Use catch to log the error or show a useful message.

- finally runs after success or failure.

- Commonly used for API calls, file uploads, and database operations.

```
try {
  const res = await fetch("/api/users");
  const users = await res.json();
} catch (error) {
  console.error("Failed to load users", error);
}
```

## Spread vs Rest Operator; Three Dots Operator; ... Syntax; Spread And Rest Difference

- Spread | Rest

- Expands values | Collects values
- Used for copying and merging | Used in function parameters
- Unpacks arrays or objects | Packs values into one variable

- Both use the same ... syntax.

- Spread is common when copying arrays, objects, or React state.

- Rest is common when a function accepts many arguments.

```
const updatedUser = { ...user, role: "admin" };

function sum(...numbers) {
  return numbers.reduce((total, num) => total + num, 0);
}
```

## Arrays; JavaScript Array Methods; map filter reduce forEach; List Data Handling

- Arrays store multiple values in order.

- map() transforms each item and returns a new array.

- filter() keeps only matching items.

- reduce() combines many values into one result.

- Commonly used for users, products, todos, and API response data.

```
const activeUsers = users.filter(user => user.active);
```

## Array Destructuring; Destructure Array; Extract Values From Array; React Hook Pattern

- Array destructuring extracts values by position.

- It makes code shorter and cleaner.

- Order matters because values come by index.

- It supports default values and rest values.

- React hooks commonly use this pattern.

```
const [count, setCount] = useState(0);
const [first, ...rest] = [10, 20, 30];
```

## Functions; Function Types; Function Declaration Expression Arrow; Reusable Logic

- Functions are reusable blocks of code.

- They help avoid repeating the same logic.

- Functions can receive inputs and return output.

- JavaScript functions can be stored in variables and passed around.

- Common types are declaration, expression, and arrow function.

```
function greet(name) {
  return `Hello ${name}`;
}
```

## Named vs Anonymous Functions; Named Function; Anonymous Function; Debugging Functions

- A named function has a name and is easier to identify while debugging.

- An anonymous function has no name and is often used inline.

- Named functions are better for reusable logic.

- Anonymous functions are fine for short callbacks.

- In real projects, use named functions when readability matters.

```
users.map(function getName(user) {
  return user.name;
});
```

## Function Expression; Function Declaration vs Expression; Hoisting Functions; Function Assigned To Variable

- Function Declaration | Function Expression

- Can be called before it is written | Cannot be used before initialization
- Uses function name() syntax | Stored in a variable
- Fully hoisted | Follows variable rules

- Function expressions are useful when passing functions as values.

- Arrow functions are a common form of function expression.

```
const greet = name => `Hello ${name}`;
```

## Arrow Functions; Fat Arrow Function; Arrow vs Regular Function; Modern JavaScript Function

- Arrow functions are a shorter way to write functions.

- They are commonly used in React and modern JavaScript.

- They work well for callbacks and array methods.

- They do not have their own this .

- Avoid them as object methods when you need the object as this .

```
const add = (a, b) => a + b;
```

## Callback Functions; Callback Pattern; Function Callback; Function Passed As Argument

- A callback is a function passed into another function.

- It runs later when some work is completed.

- It is common in events, timers, and array methods.

- It helps make code flexible and reusable.

- Real example: run a function after a button click.

```
button.addEventListener("click", () => {
  console.log("Button clicked");
});
```

## Higher Order Function; HOF; Function Taking Function; Function Returning Function

- A higher-order function takes another function as input or returns a function.

- map , filter , and reduce are common higher-order functions.

- It helps keep logic reusable and clean.

- It is useful when behavior needs to be passed dynamically.

- Real example: filtering active users using a callback function.

```
const activeUsers = users.filter(user => user.active);
```

## Pure vs Impure Functions; Pure Function; Side Effects; Predictable Functions

- Pure Function | Impure Function

- Same input gives same output | Output can depend on outside changes
- Does not change outside data | Can change outside data
- Easier to test | Useful for API, DOM, and storage work

- Pure functions make code more predictable.

- Impure functions are still needed for real-world side effects.

```
const add = (a, b) => a + b;
```

## Template Literals; String Interpolation; Backtick Strings; Dynamic String Creation

- Template literals use backticks instead of quotes.

- They make dynamic strings easier to write.

- Use ${} to insert variables or expressions.

- They support multi-line strings.

- Commonly used for messages, URLs, and UI text.

```
const message = `Welcome ${user.name}`;
const url = `/users/${user.id}`;
```

## Objects; JavaScript Object; Key Value Pairs; Structured Data

- Objects store data as key-value pairs.

- They are useful for representing real entities like users or products.

- Use dot notation for known keys.

- Use bracket notation for dynamic keys.

- Object values can be strings, numbers, arrays, functions, or nested objects.

```
const user = {
  name: "John",
  role: "admin"
};

console.log(user.name);
```

## Array vs Object; When To Use Array vs Object; List vs Entity; Data Structure Choice

- Array | Object

- Used for ordered lists | Used for named properties
- Accessed by index | Accessed by key
- Example: list of users | Example: one user profile

- Use an array when you have many similar items.

- Use an object when you describe one item with properties.

- A common real-world pattern is an array of objects.

```
const users = [
  { id: 1, name: "John" },
  { id: 2, name: "Sara" }
];
```

## Object Property Add Modify Delete; Update Object Properties; Computed Property Names; Immutable Object Update

- Object properties can be added or updated using assignment.

- In React, update objects immutably using spread.

- Computed property names help update dynamic fields.

- Destructuring can remove a property cleanly.

- Commonly used in forms and state updates.

```
const updatedUser = { ...user, role: "admin" };
const field = "email";
const updatedForm = { ...form, [field]: "test@mail.com" };
```

## Asynchronous Programming; Async Programming; Async JavaScript; Non Blocking Code

- Async programming handles slow tasks without blocking the app.

- It is commonly used for API calls, timers, and file operations.

- JavaScript can start a task and continue running other code.

- Common tools are callbacks, promises, and async/await.

- Always handle loading, success, and error states.

```
const users = await fetch("/api/users").then(res => res.json());
```

## Synchronous vs Asynchronous Programming; Sync vs Async; Blocking vs Non Blocking; Node.js Execution

- Synchronous | Asynchronous

- Runs step by step | Starts task and continues
- Can block execution | Does not block execution
- Simple but slower for long tasks | Better for API and file operations

- Sync code waits for each line to finish.

- Async code is better for slow operations.

- Node.js uses async heavily to handle many requests.

```
console.log("Start");
setTimeout(() => console.log("Later"), 1000);
console.log("End");
```

## Promises; Promise States; Pending Fulfilled Rejected; Async JavaScript Promise

- A promise represents a task that will finish later.

- It can be pending , fulfilled , or rejected .

- Use then for success and catch for failure.

- Promises are commonly used for API calls.

- async/await is built on top of promises.

```
fetch("/api/products")
  .then(res => res.json())
  .then(products => console.log(products))
  .catch(error => console.error(error));
```

## Create Promise; Implement Promise; new Promise; Resolve Reject

- new Promise() is used to create a custom promise.

- Use resolve when the task succeeds.

- Use reject when the task fails.

- Most of the time, we consume promises instead of creating them.

- Creating promises is useful when converting callback-based code.

```
const promise = new Promise((resolve, reject) => {
  resolve("Success");
});
```

## Async Await vs Promises; Async Await Syntax; Await Keyword; Promise Handling

- Promise Chain | Async/Await

- Uses .then() and .catch() | Uses await and try-catch
- Good for simple chains | Cleaner for multiple async steps
- Can become nested | Looks like normal step-by-step code

- async/await is a cleaner way to work with promises.

- Use try-catch to handle errors in async/await.

```
try {
  const res = await fetch("/api/users");
  const users = await res.json();
} catch (error) {
  console.error(error);
}
```

## Classes; JavaScript Class; ES6 Class Syntax; Object Blueprint

- A class is a blueprint for creating objects.

- It groups data and methods together.

- Use new to create an object from a class.

- Classes make object creation more structured.

- Commonly used in OOP-style JavaScript code.

```
class User {
  constructor(name) {
    this.name = name;
  }
}

const user = new User("John");
```

## Constructor; Class Constructor; constructor Method; Object Initialization

- A constructor runs automatically when an object is created.

- It is used to set initial values.

- Inside a constructor, this refers to the new object.

- Every class can have one constructor method.

- Real example: set name and role when creating a user object.

```
class User {
  constructor(name, role) {
    this.name = name;
    this.role = role;
  }
}
```

## this Keyword; this Binding; this In JavaScript; Object Context

- this refers to the object that is currently calling the function.

- In a class method, this usually refers to the class instance.

- Its value can change based on how a function is called.

- Arrow functions do not create their own this .

- Common issue: losing this when passing methods as callbacks.

```
const user = {
  name: "John",
  greet() {
    return this.name;
  }
};
```

## Hoisting; Variable Hoisting; Function Hoisting; Temporal Dead Zone

- Hoisting means JavaScript processes declarations before running code.

- Function declarations can be called before they appear.

- var is hoisted with undefined .

- let and const are hoisted but cannot be used before declaration.

- Using let and const reduces confusing hoisting bugs.

```
greet();

function greet() {
  console.log("Hello");
}
```

## Scope; Function Scope; Block Scope; Global Scope; Variable Visibility

- Scope decides where a variable can be accessed.

- Global scope can be accessed everywhere.

- Function scope works inside a function.

- Block scope works inside {} .

- Keep variables in the smallest scope possible to avoid bugs.

```
if (true) {
  const message = "Hello";
}
```

## Closures; Closure Function; Lexical Scope; Private Variables

- A closure lets a function remember variables from its outer function.

- It is useful for private data.

- It helps preserve values between function calls.

- Commonly used in counters, callbacks, and event handlers.

- It is an important concept for JavaScript interviews.

```
function createCounter() {
  let count = 0;
  return () => ++count;
}
```

## Falsy Values; Truthy Values; Boolean Conversion; JavaScript Falsy List

- Falsy values behave like false in conditions.

- Common falsy values are false , 0 , "" , null , undefined , and NaN .

- Everything else is usually truthy.

- Empty arrays and empty objects are truthy.

- Use ?? when 0 or empty string should still be valid.

```
const count = 0;
const value = count ?? 10;
```

## Type Coercion; Implicit Coercion; Explicit Conversion; JavaScript Type Conversion

- Type coercion means JavaScript converts one type into another.

- Implicit coercion happens automatically.

- Explicit conversion is when we convert manually.

- Prefer explicit conversion because it is clearer.

- Use Number() , String() , and Boolean() for clear conversion.

```
Number("42");
String(100);
Boolean(1);
```

## NaN; isNaN; Number.isNaN; Not A Number Check

- NaN means the result is not a valid number.

- typeof NaN returns "number" , which is a JavaScript quirk.

- NaN is not equal to itself.

- Use Number.isNaN() for a reliable check.

- Avoid global isNaN() when you do not want automatic conversion.

```
Number.isNaN(NaN); // true
Number.isNaN("hello"); // false
```

## Null vs Undefined; Null Check; Undefined Variable; Missing Value

- null | undefined

- Intentionally empty | Not assigned yet
- Set by developer | Usually set by JavaScript
- Means no value | Means missing value

- Both are falsy values.

- Use null when you want to clearly say there is no value.

- Optional chaining helps avoid errors with missing values.

```
const city = user?.address?.city;
```

## use strict; Strict Mode; JavaScript Strict Rules; Prevent Silent Errors

- use strict enables stricter JavaScript rules.

- It catches mistakes that JavaScript may otherwise ignore.

- It prevents accidental global variables.

- Classes and ES modules use strict mode automatically.

- It helps write safer and cleaner code.

```
"use strict";

// x = 10; // Error because x is not declared
```

## ECMAScript; JavaScript Standard; ES Versions; ES6 ES2020 ES2022

- ECMAScript is the standard that defines JavaScript.

- JavaScript follows ECMAScript rules and versions.

- ES6 introduced major features like let , const , classes, arrows, and promises.

- Newer versions added features like optional chaining and private fields.

- Tools like Babel can convert modern syntax for older browsers.

```
const name = user?.profile?.name ?? "Guest";
```

## IIFE; Immediately Invoked Function Expression; Self Invoking Function; Private Scope

- An IIFE is a function that runs immediately after it is created.

- It creates a private scope.

- It helps avoid polluting the global scope.

- It was common before ES modules.

- You may still see it in older JavaScript code.

```
(function () {
  const message = "Private";
  console.log(message);
})();
```

## First Class Functions; Functions As Values; First Class Citizen; JavaScript Functions

- JavaScript treats functions like values.

- Functions can be stored in variables.

- Functions can be passed as arguments.

- Functions can be returned from other functions.

- This makes callbacks and higher-order functions possible.

```
const greet = name => `Hello ${name}`;

function run(fn) {
  return fn("John");
}
```

## Object Destructuring; Destructure Objects; Property Extraction; Function Parameter Destructuring

- Object destructuring extracts properties into variables.

- It makes code shorter and easier to read.

- It can rename variables while extracting.

- It supports default values.

- Commonly used with props, API data, and function parameters.

```
const { name, role = "user" } = user;
```

## Default Parameters; Function Default Values; ES6 Defaults; Optional Arguments

- Default parameters provide fallback values for missing arguments.

- They run when the argument is undefined or not passed.

- They make functions safer and cleaner.

- They reduce manual checks inside functions.

- Commonly used for optional settings and configuration.

```
function createUser(name, role = "user") {
  return { name, role };
}
```

## Arguments Object; arguments vs Rest Parameters; Function Arguments; Rest Args

- arguments | Rest Parameters

- Old style | Modern style
- Array-like object | Real array
- Not available in arrow functions | Works cleanly in modern functions

- Prefer rest parameters in modern JavaScript.

- Rest parameters are easier to use with array methods.

```
function sum(...numbers) {
  return numbers.reduce((total, num) => total + num, 0);
}
```

## Equality Operators; == vs ===; Loose Equality vs Strict Equality; Type Comparison

- == | ===

- Compares after type conversion | Compares value and type
- Can give surprising results | Safer and more predictable
- Avoid in most cases | Preferred in modern JavaScript

- Use === by default.

- Use value == null only when you intentionally want to check both null and undefined .

```
"5" == 5; // true
"5" === 5; // false
```

## Logical Operators; && || ??; Short Circuit Evaluation; Default Values

- && runs the right side only when the left side is truthy.

- || returns the first truthy value.

- ?? returns fallback only for null or undefined .

- Short-circuiting helps write cleaner conditions.

- Use ?? when 0 or empty string should be valid.

```
const name = input || "Guest";
const count = value ?? 0;
isLoggedIn && loadUser();
```

## new Keyword; new Operator; Create Instance; Constructor Object Creation

- new creates a new object from a class or constructor.

- It connects the object to the constructor prototype.

- It runs the constructor function.

- It returns the newly created object.

- Commonly used when creating class instances.

```
class Product {
  constructor(name) {
    this.name = name;
  }
}

const item = new Product("Laptop");
```

## ECMAScript Versions; ES6 Features; ES2017 ES2020 ES2022; Modern JavaScript Features

- ES6 added major features like let , const , arrows, classes, modules, and promises.

- ES2017 introduced async/await .

- ES2020 added optional chaining and nullish coalescing.

- ES2022 added private class fields and Array.at() .

- Knowing ES versions helps explain modern JavaScript features clearly.

```
const userName = user?.profile?.name ?? "Guest";
const lastItem = items.at(-1);
```

Up next

Javascript Closures Scope and Functions

© Copyright 2026. All rights reserved.

Designed & Developed By Durga Prasad - Mob: 9030505066

---

# Javascript Closures Scope and Functions

Source: https://full-stack-interview-ecru.vercel.app/fullstack-dev/javascript-closures-scope-and-functions

## Lexical Scope; Scope Chain; JavaScript Scope; Variable Lookup

- Lexical scope means a function can access variables based on where it is written.

- JavaScript first checks the current scope for a variable.

- If the variable is not found, JavaScript checks the outer scope.

- This lookup process is called the scope chain.

- Scope is decided by code position, not by where the function is called.

```
const appName = "MyApp";

function showName() {
  console.log(appName);
}

showName();
```

## Closures; Closure Function; JavaScript Closure; Lexical Scope

- A closure means an inner function remembers variables from its outer function.

- It works even after the outer function has finished running.

- We use closures to keep data private and reusable.

- Real example: a counter function can remember its own count value.

- Closures happen because functions remember their lexical scope.

```
function createCounter() {
  let count = 0;
  return function () {
    count++;
    return count;
  };
}
```

## Uses Of Closures; Closure Use Cases; Private Variables; Real World Closure

- Closures are used to create private variables.

- They help functions remember previous values.

- They are useful in event handlers, callbacks, and timers.

- Real example: a shopping cart can remember the cart total inside a function.

- Closures are useful when we need data to stay available safely.

## Temporal Dead Zone; TDZ; Let And Const Hoisting; JavaScript Hoisting

- Temporal Dead Zone is the time before a let or const variable is initialized.

- The variable exists in memory but cannot be used yet.

- Accessing it before declaration gives a ReferenceError .

- var behaves differently because it becomes undefined .

- let and const are hoisted, but not safely usable before declaration.

```
console.log(name); // ReferenceError
let name = "John";
```

## Call Apply Bind; Function Methods; This Keyword; Function Borrowing

- call() , apply() , and bind() are used to control the value of this .

- call() calls a function immediately with arguments one by one.

- apply() calls a function immediately with arguments as an array.

- bind() returns a new function and we can call it later.

- Real example: we can borrow a method from one object and use it with another object.

```
function greet(city) {
  return this.name + " from " + city;
}

greet.call({ name: "John" }, "Hyderabad");
```

## Functional Programming; FP; JavaScript Functional Features; Pure Functions

- Functional programming means writing code using small reusable functions.

- JavaScript supports functions as values, callbacks, and higher order functions.

- It prefers less mutation and more predictable output.

- Common examples are map() , filter() , and reduce() .

- JavaScript is not purely functional, but it supports functional style.

## Currying; Curried Function; Function Returning Function; Partial Application

- Currying means converting a function with many arguments into nested functions.

- Each function takes one argument and returns another function.

- It helps reuse common values.

- Real example: we can create a tax calculator by fixing the tax rate first.

- Currying uses closures internally.

```
const multiply = (a) => (b) => a * b;

const double = multiply(2);
console.log(double(5));
```

## Memoization; Memoize Function; Cache Result; Performance Optimization

- Memoization means storing function results and reusing them later.

- It avoids repeating the same calculation again and again.

- It is useful for expensive calculations.

- Real example: caching API-like calculation results for the same input.

- Memoization usually works best with pure functions.

```
const cache = {};

function square(n) {
  if (cache[n]) return cache[n];
  cache[n] = n * n;
  return cache[n];
}
```

## Debouncing; Debounce Function; Search Input; Delay Function Call

- Debouncing delays a function call until the user stops doing an action.

- It is useful for search boxes and form validation.

- It prevents too many function calls.

- Real example: call search API only after the user stops typing.

- Debounce runs after the final event in a quick series.

```
let timer;

function searchLater() {
  clearTimeout(timer);
  timer = setTimeout(() => console.log("Search"), 500);
}
```

## Throttling; Throttle Function; Limit Function Call; Scroll Event

- Throttling limits how often a function can run.

- It runs at fixed time intervals during repeated events.

- It is useful for scroll, resize, and mouse move events.

- Real example: update scroll position only once every few milliseconds.

- Throttle keeps running regularly, but not too frequently.

## Debounce Vs Throttle; Debouncing; Throttling; Performance Difference

- Debounce | Throttle

- Runs after the user stops | Runs at regular intervals
- Best for search input | Best for scroll events
- Cancels previous calls | Limits repeated calls
- Waits for final action | Allows controlled repeated action

- Use debounce when only the final action matters.

- Use throttle when regular updates are needed.

- Both improve performance by reducing function calls.

## Function Invocation Methods; Function Call; Constructor Call; Method Call

- A function can be called as a normal function.

- A function can be called as an object method.

- A function can be called using call() , apply() , or bind() .

- A function can be called as a constructor using new .

- The value of this changes based on how the function is called.

## Arguments Vs Rest Parameter; Arguments Object; Rest Syntax; Function Parameters

- arguments | Rest Parameter

- Available in normal functions | Works in normal and arrow functions
- Looks like an array but is not a real array | Gives a real array
- Contains all passed arguments | Contains selected remaining arguments
- Older style | Modern and cleaner style

- Rest parameter is usually preferred in modern JavaScript.

- arguments does not work inside arrow functions.

- Rest parameter is clearer and easier to use.

```
function add(...numbers) {
  return numbers.reduce((total, n) => total + n, 0);
}
```

## Pass By Value Vs Reference; Primitive Values; Objects; JavaScript Parameters

- Primitive values are passed by value.

- Objects and arrays are passed by sharing the reference value.

- Changing a primitive inside a function does not affect the original value.

- Changing object properties inside a function can affect the original object.

- JavaScript always passes values, but object values are references.

## Function Composition; Compose Function; Pipe Function; Reusable Functions

- Function composition means combining small functions to create a bigger operation.

- The output of one function becomes the input of another function.

- It helps keep code clean and reusable.

- Real example: format user input, trim it, and convert it to lowercase step by step.

- Composition is common in functional programming.

```
const trim = (text) => text.trim();
const lower = (text) => text.toLowerCase();

console.log(lower(trim("  HELLO  ")));
```

## Execution Context; JavaScript Execution Context; Global Context; Function Context

- Execution context is the environment where JavaScript code runs.

- JavaScript creates a global execution context first.

- A new function execution context is created whenever a function is called.

- Each context has memory and code execution parts.

- Execution context helps explain hoisting and function calls.

## Execution Context Phases; Creation Phase; Execution Phase; Hoisting

- JavaScript execution context has two main phases.

- In the creation phase, variables and functions are stored in memory.

- In the execution phase, code runs line by line.

- Function declarations are fully available during creation.

- Hoisting is related to the creation phase.

## Variable Shadowing; Shadowing; Illegal Shadowing; Scope Conflict

- Variable shadowing happens when an inner variable has the same name as an outer variable.

- The inner variable is used first inside its scope.

- It can make code confusing if overused.

- Illegal shadowing happens when var and let are mixed incorrectly in the same scope.

- Avoid shadowing when it reduces readability.

```
let name = "Outer";

function show() {
  let name = "Inner";
  console.log(name);
}
```

## Side Effects; Pure Function Vs Side Effect; Mutation; External Change

- A side effect happens when a function changes something outside itself.

- Examples include changing a global variable, updating the DOM, or calling an API.

- Side effects are not always bad, but they should be controlled.

- Pure functions avoid side effects and return predictable results.

- Fewer side effects make code easier to test.

## Higher Order Function; HOF; Callback Function; Function As Argument

- A higher order function takes another function as an argument or returns a function.

- JavaScript supports higher order functions because functions are values.

- Common examples are map() , filter() , and reduce() .

- Real example: passing a callback to handle button clicks.

- Higher order functions help write reusable logic.

```
const numbers = [1, 2, 3];

const doubled = numbers.map((n) => n * 2);
```

## Pure Function; Pure Function Benefits; Predictable Function; No Side Effects

- A pure function gives the same output for the same input.

- It does not change outside data.

- It is easier to test and debug.

- Real example: a function that adds two numbers and returns the result.

- Pure functions are important in functional programming.

```
function add(a, b) {
  return a + b;
}
```

## First-Class Functions; Functions As Values; Function Variable; JavaScript Functions

- First-class functions mean functions can be treated like values.

- We can store functions in variables.

- We can pass functions as arguments.

- We can return functions from other functions.

- This feature allows callbacks and higher order functions.

## Array Map Polyfill; Implement Map; Custom Map; Array.prototype.map

- A map polyfill means creating our own version of map() .

- map() loops through an array and returns a new array.

- It does not change the original array.

- The callback decides what value goes into the new array.

- map() is used when we want transformed values.

```
Array.prototype.myMap = function (callback) {
  const result = [];
  for (let i = 0; i < this.length; i++) result.push(callback(this[i]));
  return result;
};
```

## Array Filter Polyfill; Implement Filter; Custom Filter; Array.prototype.filter

- A filter polyfill means creating our own version of filter() .

- filter() returns a new array with matching items.

- It does not change the original array.

- The callback should return true or false .

- filter() is used when we want selected values.

```
Array.prototype.myFilter = function (callback) {
  const result = [];
  for (let i = 0; i < this.length; i++) if (callback(this[i])) result.push(this[i]);
  return result;
};
```

## Array Reduce Polyfill; Implement Reduce; Custom Reduce; Array.prototype.reduce

- A reduce polyfill means creating our own version of reduce() .

- reduce() converts an array into one final value.

- It is useful for totals, grouping, and object creation.

- The accumulator stores the running result.

- reduce() is powerful, but should be kept readable.

```
Array.prototype.myReduce = function (callback, acc) {
  for (let i = 0; i < this.length; i++) acc = callback(acc, this[i]);
  return acc;
};
```

## Custom Bind Implementation; Bind Polyfill; Own Bind Method; This Binding

- A custom bind() means creating a function that keeps a fixed this value.

- bind() does not call the function immediately.

- It returns a new function for later use.

- Extra arguments can also be saved.

- bind() is commonly used when function context is lost.

```
Function.prototype.myBind = function (context) {
  const fn = this;
  return function () {
    return fn.call(context);
  };
};
```

## Function Declaration Vs Function Expression; Hoisting; JavaScript Functions

- Function Declaration | Function Expression

- Uses function name() syntax | Stores function in a variable
- Fully hoisted | Depends on variable hoisting
- Can be called before declaration | Usually called after assignment
- Good for normal reusable functions | Good for callbacks and expressions

- Function declarations are available before the line where they are written.

- Function expressions are not safely usable before assignment.

- Hoisting is the main difference.

## Referential Equality; Object Reference; Object Comparison; JavaScript Equality

- Referential equality means objects are compared by memory reference.

- Two different objects with the same values are not equal.

- They are equal only if both variables point to the same object.

- Arrays also follow the same reference comparison rule.

- Use value comparison logic when object contents need to be compared.

```
const a = {};
const b = {};

console.log(a === b); // false
```

## Automatic Semicolon Insertion; ASI; JavaScript Semicolon; Return New Line Bug

- Automatic Semicolon Insertion means JavaScript can add semicolons automatically.

- It usually works, but some cases can create bugs.

- A common issue happens when return is written on one line and value on the next line.

- Using clear formatting helps avoid ASI problems.

- Avoid placing the returned value on a new line after return .

```
function getUser() {
  return
  { name: "John" };
}
```

## IIFE; Immediately Invoked Function Expression; Self Calling Function; Module Pattern

- IIFE means a function that runs immediately after it is created.

- It was commonly used to create private scope.

- It helps avoid polluting the global scope.

- Modern JavaScript often uses modules instead.

- IIFE is still useful to understand old JavaScript code.

```
(function () {
  const message = "Hello";
  console.log(message);
})();
```

## New.Target; Constructor Check; Function Called With New; JavaScript Constructor

- new.target tells whether a function was called using new .

- It is useful inside constructor functions.

- If the function is called normally, new.target is undefined .

- It helps prevent wrong function usage.

- new.target is mainly used in constructor-related code.

```
function User() {
  if (!new.target) return "Use new keyword";
}
```

## Implicit Global; Undeclared Variable; Global Variable Bug; Strict Mode

- An implicit global is created when we assign a value without declaring the variable.

- This can accidentally create a global variable.

- It can cause bugs because global values are shared everywhere.

- strict mode prevents this mistake.

- Always declare variables using let , const , or var .

```
"use strict";

function test() {
  age = 25; // ReferenceError
}
```

Previous

Javascript Essentials

Up next

Javascript Dom and Events

© Copyright 2026. All rights reserved.

Designed & Developed By Durga Prasad - Mob: 9030505066

---

# Javascript Dom and Events

Source: https://full-stack-interview-ecru.vercel.app/fullstack-dev/javascript-dom-and-events

## DOM; Document Object Model; Browser DOM Tree; HTML Page Structure; DOM Manipulation

- DOM is the browser's live version of an HTML page.

- It represents the page like a tree, where each tag becomes a node.

- JavaScript can read, update, add, or remove DOM elements.

- When we change the DOM, the visible page updates immediately.

- Real example: updating a heading, button text, or error message after user action.

```
// Select the first h1 element and change its text
document.querySelector("h1").textContent = "Hello";
```

## Event Propagation; Event Flow; Capture Target Bubble; JavaScript Events

- Event propagation means how an event moves through the DOM.

- It has three steps: capture phase, target phase, and bubble phase.

- The event first moves down to the target and then moves back up.

- This explains why parent elements can also react to child clicks.

- It helps avoid unexpected event behavior in nested UI elements.

```
// Parent also runs when the child button is clicked
parent.addEventListener("click", () => {
  console.log("Parent clicked");
});
```

## Event Bubbling; Bubble Phase; stopPropagation; Parent Click Event

- Event bubbling means an event moves from child element to parent elements.

- It is useful when a parent should handle clicks from its children.

- Sometimes bubbling causes unwanted parent click behavior.

- Use stopPropagation() when the event should not go to parent elements.

- Real example: clicking a modal close button should not trigger the overlay click.

```
button.addEventListener("click", (event) => {
  // Stop the click from reaching parent elements
  event.stopPropagation();
});
```

## Event Capturing; Capture Phase; addEventListener Capture Option; Event Flow

- Event capturing means the event is handled while moving from parent to child.

- It runs before the normal bubbling phase.

- We enable it by passing true or { capture: true } .

- It is less common than bubbling but useful for early event handling.

- Real example: track clicks before child elements handle them.

```
document.addEventListener(
  "click",
  () => {
    // Runs during the capture phase
    console.log("Captured first");
  },
  true
);
```

## Event Delegation; Delegated Event Handling; Dynamic List Items; Parent Event Listener

- Event delegation means adding one event listener to a parent instead of many children.

- It works because events bubble from child to parent.

- It is useful for dynamic lists where items are added later.

- It improves performance by reducing the number of event listeners.

- Real example: handle clicks for all todo items using one parent listener.

```
list.addEventListener("click", (event) => {
  // Check if the clicked item is a button
  if (event.target.matches("button")) {
    console.log("Button clicked");
  }
});
```

## event.target vs event.currentTarget; Event Target; Current Target; Clicked Element

- event.target | event.currentTarget

- Actual clicked element | Element where listener is attached
- Can be a child element | Always the listener element
- Useful in delegation | Useful to know handler owner

- event.target tells which element actually triggered the event.

- event.currentTarget tells where the event listener is attached.

- They can be different when clicking inside nested elements.

- This difference is important in event delegation.

- Real example: clicking a button inside a card gives button as target and card as currentTarget.

```
card.addEventListener("click", (event) => {
  // target = clicked child, currentTarget = card
  console.log(event.target, event.currentTarget);
});
```

## preventDefault vs stopPropagation; Prevent Default; Stop Propagation; Event Methods

- preventDefault() | stopPropagation()

- Stops browser default action | Stops event moving to parents
- Used for forms and links | Used for nested click handlers
- Does not stop bubbling | Does not stop default action

- preventDefault() stops the browser's default behavior.

- stopPropagation() stops the event from reaching parent elements.

- They solve different problems.

- Forms and links often use preventDefault() .

- Modals and dropdowns often use stopPropagation() .

```
form.addEventListener("submit", (event) => {
  // Stop page refresh on form submit
  event.preventDefault();
});
```

## Reflow vs Repaint; Browser Rendering Pipeline; Layout vs Paint; UI Performance

- Reflow | Repaint

- Browser recalculates layout | Browser redraws visual styles
- More expensive | Usually cheaper
- Happens after size/position changes | Happens after color/background changes

- Reflow happens when layout changes, like width, height, or position.

- Repaint happens when visual style changes, like color or background.

- Reflow is usually more expensive because it affects layout calculation.

- Too many layout changes can make UI slow.

- Real example: changing many element sizes one by one can hurt performance.

```
// Changing width can cause reflow because layout changes
box.style.width = "300px";

// Changing color usually causes repaint only
box.style.color = "red";
```

## DOMContentLoaded vs Load Event; Page Load Events; DOM Ready; Window Load

- DOMContentLoaded | load

- Runs when HTML is parsed | Runs after all assets load
- Does not wait for images | Waits for images, CSS, fonts
- Good for DOM setup | Good for full page asset checks

- DOMContentLoaded runs when the HTML document is ready.

- load runs after images, styles, and other assets are fully loaded.

- Use DOMContentLoaded when you only need DOM elements.

- Use load when you need images or full assets ready.

- Real example: attach button events on DOMContentLoaded .

```
document.addEventListener("DOMContentLoaded", () => {
  // DOM elements are ready here
  console.log("DOM ready");
});
```

## BOM; Browser Object Model; Browser APIs; Window Object

- BOM gives JavaScript access to browser features outside the webpage content.

- It includes window , location , history , navigator , and screen .

- It helps control browser-level actions like redirect and history.

- BOM is provided by the browser, not by core JavaScript.

- Real example: redirect a user using window.location .

```
// Redirect user to another page
window.location.href = "/login";
```

## Window vs Document; Browser Window; HTML Document; DOM Root

- window | document

- Represents browser tab/window | Represents the HTML page
- Has browser APIs | Has DOM elements
- Example: location, history | Example: querySelector, body

- window is the top-level browser object.

- document is the webpage loaded inside the window.

- Use window for browser-level features.

- Use document for reading or changing page elements.

- Real example: window.location changes URL, document.querySelector() selects HTML.

```
// Browser URL
console.log(window.location.href);

// HTML page title
console.log(document.title);
```

## requestAnimationFrame; rAF; JavaScript Animation; Smooth Animation; Browser Paint

- requestAnimationFrame() runs code before the browser repaints the screen.

- It is better for smooth animations than setInterval() .

- The browser can pause or optimize it when the tab is inactive.

- It helps avoid unnecessary animation work.

- Real example: move a box smoothly across the screen.

```
function moveBox() {
  // Run animation code before next screen paint
  box.style.left = box.offsetLeft + 1 + "px";

  requestAnimationFrame(moveBox);
}

requestAnimationFrame(moveBox);
```

## Remove Event Listeners; Event Listener Cleanup; Memory Leak From Listeners; removeEventListener

- Event listeners should be removed when they are no longer needed.

- This helps avoid memory leaks and duplicate event actions.

- removeEventListener() works only with the same function reference.

- Avoid using anonymous functions when you need to remove listeners later.

- Real example: cleanup resize listeners when a component/page is removed.

```
function handleResize() {
  // Runs when browser window size changes
  console.log(window.innerWidth);
}

window.addEventListener("resize", handleResize);
window.removeEventListener("resize", handleResize);
```

## DOM Methods To Find Elements; querySelector vs getElementById; Select HTML Elements

- getElementById() selects one element by ID.

- querySelector() selects the first matching CSS selector.

- querySelectorAll() selects all matching elements.

- getElementsByClassName() selects elements by class name.

- In modern code, querySelector() is commonly used because it supports CSS selectors.

```
// Select by id
const title = document.getElementById("title");

// Select using CSS selector
const button = document.querySelector(".btn");
```

## Change Style Of HTML Element; DOM Style Manipulation; element.style; Dynamic CSS

- We can change element styles using the style property.

- JavaScript style names use camelCase like backgroundColor .

- It is useful for small dynamic style changes.

- For bigger style changes, adding/removing CSS classes is cleaner.

- Real example: highlight an input when validation fails.

```
// Change text color directly using JavaScript
message.style.color = "red";

// Add a class for larger styling changes
message.classList.add("error");
```

## innerHTML vs innerText vs textContent; DOM Text Content; HTML Injection

- innerHTML | innerText | textContent

- Reads/writes HTML | Reads visible text | Reads all text
- Can create security risk | Depends on visible layout | Fast and simple
- Parses HTML tags | Ignores hidden text | Includes hidden text

- innerHTML can insert HTML, but it can be unsafe with user input.

- innerText returns only visible text.

- textContent returns all text inside an element.

- Prefer textContent when inserting plain text.

- Real example: show a user's name safely using textContent .

```
// Safer for plain text because it does not parse HTML
message.textContent = userName;
```

## Attributes vs Properties; HTML Attribute; DOM Property; DOM Values

- Attribute | Property

- Written in HTML | Available in DOM object
- Initial value | Current live value
- Example: value="" | Example: input.value

- Attributes are values written in the HTML markup.

- Properties are live values available on DOM objects.

- For form inputs, the property usually shows the current value.

- getAttribute() reads the HTML attribute.

- Real example: input.value changes when the user types.

```
// Reads current input value typed by the user
console.log(input.value);

// Reads the original HTML attribute value
console.log(input.getAttribute("value"));
```

## Shadow DOM vs Virtual DOM; Shadow DOM; Virtual DOM; Web Components vs React

- Shadow DOM | Virtual DOM

- Browser feature | React concept
- Encapsulates styles and markup | Helps compare UI changes
- Used in Web Components | Used by React rendering

- Shadow DOM hides component markup and styles from the main page.

- Virtual DOM is React's in-memory copy of the UI.

- Shadow DOM is about encapsulation.

- Virtual DOM is about efficient UI updates.

- Real example: Web Components use Shadow DOM, React uses Virtual DOM.

```
// Create a shadow root for style isolation
const shadow = element.attachShadow({ mode: "open" });
```

## Submit Form Using JavaScript; Form Submission; FormData API; Programmatic Submit

- JavaScript can handle form submission without full page reload.

- preventDefault() stops the browser's default form submit behavior.

- FormData helps collect form values easily.

- This is commonly used for login, signup, and contact forms.

- Real example: send form data to an API.

```
form.addEventListener("submit", (event) => {
  // Stop the page from refreshing
  event.preventDefault();

  // Collect all form fields
  const data = new FormData(form);
});
```

## History API; Browser History; pushState replaceState; SPA Routing; Single Page Application

- History API lets JavaScript change the URL without reloading the page.

- pushState() adds a new history entry.

- replaceState() updates the current history entry.

- It is used by SPA routers like React Router.

- Real example: move from /home to /profile without full page reload.

```
// Change URL without reloading the page
history.pushState(null, "", "/profile");
```

## Redirect Page In JavaScript; window.location; Navigate Programmatically; Page Navigation

- window.location is used to navigate or redirect the browser.

- location.href moves to a new page and keeps browser history.

- location.replace() redirects without keeping the current page in history.

- This is useful after login, logout, or permission checks.

- Real example: send unauthenticated users to the login page.

```
// Redirect user to login page
window.location.href = "/login";
```

## document.readyState; Page Load Status; DOM Loading State; Run Code On Page Load

- document.readyState tells the current loading state of the page.

- It can be loading , interactive , or complete .

- interactive means the DOM is ready.

- complete means all page resources are loaded.

- It helps decide whether to run code now or wait.

```
if (document.readyState === "loading") {
  // Wait until DOM is ready
  document.addEventListener("DOMContentLoaded", init);
} else {
  // DOM is already ready
  init();
}
```

## defer vs async Script; Script Loading Order; JavaScript Loading; HTML Script Attribute

- defer | async

- Downloads script while HTML parses | Downloads script while HTML parses
- Runs after HTML parsing | Runs as soon as downloaded
- Keeps script order | Order is not guaranteed
- Good for app scripts | Good for independent scripts

- defer is best for scripts that need the DOM.

- async is best for independent scripts like analytics.

- Both avoid blocking HTML parsing while downloading.

- defer keeps script execution order.

- Real example: use defer for main app JavaScript.

```
<!-- Runs after HTML parsing -->
<script src="app.js" defer></script>

<!-- Runs when downloaded -->
<script src="analytics.js" async></script>
```

## Custom HTML Element; Web Components; customElements.define; Reusable Browser Component

- Custom elements let us create our own HTML tags.

- They are part of Web Components.

- customElements.define() registers the new element.

- They can be reused like normal HTML elements.

- Real example: create a reusable  component.

```
class UserCard extends HTMLElement {
  connectedCallback() {
    // Runs when this element is added to the page
    this.innerHTML = "<h3>User Card</h3>";
  }
}

customElements.define("user-card", UserCard);
```

## Memory Leaks In JavaScript; Common Memory Leak Causes; Avoid Memory Leaks; Cleanup

- A memory leak happens when unused data is still kept in memory.

- Common causes are unremoved event listeners, timers, and global references.

- Memory leaks can make the page slow over time.

- Cleanup listeners, intervals, and large unused objects.

- Real example: remove interval timers when leaving a page.

```
const timerId = setInterval(() => {
  // Runs repeatedly every second
  console.log("Running");
}, 1000);

// Stop timer when it is no longer needed
clearInterval(timerId);
```

## Capture Browser Back Button; popstate Event; Back Navigation; SPA Back Button

- popstate runs when the user moves through browser history.

- It is commonly used in single page applications.

- It helps detect browser back and forward button actions.

- It does not run for every pushState() call automatically.

- Real example: update UI when user clicks browser back button.

```
window.addEventListener("popstate", () => {
  // Runs when user clicks back or forward
  console.log("History changed");
});
```

## Native vs Host vs User Objects; JavaScript Object Types; Browser Objects; Custom Objects

- Native Objects | Host Objects | User Objects

- Built into JavaScript | Provided by environment | Created by developer
- Example: Array, Date | Example: window, document | Example: user, product
- Available in JS language | Depends on browser/runtime | Depends on our code

- Native objects come from JavaScript itself.

- Host objects come from the environment like browser or Node.js.

- User objects are created by developers.

- This helps separate core JavaScript from browser-specific APIs.

- Real example: Array is native, document is host, and user is user-created.

```
// Native object
const list = [];

// Host object
console.log(document.title);

// User-created object
const user = { name: "John" };
```

Previous

Javascript Closures Scope and Functions

Up next

Javascript Async and Event Loop

© Copyright 2026. All rights reserved.

Designed & Developed By Durga Prasad - Mob: 9030505066

---

# Javascript Async and Event Loop

Source: https://full-stack-interview-ecru.vercel.app/fullstack-dev/javascript-async-and-event-loop

## Event Loop; JavaScript Event Loop; Node.js Event Loop; Async JavaScript

- The event loop lets JavaScript handle async work without blocking the page.

- JavaScript runs normal code first because it has only one main call stack.

- Async callbacks wait outside and run only when the call stack is empty.

- Real example: an API call can load data while the user still clicks buttons.

- Important point: promises usually run before setTimeout .

```
console.log('start')

setTimeout(() => console.log('timer'), 0)

Promise.resolve().then(() => console.log('promise'))

console.log('end')

// Output: start, end, promise, timer
```

## Call Stack; Execution Stack; JavaScript Stack; Function Call Stack

- The call stack is the place where JavaScript keeps track of running functions.

- When a function starts, it is added to the stack.

- When a function finishes, it is removed from the stack.

- It follows LIFO, which means last in, first out.

- Too many nested calls can cause a stack overflow error.

```
function greet() {
  return 'Hello'
}

greet()
```

## Event Queue; Task Queue; Macrotask Queue; Callback Queue

- The event queue stores callbacks that are ready to run later.

- It is used for tasks like setTimeout , events, and some browser APIs.

- A callback from the queue runs only after the call stack becomes empty.

- Real example: a button click handler waits in the queue until current code finishes.

- The event loop moves tasks from the queue to the call stack.

```
setTimeout(() => {
  console.log('Runs later')
}, 1000)
```

## Microtask Queue vs Macrotask Queue; Promise vs setTimeout; Task Order; Event Loop Priority

- Microtask Queue | Macrotask Queue

- Has higher priority | Has lower priority
- Runs before macrotasks | Runs after microtasks
- Example: Promise.then() | Example: setTimeout()
- Runs after current code | Runs in the next task cycle

- Promises go into the microtask queue.

- Timers usually go into the macrotask queue.

- That is why promise callbacks run before setTimeout .

## Tasks in Event Loop; Event Loop Execution Order; Async Order; JavaScript Runtime Flow

- First, JavaScript runs all synchronous code.

- Then it clears the microtask queue.

- After that, it runs one macrotask from the task queue.

- This cycle keeps repeating while the app is running.

- This order helps JavaScript stay responsive.

```
console.log('A')

Promise.resolve().then(() => console.log('B'))

setTimeout(() => console.log('C'), 0)

// Output: A, B, C
```

## setTimeout; setInterval; clearTimeout; clearInterval; JavaScript Timers

- setTimeout runs code once after a delay.

- setInterval runs code again and again after a fixed delay.

- clearTimeout stops a timeout before it runs.

- clearInterval stops a repeated interval.

- Real example: use setInterval for a countdown timer.

```
const timerId = setTimeout(() => {
  console.log('Hello after 1 second')
}, 1000)

clearTimeout(timerId)
```

## setTimeout vs setImmediate vs process.nextTick; Node.js Timers; Timer Difference; nextTick

- setTimeout | setImmediate | process.nextTick

- Runs after timer delay | Runs after current event loop phase | Runs before other queued tasks
- Available in browser and Node.js | Mainly used in Node.js | Only used in Node.js
- Common for delays | Common after I/O work | Common for urgent callbacks

- process.nextTick has very high priority in Node.js.

- setImmediate is useful when code should run after current work.

- setTimeout is best when we need a delay.

## Callback Hell; Pyramid of Doom; Nested Callbacks; Avoid Callback Hell

- Callback hell means too many callbacks are nested inside each other.

- It makes code hard to read, debug, and maintain.

- We can avoid it using promises or async/await .

- Real example: login, fetch profile, and load orders can become deeply nested.

- Important point: flatter code is easier to understand.

```
loginUser()
  .then(getProfile)
  .then(getOrders)
  .catch(handleError)
```

## Promise States; Pending Fulfilled Rejected; JavaScript Promise; Promise Lifecycle

- A promise represents a value that may be available now, later, or never.

- pending means the promise is still running.

- fulfilled means the promise completed successfully.

- rejected means the promise failed with an error.

- Promises help handle async code in a cleaner way.

```
const promise = Promise.resolve('Done')

promise.then((result) => {
  console.log(result)
})
```

## Promise.all; Promise.race; Promise.allSettled; Promise Combinators; Multiple Promises

- Method | Meaning

- Promise.all() | Waits for all promises to succeed
- Promise.race() | Returns the first settled promise
- Promise.allSettled() | Waits for all promises, success or fail

- Promise.all() is useful when all API results are required.

- Promise.race() is useful when the fastest response matters.

- Promise.allSettled() is useful when we want every result.

- Real example: load user, orders, and notifications together.

## Error Handling in Promises; Promise catch; Unhandled Promise Rejection; Promise Error

- Promise errors are handled using .catch() .

- .catch() runs when the promise is rejected.

- Without error handling, we may get an unhandled rejection.

- Error handling helps show proper messages to users.

- Real example: show “Something went wrong” when an API call fails.

```
fetch('/api/user')
  .then((res) => res.json())
  .catch((error) => console.log(error.message))
```

## Fetch API; HTTP Request; Fetch vs XMLHttpRequest; API Call

- fetch is used to make HTTP requests from JavaScript.

- It is commonly used to get or send data to a backend API.

- It returns a promise, so we can use .then() or async/await .

- fetch is cleaner and easier than older XMLHttpRequest .

- Real example: load products from an e-commerce API.

```
const response = await fetch('/api/products')
const products = await response.json()

console.log(products)
```

## Cancel Fetch Request; AbortController; Cancel API Request; Fetch Cancellation

- AbortController is used to cancel a running fetch request.

- It is useful when the user leaves a page or changes a search input.

- Cancelling unused requests improves performance.

- In React, it helps avoid updating old or unmounted components.

- Real example: cancel old search API calls when the user types again.

```
const controller = new AbortController()

fetch('/api/search', {
  signal: controller.signal,
})

controller.abort()
```

## AJAX; Asynchronous JavaScript and XML; Async Request; Web API Request

- AJAX means loading data from a server without refreshing the page.

- It makes web apps feel faster and smoother.

- Today, AJAX is usually done using fetch or libraries like Axios.

- Real example: search suggestions appear while typing.

- Even though XML is in the name, JSON is mostly used today.

## Async Function; async await; Asynchronous Function; Clean Promise Code

- An async function always returns a promise.

- await pauses inside the async function until the promise finishes.

- It makes async code look like normal step-by-step code.

- We should use try...catch to handle errors.

- Real example: fetch user details before showing a profile page.

```
async function getUser() {
  const response = await fetch('/api/user')
  return response.json()
}
```

## Web Workers; Dedicated Worker; Shared Worker; Background Thread

- Web workers run JavaScript in the background.

- They help perform heavy work without freezing the UI.

- A worker cannot directly access the DOM.

- Data is shared using messages between the page and the worker.

- Real example: process a large file while the page stays usable.

## Service Worker; PWA; Offline Support; Service Worker Lifecycle

- A service worker runs in the background between the browser and network.

- It is mainly used for offline support, caching, and push notifications.

- It helps build Progressive Web Apps, also called PWAs.

- It has lifecycle steps like install, activate, and fetch.

- Real example: a website can open even when the internet is slow.

## localStorage vs sessionStorage; Web Storage; Browser Storage Difference

- localStorage | sessionStorage

- Stores data without expiry | Stores data for one tab session
- Data remains after browser close | Data clears when tab closes
- Shared across tabs of same site | Only available in the same tab
- Good for theme settings | Good for temporary form data

- Both store data as strings in the browser.

- Both should not store passwords or sensitive tokens.

- They are useful for small client-side data.

## Cookies; Cookie Options; Delete Cookie; Browser Cookie

- Cookies store small data in the browser.

- They are often used for sessions, login, and tracking.

- Cookies can have options like expiry, path, domain, and secure.

- To delete a cookie, set its expiry date to the past.

- Important point: secure cookies are better for authentication.

```
document.cookie = 'theme=dark; max-age=3600'
```

## Cookies vs localStorage vs sessionStorage; Storage Types; Browser Storage Comparison

- Cookies | localStorage | sessionStorage

- Sent with HTTP requests | Not sent automatically | Not sent automatically
- Small storage size | Larger than cookies | Larger than cookies
- Can have expiry | No automatic expiry | Clears when tab closes
- Good for sessions | Good for preferences | Good for temporary data

- Cookies are commonly used for authentication sessions.

- localStorage is useful for non-sensitive saved settings.

- sessionStorage is useful for short-lived tab data.

## Web Storage API; localStorage Methods; setItem getItem; Browser Data Storage

- Web Storage API lets us store small data in the browser.

- Main methods are setItem , getItem , removeItem , and clear .

- Values are stored as strings.

- For objects, we use JSON.stringify() and JSON.parse() .

- Real example: save dark mode preference.

```
localStorage.setItem('theme', 'dark')

const theme = localStorage.getItem('theme')
```

## Storage Event; Sync Tabs; localStorage Event; Browser Tab Communication

- The storage event runs when storage changes in another tab.

- It helps sync data between tabs of the same website.

- It does not usually run in the same tab that made the change.

- Real example: logout from all open tabs when one tab logs out.

- It is useful for simple cross-tab communication.

```
window.addEventListener('storage', (event) => {
  console.log(event.key)
})
```

## postMessage; Cross-Origin Messaging; Window Messaging; Secure Messaging

- postMessage lets different windows or iframes communicate.

- It is useful when pages are from different origins.

- We should always check the sender origin for security.

- It helps avoid unsafe direct access between different sites.

- Real example: payment iframe sends payment status to the main page.

```
window.addEventListener('message', (event) => {
  if (event.origin !== 'https://trusted.com') return
  console.log(event.data)
})
```

## Server-Sent Events; SSE; EventSource; One-Way Server Push

- Server-Sent Events let the server push updates to the browser.

- It is one-way communication from server to client.

- The browser uses EventSource to listen for updates.

- It is simpler than WebSockets for live updates.

- Real example: live notifications or order status updates.

```
const events = new EventSource('/api/events')

events.onmessage = (event) => {
  console.log(event.data)
}
```

## IndexedDB; Client-Side Database; Browser Database; Offline Data

- IndexedDB is a browser database for storing larger structured data.

- It is better than localStorage for big or complex data.

- It works asynchronously, so it does not block the page.

- It is useful for offline-first web apps.

- Real example: store notes or drafts locally before syncing.

## Observable; RxJS Observable; Data Stream; Reactive Programming

- An observable represents a stream of values over time.

- It can send multiple values, not just one result.

- Observables are useful for events, live data, and user input.

- RxJS provides tools to create and manage observables.

- Real example: search input changes can be handled as a data stream.

## Promises vs Observables; Promise Difference; Observable Difference; Async Data

- Promise | Observable

- Handles one future value | Handles many values over time
- Starts immediately | Can start when subscribed
- Cannot be cancelled easily | Can be unsubscribed
- Common in fetch | Common in RxJS streams

- Promises are simple and good for one-time async work.

- Observables are better for repeated or continuous data.

- Real example: API response uses promise, live search can use observable.

## Node.js Single Threaded; Node.js Event Loop; Is Node Single Threaded; Node Runtime

- Node.js runs JavaScript code mainly on a single thread.

- It uses the event loop to handle many async tasks.

- Some heavy tasks can use background threads internally.

- This makes Node.js good for I/O work like APIs and file operations.

- CPU-heavy work can still block Node.js if not handled carefully.

## Heap vs Stack; JavaScript Memory; Stack Memory; Heap Memory

- Stack | Heap

- Stores function calls and simple values | Stores objects and complex data
- Fast and organized | More flexible storage
- Cleared when function finishes | Cleared later by garbage collection
- Example: local variable | Example: object or array

- The stack helps JavaScript track execution.

- The heap stores data that may live longer.

- Garbage collection removes unused heap data automatically.

## queueMicrotask; JavaScript Microtask; Schedule Microtask; Microtask Queue

- queueMicrotask manually adds a callback to the microtask queue.

- It runs after current synchronous code finishes.

- It runs before macrotasks like setTimeout .

- It is useful when we want code to run very soon but not immediately.

- Important point: too many microtasks can delay timers.

```
console.log('start')

queueMicrotask(() => console.log('microtask'))

console.log('end')
```

## Make Object Iterable; Iterable Protocol; Symbol.iterator; Custom Iterator

- An iterable object can be used in for...of .

- JavaScript checks for a Symbol.iterator method.

- Arrays, strings, maps, and sets are already iterable.

- We can make custom objects iterable by adding Symbol.iterator .

- Real example: loop through a custom collection like a list of users.

```
const users = {
  names: ['John', 'Sara'],
  [Symbol.iterator]() {
    return this.names[Symbol.iterator]()
  },
}

for (const name of users) console.log(name)
```

Previous

Javascript Dom and Events

Up next

Javascript Objects and Prototypes

© Copyright 2026. All rights reserved.

Designed & Developed By Durga Prasad - Mob: 9030505066

---

# Javascript Objects and Prototypes

Source: https://full-stack-interview-ecru.vercel.app/fullstack-dev/javascript-objects-and-prototypes

## Prototype Chain; Prototypal Inheritance; Object Inheritance; JavaScript Prototype Lookup

- The prototype chain lets one object reuse properties and methods from another object.

- JavaScript first checks the object itself, then checks its prototype if the property is not found.

- This lookup continues until JavaScript finds the value or reaches null .

- It helps JavaScript share methods instead of copying them into every object.

- Real example: arrays can use methods like map() because they inherit from Array.prototype .

```
const user = { name: "Alice" }

// toString() is not inside user, but it comes from Object.prototype
console.log(user.toString())
```

## Object Prototype; Prototype Of Object; Prototype Property; Function Prototype

- Every object has an internal prototype that works like a parent object.

- We can check an object's prototype using Object.getPrototypeOf() .

- A function's prototype property is used when creating objects with new .

- The object prototype and function prototype property are related but not the same thing.

- This is important for understanding class and constructor-based inheritance.

```
function User(name) {
  this.name = name
}

// Objects created with new User() will use User.prototype
const user = new User("Alice")

console.log(Object.getPrototypeOf(user) === User.prototype)
```

## proto vs Prototype; Proto vs Prototype; Internal Prototype; Function Prototype

- __proto__ | prototype

- Belongs to objects | Belongs to functions
- Points to the parent object | Used to create new object prototypes
- Not preferred in modern code | Common in constructors and classes

- __proto__ shows the internal prototype of an object.

- prototype is used by constructor functions to share methods with instances.

- Prefer Object.getPrototypeOf() instead of using __proto__ .

- This is a common interview confusion topic.

```
function Person(name) {
  this.name = name
}

const user = new Person("John")

// user inherits from Person.prototype
console.log(Object.getPrototypeOf(user) === Person.prototype)
```

## Object.create; Create Object With Prototype; Object.create(null); Custom Prototype

- Object.create() creates a new object with a given prototype.

- It is useful when we want direct control over object inheritance.

- Object.create(null) creates an object with no prototype.

- Objects without prototype do not inherit methods like toString() .

- Real example: it can be used for clean dictionary-like objects.

```
const parent = {
  greet() {
    return "Hello"
  }
}

// child gets parent as its prototype
const child = Object.create(parent)

console.log(child.greet())
```

## New Keyword; New Operator; Constructor Invocation; Object Creation Steps

- The new keyword creates a new object from a constructor function or class.

- It connects the new object to the constructor's prototype.

- It runs the constructor function with this pointing to the new object.

- It returns the new object automatically.

- Real example: new Date() creates a new date object.

```
function User(name) {
  // this points to the new object
  this.name = name
}

const user = new User("Alice")

console.log(user.name)
```

## Constructor Function; Factory Function; Constructor vs Factory; Object Creation Pattern

- Constructor Function | Factory Function

- Uses new keyword | Returns object directly
- Uses this | Usually does not need this
- Shares methods using prototype | Can create private data easily

- A constructor function creates objects using the new keyword.

- A factory function creates and returns an object directly.

- Constructor functions are closer to class-style object creation.

- Factory functions are simple and flexible.

- In modern JavaScript, classes are often preferred for constructor-style code.

```
function User(name) {
  // Constructor function needs new
  this.name = name
}

function createUser(name) {
  // Factory function returns object directly
  return { name }
}
```

## Prototype vs Classical Inheritance; Prototypal Inheritance; Class Based Inheritance

- Prototypal Inheritance | Classical Inheritance

- Objects inherit from objects | Classes create objects
- Native style in JavaScript | Common in languages like Java
- More flexible | More structured

- JavaScript uses prototypal inheritance internally.

- Objects can directly inherit from other objects.

- Classes in JavaScript are mainly cleaner syntax over prototypes.

- This helps us reuse methods without duplicating code.

- Real example: class methods are stored on the prototype.

```
class User {
  sayHi() {
    return "Hi"
  }
}

const user = new User()

// sayHi is shared through User.prototype
console.log(user.sayHi())
```

## Object.freeze vs Object.seal; Freeze Object; Seal Object; Prevent Object Changes

- Object.freeze() | Object.seal()

- Cannot add properties | Cannot add properties
- Cannot delete properties | Cannot delete properties
- Cannot change existing values | Can change existing values

- Object.freeze() makes an object fully locked.

- Object.seal() allows changing existing values but blocks adding or deleting properties.

- Both work only on the first level of the object.

- These are useful when we want to protect object structure.

- Real example: freeze configuration values that should not change.

```
const config = Object.freeze({
  apiUrl: "/api"
})

// This will not change the frozen object
config.apiUrl = "/new-api"
```

## Object.assign; Merge Objects; Copy Properties; Shallow Copy Object

- Object.assign() copies properties from one or more objects into a target object.

- It is commonly used for merging objects.

- It creates a shallow copy, not a deep copy.

- If the same key exists, the later object value wins.

- In modern code, spread syntax is often cleaner.

```
const user = { name: "Alice" }
const role = { role: "admin" }

// Copies properties into a new object
const result = Object.assign({}, user, role)

console.log(result)
```

## Object.is; Same Value Equality; Object.is vs Strict Equality; Equality Check

- Object.is() compares two values almost like === .

- It handles special cases like NaN better than === .

- Object.is(NaN, NaN) returns true .

- Object.is(0, -0) returns false .

- It is useful when exact JavaScript value comparison is needed.

```
console.log(NaN === NaN) // false
console.log(Object.is(NaN, NaN)) // true
```

## Getters and Setters; JavaScript Accessors; get and set; Computed Object Properties

- Getters let us read a value like a normal property but run logic behind it.

- Setters let us control how a value is updated.

- They are useful for validation, formatting, or calculated values.

- They make object usage look clean from outside.

- Real example: show a user's full name from first and last name.

```
const user = {
  firstName: "John",
  lastName: "Doe",

  // Getter returns calculated value
  get fullName() {
    return `${this.firstName} ${this.lastName}`
  }
}

console.log(user.fullName)
```

## Proxy; JavaScript Proxy Object; Intercept Object Operations; Proxy Use Cases

- A Proxy lets us control how an object behaves when reading, writing, or deleting properties.

- It can be used for validation, logging, access control, or default values.

- The original object is called the target.

- The handler decides what should happen for each operation.

- Real example: validate user age before saving it.

```
const user = { age: 20 }

const proxyUser = new Proxy(user, {
  set(target, key, value) {
    // Validate age before assigning
    if (key === "age" && value < 0) return false

    target[key] = value
    return true
  }
})

proxyUser.age = 25
```

## WeakMap; WeakMap vs Map; Private Data; Object Keys

- WeakMap | Map

- Keys must be objects | Keys can be any value
- Does not prevent garbage collection | Keeps strong references
- Not directly iterable | Iterable

- WeakMap stores key-value pairs where keys must be objects.

- It is useful for storing private data related to objects.

- If the object key is removed elsewhere, it can be garbage collected.

- WeakMap is not iterable, so we cannot loop through it directly.

- Real example: store private details of class instances.

```
const privateData = new WeakMap()

class User {
  constructor(name) {
    // Store private data outside the object
    privateData.set(this, { name })
  }
}
```

## WeakSet; WeakSet vs Set; Store Objects Weakly; Object Collection

- WeakSet | Set

- Stores only objects | Stores any value
- Not iterable | Iterable
- Allows garbage collection | Keeps strong references

- WeakSet stores objects only.

- It is useful when we only need to track whether an object exists.

- It does not stop objects from being garbage collected.

- We cannot loop through a WeakSet .

- Real example: track objects that were already processed.

```
const processed = new WeakSet()
const user = { id: 1 }

// Mark this object as processed
processed.add(user)

console.log(processed.has(user))
```

## Map vs Object; JavaScript Map; Object Key Value Store; When To Use Map

- Map | Object

- Better for dynamic keys | Better for fixed data shape
- Keys can be any type | Keys are mostly strings or symbols
- Has useful methods like set() and get() | Uses dot or bracket access

- Use Map when keys are dynamic or not always strings.

- Use objects for normal structured data like user or product details.

- Map keeps insertion order clearly.

- Map is easier when frequently adding and removing entries.

- Real example: use Map for caching API responses.

```
const cache = new Map()

// Store value with a key
cache.set("user-1", { name: "Alice" })

console.log(cache.get("user-1"))
```

## Set Object; Set vs Array; Unique Values; Remove Duplicates

- A Set stores only unique values.

- It automatically removes duplicates.

- It is useful for tags, selected IDs, and unique user roles.

- Use arrays when order and duplicates matter.

- Real example: remove duplicate categories from product data.

```
const tags = ["js", "react", "js"]

// Set removes duplicate values
const uniqueTags = [...new Set(tags)]

console.log(uniqueTags)
```

## Shallow Copy vs Deep Copy; structuredClone; Copy Object; Clone Nested Object

- Shallow Copy | Deep Copy

- Copies only first level | Copies nested levels also
- Nested objects are still shared | Nested objects are separate
- Faster and common | Safer for nested data

- A shallow copy copies only the top-level values.

- A deep copy also copies nested objects.

- Spread syntax creates a shallow copy.

- structuredClone() can create a deep copy for many normal objects.

- Real example: deep copy is useful when updating nested state safely.

```
const user = {
  name: "Alice",
  address: { city: "Dubai" }
}

// Deep copy creates a separate nested object also
const copy = structuredClone(user)

copy.address.city = "Abu Dhabi"
console.log(user.address.city)
```

## Object.keys Object.values Object.entries; Enumerate Properties; Loop Object; Object Methods

- Object.keys() returns all property names.

- Object.values() returns all property values.

- Object.entries() returns key-value pairs.

- These methods are useful for looping through objects.

- Real example: show all settings from a settings object.

```
const user = { name: "Alice", role: "admin" }

// Loop through key and value together
Object.entries(user).forEach(([key, value]) => {
  console.log(key, value)
})
```

## Check Property Exists; hasOwnProperty; in Operator; Property Check

- in Operator | hasOwnProperty()

- Checks own and inherited properties | Checks only own properties
- Includes prototype chain | Does not check prototype chain

- Use in when inherited properties also matter.

- Use hasOwnProperty() when only direct object properties should count.

- Object.hasOwn() is the modern cleaner option.

- This helps avoid bugs when objects inherit properties.

- Real example: check if API response directly has a required field.

```
const user = { name: "Alice" }

// Checks only direct property
console.log(Object.hasOwn(user, "name"))

// Checks direct or inherited property
console.log("toString" in user)
```

## Ways To Create Objects; Object Creation Patterns; Object Literal; Constructor Class Factory

- Object literals are the simplest way to create objects.

- Constructor functions create objects using new .

- Classes give cleaner syntax for constructor-style objects.

- Factory functions return objects directly.

- Object.create() creates an object with a selected prototype.

```
// Object literal
const user = { name: "Alice" }

// Factory function
function createUser(name) {
  return { name }
}
```

## JSON; JSON.stringify; JSON.parse; JSON Syntax Rules; JavaScript Object Notation

- JSON is a text format used to send data between client and server.

- JSON.stringify() converts a JavaScript object into a JSON string.

- JSON.parse() converts a JSON string back into a JavaScript object.

- JSON keys and string values must use double quotes.

- Real example: APIs commonly send and receive data in JSON format.

```
const user = { name: "Alice" }

// Convert object to JSON string
const json = JSON.stringify(user)

// Convert JSON string back to object
const data = JSON.parse(json)
```

## Extend Classes; ES6 Inheritance; super Keyword; Parent Class Constructor

- extends lets one class inherit from another class.

- The child class can reuse parent methods.

- super() calls the parent constructor.

- In a child constructor, super() must be called before using this .

- Real example: AdminUser can extend a basic User class.

```
class User {
  constructor(name) {
    this.name = name
  }
}

class AdminUser extends User {
  constructor(name, role) {
    // Call parent constructor first
    super(name)

    this.role = role
  }
}
```

## Constructor Method; Class Constructor; One Constructor Per Class; Initialize Object

- The constructor() method runs automatically when creating an object with new .

- It is used to set initial values.

- A class can have only one constructor method.

- If no constructor is written, JavaScript adds a default one.

- Real example: set user name and role when creating a user object.

```
class User {
  constructor(name, role) {
    // Set initial object values
    this.name = name
    this.role = role
  }
}

const user = new User("Alice", "admin")
```

## Property Descriptors; Object.defineProperty; writable enumerable configurable; Object Property Rules

- Property descriptors control how an object property behaves.

- writable controls whether the value can be changed.

- enumerable controls whether the property appears in loops.

- configurable controls whether the property can be deleted or reconfigured.

- Real example: hide internal values from normal object loops.

```
const user = {}

Object.defineProperty(user, "id", {
  value: 101,
  writable: false, // id cannot be changed
  enumerable: true // id appears in Object.keys()
})

console.log(user.id)
```

## Object.getPrototypeOf; Get Prototype Of Object; proto Alternative; Prototype Lookup

- Object.getPrototypeOf() returns the prototype of an object.

- It is the recommended way to inspect an object's prototype.

- It is better than using __proto__ .

- It helps debug inheritance and method lookup issues.

- Real example: check whether an object was created from a specific class.

```
class User {}

const user = new User()

// Check the prototype of user
console.log(Object.getPrototypeOf(user) === User.prototype)
```

## Delete Operator; Remove Property From Object; Delete Object Key; Object Property Removal

- The delete operator removes a property from an object.

- It works on object properties, not normal variables.

- It returns true when deletion is successful.

- In React state, prefer creating a new object without the property.

- Real example: remove sensitive fields before sending data.

```
const user = {
  name: "Alice",
  password: "secret"
}

// Remove password from object
delete user.password

console.log(user)
```

## Error Object; JavaScript Error Types; Built In Errors; Custom Error

- An Error object gives details about something that went wrong.

- Common error types include TypeError , ReferenceError , and SyntaxError .

- error.message gives the readable error text.

- We can throw custom errors when something invalid happens.

- Real example: throw an error when user data is missing.

```
function getUser(user) {
  if (!user) {
    // Stop the function with a clear error
    throw new Error("User is required")
  }

  return user.name
}
```

## JSON vs Object; JavaScript Object vs JSON; JSON Rules; API Data Format

- JavaScript Object | JSON

- Real JavaScript value | Text data format
- Can contain functions | Cannot contain functions
- Keys can be unquoted | Keys must use double quotes
- Used inside code | Used for data transfer

- JavaScript objects are used directly in code.

- JSON is mainly used to send data between systems.

- JSON supports strings, numbers, booleans, arrays, objects, and null .

- JSON cannot store functions or undefined .

- Real example: APIs send JSON, then JavaScript converts it into an object.

```
const user = { name: "Alice" }

// JSON must be a string
const json = '{ "name": "Alice" }'
```

## Enums In JavaScript; Simulate Enum; Constant Object; Object.freeze Enum

- JavaScript does not have native enums like TypeScript.

- We can simulate enums using a frozen object.

- This helps avoid hardcoded string values in many places.

- It makes code safer and easier to maintain.

- Real example: define fixed user roles like admin, member, and guest.

```
const Roles = Object.freeze({
  ADMIN: "admin",
  MEMBER: "member",
  GUEST: "guest"
})

// Use fixed value from one place
console.log(Roles.ADMIN)
```

## Same Origin Policy; CORS Basics; Cross Origin Requests; Browser Security

- Same-origin policy is a browser security rule.

- It blocks one website from freely reading data from another website.

- CORS allows a server to safely permit selected cross-origin requests.

- This protects users from unsafe websites accessing private data.

- Real example: frontend running on one domain may need CORS to call a backend API.

```
fetch("https://api.example.com/users")
  // Browser checks whether this cross-origin request is allowed
  .then(response => response.json())
```

## Eval; Is Eval Safe; JavaScript eval Function; Security Risk

- eval() runs a string as JavaScript code.

- It is dangerous because unsafe input can execute harmful code.

- It makes code harder to debug and optimize.

- Avoid eval() in real projects.

- Use safer options like normal functions, JSON parsing, or condition checks.

```
const input = "2 + 2"

// Avoid this because it executes code from a string
console.log(eval(input))
```

## Minification; JavaScript Minification; Reduce File Size; Production Optimization

- Minification reduces file size by removing spaces, comments, and shorter variable names.

- Smaller files load faster in the browser.

- It is usually done automatically by build tools.

- Minification is mainly used for production builds.

- Real example: Vite or Webpack minifies JavaScript during build.

```
# Creates optimized production files
npm run build
```

## Object Property Access; Dot Notation vs Bracket Notation; Access Object Keys; Dynamic Property

- Dot Notation | Bracket Notation

- Used for known property names | Used for dynamic property names
- Cleaner and common | Works with variables and special keys
- Example: user.name | Example: user[field]

- Use dot notation when the property name is fixed.

- Use bracket notation when the property name comes from a variable.

- Bracket notation also works for keys with spaces or special characters.

- This is common in forms where field names are dynamic.

- Real example: update form data using the input field name.

```
const user = { name: "Alice" }
const field = "name"

// Access property using variable
console.log(user[field])

// Normal fixed property access
console.log(user.name)
```

Previous

Javascript Async and Event Loop

Up next

Javascript Oop and Design Patterns

© Copyright 2026. All rights reserved.

Designed & Developed By Durga Prasad - Mob: 9030505066

---

# Javascript Oop and Design Patterns

Source: https://full-stack-interview-ecru.vercel.app/fullstack-dev/javascript-oop-and-design-patterns

## OOP Pillars; Four Pillars of OOP; Encapsulation; Inheritance; Polymorphism; Abstraction

- OOP means we group data and actions together inside objects.

- Encapsulation hides internal data and exposes only needed methods.

- Inheritance lets a child class reuse code from a parent class.

- Polymorphism means the same method name can work in different ways.

- Abstraction hides complex logic behind simple methods like push() or map() .

```
class Vehicle {
  move() {
    return 'moving'
  }
}
```

## Class Syntax; ES6 Class; JavaScript Class; Class Blueprint

- A class is a blueprint for creating objects.

- constructor() runs automatically when we create an object using new .

- Methods inside a class are shared by all objects created from it.

- Each object created from a class is called an instance.

- Classes must be defined before we use them.

```
class User {
  constructor(name) {
    this.name = name
  }
}

const user = new User('John')
```

## This Keyword in Classes; This Binding; JavaScript This; Class Method This

- this points to the current object that is using the method.

- In a class, we use this to access object properties and methods.

- this can be lost when we pass a method as a callback.

- Arrow functions can help keep the correct this value.

- this depends on how a function is called.

```
class Button {
  constructor(label) {
    this.label = label
  }

  click() {
    return this.label
  }
}
```

## Inheritance; Extends Keyword; Class Inheritance; Parent Child Class

- Inheritance lets one class reuse code from another class.

- The parent class contains common code.

- The child class can use parent properties and methods.

- The child class can also add its own extra logic.

- We use extends to create inheritance in JavaScript.

```
class Product {
  constructor(name) {
    this.name = name
  }
}

class DigitalProduct extends Product {}
```

## Super Keyword; Super Method; Parent Constructor; JavaScript Super

- super() calls the parent class constructor.

- In a child class constructor, super() must be called before using this .

- super.method() can call a method from the parent class.

- It helps the child class reuse parent logic.

- super is mainly used inside child classes.

```
class User {
  constructor(name) {
    this.name = name
  }
}

class Admin extends User {
  constructor(name, role) {
    super(name)
    this.role = role
  }
}
```

## Static Methods; Static Properties; Static Keyword; Class Utility Method

- static methods belong to the class, not to the object.

- We call static methods directly using the class name.

- Static methods are useful for helper or utility logic.

- They usually do not need object-specific data.

- Example: Math.max() works like a static method.

```
class UserHelper {
  static isAdmin(user) {
    return user.role === 'admin'
  }
}

UserHelper.isAdmin({ role: 'admin' })
```

## Private Fields; Private Class Fields; Hash Field; JavaScript Encapsulation

- Private fields are used to hide data inside a class.

- In JavaScript, private fields start with # .

- Code outside the class cannot directly access private fields.

- They help protect important data from direct changes.

- Example: bank balance should be changed only through methods.

```
class BankAccount {
  #balance = 0

  deposit(amount) {
    this.#balance += amount
  }
}
```

## Getters and Setters; Get Set Accessor; JavaScript Property Accessor

- A getter reads a value like a normal property.

- A setter runs logic when we assign a value.

- They make methods look simple from outside.

- Setters are useful for validation before saving data.

- Example: validate age before storing it in a user profile.

```
class User {
  set age(value) {
    if (value > 0) this._age = value
  }

  get age() {
    return this._age
  }
}
```

## Method Overriding; Polymorphism; Override Parent Method; Same Method Different Logic

- Method overriding means a child class changes a parent method.

- The method name stays the same, but behavior changes.

- JavaScript calls the child method when the object is from the child class.

- It is one common example of polymorphism.

- Real example: email and SMS can both have a send() method.

```
class Notification {
  send() {
    return 'Sending notification'
  }
}

class Email extends Notification {
  send() {
    return 'Sending email'
  }
}
```

## Abstract Class Pattern; Abstract Class JavaScript; Base Class; Required Method

- JavaScript does not have a built-in abstract class keyword.

- We can simulate an abstract class by throwing errors.

- A base class can force child classes to implement required methods.

- This pattern is useful when all child classes must follow the same structure.

- TypeScript supports real abstract classes.

```
class Payment {
  pay() {
    throw new Error('pay() must be implemented')
  }
}
```

## Mixins; JavaScript Mixin Pattern; Reusable Behavior; Object Assign

- A mixin adds reusable methods to a class or object.

- It helps share behavior without using inheritance.

- We can use Object.assign() to copy mixin methods.

- Mixins are useful when one class needs multiple small abilities.

- Example: adding validate() or toJSON() behavior to many classes.

```
const Loggable = {
  log() {
    return 'log message'
  }
}

class User {}
Object.assign(User.prototype, Loggable)
```

## Composition Over Inheritance; Favor Composition; Object Composition; Reusable Behavior

- Composition means building objects by combining small behaviors.

- It is often more flexible than deep inheritance.

- Inheritance is like “is-a”, composition is like “has-a”.

- Composition makes code easier to change and test.

- Real example: a user can have email service, payment service, and notification service.

```
const emailService = {
  sendEmail() {
    return 'email sent'
  }
}

const user = { name: 'John', emailService }
```

## Encapsulation; Data Hiding; Private State; JavaScript Encapsulation

- Encapsulation means an object controls its own data.

- Outside code should not directly change important internal values.

- We expose safe methods like addItem() or removeItem() .

- This keeps data clean and avoids unwanted changes.

- Real example: a cart should update total only through cart methods.

```
class Cart {
  #items = []

  addItem(item) {
    this.#items.push(item)
  }
}
```

## Factory Pattern; Factory Function; Object Factory; Factory vs Class

- A factory function creates and returns an object.

- It does not need the new keyword.

- Factory functions are simple and easy to test.

- They avoid many this binding problems.

- Real example: creating an API client with base URL and token.

```
function createUser(name) {
  return {
    name,
    greet() {
      return 'Hi ' + name
    }
  }
}
```

## Singleton Pattern; Singleton JavaScript; Single Instance; Shared Object

- A singleton allows only one shared instance in the app.

- It is useful for shared config, logger, or database connection.

- In JavaScript, ES modules naturally behave like singletons.

- The same module import gives the same cached object.

- Use singleton carefully because global shared state can be hard to test.

```
const config = {
  apiUrl: 'https://api.example.com'
}

export default config
```

## Observer Pattern; Pub Sub Pattern; Event Emitter; Subscribe Emit

- The observer pattern lets one object notify many listeners.

- Listeners subscribe to an event.

- When the event happens, all subscribed listeners are called.

- This is useful for notifications, dashboards, and real-time updates.

- In Node.js, EventEmitter is a common observer pattern example.

```
const EventEmitter = require('events')
const events = new EventEmitter()

events.on('login', name => console.log(name))
events.emit('login', 'John')
```

## SOLID Principles; Object Oriented Design; Clean Code; OOP Principles

- SOLID is a set of rules for writing clean object-oriented code.

- Single Responsibility means one class should have one main job.

- Open/Closed means add new behavior without changing old code too much.

- Interface Segregation means do not force unused methods.

- Dependency Inversion means depend on flexible abstractions, not fixed classes.

```
class UserRepository {
  save(user) {
    return user
  }
}
```

## Instanceof; Type Checking Objects; Instanceof vs Typeof; JavaScript Type Check

- instanceof | typeof

- Checks object class | Checks basic value type
- Used for objects | Used for primitives
- Example: user instanceof User | Example: typeof name === 'string'

- instanceof checks whether an object was created from a class.

- typeof checks simple types like string, number, boolean, and function.

- For arrays, use Array.isArray() because it is more reliable.

- typeof null returns 'object' , which is a known JavaScript mistake.

Previous

Javascript Objects and Prototypes

Up next

Javascript Es6 and Modern Features

© Copyright 2026. All rights reserved.

Designed & Developed By Durga Prasad - Mob: 9030505066

---

# Javascript Es6 and Modern Features

Source: https://full-stack-interview-ecru.vercel.app/fullstack-dev/javascript-es6-and-modern-features

## ES6 Features; ECMAScript 2015; Modern JavaScript; JavaScript ES6

- ES6 is a major JavaScript update that added many modern features.

- We use ES6 to write cleaner, shorter, and easier code.

- It introduced let , const , arrow functions, classes, modules, and Promises.

- Real example: React and Node.js projects use ES6 features every day.

- ES6 is the base of modern JavaScript development.

```
const name = 'Alice'
let count = 0
const greet = (user) => `Hi ${user}`
```

## let and const; Block Scope; let vs var; ES6 Variables

- let and const are used to declare variables in modern JavaScript.

- They are block-scoped, so they work only inside the nearest {} block.

- let can be reassigned, but const cannot be reassigned.

- var can leak outside blocks, so it may create bugs.

- Prefer const first, then use let only when value changes.

```
let score = 10
score = 20

const appName = 'Shop App'
```

## const Immutability; const vs Object.freeze; Reassignment; Object Mutation

- const stops reassignment of the variable.

- It does not make objects or arrays fully immutable.

- We can still change properties inside a const object.

- Use Object.freeze() when you want to lock an object.

- const protects the variable reference, not the full value.

```
const user = { name: 'John' }
user.name = 'Alex'

// user = {} // Error
```

## Temporal Dead Zone; TDZ; let and const Hoisting; ReferenceError

- Temporal Dead Zone means we cannot use let or const before declaration.

- let and const are hoisted, but they are not initialized early.

- Accessing them before declaration gives a ReferenceError .

- This helps us catch mistakes early.

- Always declare variables before using them.

```
// console.log(age) // ReferenceError
let age = 25
```

## Destructuring Assignment; Object Destructuring; Array Destructuring; Default Values

- Destructuring is used to take values from arrays or objects easily.

- It reduces repeated code and makes data access cleaner.

- Object destructuring uses property names.

- Array destructuring uses positions.

- Real example: React components often destructure props .

```
const user = { name: 'John', age: 25 }
const { name, age } = user

const [first, second] = ['HTML', 'CSS']
```

## Destructuring Default Values; Default Assignment; Missing Property; Fallback Value

- Default values are used when a value is missing or undefined .

- They help avoid unexpected empty values.

- This is useful when API data may not have all fields.

- Real example: show Guest when username is missing.

- Default values make destructuring safer.

```
const user = {}
const { name = 'Guest' } = user
console.log(name)
```

## Swap Variables with Destructuring; Variable Swap; Array Destructuring; ES6 Trick

- Destructuring can swap two variables in one line.

- It avoids using an extra temporary variable.

- JavaScript prepares the right side first and then assigns values.

- This is a clean ES6 feature for simple swaps.

- [a, b] = [b, a] is the common syntax.

```
let a = 1
let b = 2

;[a, b] = [b, a]
```

## Destructuring Alias; Rename Property; Object Destructuring; Variable Name Conflict

- Destructuring alias means renaming a property while taking it out.

- It is useful when the property name is not clear enough.

- It also helps avoid variable name conflicts.

- Real example: rename id to userId from an API response.

- Use colon syntax for aliasing.

```
const response = { id: 101 }
const { id: userId } = response
```

## Enhanced Object Literals; Object Shorthand; Computed Property Names; Method Shorthand

- Enhanced object literals make object creation shorter.

- Property shorthand avoids writing the same name twice.

- Computed property names allow dynamic keys.

- Method shorthand makes object methods cleaner.

- Real example: create request payloads with short object syntax.

```
const name = 'John'
const key = 'role'

const user = {
  name,
  [key]: 'admin',
  login() {}
}
```

## ES6 Modules; import export; JavaScript Modules; Module Scope

- ES6 modules help split code into separate files.

- export shares code from one file.

- import brings that code into another file.

- Modules avoid unnecessary global variables.

- Modules make large projects easier to manage.

```
export const add = (a, b) => a + b

import { add } from './math.js'
```

## Dynamic Import; import() Function; Lazy Loading; Code Splitting

- Dynamic import loads a file only when it is needed.

- It returns a Promise, so we can use await .

- It helps reduce the first load size of an app.

- Real example: load an admin page only when the user opens it.

- Dynamic import is useful for lazy loading.

```
const module = await import('./admin.js')
module.showAdmin()
```

## Optional Chaining; ?. Operator; Safe Property Access; Nested Object Access

- Optional chaining safely reads nested properties.

- It prevents errors when a value is null or undefined .

- Instead of crashing, it returns undefined .

- It works with objects, arrays, and function calls.

- Real example: safely read API response data.

```
const city = user?.address?.city
const firstName = response?.data?.[0]?.name
```

## Nullish Coalescing; ?? Operator; Nullish vs OR; Default Value

- ?? gives a default value only for null or undefined .

- It does not replace valid values like 0 , false , or empty string.

- || checks all falsy values, so it may replace valid data.

- Real example: keep product quantity 0 instead of changing it.

- Use ?? when 0 or false is a valid value.

```
const count = response.count ?? 0
const name = user.name || 'Guest'
```

## Generators; Generator Function; yield Keyword; Iterator

- A generator is a function that can pause and continue later.

- It is written using function* .

- yield returns a value and pauses the function.

- .next() continues the generator from the last pause.

- Generators are useful for controlled sequences.

```
function* numbers() {
  yield 1
  yield 2
}

const gen = numbers()
gen.next()
```

## Iterators; Iterator Protocol; next() Method; Built-In Iterables

- An iterator is an object that gives values one by one.

- It has a next() method.

- next() returns an object with value and done .

- Arrays, strings, Maps, and Sets are iterable.

- for...of works because of iterators.

```
const iterator = [10, 20][Symbol.iterator]()
iterator.next()
iterator.next()
```

## for...of vs for...in; Loop Difference; Object Keys; Iterable Values

- for...of | for...in

- Loops over values | Loops over keys
- Works with iterables | Works with objects
- Good for arrays | Good for object keys
- Gives actual value | Gives key or index

- Use for...of when you need array values.

- Use for...in when you need object keys.

- Avoid for...in for normal array value looping.

## Tagged Templates; Template Literal Tags; Template Function; Advanced Template Literal

- Tagged templates use a function before a template literal.

- The function receives string parts and dynamic values separately.

- They are useful when we want to format or process text.

- Real example: libraries like styled-components use this idea.

- It is an advanced use of template literals.

```
function tag(text, value) {
  return `${text[0]}${value}`
}

tag`Hello ${'John'}`
```

## Symbol; Symbol.iterator; Unique Key; JavaScript Primitive

- Symbol creates a unique value.

- Two Symbols with the same description are still different.

- Symbols are useful as unique object keys.

- Symbol.iterator makes an object work with for...of .

- Symbols help avoid property name conflicts.

```
const id = Symbol('id')
const user = { [id]: 101 }
```

## Class Fields; Static Methods; Private Fields; Instance vs Static Property

- Instance fields belong to each object created from a class.

- Static fields belong to the class itself.

- Private fields use # and cannot be accessed from outside the class.

- Static members are useful for shared class-level data.

- Instance data is per object, static data is per class.

```
class Counter {
  static count = 0
  #value = 0
  increment() {
    this.#value++
  }
}
```

## Class Inheritance; extends Keyword; super() Method; Parent Class Constructor

- Inheritance lets one class reuse another class features.

- extends creates a child class from a parent class.

- super() calls the parent constructor.

- In a child constructor, call super() before using this .

- Inheritance helps reuse common class logic.

```
class Dog extends Animal {
  constructor(name) {
    super(name)
  }
}
```

## Array Mutation Methods; Mutating vs Non-Mutating Methods; Immutable Update; React State

- Mutating Methods | Non-Mutating Methods

- Change original array | Return a new array
- push() | map()
- pop() | filter()
- splice() | slice()
- sort() | concat()

- Mutating methods change the original array.

- Non-mutating methods return a new array.

- In React state, prefer non-mutating updates.

- Immutable updates make UI changes predictable.

## Spread Operator with Arrays; ... Operator; Array Copy; Merge Arrays

- Spread operator expands array values.

- It can copy an array in a simple way.

- It can merge multiple arrays.

- It can pass array values as function arguments.

- Real example: add a new item to React state without mutating old state.

```
const copy = [...items]
const merged = [...oldItems, newItem]
const max = Math.max(...numbers)
```

## Polyfill; Shim; Browser Compatibility; Missing JavaScript Feature

- A polyfill adds a missing JavaScript feature to older browsers.

- It helps modern code run in browsers that do not support that feature.

- Example: adding Array.prototype.find() support for old browsers.

- A shim is a broader term, and a polyfill is one type of shim.

- Polyfills improve browser compatibility.

```
if (!Array.prototype.find) {
  Array.prototype.find = function () {}
}
```

## Tree Shaking; Dead Code Elimination; Bundle Optimization; ES Modules

- Tree shaking removes unused code from the final bundle.

- It helps reduce JavaScript file size.

- It works best with ES modules using import and export .

- Smaller bundles load faster in the browser.

- Named exports usually help tree shaking better.

```
import { debounce } from 'lodash-es'
```

## Babel; JavaScript Transpiler; ES6 to ES5; JSX Compiler

- Babel converts modern JavaScript into older JavaScript.

- This helps code run in older browsers.

- In React, Babel also converts JSX into JavaScript.

- It is commonly used in modern build tools.

- Browsers run JavaScript, not JSX directly.

```
const greet = () => 'Hi'

var greet = function () {
  return 'Hi'
}
```

## TypeScript vs JavaScript; TS vs JS; Static Typing; Type Checking

- JavaScript | TypeScript

- Dynamic typing | Static typing support
- Runs directly in browser | Compiles to JavaScript
- Errors may appear at runtime | Many errors are caught early
- Less setup | More setup but safer

- TypeScript is JavaScript with type support.

- It catches many mistakes before running the app.

- It is useful for large projects and team work.

- TypeScript finally becomes normal JavaScript after compilation.

## structuredClone; Deep Copy; Clone Object; Copy Nested Object

- structuredClone() creates a deep copy of a value.

- It copies nested objects also.

- It is cleaner than JSON.parse(JSON.stringify()) .

- It supports values like Date , Map , and Set better than JSON copy.

- Use it when you need an independent deep copy.

```
const copy = structuredClone(user)
copy.profile.name = 'Alex'
```

## globalThis; Global Object; window vs global; Cross Environment JavaScript

- globalThis gives the global object in any JavaScript environment.

- In browser, the global object is usually window .

- In Node.js, the global object is usually global .

- globalThis works across browser, Node.js, and workers.

- It is useful for code that runs in many environments.

```
globalThis.appName = 'My App'
```

## Top-Level Await; await Outside async; Module Await; ES2022

- Top-level await allows await directly inside a module.

- We do not need to wrap it inside an async function.

- It is useful when loading config or data before exporting values.

- The module waits until the awaited work finishes.

- Top-level await works in modules.

```
const config = await fetch('/api/config').then((res) => res.json())
export default config
```

## Proxy; Proxy Object; Trap Methods; Object Validation

- Proxy wraps an object and controls operations on it.

- It can intercept reading, writing, deleting, and other actions.

- It is useful for validation, logging, and reactive systems.

- Real example: stop setting a negative age in a user object.

- Proxy gives control over object behavior.

```
const user = new Proxy({}, {
  set(obj, key, value) {
    obj[key] = value
    return true
  }
})
```

## Module Scope; JavaScript Module Scope; Private File Scope; export Keyword

- Every JavaScript module has its own scope.

- Variables inside a module do not automatically become global.

- To share something, we must use export .

- This avoids accidental name conflicts between files.

- Modules make code safer and easier to organize.

```
const helper = () => {}
export const formatName = () => {}
```

## Shadowing vs Illegal Shadowing; Variable Shadowing; Scope Conflict; let and var

- Shadowing means declaring a variable with the same name in an inner scope.

- The inner variable hides the outer variable inside that block.

- It is allowed in many cases, but it can confuse readers.

- Illegal shadowing happens when JavaScript does not allow that declaration pattern.

- Avoid shadowing unless it is very clear.

```
let name = 'Outer'
{
  let name = 'Inner'
  console.log(name)
}
```

## PWA; Progressive Web App; Service Worker; Offline Web App

- A PWA is a web app that feels more like a mobile app.

- It can work offline using service workers.

- It can load faster after the first visit by using cache.

- It can support features like install option and push notifications.

- Real example: a shopping app can show saved products even offline.

```
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
}
```

## JavaScript Compiled or Interpreted; JIT Compilation; V8 Engine; Runtime Execution

- JavaScript was traditionally called an interpreted language.

- Modern JavaScript engines use JIT compilation.

- JIT means Just-In-Time compilation during program execution.

- Frequently used code can be optimized while the app runs.

- Modern JavaScript is both interpreted and JIT compiled.

```
function add(a, b) {
  return a + b
}
```

Previous

Javascript Oop and Design Patterns

© Copyright 2026. All rights reserved.

Designed & Developed By Durga Prasad - Mob: 9030505066
