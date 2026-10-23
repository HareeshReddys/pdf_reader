# Data Structures interview reference

Generated from https://full-stack-interview-ecru.vercel.app/fullstack-dev/ for local search.
# Data Structures

Source: https://full-stack-interview-ecru.vercel.app/fullstack-dev/data-structures

## Data Structure; Data Structure Definition; Data Organization; Data Structures Basics

- A data structure is a way to store and organize data for easy use.

- It helps us access, update, search, and delete data efficiently.

- Common examples are array , object , stack , queue , linked list , hash map , tree , and graph .

- Choosing the right data structure can make code faster and easier to maintain.

- Real example: use an array to store products and a hash map to quickly find a product by id.

```
const users = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" }
]
```

## Array; Array Data Structure; Arrays In JavaScript; Ordered List; Index Based Data

- An array stores multiple values in order.

- Each item has an index starting from 0 .

- Reading an item by index is fast.

- Adding or removing from the end is usually fast.

- Adding or removing from the middle can be slow because items need to shift.

```
const fruits = ["apple", "banana", "mango"]

fruits[1] // "banana"
fruits.push("kiwi")
```

## Array vs Linked List; Linked List vs Array; Random Access; Insert Delete Performance

- Array | Linked List

- Fast access by index | Must move node by node
- Insert/delete in middle can be slow | Insert/delete can be fast if node is known
- Commonly used in JavaScript | Mostly used in interviews

- Use an array when you need fast index access.

- Use a linked list when frequent insert/delete is more important than direct access.

- In JavaScript projects, arrays are used much more often.

- Linked lists are useful to understand pointers, nodes, trees, and graphs.

```
const arr = [10, 20, 30]
arr[1] // 20

const node = { value: 10, next: null }
```

## Stack; Stack Data Structure; LIFO; Last In First Out; Push Pop

- A stack follows LIFO , meaning last item added comes out first.

- Think of plates stacked one above another.

- Use push() to add and pop() to remove.

- Common uses are undo, browser back, backtracking, and JavaScript call stack.

- In JavaScript, an array can be used as a stack.

```
const stack = []

stack.push("page1")
stack.push("page2")
stack.pop() // "page2"
```

## Queue; Queue Data Structure; FIFO; First In First Out; Enqueue Dequeue

- A queue follows FIFO , meaning first item added comes out first.

- Think of people standing in a ticket counter line.

- Add items at the back and remove items from the front.

- Common uses are task scheduling, print jobs, and event processing.

- In JavaScript, push() and shift() can be used for a simple queue.

```
const queue = []

queue.push("task1")
queue.push("task2")
queue.shift() // "task1"
```

## Stack vs Queue; LIFO vs FIFO; Push Pop vs Enqueue Dequeue; Data Processing Order

- Stack | Queue

- Last in, first out | First in, first out
- Uses push() and pop() | Uses add and remove order
- Good for undo/backtracking | Good for waiting-line tasks

- Use a stack when the latest item should be handled first.

- Use a queue when the oldest item should be handled first.

- Stack example: undo the last typed action.

- Queue example: process uploaded files one by one.

```
const stack = []
stack.push(1)
stack.pop()

const queue = []
queue.push(1)
queue.shift()
```

## Linked List; Singly Linked List; Node And Pointer; Head And Next

- A linked list is a chain of nodes.

- Each node stores a value and a link to the next node.

- The first node is called the head .

- To find an item, we start from the head and move one by one.

- It is mostly asked in interviews to check data structure understanding.

```
const head = {
  value: "Alice",
  next: {
    value: "Bob",
    next: null
  }
}
```

## Hash Map; Hash Table; Key Value Store; Object As Hash Map; Fast Lookup

- A hash map stores data as key-value pairs.

- It gives fast lookup by key in most cases.

- It is useful for caching, counting, grouping, and checking duplicates.

- In JavaScript, we can use plain objects or Map .

- Real example: store user details by userId for quick access.

```
const usersById = {
  1: { name: "Alice" },
  2: { name: "Bob" }
}

usersById[1] // { name: "Alice" }
```

## Set; Set In JavaScript; Unique Values; Remove Duplicates; Membership Check

- A Set stores only unique values.

- Duplicate values are automatically ignored.

- It is useful for removing duplicates from an array.

- has() is used to quickly check whether a value exists.

- Real example: track selected user ids without duplicates.

```
const tags = ["js", "react", "js"]
const uniqueTags = [...new Set(tags)]

uniqueTags // ["js", "react"]
```

## Map; Map In JavaScript; Map vs Object; Key Value Collection; Non String Keys

- Map | Object

- Keys can be any type | Keys are mostly strings/symbols
- Has .size directly | Need manual counting
- Better for dynamic key-value data | Good for simple structured data

- A Map stores key-value data like an object.

- Map keys can be objects, numbers, strings, or functions.

- It preserves insertion order.

- Use Map when keys are dynamic or not simple strings.

```
const cache = new Map()
const user = { id: 1 }

cache.set(user, "profile data")
cache.get(user) // "profile data"
```

## Tree; Tree Data Structure; Hierarchical Data; Root Node; Parent Child

- A tree stores data in a parent-child structure.

- It starts with one top node called the root .

- Each node can have child nodes.

- Common examples are DOM, folders, menus, and organization charts.

- A binary tree is a tree where each node has maximum two children.

