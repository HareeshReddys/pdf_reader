# TypeScript interview reference

Generated from https://full-stack-interview-ecru.vercel.app/fullstack-dev/ for local search.
# Typescript Essentials

Source: https://full-stack-interview-ecru.vercel.app/fullstack-dev/typescript-essentials

## TypeScript vs JavaScript; TypeScript; JavaScript; Static Typing; TS vs JS

- TypeScript is JavaScript with extra type checking.

- We use it to catch mistakes before running the code.

- The browser does not run TypeScript directly; it is converted to JavaScript.

- Real example: TypeScript can stop us from passing a number where a string is expected.

```
function greet(name: string) {
  return 'Hello ' + name
}

greet('John')
```

## Install TypeScript; TypeScript Setup; TSC Init; TSConfig Init

- TypeScript is usually installed as a development dependency.

- We use tsc to check and compile TypeScript code.

- npx tsc --init creates the tsconfig.json file.

- In React projects, use .tsx files when writing JSX.

- Many tools like Next.js and Vite can create TypeScript setup automatically.

```
npm install -D typescript
npx tsc --init
```

## TSConfig; TypeScript Compiler Options; Strict Mode; TypeScript Config

- tsconfig.json tells TypeScript how to check and compile the project.

- We use it to set rules like strict checking and output JavaScript version.

- strict: true helps catch more mistakes early.

- target decides which JavaScript version should be generated.

- The paths option in tsconfig.json allows mapping import aliases like @/components to actual file paths.

```
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2020"
  }
}
```

## TS vs TSX Files; .ts vs .tsx; TypeScript File Extension; React TypeScript

- .ts is used for normal TypeScript files without JSX.

- .tsx is used when the file contains JSX, mostly in React components.

- We use .tsx because JSX needs special TypeScript support.

- Real example: Button.tsx can contain Click .

- Simple rule: JSX means .tsx , otherwise use .ts .

## Type Annotation; TypeScript Types; Type Inference; Explicit Types

- Type annotation means writing the expected type for a value.

- We use it when TypeScript cannot clearly understand the type by itself.

- TypeScript can infer many simple types automatically.

- Real example: function parameters usually need type annotations.

```
function add(a: number, b: number): number {
  return a + b
}
```

## Primitive Types; String Number Boolean; Basic Types; TypeScript Data Types

- Primitive types are simple values like string , number , and boolean .

- We use them to clearly say what kind of value a variable should hold.

- TypeScript gives an error when the wrong value type is assigned.

- Real example: age should be a number , not a string .

- Common primitive types include string , number , boolean , null , and undefined .

```
const name: string = 'Sam'
const age: number = 25
const active: boolean = true
```

## Any Type; TypeScript Any; Disable Type Checking; Avoid Any

- any means TypeScript will not check that value properly.

- We use it only when we really do not know the type.

- The main risk is that it can hide bugs.

- Real example: calling a wrong method on any will not show a TypeScript error.

```
let data: any = 'hello'
data.toFixed(2)
```

## Unknown Type; Unknown vs Any; Safe Any Alternative; Type Checking

- unknown means the value type is not known yet.

- We use it when data comes from outside, like APIs or JSON.parse() .

- Unlike any , unknown forces us to check the type before using it.

- Real example: check typeof value === 'string' before calling string methods.

```
function print(value: unknown) {
  if (typeof value === 'string') {
    console.log(value.toUpperCase())
  }
}
```

## Type Alias; Type Keyword; Custom Type; TypeScript Type

- A type alias gives a name to a type.

- We use it to avoid repeating the same type in many places.

- It works well for objects, unions, functions, and simple custom types.

- Real example: define OrderStatus once and reuse it everywhere.

```
type OrderStatus = 'pending' | 'paid' | 'cancelled'

function updateOrder(status: OrderStatus) {}
```

## Interface; TypeScript Interface; Object Shape; Props Type

- An interface describes the shape of an object.

- We use it for objects like user data, API responses, and React props.

- It helps TypeScript check required and optional fields.

- Real example: a User object must have id and name .

```
interface User {
  id: string
  name: string
  email?: string
}
```

## Type vs Interface; Type Alias vs Interface; Object Type; TypeScript Difference

- Type | Interface

- Good for unions and custom combinations | Good for object shapes
- Can describe primitives also | Mainly describes objects
- Cannot be reopened easily | Can be extended and merged

- Both can describe object shapes in TypeScript.

- Use interface when defining objects that may grow later.

- Use type for unions like 'open' | 'closed' .

## Union Types; OR Type; String or Number; TypeScript Union

