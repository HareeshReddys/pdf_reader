# React JS interview reference

Generated from https://full-stack-interview-ecru.vercel.app/fullstack-dev/ for local search.
# React Fundamentals

Source: https://full-stack-interview-ecru.vercel.app/fullstack-dev/react-fundamentals

## React; ReactJS; UI Library; Component Based UI; Frontend Development

- React is a JavaScript library used to build fast and reusable user interfaces.

- It helps split a page into small components like Header , Card , Button , and Form .

- React updates the UI automatically when data changes.

- React mainly handles the UI layer , so routing and API handling are added using other tools.

- Example: an e-commerce app can reuse one ProductCard component for many products.

```
function Header() {
  return <h1>Welcome</h1>
}
```

## Virtual DOM; React Virtual DOM; Reconciliation; React Rendering; Why React Is Fast

- The Virtual DOM is a lightweight copy of the real browser DOM.

- When data changes, React compares the old UI with the new UI.

- React updates only the changed part of the real DOM.

- This makes UI updates faster and smoother.

- Example: clicking Like updates only the like count, not the full page.

```
function LikeButton() {
  const [likes, setLikes] = useState(0)

  return <button onClick={() => setLikes(likes + 1)}>Likes: {likes}</button>
}
```

## JSX; JSX In React; JavaScript XML; HTML In JavaScript; React Syntax

- JSX lets us write HTML-like code inside JavaScript.

- It makes React UI code easier to read and maintain.

- We use className instead of class because JSX works inside JavaScript.

- We use {} to write JavaScript expressions inside JSX.

- JSX is converted into normal JavaScript before running in the browser.

```
function Badge({ label, count }) {
  return <span className="badge">{label}: {count}</span>
}
```

## JSX Advantages; Why JSX; JSX Benefits; JSX vs React.createElement

- JSX keeps UI structure and JavaScript logic close together.

- It is easier to read than writing React.createElement() manually.

- It helps developers understand component output quickly.

- It supports JavaScript expressions using {} .

- It improves productivity in real React projects.

```
const title = <h1>Hello React</h1>
```

## Browser Reading JSX; Babel JSX; JSX Compilation; React Build Step; Transpilation

- Browsers understand JavaScript, not JSX directly.

- Babel converts JSX into normal JavaScript.

- Tools like Vite or Webpack usually handle this conversion.

- React projects need a build setup because of JSX and modern JavaScript.

- Example: Hello is converted into a JavaScript function call.

```
// JSX
<h1>Hello</h1>

// Converted concept
React.createElement("h1", null, "Hello")
```

## Functional vs Class Components; Function Component vs Class Component; Modern React Components

- Functional Component | Class Component

- Modern and commonly used | Older React style
- Uses hooks like useState | Uses lifecycle methods
- Less code and easier to read | More boilerplate code
- Preferred in new projects | Mostly found in old codebases

- Modern React mostly uses functional components .

- Class components still work but are less common today.

- Hooks allow functional components to handle state and lifecycle logic.

## Functional Components; Function Component; React Component; How To Write Component

- A functional component is a JavaScript function that returns JSX.

- It is the most common way to create React components today.

- Props are received as function parameters.

- Hooks can be used inside functional components.

- Example: a UserCard component can display user details.

```
function UserCard({ name }) {
  return <h2>{name}</h2>
}
```

## Element vs Component; React Element vs Component; JSX Element; Component Difference

- React Element | React Component

- A single UI description | A reusable function or class
- Example: Hello | Example:
- Usually static | Can contain props and logic

- An element describes what should appear on the screen.

- A component is reusable code that returns elements.

- Components help organize and reuse UI logic.

- Example:  is a component that may return a  element.

```
const element = <h1>Hello</h1>

function Header() {
  return element
}
```

## Reconciliation; React Diffing Algorithm; Re-rendering; React Update Process

- Reconciliation is how React compares the old UI and new UI.

- React checks what changed after state or props update.

- React updates only the required parts of the real DOM.

- Proper keys help React compare list items correctly.

- Example: in a todo list, React updates only the edited todo item.

```
setTodos(
  todos.map(todo => todo.id === id ? { ...todo, done: true } : todo)
)
```

## Keys In Lists; React Key Prop; List Rendering Key; Unique Key Warning

- Keys help React identify which list item changed, added, or removed.

- Keys should be unique and stable.

- Avoid array index as key when list order can change.

- Good keys help with correct rendering and performance.

- Example: use user.id as the key in a user list.

```
users.map(user => <UserCard key={user.id} user={user} />)
```

## Declarative vs Imperative Syntax; Declarative React; Imperative Programming; UI Approach

- Declarative | Imperative

- Says what UI should look like | Says every step to change UI
- Used by React | Common in direct DOM code
- Easier to read | More manual work

- React is declarative , so we describe the final UI.

- React handles DOM updates internally.

- This reduces manual DOM manipulation.

- Example: based on isLoggedIn , React shows either Dashboard or Login.

```
return isLoggedIn ? <Dashboard /> : <Login />
```

## Conditional Rendering; Show Hide Elements; Ternary In JSX; Render Based On Condition

- Conditional rendering means showing UI based on a condition.

- Use && for simple show/hide logic.

- Use ternary when there are two possible outputs.

- It is commonly used for login screens, loading states, and permissions.

- Keep conditions simple so JSX stays readable.

```
{isLoading ? <p>Loading...</p> : <UserList />}
{isAdmin && <button>Delete</button>}
```

## Iterate List In JSX; Map In React; Render List; Array To JSX; List Rendering

- In React, we use map() to render arrays as UI.

- Each item should have a unique key prop.

- It is commonly used for users, products, todos, and table rows.

- Move large list item UI into a separate component.

- Example: render product cards from API data.

```
products.map(product => (
  <ProductCard key={product.id} product={product} />
))
```

## ReactDOM; react-dom Package; createRoot; Mount React App; Root Element

- ReactDOM connects React components to the real browser DOM.

- createRoot() is the modern React 18 way to start an app.

- It mounts the main  component into the root HTML element.

- This setup is usually written in main.jsx or index.jsx .

- Example: Vite React apps mount React into

 .

```
import { createRoot } from "react-dom/client"

createRoot(document.getElementById("root")).render(<App />)
```

## Single Page Application; SPA; React SPA; Client Side Routing; One Page App

- A SPA loads one main HTML page and updates content without full page reloads.

- React is commonly used to build SPAs.

- Navigation feels faster because only parts of the UI change.

- Routing is usually handled with libraries like React Router.

- Example: Gmail-style apps change screens without reloading the full page.

```
<Route path="/dashboard" element={<Dashboard />} />
```

## React App Loading Flow; React App Bootstrap; App Initialization; How React Starts

- The browser first loads index.html .

- Then the JavaScript bundle is loaded.

- React finds the root DOM element.

- React renders the main  component inside that root.

- After that, React updates the UI based on state and props.

```
<div id="root"></div>
```

```
createRoot(document.getElementById("root")).render(<App />)
```

## Spread Operator In JSX; Spreading Props; Rest Props; Passing Props React

- The spread operator helps pass multiple props at once.

- It keeps code cleaner when many props are passed.

- It is useful for reusable form controls and UI components.

- Avoid passing unwanted props accidentally.

- Rest props can collect remaining props and pass them to a child element.

```
function Button({ label, ...props }) {
  return <button {...props}>{label}</button>
}
```

## React Reusability and Composition; Component Composition; Children Prop; Reusable Components

- React encourages building small reusable components.

- Composition means combining components to build bigger UI.

- The children prop lets a component wrap other content.

- This makes layouts, cards, modals, and buttons reusable.

- Example: one Card component can display users, products, or posts.

```
function Card({ children }) {
  return <div className="card">{children}</div>
}
```

## Prop Drilling; Passing Props; Deep Props; React Props Problem; State Sharing

- Prop drilling means passing props through many components to reach a child.

- It is acceptable for small component trees.

- It becomes hard to maintain when many levels are involved.

- Common solutions are Context API, Redux, Zustand, or better component structure.

- Example: passing logged-in user data from App to a deeply nested Profile .

```
<App user={user}>
  <Layout user={user} />
</App>
```

## Framework vs Library; React Library; React vs Angular; React vs Next.js

- Library | Framework

- Gives focused tools | Gives full project structure
- More flexible | More opinionated
- Example: React | Example: Angular or Next.js

- React is called a library because it mainly handles UI.

- A framework usually provides routing, data fetching, build rules, and structure.

- React gives flexibility but needs extra libraries for full app setup.

- Next.js is a React framework because it adds routing, SSR, API routes, and more.

## Setup First React Project; Create React App; Vite React; React Installation

- Vite is commonly used to create modern React projects quickly.

- It gives a fast development server and simple setup.

- Create React App is older and less preferred for new projects.

- After setup, run the app using npm run dev .

- Example: use Vite for practice projects and interview assignments.

```
npm create vite@latest my-app -- --template react
cd my-app
npm install
npm run dev
```

