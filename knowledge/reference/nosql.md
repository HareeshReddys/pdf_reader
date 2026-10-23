# NoSQL interview reference

Generated from https://full-stack-interview-ecru.vercel.app/fullstack-dev/ for local search.
# Nosql Databases

Source: https://full-stack-interview-ecru.vercel.app/fullstack-dev/nosql-databases

## NoSQL; Non-Relational Database; Flexible Schema; Scalable Database

- NoSQL databases store data in formats like documents, key-value pairs, columns, or graphs.

- They are useful when data structure changes often or does not fit fixed tables.

- NoSQL usually scales well by adding more servers.

- It is commonly used for product catalogs, user sessions, logs, and real-time apps.

- The main trade-off is that joins and strict relationships are harder than SQL.

```
// Insert one product document with flexible fields
await db.collection("products").insertOne({
  name: "Keyboard",
  specs: { layout: "TKL" }
})
```

## SQL vs NoSQL; Relational vs Non-Relational Database; SQL Database vs NoSQL Database

- SQL | NoSQL

- Uses tables and rows | Uses documents, keys, columns, or graphs
- Best for fixed structure | Best for flexible structure
- Strong for joins and transactions | Strong for scale and fast reads/writes
- Example: MySQL, PostgreSQL | Example: MongoDB, Redis

- Use SQL when data has strong relationships and fixed structure.

- Use NoSQL when data changes often or needs high scalability.

- SQL is common for banking, orders, and reports.

- NoSQL is common for logs, sessions, catalogs, and real-time data.

## Types Of NoSQL Databases; Document Store; Key-Value Store; Column Store; Graph Database

- Type | Simple Meaning | Example

- Document | Stores JSON-like records | MongoDB
- Key-value | Stores data using a key | Redis
- Column | Stores data by columns | Cassandra
- Graph | Stores connected data | Neo4j

- Document databases are good for flexible records like products or users.

- Key-value databases are good for cache and sessions.

- Column databases are good for very large write-heavy data.

- Graph databases are good for relationships like friends, routes, or recommendations.

## When To Choose NoSQL; NoSQL Use Cases; Flexible Schema; Horizontal Scaling

- Choose NoSQL when the data shape changes often.

- Choose NoSQL when the app needs to handle huge traffic or data.

- It is useful when reads and writes must be very fast.

- It works well for logs, chat apps, IoT data, user activity, and catalogs.

- Avoid NoSQL when the app needs many joins and strict relational rules.

## MongoDB; MongoDB Database; Document Database; BSON; Collection

- MongoDB is a NoSQL database that stores data as documents.

- A document looks similar to a JavaScript object or JSON.

- It is useful when each record can have different fields.

- MongoDB stores documents inside collections.

- Real example: a product can have different fields based on category.

```
// Insert one user document into the users collection
await db.collection("users").insertOne({
  name: "John",
  role: "admin",
  active: true
})
```

## MongoDB Collection; Collection vs Table; Documents Group; MongoDB Documents

- MongoDB | SQL

- Collection | Table
- Document | Row
- Field | Column

- A collection is a group of MongoDB documents.

- It is similar to a table in SQL, but it does not need a fixed structure.

- Documents inside the same collection can have different fields.

- Example: a products collection can store mobiles, laptops, and books.

- This makes MongoDB flexible for changing application data.

```
// products is a collection that stores product documents
db.collection("products")
```

## BSON; MongoDB BSON; Binary JSON; MongoDB Data Types; ObjectId

- BSON is the format MongoDB uses to store documents internally.

- It is similar to JSON but supports more data types.

- BSON supports values like ObjectId , dates, arrays, and nested objects.

- MongoDB uses BSON because it is fast to store and read.

- Developers usually write normal JavaScript objects, and MongoDB handles BSON internally.

```
// MongoDB stores this document internally as BSON
{
  _id: ObjectId("507f1f77bcf86cd799439011"),
  createdAt: new Date()
}
```

