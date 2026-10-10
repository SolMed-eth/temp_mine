# Database Basics

1. Table

Tabel is place to store the type of data 

Example : 
```
Users
Posts
Comments

```

2. Row

Row is just a record inside the table 

```
Users

id     username
----------------
87738  salah      ← Row
92341  hamza      ← Row

```

3. Column

```
Users

id | username | email

```

4. Primary Key (PK)
5. Foreign Key (FK)

Users.id       → Primary Key
Posts.user_id  → Foreign Key

# Schema

                 DATABASE
                     │
          ┌──────────┴──────────┐
          │                     │
        USERS                  POSTS
     ┌──────────┐          ┌────────────┐
     │ id   PK  │◄─────────│ user_id FK │
     │ username │          │ id     PK  │
     │ email    │          │ caption    │
     └──────────┘          └────────────┘

# Relationships

1. One-to-One       1 ↔ 1
2. One-to-Many      1 → N
3. Many-to-Many     N ↔ N

# 1. One-to-Many

Mean one from table A i9der ikon m3a bzaaaf in the Table B 

Example => User → Posts

one user can set multi posts or multi commits or multi likes

User → Posts
User → Comments
User → Notifications

# 2. One-to-One

1 User → 1 Profile
Profiles
id = 500
user_id = 100
bio = "Backend developer"

Hna kandamno Bli user maymknch ikon 3ndo multi profiles 

# 3. Many-to-Many

User ──── Posts        → One-to-Many
User ──── Comments     → One-to-Many
User ──── Profile      → One-to-One
User ──── Likes        → Many-to-Many
User ──── Follows      → Many-to-Many

Hna f many to many darori kaykhasna table 3 bach n9adro nkhaliw user multi idir likes 3la bzaaf dyal posts ou nkhalih posts ikon fih bzaaf dyal likes mn bzaaf dyal users so khasna teble khra li aykon fiha user.id ou post.id 

id    user_id    post_id
-------------------------
1     100        1
2     100        2
3     100        3
4     200        1
5     200        3
6     300        1


Name this table 

```
Junction Table
or
Join Table
```

A User can like many Posts.
A Post can be liked by many Users.

Users
  ↓
Likes
  ↓
Posts

Likes:
- user_id → Users.id (Foreign Key)
- post_id → Posts.id (Foreign Key)

Example:

Likes
┌───────┬─────────┐
│user_id│ post_id │
├───────┼─────────┤
│ 100   │    1    │
│ 100   │    2    │
│ 200   │    1    │
│ 300   │    1    │
└───────┴─────────┘

100 → 1 = Salah liked Post 1
200 → 1 = Hamza liked Post 1

Another example:

Users ↔ Users through Follows.

follower_id → Users.id
following_id → Users.id

# SQl basic command 

# SELECT 
SELECT * = it's mean search for all database 

SELECT * from Users =  it's mean get me all users in database 

SELECT username from users = mean get me username from database

SELECT id from Users = mean get me ID from database 

SELECT id, username, email
FROM Users = mean get me all this keyword in database.

// is so easy //

# WHERE

SELECT *
FROM Users
WHERE id = 100;

Here WHERE = mean give me this id user 

For example : 100   salah   salah@gmail.com

SELECT → شنو بغيت؟
FROM   → منين؟
WHERE  → شكون بالضبط؟

# INSERT

Insert ila bghina nzido chi user l database

INSERT INTO Users (id, username, email)
VALUES (500, 'youssef', 'youssef@gmail.com');

INSERT INTO = mean set this new user in database white param li ana an3tik (id, username, email)
VALUE = mean param li ana khasni ndakhel bcs, Hit nta ma3titich name w value, donc SQL kay7et lihom NULL ila ma kanouch NOT NULL.


IMPORT search for this 

```
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    value INT
);

```

model User {
  id    Int    @id @default(autoincrement())
  name  String?
  value Int?
}

// Hna Postger kaydir Auto id aykon hssn 

@default(autoincrement())

# UPDATE

UPDATE Users
SET email = 'new@gmail.com'
WHERE id = 100;