## Lazy Loading Components; React.lazy; Suspense; Code Splitting; Reduce Bundle Size

- Lazy loading loads a component only when it is needed.

- It helps reduce the initial JavaScript bundle size.

- React.lazy() is used to import components lazily.

- Suspense shows fallback UI while the component loads.

- Example: load an Admin Dashboard only when the user opens it.

```
const Admin = React.lazy(() => import("./Admin"))

<Suspense fallback={<p>Loading...</p>}>
  <Admin />
</Suspense>
```

## React 18 Features; Concurrent React; Automatic Batching; startTransition; Suspense Improvements

- React 18 introduced features for smoother UI updates.

- Automatic batching groups multiple state updates into one render.

- startTransition() marks non-urgent updates.

- React 18 uses createRoot() instead of old ReactDOM.render() .

- Example: search filtering can be a transition to keep typing smooth.

```
startTransition(() => {
  setSearchResults(results)
})
```

## React 19 Features; Server Components; Server Actions; React Compiler; Modern React

- React 19 improves support for Server Components and modern rendering.

- Actions help handle async form submissions more cleanly.

- The React Compiler aims to reduce manual memoization in supported setups.

- It improves developer experience for forms, async UI, and performance.

- React 19 moves React toward simpler and more optimized app development.

```
<form action={submitForm}>
  <input name="email" />
  <button type="submit">Save</button>
</form>
```

Up next

Components Props and State

© Copyright 2026. All rights reserved.

Designed & Developed By Durga Prasad - Mob: 9030505066

---

# Components Props and State

Source: https://full-stack-interview-ecru.vercel.app/fullstack-dev/components-props-and-state

## React State; useState; Component State; UI Updates; State Management

- State is data that belongs to a component and can change over time.

- When state changes, React re-renders the component and updates the UI.

- Use state for values like form inputs, modal open/close, counters, and selected tabs.

- Never update state directly; always use the setter function.

- Keep state near the component that really needs it.

```
import { useState } from "react"

function Counter() {
  const [count, setCount] = useState(0)

  return <button onClick={() => setCount(count + 1)}>Count: {count}</button>
}
```

## React Props; Component Props; Parent To Child Data; Passing Data

- Props are values passed from a parent component to a child component.

- Props help reuse the same component with different data.

- A child component should read props, not change them directly.

- Data usually flows from parent to child through props.

- Real example: pass product data to a reusable ProductCard .

```
function UserCard({ name, role }) {
  return <p>{name} - {role}</p>
}

<UserCard name="John" role="Admin" />
```

## State vs Props; React State And Props Difference; Component Data; Props vs State

- State | Props

- Managed inside the component | Passed from parent to child
- Can change using setter function | Should not be changed by child
- Used for internal UI changes | Used to send data/configuration
- Example: modal open/close | Example: user name passed to card

- State is used when the component needs to remember changing data.

- Props are used when a parent sends data to a child.

- State can change inside the component, but props come from outside.

- Both state and props can cause React to re-render the UI.

- Real example: isOpen can be state, and title can be a prop.

```
function Modal({ title }) {
  const [open, setOpen] = useState(false)

  return open && <h2>{title}</h2>
}
```

## Lifting State Up; Shared State; Parent State; React Data Flow

- Lifting state up means moving shared state to the nearest common parent.

- It helps two or more child components use the same data.

- The parent owns the state and passes it down using props.

- Children can update parent state through callback props.

- Real example: search input and product list can share search text from parent state.

```
function Parent() {
  const [search, setSearch] = useState("")

  return (
    <>
      <SearchBox value={search} onChange={setSearch} />
      <ProductList search={search} />
    </>
  )
}
```

## Controlled vs Uncontrolled Components; Controlled Input; Uncontrolled Input; React Forms

- Controlled Component | Uncontrolled Component

- Value is controlled by React state | Value is handled by the DOM
- Uses value and onChange | Uses ref to read value
- Easier for validation | Less code for simple forms
- Common in real React apps | Useful for quick/simple input access

- A controlled component stores form value in React state.

- An uncontrolled component lets the browser manage the input value.

- Controlled inputs are better for validation and live UI updates.

- Uncontrolled inputs are useful when you only need the value on submit.

- Real example: login forms usually use controlled inputs.

```
function LoginForm() {
  const [email, setEmail] = useState("")

  return <input value={email} onChange={e => setEmail(e.target.value)} />
}
```

## React Keys; Key Prop; List Rendering; Unique Keys; Array Map

- Keys help React identify which list item changed, added, or removed.

- Keys should be unique and stable.

- Use IDs from data whenever possible.

- Avoid array index as key when list order can change.

- Real example: use user.id while rendering users from an API.

```
users.map(user => <UserCard key={user.id} user={user} />)
```

## Prop Drilling; Passing Props Deeply; React Props Problem; Shared Data

- Prop drilling means passing props through many components to reach a deeply nested child.

- It is fine for small component trees.

- It becomes hard to manage when many levels are involved.

- Common fixes are Context API, Redux, Zustand, or better component structure.

- Real example: passing logged-in user details from App to a deep ProfileMenu .

```
function App() {
  return <Layout user={user} />
}
```

## Pure Components; React Pure Component; PureComponent; Shallow Comparison; Render Optimization

- A pure component gives the same UI for the same props and state.

- It helps avoid unnecessary re-renders.

- Class components use React.PureComponent .

- Functional components commonly use React.memo() .

- Real example: avoid re-rendering a product card when its props did not change.

```
const ProductCard = React.memo(function ProductCard({ product }) {
  return <h3>{product.name}</h3>
})
```

## Stateless vs Stateful Components; Presentational Components; Container Components; React Components

- Stateless Component | Stateful Component

- Does not manage its own state | Manages its own state
- Mostly receives props | Uses useState or class state
- Easier to reuse and test | Handles changing UI data
- Example: Button, Badge | Example: Form, Modal

- Stateless components mainly display data from props.

- Stateful components manage data that changes over time.

- Stateless components are useful for reusable UI.

- Stateful components are useful for forms, tabs, modals, and counters.

- Real projects usually use both together.

```
function Badge({ label }) {
  return <span>{label}</span>
}
```

## Component Lifecycle; React Lifecycle Phases; Mount Update Unmount; useEffect Lifecycle

- Lifecycle means the stages a component goes through on the screen.

- Main phases are mount, update, and unmount.

- Mount means the component appears for the first time.

- Update happens when props or state changes.

- Unmount means the component is removed from the screen.

```
useEffect(() => {
  console.log("Component mounted")

  return () => console.log("Component removed")
}, [])
```

## Children Prop; React Children; Component Composition; Wrapper Components

- children is a special prop used to pass content inside a component.

- It helps create reusable wrapper components.

- Commonly used for cards, modals, layouts, and buttons.

- The parent decides what content goes inside.

- Real example: one Card component can wrap user, product, or post content.

```
function Card({ children }) {
  return <div className="card">{children}</div>
}

<Card>
  <h2>Product</h2>
</Card>
```

## useRef; React Ref; DOM Reference; Mutable Value; Access DOM

- useRef stores a value that does not cause re-render when changed.

- It is commonly used to access DOM elements directly.

- It can keep values between renders.

- Useful for focusing inputs, timers, and previous values.

- Real example: focus an input when a button is clicked.

```
function SearchBox() {
  const inputRef = useRef(null)

  return (
    <>
      <input ref={inputRef} />
      <button onClick={() => inputRef.current.focus()}>Focus</button>
    </>
  )
}
```

## forwardRef; React forwardRef; Pass Ref To Child; Ref Forwarding

- forwardRef lets a parent pass a ref to a child component.

- It is useful when the parent needs access to a child DOM element.

- Commonly used in reusable input, button, and modal components.

- It helps build flexible component libraries.

- Real example: parent component can focus a custom input component.

```
const CustomInput = React.forwardRef(function CustomInput(props, ref) {
  return <input ref={ref} {...props} />
})
```

## Synthetic Events; React Events; Event Handling; Browser Events; onClick onChange

- Synthetic events are React's wrapper around browser events.

- They make event handling work consistently across browsers.

- React events use camelCase names like onClick and onChange .

- Event handlers receive an event object.

- Real example: handle button clicks, input changes, and form submits.

```
function Button() {
  function handleClick() {
    console.log("Clicked")
  }

  return <button onClick={handleClick}>Save</button>
}
```

## Child To Parent Data; Callback Props; Pass Data From Child To Parent; React Communication

- A child sends data to a parent by calling a function passed as a prop.

- The parent creates the function and passes it to the child.

- The child calls that function with the required value.

- This keeps data flow clear and predictable.

- Real example: child search input sends typed text to parent.

```
function SearchBox({ onSearch }) {
  return <input onChange={e => onSearch(e.target.value)} />
}
```

## Side Effects; React Side Effects; useEffect; API Calls; External Work

- Side effects are tasks that happen outside normal rendering.

