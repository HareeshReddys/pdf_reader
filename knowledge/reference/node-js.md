# Node.js interview reference

Generated from https://full-stack-interview-ecru.vercel.app/fullstack-dev/ for local search.
# Nodejs Fundamentals

Source: https://full-stack-interview-ecru.vercel.app/fullstack-dev/nodejs-fundamentals

## Node.js; NodeJS; Node Runtime; Server-Side JavaScript; What Is Node.js

- Node.js allows us to run JavaScript outside the browser.

- We use it to build backend APIs, servers, CLI tools, and real-time apps.

- The main benefit is we can use JavaScript for both frontend and backend.

- Real example: a React app can call a Node.js API to get user data.

- Node.js is popular because it is fast for I/O-based work like APIs and file handling.

```
node app.js
node -e "console.log('Hello Node')"
```

## Node.js vs Browser JavaScript; Node Runtime vs Browser; Server JavaScript vs Client JavaScript

- Node.js | Browser JavaScript

- Runs on the server | Runs inside the browser
- Has fs , path , and process | Has window , document , and DOM
- Used for APIs and backend logic | Used for UI and user actions
- Cannot directly access DOM | Cannot directly access server files

- Both use the same JavaScript language.

- The main difference is the environment where JavaScript runs.

- Node.js is used for backend work, while browser JavaScript is used for frontend work.

```
// Browser
console.log(document.title)

// Node.js
console.log(process.version)
```

## Node.js Single Threaded; Single Thread Model; Non-Blocking I/O; Node Concurrency

- Node.js runs JavaScript on one main thread.

- It does not wait for slow tasks like file reading or database calls.

- It starts the task, continues other work, and handles the result later.

- This helps Node.js handle many users at the same time.

- The important point is Node.js is single-threaded for JavaScript but still supports async work.

```
setTimeout(() => {
  console.log('Task finished')
}, 1000)

console.log('Node keeps running')
```

## Non-Blocking I/O; Async I/O; Node.js Event Loop; Node Handles Multiple Requests

- Non-blocking I/O means Node.js does not stop while waiting for a slow operation.

- We use it for file reads, API calls, database calls, and network requests.

- The main benefit is better performance for many small requests.

- Real example: while one user waits for database data, Node can serve another user.

- CPU-heavy work can still block Node.js, so it should be handled carefully.

```
const fs = require('fs')

fs.readFile('data.txt', 'utf8', (err, data) => {
  console.log(data)
})

console.log('This runs first')
```

## CommonJS vs ES Modules; CJS vs ESM; require vs import; module.exports vs export

- CommonJS | ES Modules

- Uses require() | Uses import
- Uses module.exports | Uses export
- Older Node.js style | Modern JavaScript style
- Loads modules synchronously | Supports modern module syntax

- CommonJS is the older module system used in Node.js.

- ES Modules are the modern standard JavaScript module system.

- Both can work in Node.js, but mixing them can create confusion.

- For ES Modules, use .mjs or add "type": "module" in package.json .

```
// CommonJS
const express = require('express')

// ES Module
import express from 'express'
```

## require Keyword; CommonJS require; Node Module Loading; Module Caching

- require() is used to import modules in CommonJS.

- We can use it to load local files, built-in modules, and npm packages.

- Node.js runs the module once and stores it in cache.

- The next require() gets the same cached module.

- This improves performance and avoids running the same file again and again.

```
const fs = require('fs')
const config = require('./config')

console.log(config.appName)
```

## V8 Engine; Google V8; JavaScript Engine; How Node.js Runs JavaScript

- V8 is the JavaScript engine used by Node.js and Chrome.

- It converts JavaScript code into machine code.

- This helps JavaScript run faster.

- V8 also manages memory and garbage collection.

- Node.js uses V8 to run JavaScript and adds server-side features on top of it.

```
function add(a, b) {
  return a + b
}

console.log(add(2, 3))
```

## libuv; Node.js libuv; Event Loop Library; Thread Pool; Async I/O Internals

- libuv is a library that helps Node.js handle async work.

- It powers the event loop in Node.js.

- It also helps with file system, networking, DNS, and thread pool work.

- The main benefit is Node.js can handle many async tasks without blocking the main thread.

- Real example: file reading can happen in the background while Node handles other requests.

```
JavaScript Code
Node.js APIs
libuv Event Loop
Operating System
```

## Node.js Core Modules; Built-In Modules; fs; http; path; crypto; os

- Core modules are built into Node.js.

- We can use them without installing any npm package.

- fs is used for file system work.

- http is used to create servers and handle HTTP requests.

- path , os , and crypto are used for paths, system info, and security-related tasks.

```
const fs = require('fs')
const path = require('path')

const filePath = path.join(__dirname, 'data.txt')
console.log(filePath)
```

## Node.js Global Objects; process; console; Buffer; global; __dirname; __filename

- Global objects are available in Node.js without importing them.

- process gives information about the running Node.js app.

- __dirname gives the current folder path in CommonJS.

- __filename gives the current file path in CommonJS.

- Buffer is used to work with binary data like files and streams.

```
console.log(process.version)
console.log(__dirname)
console.log(__filename)
```

## When To Use Node.js; Node.js Use Cases; Backend API; Real-Time App; CLI Tool

- Use Node.js for REST APIs, GraphQL APIs, and backend services.

- Use it for real-time apps like chat apps and notifications.

- Use it for file uploads, streaming, and API gateways.

- Use it for CLI tools and JavaScript build tools.

- Node.js is best when the app spends more time waiting for I/O than doing heavy calculations.

```
const http = require('http')

http.createServer((req, res) => {
  res.end('Hello from Node')
}).listen(3000)
```

## When Not To Use Node.js; Node.js Limitations; CPU-Heavy Work; Node.js Disadvantages

- Node.js is not the best choice for very heavy CPU work.

- A long-running calculation can block the event loop.

- When the event loop is blocked, other users may wait.

- For CPU-heavy work, use worker threads or another backend service.

- Node.js is best for I/O-heavy apps, not calculation-heavy apps.

```
// This can block the event loop
for (let i = 0; i < 1000000000; i++) {
  // heavy calculation
}
```

Up next

Nodejs Event Loop and Async

© Copyright 2026. All rights reserved.

