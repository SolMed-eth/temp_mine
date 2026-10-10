# Database Design Document: Instagram-like Social App

**Stack:** PostgreSQL · Prisma · NestJS **Labels used:** `[SPEC]` = required by the Project Specification · `[DESIGN DECISION]` = our choice, team must agree · `[FUTURE]` = optional / later

---

# 1. Database Overview

**Relational database:** data is stored in **tables** that are linked to each other by **ids**. Instead of copying a user's name into every post, a post stores the user's id and we look the user up.

**Why PostgreSQL?** The spec asks for a relational database with *strict relationships between Users, Posts, Comments, Follows, Messages* `[SPEC]`. PostgreSQL enforces those relationships, handles many users at once, and has strong indexing for search and pagination.

**What the database is responsible for:** storing accounts, posts, social links (likes, follows), chat history, notifications. It is NOT responsible for business rules ("can Ahmed like this post?"): that is NestJS.

| Term | Meaning | Example |
| --- | --- | --- |
| Database | The whole container of tables | `social_app` |
| Table | One kind of thing | `User` |
| Row | One item of that kind | Salah's account |
| Column | One property | `username` |
| Primary key (PK) | Column that uniquely identifies a row | `User.id` |
| Foreign key (FK) | Column that points to another table's PK | `Post.authorId` → `User.id` |

```
User
  ↓
Post
  ↓
Comment / Like / Media
```

A user writes posts. A post collects comments, likes and media. Every arrow is a foreign key pointing back up (a Comment stores `postId`).

---

# 2. Main Entities

> Types are Prisma-style. IDs as auto-increment integers are a `[DESIGN DECISION]` (UUIDs are the alternative).

## User

**Purpose:** the account: who can log in. **One row =** one registered person.

| Column | Type | Meaning | Constraint |
| --- | --- | --- | --- |
| id | Int | Identifier | PK |
| username | String | Public handle (searchable) | UNIQUE |
| email | String | Login / OAuth linking | UNIQUE |
| passwordHash | String? | bcrypt hash `[SPEC]`; empty for OAuth-only users | nullable |
| createdAt | DateTime | Signup time | default now |
| lastSeenAt / isOnline | DateTime / Bool | Presence `[SPEC]` | `[DESIGN DECISION]` stored here vs in-memory |

**FKs:** none. **Example:** `id=1, username=salah, email=salah@example.com` `User 1 ───── N Post` → one user creates many posts; each post belongs to one user.

## Profile

**Purpose:** public-facing info, separated from login data. **One row =** one user's profile.

| Column | Type | Meaning | Constraint |
| --- | --- | --- | --- |
| id | Int |  | PK |
| userId | Int | Owner | FK → User.id, UNIQUE |
| displayName | String | Shown name |  |
| bio | String? | Short text |  |
| avatarUrl | String? | Null = fallback default avatar `[SPEC]` |  |

**Example:** `userId=1, displayName="Salah", bio="Backend dev"`. UNIQUE on `userId` is what makes it one-to-one. *Separate table vs columns on User is a `[DESIGN DECISION]`.*

## Post

**Purpose:** the main content. **One row =** one post.

| Column | Type | Meaning | Constraint |
| --- | --- | --- | --- |
| id | Int |  | PK |
| authorId | Int | Who posted | FK → User.id |
| caption | String? | Text (searchable, moderated) |  |
| createdAt | DateTime | For sorting the feed | indexed |

**Example:** `id=1, authorId=1, caption="My first post #nestjs"`

## Media

**Purpose:** image/video files of a post `[SPEC]`. **One row =** one uploaded file.

| Column | Type | Meaning | Constraint |
| --- | --- | --- | --- |
| id | Int |  | PK |
| postId | Int | Parent post | FK → Post.id (cascade `[SPEC]`) |
| url | String | Storage URL (not the file itself) |  |
| type | Enum | IMAGE / VIDEO |  |
| mimeType, sizeBytes | String, Int | Validation info `[SPEC]` |  |

**Example:** `postId=1, url=/uploads/abc.jpg, type=IMAGE`. *One media or many per post: see Questions.*

## Comment

**Purpose:** user replies on a post `[SPEC]`. **One row =** one comment.