- Common examples are API calls, timers, subscriptions, and DOM updates.

- In functional components, useEffect handles side effects.

- Cleanup is important for timers and subscriptions.

- Real example: fetch users when a page loads.

```
useEffect(() => {
  fetch("/users")
    .then(res => res.json())
    .then(data => setUsers(data))
}, [])
```

## React Fragments; Fragment; Empty Tag; Avoid Extra Div; JSX Wrapper

- Fragments let us return multiple elements without adding extra HTML.

- They help keep the DOM clean.

- Use ... for short fragment syntax.

- Use  when a key is needed.

- Real example: return title and description without wrapping them in a div.

```
function Info() {
  return (
    <>
      <h2>Title</h2>
      <p>Description</p>
    </>
  )
}
```

## React Portals; createPortal; Render Outside Root; Modal Portal; Tooltip Portal

- Portals render a component outside its normal parent DOM tree.

- They are useful for modals, tooltips, popups, and dropdowns.

- The component still behaves like part of the React tree.

- Portals help avoid CSS overflow and z-index issues.

- Real example: render a modal inside a separate modal-root .

```
import { createPortal } from "react-dom"

function Modal({ children }) {
  return createPortal(children, document.getElementById("modal-root"))
}
```

## Constructor In Class Components; React Constructor; Class Component Setup; Initial State

- A constructor runs when a class component is created.

- It is mainly used to set initial state.

- In class components, call super(props) before using this .

- Modern React mostly uses functional components instead.

- Real example: old class components used constructor for form state.

```
class Counter extends React.Component {
  constructor(props) {
    super(props)
    this.state = { count: 0 }
  }
}
```

## State In Class Components; this.state; setState; Class Component State

- Class components store state in this.state .

- State is updated using this.setState() .

- Never change this.state directly after initialization.

- Updating state re-renders the component.

- Modern React usually uses useState in functional components.

```
class Counter extends React.Component {
  state = { count: 0 }

  increment = () => {
    this.setState({ count: this.state.count + 1 })
  }
}
```

## createElement vs cloneElement; React.createElement; React.cloneElement; Element Creation

- createElement | cloneElement

- Creates a new React element | Copies an existing React element
- Used internally by JSX | Used to add/change props
- Common conceptually | Less common in daily code
- Example: create  | Example: add prop to child

- createElement creates a new React element.

- JSX is converted into React.createElement() internally.

- cloneElement copies an existing element with new props.

- cloneElement is useful for advanced component composition.

- In normal projects, JSX is preferred over writing createElement manually.

```
const title = React.createElement("h1", null, "Hello")

const cloned = React.cloneElement(title, { className: "heading" })
```

Previous

React Fundamentals

Up next

React Hooks

© Copyright 2026. All rights reserved.

Designed & Developed By Durga Prasad - Mob: 9030505066

---

# React Hooks

Source: https://full-stack-interview-ecru.vercel.app/fullstack-dev/react-hooks

## React Hooks; Hooks; React Function Component; State Hook

- React Hooks help function components use React features like state and effects.

- We use hooks to avoid class components for most common React work.

- Hooks keep related logic in one place and make components easier to read.

- Real example: useState can store a counter value inside a button component.

- Important point: hooks were introduced in React 16.8.

```
function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}
```

## Rules of Hooks; Hook Rules; Hook Call Order; React Hooks Best Practices

- Hooks must be called at the top level of a component.

- We should not call hooks inside if , loops, or nested functions.

- React depends on the same hook order on every render.

- Hooks should be used only inside React components or custom hooks.

- Important point: ESLint can help catch wrong hook usage.

```
const [logs, setLogs] = useState([])

useEffect(() => {
  if (isAdmin) fetchLogs().then(setLogs)
}, [isAdmin])
```

## useState; State Hook; React State; Manage Component State

- useState is used to store local state in a function component.

- It gives the current value and a function to update that value.

- When state changes, React re-renders the component.

- Real example: store form input value, count value, or modal open state.

- Important point: use previous state when the new value depends on the old value.

```
const [count, setCount] = useState(0)

function increase() {
  setCount(prev => prev + 1)
}
```

## useEffect; Effect Hook; Side Effects; API Calls in React

- useEffect is used to run side effects after rendering.

- Side effects include API calls, timers, subscriptions, and DOM updates.

- We use it because render logic should stay clean and predictable.

- The dependency array decides when the effect runs again.

- Important point: return a cleanup function when something must be removed.

```
useEffect(() => {
  fetchUser(userId).then(setUser)
}, [userId])
```

## useEffect Cleanup; Cleanup Function; Memory Leak; Remove Event Listener

- Cleanup is used to remove work started by an effect.

- It helps avoid memory leaks and unwanted updates.

- React runs cleanup before the next effect and when the component unmounts.

- Real example: remove event listeners or clear timers.

- Important point: always clean up subscriptions, intervals, and listeners.

```
useEffect(() => {
  const resize = () => setWidth(window.innerWidth)
  window.addEventListener('resize', resize)
  return () => window.removeEventListener('resize', resize)
}, [])
```

## useEffect Dependency Array; Dependencies; Stale Closure; Exhaustive Deps

- The dependency array tells React when to run the effect again.

- Values used inside the effect should be added to the dependency array.

- If a dependency is missing, the effect may use old values.

- Real example: if userId changes, fetch the new user data.

- Important point: react-hooks/exhaustive-deps helps find missing dependencies.

```
useEffect(() => {
  fetchData(userId, token).then(setData)
}, [userId, token])
```

## Empty Dependency Array; useEffect Empty Array; Run Once; Component Mount

- An empty dependency array [] means the effect runs once after the first render.

- We use it for setup work that does not depend on changing values.

- Cleanup still runs when the component unmounts.

- Real example: set a static document title once.

- Important point: do not use [] just to hide dependency warnings.

```
useEffect(() => {
  document.title = 'My App'
}, [])
```

## useRef; Ref Hook; useRef vs useState; DOM Reference

- useRef stores a value that stays the same between renders.

- Updating ref.current does not re-render the component.

- We use it for DOM references, timer IDs, and previous values.

- Real example: focus an input after the page loads.

- Important point: use state when UI must update, and use ref when UI should not update.

```
const inputRef = useRef(null)

useEffect(() => {
  inputRef.current?.focus()
}, [])
```

## useCallback; Callback Hook; Memoize Function; Prevent Child Re-render

- useCallback keeps the same function reference between renders.

- We use it when passing functions to memoized child components.

- It can help avoid unnecessary child re-renders.

- Real example: pass handleDelete to a large list component.

- Important point: useCallback does not make the function itself faster.

```
const handleDelete = useCallback((id) => {
  setItems(prev => prev.filter(item => item.id !== id))
}, [])
```

## useMemo; Memo Hook; Expensive Calculation; Cached Value

- useMemo stores a calculated value between renders.

- React recalculates it only when its dependencies change.

- We use it for expensive filtering, sorting, or derived data.

- Real example: filter a large product list based on search text.

- Important point: do not use useMemo for very simple calculations.

```
const filteredProducts = useMemo(() => {
  return products.filter(p => p.name.includes(query))
}, [products, query])
```

## Custom Hooks; Custom Hook; Reusable Logic; useFetch Hook

- A custom hook is a reusable function that starts with use .

- It helps share stateful logic between components.

- Custom hooks can use other hooks like useState and useEffect .

- Real example: useFetch can handle API loading, data, and error state.

- Important point: each component gets its own separate state from the custom hook.

```
function useToggle() {
  const [open, setOpen] = useState(false)
  const toggle = () => setOpen(prev => !prev)
  return { open, toggle }
}
```

## useContext; Context Hook; React Context; Avoid Prop Drilling

- useContext reads data from a context provider.

- We use it to avoid passing props through many component levels.

- It is useful for shared data like theme, auth user, or language.

- Real example: a navbar can read logged-in user data from auth context.

- Important point: context updates re-render components that use that context.

```
const user = useContext(AuthContext)

return <p>Hello {user.name}</p>
```

## useReducer; Reducer Hook; Complex State; Dispatch Action

- useReducer manages state using a reducer function and actions.

- We use it when state has many related values or update rules.

- It keeps state update logic in one clear place.

- Real example: shopping cart state can use actions like add, remove, and clear.

- Important point: reducer functions should be pure and should not call APIs.

```
function reducer(state, action) {
  if (action.type === 'increment') return { count: state.count + 1 }
  return state
}

const [state, dispatch] = useReducer(reducer, { count: 0 })
```

## useState vs useReducer; State Hook vs Reducer Hook; Simple State vs Complex State

- useState | useReducer

- Best for simple values | Best for complex state
- Updates state directly | Updates state using actions
- Good for input or toggle | Good for cart or form flow
- Less code | More organized for rules

- Start with useState for simple state.

- Use useReducer when update logic becomes harder to manage.

- Real example: a shopping cart is usually better with useReducer .