Designed & Developed By Durga Prasad - Mob: 9030505066

---

# Nodejs Event Loop and Async

Source: https://full-stack-interview-ecru.vercel.app/fullstack-dev/nodejs-event-loop-and-async

## Event Loop In Node.js; Node Event Loop; Event Loop Concurrency; How Event Loop Works

- The event loop helps Node.js handle many requests without blocking the main thread.

- It keeps checking if any async task is finished and ready to run.

- Slow work like file reading or API calls is handled outside the main JavaScript thread.

- Heavy CPU work should not run on the main thread because it can freeze the app.

- Real example: a Node server can handle many users while waiting for database responses.

```
// This runs first because it is normal synchronous code
console.log("1 - start")

// This waits for the timer phase
setTimeout(() => console.log("3 - timeout callback"), 0)

// Promise callbacks run before timer callbacks
Promise.resolve().then(() => console.log("2 - promise microtask"))

// This runs before async callbacks
console.log("4 - end of sync code")

// Output: 1, 4, 2, 3
```

## Event Loop Phases; Node Event Loop Phases; Timers Poll Check; Event Loop Order

- The event loop runs in different phases to handle different types of work.

- timers runs setTimeout() and setInterval() callbacks.

- poll handles most I/O work like files, network calls, and HTTP requests.

- check runs setImmediate() callbacks.

- close callbacks clean up closed sockets or connections.

```
// Basic event loop phase order
timers → pending callbacks → idle/prepare → poll → check → close callbacks
```

## Async Await In Node.js; Async Functions; Await Keyword; Asynchronous Code

- async/await helps us write Promise-based code in a cleaner way.

- await pauses only the async function, not the whole Node.js app.

- An async function always returns a Promise.

- Use try/catch to handle errors inside async functions.

- Real example: load user details first, then load that user's orders.

```
async function loadUser(id) {
  try {
    // Wait until user data is received
    const user = await db.findById(id)

    // Wait until user orders are received
    const orders = await db.findOrders(user.id)

    return { user, orders }
  } catch (err) {
    // Handle or log the error
    console.error("Failed to load user:", err)
    throw err
  }
}
```

## Callback In Node.js; Callback Function; Async Callback; Error First Callback

- A callback is a function passed to another function and called later.

- Older Node.js APIs commonly use callbacks.

- Node callbacks usually follow the error-first pattern.

- Always check the error before using the result.

- Real example: reading a file and using its data after the read is complete.

```
const fs = require("fs")

// Read file without blocking the main thread
fs.readFile("config.json", "utf8", (err, data) => {
  // First check if there is any error
  if (err) {
    console.error("Could not read file:", err.message)
    return
  }

  // Use the file data after it is loaded
  const config = JSON.parse(data)
  console.log("Loaded config:", config)
})
```

## Callback Hell; Pyramid Of Doom; Nested Callbacks; Callback Problem; Fix Callback Hell

- Callback hell happens when callbacks are nested too deeply.

- It makes code hard to read and difficult to maintain.

- Error handling becomes repeated at every level.

- We can fix it using Promises or async/await .

- async/await is usually the cleanest option for new code.

```
// async/await keeps the code flat and readable
async function importUsers() {
  // Read users from a file
  const data = await fs.promises.readFile("users.json", "utf8")

  // Convert JSON text into JavaScript data
  const users = JSON.parse(data)

  // Save users into the database
  const result = await db.save(users)

  // Notify users after saving
  await emailService.notify(result.ids)
}
```

## Callback vs Promise vs Async Await; Node Async Patterns; Async Code Comparison

- Callback | Promise | Async/Await

- Old style | Cleaner than callbacks | Cleanest for new code
- Uses nested functions | Uses .then() and .catch() | Uses try/catch
- Common in old APIs | Common in modern APIs | Preferred in modern code

- All three are used to handle async work.

- Callbacks are still common in events and streams.

- Promises help avoid deeply nested callbacks.

- async/await makes async code look easier to read.

- For new code, prefer async/await .

```
async function readFile() {
  try {
    // Wait until the file is read
    const data = await fs.promises.readFile("file.txt", "utf8")

    // Use the file content
    console.log(data)
  } catch (err) {
    // Handle file read errors
    console.error(err)
  }
}
```

## Libuv Thread Pool; Node Thread Pool; Background I/O; UV_THREADPOOL_SIZE

- libuv helps Node.js run some slow work in the background.

- File I/O, DNS lookup, and crypto work can use the thread pool.

- The default thread pool size is usually 4.

- We can increase UV_THREADPOOL_SIZE for heavy file or crypto work.

- CPU-heavy tasks are better handled with worker_threads .

```
# Increase libuv thread pool size before starting Node
UV_THREADPOOL_SIZE=8 node server.js
```

## process.nextTick vs setImmediate; nextTick; setImmediate; Microtask Queue

- process.nextTick() | setImmediate()

- Runs before the next event loop phase | Runs in the check phase
- Very high priority | Runs after I/O callbacks
- Can block I/O if overused | Safer for running after current I/O

- process.nextTick() runs as soon as the current code finishes.

- setImmediate() runs after the poll phase.

- Promise .then() also runs in the microtask queue.

- Avoid recursive process.nextTick() because it can block the event loop.

- Use setImmediate() when you want code to run after I/O work.

```
// Runs in the check phase
setImmediate(() => console.log("setImmediate"))

// Runs as a microtask
Promise.resolve().then(() => console.log("Promise.then"))

// Runs before Promise microtasks in Node
process.nextTick(() => console.log("nextTick"))

// Output: nextTick, Promise.then, setImmediate
```

## Multiple Async Tasks; Promise.all; Parallel Async Operations; Concurrent Tasks

- Promise.all() runs independent async tasks at the same time.

- It is faster than waiting for each task one by one.

- If one Promise fails, Promise.all() fails.

- Use Promise.allSettled() when you want all results, even if some fail.

- Real example: load user, orders, and stats together for a dashboard.

```
async function loadDashboard(userId) {
  // Start all requests together
  const [user, orders, stats] = await Promise.all([
    getUser(userId),
    getOrders(userId),
    getStats(userId)
  ])

  // Return all data after every request is completed
  return { user, orders, stats }
}
```

## Event Emitter In Node.js; EventEmitter; Node Events Module; Emit And On