IMPORT hta update khasha WHERE bach n7aded ina id user khasni ndir lih update machi users kamlin wla table kaml 

# DELETE

DELETE FROM Users
WHERE id = 500;

IMPORT here DELETE method in sql whiteout WHERE raa t9der tmsaa7 database kamla 


// =============== //

SQL BASICS
══════════════════════════════

SELECT
→ نقرا الداتا

SELECT * FROM Users;

──────────────────────────────

WHERE
→ نحدد شنو بغينا

SELECT *
FROM Users
WHERE id = 100;

──────────────────────────────

INSERT
→ نزيد Row

INSERT INTO Users (id, username, email)
VALUES (500, 'youssef', 'youssef@gmail.com');

──────────────────────────────

UPDATE
→ نبدل Row

UPDATE Users
SET email = 'new@gmail.com'
WHERE id = 100;

──────────────────────────────

DELETE
→ نحيد Row

DELETE FROM Users
WHERE id = 500;

// =============== //

# Constraints 

Is rule from PostgreSQL protected data 

1. NOT NULL = it's mean maymknch this field khaso ikon NOT NULL darori value dyalo 
username TEXT NOT NULL
Donc username = NULL not valid 

username = "SAALAHEDDINE";

# UNIQUE 

2. Unique = it's mean The value this data khaso ikon unique 

email TEXT UNIQUE

# DEFULT 

defult = it's mean ila Database ma3ndhach value , kan3tiha defult value 
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

Example 

```
CREATE TABLE Users (
    id INTEGER PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

```

CONSTRAINTS
════════════════════════════

PRIMARY KEY
→ ID unique كيحدد كل Row

FOREIGN KEY
→ كيربط Table بـ Table أخرى

NOT NULL
→ value must be not a NULL

UNIQUE
→ makhasch ikon deplucate 3la value , value ga3ma ikon m3awd 

DEFAULT
→ Database katseti value ila ga3ma 3titha value 

Example 

```Users
┌────────┬──────────┬──────────────────┬────────────┐
│ id PK  │ username │ email            │ created_at │
│        │ NOT NULL │ NOT NULL         │ DEFAULT    │
│        │ UNIQUE   │ UNIQUE           │            │
└────────┴──────────┴──────────────────┴────────────┘
```
Constraints
     ↓
Rule set by Database
     ↓
Result data clean ou readble


# indexes

First problem, database has 1M client , search for example to the id(626617);

Kifach database radi tl9aa had id blama doz 3la database kamla 

So hna ja indexes, PostgreSQL kaykhdem b (B-Tree) bach n9adro ndiro search dyalna dakhel database 

# Transactions

Transaction
    │
    ├── Operation 1
    ├── Operation 2
    ├── Operation 3
    │
    ↓
ROLLBACK
    ↓
Transaction katrja3 l version dyalha li kant fiha Database

BUT ila daz kolchi COMMIT 

Example 

```
Users
100 Salah
200 Hamza
```

```
INSERT Reda
UPDATE Salah
DELETE Hamza
```
Ila w9aa3 error kandiro ROLLBACK ou karaj3o version lakhra li kant 3liha database 

# Prisma 

```
    Prisma ORM is an open-source, next-generation Object-Relational Mapper (ORM)
```

3arfin PostgreSQL katfhem SQL language 

SELECT * FROM users;


So we have like this 

```
TypeScript                    PostgreSQL
    │                              │
    │       ???                    │
    └───────────────┬──────────────┘
                    ↓
                  Prisma
```

Donc bach n9adro nhadro m3a database b typescript an7tajo tradiction 

```NestJS
   ↓
TypeScript
   ↓
   ORM (Prisma)
   ↓
PostgreSQL```


```TypeScript Object
       ↕
      ORM
       ↕
Database Table```


```
TypeScript:

user
{
  id: 1,
  username: "salah"
}
```


```
    PostgreSQL:

Users
┌────┬──────────┐
│ id │ username │
├────┼──────────┤
│ 1  │ salah    │
└────┴──────────┘
```


BIG pic 