## useLayoutEffect; Layout Effect Hook; useEffect vs useLayoutEffect; DOM Measurement

- useLayoutEffect runs after DOM changes but before the browser paints.

- We use it when layout must be measured or fixed before the user sees it.

- It can prevent visual flickering in some UI cases.

- Real example: position a tooltip based on another element.

- Important point: use normal useEffect for most cases.

```
useLayoutEffect(() => {
  const height = boxRef.current.offsetHeight
  setBoxHeight(height)
}, [])
```

## useRef vs createRef; React Ref; Function Component Ref; Class Component Ref

- useRef | createRef

- Best for function components | Best for class components
- Same ref object across renders | New ref object can be created
- Value stays between renders | Can reset in function components

- In function components, prefer useRef .

- createRef is mostly used with class components.

- Important point: both use the .current property.

## useTransition; Transition Hook; Concurrent React; Keep UI Responsive

- useTransition marks some state updates as less urgent.

- It helps keep the UI responsive during heavy updates.

- Urgent updates like typing can happen first.

- Real example: update search text immediately, but filter a large list slowly.

- Important point: it returns isPending and startTransition .

```
const [isPending, startTransition] = useTransition()

function search(value) {
  startTransition(() => setResults(filterItems(value)))
}
```

## useImperativeHandle; Imperative Handle Hook; forwardRef; Expose Child Methods

- useImperativeHandle lets a child expose selected methods to a parent.

- We use it with forwardRef when the parent needs direct control.

- It is useful for focus, scroll, or media controls.

- Real example: a parent can call modalRef.current.open() .

- Important point: prefer props first, and use this only when really needed.

```
useImperativeHandle(ref, () => ({
  focus: () => inputRef.current.focus(),
}))
```

## Dispatch and Reducer Function; Reducer Action; Pure Reducer; State Update

- dispatch sends an action to the reducer.

- The reducer receives the current state and action.

- It returns the next state without changing the old state directly.

- Real example: dispatch({ type: 'cart/add_item' }) adds an item to cart state.

- Important point: API calls should not be written inside the reducer.

```
dispatch({ type: 'cart/clear' })

function reducer(state, action) {
  if (action.type === 'cart/clear') return { ...state, items: [] }
  return state
}
```

## useContext vs Props; Context vs Props; Prop Drilling; Shared Data

- Props | Context

- Passed from parent to child | Read from a provider
- Easy to trace | Useful for shared data
- Best for local data | Best for app-level data
- Can cause prop drilling | Avoids prop drilling

- Use props for direct parent-to-child data.

- Use context for widely shared data like theme or auth.

- Important point: overusing context can make data flow harder to understand.

## useDebugValue; Debug Hook; Custom Hook Debugging; React DevTools

- useDebugValue shows a label for custom hooks in React DevTools.

- We use it only to make debugging easier.

- It does not change how the component works.

- Real example: show Online or Offline for a useOnlineStatus hook.

- Important point: it is mainly useful for custom hooks used often.

```
function useOnlineStatus() {
  const [online] = useState(navigator.onLine)
  useDebugValue(online ? 'Online' : 'Offline')
  return online
}
```

Previous

Components Props and State

Up next

Rendering and Performance

© Copyright 2026. All rights reserved.

Designed & Developed By Durga Prasad - Mob: 9030505066

---

# Rendering and Performance

Source: https://full-stack-interview-ecru.vercel.app/fullstack-dev/rendering-and-performance

## Virtual DOM vs Real DOM; Virtual DOM; Real DOM; React DOM Update

- Real DOM is the actual page structure shown by the browser.

- Virtual DOM is React's lightweight copy of the UI in memory.

- React compares the old Virtual DOM with the new one when state changes.

- React updates only the changed part in the Real DOM.

- Real example: changing one todo item updates only that item, not the full list.

```
// React updates only the changed item
items.map(item => <li key={item.id}>{item.name}</li>)
```

## Reconciliation; React Reconciliation; DOM Diffing; React Update Process

- Reconciliation is the way React decides what changed in the UI.

- React compares the new UI tree with the old UI tree.

- If the element type is same, React updates it in the same place.

- If the element type changes, React removes the old part and creates a new one.

- Keys help React correctly track list items during updates.

```
{todos.map(todo => (
  <TodoRow key={todo.id} todo={todo} />
))}
```

## Diffing Algorithm; React Diffing; Key Prop; List Rendering

- Diffing means React checks the difference between old UI and new UI.

- Keys help React identify each item in a list.

- Stable keys prevent wrong updates when items are sorted or removed.

- Avoid array index as key when the list can change.

- Real example: use product id as key in a product list.

```
// Avoid this if list order changes
items.map((item, index) => <Row key={index} item={item} />)

// Better: use a stable id
items.map(item => <Row key={item.id} item={item} />)
```

## CSR vs SSR vs SSG; Client Side Rendering; Server Side Rendering; Static Site Generation

- CSR | SSR | SSG

- Renders in browser | Renders on server for each request | Renders during build time
- Slower first content | Faster first content | Very fast loading
- Good for dashboards | Good for dynamic public pages | Good for static pages

- CSR is useful when the page depends heavily on user actions.

- SSR is useful when data changes often and SEO is important.

- SSG is useful for blogs, landing pages, and documentation.

## Server Side Rendering; SSR; Hydration; React Hydration

- SSR means the server sends ready HTML to the browser.

- The user can see the page content faster.

- Hydration means React adds JavaScript behavior to that HTML.

- Server output and client output should match to avoid hydration errors.

- Real example: a product page can show product details first, then make the cart button clickable.

```
async function ProductPage({ id }) {
  const product = await fetchProduct(id)

  return <h1>{product.name}</h1>
}
```

## React Re-render; Component Re-render; Unnecessary Re-render; Render Trigger

- A component re-renders when its state or props change.

- A child can also re-render when its parent re-renders.

- New object or function references can cause extra child renders.

- Use memoization only when re-rendering is actually a problem.

- Real example: a large table should avoid re-rendering unchanged rows.

```
const handleClick = useCallback(() => {
  doSomething()
}, [])

<Button onClick={handleClick} />
```

## React.memo; Memoized Component; Skip Re-render; Component Optimization

- React.memo helps a component skip re-render when props are same.

- It does a shallow comparison of props.

- It works best for child components that receive stable props.

- It may not help if props are always new objects or functions.

- Real example: memoize a table row in a large data table.

```
const Row = React.memo(function Row({ name, price }) {
  return <tr><td>{name}</td><td>{price}</td></tr>
})
```

## useMemo vs useCallback vs React.memo; Memoization; React Performance Hooks

- Feature | Meaning

- React.memo | Memoizes a component
- useMemo | Memoizes a calculated value
- useCallback | Memoizes a function reference

- useMemo is useful for expensive calculations.

- useCallback is useful when passing functions to memoized children.

- Do not use memoization everywhere because it also has a small cost.

```
const total = useMemo(() => calculateTotal(items), [items])

const handleSave = useCallback(() => {
  saveData()
}, [])
```

## Batch State Updates; React Batching; Automatic Batching; Multiple setState Calls

- Batching means React groups multiple state updates into one render.

- It improves performance by reducing unnecessary renders.

- React 18 supports automatic batching in more places.

- Multiple setState calls in one event usually cause only one re-render.

- Real example: updating count and total together can be handled in one render.

```
function handleClick() {
  setCount(count => count + 1)
  setTotal(total => total + 1)
}
```

## Code Splitting; Lazy Loading; React.lazy; Suspense

- Code splitting means breaking JavaScript into smaller files.

- It helps the app load faster at the beginning.

- React.lazy() loads a component only when it is needed.

- Suspense shows a fallback UI while the component is loading.

- Real example: load an admin page only when the user opens it.

```
const Reports = React.lazy(() => import('./Reports'))

<Suspense fallback={<p>Loading...</p>}>
  <Reports />
</Suspense>
```

## Route Based Code Splitting; Page Level Splitting; Lazy Load Routes; Bundle Optimization

- Route based splitting loads JavaScript page by page.

- The home page does not need to download admin page code first.

- This reduces the first bundle size.

- It is one of the easiest ways to improve SPA loading speed.

- Real example: /settings code loads only when the user visits Settings.

```
const Settings = React.lazy(() => import('./pages/Settings'))
```

## Suspense Component; React Suspense; Fallback UI; Loading Boundary

- Suspense shows a loading fallback while something is loading.

- It is commonly used with React.lazy() .

- Small Suspense boundaries keep the rest of the page visible.

- It improves user experience during slow loading.

- Real example: show a chart skeleton while the chart component loads.

```
<Suspense fallback={<ChartSkeleton />}>
  <SalesChart />
</Suspense>
```

## React Performance Optimization; React App Performance; Render Optimization; Bundle Optimization

- Avoid unnecessary re-renders in large components.

- Use code splitting to reduce initial JavaScript size.

- Use list virtualization for very long lists.

- Keep props stable when using memoized child components.

