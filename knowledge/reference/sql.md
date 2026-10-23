# SQL interview reference

Generated from https://full-stack-interview-ecru.vercel.app/fullstack-dev/ for local search.
# Sql Fundamentals

Source: https://full-stack-interview-ecru.vercel.app/fullstack-dev/sql-fundamentals

## SQL; Structured Query Language; Database Query Language; SQL Interview Question

- SQL means Structured Query Language.

- We use SQL to store, read, update, and delete data in relational databases.

- It is useful because most applications need to work with stored data.

- Real example: a login page can use SQL to check user email and password.

- Common SQL commands are SELECT , INSERT , UPDATE , and DELETE .

```
SELECT name, email
FROM users
WHERE active = 1;
```

## Relational Database; RDBMS; Tables Rows Columns; Database Relationships

- A relational database stores data in tables.

- Each table has rows and columns, similar to a spreadsheet.

- Tables can be connected using keys like primary key and foreign key.

- This helps us avoid duplicate data and keep data organized.

- Real example: an orders table can connect to a users table using user_id .

```
SELECT users.name, orders.total
FROM users
JOIN orders ON users.id = orders.user_id;
```

## Table in SQL; Database Table; Rows and Columns; Schema

- A table is where related data is stored in a database.

- Columns define what type of data we store.

- Rows store the actual records.

- A schema defines the table structure, column names, data types, and rules.

- Real example: a users table can have id , name , and email columns.

```
CREATE TABLE users (
  id INT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(255)
);
```

## DDL vs DML; Data Definition Language; Data Manipulation Language; SQL Commands

- DDL | DML

- Changes database structure | Works with table data
- Uses commands like CREATE , ALTER , DROP | Uses commands like SELECT , INSERT , UPDATE , DELETE
- Example: create a table | Example: add a user
- Usually used while designing database | Usually used while using application data

- DDL is used to create or change database structure.

- DML is used to read or modify data inside tables.

- Simple example: CREATE TABLE is DDL, but INSERT INTO is DML.

- DDL statements are auto-committed, while DML changes can be rolled back using transactions.

- Both are important for working with SQL databases.

```
CREATE TABLE users (id INT, name VARCHAR(100));

INSERT INTO users (id, name)
VALUES (1, 'Ravi');
```

## SQL Command Types; DDL; DML; DCL; TCL

- SQL commands are grouped based on what they do.

- DDL handles structure, like creating or changing tables.

- DML handles data, like reading, adding, updating, or deleting rows.

- DCL handles permissions using commands like GRANT and REVOKE .

- TCL handles transactions using commands like COMMIT and ROLLBACK .

- Type | Meaning | Example Commands

- DDL | Data Definition Language | CREATE , ALTER , DROP
- DML | Data Manipulation Language | SELECT , INSERT , UPDATE , DELETE
- DCL | Data Control Language | GRANT , REVOKE
- TCL | Transaction Control Language | COMMIT , ROLLBACK

## NULL in SQL; Missing Value; Unknown Value; IS NULL

- NULL means the value is missing or unknown.

- NULL is not the same as zero, empty string, or false.

- We should use IS NULL to check missing values.

- We should use IS NOT NULL to check available values.

- COALESCE() can replace NULL with a default value.

```
SELECT *
FROM users
WHERE phone IS NULL;

SELECT name, COALESCE(phone, 'N/A')
FROM users;
```

## SQL Operators; Comparison Operators; Logical Operators; LIKE IN BETWEEN

- SQL operators help us filter and calculate data.

- Comparison operators like = , > , and < compare values.

- Logical operators like AND , OR , and NOT combine conditions.

- LIKE is used for pattern matching in text.

- IN checks multiple values, and BETWEEN checks a range.

```
SELECT *
FROM orders
WHERE amount > 100
  AND status IN ('paid', 'shipped');
```

## ACID Properties; Atomicity Consistency Isolation Durability; Database Transactions

- ACID properties make database transactions safe and reliable.

- Atomicity means all steps complete or none of them complete.

- Consistency means data should always follow database rules.

- Isolation means multiple transactions should not disturb each other.

- Durability means saved data should remain even after a crash.

```
BEGIN;

UPDATE accounts SET balance = balance - 500 WHERE id = 1;
UPDATE accounts SET balance = balance + 500 WHERE id = 2;

COMMIT;
```

## SQL vs NoSQL; Relational Database vs Non-Relational Database; SQL Database; NoSQL Database

- SQL | NoSQL

- Stores data in tables | Stores data as documents, key-value pairs, or other formats
- Uses fixed schema | Uses flexible schema
- Good for relationships and joins | Good for flexible and large-scale data
- Example: MySQL, PostgreSQL | Example: MongoDB, Redis

- SQL is better when data has clear structure and relationships.

- NoSQL is better when data structure changes often.

- SQL is commonly used in banking, e-commerce, and admin systems.

- NoSQL is commonly used in logs, social feeds, and flexible content.

- Many real projects use both based on the requirement.

```
SELECT users.name, orders.total
FROM users
JOIN orders ON users.id = orders.user_id
WHERE orders.status = 'paid';
```

Up next

Sql Ddl and Dml Commands

© Copyright 2026. All rights reserved.

Designed & Developed By Durga Prasad - Mob: 9030505066

---

# Sql Ddl and Dml Commands

Source: https://full-stack-interview-ecru.vercel.app/fullstack-dev/sql-ddl-and-dml-commands

## CREATE TABLE; SQL CREATE TABLE; DDL Command; Table Schema

- CREATE TABLE is used to create a new table in a database.

- It defines columns, data types, and rules like primary key or unique key.

- It is a DDL command because it changes the database structure.

- Real example: create a users table to store user profile details.

- After creating the table, we can insert rows using INSERT .

```
CREATE TABLE users (
  id INT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(255) UNIQUE
)
```

## ALTER TABLE; SQL ALTER TABLE; Modify Table; Add Column; Drop Column

- ALTER TABLE is used to change an existing table structure.

- We use it to add, remove, or modify columns.

- It is useful when requirements change after the table is already created.

- Real example: add a phone column to the users table.

- In real projects, these changes are usually done using migration files.

```
ALTER TABLE users
ADD phone VARCHAR(20)
```

## DROP TABLE; SQL DROP TABLE; Delete Table; Remove Table Structure

- DROP TABLE removes the full table from the database.

- It deletes both the table structure and the data inside it.

- This is a DDL command and should be used carefully.