```
                 Application
                      │
                   NestJS
                      │
                 TypeScript
                      │
                    Prisma
                      │
                SQL / Queries
                      │
                      ↓
                 PostgreSQL
                      │
                      ↓
                   Tables
```
So Prisma is just a (Software middleware)

```It is a middle layer that makes it easier for TypeScript/NestJS to work with PostgreSQL.```

```
TODO : leran GIT white certif 
TODO : UML knwo flowchart whole project 
TODO : Agil  method to qork white team 
    ```
        1-what did you do today?
        2-what problems did you face?
        3-what are you going to do tomorrow?

    ```
```

``` npx tsc --noEmit ``` check if files ts or check the error 

```The command npx tsc --noEmit runs the TypeScript compiler (tsc) to type-check your project without generating any output files. 

Key Details:

Type Checking Only: It scans your .ts files for type errors but does not compile them into JavaScript or create .js files. 
CI/CD Utility: It is commonly used in continuous integration pipelines and pre-commit hooks to ensure code quality before merging changes.
Exit Codes: The command returns an exit code of 0 if no errors are found, and a non-zero code (typically 1) if type errors exist, allowing scripts to fail automatically on errors. 
Local Execution: Using npx ensures the command uses the project-specific version of TypeScript installed in node_modules, rather than a globally installed version. 
This approach allows developers to treat TypeScript as a linter, catching type-related bugs without the overhead of emitting files, especially when using other tools (like Webpack, Vite, or esbuild) for actual compilation```

# 1. The problem

After configuring PostgreSQL, Prisma schema, and migrations, everything seemed correct:

```
PostgreSQL was running in Docker.
DATABASE_URL was correct.
schema.prisma was valid.
Prisma Client was generated successfully.
The database migration was applied successfully.
TypeScript compilation passed.
```

However, when starting the NestJS backend with:

npm run start:dev

the application crashed with:

```PrismaClientInitializationError:
PrismaClient was instantiated without any options.
A driver adapter is required to connect to your database.```

The important part of the error was:

```A driver adapter is required to connect to your database.```

Why did this happen?
The project uses Prisma 7.
In older Prisma versions, we could create the Prisma client directly:
```const prisma = new PrismaClient();```

and Prisma would use the database URL from the environment.
With Prisma 7, direct database connections require a driver adapter.
For PostgreSQL, Prisma provides:

```@prisma/adapter-pg```

This adapter uses the PostgreSQL driver:

```pg```

```NestJS
   │
   ▼
PrismaService
   │
   ▼
PrismaClient
   │
   ▼
PrismaPg Adapter
   │
   ▼
pg
   │
   ▼
PostgreSQL
   │
   ▼
Docker```

The missing part was the connection between:
```PrismaClient → PostgreSQL```

because Prisma 7 expects a PostgreSQL driver adapter. 

# 3. Why was TypeScript not showing an error?

This is an important point.
We ran:
```npx tsc --noEmit
```
and it succeeded.
That means:
The TypeScript code was syntactically and type-wise valid.

But that does not mean the application can successfully connect to PostgreSQL at runtime.


# Compile time
```TypeScript
   ↓
Is the code valid?
   ↓
YES```

# Runtime
```Application starts
   ↓
PrismaClient is created
   ↓
Prisma tries to connect
   ↓
ERROR```

So ```npx tsc --noEmit``` checks the code.
While: ```npm run start:dev``` actually starts the application and initializes Prisma.

# 4. The solution

Because we use PostgreSQL, we need to install the PostgreSQL Prisma adapter and PostgreSQL driver.

inside backend run ```npm install @prisma/adapter-pg pg```

What are these packages?
```@prisma/adapter-pg```

Prisma's adapter that allows Prisma 7 to communicate with PostgreSQL.
Howa adapter dyal Prisma bach yconnecta m3a PostgreSQL.

```pg```
The Node.js PostgreSQL driver.
Howa PostgreSQL driver dyal Node.js.

So 

```Prisma 7
   ↓
@prisma/adapter-pg
   ↓
pg
   ↓
PostgreSQL
```

# 5. Updating PrismaService

The problem is that Prisma 7 needs an adapter.

```    const adapter = new PrismaPg({
```