- Real example: render only visible rows in a 10,000-row table.

```
import { FixedSizeList } from 'react-window'

<FixedSizeList height={400} itemCount={10000} itemSize={35}>
  {({ index, style }) => <Row style={style} data={rows[index]} />}
</FixedSizeList>
```

## SEO in React; Search Engine Optimization; SSR SEO; SSG SEO

- SEO means making pages easy for search engines to read.

- SSR and SSG help because real HTML is available early.

- Use proper title , meta description , and semantic HTML.

- Fast loading pages also improve user experience and SEO signals.

- Real example: a blog post should be server-rendered or statically generated.

```
<title>React Deployment Guide</title>
<meta name="description" content="Learn how to deploy a React app." />
```

## React Server Components; RSC; Server Components; Client Components

- Server Components render on the server, not in the browser.

- Their JavaScript code is not sent to the client.

- They cannot use state, effects, or browser events.

- Use "use client" for interactive components.

- Real example: product details can be server-rendered, but Add to Cart should be a Client Component.

```
// Server Component
async function ProductDetails({ id }) {
  const product = await db.product.find(id)
  return <h1>{product.name}</h1>
}

// Client Component
'use client'
function AddToCart({ productId }) {
  return <button onClick={() => addToCart(productId)}>Add to cart</button>
}
```

Previous

React Hooks

Up next

State Management and Advanced Patterns

© Copyright 2026. All rights reserved.

Designed & Developed By Durga Prasad - Mob: 9030505066

---

# State Management and Advanced Patterns

Source: https://full-stack-interview-ecru.vercel.app/fullstack-dev/state-management-and-advanced-patterns

## React Design Patterns; Component Design Patterns; Composition Over Inheritance; React Patterns

- React design patterns help us write clean and reusable components.

- We use them to separate UI, logic, and shared behavior clearly.

- The main benefit is easier maintenance when the app grows.

- Real example: a ProductCard component can be reused in many product lists.

- Common patterns are composition, custom hooks, compound components, and container components.

```
function ProductCard({ product }) {
  return <h3>{product.name}</h3>
}
```

## Higher Order Component; HOC; Component Wrapper; React HOC

- A Higher Order Component is a function that takes a component and returns a new component.

- We use HOCs to add common logic like authentication, logging, or permissions.

- The main benefit is reusing the same logic in many components.

- Real example: withAuth(Dashboard) can protect the dashboard page.

- In modern React, custom hooks are usually preferred over HOCs.

```
const ProtectedDashboard = withAuth(Dashboard)
```

## Context API; React Context; createContext; useContext; Provider

- Context API helps share data without passing props through every component.

- We use it for common app data like theme, logged-in user, or language.

- The main benefit is avoiding prop drilling.

- Real example: ThemeProvider can share dark mode with the whole app.

- Context is best for data that does not change very frequently.

```
const theme = useContext(ThemeContext)
```

## Context API vs Redux; React Context vs Redux; State Management Comparison

- Context API | Redux

- Built into React | External state management library
- Good for simple shared data | Good for complex shared data
- Less setup | More structure
- No middleware by default | Supports middleware and DevTools
- Example: theme | Example: shopping cart

- Context is useful for simple app-wide values like theme or auth user.

- Redux is better when many screens update the same state.

- Redux gives better debugging for large state changes.

## When To Use Redux; Redux Use Case; Do I Need Redux; Redux State Management

- Use Redux when state is shared across many parts of the app.

- We use it when updates are complex and need a clear flow.

- The main benefit is predictable state changes.

- Real example: a shopping cart can be read and updated from many pages.

- For small local UI state, useState or Context is usually enough.

```
const items = useSelector(state => state.cart.items)
dispatch(addToCart(product))
```

## Redux Core Principles; Redux Basics; Three Principles Of Redux; Redux Flow

- Redux stores app state in one main store.

- Components cannot change state directly; they dispatch actions.

- Reducers receive actions and return the next state.

- The main benefit is easy debugging because changes follow one direction.

- Real example: login action updates the user data in the store.

```
dispatch({ type: 'auth/login', payload: user })
```

## Redux Store; Store In Redux; configureStore; Redux State Tree

- The Redux store holds the complete Redux state of the app.

- We create it using reducers, usually with configureStore .

- Components read data from the store and dispatch actions to update it.

- The main benefit is having one clear place for shared state.

- In React, we pass the store using  .

```
const store = configureStore({ reducer: rootReducer })
```

## Redux Reducer; Reducer Function; Pure Function; Redux State Update

- A reducer is a function that returns the next state based on an action.

- We use reducers to keep state update logic in one place.

- The main benefit is predictable state updates.

- A reducer should not call APIs or directly change old state.

- Redux Toolkit allows simple-looking updates using Immer internally.

```
function reducer(state, action) {
  return { ...state, count: state.count + 1 }
}
```

## Redux Action; Action Object; Action Creator; Action Type; Payload

- An action is a plain object that tells Redux what happened.

- It usually has a type and sometimes a payload .

- We use actions to request state changes in a clear way.

- The main benefit is every state change has a clear reason.

- Real example: addTodo('Buy milk') creates an action to add a todo.

```
{ type: 'todos/add', payload: 'Buy milk' }
```

## React Redux; Provider; useSelector; useDispatch; Connect Redux To React

- React Redux connects React components with the Redux store.

- Provider gives store access to the whole React app.

- useSelector reads data from the store.

- useDispatch sends actions to update the store.

- Modern React Redux uses hooks more than the older connect pattern.

```
const user = useSelector(state => state.auth.user)
const dispatch = useDispatch()
```

## Redux Data Flow; Unidirectional Data Flow; Redux Cycle; State Update Flow

- Redux data flows in one direction.

- A component dispatches an action when something happens.

- The reducer uses that action to create the next state.

- The UI re-renders when the selected state changes.

- Real example: click add to cart, dispatch action, update cart, show new count.

```
Click → dispatch action → reducer → store update → UI update
```

## Redux Toolkit; RTK; Modern Redux; Redux Toolkit Benefits

- Redux Toolkit is the recommended way to write Redux today.

- It reduces boilerplate using createSlice and configureStore .

- The main benefit is writing Redux code faster and cleaner.

- It also includes good default setup for middleware and DevTools.

- Real example: one slice can create reducers and actions together.

```
const slice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: { increment: state => { state.value++ } },
})
```

## createSlice; Redux Toolkit Slice; RTK Slice; Reducers And Actions

- createSlice creates Redux actions and reducers together.

- We use it to keep one feature's state logic in one place.

- The main benefit is less manual Redux code.

- Each reducer function automatically gets an action creator.

- Real example: counterSlice.actions.increment() is created automatically.

```
const action = counterSlice.actions.increment()
```

## Redux Thunk; Async Actions; Thunk Middleware; API Call In Redux

- Redux Thunk helps Redux handle async work like API calls.

- It allows an action creator to return a function.

- We use it to dispatch loading, success, and error actions.

- The main benefit is keeping async logic outside reducers.

- Real example: fetch user data and then save it in Redux.

```
const fetchUser = id => async dispatch => {
  const user = await api.getUser(id)
  dispatch(setUser(user))
}
```

## createAsyncThunk; RTK Async Thunk; Async API Calls; Redux Toolkit Async

- createAsyncThunk is Redux Toolkit's helper for async actions.

- It automatically creates pending, fulfilled, and rejected actions.

- We use it to manage API loading and error states easily.

- The main benefit is less manual async Redux code.

- Real example: fetch users and handle the result in extraReducers .

```
export const fetchUsers = createAsyncThunk(
  'users/fetch',
  () => api.getUsers()
)
```

## Redux Middleware; Middleware In Redux; Logger Middleware; Side Effects

- Middleware runs between dispatching an action and reaching the reducer.

- We use middleware for async work, logging, analytics, and error tracking.

- The main benefit is keeping reducers pure and simple.

- Real example: logger middleware can print every dispatched action.

- Common middleware examples are Thunk, Saga, and custom loggers.

```
const logger = store => next => action => {
  console.log(action.type)
  return next(action)
}
```

## Redux Saga vs Redux Thunk; Saga vs Thunk; Async Middleware Comparison

- Redux Thunk | Redux Saga

- Simple async functions | Generator-based async flow
- Easy for normal API calls | Better for complex workflows
- Less setup | More setup
- Good for CRUD apps | Good for retries and cancellation
- Easier for beginners | Needs more learning

- Thunk is enough for most simple API calls.

- Saga is useful when async flow has retries, cancellation, or step-by-step workflows.

- Real example: Thunk for fetching users, Saga for a complex checkout process.

## Immutability In Redux; Immutable State; Redux State Update; Why Immutable

- Immutability means we create new state instead of changing old state directly.

- Redux uses this to detect changes quickly.

- The main benefit is fewer hidden bugs and better re-rendering.

- Direct mutation can cause UI updates to be missed.

- Redux Toolkit uses Immer, so update code can look simple but stay immutable.