- Real example: drop a temporary table after importing data.

- DROP TABLE IF EXISTS avoids errors when the table is not available.

```
DROP TABLE IF EXISTS temp_users
```

## INSERT; SQL INSERT; Insert Into; Add Rows; DML Command

- INSERT is used to add new rows into a table.

- We usually mention column names and then provide values.

- It is a DML command because it changes table data.

- Real example: add a new user after signup.

- For many rows, one bulk INSERT is better than many small inserts.

```
INSERT INTO users (id, name, email)
VALUES (1, 'Ravi', 'ravi@example.com')
```

## UPDATE; SQL UPDATE; Modify Rows; Change Data; WHERE Clause

- UPDATE is used to change existing row values.

- We should always use WHERE to update only selected rows.

- Without WHERE , all rows in the table may be updated.

- Real example: update a user email after profile edit.

- UPDATE can be rolled back when it runs inside a transaction.

```
UPDATE users
SET email = 'new@example.com'
WHERE id = 1
```

## DELETE; SQL DELETE; Delete Rows; Remove Data; WHERE Clause

- DELETE is used to remove rows from a table.

- We should use WHERE to delete only required rows.

- Without WHERE , all rows in the table may be deleted.

- Real example: delete expired sessions from a sessions table.

- DELETE is a DML command, so it can be rolled back in a transaction.

```
DELETE FROM sessions
WHERE expires_at < NOW()
```

## DELETE vs TRUNCATE; SQL Delete Difference; Truncate Table; Remove Rows

- DELETE | TRUNCATE

- Removes selected rows | Removes all rows
- Can use WHERE | Cannot use WHERE
- Slower for large data | Faster for clearing a table
- Can usually be rolled back in a transaction | Rollback support depends on database
- Good for specific deletion | Good for emptying temp tables

- Use DELETE when you want to remove only matching rows.

- Use TRUNCATE when you want to quickly empty the full table.

- DELETE is safer when conditions and transactions are needed.

## DEFAULT Constraint; SQL DEFAULT; Default Value; Column Default

- DEFAULT gives a column an automatic value when we do not pass one.

- It keeps insert queries simple and avoids repeated values.

- It is commonly used for status, timestamps, and boolean values.

- Real example: set new order status as pending by default.

- If we pass a value manually, that value is stored instead of the default.

```
CREATE TABLE orders (
  id INT PRIMARY KEY,
  status VARCHAR(20) DEFAULT 'pending'
)
```

## CHAR vs VARCHAR; Fixed Length String; Variable Length String; SQL Data Types

- CHAR | VARCHAR

- Fixed-length text | Variable-length text
- May add extra spaces | Stores only needed characters
- Good for same-size values | Good for different-size values
- Example: country code | Example: name or email

- CHAR is useful when the value length is always fixed.

- VARCHAR is useful when the value length can change.

- In most applications, VARCHAR is used more often than CHAR .

Previous

Sql Fundamentals

Up next

Sql Constraints and Keys

© Copyright 2026. All rights reserved.

Designed & Developed By Durga Prasad - Mob: 9030505066

---

# Sql Constraints and Keys

Source: https://full-stack-interview-ecru.vercel.app/fullstack-dev/sql-constraints-and-keys

## SQL Constraints; Database Constraints; Data Integrity; Table Rules

- SQL constraints are rules added to table columns.

- They stop invalid data before it is saved.

- They help keep database data correct and consistent.

- Real example: email should not be empty or duplicated in a users table.

- Constraints are safer because the database checks the rule every time.

```
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL UNIQUE,
  age INT CHECK (age >= 18)
);
```

## Types Of SQL Constraints; NOT NULL; UNIQUE; PRIMARY KEY; FOREIGN KEY; CHECK; DEFAULT

- NOT NULL means the column must have a value.

- UNIQUE means duplicate values are not allowed.

- PRIMARY KEY uniquely identifies each row.

- FOREIGN KEY connects one table with another table.

- CHECK and DEFAULT help control allowed values and default values.

```
CREATE TABLE orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  total DECIMAL(10, 2) CHECK (total >= 0),
  status VARCHAR(20) DEFAULT 'pending',
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## Primary Key; PK; Unique Row Identifier; Auto Increment ID

- A primary key uniquely identifies each row in a table.

- It cannot be NULL and it cannot be duplicated.

- Usually we use an id column as the primary key.

- Real example: each product can have one unique product id .

- A table can have only one primary key.

```
CREATE TABLE products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL
);
```

## Primary Key vs Unique Key; PK vs UNIQUE; Difference Between Primary Key And Unique Key

- Primary Key | Unique Key

- Identifies each row | Prevents duplicate values
- Does not allow NULL | May allow NULL depending on database
- Only one primary key per table | Multiple unique keys can exist
- Used as the main row identity | Used for business rules

- PRIMARY KEY is the main identity of a row.

- UNIQUE is used when a value should not repeat.

- Real example: id can be primary key and email can be unique.

- Both help prevent duplicate data.

- Both commonly create an index internally.

```
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE,
  username VARCHAR(50) UNIQUE
);
```

## Composite Primary Key; Multiple Column Primary Key; Junction Table; Many To Many

- A composite primary key uses two or more columns together.

- One column alone can repeat, but the combination must be unique.

- It is commonly used in many-to-many tables.

- Real example: one order can have many products, so order_id and product_id can identify each row.

- It is useful when one column is not enough to identify a record.

```
CREATE TABLE order_items (
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  PRIMARY KEY (order_id, product_id)
);
```

## Foreign Key; FK; Referential Integrity; Parent Child Table; Table Relationship

- A foreign key links one table to another table.

- It makes sure the value exists in the parent table.

- It prevents orphan records in the database.

- Real example: an order should belong to an existing user.

- It helps maintain proper relationships between tables.

```
CREATE TABLE orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  total DECIMAL(10, 2),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## ON DELETE CASCADE vs RESTRICT; Foreign Key Delete Rule; Cascade Delete

- ON DELETE CASCADE | ON DELETE RESTRICT

- Deletes child rows automatically | Blocks parent row deletion
- Useful when child data depends on parent | Useful when child data must be protected
- Example: delete user and user orders | Example: block deleting user with orders

- ON DELETE CASCADE removes related child records automatically.

- ON DELETE RESTRICT stops deletion if related child records exist.

- Use cascade only when child data should not exist without parent data.

- Real example: deleting a user can also delete that user's cart items.