- A union type means a value can be one of multiple types.

- We use it when a value has limited allowed options.

- TypeScript asks us to check the type before using type-specific methods.

- Real example: status can be 'pending' , 'success' , or 'failed' .

```
type Status = 'pending' | 'success' | 'failed'
let status: Status = 'pending'
```

## Intersection Types; AND Type; Combine Types; TypeScript Intersection

- An intersection type combines multiple types into one.

- The final value must have all properties from the combined types.

- We use it when one object needs features from multiple types.

- Real example: a user object can also include created and updated dates.

```
type User = { id: string; name: string }
type Audit = { createdAt: Date }

type UserWithAudit = User & Audit
```

## Optional Property; Question Mark; Optional Field; TypeScript Optional

- ? makes an object property optional.

- We use it when a field may or may not be available.

- Required fields must be provided, but optional fields can be skipped.

- Real example: email?: string means email is not always required.

```
interface User {
  name: string
  email?: string
}
```

## Readonly Modifier; Readonly vs Const; Immutable Property; TypeScript Readonly

- readonly prevents changing a property after it is created.

- We use it for values that should not be modified, like id .

- const protects the variable assignment, but not always object properties.

- Real example: a user id should usually stay the same.

```
interface User {
  readonly id: string
  name: string
}
```

## Enum; TypeScript Enum; String Enum; Number Enum

- An enum gives names to a fixed set of values.

- We use it when values belong to one known group.

- String enums are easier to read in logs and debugging.

- Real example: order status can be Pending , Paid , or Cancelled .

- For simple cases, a union type can be a lighter option than enum.

```
enum OrderStatus {
  Pending = 'pending',
  Paid = 'paid'
}
```

## Type Assertion; As Keyword; Type Casting; TypeScript Assertion

- Type assertion tells TypeScript to treat a value as a specific type.

- We use it when we know more about the value than TypeScript does.

- It does not convert the value at runtime.

- Wrong assertions can hide real bugs.

```
const input = document.getElementById('name') as HTMLInputElement
console.log(input.value)
```

## Non-Null Assertion; Exclamation Mark; Not Null; Not Undefined

- The ! operator tells TypeScript the value is not null or undefined .

- We use it only when we are sure the value exists.

- It does not add any runtime safety check.

- If we are wrong, the code can still crash.

- Safer option is often optional chaining like ?. .

```
document.getElementById('app')!.innerHTML = 'Hello'
```

## Void vs Never; Function Return Type; No Return; Never Returns

- Void | Never

- Function returns nothing useful | Function never completes normally
- Example: logging function | Example: function that throws error
- Can finish execution | Does not reach normal end

- void is used when a function does not return a useful value.

- never is used when a function always throws or runs forever.

## Tuple Type; Fixed Length Array; Tuple vs Array; TypeScript Tuple

- A tuple is an array with fixed length and fixed types by position.

- We use it when each position has a special meaning.

- A normal array can have many values of the same type.

- Real example: coordinates can be [number, number] .

- React useState returns a tuple-like structure.

```
const user: [string, number] = ['John', 25]
```

## Index Signature; Dynamic Object Keys; String Key Type; TypeScript Object Map

- An index signature describes objects with dynamic keys.

- We use it when key names are not known in advance.

- All dynamic values should follow the same value type.

- Real example: a score board can store player names as keys and scores as values.

- Record is another clean way to write this pattern.

```
type Scores = { [name: string]: number }

const scores: Scores = { John: 90, Sam: 80 }
```

## Classes in TypeScript; TypeScript Class; Public Private Protected; OOP

- TypeScript supports classes with typed properties and methods.

- We use classes when we want to group data and related behavior.

- public is accessible everywhere, private is only inside the class.

- protected is accessible inside the class and child classes.

```
class User {
  constructor(public name: string, private age: number) {}

  greet() {
    return 'Hi ' + this.name
  }
}
```

## Inheritance; Extends Class; Parent Child Class; TypeScript OOP

- Inheritance means one class can reuse another class.

- We use extends to create a child class from a parent class.

- The child class can reuse or override parent methods.

- super() calls the parent constructor.

```
class Animal {
  constructor(public name: string) {}
}

class Dog extends Animal {}
```

## Implements vs Extends; Interface Implements; Class Extends; TypeScript Difference

- Extends | Implements

- Reuses code from a parent class | Checks that a class follows an interface
- Used with classes and interfaces | Used by classes with interfaces
- Gives actual behavior | Gives only a contract

- extends is used when we want to inherit existing code.

- implements is used when a class must follow a shape.

- A class can extend one class but implement many interfaces.