```
return { ...state, count: state.count + 1 }
```

## combineReducers; Split Reducers; Modular Redux; Root Reducer

- combineReducers joins many small reducers into one root reducer.

- We use it to organize Redux state by feature.

- The main benefit is cleaner files in large apps.

- Real example: auth , cart , and products can have separate reducers.

- The keys define state names like state.auth and state.cart .

```
const rootReducer = combineReducers({ auth, cart, products })
```

## Zustand And Jotai; Lightweight State Management; Zustand vs Redux; Jotai

- Zustand and Jotai are lighter state management options than Redux.

- Zustand uses a simple store with hooks.

- Jotai manages state using small atoms.

- The main benefit is less boilerplate for small and medium apps.

- Use them when Redux feels too heavy for the project.

```
const useStore = create(set => ({
  count: 0,
  inc: () => set(s => ({ count: s.count + 1 })),
}))
```

## State Management Choices; Local State vs Context vs Redux; Choosing State Tool

- State Tool | Best Use Case

- useState | One component state
- Lifted state | Shared by nearby components
- Context API | Simple app-wide values
- Redux | Complex shared state
- Zustand or Jotai | Simple global state with less setup

- Start with the simplest state solution first.

- Use bigger tools only when state becomes hard to manage.

- Real example: dropdown open state can stay in useState , but cart state may need Redux.

## Error Boundaries; React Error Boundary; Catch Render Errors; Fallback UI

- Error boundaries catch render errors in a part of the React tree.

- We use them to show a fallback UI instead of crashing the full page.

- The main benefit is a better user experience when one component fails.

- Error boundaries do not catch event handler or async errors.

- They are still usually written as class components.

```
<ErrorBoundary fallback={<p>Something went wrong</p>}>
  <Dashboard />
</ErrorBoundary>
```

## React Query; TanStack Query; Server State; useQuery; Data Fetching

- React Query manages server data in React apps.

- We use it for API data, caching, loading, errors, and refetching.

- The main benefit is less manual useEffect code for API calls.

- Real example: fetch todos and keep them cached automatically.

- It is best for server state, not local UI state.

```
const { data, isLoading } = useQuery({
  queryKey: ['todos'],
  queryFn: fetchTodos,
})
```

## RTK Query; Redux Toolkit Query; Data Fetching; createApi; API Cache

- RTK Query is the data fetching tool built into Redux Toolkit.

- We define API endpoints using createApi .

- It automatically creates hooks like useGetUserQuery .

- The main benefit is built-in caching and request handling.

- Use it when the project already uses Redux Toolkit.

```
const { data, isLoading } = useGetUserQuery(userId)
```

## React vs React Native; React Native vs React; Web vs Mobile React

- React | React Native

- Builds web apps | Builds mobile apps
- Uses browser DOM | Uses native mobile views
- Uses div and span | Uses View and Text
- Runs in browser | Runs on iOS and Android
- Uses React concepts | Uses the same React concepts

- Both use components, props, state, hooks, and composition.

- The main difference is the UI elements and platform.

- Real example: a useAuth hook can work in both, but UI tags will be different.

```
return <Text>{user.name}</Text>
```

Previous

Rendering and Performance

Up next

Forms Accessibility and Security

© Copyright 2026. All rights reserved.

Designed & Developed By Durga Prasad - Mob: 9030505066

---

# Forms Accessibility and Security

Source: https://full-stack-interview-ecru.vercel.app/fullstack-dev/forms-accessibility-and-security

## XSS; Cross-Site Scripting; XSS Attack; Script Injection; Web Security

- XSS means an attacker adds harmful JavaScript into a web page.

- It usually happens when we show user input as raw HTML.

- React protects normal JSX text by escaping it automatically.

- Avoid dangerouslySetInnerHTML unless the HTML is trusted and cleaned.

- Real example: clean blog comments before showing them on the page.

```
import DOMPurify from 'dompurify'

const safeHtml = DOMPurify.sanitize(userHtml)
```

## CSRF; Cross-Site Request Forgery; CSRF Token; Cookie Attack; Web Security

- CSRF means an attacker makes a logged-in user send an unwanted request.

- It is dangerous because the browser automatically sends cookies.

- We use a CSRF token to prove the request came from our real form.

- SameSite cookies also help reduce CSRF attacks.

- Real example: a payment form should verify a CSRF token before submitting money.

```
<input type="hidden" name="csrf_token" value="token123" />
```

## HTTPS; TLS; Secure Connection; HTTP vs HTTPS; Website Security

- HTTPS keeps data safe between the browser and the server.

- It protects passwords, tokens, and form data from being read by others.

- HTTP is not safe for login pages or payment pages.

- Browsers trust HTTPS websites more than HTTP websites.

- Real example: login forms should always submit data to an https:// URL.

```
<form action="https://example.com/login" method="POST">
  <button type="submit">Login</button>
</form>
```

## Input Validation; Form Security; Server-Side Validation; Sanitize Input; Never Trust User Input

- Input validation means checking user data before using it.

- Client-side validation is helpful, but server-side validation is required.

- Users can bypass frontend validation using DevTools or API tools.

- Sanitizing input helps remove unsafe content like harmful scripts.

- Real example: check email format again in the API before saving it.

```
import { z } from 'zod'

const schema = z.object({ email: z.string().email() })
schema.parse({ email: 'test@gmail.com' })
```

## React Forms; Controlled Input; Form State; preventDefault; Form Submit

- React forms usually store input values in component state.

- e.preventDefault() stops the browser from reloading the page.

- Controlled inputs make it easy to validate and update form values.

- Keep form values, errors, and loading state clearly separated.

- Real example: a login form stores email and password in state.

```
const [email, setEmail] = useState('')

<input value={email} onChange={e => setEmail(e.target.value)} />
```

## React Hook Form; useForm; Form Library; Uncontrolled Inputs; Form Validation

- React Hook Form is a library used to manage forms easily in React.

- It reduces repeated code for values, errors, and validation.

- It uses uncontrolled inputs, so large forms can perform better.

- register connects an input field with validation rules.

- Real example: use it for signup forms, profile forms, and admin forms.

```
const { register, handleSubmit } = useForm()

<input {...register('email', { required: true })} />
```

## Controlled Component; Controlled Input; Controlled vs Uncontrolled; React Form Input

- A controlled component means React state controls the input value.

- The input value comes from state using the value prop.

- The value changes through the onChange event.

- It is useful when we need validation, formatting, or live updates.

- Real example: search boxes often use controlled inputs.

```
<input value={name} onChange={e => setName(e.target.value)} />
```

## Accessibility; A11y; Accessible Forms; Screen Reader; Keyboard Navigation

- Accessibility means making the website usable for everyone.

- Use proper HTML elements like label , button , and input .

- Keyboard users should be able to use the full form.

- Error messages should be clear and connected to the input field.

- Real example: connect an email input with its error message using aria-describedby .

```
<label for="email">Email</label>
<input id="email" aria-describedby="email-error" />
<p id="email-error">Enter a valid email</p>
```

## Error Handling in React; Error Boundary; Async Error; Fallback UI; Retry Button

- Error handling means showing a safe message when something fails.

- Error boundaries catch UI rendering errors in React components.

- API errors should be handled separately with error state.

- A good fallback UI helps the user continue instead of seeing a blank page.

- Real example: show a retry button when loading user data fails.

```
if (error) {
  return <button onClick={refetch}>Retry</button>
}

return <Profile data={data} />
```

## Data Persistence in React; localStorage; sessionStorage; Cookies; Browser Storage

- React state is temporary and disappears after page refresh.

- Use a backend database for important business data.

- Use localStorage for small non-sensitive data like theme preference.

- Do not store passwords or sensitive tokens in browser storage.

- Real example: save dark mode preference in localStorage .

```
localStorage.setItem('theme', 'dark')
const theme = localStorage.getItem('theme')
```

Previous

State Management and Advanced Patterns

Up next

React Ecosystem and Tooling

© Copyright 2026. All rights reserved.

Designed & Developed By Durga Prasad - Mob: 9030505066

---

# React Ecosystem and Tooling

Source: https://full-stack-interview-ecru.vercel.app/fullstack-dev/react-ecosystem-and-tooling

## React Router; Routing In React; Client Side Routing; React Router DOM; SPA Navigation

- React Router helps us move between pages in a React app without full page reload.

- It is commonly used in single page applications.

- Use  for normal navigation and useNavigate() for navigation from JavaScript logic.

- Avoid normal  tags for internal routes because they reload the full app.

- Real example: moving from /products to /products/10 in an e-commerce app.

```
import { BrowserRouter, Routes, Route, Link } from "react-router-dom"

function App() {
  return (
    <BrowserRouter>
      {/* Link changes page without full reload */}
      <Link to="/users">Users</Link>

      {/* Routes decide which component to show */}
      <Routes>
        <Route path="/users" element={<UserList />} />
      </Routes>
    </BrowserRouter>
  )
}
```