- Choose the rule based on your application data flow.

```
CREATE TABLE orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## Unique Constraint; UNIQUE Key; Prevent Duplicate Values; Duplicate Data Validation

- UNIQUE makes sure a column value does not repeat.

- It is useful for fields like email , username , or phone number.

- The database rejects duplicate values automatically.

- Real example: two users should not register with the same email.

- A table can have multiple unique constraints.

```
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE
);
```

## Composite Unique Constraint; Multiple Column Unique Key; Prevent Duplicate Combination

- A composite unique constraint prevents duplicate combinations.

- Each column can repeat separately, but the combination cannot repeat.

- It is useful for business rules.

- Real example: the same user should not enroll in the same course twice.

- It helps avoid duplicate relationship records.

```
ALTER TABLE enrollments
ADD CONSTRAINT uq_user_course UNIQUE (user_id, course_id);
```

## Check Constraint; CHECK Rule; Column Validation; Custom Data Rule

- CHECK validates a value using a custom condition.

- If the condition fails, the database rejects the row.

- It is useful for simple data rules.

- Real example: age should be greater than or equal to 18 .

- It helps keep wrong values out of the table.

```
CREATE TABLE users (
  age INT CHECK (age >= 18),
  status VARCHAR(20) CHECK (status IN ('active', 'inactive'))
);
```

## Default Constraint; DEFAULT Value; Column Default Value; SQL Default

- DEFAULT adds a value automatically when no value is given.

- It helps avoid empty values for common fields.

- It makes insert queries simpler.

- Real example: new orders can have pending status by default.

- It is useful for status, timestamps, and flags.

```
CREATE TABLE orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  status VARCHAR(20) DEFAULT 'pending'
);
```

## Index vs Key; SQL Index; Database Key; Query Performance vs Data Rule

- Key | Index

- Defines a rule or relationship | Helps find rows faster
- Example: primary key, foreign key | Example: index on email
- Protects data meaning | Improves query speed
- Can create an index automatically | Does not always enforce rules

- A key is mainly used to identify data or connect tables.

- An index is mainly used to speed up search queries.

- Primary keys and unique keys usually create indexes automatically.

- Real example: index email to search users faster.

- Keys and indexes are related, but they are not the same thing.

```
CREATE INDEX idx_users_email ON users(email);
```

## Data Integrity In SQL; Valid Data; Consistent Data; Database Accuracy

- Data integrity means the database has correct and reliable data.

- Constraints help enforce valid values and relationships.

- Transactions help keep related changes safe.

- Normalization helps reduce duplicate data.

- Real example: account balance should not become negative.

```
CREATE TABLE accounts (
  id INT PRIMARY KEY,
  balance DECIMAL(10, 2) CHECK (balance >= 0),
  owner_id INT,
  FOREIGN KEY (owner_id) REFERENCES users(id)
);
```

## Constraints vs Application Validation; Database Rules vs App Rules; Backend Validation

- Database Constraints | Application Validation

- Runs inside the database | Runs inside application code
- Protects data from all sources | Protects data from app users
- Harder to bypass | Easier to bypass
- Best for important data rules | Best for user-friendly messages

- Application validation gives quick feedback to users.

- Database constraints give final protection to the data.

- We should use both for important rules.

- Real example: app checks email format, database checks email uniqueness.

Previous

Sql Ddl and Dml Commands

Up next

Sql Joins

© Copyright 2026. All rights reserved.

Designed & Developed By Durga Prasad - Mob: 9030505066

---

# Sql Joins

Source: https://full-stack-interview-ecru.vercel.app/fullstack-dev/sql-joins

## SQL JOIN; Database Join; Combine Tables; Related Data

- A JOIN is used to combine data from two related tables.

- We use it because real applications store data in separate tables.

- The main benefit is we can read connected data in one query.

- Real example: join users and orders to show each user order details.

- The ON condition tells SQL how both tables are connected.

```
SELECT users.name, orders.total
FROM users
JOIN orders ON users.id = orders.user_id
```

## SQL Join Types; INNER JOIN; LEFT JOIN; RIGHT JOIN; FULL OUTER JOIN

- Join Type | Meaning

- INNER JOIN | Shows only matching rows from both tables
- LEFT JOIN | Shows all rows from the left table
- RIGHT JOIN | Shows all rows from the right table
- FULL OUTER JOIN | Shows all rows from both tables

- INNER JOIN is useful when both table records must match.

- LEFT JOIN is useful when we want to keep all main records.

- Missing values from the other table usually come as NULL .

## INNER JOIN vs LEFT JOIN; Join Difference; Matching Rows; NULL Rows

- INNER JOIN | LEFT JOIN

- Shows only matching records | Shows all records from the left table
- Removes rows without a match | Keeps rows without a match
- No unmatched rows in result | Unmatched columns show NULL
- Good for confirmed relations | Good for reports and lists

- Real example: INNER JOIN shows only users who placed orders.

- LEFT JOIN can show all users, including users with no orders.

- Add WHERE right_table.col IS NULL after a LEFT JOIN to find rows with no match in the right table.

```
SELECT users.name, orders.id AS order_id
FROM users
LEFT JOIN orders ON users.id = orders.user_id
```

## CROSS JOIN; Cartesian Product; All Combinations; SQL Combinations

- CROSS JOIN combines every row from one table with every row from another table.

- We use it when we need all possible combinations.

- If one table has 3 rows and another has 4 rows, the result has 12 rows.

- Real example: create all size and color combinations for products.

- It can create many rows, so we should use it carefully.

```
SELECT sizes.size, colors.color
FROM sizes
CROSS JOIN colors
```

## Self Join; Join Same Table; Table Alias; Employee Manager Example

- A self join means joining a table with itself.

- We use it when rows in the same table are related to other rows.

- The main benefit is we can compare records inside one table.

- Real example: employees and managers can both be stored in the employees table.

- We use aliases like e and m to treat the same table as two tables.

```
SELECT e.name AS employee, m.name AS manager
FROM employees e
JOIN employees m ON e.manager_id = m.id
```

## Anti Join; Rows With No Match; NOT EXISTS; LEFT JOIN IS NULL

- An anti join is used to find rows that do not have a matching row.

- We use it to find missing related records.

- Real example: find users who have never placed an order.

- Common ways are NOT EXISTS and LEFT JOIN with IS NULL .

- NOT EXISTS is usually a clean and safe option.

```
SELECT users.id, users.name
FROM users
WHERE NOT EXISTS (
  SELECT 1 FROM orders
  WHERE orders.user_id = users.id
)
```

Previous

Sql Constraints and Keys

Up next

Sql Querying and Aggregations

© Copyright 2026. All rights reserved.

Designed & Developed By Durga Prasad - Mob: 9030505066

---

# Sql Querying and Aggregations

Source: https://full-stack-interview-ecru.vercel.app/fullstack-dev/sql-querying-and-aggregations

## SELECT Statement; SQL SELECT; Retrieve Data; Basic Query

- SELECT is used to read data from a table.

- We use it to choose only the columns we need.

- It is safe because it does not change table data.

- Real example: show user names and emails on an admin dashboard.

```
SELECT name, email, created_at
FROM users
WHERE active = 1
ORDER BY created_at DESC
```

## WHERE Clause; SQL Filter; Row Condition; Query Filter

- WHERE is used to filter rows before showing results.

- We use it when we want only matching data.

- It helps reduce unnecessary records from the output.

- Real example: show only paid orders from the orders table.

- WHERE cannot directly filter aggregate results like COUNT() .

```
SELECT id, total
FROM orders
WHERE status = 'paid'
  AND total > 100