## MongoDB Primary Key; _id Field; ObjectId; Unique Document Id

- Every MongoDB document has an _id field.

- _id works like a primary key and must be unique.

- MongoDB creates an ObjectId automatically if we do not provide one.

- We commonly use _id to find, update, or delete a document.

- Real example: update a user profile using the user's _id .

```
// Find one user by unique _id
await db.collection("users").findOne({ _id: userId })
```

## Update Document In MongoDB; updateOne; updateMany; $set; $push

- Use updateOne() to update one matching document.

- Use updateMany() to update multiple matching documents.

- $set changes or adds a field without replacing the full document.

- $push adds a value into an array field.

- Real example: update user name or add a new item to cart.

```
// Update only the name field of one user
await db.collection("users").updateOne(
  { _id: userId },
  { $set: { name: "John" } }
)

// Add one item into the cartItems array
await db.collection("carts").updateOne(
  { userId },
  { $push: { cartItems: productId } }
)
```

## MongoDB Indexes; Database Index; Query Performance; Faster Search

- An index helps MongoDB find data faster.

- Without an index, MongoDB may scan many documents.

- Indexes are useful for fields used often in search, filter, or sort.

- Too many indexes can slow down writes because indexes also need updates.

- Real example: add an index on email for faster login lookup.

```
// Create an index to search users faster by email
await db.collection("users").createIndex({ email: 1 })
```

## Redis; Redis Cache; In-Memory Data Store; Key-Value Database

- Redis stores data in memory, so it is very fast.

- It is commonly used for caching, sessions, queues, and rate limiting.

- Redis stores data using key-value style.

- It helps reduce repeated database calls.

- Real example: store logged-in user session data for quick access.

```
// Store user data in Redis for quick access
await redis.set("user:101", JSON.stringify(user))

// Read the cached user data using the same key
const cachedUser = await redis.get("user:101")
```

## Redis Cache; Cache-Aside Pattern; TTL; Cache Expiry; Cache Invalidation

- Cache-aside means the app checks cache first before going to the database.

- If data exists in Redis, the app returns it quickly.

- If data is missing, the app reads from the database and stores it in cache.

- TTL means cached data automatically expires after some time.

- Real example: cache product details for faster e-commerce pages.

```
// Store product data for 60 seconds only
await redis.set("product:10", JSON.stringify(product), "EX", 60)
```

## MongoDB Transactions; ACID Transaction; Multi-Document Transaction; Atomicity

- A transaction makes multiple database changes succeed or fail together.

- MongoDB supports transactions when multiple documents must stay consistent.

- It is useful for payment, wallet, order, and inventory updates.

- Transactions add extra cost, so use them only when needed.

- Real example: reduce stock and create order together.

```
// Start a session to run multiple actions safely
const session = client.startSession()

await session.withTransaction(async () => {
  // Create the order
  await orders.insertOne(order, { session })

  // Reduce product stock in the same transaction
  await products.updateOne(
    { _id: productId },
    { $inc: { stock: -1 } },
    { session }
  )
})
```

## Embedded Documents vs References; MongoDB Data Modeling; Embedding vs Referencing

- Embedded Documents | References

- Store related data inside one document | Store related data in another collection
- Faster to read together | Better for shared or large data
- Good for one-to-few data | Good for one-to-many data

- Use embedded documents when data is small and usually read together.

- Use references when data is large, shared, or changes separately.

- Embedding reduces extra queries.

- Referencing avoids duplicate data.

- Real example: embed address inside user, but reference orders separately.

```
// Embedded address stays inside the user document
const user = {
  name: "John",
  address: {
    city: "Hyderabad",
    country: "India"
  }
}

// Referenced order stores only the userId
const order = {
  userId: user._id,
  total: 1200
}
```

© Copyright 2026. All rights reserved.

Designed & Developed By Durga Prasad - Mob: 9030505066