| Column | Type | Meaning | Constraint |
| --- | --- | --- | --- |
| id | Int |  | PK |
| postId | Int | Commented post | FK → Post.id |
| authorId | Int | Commenter | FK → User.id |
| content | String | Text (moderated) |  |
| createdAt | DateTime |  |  |

**Example:** `postId=1, authorId=2, content="Nice!"`

## Like

**Purpose:** records "this user likes this post" `[SPEC]`. **One row =** one user liking one post.

| Column | Type | Meaning | Constraint |
| --- | --- | --- | --- |
| userId | Int | Who liked | FK → User.id |
| postId | Int | What was liked | FK → Post.id |
| createdAt | DateTime |  |  |
| (userId, postId) |  |  | **PK composite** (no duplicates) |

**Example:** `userId=2, postId=1`

## Follow

**Purpose:** who follows whom `[SPEC]`. **One row =** one follow link.

| Column | Type | Meaning | Constraint |
| --- | --- | --- | --- |
| followerId | Int | The person who follows | FK → User.id |
| followingId | Int | The person being followed | FK → User.id |
| createdAt | DateTime |  |  |
| (followerId, followingId) |  |  | **PK composite** |

**Example:** `followerId=2, followingId=1` (Ahmed follows Salah). `[DESIGN DECISION]` add a CHECK so nobody follows themselves.

## Hashtag

**Purpose:** unique tags, searchable `[SPEC]`. **One row =** one distinct tag.

| Column | Type | Meaning | Constraint |
| --- | --- | --- | --- |
| id | Int |  | PK |
| name | String | Stored lowercase, without `#` | UNIQUE |

**Example:** `id=1, name=nestjs`

## PostHashtag

**Purpose:** junction table linking posts and hashtags. **One row =** "this post uses this tag".

| Column | Type | Meaning | Constraint |
| --- | --- | --- | --- |
| postId | Int |  | FK → Post.id |
| hashtagId | Int |  | FK → Hashtag.id |
| (postId, hashtagId) |  |  | **PK composite** |

**Example:** `postId=1, hashtagId=1`

## Conversation

**Purpose:** a chat thread that groups messages `[SPEC: persistent chat history]`. **One row =** one chat between users.

| Column | Type | Meaning | Constraint |
| --- | --- | --- | --- |
| id | Int |  | PK |
| createdAt | DateTime |  |  |

**Supporting table `[DESIGN DECISION]`: `ConversationParticipant`** (`conversationId` FK, `userId` FK, composite PK). It tells us who is in a conversation and keeps group chats possible later. The spec only says "peer-to-peer messaging", so 1-to-1 is enough to start.

## Message

**Purpose:** each chat message with read status `[SPEC: history, read receipts]`. **One row =** one message.

| Column | Type | Meaning | Constraint |
| --- | --- | --- | --- |
| id | Int |  | PK |
| conversationId | Int | Which chat | FK → Conversation.id |
| senderId | Int | Who wrote it | FK → User.id |
| content | String | Text |  |
| createdAt | DateTime | Ordering | indexed with conversationId |
| readAt | DateTime? | Null = unread | `[DESIGN DECISION]` fine for 1-to-1 |

**Example:** `conversationId=1, senderId=1, content="Hey!", readAt=null` Typing indicators are NOT stored: they are temporary WebSocket events.

## Notification

**Purpose:** alerts for follows, likes, comments, messages with a history feed `[SPEC]`. **One row =** one alert for one user.

| Column | Type | Meaning | Constraint |
| --- | --- | --- | --- |
| id | Int |  | PK |
| recipientId | Int | Who gets it | FK → User.id |
| actorId | Int | Who caused it | FK → User.id |
| type | Enum | FOLLOW / LIKE / COMMENT / MESSAGE (the "categories") |  |
| postId, messageId | Int? | Optional link to the cause | FK, nullable `[DESIGN DECISION]` |
| isRead | Bool | Unread badge | default false |
| createdAt | DateTime |  |  |

**Example:** `recipientId=1, actorId=2, type=LIKE, postId=1, isRead=false`

---

# 3. Relationships

## One-to-One

