# Install Prisma CLI as dev dependency
npm install prisma --save-dev

# Install Prisma Client
npm install @prisma/client

# Initialize prisma
npx prisma init 

# Creation de la base de donnee en local
 npx prisma db push

 # Recuperer les tables de la base de donnees
npx prisma db pull


# 📚 Complete Prisma Queries Reference Guide

## Table of Contents
1. [Setup](#setup)
2. [Create Operations](#create-operations)
3. [Read Operations](#read-operations)
4. [Update Operations](#update-operations)
5. [Delete Operations](#delete-operations)
6. [Filtering & Sorting](#filtering--sorting)
7. [Relations](#relations)
8. [Aggregations](#aggregations)
9. [Transactions](#transactions)
10. [Raw Queries](#raw-queries)
11. [Advanced Operations](#advanced-operations)

---

## Setup

```javascript
const { PrismaClient } = require('@prisma/client');
// import {PrismaCient} from '@prisma/client'
const prisma = new PrismaClient();

// Example Schema
// model User {
//   id        Int      @id @default(autoincrement())
//   email     String   @unique
//   name      String?
//   age       Int?
//   role      String   @default("USER")
//   posts     Post[]
//   profile   Profile?
//   createdAt DateTime @default(now())
//   updatedAt DateTime @updatedAt
// }
//
// model Post {
//   id        Int      @id @default(autoincrement())
//   title     String
//   content   String?
//   published Boolean  @default(false)
//   views     Int      @default(0)
//   author    User     @relation(fields: [authorId], references: [id])
//   authorId  Int
//   categories Category[]
//   createdAt DateTime @default(now())
// }
//
// model Profile {
//   id     Int    @id @default(autoincrement())
//   bio    String
//   userId Int    @unique
//   user   User   @relation(fields: [userId], references: [id])
// }
//
// model Category {
//   id    Int    @id @default(autoincrement())
//   name  String @unique
//   posts Post[]
// }
```

---

## Create Operations

### 1. **create** - Create a single record

```javascript
// Basic create
const user = await prisma.user.create({
  data: {
    email: 'john@example.com',
    name: 'John Doe',
    age: 30
  }
});

// Create with relations
const userWithPost = await prisma.user.create({
  data: {
    email: 'jane@example.com',
    name: 'Jane Smith',
    posts: {
      create: [
        { title: 'First Post', content: 'Hello World' },
        { title: 'Second Post', content: 'Learning Prisma' }
      ]
    }
  },
  include: {
    posts: true
  }
});

// Create with nested relations
const userWithProfile = await prisma.user.create({
  data: {
    email: 'bob@example.com',
    name: 'Bob Johnson',
    profile: {
      create: {
        bio: 'Software Developer'
      }
    }
  },
  include: {
    profile: true
  }
});
```

### 2. **createMany** - Create multiple records

```javascript
// Create multiple users
const result = await prisma.user.createMany({
  data: [
    { email: 'user1@example.com', name: 'User 1', age: 25 },
    { email: 'user2@example.com', name: 'User 2', age: 30 },
    { email: 'user3@example.com', name: 'User 3', age: 35 }
  ],
  skipDuplicates: true // Skip records with duplicate unique fields
});

console.log(`Created ${result.count} users`);
```

### 3. **createManyAndReturn** - Create multiple and return created records

```javascript
// Available in Prisma 5.14+
const users = await prisma.user.createManyAndReturn({
  data: [
    { email: 'new1@example.com', name: 'New User 1' },
    { email: 'new2@example.com', name: 'New User 2' }
  ]
});

console.log(users); // Returns array of created users
```

---

## Read Operations

### 4. **findUnique** - Find a single unique record

```javascript
// Find by unique field
const user = await prisma.user.findUnique({
  where: {
    email: 'john@example.com'
  }
});

// Find by ID
const userById = await prisma.user.findUnique({
  where: {
    id: 1
  }
});

// Find with relations
const userWithPosts = await prisma.user.findUnique({
  where: {
    email: 'john@example.com'
  },
  include: {
    posts: true,
    profile: true
  }
});

// Find with select specific fields
const userSelected = await prisma.user.findUnique({
  where: { id: 1 },
  select: {
    id: true,
    name: true,
    email: true,
    posts: {
      select: {
        title: true
      }
    }
  }
});
```

### 5. **findUniqueOrThrow** - Find unique or throw error

```javascript
try {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      email: 'nonexistent@example.com'
    }
  });
} catch (error) {
  console.log('User not found!'); // Throws NotFoundError
}
```

### 6. **findFirst** - Find first matching record

```javascript
// Find first user
const firstUser = await prisma.user.findFirst();

// Find first with condition
const firstAdult = await prisma.user.findFirst({
  where: {
    age: {
      gte: 18
    }
  }
});

// Find first with ordering
const youngestUser = await prisma.user.findFirst({
  orderBy: {
    age: 'asc'
  }
});

// Find first with multiple conditions
const firstPublishedPost = await prisma.post.findFirst({
  where: {
    published: true,
    views: {
      gt: 100
    }
  },
  orderBy: {
    createdAt: 'desc'
  }
});
```

### 7. **findFirstOrThrow** - Find first or throw error

```javascript
try {
  const user = await prisma.user.findFirstOrThrow({
    where: {
      email: {
        endsWith: '@nonexistent.com'
      }
    }
  });
} catch (error) {
  console.log('No matching user found!');
}
```

### 8. **findMany** - Find multiple records

```javascript
// Find all users
const allUsers = await prisma.user.findMany();

// Find with conditions
const adults = await prisma.user.findMany({
  where: {
    age: {
      gte: 18
    }
  }
});

// Find with pagination
const paginatedUsers = await prisma.user.findMany({
  skip: 10,
  take: 5,
  orderBy: {
    createdAt: 'desc'
  }
});

// Find with multiple conditions
const filteredUsers = await prisma.user.findMany({
  where: {
    AND: [
      { age: { gte: 18 } },
      { email: { contains: '@example.com' } }
    ]
  },
  orderBy: [
    { age: 'desc' },
    { name: 'asc' }
  ]
});

// Find with relations
const usersWithPosts = await prisma.user.findMany({
  include: {
    posts: {
      where: {
        published: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    }
  }
});

// Find with select
const userNames = await prisma.user.findMany({
  select: {
    id: true,
    name: true,
    _count: {
      select: { posts: true }
    }
  }
});
```

---

## Update Operations

### 9. **update** - Update a single record

```javascript
// Basic update
const updatedUser = await prisma.user.update({
  where: {
    email: 'john@example.com'
  },
  data: {
    name: 'John Updated',
    age: 31
  }
});

// Update with increment
const incrementedPost = await prisma.post.update({
  where: { id: 1 },
  data: {
    views: {
      increment: 1
    }
  }
});

// Update with decrement
const decrementedPost = await prisma.post.update({
  where: { id: 1 },
  data: {
    views: {
      decrement: 5
    }
  }
});

// Update with multiply
const multipliedViews = await prisma.post.update({
  where: { id: 1 },
  data: {
    views: {
      multiply: 2
    }
  }
});

// Update with divide
const dividedViews = await prisma.post.update({
  where: { id: 1 },
  data: {
    views: {
      divide: 2
    }
  }
});

// Update relations
const userWithNewPost = await prisma.user.update({
  where: { id: 1 },
  data: {
    posts: {
      create: {
        title: 'New Post',
        content: 'This is a new post'
      }
    }
  },
  include: {
    posts: true
  }
});

// Update nested relations
const updatedUserProfile = await prisma.user.update({
  where: { id: 1 },
  data: {
    profile: {
      update: {
        bio: 'Updated bio'
      }
    }
  },
  include: {
    profile: true
  }
});

// Connect existing relations
const connectPost = await prisma.user.update({
  where: { id: 1 },
  data: {
    posts: {
      connect: { id: 5 }
    }
  }
});

// Disconnect relations
const disconnectPost = await prisma.user.update({
  where: { id: 1 },
  data: {
    posts: {
      disconnect: { id: 5 }
    }
  }
});
```

### 10. **updateMany** - Update multiple records

```javascript
// Update all matching records
const result = await prisma.user.updateMany({
  where: {
    age: {
      lt: 18
    }
  },
  data: {
    role: 'MINOR'
  }
});

console.log(`Updated ${result.count} users`);

// Update all records (no where clause)
const updateAll = await prisma.post.updateMany({
  data: {
    published: false
  }
});

// Update with increment on multiple records
const incrementViews = await prisma.post.updateMany({
  where: {
    published: true
  },
  data: {
    views: {
      increment: 10
    }
  }
});
```

### 11. **upsert** - Update or create

```javascript
// Update if exists, create if doesn't
const user = await prisma.user.upsert({
  where: {
    email: 'john@example.com'
  },
  update: {
    name: 'John Updated',
    age: 32
  },
  create: {
    email: 'john@example.com',
    name: 'John Doe',
    age: 30
  }
});

// Upsert with relations
const userWithPost = await prisma.user.upsert({
  where: { email: 'jane@example.com' },
  update: {
    name: 'Jane Updated'
  },
  create: {
    email: 'jane@example.com',
    name: 'Jane Smith',
    posts: {
      create: {
        title: 'First Post'
      }
    }
  },
  include: {
    posts: true
  }
});
```

---

## Delete Operations

### 12. **delete** - Delete a single record

```javascript
// Basic delete
const deletedUser = await prisma.user.delete({
  where: {
    email: 'john@example.com'
  }
});

// Delete by ID
const deletedPost = await prisma.post.delete({
  where: {
    id: 1
  }
});

// Delete with return
const deleted = await prisma.user.delete({
  where: { id: 5 },
  select: {
    name: true,
    email: true
  }
});
```

### 13. **deleteMany** - Delete multiple records

```javascript
// Delete all matching records
const result = await prisma.user.deleteMany({
  where: {
    age: {
      lt: 18
    }
  }
});

console.log(`Deleted ${result.count} users`);

// Delete all records
const deleteAll = await prisma.post.deleteMany({});

// Delete with multiple conditions
const deleteFiltered = await prisma.post.deleteMany({
  where: {
    AND: [
      { published: false },
      { views: { lt: 10 } },
      { createdAt: { lt: new Date('2024-01-01') } }
    ]
  }
});
```

---

## Filtering & Sorting

### 14. **where** - Filter conditions

```javascript
// Equals
const exactMatch = await prisma.user.findMany({
  where: {
    name: 'John Doe'
  }
});

// Not equals
const notMatch = await prisma.user.findMany({
  where: {
    name: {
      not: 'John Doe'
    }
  }
});

// In array
const inArray = await prisma.user.findMany({
  where: {
    id: {
      in: [1, 2, 3, 4, 5]
    }
  }
});

// Not in array
const notInArray = await prisma.user.findMany({
  where: {
    role: {
      notIn: ['ADMIN', 'MODERATOR']
    }
  }
});

// Less than
const lessThan = await prisma.user.findMany({
  where: {
    age: {
      lt: 18
    }
  }
});

// Less than or equal
const lessThanOrEqual = await prisma.user.findMany({
  where: {
    age: {
      lte: 18
    }
  }
});

// Greater than
const greaterThan = await prisma.user.findMany({
  where: {
    age: {
      gt: 65
    }
  }
});

// Greater than or equal
const greaterThanOrEqual = await prisma.user.findMany({
  where: {
    age: {
      gte: 18
    }
  }
});

// Contains (case-sensitive)
const contains = await prisma.user.findMany({
  where: {
    email: {
      contains: '@example.com'
    }
  }
});

// Contains (case-insensitive - PostgreSQL & MongoDB only)
const containsInsensitive = await prisma.user.findMany({
  where: {
    email: {
      contains: 'EXAMPLE',
      mode: 'insensitive'
    }
  }
});

// Starts with
const startsWith = await prisma.user.findMany({
  where: {
    name: {
      startsWith: 'John'
    }
  }
});

// Ends with
const endsWith = await prisma.user.findMany({
  where: {
    email: {
      endsWith: '@gmail.com'
    }
  }
});

// AND conditions
const andConditions = await prisma.user.findMany({
  where: {
    AND: [
      { age: { gte: 18 } },
      { role: 'USER' },
      { email: { contains: '@example.com' } }
    ]
  }
});

// OR conditions
const orConditions = await prisma.user.findMany({
  where: {
    OR: [
      { age: { lt: 18 } },
      { age: { gt: 65 } }
    ]
  }
});

// NOT conditions
const notConditions = await prisma.user.findMany({
  where: {
    NOT: {
      email: {
        endsWith: '@spam.com'
      }
    }
  }
});

// Complex nested conditions
const complexFilter = await prisma.user.findMany({
  where: {
    AND: [
      {
        OR: [
          { age: { lt: 18 } },
          { age: { gt: 65 } }
        ]
      },
      {
        NOT: {
          email: {
            contains: 'spam'
          }
        }
      }
    ]
  }
});

// Is null
const isNull = await prisma.user.findMany({
  where: {
    name: null
  }
});

// Is not null
const isNotNull = await prisma.user.findMany({
  where: {
    name: {
      not: null
    }
  }
});
```

### 15. **orderBy** - Sort results

```javascript
// Order by single field ascending
const orderedAsc = await prisma.user.findMany({
  orderBy: {
    age: 'asc'
  }
});

// Order by single field descending
const orderedDesc = await prisma.user.findMany({
  orderBy: {
    createdAt: 'desc'
  }
});

// Order by multiple fields
const multipleOrder = await prisma.user.findMany({
  orderBy: [
    { age: 'desc' },
    { name: 'asc' }
  ]
});

// Order by relation count
const orderByCount = await prisma.user.findMany({
  orderBy: {
    posts: {
      _count: 'desc'
    }
  }
});

// Order by relation field
const orderByRelation = await prisma.post.findMany({
  orderBy: {
    author: {
      name: 'asc'
    }
  }
});
```

### 16. **pagination** - Skip and take

```javascript
// Basic pagination
const page1 = await prisma.user.findMany({
  skip: 0,
  take: 10
});

const page2 = await prisma.user.findMany({
  skip: 10,
  take: 10
});

// Pagination with ordering
const paginatedSorted = await prisma.user.findMany({
  skip: 20,
  take: 10,
  orderBy: {
    createdAt: 'desc'
  }
});

// Cursor-based pagination
const cursorPagination = await prisma.user.findMany({
  take: 10,
  skip: 1, // Skip the cursor
  cursor: {
    id: 10 // Start after this ID
  },
  orderBy: {
    id: 'asc'
  }
});
```

---

## Relations

### 17. **include** - Include related data

```javascript
// Include single relation
const userWithPosts = await prisma.user.findUnique({
  where: { id: 1 },
  include: {
    posts: true
  }
});

// Include multiple relations
const userWithAll = await prisma.user.findUnique({
  where: { id: 1 },
  include: {
    posts: true,
    profile: true
  }
});

// Include nested relations
const userNested = await prisma.user.findUnique({
  where: { id: 1 },
  include: {
    posts: {
      include: {
        categories: true
      }
    }
  }
});

// Include with filters
const userWithPublishedPosts = await prisma.user.findUnique({
  where: { id: 1 },
  include: {
    posts: {
      where: {
        published: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 5
    }
  }
});
```

### 18. **select** - Select specific fields

```javascript
// Select specific fields
const userSelected = await prisma.user.findUnique({
  where: { id: 1 },
  select: {
    id: true,
    name: true,
    email: true
  }
});

// Select with relations
const userWithPostTitles = await prisma.user.findUnique({
  where: { id: 1 },
  select: {
    name: true,
    posts: {
      select: {
        title: true,
        published: true
      }
    }
  }
});

// Select nested
const nestedSelect = await prisma.user.findUnique({
  where: { id: 1 },
  select: {
    name: true,
    posts: {
      select: {
        title: true,
        categories: {
          select: {
            name: true
          }
        }
      }
    }
  }
});
```

### 19. **Relation filters**

```javascript
// Filter by relation existence
const usersWithPosts = await prisma.user.findMany({
  where: {
    posts: {
      some: {} // Has at least one post
    }
  }
});

// Filter by no relations
const usersWithoutPosts = await prisma.user.findMany({
  where: {
    posts: {
      none: {} // Has no posts
    }
  }
});

// Filter by all relations matching
const usersAllPublished = await prisma.user.findMany({
  where: {
    posts: {
      every: {
        published: true
      }
    }
  }
});

// Filter by relation field
const usersByPostTitle = await prisma.user.findMany({
  where: {
    posts: {
      some: {
        title: {
          contains: 'Prisma'
        }
      }
    }
  }
});

// Complex relation filters
const complexRelationFilter = await prisma.user.findMany({
  where: {
    posts: {
      some: {
        AND: [
          { published: true },
          { views: { gt: 100 } },
          {
            categories: {
              some: {
                name: 'Technology'
              }
            }
          }
        ]
      }
    }
  }
});
```

---

## Aggregations

### 20. **count** - Count records

```javascript
// Count all
const totalUsers = await prisma.user.count();

// Count with filter
const adultCount = await prisma.user.count({
  where: {
    age: {
      gte: 18
    }
  }
});

// Count with relation filter
const usersWithPosts = await prisma.user.count({
  where: {
    posts: {
      some: {}
    }
  }
});

// Count by field
const countByField = await prisma.user.count({
  select: {
    _all: true,
    name: true,
    email: true
  }
});
```

### 21. **aggregate** - Aggregate operations

```javascript
// Count, average, sum, min, max
const stats = await prisma.user.aggregate({
  _count: true,
  _avg: {
    age: true
  },
  _sum: {
    age: true
  },
  _min: {
    age: true
  },
  _max: {
    age: true
  }
});

console.log(stats);
// {
//   _count: 100,
//   _avg: { age: 32.5 },
//   _sum: { age: 3250 },
//   _min: { age: 18 },
//   _max: { age: 75 }
// }

// Aggregate with filter
const filteredStats = await prisma.post.aggregate({
  where: {
    published: true
  },
  _avg: {
    views: true
  },
  _sum: {
    views: true
  }
});

// Aggregate multiple fields
const multipleAgg = await prisma.post.aggregate({
  _count: {
    _all: true,
    id: true
  },
  _avg: {
    views: true
  },
  _sum: {
    views: true
  }
});
```

### 22. **groupBy** - Group and aggregate

```javascript
// Group by single field
const groupedByRole = await prisma.user.groupBy({
  by: ['role'],
  _count: true
});

// Group by multiple fields
const groupedMultiple = await prisma.user.groupBy({
  by: ['role', 'age'],
  _count: true,
  _avg: {
    age: true
  }
});

// Group with filter
const groupedFiltered = await prisma.post.groupBy({
  by: ['authorId'],
  where: {
    published: true
  },
  _count: {
    _all: true
  },
  _sum: {
    views: true
  }
});

// Group with having
const groupedHaving = await prisma.post.groupBy({
  by: ['authorId'],
  _count: {
    _all: true
  },
  _avg: {
    views: true
  },
  having: {
    views: {
      _avg: {
        gt: 100
      }
    }
  }
});

// Group with order
const groupedOrdered = await prisma.user.groupBy({
  by: ['role'],
  _count: true,
  orderBy: {
    _count: {
      role: 'desc'
    }
  }
});
```

---

## Transactions

### 23. **$transaction (Sequential)** - Execute multiple operations

```javascript
// Sequential transaction
const [newUser, newPost] = await prisma.$transaction([
  prisma.user.create({
    data: {
      email: 'transaction@example.com',
      name: 'Transaction User'
    }
  }),
  prisma.post.create({
    data: {
      title: 'Transaction Post',
      authorId: 1
    }
  })
]);

// Transaction with rollback on error
try {
  const result = await prisma.$transaction([
    prisma.user.create({
      data: { email: 'user1@example.com', name: 'User 1' }
    }),
    prisma.user.create({
      data: { email: 'user1@example.com', name: 'User 2' } // Duplicate email - will fail
    })
  ]);
} catch (error) {
  console.log('Transaction rolled back');
}
```

### 24. **$transaction (Interactive)** - Interactive transactions

```javascript
// Interactive transaction with full control
const result = await prisma.$transaction(async (tx) => {
  // Create user
  const user = await tx.user.create({
    data: {
      email: 'interactive@example.com',
      name: 'Interactive User'
    }
  });

  // Create post for that user
  const post = await tx.post.create({
    data: {
      title: 'First Post',
      authorId: user.id
    }
  });

  // Update user with post count
  const updatedUser = await tx.user.update({
    where: { id: user.id },
    data: {
      // Custom logic here
    }
  });

  return { user, post, updatedUser };
});

// Interactive transaction with conditional logic
const transfer = await prisma.$transaction(async (tx) => {
  const sender = await tx.user.findUnique({
    where: { id: 1 }
  });

  if (!sender) {
    throw new Error('Sender not found');
  }

  // Perform operations based on conditions
  const receiver = await tx.user.update({
    where: { id: 2 },
    data: {
      // Update logic
    }
  });

  return { sender, receiver };
});

// Transaction with timeout
const resultWithTimeout = await prisma.$transaction(
  async (tx) => {
    // Your operations
    return await tx.user.findMany();
  },
  {
    maxWait: 5000, // Wait max 5s for transaction to start
    timeout: 10000, // Timeout after 10s
  }
);
```

---

## Raw Queries

### 25. **$queryRaw** - Execute raw SQL queries (SELECT)

```javascript
const { Prisma } = require('@prisma/client');

// Basic raw query
const users = await prisma.$queryRaw`SELECT * FROM "User"`;

// Raw query with parameters (SAFE)
const email = 'john@example.com';
const user = await prisma.$queryRaw`
  SELECT * FROM "User" 
  WHERE email = ${email}
`;

// Raw query with multiple parameters
const minAge = 18;
const role = 'USER';
const filteredUsers = await prisma.$queryRaw`
  SELECT * FROM "User"
  WHERE age >= ${minAge} AND role = ${role}
`;

// Complex raw query
const stats = await prisma.$queryRaw`
  SELECT 
    u.id,
    u.name,
    COUNT(p.id) as post_count,
    AVG(p.views) as avg_views
  FROM "User" u
  LEFT JOIN "Post" p ON p."authorId" = u.id
  GROUP BY u.id, u.name
  HAVING COUNT(p.id) > 0
  ORDER BY post_count DESC
`;

// Raw query with Prisma.sql helper
const result = await prisma.$queryRaw(
  Prisma.sql`SELECT * FROM "User" WHERE id = ${1}`
);
```

### 26. **$executeRaw** - Execute raw SQL (INSERT, UPDATE, DELETE)

```javascript
// Raw insert
const insertResult = await prisma.$executeRaw`
  INSERT INTO "User" (email, name, age)
  VALUES (${'raw@example.com'}, ${'Raw User'}, ${25})
`;

// Raw update
const updateResult = await prisma.$executeRaw`
  UPDATE "User"
  SET name = ${'Updated Name'}
  WHERE email = ${'john@example.com'}
`;

// Raw delete
const deleteResult = await prisma.$executeRaw`
  DELETE FROM "User"
  WHERE age < ${18}
`;

console.log(`Affected rows: ${deleteResult}`);
```

### 27. **$queryRawUnsafe** - Unsafe raw query (USE WITH CAUTION)

```javascript
// ⚠️ UNSAFE - Only use with trusted input
const tableName = 'User'; // Make sure this is validated!
const users = await prisma.$queryRawUnsafe(
  `SELECT * FROM "${tableName}"`
);

// ⚠️ NEVER do this with user input
// const email = req.body.email; // DON'T!
// const users = await prisma.$queryRawUnsafe(
//   `SELECT * FROM "User" WHERE email = '${email}'`
// ); // SQL INJECTION VULNERABLE!
```

### 28. **$executeRawUnsafe** - Unsafe raw execute (USE WITH CAUTION)

```javascript
// ⚠️ UNSAFE - Only use with trusted input
const result = await prisma.$executeRawUnsafe(
  `UPDATE "User" SET name = 'Admin' WHERE id = 1`
);
```

---

## Advanced Operations

### 29. **distinct** - Get distinct values

```javascript
// Get distinct roles
const distinctRoles = await prisma.user.findMany({
  distinct: ['role']
});

// Get distinct by multiple fields
const distinctUsers = await prisma.user.findMany({
  distinct: ['role', 'age']
});

// Distinct with select
const distinctEmails = await prisma.user.findMany({
  distinct: ['email'],
  select: {
    email: true
  }
});
```

### 30. **Batch operations**

```javascript
// Batch writes with transactions
const batchCreate = await prisma.$transaction(
  Array.from({ length: 100 }, (_, i) => 
    prisma.user.create({
      data: {
        email: `user${i}@example.com`,
        name: `User ${i}`
      }
    })
  )
);

// Batch update
const batchUpdate = await Promise.all(
  [1, 2, 3, 4, 5].map(id =>
    prisma.user.update({
      where: { id },
      data: { role: 'PREMIUM' }
    })
  )
);
```

### 31. **exists** - Check if record exists

```javascript
// Check using count
const userExists = await prisma.user.count({
  where: { email: 'john@example.com' }
}) > 0;

// Check using findFirst
const exists = await prisma.user.findFirst({
  where: { email: 'john@example.com' },
  select: { id: true }
}) !== null;

// More efficient exists check (returns boolean)
const checkExists = async (email) => {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true }
  });
  return user !== null;
};
```

### 32. **Middleware** - Intercept queries

```javascript
// Soft delete middleware
prisma.$use(async (params, next) => {
  if (params.model === 'User') {
    if (params.action === 'delete') {
      // Change delete to update
      params.action = 'update';
      params.args['data'] = { deleted: true };
    }
    if (params.action === 'deleteMany') {
      params.action = 'updateMany';
      if (params.args.data !== undefined) {
        params.args.data['deleted'] = true;
      } else {
        params.args['data'] = { deleted: true };
      }
    }
  }
  return next(params);
});

// Logging middleware
prisma.$use(async (params, next) => {
  const before = Date.now();
  const result = await next(params);
  const after = Date.now();
  
  console.log(`Query ${params.model}.${params.action} took ${after - before}ms`);
  
  return result;
});
```

### 33. **Connection management**

```javascript
// Connect explicitly
await prisma.$connect();

// Disconnect
await prisma.$disconnect();

// Check connection
try {
  await prisma.$connect();
  console.log('Connected to database');
} catch (error) {
  console.error('Failed to connect:', error);
}

// Execute raw with connection
await prisma.$executeRaw`SELECT 1`;
```

### 34. **Field-level operations**

```javascript
// Set field to null
const nullField = await prisma.user.update({
  where: { id: 1 },
  data: {
    name: null
  }
});

// Unset field (for optional fields)
const unsetField = await prisma.user.update({
  where: { id: 1 },
  data: {
    age: undefined // Doesn't update the field
  }
});
```

### 35. **Scalar list operations** (for array fields)

```javascript
// Assuming a model with array field:
// model User {
//   tags String[]
// }

// Set array
const setArray = await prisma.user.update({
  where: { id: 1 },
  data: {
    tags: ['tag1', 'tag2', 'tag3']
  }
});

// Push to array
const pushArray = await prisma.user.update({
  where: { id: 1 },
  data: {
    tags: {
      push: 'newTag'
    }
  }
});

// Push multiple
const pushMultiple = await prisma.user.update({
  where: { id: 1 },
  data: {
    tags: {
      push: ['tag4', 'tag5']
    }
  }
});

// Set to empty array
const emptyArray = await prisma.user.update({
  where: { id: 1 },
  data: {
    tags: []
  }
});
```

### 36. **Extended operations**

```javascript
// Find many or throw
const users = await prisma.user.findMany({
  where: { role: 'ADMIN' }
});
if (users.length === 0) {
  throw new Error('No admins found');
}

// Create if not exists
const getOrCreate = async (email) => {
  let user = await prisma.user.findUnique({
    where: { email }
  });
  
  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        name: 'New User'
      }
    });
  }
  
  return user;
};

// Update or delete based on condition
const updateOrDelete = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id }
  });
  
  if (user.age < 18) {
    return await prisma.user.delete({
      where: { id }
    });
  } else {
    return await prisma.user.update({
      where: { id },
      data: { role: 'VERIFIED' }
    });
  }
};
```

---

## Complete Example Application

```javascript
const express = require('express');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

// Create user
app.post('/users', async (req, res) => {
  try {
    const user = await prisma.user.create({
      data: req.body
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all users with pagination
app.get('/users', async (req, res) => {
  const { skip = 0, take = 10, search } = req.query;
  
  try {
    const users = await prisma.user.findMany({
      skip: parseInt(skip),
      take: parseInt(take),
      where: search ? {
        OR: [
          { name: { contains: search } },
          { email: { contains: search } }
        ]
      } : undefined,
      include: {
        _count: {
          select: { posts: true }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    const total = await prisma.user.count({
      where: search ? {
        OR: [
          { name: { contains: search } },
          { email: { contains: search } }
        ]
      } : undefined
    });
    
    res.json({ users, total });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user by ID
app.get('/users/:id', async (req, res) => {
  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: parseInt(req.params.id) },
      include: {
        posts: true,
        profile: true
      }
    });
    res.json(user);
  } catch (error) {
    res.status(404).json({ error: 'User not found' });
  }
});

// Update user
app.put('/users/:id', async (req, res) => {
  try {
    const user = await prisma.user.update({
      where: { id: parseInt(req.params.id) },
      data: req.body
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete user
app.delete('/users/:id', async (req, res) => {
  try {
    await prisma.user.delete({
      where: { id: parseInt(req.params.id) }
    });
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Stats endpoint
app.get('/stats', async (req, res) => {
  try {
    const [userCount, postCount, avgAge] = await prisma.$transaction([
      prisma.user.count(),
      prisma.post.count(),
      prisma.user.aggregate({
        _avg: { age: true }
      })
    ]);
    
    res.json({
      users: userCount,
      posts: postCount,
      averageAge: avgAge._avg.age
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

---

## Summary of All Queries

1. **create** - Create single record
2. **createMany** - Create multiple records
3. **createManyAndReturn** - Create multiple and return them
4. **findUnique** - Find one by unique field
5. **findUniqueOrThrow** - Find unique or throw error
6. **findFirst** - Find first matching record
7. **findFirstOrThrow** - Find first or throw error
8. **findMany** - Find multiple records
9. **update** - Update single record
10. **updateMany** - Update multiple records
11. **upsert** - Update or create
12. **delete** - Delete single record
13. **deleteMany** - Delete multiple records
14. **count** - Count records
15. **aggregate** - Aggregate operations
16. **groupBy** - Group and aggregate
17. **$queryRaw** - Raw SELECT queries
18. **$executeRaw** - Raw INSERT/UPDATE/DELETE
19. **$queryRawUnsafe** - Unsafe raw query
20. **$executeRawUnsafe** - Unsafe raw execute
21. **$transaction** - Execute transactions
22. **include** - Include relations
23. **select** - Select specific fields
24. **where** - Filter conditions
25. **orderBy** - Sort results
26. **distinct** - Get distinct values
27. **skip/take** - Pagination
28. **cursor** - Cursor-based pagination

---

This guide covers all major Prisma query operations with practical examples!