- EventEmitter lets one part of the app announce an event.

- Other parts can listen to that event using .on() .

- Use .emit() to trigger an event.

- Use .once() when the listener should run only one time.

- Real example: after placing an order, send a confirmation email.

```
const { EventEmitter } = require("events")

class OrderService extends EventEmitter {
  async placeOrder(order) {
    // Save the order first
    const saved = await db.save(order)

    // Notify listeners that order is placed
    this.emit("order:placed", saved)

    return saved
  }
}

const orders = new OrderService()

// Listen for the order placed event
orders.on("order:placed", (order) => {
  emailService.sendConfirmation(order.userId)
})
```

## Blocking vs Non Blocking Code; Blocking I/O; Non Blocking I/O; Sync vs Async Node

- Blocking Code | Non-Blocking Code

- Stops the main thread | Keeps the app responsive
- Other requests must wait | Other requests can continue
- Example: readFileSync() | Example: fs.promises.readFile()

- Blocking code stops Node.js from handling other work.

- Non-blocking code lets Node.js continue while slow work happens.

- In servers, blocking code can delay all users.

- Use async APIs for file, database, and network work.

- Heavy CPU work should go to worker threads.

```
// Good: non-blocking route
app.get("/good", async (req, res) => {
  // File is read without freezing the server
  const data = await fs.promises.readFile("report.csv")
  res.send(data)
})

// Bad: blocking route
app.get("/bad", (req, res) => {
  // This blocks the server until the file is read
  const data = fs.readFileSync("report.csv")
  res.send(data)
})
```

## Async Error Handling In Node.js; try catch Async Await; Promise Error Handling

- Use try/catch for errors inside async/await .

- Use .catch() when working directly with Promises.

- Do not ignore rejected Promises.

- In Express, pass async errors to error-handling middleware.

- Log unexpected errors and rethrow them when needed.

```
async function createUser(data) {
  try {
    // Create user in database
    const user = await db.users.create(data)

    // Send welcome email after user is created
    await emailService.sendWelcome(user.email)

    return user
  } catch (err) {
    // Convert duplicate email error into a clear message
    if (err.code === "DUPLICATE_EMAIL") {
      throw new Error("Email already registered")
    }

    // Re-throw unexpected errors
    throw err
  }
}
```

## Unhandled Exceptions In Node.js; uncaughtException; unhandledRejection; Process Crash

- uncaughtException catches errors not handled by try/catch .

- unhandledRejection catches Promises without .catch() .

- These are only safety nets, not normal error handling.

- After serious errors, log the issue and stop the process safely.

- Use PM2, Docker, or Kubernetes to restart the app.

```
// Catch unexpected synchronous errors
process.on("uncaughtException", (err) => {
  console.error("Uncaught exception:", err)
  process.exit(1)
})

// Catch unhandled Promise errors
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled rejection:", reason)
  process.exit(1)
})
```

## REPL In Node.js; Read Eval Print Loop; Node Interactive Shell; Test Code In Terminal

- REPL is Node's interactive terminal.

- It lets us quickly test JavaScript code.

- Run node without a file name to open it.

- Useful commands include .help , .editor , .load , and .exit .

- The _ variable stores the last result.

```
# Start Node REPL
$ node

# Test a simple expression
> 2 + 2
4

# Create and call a function
> const greet = name => "Hello, " + name
> greet("Alice")
'Hello, Alice'

# Exit the REPL
> .exit
```

Previous

Nodejs Fundamentals

Up next

Nodejs Io Streams and Buffer

© Copyright 2026. All rights reserved.

Designed & Developed By Durga Prasad - Mob: 9030505066

---

# Nodejs Io Streams and Buffer

Source: https://full-stack-interview-ecru.vercel.app/fullstack-dev/nodejs-io-streams-and-buffer

## Streams in Node.js; Node.js Streams; Readable Stream; Writable Stream

- Streams help Node.js handle data piece by piece instead of loading everything at once.

- We use streams for large files, uploads, downloads, and network data.

- The main benefit is better memory usage for large data.

- Common stream types are readable, writable, duplex, and transform.

- Real example: reading a large log file line by line without crashing the server.

```
const fs = require('fs')

const stream = fs.createReadStream('logs.txt', 'utf8')

stream.on('data', chunk => {
  console.log(chunk)
})
```

## Stream Types; Readable vs Writable Stream; Duplex Stream; Transform Stream

- Readable Stream | Writable Stream

- Used to read data | Used to write data
- Data comes out from it | Data goes into it
- Example: fs.createReadStream() | Example: fs.createWriteStream()

- A readable stream gives data, like reading from a file.

- A writable stream receives data, like writing to a file.

- A duplex stream can both read and write data.

- A transform stream can change data while passing it forward.

- Real example: zlib.createGzip() compresses data while streaming.

```
const fs = require('fs')

const source = fs.createReadStream('input.txt')
const target = fs.createWriteStream('output.txt')

source.pipe(target)
```

## Piping in Node.js; pipe() Method; Stream Pipeline; Connect Streams

- Piping means connecting one stream output to another stream input.

- We use pipe() to move data automatically between streams.

- It helps avoid manually reading and writing each chunk.

- For production code, stream.pipeline() is safer than simple pipe() .

- Real example: sending a file directly as an API response.

```
const fs = require('fs')

app.get('/download', (req, res) => {
  fs.createReadStream('report.csv').pipe(res)
})
```

## stream.pipeline; Pipeline Method; Safe Stream Handling; Stream Error Handling

- stream.pipeline() connects streams and handles errors better.

- We use it when multiple streams are connected together.

- It helps clean up streams when something fails.

- It is safer than plain pipe() for real applications.

- Real example: compressing a file and writing the compressed output.

```
const { pipeline } = require('stream')
const fs = require('fs')

pipeline(
  fs.createReadStream('input.txt'),
  fs.createWriteStream('output.txt'),
  err => console.log(err || 'Done')
)
```

## Stream Events; data Event; end Event; error Event; finish Event

- Streams use events to tell us what is happening.

- data runs when a readable stream sends a chunk.

- end runs when the readable stream has no more data.

- finish runs when a writable stream finishes writing.

- Always handle error , because unhandled stream errors can crash the app.