```

## ORDER BY Clause; SQL Sorting; ASC; DESC

- ORDER BY is used to sort query results.

- By default, sorting is ascending using ASC .

- Use DESC when you want the latest or highest values first.

- Real example: show latest users first in a dashboard.

- Without ORDER BY , row order is not guaranteed.

```
SELECT name, created_at
FROM users
ORDER BY created_at DESC
```

## LIMIT Clause; SQL LIMIT; OFFSET; Pagination

- LIMIT is used to return only a fixed number of rows.

- We use it for pagination and faster result loading.

- OFFSET skips rows before returning the next set.

- Real example: show 10 products per page in an e-commerce app.

- Always use ORDER BY with LIMIT for predictable results.

```
SELECT id, name
FROM products
ORDER BY created_at DESC
LIMIT 10 OFFSET 20
```

## Aggregate Functions; COUNT; SUM; AVG; MIN; MAX

- Aggregate functions calculate one result from many rows.

- COUNT() counts rows, SUM() adds values, and AVG() finds average.

- MIN() gives the smallest value and MAX() gives the largest value.

- Real example: calculate total sales from an orders table.

- Aggregates are commonly used with GROUP BY .

```
SELECT
  COUNT(*) AS total_orders,
  SUM(total) AS total_sales,
  AVG(total) AS average_order
FROM orders
```

## COUNT Star vs COUNT Column; COUNT(*); COUNT(column); NULL Count

- COUNT(*) | COUNT(column)

- Counts all rows | Counts only non-null values
- Includes rows with NULL values | Skips NULL values in that column
- Good for total rows | Good for available column values

- COUNT(*) is used when we need the total number of rows.

- COUNT(email) counts only rows where email is not NULL .

- This difference is important in reports and dashboards.

```
SELECT
  COUNT(*) AS total_users,
  COUNT(email) AS users_with_email
FROM users
```

## GROUP BY Clause; SQL Grouping; Aggregate Per Category; Grouped Result

- GROUP BY groups rows that have the same value.

- We use it with aggregate functions like COUNT() and SUM() .

- It returns one row for each group.

- Real example: count orders by status like paid, pending, or cancelled.

- Non-aggregate selected columns should be part of GROUP BY .

```
SELECT status, COUNT(*) AS order_count
FROM orders
GROUP BY status
```

## WHERE vs HAVING; Row Filter vs Group Filter; SQL Aggregation Filter

- WHERE | HAVING

- Filters rows before grouping | Filters groups after aggregation
- Cannot use aggregate conditions | Can use aggregate conditions
- Example: status = 'active' | Example: COUNT(*) > 5

- Use WHERE to filter normal row data.

- Use HAVING to filter grouped or aggregate data.

- Real example: find departments with more than 5 active employees.

- Filtering with WHERE first can make the query faster.

```
SELECT dept, COUNT(*) AS staff_count
FROM employees
WHERE status = 'active'
GROUP BY dept
HAVING COUNT(*) > 5
```

## Subquery; Nested Query; Query Inside Query; SQL Inner Query

- A subquery is a query written inside another query.

- We use it when one query result is needed by another query.

- It can return one value, many values, or a temporary result.

- Real example: find products costlier than the average price.

- Subqueries are useful, but too many nested queries can become hard to read.

```
SELECT name, price
FROM products
WHERE price > (
  SELECT AVG(price) FROM products
)
```

## CTE; Common Table Expression; WITH Clause; Named Query

- A CTE is a named temporary query written using WITH .

- We use it to make complex SQL easier to read.

- It exists only while that query is running.

- Real example: first get active users, then join them with recent orders.

- CTEs are cleaner than deeply nested subqueries.

```
WITH active_users AS (
  SELECT id, name
  FROM users
  WHERE active = 1
)
SELECT name
FROM active_users
```

## EXISTS vs NOT EXISTS; SQL EXISTS; Row Exists Check; NOT IN Alternative

- EXISTS | NOT EXISTS

- Checks if matching rows exist | Checks if matching rows do not exist
- Returns true when a row is found | Returns true when no row is found
- Useful for related records | Useful for missing related records

- EXISTS checks whether a subquery returns at least one row.

- It is useful when checking related table data.

- NOT EXISTS is safer than NOT IN when NULL values are possible.

- Real example: find users who have placed at least one order.

```
SELECT id, name
FROM users u
WHERE EXISTS (
  SELECT 1 FROM orders o WHERE o.user_id = u.id
)
```

## LIKE Pattern Matching; SQL LIKE; Wildcard Search; Text Filter

- LIKE is used to search text using patterns.

- % means any number of characters.

- _ means exactly one character.

- Real example: search users whose name starts with A .

- Searches like '%admin%' can be slow on large tables.

```
SELECT name
FROM users
WHERE name LIKE 'A%'
```

## CASE Statement; SQL CASE; If Else Logic; Conditional Value

- CASE adds if-else logic inside a SQL query.

- We use it to create values based on conditions.

- It checks conditions in order and returns the matching result.

- Real example: convert marks into grades.

- Always close a CASE statement with END .

```
SELECT
  name,
  CASE
    WHEN score >= 90 THEN 'A'
    WHEN score >= 50 THEN 'Pass'
    ELSE 'Fail'
  END AS result