```Problem:
Mlli bdit NestJS, Prisma 7 3tana erreur A driver adapter is required to connect to your database.
Cause:
7it Prisma 7 kay7taj driver adapter bach yconnecta direct m3a PostgreSQL. Kouna kanst3mlo new PrismaClient() bla adapter.
Solution:
Installينا @prisma/adapter-pg w pg, w bdlnا PrismaService bach ncreatew PrismaPg adapter w n3tiwh l PrismaClient.
Also:
Khassna nqraw .env b dotenv/config bach DATABASE_URL tkoun available f process.env.
Result:
NestJS → PrismaService → PrismaClient → PrismaPg → pg → PostgreSQL
```

# DTO — User Create

def : DTO = Data Transfer Object

DTO is just a object handel data li application kattsenna mn request.

For example ``` POST /users ```

user send to me this json file 

```{
  "email": "salah@example.com",
  "username": "salah"
}```

DTO kayrepresenti data li katdkhol l API.

LIKE in my project user bach yalh khaso isayb account jdid 

username && email && password

so DTO wait just this requset noting else 

# Flowchart dyalna 

```HTTP Request
     ↓
    DTO
     ↓
 Controller
     ↓
 Service
     ↓
 Prisma
     ↓
 Database
 ```
DTO huwa wa7d l-layer bin request w application.


```class User {
    email: string;   // property
}

let email: string;   // variable
```


error 

```code: 'P2002'```
```Unique Constraint violation.```

Unique constraint failed on the constraint:
User_username_key


```
   ``` PGPASSWORD=postgres psql \
  -h 127.0.0.1 \
  -p 5433 \
  -U postgres \
  -d transcendence \
  -c 'SELECT * FROM "User";'
  ```
```

handel error prisma 

Prisma kaydir errors différents.
P2002 = unique constraint violation.
PrismaClientKnownRequestError = type dyal errors li Prisma 3arfa bihom w kay3tiwhom code.

```
 git log --all --oneline --grep="commit dyalk"
  git log --oneline -10
```


```Rule of thumb: Pipes (ParseIntPipe, ParseUUIDPipe, etc.) → for @Param / @Query. Class-validator decorators (@IsNumber(), @IsString(), etc.) → for @Body DTO properties.
```   

``` # ====================================== #  ```

User CRUD foundation
├── POST /users
├── GET /users
├── GET /users/:id
├── DTO validation
├── ParseIntPipe
└── duplicate user → 409 Conflict

``` # ====================================== #  ```

``` AppModule ```

Is root dyal NestJS application.

```AppModule
│
├── PrismaModule
├── UsersModule
└── PostsModule```

``` application graph ```

``` 
                    AppModule
                   /    |     \
                  /     |      \
                 ↓      ↓       ↓
        PrismaModule  UsersModule  PostsModule
             │            │            │
             ↓            ↓            ↓
       PrismaService  UsersController PostsController
                          │             │
                          ↓             ↓
                    UsersService   PostsService
                          │             │
                          └──────┬──────┘
                                 ↓
                           PrismaService
                                 ↓
                            PostgreSQL
```

Hadchi graph 7it kayn nodes w relationships/dependencies binathom.

```main.ts
   ↓
NestFactory.create(AppModule)
   ↓
Nest reads metadata
   ↓
Builds application graph
   ↓
Creates/connects providers
   ↓
Registers routes
   ↓
Starts HTTP server
   ↓
WAIT FOR REQUESTS```


```UsersModule
├── UsersController → HTTP /users
├── UsersService    → logic dyal users
└── DTO             → validation

PostsModule
├── PostsController → HTTP /posts
├── PostsService    → logic dyal posts
└── DTO             → validation

PrismaModule
└── PrismaService   → database
```

So every module need (controll and service logic) and thank service work 
```Service : logic dyal feature.```
```Module : like a box save the components dyal feature```


```                 PostsModule
                     │
          ┌──────────┴──────────┐
          ↓                     ↓
  PostsController          PostsService
          │                     │
          │ needs               │
          └─────────────────────┘
                     │
                     ↓
                PrismaService
                     │
                     ↓
                PostgreSQL
```