```
const fs = require('fs')

const stream = fs.createReadStream('file.txt')

stream.on('data', chunk => console.log(chunk))
stream.on('end', () => console.log('Done'))
stream.on('error', err => console.log(err.message))
```

## Backpressure in Streams; Stream Pressure; drain Event; Slow Writable Stream

- Backpressure happens when data is coming faster than it can be written.

- Node.js streams manage this by slowing down the readable stream.

- We use streams because they help control memory during heavy data flow.

- The drain event tells us the writable stream is ready again.

- Backpressure prevents memory overload in large file processing.

## Buffer in Node.js; Buffer Class; Binary Data; Raw Bytes

- A Buffer is a small block of raw binary data.

- Node.js uses Buffers when working with files, images, uploads, and network data.

- A Buffer stores bytes, not normal JavaScript text.

- We convert Buffers to strings using an encoding like utf8 , base64 , or hex .

- Real example: an uploaded image is handled as binary data before saving.

```
const buffer = Buffer.from('Hello', 'utf8')

console.log(buffer)
console.log(buffer.toString('utf8'))
```

## Buffer Methods; Buffer.from; Buffer.alloc; Buffer.concat; Buffer to String

- Buffer.from() creates a Buffer from text or existing data.

- Buffer.alloc() creates a safe empty Buffer with a fixed size.

- Buffer.concat() joins multiple Buffers into one.

- toString() converts Buffer data back to readable text.

- Real example: converting a token to base64 before storing it.

```
const token = 'user-123'

const encoded = Buffer.from(token).toString('base64')
const decoded = Buffer.from(encoded, 'base64').toString('utf8')

console.log(decoded)
```

## Buffer Encoding; utf8; base64; hex; Binary Encoding

- Encoding | Meaning

- utf8 | Normal readable text
- base64 | Text-safe encoded data
- hex | Data shown using hexadecimal values

- Encoding decides how bytes are converted to text.

- utf8 is commonly used for normal strings.

- base64 is useful for tokens, images, and safe text transfer.

- hex is useful when we want to inspect byte values.

- Buffer data is raw bytes, encoding only controls conversion.

## fs Module in Node.js; File System Module; readFile; writeFile

- fs is Node.js built-in module for file system operations.

- We use it to read, write, delete, rename, and check files.

- fs/promises is cleaner for modern async and await code.

- Use readFile() for small files that can fit in memory.

- Use streams for large files like logs, reports, and uploads.

```
const fs = require('fs/promises')

async function readConfig() {
  const data = await fs.readFile('config.json', 'utf8')
  console.log(JSON.parse(data))
}
```

## readFile vs createReadStream; File Reading; Small File vs Large File

- readFile() | createReadStream()

- Loads the full file | Reads file in chunks
- Good for small files | Good for large files
- Uses more memory | Uses less memory

- Use readFile() when the full file is needed at once.

- Use createReadStream() when the file is large.

- Streams are better for downloads, uploads, and log processing.

- readFile() can cause memory issues with very large files.

- Choose based on file size and memory safety.

## Sync vs Async fs Methods; readFileSync vs readFile; Blocking vs Non-Blocking

- Sync Method | Async Method

- Blocks the Node.js process | Does not block the process
- Simple but risky in requests | Better for server code
- Example: readFileSync() | Example: readFile()

- Sync methods wait until the file operation is fully completed.

- Async methods allow Node.js to continue handling other work.

- Use sync methods only during startup when needed.

- Avoid sync methods inside API routes or request handlers.

- Async file methods keep the server responsive.

```
const fs = require('fs/promises')

app.get('/report', async (req, res) => {
  const data = await fs.readFile('report.txt', 'utf8')
  res.send(data)
})
```

## __dirname and __filename; Node.js File Path; Current Directory; Current File

- __dirname gives the folder path of the current file.

- __filename gives the full path of the current file.

- We use them to build safe file paths in Node.js.

- Use path.join() instead of joining strings manually.

- These are available in CommonJS modules.

```
const path = require('path')

const filePath = path.join(__dirname, 'data', 'users.json')

console.log(filePath)
```

## import.meta.url; ES Modules; __dirname Alternative; ESM File Path

- import.meta.url is used in ES modules instead of __dirname .

- ES modules are used with .mjs or "type": "module" .

- We convert import.meta.url into a normal file path.

- This helps build safe paths in modern Node.js projects.

- __dirname is CommonJS, import.meta.url is ES module style.

```
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
```

Previous

Nodejs Event Loop and Async

Up next

Nodejs Process and Child Processes

© Copyright 2026. All rights reserved.

Designed & Developed By Durga Prasad - Mob: 9030505066

---

# Nodejs Process and Child Processes

Source: https://full-stack-interview-ecru.vercel.app/fullstack-dev/nodejs-process-and-child-processes

## Process Object; Node Process; process.env; process.argv; process.exit

- process is a global Node.js object that gives details about the running app.

- process.env is used to read values like port number, database URL, or API key.

- process.argv is used to read command-line inputs passed to a Node.js script.

- process.exit(0) stops the app successfully, and process.exit(1) stops it with an error.

- Real example: a deployment server can read PORT from environment variables.

```
// Run like this: node script.js input.csv

// Read the file name from command-line input
const inputFile = process.argv[2]

// Read output folder from environment variable, or use default folder
const outputDir = process.env.OUTPUT_DIR || './out'

// Read port from environment variable, or use 3000
const port = Number(process.env.PORT) || 3000

// Stop the script if input file is missing
if (!inputFile) {
  console.error('Please provide an input file')
  process.exit(1)
}

console.log('Reading:', inputFile)
console.log('Output folder:', outputDir)
console.log('Port:', port)
```

## Child Process; child_process Module; Run Shell Commands From Node; spawn exec fork

- A child process lets Node.js run another program or command outside the main app.

- exec is useful for simple commands where we need the final output.

- spawn is better for long-running commands because it gives output step by step.

- fork is used to run another Node.js file as a separate process.

- Real example: Node can run Git commands, image processing tools, or background scripts.