FROM students
```

## COALESCE Function; SQL COALESCE; First Non-Null Value; NULL Fallback

- COALESCE returns the first non-null value.

- We use it to show fallback values when data is missing.

- It keeps query output clean and user-friendly.

- Real example: show nickname, otherwise show first name.

- It is often cleaner than writing long CASE logic.

```
SELECT
  COALESCE(nickname, first_name, 'Anonymous') AS display_name
FROM users
```

## Scalar Functions; SQL Functions; Single Row Function; String Number Date Function

- Scalar functions work on one row at a time.

- They return one value for each row.

- Common examples are UPPER() , LOWER() , ROUND() , and LENGTH() .

- Real example: show user names in uppercase.

- Function names can change slightly between databases.

```
SELECT
  UPPER(name) AS name_upper,
  ROUND(price, 2) AS rounded_price
FROM products
```

Previous

Sql Joins

Up next

Sql Set Operations

© Copyright 2026. All rights reserved.

Designed & Developed By Durga Prasad - Mob: 9030505066

---

# Sql Set Operations

Source: https://full-stack-interview-ecru.vercel.app/fullstack-dev/sql-set-operations

## UNION vs UNION ALL; SQL Set Operations; Combine Query Results; Remove Duplicates

- UNION | UNION ALL

- Removes duplicate rows | Keeps duplicate rows
- Usually slower | Usually faster
- Use when unique result is needed | Use when all rows are needed
- Example: unique emails | Example: yearly order tables

- UNION and UNION ALL are used to combine results from two or more SELECT queries.

- UNION removes duplicate rows, so it can take extra time.

- UNION ALL keeps all rows, so it is faster in most cases.

- Both queries must return the same number of columns with matching data types.

- Column names usually come from the first SELECT query.

```
SELECT name FROM customers
UNION ALL
SELECT name FROM leads
```

## When To Use UNION; Merge Similar Tables; Unique Results; SQL Combine Selects

- Use UNION when duplicate rows should not be shown in the final result.

- It is useful when we combine similar data from different tables.

- Real example: combine emails from active users and archived users without duplicates.

- Use it only when unique data is important.

- UNION is safer for unique results, but slower than UNION ALL .

```
SELECT email FROM active_users
UNION
SELECT email FROM archived_users
```

## When To Use UNION ALL; Faster Union; Keep Duplicates; SQL Performance

- Use UNION ALL when duplicate rows are allowed or expected.

- It is faster because the database does not remove duplicates.

- Real example: combine orders from orders_2023 and orders_2024 .

- It is commonly used for reports and partition-like tables.

- Prefer UNION ALL unless you clearly need duplicate removal.

```
SELECT id, total FROM orders_2023
UNION ALL
SELECT id, total FROM orders_2024
```

## INTERSECT; Common Rows; SQL Set Operation; Matching Records

- INTERSECT returns only rows that are present in both query results.

- It is useful when we want to find common data between two tables.

- Both queries must return the same number of columns with matching data types.

- Real example: find users who placed an order and also wrote a review.

- INTERSECT works like finding the common part between two lists.

```
SELECT user_id FROM orders
INTERSECT
SELECT user_id FROM reviews
```

## EXCEPT vs MINUS; SQL Difference; Missing Records; First Query Not Second

- EXCEPT | MINUS

- Used in PostgreSQL and SQL Server | Used in Oracle
- Returns rows from first query not in second | Returns rows from first query not in second
- Removes duplicates by default | Removes duplicates by default

- EXCEPT returns rows from the first query that are not found in the second query.

- MINUS means the same thing, but it is mainly used in Oracle.

- It is useful to find missing or unmatched records.

- Real example: find customers who ordered but never requested a refund.

- The first query matters because the result comes from the first query only.

```
SELECT user_id FROM orders
EXCEPT
SELECT user_id FROM refunds
```

## EXCEPT ALL; Keep Duplicate Counts; SQL Duplicate Rows; Set Operation

- EXCEPT removes duplicates by default.

- EXCEPT ALL keeps duplicate counts while comparing results.

- It is useful when duplicate rows have meaning in the data.

- Real example: compare repeated transaction records between two tables.

- Use normal EXCEPT for most interview and business cases.

```
SELECT product_id FROM listed_products
EXCEPT
SELECT product_id FROM sold_products
```

Previous

Sql Querying and Aggregations

Up next

Sql Views Procedures and Triggers

© Copyright 2026. All rights reserved.

Designed & Developed By Durga Prasad - Mob: 9030505066

---

# Sql Views Procedures and Triggers

Source: https://full-stack-interview-ecru.vercel.app/fullstack-dev/sql-views-procedures-and-triggers

## SQL View; Virtual Table; Saved SELECT Query; Reusable Query

- A view is a saved SELECT query that we can use like a table.

- We use views to avoid writing the same complex query again and again.

- The main benefit is cleaner SQL and easier reporting.

- Real example: a view can show only active users from the users table.

- Important point: a normal view does not store data; it runs the query when we use it.

```
CREATE VIEW active_users AS
SELECT id, name, email
FROM users
WHERE active = true;

SELECT * FROM active_users;
```

## View vs Stored Procedure; SQL View; Stored Procedure; Database Routine

- View | Stored Procedure

- Works like a virtual table | Works like a reusable database function
- Mainly used with SELECT | Can run multiple SQL statements
- Usually does not take parameters | Can take parameters
- Good for reading data | Good for business logic and data changes
- Example: active users report | Example: create order process

- A view is mainly used to simplify reading data.

- A stored procedure is used to run a set of database steps.

- Real example: use a view for reports and a procedure for order creation.

```
SELECT * FROM active_users;

CALL create_order(42, 7, 2);
```

## Materialized View; Stored View; Precomputed Query Result; SQL Performance

- A materialized view stores the result of a query physically in the database.

- We use it when a query is heavy and we want faster reads.

- The main benefit is better performance for reports and dashboards.

- Real example: daily sales revenue can be stored in a materialized view.

- Important point: data can become old, so we need to refresh it.

```
CREATE MATERIALIZED VIEW daily_sales AS
SELECT DATE(created_at) AS day, SUM(total) AS revenue
FROM orders
GROUP BY day;

