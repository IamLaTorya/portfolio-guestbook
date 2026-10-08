# Database Architecture & Data Design

This document details the architectural reasoning, schema shapes, integrity enforcement matrix, and safety considerations for the Portfolio Guestbook application data layer.

---

## 1. Why a Document Database?
* **Shape of Data Alignment:** MongoDB fits this guestbook feature flawlessly because our records are self-contained, hierarchical structures. Guest posts require capturing text content alongside arrays of interactions (`likedby`) inside a single document snapshot. A document model allows us to retrieve a complete timeline entry and all its interactions in a single, fast read operation without executing multi-table joins.
* **When to choose SQL instead:** SQL would be preferred for a data shape that is highly normalized and relational, such as an **E-commerce Order and Inventory Management System**. In that environment, users, orders, line items, physical inventory counts, and shipping tracking numbers must maintain rigid transactional relationships across decoupled entities where data consistency is crucial.

---

## 2. The Same Data in SQL (PostgreSQL)
If this application were migrated to a relational database infrastructure like PostgreSQL, the main guestbook data would be structured using the following definition syntax:

```sql
CREATE TABLE guestbooks (
    id VARCHAR(50) PRIMARY KEY,
    author_id UUID NOT NULL,
    display_name VARCHAR(50) NOT NULL,
    message VARCHAR(500) NOT NULL,
    approved BOOLEAN DEFAULT FALSE NOT NULL,
    likes INTEGER DEFAULT 0 NOT NULL,
    
    -- Integrity verification rule preventing negative interaction metrics
    CONSTRAINT chk_likes_non_negative CHECK (likes >= 0)
);
```

---

## 3. Arrays and Relationships in SQL
* **The Relational Approach:** Relational engines like SQL cannot natively store dynamic arrays (like our `likedby` array of user strings) directly inside a column cell without violating First Normal Form (1NF). 
* **The Extra Table:** To model this relationship in SQL, the array must be extracted into an entirely separate **junction table** (representing a many-to-many relationship) named **`guestbook_likes`**.
* **Foreign Keys:** This extra table would contain two explicit foreign keys linking the relationships together:
  * `guestbook_id` (Foreign Key pointing to `guestbooks.id`)
  * `user_id` (Foreign Key pointing to `users.id`)

---

## 4. Who Enforces the Rules?
Our stack distributes data layout rules across different software layers to maximize validation efficiency.

| Application Layer / Schema Rule | Enforced By (MongoDB / Mongoose / Zod) | Enforced by DB in PostgreSQL? |
| :--- | :--- | :--- |
| **Input Data Types (e.g., must be a string)** | **Zod** (at request edge) & **Mongoose** (at model layer) | **Yes** (Strictly enforced by columns types) |
| **String Length Bounds (e.g., 3-30 characters)**| **Zod** & **Mongoose** | **Yes** (Via `VARCHAR(N)` or `CHECK` limits) |
| **Email Text Format Checking** | **Zod** | **Yes** (Via `CHECK` constraints or regex matches) |
| **Unique Constraints (e.g., unique username)** | **MongoDB** (via underlying collection indexes) | **Yes** (Via `UNIQUE` constraints) |
| **Default Field Values (e.g., approved: false)** | **Mongoose** | **Yes** (Via `DEFAULT` column descriptors) |

---

## 5. Custom IDs
* **Why it fits the Guestbook:** Readable, sequential IDs (like `GB-0001`) are perfectly fine for a public guestbook because there is no security or privacy risk associated with revealing post sequences. It provides an intuitive, clean visual tracking system for graders and visitors to see message order.
* **Why it is a bad choice for User Accounts:** Sequential IDs are highly dangerous for user account entities because they expose a vulnerability known as **Insecure Direct Object Reference (IDOR)**. An attacker can look at their own ID (e.g., `USER-0005`) and trivially guess that `USER-0004` exists, allowing them to systematically scrape user accounts or launch targeted brute-force attacks. User profiles should always use non-sequential, random identifiers like **UUIDv4**.

---

## 6. Atomic Updates & Race Conditions
* **The Like Route Race Condition:** Our application prevents a concurrent data corruption event known as a "Lost Update" anomaly. 
* **The Breakdown of Read-Check-Save:** If we handled liking by fetching the document into JavaScript memory, checking the array, incrementing the count, and executing `.save()`, two rapid clicks hitting the server simultaneously could both read the original count at the exact same millisecond (e.g., `likes: 10`). Both threads would calculate `10 + 1 = 11`, and both would save `11` back to the database. The total count would end up as `11` instead of `12`, resulting in a lost click interaction.
* **Our Prevention Layer:** We completely avoid this by using Mongoose/MongoDB **atomic operators** (`$inc` and `$addToSet`) in a single database command. This forces the write operation to execute isolated at the database engine level, guaranteeing every concurrent write locks the document and sequences properly.

---

## 7. Database Transactions
* **When a transaction is required:** A complete multi-document Transaction (all-or-nothing execution block) would be mandatory if we implemented a feature like **Admin User Deletion that must cleanly re-assign post metrics**. 
* **Why findOneAndUpdate is not enough:** A single `findOneAndUpdate` command can only target and lock a **single document inside one collection**. If you need to delete a user from the `users` collection AND simultaneously flush 15 matching messages from the `guestbooks` collection, you are altering multiple data blocks. If the server crashes halfway through, you end up with orphaned posts belonging to a non-existent author. Wrap these paths inside a session transaction (`session.startTransaction()`) to guarantee both actions pass together, or both cleanly roll back if an error occurs.

---

## 8. Deactivate, Don't Delete
* **What currently happens on deletion:** If a database row is forcefully deleted completely, it breaks application state synchronization, leading to broken layout elements on the UI front-end or server-side null property crashes when reading entries whose original structural author `_id` is missing.
* **What should happen (Best Practice):** To preserve metrics history without throwing layout exceptions, users are **deactivated, never deleted**. We update an `isActive: false` status flag in their document schema. Their public posts and historical likes stay visually intact to protect data integrity, but their authentication session tokens are permanently invalidated—preventing them from logging back in or issuing new actions unless re-enabled by an admin.