```
const { exec, spawn } = require('child_process')

// exec runs a simple command and gives final output
exec('git log --oneline -5', (error, stdout) => {
  if (error) {
    console.error('Command failed:', error.message)
    return
  }

  console.log('Recent commits:')
  console.log(stdout)
})

// spawn runs a command and streams output live
const ping = spawn('ping', ['-c', '4', 'google.com'])

// Print output as soon as it comes
ping.stdout.on('data', data => {
  process.stdout.write(data)
})

// Run when command is completed
ping.on('close', code => {
  console.log('Process finished with code:', code)
})
```

## spawn vs exec vs fork; Child Process Methods; exec vs spawn; fork Node Script

- Method | Best Use

- exec | Small commands with final output
- spawn | Long-running commands with live output
- fork | Running another Node.js file

- exec stores the full output in memory before returning it.

- spawn gives output as a stream, so it is better for large output.

- fork is mainly used for Node.js worker files.

- All three create separate processes outside the main Node.js app.

- Real example: use spawn for tools like build scripts, logs, or file processing.

```
const { fork, spawn } = require('child_process')

// fork runs another Node.js file separately
const worker = fork('./worker.js')

// Send data to the worker process
worker.send({ file: 'photo.jpg' })

// Receive result from the worker process
worker.on('message', result => {
  console.log('Worker result:', result)
})

// spawn streams command output directly
const build = spawn('npm', ['run', 'build'])

// Show build output in the terminal
build.stdout.pipe(process.stdout)
build.stderr.pipe(process.stderr)
```

## Worker Threads vs Child Process; worker_threads; CPU Intensive Work; Node.js Performance

- Worker Threads | Child Process

- Runs inside same Node process | Runs as a separate OS process
- Shares memory more easily | Has separate memory
- Good for CPU-heavy JavaScript | Good for external programs

- Worker threads help run heavy JavaScript work without blocking the main thread.

- Child processes are more isolated because they run separately from the main app.

- Use worker threads for tasks like heavy calculations or large JSON processing.

- Use child processes for running shell commands or separate services.

- Real example: image resizing or report generation can run outside the main request flow.

```
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads')

if (isMainThread) {
  // Main thread creates a worker for heavy work
  const worker = new Worker(__filename, {
    workerData: { numbers: [1, 2, 3, 4, 5] }
  })

  // Receive result from worker
  worker.on('message', result => {
    console.log('Sum:', result)
  })
} else {
  // Worker thread runs this heavy logic
  const sum = workerData.numbers.reduce((total, num) => total + num, 0)

  // Send result back to main thread
  parentPort.postMessage(sum)
}
```

## Cluster Module; Node.js Cluster; Multi Core Node; Scale Node App On CPUs

- A single Node.js process normally uses one CPU core.

- cluster helps run multiple Node.js worker processes on multiple CPU cores.

- The primary process creates and monitors worker processes.

- If one worker crashes, the primary process can start a new one.

- Shared data like sessions should be stored in Redis or a database, not inside memory.

```
const cluster = require('cluster')
const http = require('http')
const os = require('os')

if (cluster.isPrimary) {
  // Get number of CPU cores
  const totalCPUs = os.cpus().length

  // Create one worker for each CPU core
  for (let i = 0; i < totalCPUs; i++) {
    cluster.fork()
  }

  // Restart worker if it crashes
  cluster.on('exit', () => {
    console.log('Worker crashed, starting a new one')
    cluster.fork()
  })
} else {
  // Each worker runs the same server
  http.createServer((req, res) => {
    res.end('Handled by worker: ' + process.pid)
  }).listen(3000)
}
```

## Graceful Shutdown; SIGTERM; SIGINT; Clean Server Stop; Node Process Signals

- Graceful shutdown means closing the server safely before the app stops.

- SIGTERM is usually sent by Docker, Kubernetes, PM2, or hosting platforms.

- SIGINT happens when we press Ctrl + C in the terminal.

- During shutdown, we should stop new requests and close database connections.

- Real example: during deployment, old requests should finish before the server exits.

```
const express = require('express')
const app = express()

app.get('/', (req, res) => {
  res.send('Server is running')
})

// Start the server
const server = app.listen(3000, () => {
  console.log('Server running on port 3000')
})

function shutdown(signal) {
  console.log('Received signal:', signal)

  // Stop accepting new requests
  server.close(() => {
    console.log('Server closed safely')

    // Close database or queue connections here
    process.exit(0)
  })

  // Force exit if shutdown takes too long
  setTimeout(() => {
    console.error('Force closing server')
    process.exit(1)
  }, 10000)
}

// Handle app stop from Docker, PM2, or Kubernetes
process.on('SIGTERM', () => shutdown('SIGTERM'))

// Handle Ctrl + C from terminal
process.on('SIGINT', () => shutdown('SIGINT'))
```

## Scale Node.js Application; Node Scaling; PM2 Cluster Mode; Horizontal Scaling; Vertical Scaling

- First improve slow database queries, caching, and code before scaling servers.

- Vertical scaling means using more CPU or memory on the same machine.

- Horizontal scaling means running the app on multiple machines or containers.

- PM2 cluster mode can run one Node.js process per CPU core.

- Shared sessions, cache, queues, and rate limits should use external tools like Redis.

```
# Start app in PM2 cluster mode using all CPU cores
pm2 start app.js -i max --name my-api

# Scale app to exactly 4 workers
pm2 scale my-api 4

# Add 2 more workers
pm2 scale my-api +2

# Check running app processes
pm2 list
```

Previous

Nodejs Io Streams and Buffer

Up next

Nodejs Npm and Config

© Copyright 2026. All rights reserved.

Designed & Developed By Durga Prasad - Mob: 9030505066

---

# Nodejs Npm and Config

Source: https://full-stack-interview-ecru.vercel.app/fullstack-dev/nodejs-npm-and-config

## npm; Node Package Manager; npm Install; Manage Packages

- npm is the default package manager that comes with Node.js.

- We use npm to install packages, manage versions, and run project scripts.

- It helps us add ready-made code instead of writing everything from scratch.

- Real example: in a Node API, we can install express using npm.

- Important point: npm uses package.json to track project packages and scripts.

```
npm install express
npm install -D jest
npm run dev
```

## package.json; Node Project Config; Project Metadata; npm Scripts

- package.json is the main config file of a Node.js project.

- It stores project details, dependencies, dev dependencies, and scripts.

- We use it so every developer can install and run the project easily.

- Real example: npm run dev runs the command written inside the dev script.