REFRESH MATERIALIZED VIEW daily_sales;
```

## Stored Procedure; SQL Procedure; Reusable SQL Logic; Database Function

- A stored procedure is reusable SQL logic saved inside the database.

- We use it when the same database steps need to run many times.

- The main benefit is fewer app-to-database calls and cleaner backend code.

- Real example: creating an order and updating stock can be done in one procedure.

- Important point: keep procedures simple and focused on database work.

```
CREATE PROCEDURE create_order(p_user_id INT, p_product_id INT, p_qty INT)
LANGUAGE plpgsql AS $
BEGIN
  INSERT INTO orders (user_id, product_id, quantity)
  VALUES (p_user_id, p_product_id, p_qty);

  UPDATE inventory
  SET stock = stock - p_qty
  WHERE product_id = p_product_id;
END;
$;
```

## SQL Trigger; Database Trigger; BEFORE Trigger; AFTER Trigger; Audit Log

- A trigger is SQL logic that runs automatically when table data changes.

- We use triggers for actions like audit logs, validation, or automatic updates.

- The main benefit is that the database handles the action without app code.

- Real example: when a user record is updated, a trigger can save old data in an audit table.

- Important point: triggers can be hard to notice because they run in the background.

```
CREATE TRIGGER after_user_update
AFTER UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION log_user_update();
```

## Temporary Table; Temp Table; Session Table; Intermediate SQL Result

- A temporary table is a short-time table used only during the current session.

- We use it to break large or complex queries into smaller steps.

- The main benefit is easier query handling for intermediate results.

- Real example: store pending orders first, then join them with user details.

- Important point: the database removes the temp table after the session ends.

```
CREATE TEMP TABLE pending_orders AS
SELECT id, user_id, total
FROM orders
WHERE status = 'pending';

SELECT * FROM pending_orders;
```

Previous

Sql Set Operations

Up next

Sql Normalization and Design

© Copyright 2026. All rights reserved.

Designed & Developed By Durga Prasad - Mob: 9030505066

---

# Sql Normalization and Design

Source: https://full-stack-interview-ecru.vercel.app/fullstack-dev/sql-normalization-and-design

## SQL Normalization; Database Normalization; Reduce Duplicate Data; Table Design

- SQL normalization means organizing tables to avoid repeated data.

- We use it to keep data clean and easy to update.

- The main benefit is less duplication and fewer update mistakes.

- Real example: keep user details in users table and order details in orders table.

```
-- Bad: user name is repeated in every order
CREATE TABLE orders (order_id INT, user_name TEXT, product_name TEXT);

-- Good: order stores only references
CREATE TABLE orders (order_id INT, user_id INT, product_id INT);
```

## First Normal Form; 1NF; One Value Per Cell; Atomic Values

- First Normal Form means each column should store only one value.

- We use it to avoid storing lists inside one column.

- The main benefit is that searching and updating data becomes easier.

- Real example: store phone numbers in a separate table instead of phone1 , phone2 , phone3 .

```
-- Bad: multiple values in one column
phones TEXT -- "98765,91234"

-- Good: one phone number per row
CREATE TABLE user_phones (user_id INT, phone TEXT);
```

## Second Normal Form; 2NF; Full Dependency; Composite Primary Key

- Second Normal Form means every non-key column must depend on the full primary key.

- We use it mainly when a table has a composite primary key.

- The main benefit is removing data that depends only on part of the key.

- Real example: in an order item table, product name should depend on product_id , not on the full order item key.

## Third Normal Form; 3NF; No Transitive Dependency; Non-Key Dependency

- Third Normal Form means non-key columns should not depend on other non-key columns.

- We use it to keep related data in the correct table.

- The main benefit is better data consistency.

- Real example: store city details in a separate table instead of repeating city data in every user row.

## 1NF vs 2NF vs 3NF; Normal Forms Comparison; SQL Normalization Levels

- Normal Form | Simple Meaning

- 1NF | Each column stores one value
- 2NF | Non-key columns depend on the full key
- 3NF | Non-key columns do not depend on other non-key columns

- 1NF fixes repeated values inside columns.

- 2NF fixes partial dependency.

- 3NF fixes transitive dependency.

- These rules help us design clean database tables.

- Most real-world databases stop at 3NF; going beyond can hurt read performance by requiring more joins.

## Denormalization; Duplicate Data; Read Performance; Database Optimization

- Denormalization means intentionally adding some duplicate data for faster reads.

- We use it when joins or calculations become slow in high-traffic systems.

- The main benefit is faster read performance.

- Real example: store total_orders in users instead of counting orders every time.

```
-- Normalized: count orders every time
SELECT user_id, COUNT(*) FROM orders GROUP BY user_id;

-- Denormalized: store ready-made count
SELECT id, name, total_orders FROM users;
```

## ER Diagram; Entity Relationship Diagram; Database Design Diagram; Table Relationship

- An ER diagram is a simple visual plan of database tables and their relationships.

- We use it before writing SQL to understand the data structure.

- The main benefit is that teams can agree on the design early.

- Real example: a blog app can have users , posts , and comments .

```
users ──< posts ──< comments
```

## OLTP vs OLAP; Transactional Database; Analytical Database; Database Workload

- OLTP | OLAP

- Used for daily app transactions | Used for reports and analysis
- Handles many small reads and writes | Handles large read-heavy queries
- Example: MySQL, PostgreSQL | Example: BigQuery, Snowflake
- Usually normalized | Often optimized for analytics

- OLTP is used in live applications like orders, payments, and user logins.

- OLAP is used for dashboards, reports, and business analysis.

- OLTP focuses on fast and safe transactions.

- OLAP focuses on reading large amounts of data.

```
-- OLTP: small transaction
INSERT INTO orders (user_id, total) VALUES (42, 19.99);

-- OLAP: report query
SELECT region, SUM(revenue) FROM sales GROUP BY region;
```

## Indexing vs Denormalization; Database Performance; Read Speed vs Write Cost

- Indexing | Denormalization

- Adds a lookup structure | Adds duplicate data
- Keeps schema mostly clean | Changes table design
- Helps search faster | Helps avoid joins or calculations
- Adds small write overhead | Adds data update responsibility

- Indexing is usually the first option to improve slow queries.

- Denormalization is useful when indexes are not enough.

- Indexes help the database find rows faster.

- Denormalization can make reads faster but makes writes more complex.

```
CREATE INDEX idx_orders_user_id ON orders(user_id);
```

Previous

Sql Views Procedures and Triggers

Up next

Sql Indexes and Performance

© Copyright 2026. All rights reserved.

Designed & Developed By Durga Prasad - Mob: 9030505066

---

# Sql Indexes and Performance

Source: https://full-stack-interview-ecru.vercel.app/fullstack-dev/sql-indexes-and-performance

## SQL Index; Database Index; Faster Lookup; Full Table Scan; Query Performance

- An index helps the database find rows faster.

- We use it to avoid checking every row in a large table.

- It works well on columns used in WHERE , JOIN , and ORDER BY .

- Real example: finding a user by email becomes faster with an index.

- Important point: indexes improve reads, but they also take extra storage.

```
CREATE INDEX idx_users_email ON users(email);