```
class PostsController {

  private readonly postsService: PostsService;

  constructor(postsService: PostsService) {
    this.postsService = postsService;
  }
}
```

```Module = organization
Controller = HTTP
Service = logic
Dependency Injection = components
```

```private readonly postsService: PostsService constructor injection.```


```
URL/path                HTTP method        handler
────────────────────────────────────────────────────────
/posts                  GET                findAll()
/posts                  POST               create()
/posts/:id               GET                findOne()
/posts/:id               PATCH              update()
/posts/:id               DELETE             deleteOne()
```


after call post service logic 
we need insert date from http requset(controller)

```INSERT INTO "Post" ("authorId", "content")
VALUES (1, 'Hello world');```

```POST /posts
      ↓
PostsController
      ↓
create(@Body() body)
      ↓
PostsService.create(authorId, content)
      ↓
this.prisma.post.create(...)
      ↓
PostgreSQL
```


```
POST /posts
      ↓
PostsController
      ↓
PostsService.create()
      ↓
findUnique(authorId)
      ↓
   User kayn?
    /      \
  YES       NO
   ↓         ↓
create()   404
   ↓
PostgreSQL
```


``` # ========================================== # ```
```                Authentication                  ```
``` # ========================================== # ```

Authentication = is just back verify how is the user 

For example 

```
Salah
email: salah@gmail.com
password: ********
```

``` Authentication RESPONSE = Who are you? ```

User ID = 7
Username = salah


``` Authorization RESPONSE = What are you allowed to do? ```

```User #7
   ↓
Need remove Post  #15
   ↓
Wach Post #15 Dyalo ?
   ↓
YES → allow
NO  → reject
```

```
Authentication
    ↓
Chkon nta

Authorization
    ↓
Chno 3ndk l7a9 dir 
```


``` Need currentUser.id = 7 ```
``` API/implementation contract. ```

```                 TEAM 1
        User Management/Auth
                 │
                 │
        "Who is this user?"
                 │
                 ▼
          currentUser.id
                 │
                 │
                 ▼
                 TEAM 2
          Content & Social
                 │
        ┌────────┼─────────┐
        ↓        ↓         ↓
      Posts   Comments    Likes
```


``` Schema ```
```User
 │
 ├── Session
 │
 ├── Post
 │
 ├── Comment
 │
 ├── Like
 │
 └── Friendship
 ```


```
Team 1
   ↓
verify request
   ↓
identify User #7
   ↓
request.user.id = 7
   ↓
Team 2 reads request.user.id
```


# Authentication Contract — BE #1 → BE #2

## Authenticated Request

For every protected route:

- BE #1 Authentication Guard verifies the request.
- If authentication fails, return `401 Unauthorized`.
- If authentication succeeds, the Guard makes the current user available through `request.user`.

## Current User

```ts
request.user = {
  id: number;
}

```
apps/backend/src/

├── users/
│   ├── users.controller.ts
│   ├── users.service.ts
│   ├── users.module.ts
│   └── dto/
│       ├── create-user.dto.ts
│       └── update-user.dto.ts
│
├── auth/
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── auth.module.ts
│   ├── guards/
│   │   └── auth.guard.ts
│   └── dto/
│       ├── login.dto.ts
│       └── register.dto.ts
│
├── posts/              ← nta BE #2
│   ├── posts.controller.ts
│   ├── posts.service.ts
│   ├── posts.module.ts
│   └── dto/
│       └── create-post.dto.ts
│
└── prisma/
    ├── prisma.service.ts
    └── prisma.module.ts
```


Donc yes, Team 1 ghadi ykhdem b:
- Module
- Controller
- Service
- DTO
- PrismaService
- Guard


``` # =========================== # ```
@Post()
create(
  @Req() request,
  @Body() body: CreatePostDto,
) {
  return this.postsService.create(
    request.user.id,
    body.content,
  );
}
``` # =========================== # ```

HTTP Request
     ↓
AuthGuard dyal Team 1
     ↓
request.user.id = 7
     ↓
PostsController
     ↓
PostsService
     ↓
userId = 7


and my service file 