- Important point: npm start and npm test can run without the run keyword.

```
{
  "name": "my-api",
  "version": "1.0.0",
  "scripts": {
    "dev": "node src/index.js",
    "start": "node dist/index.js"
  }
}
```

## dependencies vs devDependencies; Runtime Packages; Development Packages; npm Dependency Types

- dependencies | devDependencies

- Needed when the app runs | Needed only while developing
- Used in production | Usually skipped in production
- Example: express | Example: jest

- dependencies are packages the app needs at runtime.

- devDependencies are used for testing, building, linting, and development.

- This separation keeps the production install smaller and cleaner.

- Real example: express is a dependency, but typescript can be a dev dependency.

- Important point: use npm install -D package-name for dev dependencies.

```
npm install express
npm install -D typescript
```

## npm install vs npm ci; npm Install; npm CI; package-lock.json

- npm install | npm ci

- Used mostly in local development | Used mostly in CI/CD pipelines
- Can update package-lock.json | Uses exact lock file versions
- Works even when lock file is missing | Needs package-lock.json

- npm install installs packages and may update the lock file.

- npm ci installs the exact package versions from package-lock.json .

- We use npm ci in CI/CD because it gives the same result every time.

- Real example: GitHub Actions or deployment pipelines usually run npm ci .

- Important point: always commit package-lock.json to keep installs consistent.

```
npm install
npm ci
```

## Environment Variables; process.env; dotenv; .env File

- Environment variables store values that can change between environments.

- We use them for values like port number, database URL, and secret keys.

- Node.js reads environment variables using process.env .

- Real example: a local app can read PORT=3000 from a .env file.

- Important point: never commit .env files or secret values to git.

```
DATABASE_URL=postgres://localhost:5432/myapp
JWT_SECRET=my-secret
PORT=3000
```

## NODE_ENV; Node Environment; Development Mode; Production Mode

- NODE_ENV tells the app which environment it is running in.

- Common values are development , test , and production .

- We use it to change behavior based on the environment.

- Real example: in production, Express can run faster and show fewer error details.

- Important point: always set NODE_ENV=production on a production server.

```
NODE_ENV=production node server.js
NODE_ENV=test npm test
```

## Global vs Local npm Install; npm install -g; Local Packages; npx

- Local Install | Global Install

- Installed inside the project | Installed system-wide
- Tracked in package.json | Used from any folder
- Best for project packages | Best for CLI tools

- Local packages are installed inside the current project.

- Global packages are installed once and can be used from anywhere.

- Project dependencies should usually be installed locally.

- Real example: install express locally, but a CLI tool can be installed globally.

- Important point: use npx to run a package without installing it globally.

```
npm install express
npm install -g vercel
npx create-next-app my-app
```

## Install Update Remove Packages; npm install; npm update; npm uninstall

- npm helps us install, update, and remove project packages.

- After package changes, package.json and package-lock.json can be updated.

- We use these commands to keep project dependencies clean.

- Real example: remove an unused package using npm uninstall lodash .

- Important point: commit package file changes after installing or removing packages.

```
npm install package-name
npm update package-name
npm uninstall package-name
```

## Command Line Arguments; process.argv; CLI Arguments; Node.js Args

- Command line arguments are extra values passed when running a Node.js file.

- Node stores them inside the process.argv array.

- We use them to pass small inputs like port, file name, or mode.

- Real example: node app.js 3000 can pass 3000 as an argument.

- Important point: actual custom arguments usually start from index 2 .

```
// node app.js 3000
const port = process.argv[2]
console.log(port)
```

## LTS Releases; Long Term Support; Node Version; Active LTS

- LTS means Long Term Support.

- LTS Node versions get security fixes and bug fixes for a longer time.

- We use LTS versions for production apps because they are more stable.

- Real example: a company project should run on an active Node LTS version.

- Important point: avoid odd-numbered Node versions for long-running production apps.

## Separate Config for Dev and Prod; Environment Specific Config; Node Config Management

- Separate config means using different values for development and production.

- We use it because local and production apps usually need different settings.

- It keeps secrets and environment-specific values outside the source code.

- Real example: local app can use a local database, while production uses a cloud database.

- Important point: read config from environment variables and validate required values at startup.

```
const config = {
  port: process.env.PORT || 3000,
  dbUrl: process.env.DATABASE_URL,
  env: process.env.NODE_ENV || 'development'
}
```

Previous

Nodejs Process and Child Processes

Up next

Nodejs Http and Express

© Copyright 2026. All rights reserved.

Designed & Developed By Durga Prasad - Mob: 9030505066

---

# Nodejs Http and Express

Source: https://full-stack-interview-ecru.vercel.app/fullstack-dev/nodejs-http-and-express

## Express.js; Express Framework; Node.js Web Framework; Backend API Framework; Express Server

- Express.js is a Node.js framework used to build APIs and web servers easily.

- It makes routing, middleware, request handling, and response handling simpler.

- It helps avoid writing too much manual code with Node's built-in http module.

- It is commonly used for login APIs, CRUD APIs, dashboards, and backend services.

- Express is lightweight, so we can add only the packages we need.

```
const express = require("express")
const app = express()

// This allows Express to read JSON data from request body
app.use(express.json())

// This route sends a simple health response
app.get("/health", (req, res) => {
  res.json({ status: "ok" })
})

// This starts the server on port 3000
app.listen(3000, () => {
  console.log("Server running on port 3000")
})
```

## Create HTTP Server In Node.js; http.createServer; Built-in HTTP Module; Raw Node Server

- Node.js has a built-in http module to create a server without Express.

- http.createServer() receives every request and sends a response manually.

- It is useful to understand how servers work internally.

- For real projects, Express is usually easier because routing is cleaner.

- Real example: Express avoids manually checking req.url and req.method for every route.

```
const http = require("http")

// This creates a basic HTTP server
const server = http.createServer((req, res) => {
  // This sets the response type
  res.writeHead(200, { "Content-Type": "text/plain" })

  // This sends the final response
  res.end("Hello from Node.js")
})

// This starts the server on port 3000
server.listen(3000)
```

## Middleware In Express.js; Express Middleware; req res next; app.use; Middleware Function

- Middleware is a function that runs between the request and the final response.