SELECT * FROM users WHERE email = 'john@example.com';
```

## Full Table Scan; Table Scan; Slow Query; No Index; Database Search

- A full table scan means the database checks every row one by one.

- This can become slow when the table has many records.

- It usually happens when there is no useful index for the query.

- Real example: searching orders by user_id without an index can scan all orders.

- Important point: indexes help the database avoid full table scans.

```
SELECT * FROM orders WHERE user_id = 101;
```

## When Not To Use Index; Index Overhead; Small Table; Low Cardinality; Write Heavy Table

- Do not add indexes to every column blindly.

- Small tables may not need indexes because scanning them is already fast.

- Columns with very few values, like is_active , may not help much.

- Write-heavy tables can become slower because indexes must also be updated.

- Important point: create indexes based on real slow queries.

```
CREATE INDEX idx_users_email ON users(email);
```

## Index Benefits; Read Performance; Faster SELECT; Query Optimization; Database Performance

- Indexes mainly improve read queries.

- They help SELECT queries find matching rows faster.

- They are useful for search, filtering, sorting, and joins.

- Real example: a login system can quickly find a user by email.

- Important point: good indexes can make large-table queries much faster.

```
SELECT * FROM users WHERE email = 'alice@example.com';
```

## Clustered Index vs Non-Clustered Index; Primary Key Index; Physical Order; Separate Index

- Clustered Index | Non-Clustered Index

- Stores table rows in sorted order | Stores index separately from table data
- A table usually has only one | A table can have many
- Commonly created on primary key | Commonly created on search columns
- Data is physically ordered | Points to the actual table row

- A clustered index decides how table data is stored.

- A non-clustered index is a separate lookup structure.

- Real example: id can be clustered, and email can be non-clustered.

## Composite Index; Multi-Column Index; Combined Index; Index Order; SQL Performance

- A composite index is an index on more than one column.

- We use it when queries often filter by multiple columns together.

- Column order matters because the database reads the index from left to right.

- Real example: user_id and created_at can help fetch a user's recent orders.

- Important point: create composite indexes based on common query patterns.

```
CREATE INDEX idx_orders_user_date ON orders(user_id, created_at);

SELECT * FROM orders
WHERE user_id = 101
ORDER BY created_at DESC;
```

## EXPLAIN; EXPLAIN ANALYZE; Execution Plan; Query Plan; Index Usage

- EXPLAIN shows how the database plans to run a query.

- We use it to check whether an index is being used.

- EXPLAIN ANALYZE also runs the query and shows real timing details.

- Real example: use it before optimizing a slow report query.

- Important point: measure the query before and after making changes.

```
EXPLAIN SELECT * FROM users WHERE email = 'alice@example.com';
```

## Slow Query Optimization; Query Tuning; Index Optimization; SELECT Columns; WHERE Filter

- First measure the slow query using EXPLAIN or EXPLAIN ANALYZE .

- Add indexes on columns used for filtering, joining, or sorting.

- Avoid SELECT * and select only the needed columns.

- Use WHERE filters early to reduce the number of rows.

- Important point: optimize based on the query plan, not guessing.

```
SELECT u.name, o.total, o.created_at
FROM orders o
JOIN users u ON o.user_id = u.id
WHERE o.status = 'paid'
ORDER BY o.created_at DESC
LIMIT 50;
```

## Index Trade-Offs; Index Storage; Slower Writes; Insert Update Delete; Database Cost

- Indexes are useful, but they are not free.

- They need extra storage space in the database.

- INSERT , UPDATE , and DELETE can become slower because indexes must change too.

- Real example: too many indexes on an orders table can slow order creation.

- Important point: balance faster reads with write performance.

Previous

Sql Normalization and Design

Up next

Sql Window Functions

© Copyright 2026. All rights reserved.

Designed & Developed By Durga Prasad - Mob: 9030505066

---

# Sql Window Functions

Source: https://full-stack-interview-ecru.vercel.app/fullstack-dev/sql-window-functions

## Window Function in SQL; OVER Clause; SQL Window Function; Analytical Function

- A window function calculates values across related rows without merging them into one row.

- We use it when we need ranking, running totals, moving averages, or row comparison.

- The main benefit is that each row stays visible in the final result.

- Real example: in an employee table, we can show each employee salary and total company salary together.

- Important point: window functions mainly work with the OVER clause.

```
SELECT name, salary, SUM(salary) OVER () AS total_salary
FROM employees;
```

## PARTITION BY vs GROUP BY; SQL Partition; SQL Grouping; Window Function Difference

- PARTITION BY | GROUP BY

- Keeps all rows in the result | Combines rows into summary rows
- Used with window functions | Used with aggregate queries
- Shows row-level details with group calculation | Shows only grouped result
- Example: employee salary with department average | Example: average salary per department

- PARTITION BY divides rows into groups for calculation.

- GROUP BY combines rows and returns one row per group.

- We use PARTITION BY when we want both original row details and grouped values.

- Real example: show each employee salary along with their department average salary.

```
SELECT name, dept, salary,
       AVG(salary) OVER (PARTITION BY dept) AS dept_avg
FROM employees;
```

## ROW_NUMBER RANK DENSE_RANK; SQL Ranking Functions; Ranking With Ties; Rank Difference

- Function | Meaning

- ROW_NUMBER() | Gives a unique number to every row
- RANK() | Gives the same rank for ties and skips the next rank
- DENSE_RANK() | Gives the same rank for ties but does not skip ranks

- ROW_NUMBER() always gives numbers like 1, 2, 3, 4.

- RANK() can create gaps when two rows have the same value.

- DENSE_RANK() does not create gaps after tied values.

- We use these functions when we need ordered ranking in reports.

- Important point: ranking functions usually need ORDER BY inside OVER .

```
SELECT name, score,
       ROW_NUMBER() OVER (ORDER BY score DESC) AS row_num,
       RANK() OVER (ORDER BY score DESC) AS rank_no,
       DENSE_RANK() OVER (ORDER BY score DESC) AS dense_rank_no