```async create(userId: number, content: string) {
  return this.prisma.post.create({
    data: {
      authorId: userId,
      content,
    },
  });
}
```

```const userId = 1;```
To
```const userId = request.user.id;```

```DABA:

Controller
   ↓
userId = 1
   ↓
Service


MN BA3D:

AuthGuard
   ↓
request.user.id
   ↓
Controller
   ↓
Service
```


npm (Node Package Manager) is a package manager used to install, update, and manage project dependencies, while npx (Node Package Execute) is a tool used to execute Node.js packages directly without requiring a global or permanent local installation

```PGPASSWORD=postgres psql -h 127.0.0.1 -p 5433 -U postgres -d transcendence \
  -c 'SELECT id, content, "authorId", "postId" FROM "Comment";'```


``` cooment flow chart ```

```
PATCH /comments/1
        ↓
Controller
        ↓
userId = 1
        ↓
CommentsService.update(1, 1, content)
        ↓
Check: comment.authorId === userId
        ↓
Prisma updates the comment
```


```Create Comment
POST /posts/:postId/comments

Done


Get Comments
GET /posts/:postId/comments

Done


Update Comment
PATCH /comments/:id

Done


Delete Comment
DELETE /comments/:id```




``` use redis ```

```Configuration	L'objectif
image: redis:7-alpine	Image dyal Redis bach Docker y9der ychghlo
container_name	Smiya wad7a dyal container
6379:6379	Port dyal Redis f host w container
redis_data:/data	Volume bach Redis y9der y7fed data dyalo
--appendonly yes	Redis kayrecordi write operations f AOF bach y3awen f persistence
```


# Redis 

After set conf in docker compose 

we need setup redi in backend so we use ioredis cli ``` npm install ioredis ```


# Source =========== | ===============


# Redis

Source: https://docs.nestjs.com/microservices/redis