## Decorators; TypeScript Decorators; At Symbol; NestJS Decorator

- Decorators are special functions written with @ .

- We use them to add extra behavior or metadata to classes and methods.

- Frameworks like NestJS use decorators for controllers, routes, and dependency injection.

- Decorators usually need compiler support in tsconfig.json .

```
@Controller('users')
class UsersController {
  @Get()
  findAll() {}
}
```

## Strict Mode; StrictNullChecks; TypeScript Strict; Safer Type Checking

- strict: true enables stronger TypeScript checks.

- We use it to catch more bugs during development.

- strictNullChecks stops assigning null or undefined where they are not allowed.

- It is better to enable strict mode from the start of a project.

```
let name: string | null = null
name = 'John'
```

Up next

Typescript Types and Generics

© Copyright 2026. All rights reserved.

Designed & Developed By Durga Prasad - Mob: 9030505066

---

# Typescript Types and Generics

Source: https://full-stack-interview-ecru.vercel.app/fullstack-dev/typescript-types-and-generics

## Generics in TypeScript; TypeScript Generics; Generic Type; Reusable Type-Safe Code

- Generics help us write reusable code that still keeps type safety.

- We use them when the same logic should work with different data types.

- The main benefit is we avoid any and still get correct type suggestions.

- Real example: one API response type can work for users, products, or orders.

- Generics make code flexible without losing TypeScript safety.

```
function identity<T>(value: T): T {
  return value
}

identity<string>('hello')
identity<number>(10)
```

## Why Use Generics; Generic Benefits; TypeScript Reusable Types; Avoid Any

- Generics are used when one function or type should support many types.

- They help us avoid writing the same code again and again.

- They are safer than any because TypeScript still tracks the exact type.

- Real example: getFirst() can return the first item from any typed array.

- Generics give reusable code plus compile-time safety.

```
function getFirst<T>(items: T[]): T {
  return items[0]
}

const name = getFirst(['John', 'Raj'])
```

## Generic Function; TypeScript Generic Function; Type Parameter; Generic Method

- A generic function uses a type variable like T to accept flexible input.

- TypeScript decides the type from the value we pass.

- The return type can stay connected to the input type.

- Real example: a helper function can return the same type it receives.

- T is only a placeholder name for the actual type.

```
function wrap<T>(value: T): T[] {
  return [value]
}

const result = wrap('React')
```

## Generic Constraints; Extends in Generics; Restrict Generic Type; Type Parameter Constraint

- Generic constraints limit what type a generic can accept.

- We use extends when the function needs a specific property or shape.

- The main benefit is TypeScript allows safe property access.

- Real example: getLength() should only accept values that have length .

- Constraints keep generics flexible but still controlled.

```
function getLength<T extends { length: number }>(value: T): number {
  return value.length
}

getLength('hello')
```

## Generic Interface; TypeScript Interface Generic; Reusable API Response; Generic Data Shape

- A generic interface creates a reusable object structure.

- We use it when the same object shape can contain different data types.

- The main benefit is cleaner and safer API response typing.

- Real example: ApiResponse and ApiResponse can share one structure.

- The type is passed when we use the interface.

```
interface ApiResponse<T> {
  data: T
  success: boolean
}
```

## Generic Class; TypeScript Generic Class; Typed Class; Reusable Container

- A generic class uses a type parameter for its properties and methods.

- We use it when a class should store different types safely.

- The main benefit is the class stays reusable without using any .

- Real example: a Box stores strings and Box stores numbers.

- The type is fixed when we create the object.

```
class Box<T> {
  constructor(public value: T) {}
}

const box = new Box<string>('hello')
```

## Union Types; TypeScript Union; Pipe Type; String or Number Type

- A union type means a value can be one of multiple types.

- We use it when a variable can accept limited different types.

- The main benefit is flexibility with type safety.

- Real example: an ID can be string or number .

- We usually narrow unions using typeof or conditions.

```
function printId(id: string | number) {
  console.log(id)
}
```

## Intersection Types; TypeScript Intersection; Ampersand Type; Combine Types

- An intersection type combines multiple types into one type.

- We use it when one object must contain properties from all given types.

- The main benefit is easy type composition.

- Real example: a user record can combine user details and timestamps.

- Union means “one of”, intersection means “all of”.

```
type User = { name: string }
type Audit = { createdAt: Date }

type UserRecord = User & Audit
```

## Type Alias; Type Keyword; TypeScript Type Alias; Named Type

- A type alias gives a name to a type.

- We use it to make complex types easier to read and reuse.

- The main benefit is cleaner code and less repetition.