- It is used for logging, authentication, validation, CORS, and error handling.

- Middleware gets access to req , res , and next .

- next() tells Express to move to the next middleware or route.

- Real example: check if a user is logged in before allowing access to profile APIs.

```
function logger(req, res, next) {
  // This prints the request method and URL
  console.log(req.method, req.url)

  // This moves to the next middleware or route
  next()
}

app.use(logger)
```

## Middleware Order In Express; app.use Order; Middleware Execution Order; Express Request Flow

- Middleware runs in the same order it is registered.

- If middleware does not call next() , the request can stop there.

- Global middleware should usually be placed before routes.

- Error middleware should usually be placed after all routes.

- Real example: express.json() should come before routes that read req.body .

```
// This should come first so JSON body is available in routes
app.use(express.json())

// This route can now read req.body
app.post("/users", (req, res) => {
  res.json(req.body)
})
```

## Routing In Express.js; Express Routes; app.get app.post; Route Handler; API Endpoints

- Routing means defining what should happen for each URL and HTTP method.

- app.get() is used to read data.

- app.post() is used to create data.

- app.put() or app.patch() is used to update data.

- app.delete() is used to delete data.

```
// Get all users
app.get("/users", (req, res) => {
  res.json([])
})

// Create a new user
app.post("/users", (req, res) => {
  res.json({ message: "User created" })
})
```

## Request And Response Objects; req res; req.body req.params req.query; Express Request Data

- req contains data coming from the client.

- res is used to send data back to the client.

- req.params is used for URL values like /users/:id .

- req.query is used for query strings like ?page=1 .

- req.body is used for data sent in POST or PUT requests.

```
app.get("/users/:id", (req, res) => {
  // This reads id from the URL
  const userId = req.params.id

  // This sends JSON response
  res.json({ id: userId })
})
```

## Error Handling Middleware In Express; Express Error Handler; Four Parameter Middleware; next error

- Error handling middleware catches errors in one common place.

- It has four parameters: err , req , res , and next .

- It helps avoid repeating error response code in every route.

- Use next(error) to send an error to the error handler.

- Real example: return a proper error response when user data is not found.

```
app.get("/users/:id", (req, res, next) => {
  // This sends the error to the error handler
  next(new Error("User not found"))
})

app.use((err, req, res, next) => {
  // This sends a common error response
  res.status(500).json({ message: err.message })
})
```

## Body Parsing In Express; express.json; req.body; JSON Request Body; Parse Request Data

- Body parsing helps Express read data sent by the client.

- express.json() is used to read JSON request bodies.

- Without it, req.body may be undefined .

- It is commonly used in login, signup, and form submit APIs.

- It should be added before routes that need request body data.

```
// This allows Express to read JSON body
app.use(express.json())

app.post("/login", (req, res) => {
  // This reads email from request body
  const email = req.body.email

  res.json({ email })
})
```

## Environment Variables In Node.js; process.env; dotenv; .env File; App Configuration

- Environment variables store values that can change between local, staging, and production.

- They are commonly used for ports, database URLs, API keys, and secrets.

- process.env is used to read environment variables in Node.js.

- dotenv loads variables from a .env file during local development.

- Secrets should not be hardcoded directly in source code.

```
require("dotenv").config()

// This reads PORT from .env or uses 3000 as fallback
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
```

## REST vs GraphQL; REST API; GraphQL API; API Design Difference; RESTful Services

- REST | GraphQL

- Uses multiple endpoints | Usually uses one endpoint
- Server decides response shape | Client asks for exact data
- Simple and widely used | Flexible for complex data needs
- Easy for CRUD APIs | Useful when data comes from many sources

- REST is simple and works well for most CRUD APIs.

- GraphQL is useful when clients need flexible data selection.

- REST commonly uses HTTP methods like GET , POST , PUT , and DELETE .

- GraphQL reduces over-fetching and under-fetching of data.

- Real example: REST is enough for a simple blog API, but GraphQL can help in complex dashboards.

## JWT Flow; JSON Web Token; JWT Authentication; Token Based Login; Authorization Header

- JWT is commonly used to keep users logged in after login.

- Server creates a token after successful login.

- Client stores the token and sends it with future API requests.

- Server verifies the token before allowing protected access.

- Real example: use JWT to protect profile, orders, and admin APIs.

```
// Client sends token in the Authorization header
fetch("/profile", {
  headers: {
    Authorization: "Bearer my_token_here"
  }
})
```

## Express Router; express.Router; Modular Routes; Route Files; Organize Express App

- express.Router() helps split routes into separate files.

- It keeps the main server file clean.

- It is useful when an app has many features like users, products, and orders.

- Each feature can have its own route file.

- Real example: keep all user APIs inside userRoutes.js .

```
const router = require("express").Router()

// This route belongs to user-related APIs
router.get("/users", (req, res) => {
  res.json([])
})

// This exports the router to use in app.js
module.exports = router
```

## CORS In Express.js; Cross Origin Resource Sharing; cors Middleware; Fix CORS Error

- CORS controls which frontend applications can call our backend API.

- It is needed when frontend and backend run on different domains or ports.

- The cors package is commonly used in Express.

- Without proper CORS setup, browsers can block API requests.

- Real example: React app on port 5173 calling Express API on port 3000 .

```
const cors = require("cors")

// This allows frontend apps to access this API
app.use(cors())

app.get("/api", (req, res) => {
  res.json({ message: "CORS enabled" })
})
```

## Session Management In Express; express-session; HTTP Session; Cookie Session; Redis Session Store

- Sessions store user login data on the server side.

- The browser usually stores only a session ID in a cookie.

- Sessions are useful for traditional web apps.

- For multiple servers, session data is usually stored in Redis or a database.

- Real example: keep a user logged in after they sign in.

```
const session = require("express-session")

app.use(session({
  // This secret signs the session cookie
  secret: "my-secret",

  // This avoids saving unchanged sessions
  resave: false,

  // This avoids saving empty sessions
  saveUninitialized: false
}))
```

## Rate Limiting In Express; express-rate-limit; API Limit; Prevent Brute Force; Request Throttling

- Rate limiting controls how many requests a user can make in a time period.

- It helps protect APIs from spam and brute-force attacks.

- It is commonly used on login and OTP APIs.

- Too many requests can be blocked with a proper error response.