```
User 1 ─── 1 Profile
```

Salah has exactly one profile, and that profile belongs to only Salah. Enforced by `Profile.userId` being UNIQUE.

## One-to-Many

```
User 1 ─── N Post
```

Salah wrote 2 posts → 2 rows in Post with `authorId=1`. The FK always sits on the "many" side. Same pattern: Post→Comment, Post→Media, User→Notification, Conversation→Message.

## Many-to-Many

```
User N ─── N Post
        ↓
       Like
```

Many users like many posts. A single column cannot hold a list, so we create a **junction table**: one row per (user, post) pair. The composite PK stops duplicates.

```
User N ─── N User
        ↓
      Follow
```

Both sides of the relationship are users, so we need two columns to tell the roles apart: `followerId` = who clicks Follow, `followingId` = who is followed. (Ahmed→Salah is not the same as Salah→Ahmed.)

```
Post N ─── N Hashtag
        ↓
    PostHashtag
```

One post has many tags; one tag appears on many posts. PostHashtag stores each pair. The Hashtag table stores each tag once, which makes tag search fast.

---

# 4. Complete ER Diagram

```
                       ┌──────────────┐
                       │     USER     │
                       └──────┬───────┘
   ┌───────────┬─────────┬────┴────┬────────────┬───────────────┐
   │1:1        │1:N      │1:N      │1:N         │1:N            │N:N (self)
   ▼           ▼         ▼         ▼            ▼               ▼
PROFILE      POST     COMMENT*   LIKE*   NOTIFICATION        FOLLOW
               │                                          (follower→following)
   ┌─────┬─────┼───────┬──────────┐
   │1:N  │1:N  │1:N    │1:N       │
   ▼     ▼     ▼       ▼          ▼
 MEDIA COMMENT LIKE  POSTHASHTAG  (notification may reference post)
                          │
                          ▼ N:1
                       HASHTAG

 USER ──< CONVERSATIONPARTICIPANT >── CONVERSATION
                                           │ 1:N
                                           ▼
                                        MESSAGE ◄── sender: USER
```

\* Comment and Like belong to both a User (who) and a Post (what).

---

# 5. Data Examples

**USER**

| id | username | email |
| --- | --- | --- |
| 1 | salah | [salah@test.com](mailto:salah@test.com) |
| 2 | ahmed | [ahmed@test.com](mailto:ahmed@test.com) |

**POST**

| id | authorId | caption |
| --- | --- | --- |
| 1 | 1 | My first post #nestjs |
| 2 | 1 | Learning NestJS |

**LIKE**

| userId | postId |
| --- | --- |
| 2 | 1 |

**FOLLOW**

| followerId | followingId |
| --- | --- |
| 2 | 1 |

**Reading it:** Ahmed (2) liked Salah's first post (1), and Ahmed follows Salah. Nothing is duplicated: names are found by following the ids.

---

# 6. Real Example: Creating a Post

Salah posts a caption, one image, and hashtag `#nestjs`.

```
Client ─► NestJS ─► 1. User 1 exists (from login)
                    2. INSERT Post (authorId=1, caption)      → postId=1
                    3. INSERT Media (postId=1, url)
                    4. Hashtag "nestjs" exists? no → INSERT   → hashtagId=1
                    5. INSERT PostHashtag (1, 1)
                    6. Return post + media + hashtags ─► Client
```

Steps 2–5 should run inside **one transaction** `[DESIGN DECISION]` so we never end up with a post without its media.

---

# 7. Real Example: Like a Post

```
User Ahmed (2)
   ↓
Like (userId=2, postId=1)
   ↓
Salah's Post (1)
```

