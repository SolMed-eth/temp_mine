First step : create an API contract/template between Frontend and Backend.

```
Frontend developers shouldn't just say "I need an API for posts."
They should give Backend a precise request/response contract.

```

# API Contract

## Purpose

This document defines the contract between Frontend and Backend.

Frontend developers should not simply say:

> "I need an API for posts."

Instead, every API request must describe exactly:

- Endpoint
- HTTP Method
- Purpose
- Authentication
- Request headers
- Parameters
- Query parameters
- Request body
- Success response
- Possible errors
- Frontend requirements

The Backend team implements the API according to this contract.

---

# API Version

All application APIs must use:

```text
/api/v1/

# Search pnpm && package manager

  // await app.listen(process.env.PORT ?? 3000);
  //3000 fallback PORT



// PostgreSQL is a Database Management Syste (DBMS). 
// Prisma is a ORM = Object-Relational Mapping

// Database dyalna 

Users

┌────┬──────────┬────────────────────┬──────────┐
│ id │ username │ email              │ password │
├────┼──────────┼────────────────────┼──────────┤
│ 1  │ salah    │ salah@gmail.com    │ *****    │
│ 2  │ hamza    │ hamza@gmail.com    │ *****    │
│ 3  │ ali      │ ali@gmail.com      │ *****    │
└────┴──────────┴────────────────────┴──────────┘

1 : first step why we use ID and don;t use the username as 

username = salah
username = salma
username = reda 

do can call get me  username(reda) possible wlkin momkin user ibadel username dyalo m3a lwa9t hna anfa9do id dyalo ila 100 usr badlo name dyalhom khadi tkharb liya dataa so id hssn 

n9adro ndiro id as number ou n9adro ndiro id as UUID
ID = 7373637
UUID = 550e8400-e29b-41d4-a716-446655440000

Mohima hiya kola user 3ndo ID unique

Users
┌───────┬──────────┐
│ id    │ username │
├───────┼──────────┤
│ 87738 │ salah    │
│ 92341 │ hamza    │
└───────┴──────────┘

Posts
┌────┬─────────┬───────────────┐
│ id │ user_id │ caption       │
├────┼─────────┼───────────────┤
│ 1  │ 87738   │ Hello         │
│ 2  │ 92341   │ Nice photo    │
│ 3  │ 87738   │ My second post│
└────┴─────────┴───────────────┘

//==========================================//

USERS
┌────────┬──────────┐
│ id     │ username │
├────────┼──────────┤
│ 87738  │ salah    │
│ 92341  │ hamza    │
└────────┴──────────┘
    ↑
    │
    │ Primary Key
    │
    └── kola User 3ndo ID unique

POSTS
┌────┬─────────┬──────────────┐
│ id │ user_id │ caption      │
├────┼─────────┼──────────────┤
│ 1  │ 87738   │ Hello        │
│ 2  │ 92341   │ Nice photo   │
│ 3  │ 87738   │ My second    │
└────┴─────────┴──────────────┘
 ↑       ↑
 │       │
 │       └── Foreign Key
 │            Users.id
 │
 └── Primary Key
      Hna Primary key kay3raf Post bo7do

// ============Flow-chart-Database================ //

1. Table / Row / Column          
2. Primary Key                   
3. Foreign Key                  
        ↓
4. Relationships                 
        ↓
5. One-to-One
6. One-to-Many
7. Many-to-Many
        ↓
8. SQL basics
   SELECT
   INSERT
   UPDATE
   DELETE
        ↓
9. Constraints
   UNIQUE
   NOT NULL
   DEFAULT
        ↓
10. Indexes
        ↓
11. Transactions
        ↓
12. Prisma




# 1. Install Prisma 7

Go to backend 
npm install @prisma/client@7
npm install -D prisma@7

and check 

npm ls prisma @prisma/client


fix the password in the 

``` sudo docker exec -it transcendence-postgres psql -U postgres -d transcendence ```
``` ALTER USER postgres WITH PASSWORD 'postgres'; ```
```npx prisma@7 generate```
```npx prisma@7 db pull```

```
npx prisma@7 validate
npx prisma@7 generate
npx prisma@7 db pull
```

```
Docker PostgreSQL     vALID
Password              vALID
DATABASE_URL          vALID
TCP connection        vALID
Prisma 7.10           vALID
```

```

alarick@anaskaddouri:~/Projects/Found/apps/backend$ PGPASSWORD=postgres psql -h 127.0.0.1 -p 5433 -U postgres -d transcendence -c '\conninfo'
        Connection Information
      Parameter       |     Value     
----------------------+---------------
 Database             | transcendence
 Client User          | postgres
 Host                 | 127.0.0.1
 Server Port          | 5433
 Options              | 
 Protocol Version     | 3.0
 Password Used        | true
 GSSAPI Authenticated | false
 Backend PID          | 33
 SSL Connection       | false
 Superuser            | on
 Hot Standby          | off
(12 rows)

alarick@anaskaddouri:~/Projects/Found/apps/backend$ 

```


```
after set the table 
use this validation prisma 
```npx prisma@7 validate```
```

IF valid then ```npx prisma@7 generate```

LAST push 

```npx prisma@7 migrate dev --name create_post```

# Creat first table POST

After migration 

User
 ├── id
 ├── email
 └── username

Post
 ├── id
 ├── authorId → User.id
 ├── content
 └── createdAt

 