FROM players;
```

## LAG and LEAD Functions; Previous Row; Next Row; SQL Row Comparison

- LAG() gets a value from the previous row.

- LEAD() gets a value from the next row.

- We use them to compare current row data with nearby row data.

- Real example: compare this month revenue with previous month revenue.

- Important point: they need ORDER BY inside OVER to decide row order.

```
SELECT month, revenue,
       LAG(revenue) OVER (ORDER BY month) AS previous_revenue
FROM monthly_sales;
```

Previous

Sql Indexes and Performance

Up next

Sql Transactions and Concurrency

© Copyright 2026. All rights reserved.

Designed & Developed By Durga Prasad - Mob: 9030505066

---

# Sql Transactions and Concurrency

Source: https://full-stack-interview-ecru.vercel.app/fullstack-dev/sql-transactions-and-concurrency

## SQL Transaction; BEGIN COMMIT ROLLBACK; Database Transaction; Transaction Basics

- A transaction is a group of SQL queries that should succeed together or fail together.

- We use transactions to avoid half-saved data in important operations.

- Main benefit: the database stays safe and correct even when something fails.

- Real example: in a money transfer, debit and credit should both happen, not only one.

- BEGIN starts the transaction, COMMIT saves it, and ROLLBACK cancels it.

```
BEGIN;
UPDATE accounts SET balance = balance - 500 WHERE id = 1;
UPDATE accounts SET balance = balance + 500 WHERE id = 2;
COMMIT;
```

## ACID Properties; Atomicity Consistency Isolation Durability; Transaction Guarantees

- ACID means the basic safety rules followed by database transactions.

- Atomicity means all queries in a transaction happen together or none happen.

- Consistency means the database should remain valid after the transaction.

- Isolation means one transaction should not wrongly affect another transaction.

- Durability means committed data should stay saved even after a crash or restart.

## COMMIT vs ROLLBACK; Save Transaction; Undo Transaction; Transaction Control

- COMMIT | ROLLBACK

- Saves all transaction changes | Cancels all transaction changes
- Used when everything is successful | Used when something goes wrong
- Changes become permanent | Data goes back to the old state

- COMMIT is used when all queries are completed successfully.

- ROLLBACK is used when an error happens before saving the transaction.

- In application code, we usually commit in the success block and rollback in the error block.

```
BEGIN;
INSERT INTO orders (user_id, total) VALUES (42, 99.99);
UPDATE inventory SET stock = stock - 1 WHERE product_id = 7;
ROLLBACK;
```

## Isolation Levels; Read Committed; Repeatable Read; Serializable; Concurrency Control

- Isolation levels decide how much one transaction can see changes from another transaction.

- We use them to control data issues when many users update data at the same time.

- Higher isolation gives safer results, but it can reduce performance.

- READ COMMITTED is commonly used because it reads only committed data.

- SERIALIZABLE is the strictest level and is useful for very sensitive operations.

```
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
BEGIN;
SELECT balance FROM accounts WHERE id = 1;
COMMIT;
```

## Deadlock in SQL; Circular Lock Wait; Database Deadlock; Transaction Deadlock

- A deadlock happens when two transactions wait for each other and both are stuck.

- It usually happens when transactions lock the same tables or rows in a different order.

- The database normally detects the deadlock and cancels one transaction.

- The application should handle this error and retry the transaction if needed.

- Best practice: lock tables or rows in the same order in all transactions.

```
Transaction A: locks users, then waits for orders
Transaction B: locks orders, then waits for users
Result: deadlock
```

## Blocking vs Deadlocking; Lock Wait; Circular Wait; SQL Concurrency Issues

- Blocking | Deadlocking

- One transaction waits for another transaction | Two transactions wait for each other
- Usually normal database behavior | Usually an error situation
- It can continue after the first transaction finishes | Database must cancel one transaction

- Blocking is normal when one transaction is using a locked row.

- Deadlocking is more serious because both transactions are waiting for each other.

- Long transactions can create more blocking problems.

- Best practice: keep transactions short and commit quickly.

Previous

Sql Window Functions

Up next

Sql Security

© Copyright 2026. All rights reserved.

Designed & Developed By Durga Prasad - Mob: 9030505066

---

# Sql Security

Source: https://full-stack-interview-ecru.vercel.app/fullstack-dev/sql-security

## SQL Injection; SQL Injection Attack; Malicious Query; Database Security

- SQL injection happens when user input is treated like SQL code.

- We prevent it because attackers can read, change, or delete database data.

- The main benefit of protection is keeping user data and application data safe.

- Real example: a login form should not allow a user to change the SQL query using email or password input.

- Important point: never directly join user input with a SQL query string.

```
-- Safe: user input is passed as a value
SELECT * FROM users WHERE id = $1;
```

## Prevent SQL Injection; Parameterized Query; Prepared Statement; Input Validation

- The best way to prevent SQL injection is to use parameterized queries or prepared statements.

- We use them because user input is sent as data, not as SQL code.

- The main benefit is that attackers cannot easily change the actual query.

- Real example: search, login, and profile update queries should always use parameters.

- Input validation and least-privilege database users give extra protection.

```
await db.query('SELECT * FROM users WHERE email = $1', [userEmail])
```

## GRANT and REVOKE; SQL Permissions; Database Access Control; Least Privilege

- GRANT gives permission to a user or role in the database.

- REVOKE removes permission from a user or role.

- We use them to control who can read, insert, update, or delete data.

- Real example: a reporting user may get only SELECT permission.

- Important point: give only the permissions that are really needed.

```
GRANT SELECT ON users TO readonly_user;
REVOKE INSERT ON users FROM readonly_user;
```

## Role in SQL; Database Role; Group Permissions; Access Control

- A role is a group of permissions in a database.

- We use roles to manage permissions for many users easily.

- The main benefit is that we do not need to update every user one by one.

- Real example: we can create roles like read_only , analyst , and admin .

- Important point: update the role once, and all users with that role get the change.

```
CREATE ROLE read_only;
GRANT SELECT ON users TO read_only;
GRANT read_only TO alice;
```

Previous

Sql Transactions and Concurrency

© Copyright 2026. All rights reserved.

Designed & Developed By Durga Prasad - Mob: 9030505066