The [Redis](https://redis.io/) transporter implements the publish/subscribe messaging paradigm and uses the [Pub/Sub](https://redis.io/topics/pubsub) feature of Redis. Published messages are categorized in channels, without the publisher knowing which subscribers (if any) will receive them. Each microservice can subscribe to any number of channels, and a single message can be received by multiple subscribers. Messages exchanged through channels are **fire-and-forget**: if a message is published and no subscriber is interested in it, the message is removed and can't be recovered. As a result, there is no guarantee that a message or event is handled by at least one service.

<figure><img class="illustrative-image" src="/assets/Redis_1.png" /></figure>

#### Installation

To start building Redis-based microservices, first install the required package:

```bash
$ npm i --save ioredis
```

#### Overview

To use the Redis transporter, pass the following options object to the `createMicroservice()` method:

```typescript

const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
  transport: Transport.REDIS,
  options: {
    host: 'localhost',
    port: 6379,
  },
});
```

> info **Hint** The `Transport` enum is imported from the `@nestjs/microservices` package.

#### Options

The `options` property is specific to the chosen transporter. The <strong>Redis</strong> transporter exposes the properties described below.

<table>
  <tr>
    <td><code>host</code></td>
    <td>Connection hostname</td>
  </tr>
  <tr>
    <td><code>port</code></td>
    <td>Connection port</td>
  </tr>
  <tr>
    <td><code>retryAttempts</code></td>
    <td>Number of times to retry the connection (default: <code>0</code>, i.e., no retries)</td>
  </tr>
  <tr>
    <td><code>retryDelay</code></td>
    <td>Delay between connection retry attempts (ms) (default: <code>5000</code>)</td>
  </tr>
  <tr>
    <td><code>wildcards</code></td>
    <td>Enables Redis wildcard subscriptions, instructing the transporter to use <code>psubscribe</code>/<code>pmessage</code> under the hood (default: <code>false</code>)</td>
  </tr>
</table>

The transporter also supports all the properties of the official [ioredis](https://redis.github.io/ioredis/index.html#RedisOptions) client.

#### Client

As with other microservice transporters, you have <a href="/microservices/basics#client">several options</a> for creating a Redis `ClientProxy` instance.

One way to create an instance is to use the `ClientsModule`. Import it and use its `register()` method to pass an options object with the same properties shown above for the `createMicroservice()` method, plus a `name` property to use as the injection token. Read more about the `ClientsModule` in the <a href="/microservices/basics#client">client section of the overview</a>.

```typescript
@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'MATH_SERVICE',
        transport: Transport.REDIS,
        options: {
          host: 'localhost',
          port: 6379,
        }
      },
    ]),
  ]
  ...
})
```

You can also create a client with `ClientProxyFactory` or the `@Client()` decorator. Both are described in the <a href="/microservices/basics#client">client section of the overview</a>.

#### Context

In more complex scenarios, you may need additional information about the incoming request. With the Redis transporter, you can access the `RedisContext` object.

```typescript

@MessagePattern('notifications')
getNotifications(@Payload() data: number[], @Ctx() context: RedisContext) {
  console.log(`Channel: ${context.getChannel()}`);
}
```

> info **Hint** `@Payload()`, `@Ctx()` and `RedisContext` are imported from the `@nestjs/microservices` package.

#### Wildcards

To enable wildcard support, set the `wildcards` option to `true`. This instructs the transporter to use `psubscribe` and `pmessage` under the hood.

```typescript
const app = await NestFactory.createMicroservice(AppModule, {
  transport: Transport.REDIS,
  options: {
    // Other options
    wildcards: true,
  },
});
```

Pass the `wildcards` option when creating a client instance as well.

With this option enabled, you can use wildcards in your message and event patterns. For example, to subscribe to all channels starting with `notifications.`, use the following pattern:

```typescript
@EventPattern('notifications.*')
```

#### Instance status updates

To get real-time updates on the connection and the state of the underlying driver instance, subscribe to the `status` stream. This stream provides status updates specific to the chosen driver. For the Redis driver, the `status` stream emits `connected`, `disconnected`, and `reconnecting` events.

```typescript
this.client.status.subscribe((status: RedisStatus) => {
  console.log(status);
});
```

> info **Hint** The `RedisStatus` type is imported from the `@nestjs/microservices` package.

Similarly, you can subscribe to the server's `status` stream to receive notifications about the server's status.

```typescript
const server = app.connectMicroservice<MicroserviceOptions>(...);
server.status.subscribe((status: RedisStatus) => {
  console.log(status);
});
```

#### Listening to Redis events

In some cases, you might want to listen to internal events emitted by the microservice. For example, you could listen for the `error` event to trigger additional operations when an error occurs. To do this, use the `on()` method. Because the Redis transporter uses two connections (see [underlying driver access](#underlying-driver-access)), the callback receives the connection that emitted the event (`'pub'` or `'sub'`) as its first argument:

```typescript
this.client.on('error', (client, err) => {
  console.error(client, err);
});
```

Similarly, you can listen to the server's internal events:

```typescript
server.on<RedisEvents>('error', (client, err) => {
  console.error(client, err);
});
```

> info **Hint** The `RedisEvents` type is imported from the `@nestjs/microservices` package.

Starting with NestJS v12.1, listeners registered with the client's `on()` method stay registered until you call `close()`, so they are also attached to the new `pub` and `sub` connections the client creates on the next `send()` or `emit()` call after the connection ended (once any configured `retryAttempts` are exhausted). Registrations are not deduplicated, so register each listener once rather than again from its callback or after each reconnect.

#### Underlying driver access

For more advanced use cases, you may need to access the underlying driver instance, for example, to close the connection manually or to use driver-specific methods. In most cases, however, you **shouldn't need** to access the driver directly.

To do so, use the `unwrap()` method, which returns the underlying driver instance. The generic type parameter specifies the type of driver instance you expect.

```typescript
const [pub, sub] =
  this.client.unwrap<[import('ioredis').Redis, import('ioredis').Redis]>();
```

Similarly, you can access the server's underlying driver instance:

```typescript
const [pub, sub] =
  server.unwrap<[import('ioredis').Redis, import('ioredis').Redis]>();
```

Unlike other transporters, the Redis transporter returns a tuple of two `ioredis` instances: the first one publishes messages, and the second one subscribes to them.

``` docker compose exec redis redis-cli TTL posts:all ```