**Inserted:** one row in `Like`. (BE #3's notification logic also inserts a `Notification` for Salah, type LIKE.) **Why prevent duplicates?** Otherwise Ahmed could inflate the like count by clicking repeatedly. The composite PK `(userId, postId)` makes the database itself reject the second insert, even if the frontend or API has a bug.

---

# 8. Real Example: Follow a User

```
Ahmed (2)
  │ followerId = 2
  ▼
Follow
  │ followingId = 1
  ▼
Salah (1)
```

Row inserted: `followerId=2, followingId=1`. Unfollow = delete that row. "Salah's followers" = rows where `followingId=1`; "who Salah follows" = rows where `followerId=1`. Follower counts (`GET /users/:id`) are a count of these rows.

---

# 9. Feed / Timeline

```
Current User
    ↓
Follow            (rows where followerId = me)
    ↓
Following Users   (their followingId values)
    ↓
Their Posts       (Post.authorId in that list)
    ↓
Sort by createdAt (newest first)
    ↓
Feed (paginated)
```

**Indexes to support it:**

| Index | Why |
| --- | --- |
| `Follow(followerId)` | Quickly find who I follow |
| `Follow(followingId)` | Quickly find my followers |
| `Post(authorId, createdAt)` | Get one author's newest posts fast |

Pagination `[SPEC]` should use `createdAt` + `id` (cursor) `[DESIGN DECISION]`.

---

# 10. Search `[SPEC]`

| Search | How the database helps |
| --- | --- |
| Username | Index on `User.username` (prefix search is cheap) |
| Caption keywords | Index on `Post.caption` (PostgreSQL full-text search is the option) |
| Hashtags | `Hashtag.name` is UNIQUE, so it is already indexed; then follow PostHashtag to posts |

**Why indexes?** Without one, PostgreSQL reads every row; with one it jumps straight to matches, like a book's index. The spec explicitly asks for "appropriate indexing" for scale. Full-text vs simple `LIKE` is a team decision.

---

# 11. Delete / Cascade Rules

```
Post deleted
 ├── Media         → delete [SPEC: cascade deletion]
 ├── Comments      → delete (meaningless without the post)
 ├── Likes         → delete
 └── PostHashtag   → delete (Hashtag rows stay: other posts may use them)
```

Notifications pointing to the post: delete, or set `postId` to null `[DESIGN DECISION]`. Files in storage must also be removed by NestJS: the database cannot do that.

**Account deletion** `[SPEC: hard-deletion]`: removes the User and everything they own (profile, posts and their children, likes, follows, notifications). Messages are a team decision.

> **Cascade is a design decision.** Wrong cascade = silently lost data. Each relation's `onDelete` must be chosen on purpose and agreed by the team.

---

# 12. Security and Sensitive Data

| Never store as plain text | Store instead |
| --- | --- |
| Password | `passwordHash` (bcrypt, salted) `[SPEC]` |
| OAuth access/refresh tokens | Encrypted, or don't store if not needed |
| 2FA (TOTP) secret | Encrypted at rest |
| API keys | Hash of the key; show the full key once at creation |

`password → passwordHash`: the real password is never saved, only its irreversible hash. At login, bcrypt hashes the input and compares. Never return these columns in API responses, and never put real secrets in examples or logs.

---

# 13. Tables We May Need Later

| Table | Why | Supports | Status |
| --- | --- | --- | --- |
| **OAuthAccount** (userId, provider, providerAccountId) | One user can link Google and 42; linking by verified email | OAuth 2.0 | `[SPEC]`, add in Auth sprint |
| **TwoFactorAuth** (userId, encryptedSecret, enabled) | TOTP secret for opt-in 2FA | 2FA | `[SPEC]`, minor module; could be 2 columns on User `[DESIGN DECISION]` |
| **Session** | Track logins / refresh tokens | "Secure session handling" | `[DESIGN DECISION]`, needed only if sessions are server-side |
| **ApiKey** (userId, keyHash, createdAt, revokedAt) | Key generation for the public API | Public API | `[SPEC]`, add with API module |
| **Block** (blockerId, blockedId) | Block users in chat | Advanced chat | `[SPEC]`, add with chat |
| **Consent** (userId, type, acceptedAt) | Proof of cookie/terms consent | GDPR | `[SPEC]`, add with GDPR module |
| **ModerationResult** (targetType, targetId, flagged, reason) | Store AI flags on captions/comments | AI moderation | `[SPEC]` for moderating; storing results is `[DESIGN DECISION]` |
| **DataExportRequest** | Track export jobs | GDPR export | `[FUTURE]`: the export can also be generated on demand with no table |

**Rate limiting** is usually handled in memory/cache, not a core table `[DESIGN DECISION]`.

---

# 14. Backend Team Ownership

| Table | Owner | Responsibility |
| --- | --- | --- |
| User | BE #1 | Accounts, registration, login, credentials |
| Profile | BE #1 | Display name, bio, avatar |
| Post | BE #2 | Create/read/delete posts, caption rules |
| Comment | BE #2 | Add/remove comments |
| Like | BE #2 | Like/unlike, counts |
| Follow | BE #2 | Follow/unfollow, feed source |
| Media | BE #2 | Uploads, validation, cascade delete |
| Hashtag (+ PostHashtag) | BE #2 | Parse tags, find-or-create, search |
| Conversation (+ Participant) | BE #3 | Chat threads |
| Message | BE #3 | History, read receipts |
| Notification | BE #3 | Create and list alerts |

Later tables: OAuthAccount, 2FA, Session, ApiKey, Consent → BE #1 (security). Block → BE #3.

**The database is shared.** Tables have different owners, but relationships cross those lines (Notification points to Post, Message to User). Any change to a shared table or FK must be agreed by all three backend developers, and the Prisma schema should live in one file/one reviewed place.

---

# 15. Prisma Mapping

```
Database: User table
        ↓
Prisma:
model User {
   ...
}
```

| Database | Prisma |
| --- | --- |
| Table | `model` |
| Column | field |
| Primary key | `@id` |
| Foreign key | `@relation(fields: [...], references: [...])` |
| Unique constraint | `@unique` / `@@unique([a, b])` |
| Composite PK | `@@id([a, b])` |
| Default | `@default(now())`, `@default(autoincrement())` |
| Index | `@@index([a, b])` |
| Cascade | `onDelete: Cascade` inside `@relation` |

Tiny illustration only (not the final schema):

```prisma
model Post {
  id        Int      @id @default(autoincrement())
  authorId  Int
  author    User     @relation(fields: [authorId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  @@index([authorId, createdAt])
}
```

---

# 16. Final Summary

```
User
 ↓
Post
 ├── Media
 ├── Comment
 ├── Like
 └── Hashtag (via PostHashtag)

User
 └── Follow ──→ User

User
 └── Conversation
       └── Message

User
 └── Notification
```

> **PostgreSQL stores the data. Prisma describes and accesses the data. NestJS contains the business logic. Frontend consumes the API.**

---

# Questions The Team Must Decide

| # | Question | Notes |
| --- | --- | --- |
| 1 | Multiple media per post? | Spec says "image and video post uploads". Our Media table (many per post) allows it; one-per-post is simpler |
| 2 | Group conversations? | Spec says peer-to-peer; the participant table keeps groups possible |
| 3 | Comment replies? | Spec doesn't require it; would add `parentId` on Comment |
| 4 | Hard vs soft delete for posts? | Spec: cascade deletion for posts, so hard delete is the simplest match |
| 5 | Usernames case-sensitive? | Suggest case-insensitive unique (store lowercase) to avoid `Salah` / `salah` |
| 6 | What happens to posts when an account is deleted? | Spec says hard deletion: so posts go too. Confirm |
| 7 | What do we keep for GDPR/audit? | E.g. consent records, deletion log without personal data |
| 8 | Initial indexes? | Start with section 9 and 10 indexes; add more only after measuring |
| 9 | Messages when a user is deleted? | Delete sent messages, or anonymize? |
| 10 | IDs: Int or UUID? | UUIDs hide counts in public API URLs |
| 11 | Presence in DB or in memory? | Real-time state is often kept in memory/cache |
| 12 | Table ownership BE #1 / #2 / #3? | Proposed in section 14: confirm, especially for later tables |


```
flowchart TD
    A["GET /posts"] --> B{"Kayna f Redis?"}
    B -->|Yes| C["Rje3 cached data"]
    B -->|No| D["Fetch men PostgreSQL"]
    D --> E["Khzen f Redis: 60 seconds"]
    E --> F["Rje3 posts"]
    G["PATCH /posts/1"] --> H["Update PostgreSQL"]
    H --> I["Delete posts:all men Redis"]
    I --> J["Next GET: fetch fresh data"]
```