- Real example: ID can represent string | number .

- type works well for unions, intersections, and function types.

```
type ID = string | number
type Status = 'active' | 'inactive'
```

## Optional Properties; Question Mark Property; TypeScript Optional Field; Optional Key

- Optional properties are fields that may or may not be present.

- We use ? after the property name to make it optional.

- The main benefit is flexible object typing.

- Real example: a profile may have an optional avatarUrl .

- Optional properties can be undefined , so handle them safely.

```
interface User {
  name: string
  age?: number
}
```

## Readonly Properties; TypeScript Readonly; Immutable Property; Readonly Modifier

- readonly means a property cannot be reassigned after creation.

- We use it to protect values that should not change.

- The main benefit is preventing accidental updates.

- Real example: a config object can have a readonly API URL.

- readonly is checked by TypeScript, not a runtime freeze.

```
interface Config {
  readonly apiUrl: string
}
```

## Index Signature; Dynamic Object Keys; TypeScript Index Signature; String Key Type

- An index signature defines the type for dynamic object keys.

- We use it when key names are not known in advance.

- The main benefit is safe typing for dictionary-style objects.

- Real example: a scoreboard can store player IDs as keys and scores as values.

- Record is a common alternative.

```
interface Scores {
  [playerId: string]: number
}
```

## Unknown Type; Unknown vs Any; Safe Unknown Value; TypeScript Unknown

- unknown means the value can be anything, but we must check before using it.

- We use it for unsafe data like API responses or parsed JSON.

- The main benefit is better safety than any .

- Real example: check if a value is a string before calling toUpperCase() .

- any skips type checking, but unknown forces type checking.

```
function print(value: unknown) {
  if (typeof value === 'string') {
    console.log(value.toUpperCase())
  }
}
```

## Non-Null Assertion; Exclamation Mark TypeScript; Not Null Assertion; Bang Operator

- The non-null assertion ! tells TypeScript the value is not null or undefined .

- We use it only when we are fully sure the value exists.

- The main benefit is removing unnecessary TypeScript errors in known-safe cases.

- Real example: using document.getElementById('app')! when the element always exists.

- It does not add any runtime check, so overusing it is risky.

```
const app = document.getElementById('app')!
app.innerHTML = 'Hello'
```

## Strict Null Checks; strictNullChecks; Null and Undefined Safety; TypeScript Config

- strictNullChecks makes null and undefined safer in TypeScript.

- We use it to force proper handling of missing values.

- The main benefit is avoiding common runtime errors.

- Real example: check a username before calling string methods.

- With this option on, string and string | null are different types.

```
function greet(name: string | null) {
  return name ? `Hello ${name}` : 'Hello guest'
}
```

## Tuple Types; Fixed Length Array; TypeScript Tuple; Typed Array Positions

- A tuple is an array with fixed length and fixed types at each position.

- We use it when position has meaning.

- The main benefit is more exact typing than a normal array.

- Real example: React useState returns a tuple like [value, setter] .

- [string, number] is not the same as (string | number)[] .

```
const user: [string, number] = ['John', 25]
```

## Partial and Required Utility Types; Partial TypeScript; Required TypeScript; Utility Types

- Partial makes all properties optional.

- Required makes all properties required.

- We use them to create new types from existing types.

- Real example: update APIs often accept Partial .

- Utility types help reuse types without rewriting them.

```
interface User {
  name: string
  email?: string
}

type UserUpdate = Partial<User>
```

## Pick and Omit Utility Types; Pick TypeScript; Omit TypeScript; Select Exclude Properties

- Pick creates a type with only selected properties.

- Omit creates a type by removing selected properties.

- We use them to create smaller types from larger types.

- Real example: a card component may need only id , title , and image .

- Pick keeps fields, Omit removes fields.

```
type User = { id: number; name: string; password: string }

type PublicUser = Omit<User, 'password'>
```

## Record Utility Type; TypeScript Record; Key Value Object Type; Typed Map Object

- Record creates an object type with specific key and value types.

- We use it for typed key-value objects.

- The main benefit is safe object mapping.

- Real example: role names can be mapped to display labels.

- When keys are a union, TypeScript can check missing keys.

```
type Role = 'admin' | 'user'

const labels: Record<Role, string> = {
  admin: 'Admin',
  user: 'User'
}
```

## Exclude and Extract Utility Types; Exclude TypeScript; Extract TypeScript; Filter Union Type

- Exclude removes types from a union.

- Extract keeps matching types from a union.

- We use them to create cleaner union types.

- Real example: remove deleted from allowed user status values.

- Exclude removes, Extract keeps.