- Real example: allow only 5 login attempts per minute.

```
const rateLimit = require("express-rate-limit")

const loginLimiter = rateLimit({
  // This is the time window
  windowMs: 60 * 1000,

  // This allows only 5 requests per minute
  max: 5
})

app.post("/login", loginLimiter, loginHandler)
```

## Helmet In Express; Secure HTTP Headers; Express Security Middleware; API Security

- Helmet helps set secure HTTP headers automatically.

- It improves basic security for Express applications.

- It helps protect against some common browser-based attacks.

- It is easy to add with one middleware line.

- Real example: use Helmet in production APIs as a basic security layer.

```
const helmet = require("helmet")

// This adds common security headers
app.use(helmet())
```

## Serve Static Files In Express; express.static; Public Folder; Static Assets; Serve HTML CSS JS

- express.static() is used to serve static files like HTML, CSS, images, and JavaScript.

- Static files are usually kept inside a public folder.

- It is useful for simple websites, uploads, and public assets.

- Express automatically serves files from the given folder.

- Real example: serve images from /public/images .

```
// This serves files from the public folder
app.use(express.static("public"))

// Example file path: public/logo.png
// Browser URL: http://localhost:3000/logo.png
```

## WebSockets In Node.js; Real Time Communication; Socket.io; ws Package; Full Duplex Connection

- WebSockets allow two-way real-time communication between client and server.

- Unlike normal HTTP, the connection stays open.

- They are useful for chat apps, live notifications, dashboards, and multiplayer games.

- socket.io and ws are common packages for WebSockets in Node.js.

- Real example: send a new chat message instantly without refreshing the page.

```
const { Server } = require("socket.io")

// This creates a Socket.io server
const io = new Server(server)

io.on("connection", socket => {
  // This runs when a user connects
  console.log("User connected")

  // This listens for chat messages
  socket.on("message", msg => {
    io.emit("message", msg)
  })
})
```

Previous

Nodejs Npm and Config

Up next

Nodejs Testing and Debugging

© Copyright 2026. All rights reserved.

Designed & Developed By Durga Prasad - Mob: 9030505066

---

# Nodejs Testing and Debugging

Source: https://full-stack-interview-ecru.vercel.app/fullstack-dev/nodejs-testing-and-debugging

## Testing Node.js Apps; Node.js Testing; Jest; Unit Testing; Test Runner

- Testing means checking our Node.js code to make sure it works correctly.

- We use tests to catch bugs before the code goes to production.

- Unit tests check small functions, and integration tests check how parts work together.

- Real example: test a login API to confirm it returns the correct success or error response.

```
jest --coverage
```

## Unit Test Structure; Jest Describe It Expect; Test Case; Test Anatomy

- A unit test checks one small function or one small piece of logic.

- describe() groups related tests together in Jest.

- it() or test() defines one specific test case.

- expect() is used to check the actual result against the expected result.

- A good test name should clearly explain what behavior is being tested.

```
describe('add', () => {
  it('returns the sum', () => {
    expect(add(2, 3)).toBe(5)
  })
})
```

## Mocking In Tests; Jest Mock; Mock External Dependency; Fake Dependency

- Mocking means replacing a real dependency with a fake one during testing.

- We use mocks to avoid calling real APIs, databases, or external services.

- Mocks make tests faster, safer, and easier to control.

- Real example: mock a database call and return fake user data.

- In Jest, jest.mock() is commonly used to mock a module.

```
jest.mock('./db')

// Tests use fake DB logic instead of a real DB connection
```

## Stub In Testing; Sinon Stub; Fake Function; Control Function Output

- A stub is a fake function that returns a controlled result in a test.

- We use stubs when we want to test a specific success or error case.

- Stubs help us test code paths that are hard to trigger in real systems.

- Real example: stub a file read function and return fixed test data.

- Jest can create stubs using jest.fn() or jest.spyOn() .

```
const getUser = jest.fn()

getUser.mockReturnValue({ name: 'John' })
```

## Test Pyramid; Unit Test; Integration Test; E2E Test; Testing Strategy

- Unit Test | Integration Test | E2E Test

- Tests one small part | Tests parts together | Tests full user flow
- Fast and simple | Medium speed | Slower
- Example: function test | Example: API route test | Example: login flow test

- The test pyramid means we should write more unit tests and fewer E2E tests.

- Unit tests are fast because they test small logic only.

- Integration tests check if modules, APIs, and databases work together.

- E2E tests check the full flow like a real user using the app.

## Debugging Node.js; Node Inspect; Chrome DevTools; VS Code Debugger

- Debugging means finding and fixing problems in Node.js code.

- We can run Node with --inspect and connect Chrome DevTools or VS Code.

- Breakpoints help pause the code and check variable values step by step.

- The call stack helps us understand how the code reached the current line.

- Real example: use the debugger to find why an API response is undefined.

```
node --inspect server.js
```

## Console Log Debugging; Node.js Logs; Basic Debugging; Debug With Logs

- console.log() is the simplest way to check what is happening in code.

- We can print variable values, API responses, and error messages.

- console.error() is useful for printing errors clearly.

- console.table() shows arrays and objects in a readable table format.

- For production apps, use a proper logger like winston or pino .

```
console.log('user:', user)
console.table(users)
console.error('failed:', error)
```

## Security Vulnerabilities In Node.js; npm Audit; SQL Injection; XSS

- Security in Node.js means protecting the app from unsafe input and weak packages.

- We should validate and sanitize user input on the server side.

- Parameterized queries help prevent SQL injection attacks.

- npm audit helps find known security issues in dependencies.

- Real example: never build SQL queries by directly joining user input strings.

```
db.query('SELECT * FROM users WHERE id = ?', [userId])
```

## ESLint And Prettier; Code Quality; Linting; Formatting Tools

- ESLint helps find code issues and possible bugs before running the app.

- Prettier formats code so the whole project looks consistent.

- We use these tools to keep code clean and easy for the team to read.

- A shared config avoids style confusion between team members.

- Real example: run npx eslint . --fix to automatically fix many lint issues.

```
npx eslint . --fix
```

Previous

Nodejs Http and Express

© Copyright 2026. All rights reserved.

Designed & Developed By Durga Prasad - Mob: 9030505066
