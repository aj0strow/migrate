# `migrate`

**For postgresql only. This is a work in progress.** Build a wonderful database schema with indempotent migrations in SQL. A migration looks like this.

```sql
-- Create Users table

--+ up

create table users (
  id serial primary key,
  facebook_id text unique
);

--+ down

drop table users;
```

Then to run the migration (or a bunch of them):

```sh
$ migrate up --url postgres://localhost/mydb --dir db/migrations
```

Suppose you forgot the email field.

```sql

  facebook_id text unique,
  email_address text unique

```

And then redo the migration.

```sh
$ migrate redo --dir db/migrations
```

You can migrate or redo a couple at a time.

```sh
$ migrate up -n 3
$ migrate redo -n 2
```

Or migrate to a prefix.

```sh
$ migrate down 001
```

**note to self:**

To run things in a different schema.

```sql
CREATE SCHEMA myschema;
SET search_path TO myschema;
-- run sql statements
DROP SCHEMA myschema CASCADE;
```