```
type Status = 'active' | 'inactive' | 'deleted'

type EditableStatus = Exclude<Status, 'deleted'>
```

## ReturnType and Parameters Utility Types; ReturnType TypeScript; Parameters TypeScript; Function Type Helper

- ReturnType gets the return type of a function.

- Parameters gets the function parameter types as a tuple.

- We use them to avoid repeating function types manually.

- Real example: wrapper functions can reuse existing function signatures.

- Use typeof when passing an existing function to these utilities.

```
function add(a: number, b: number) {
  return a + b
}

type AddResult = ReturnType<typeof add>
```

## keyof Operator; TypeScript keyof; Object Keys as Type; Key Union

- keyof creates a union of property names from an object type.

- We use it when a value should be one of the object keys.

- The main benefit is safer dynamic property access.

- Real example: a generic getValue() function can accept only valid keys.

- keyof User returns keys like 'id' | 'name' .

```
function getValue<T, K extends keyof T>(obj: T, key: K) {
  return obj[key]
}
```

## typeof Operator in TypeScript; Typeof Type Query; Infer Type From Value; Compile Time Type

- typeof can create a type from an existing value.

- We use it to avoid writing the same object type manually.

- The main benefit is keeping value and type in sync.

- Real example: create a config type from a default config object.

- Runtime typeof and TypeScript type typeof are used in different places.

```
const config = { theme: 'dark', retries: 3 }

type Config = typeof config
```

## Type Guards; Type Narrowing; typeof instanceof in Operator; Custom Type Guard

- Type guards are checks that help TypeScript know the exact type.

- We use typeof , instanceof , in , or custom functions for narrowing.

- The main benefit is safely using union values.

- Real example: check whether input is a string before trimming it.

- After a type guard, TypeScript narrows the type inside that block.

```
function format(value: string | number) {
  return typeof value === 'string' ? value.trim() : value.toFixed(2)
}
```

## Discriminated Union; Tagged Union; TypeScript Union Narrowing; Common Kind Field

- A discriminated union uses a common field to identify each object type.

- We use it when different objects share one category field like type or kind .

- The main benefit is clean and safe switch-case logic.

- Real example: payment status can be success , failed , or pending .

- TypeScript can warn when a case is not handled.

```
type Result =
  | { status: 'success'; data: string }
  | { status: 'error'; message: string }
```

## Conditional Types; TypeScript Conditional Type; T Extends U; Type Level If Else

- Conditional types choose a type based on a condition.

- We use them for advanced reusable type logic.

- The main benefit is creating flexible utility types.

- Real example: return string if input type is string, otherwise return another type.

- Many built-in utility types use conditional types internally.

```
type IsString<T> = T extends string ? true : false

type A = IsString<string>
```

## Mapped Types; TypeScript Mapped Type; Transform Object Type; Keyof Mapping

- Mapped types loop over keys of a type and create a new type.

- We use them to transform object properties.

- The main benefit is avoiding repeated manual type changes.

- Real example: make every property optional, readonly, or nullable.

- Partial , Required , and Readonly are based on mapped types.

```
type Nullable<T> = {
  [K in keyof T]: T[K] | null
}
```

## Template Literal Types; TypeScript Template Literal Type; String Union Combination; Typed String Pattern

- Template literal types create string types using template syntax.

- We use them to build safe string patterns.

- The main benefit is catching invalid string values at compile time.

- Real example: event names like onClick and onFocus can be typed.

- Unions inside template literals create all possible combinations.

```
type EventName = `on${'Click' | 'Focus'}`
```

## infer Keyword; TypeScript infer; Extract Inner Type; Conditional Type Inference

- infer extracts a type inside a conditional type.

- We use it when we want TypeScript to figure out an inner type.

- The main benefit is creating advanced helper types.

- Real example: extract the item type from an array.

- infer is commonly used in utility types like ReturnType .

```
type ArrayItem<T> = T extends (infer U)[] ? U : T

type Name = ArrayItem<string[]>
```

## satisfies Operator; TypeScript satisfies; Validate Without Widening; Type Safe Config

- satisfies checks that a value matches a type.

- We use it when we want validation but still want to keep exact inferred values.

- The main benefit is better safety for config objects.

- Real example: validate a theme config without losing literal values like 'dark' .

- satisfies is different from normal type annotation because it keeps precise inference.

```
type Theme = 'light' | 'dark'

const config = {
  theme: 'dark'
} satisfies { theme: Theme }
```

Previous

Typescript Essentials

© Copyright 2026. All rights reserved.

Designed & Developed By Durga Prasad - Mob: 9030505066