```
const tree = {
  value: "root",
  left: { value: "left", left: null, right: null },
  right: { value: "right", left: null, right: null }
}
```

## Binary Search Tree; BST; Binary Tree Search; Left Smaller Right Greater

- A BST is a binary tree used for faster searching.

- Left side values are smaller than the parent.

- Right side values are greater than the parent.

- A balanced BST can search, insert, and delete efficiently.

- If it becomes unbalanced, it can behave like a linked list.

```
function search(node, target) {
  if (!node) return null
  if (node.value === target) return node
  return target < node.value
    ? search(node.left, target)
    : search(node.right, target)
}
```

## Big O Notation; Time Complexity; Space Complexity; Algorithm Efficiency

- Big O explains how code performance grows when input size grows.

- It is not exact time; it shows the growth pattern.

- O(1) is constant time and usually fastest.

- O(n) grows with input size.

- O(n²) can become slow for large data because of nested loops.

```
arr[0] // O(1)
arr.find(item => item.id === 1) // O(n)
```

## O(1) vs O(n) vs O(n²); Time Complexity Comparison; Big O Examples

- Complexity | Meaning | Example

- O(1) | Same time always | Access array by index
- O(n) | Grows with data | Loop through array
- O(n²) | Nested growth | Nested loops

- O(1) is best when possible.

- O(n) is common and usually acceptable.

- O(n²) should be avoided for large input.

- O(log n) is common in binary search.

```
arr[2] // O(1)
arr.filter(x => x.active) // O(n)
```

## Recursion; Recursive Function; Base Case; Function Calling Itself

- Recursion means a function calls itself.

- It solves a big problem by breaking it into smaller problems.

- A base case is required to stop recursion.

- Without a base case, the function keeps running and crashes.

- Common uses are trees, folders, nested comments, and factorial problems.

```
function factorial(n) {
  if (n <= 1) return 1
  return n * factorial(n - 1)
}

factorial(5) // 120
```

## Choosing Data Structure; When To Use Which Data Structure; Data Structure Selection

- Use Case | Data Structure

- Ordered list | Array
- Fast key lookup | Object / Map
- Unique values | Set
- Last item first | Stack
- First item first | Queue

- Use an array for ordered data.

- Use an object or Map for fast lookup by key.

- Use a Set to avoid duplicates.

- Use a stack for undo or backtracking.

- Use a queue for scheduling or waiting-line tasks.

## Graph; Graph Data Structure; Nodes And Edges; Directed Graph; Undirected Graph

- A graph is a collection of nodes connected by edges.

- Graphs can have cycles, unlike trees.

- A directed graph has one-way connections.

- An undirected graph has two-way connections.

- Real examples are social networks, maps, dependencies, and web links.

```
const graph = {
  Alice: ["Bob", "Carol"],
  Bob: ["Alice", "Dave"],
  Carol: ["Alice"],
  Dave: ["Bob"]
}
```

## BFS vs DFS; Breadth First Search; Depth First Search; Graph Traversal; Tree Traversal

- BFS | DFS

- Goes level by level | Goes deep first
- Uses a queue | Uses stack or recursion
- Good for shortest path | Good for exploring all paths

- BFS checks nearby nodes first.

- DFS goes as deep as possible before coming back.

- BFS is useful for shortest path in unweighted graphs.

- DFS is useful for cycle detection and deep traversal.

```
function dfs(graph, node, visited = new Set()) {
  if (visited.has(node)) return
  visited.add(node)

  for (const next of graph[node]) {
    dfs(graph, next, visited)
  }
}
```

## Frequency Counter Pattern; Count Elements; Hash Map Counting; Anagram Check

- A frequency counter counts how many times each item appears.

- It usually uses an object or Map .

- It helps avoid slow nested loops.

- Common uses are anagram checks, duplicate checks, and character counting.

- It is a common interview pattern for arrays and strings.

```
const freq = {}

for (const char of "hello") {
  freq[char] = (freq[char] || 0) + 1
}

freq // { h: 1, e: 1, l: 2, o: 1 }
```

## Two Pointer Technique; Two Pointers Pattern; Left Right Pointer; Array String Problems

- Two pointers means using two indexes to solve a problem efficiently.

- Usually one pointer starts from the left and one from the right.

- It helps avoid nested loops in many array and string problems.

- Common uses are palindrome check, pair sum, and sorted array problems.

- It often improves performance from O(n²) to O(n) .

```
function isPalindrome(str) {
  let left = 0
  let right = str.length - 1

  while (left < right) {
    if (str[left] !== str[right]) return false
    left++
    right--
  }

  return true
}
```

## Sliding Window Technique; Sliding Window Pattern; Subarray Problems; Longest Substring

- Sliding window is used for continuous parts of an array or string.

- It moves a window across the data instead of recalculating every time.

- It is useful for max sum, longest substring, and subarray problems.

- It can reduce slow solutions to a single pass.

- Real example: find the maximum sum of 3 continuous numbers.

```
function maxSum(arr, k) {
  let sum = arr.slice(0, k).reduce((a, b) => a + b, 0)
  let max = sum

  for (let i = k; i < arr.length; i++) {
    sum += arr[i] - arr[i - k]
    max = Math.max(max, sum)
  }

  return max
}
```

© Copyright 2026. All rights reserved.

Designed & Developed By Durga Prasad - Mob: 9030505066