## Routes And Route Components; React Router V6 Routes; Route Setup; Route Mapping

- Routes is the wrapper that holds all route definitions.

- Route connects a URL path with a component.

- In React Router v6, we use element={} .

- It keeps page navigation clean and organized.

- Real example: /login shows Login , and /dashboard shows Dashboard .

```
<Routes>
  {/* Shows Login component for /login */}
  <Route path="/login" element={<Login />} />

  {/* Shows Dashboard component for /dashboard */}
  <Route path="/dashboard" element={<Dashboard />} />
</Routes>
```

## Route Parameters; useParams; Dynamic URL Segments; Read URL Param; Dynamic Routing

- Route parameters help read dynamic values from the URL.

- useParams() is used to access those values inside a component.

- It is useful for detail pages like user profile or product details.

- The parameter name should match the route path.

- Real example: /users/5 can show user details for ID 5 .

```
import { useParams } from "react-router-dom"

function UserProfile() {
  // Reads id from /users/:id
  const { id } = useParams()

  return <h2>User ID: {id}</h2>
}
```

## Switch Component; React Router V5 Switch; Legacy Routing; React Router V5 vs V6

- React Router v5 | React Router v6

- Uses Switch | Uses Routes
- Uses component prop | Uses element prop
- Older style | Current style

- Switch was used in React Router v5 to render one matching route.

- In React Router v6, Switch was replaced by Routes .

- New projects should use Routes .

- You may still see Switch in old codebases.

- Real example: older projects may need migration from Switch to Routes .

```
// React Router v6 style
<Routes>
  {/* Routes replaced Switch in v6 */}
  <Route path="/" element={<Home />} />
</Routes>
```

## Webpack; Module Bundler; How Webpack Works; Webpack Loaders; Webpack Plugins

- Webpack bundles JavaScript, CSS, images, and other files for the browser.

- It starts from an entry file and builds a dependency graph.

- Loaders help Webpack understand non-JavaScript files like CSS or images.

- Plugins add extra features like HTML generation or optimization.

- Real example: React apps use bundlers to convert many project files into browser-ready files.

```
module.exports = {
  // Starting file of the app
  entry: "./src/index.js",

  // Final bundled file location
  output: {
    filename: "bundle.js",
  },
}
```

## Vite vs CRA; Create React App vs Vite; Start React Project; React Build Tool

- Vite | Create React App

- Faster development server | Slower compared to Vite
- Modern tooling | Older setup
- Common choice now | Mostly used in older projects

- Vite is commonly preferred for new React projects.

- It starts faster and gives quick hot reload.

- CRA was popular earlier but is less preferred now.

- Vite setup is simple for practice projects and interview tasks.

- Real example: use Vite when starting a new React learning project.

```
# Create a new React app using Vite
npm create vite@latest my-app -- --template react

# Move into the project folder
cd my-app

# Install dependencies
npm install

# Start the development server
npm run dev
```

## npm And node_modules; Package Manager; npm install; yarn; pnpm

- npm is used to install and manage project packages.

- node_modules contains the installed packages.

- package.json stores project dependencies and scripts.

- package-lock.json locks exact package versions.

- Real example: installing React Router adds it to the project dependencies.

```
# Install React Router package
npm install react-router-dom

# Start the project using package.json script
npm run dev
```

## ESLint; Linting React Code; React Hooks ESLint Plugin; Exhaustive Deps

- ESLint helps find code mistakes and style issues early.

- It improves code quality before running the app.

- React projects often use ESLint rules for hooks.

- The exhaustive-deps rule helps avoid missing dependencies in useEffect .

- Real example: ESLint can warn if a hook dependency is missing.

```
useEffect(() => {
  // Runs when userId changes
  fetchUser(userId)
}, [userId])
```

## Storybook; Component Development In Isolation; Storybook For UI; Component Stories

- Storybook helps build and test UI components separately.

- It is useful for reusable components like Button, Card, Modal, and Form.

- Designers and developers can review components without running the full app.

- It helps document different states of a component.

- Real example: show primary, disabled, and loading states of a Button.

```
export const Primary = {
  // Shows Button with primary label in Storybook
  args: {
    label: "Save",
  },
}
```

## Styled Components; CSS In JS; styled-components Library; CSS In JavaScript

- styled-components lets us write CSS inside JavaScript files.

- It keeps component styles close to the component.

- Styles can change based on props.

- It helps avoid global CSS class conflicts.

- Real example: one Button can have different colors based on a primary prop.

```
import styled from "styled-components"

// Creates a styled button component
const Button = styled.button`
  background: ${(props) => (props.primary ? "blue" : "gray")};
`
```

## React Strict Mode; StrictMode In Development; Double Render Strict Mode; React Development Check

- StrictMode helps find possible problems during development.

- It does not affect the production build.

- It may run some code twice in development to detect unsafe logic.

- It helps catch side-effect issues early.

- Real example: it can expose incorrect API calls inside useEffect .

```
import { StrictMode } from "react"

// StrictMode checks the app during development
<StrictMode>
  <App />
</StrictMode>
```

## React vs Angular; React vs Angular Comparison; Library vs Framework; Frontend Choice

- React | Angular

- UI library | Full framework
- More flexible | More structured
- Uses JSX | Uses templates
- Common with extra libraries | Comes with many built-in features

- React mainly focuses on building UI.

- Angular gives a full structure with many built-in tools.

- React is flexible, but we choose extra tools ourselves.

- Angular is opinionated and gives more rules by default.

- Real example: React is common for flexible apps, Angular is common in structured enterprise projects.

## Node.js vs React; Node vs Frontend Framework; Backend vs Frontend; Full Stack JavaScript

- Node.js | React

- Runs JavaScript on the server | Builds UI in the browser
- Used for APIs and backend logic | Used for components and screens
- Handles files, databases, servers | Handles user interface

- Node.js is used for backend development.

- React is used for frontend UI development.

- Both use JavaScript but solve different problems.

- They are often used together in full-stack apps.

- Real example: Node.js provides /api/users , and React displays users on the page.

## React DevTools; Debugging React Components; React DevTools Profiler; Inspect Component State

- React DevTools helps inspect React components in the browser.

- We can check props, state, and component hierarchy.

- The Profiler helps find slow renders.

- It is useful for debugging UI issues quickly.

- Real example: check why a component is re-rendering too many times.

```
function UserCard({ user }) {
  // React DevTools can inspect this user prop
  return <h2>{user.name}</h2>
}
```

## Vitest; Vite Native Unit Testing; Vitest Testing Framework; Fast React Testing

- Vitest is a fast testing framework that works well with Vite.

- It is used to test JavaScript and React code.

- It has Jest-like syntax, so it is easy to learn.

- It supports mocks, assertions, and test runners.

- Real example: test if a helper function returns the correct result.

```
import { expect, test } from "vitest"

test("adds two numbers", () => {
  // Checks the expected result
  expect(2 + 3).toBe(5)
})
```

## Vitest vs Jest; Jest vs Vitest Comparison; React Testing Tools; Unit Testing

- Vitest | Jest

- Faster with Vite projects | Popular and widely used
- Modern setup | Older but stable
- Similar syntax to Jest | Large ecosystem

- Vitest is a good choice for Vite-based projects.

- Jest is still common in many existing React projects.

- Both can test functions and components.

- Vitest usually needs less setup with Vite.

- Real example: choose Vitest for new Vite apps and Jest for existing Jest projects.

## React Testing Library; RTL; Testing User Behavior; getByRole; Component Testing

- React Testing Library tests components from the user's point of view.

- It focuses on behavior, not internal implementation.

- getByRole() is preferred because it matches accessible UI.

- It helps write tests that are closer to real user actions.

- Real example: test whether a user can click a Login button.

```
import { screen } from "@testing-library/react"

// Finds button like a real user would
const button = screen.getByRole("button", { name: "Login" })
```

## vi.mock In Vitest; Mock Modules; vi.fn Spy Function; Mock API Calls In Tests

- vi.mock() replaces real modules with fake ones during tests.

- vi.fn() creates a fake function for testing calls.

- Mocking helps test code without calling real APIs.

- It makes tests faster and more predictable.

- Real example: mock a user API instead of hitting a real backend.

```
import { vi } from "vitest"

// Creates a fake function for testing
const fetchUser = vi.fn(() => ({ name: "John" }))
```

## index.html In React; HTML Entry Point; Root Div In React; SPA HTML Shell

- index.html is the main HTML file loaded by the browser.

- React renders the app inside the root element.

- Usually the root element has id="root" .

- React controls the UI after the app starts.

- Real example: Vite React apps render  inside

 .

```
<!-- React app mounts inside this div -->
<div id="root"></div>
```

## Public Folder vs src Folder; Static Assets In React; Images In React; Asset Handling

- public folder | src folder

- For static files used directly | For files imported in components
- No import needed | Import is needed
- Good for favicon and robots.txt | Good for images used in UI

- Use public for files that should be available as-is.

- Use src for images and assets used inside components.

- Imported assets from src are processed by the build tool.

- Keep reusable UI assets close to the component when possible.

- Real example: logo in a component can stay inside src/assets .

```
import logo from "./assets/logo.png"

function Header() {
  // Imported image is handled by the build tool
  return <img src={logo} alt="App logo" />
}
```

## export default In React; Named Export vs Default Export; Module Exports; Import Export

- Default Export | Named Export

- One main export per file | Multiple exports per file
- Import with any name | Import with exact name
- Good for one component file | Good for utilities and shared items

- Default export is common when a file exports one main component.

- Named export is useful when exporting many functions or components.

- Named exports make imports more consistent.

- Default exports are simple for page or component files.

- Real example: export Button as default from Button.jsx .

```
// Default export for the main component
export default function Button() {
  return <button>Save</button>
}

// Named export for reusable helper
export function formatName(name) {
  return name.trim()
}
```

## Function Component Return; JSX Return In React; Component Must Return JSX; Undefined Return Error

- A React component must return JSX, null , or another valid React value.

- If it returns undefined , React cannot render it properly.

- Use null when you intentionally want to render nothing.

- Keep return logic clear and simple.

- Real example: hide a component when the user is not logged in.

```
function Profile({ user }) {
  // Render nothing if user is missing
  if (!user) return null

  // Render profile when user exists
  return <h2>{user.name}</h2>
}
```

Previous

Forms Accessibility and Security

Up next

Testing Deployment and Integrations

© Copyright 2026. All rights reserved.

Designed & Developed By Durga Prasad - Mob: 9030505066

---

# Testing Deployment and Integrations

Source: https://full-stack-interview-ecru.vercel.app/fullstack-dev/testing-deployment-and-integrations

## Unit Testing; Unit Test; Isolated Testing; Function Testing

- Unit testing means testing one small part of code separately.

- We use it to check one function, method, or component without depending on other parts.

- The main benefit is that unit tests are fast and easy to debug.

- Real example: test a formatDate() function with one input and expected output.

```
expect(formatDate('2024-01-15')).toBe('Jan 15, 2024')
```

## Integration Testing; Integration Test; API Test; Module Testing

- Integration testing means testing multiple parts working together.

- We use it to check if the API, database, and services are connected correctly.

- The main benefit is that it catches issues missed by unit tests.

- Real example: test POST /api/users and check if the user is saved in the database.

- Integration tests are usually slower than unit tests but more realistic.

```
const res = await request(app).post('/api/users').send({ email: 'a@b.com' })
expect(res.status).toBe(201)
```

## End-to-End Testing; E2E Testing; Browser Testing; Full Flow Testing

- End-to-end testing means testing the full app like a real user.

- We use it to check complete flows such as login, checkout, or form submission.

- The main benefit is that it gives confidence that the feature works in real use.

- Real example: open login page, enter email, click login, and check dashboard.

- E2E tests are powerful, but they are slower than unit and integration tests.

```
await page.goto('/login')
await page.fill('[name=email]', 'user@test.com')
await page.click('text=Sign in')
```

## Unit Testing vs Integration Testing vs E2E Testing; Testing Types; Testing Pyramid

- Unit Testing | Integration Testing | E2E Testing

- Tests one small part | Tests multiple parts together | Tests the full user flow
- Very fast | Medium speed | Slowest
- Uses mocks often | May use real services | Uses browser or full app
- Easy to debug | Finds connection issues | Finds real user flow issues

- Unit tests are best for small logic like calculateTotal() .

- Integration tests are best for API and database flow.

- E2E tests are best for complete user journeys.

- A good project usually has many unit tests, some integration tests, and few E2E tests.

## Jest; Jest Testing Framework; JavaScript Testing; Unit Testing Tool

- Jest is a popular JavaScript testing framework.

- We use it to write unit tests and integration tests in JavaScript projects.

- The main benefit is that it gives test runner, assertions, mocks, and coverage together.

- Real example: use Jest to test if add(2, 3) returns 5 .

- Jest commonly uses describe , test , it , and expect .

```
expect(add(2, 3)).toBe(5)
```

## Test Runner; Jest Runner; Vitest Runner; Test Execution Tool

- A test runner is a tool that finds and runs test files.

- We use it to execute tests and see which tests passed or failed.

- The main benefit is that it gives a clear test report.

- Real example: npx jest runs Jest test files in a project.

- Popular JavaScript test runners are Jest and Vitest.

```
npx jest
npx vitest run
```

## TDD; Test-Driven Development; Red Green Refactor; Test First Approach

- TDD means writing the test before writing the actual code.

- We use it to think about expected behavior first.

- The main benefit is cleaner code with good test coverage.

- The common cycle is Red, Green, and Refactor.

- Red means test fails, Green means test passes, and Refactor means clean the code.

```
expect(divide(10, 2)).toBe(5)
```

## Mocking in Tests; Jest Mock; Mock Function; Stub and Spy

- Mocking means replacing a real dependency with a fake one in tests.

- We use it to avoid real database calls, API calls, or email sending.

- The main benefit is testing one part without depending on outside systems.

- Real example: mock an email service so the test does not send real emails.

- Prefer integration tests over heavily mocked unit tests when you want confidence that real systems work together.

```
const sendEmail = jest.fn()
sendEmail('user@test.com')
expect(sendEmail).toHaveBeenCalled()
```

## Cypress; Cypress Testing; E2E Testing; Browser Automation

- Cypress is a tool for testing web apps in a real browser.

- We use it to click buttons, fill forms, and check page output.

- The main benefit is that it tests the app close to real user behavior.

- Real example: test login by typing email and clicking submit.

- Cypress is commonly used for E2E testing and integration testing.

```
cy.get('input[name=email]').type('user@test.com')
cy.get('button[type=submit]').click()
cy.contains('Welcome').should('be.visible')
```

## Playwright; Playwright Testing; Cross-Browser Testing; E2E Tool

- Playwright is an E2E testing tool from Microsoft.

- We use it to test user flows in Chromium, Firefox, and WebKit.

- The main benefit is cross-browser testing with one test setup.

- Real example: click login and check if the dashboard is visible.

- Playwright also has auto-waiting, which helps reduce timing issues.

```
await page.click('text=Login')
await expect(page.locator('text=Dashboard')).toBeVisible()
```

## React Testing Library; RTL; Component Testing; React Test Behavior

- React Testing Library is used to test React components by user behavior.

- We use it to find elements by text, role, label, or placeholder.

- The main benefit is that tests focus on what the user sees.

- Real example: check if a Submit button is visible and clickable.

- It avoids testing internal component implementation details.

```
screen.getByRole('button', { name: /submit/i })
```

## Code Coverage; Test Coverage; Jest Coverage; Istanbul Coverage

- Code coverage shows how much code is executed by tests.

- We use it to find untested lines, branches, and functions.

- The main benefit is that it helps improve missing test areas.

- Real example: an if/else block should ideally test both conditions.

- High coverage is useful, but it does not guarantee bug-free code.

```
npx jest --coverage
```

## Describe vs It in Jest; Describe Block; It Block; Test Structure

- describe | it / test

- Groups related tests | Defines one test case
- Used for organization | Used for actual checking
- Can contain many tests | Contains one expected behavior

- describe is used to group tests for one feature or function.

- it or test is used to write one test case.

- Real example: describe('login form') can contain success and error tests.

- Hooks like beforeEach can prepare data before each test.

```
describe('login form', () => {
  it('shows error for wrong password', () => {})
})
```

## Jest Matchers; Expect Matchers; toBe; toEqual; toContain; toThrow

- Matchers are methods used with expect() to check test results.

- We use them to compare values, objects, arrays, and errors.

- toBe checks exact value, and toEqual checks object or array content.

- toContain checks if a value exists in an array or string.

- toThrow checks if a function throws an error.

```
expect([1, 2, 3]).toContain(2)
expect({ name: 'John' }).toEqual({ name: 'John' })
```

## Testing Async Code in Jest; Async Await Test; waitFor; findBy

- Async testing means testing code that finishes later, like API calls.

- We use async/await to wait for the result before checking it.

- The main benefit is that tests do not fail before async work finishes.

- In React Testing Library, findBy waits for an element to appear.

- waitFor retries a check until it passes or times out.

```
const message = await screen.findByText('Welcome')
expect(message).toBeVisible()
```

## Vitest; Vite Test Runner; Jest Alternative; Fast JavaScript Testing

- Vitest is a fast JavaScript test runner made for Vite projects.

- We use it to write and run tests with syntax similar to Jest.

- The main benefit is speed and easy setup in Vite apps.

- It supports describe , it , and expect , so Jest users can learn it easily.

- Real example: vitest run runs all tests once.

```
vitest run
vitest
```

Previous

React Ecosystem and Tooling

© Copyright 2026. All rights reserved.

Designed & Developed By Durga Prasad - Mob: 9030505066
