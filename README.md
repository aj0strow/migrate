# `migrate`

Continuous development requires updates to the database as well. Frameworks like Ruby On Rails have database migrations built in, but I thought pure-SQL migrations could be an elegant option for small projects. 

### Migrations

Migrations are `.sql` files stored in a directory with chronologically increasing filenames. To achieve this, use a file prefix, for example count up from `001_filename.sql` or use the numeric timestamp of when it was created `1421717088435_filename.sql`. 

With this history of migrations, its possible to recreate the database, and take it back to any point in time.

The SQL is delimited with special comments `--+ up` and `--+ down` to start the `up` and `down` section respectively. There is only one up and down section because you can always make another migration file. 

```sql
-- create the users table
-- facebook login only to start

--+ up

create table users (
  id serial primary key,
  facebook_id text unique
);

--+ down

drop table users;
```

Create a new `001_create_users.sql` file and save it to `db/migrations` for example. 

### Migrate Command

The migrate command connects to a database url and grabs migrations from a local directory. 

```sh
$ migrate up --url postgres://localhost/mydb --dir db/migrations
```

You can set environment variables as well to avoid typing the options each time. The `migrate` command will read `.env` in the project root. 

```sh
DATABASE_URL=postgres://localhost/mydb
MIGRATIONS_DIR=db/migrations
```

Now run the command without the options. 

```sh
$ migrate up
```

To undo the last migration.

```sh
$ migrate down
```

To undo and immediately redo the last migration.

```sh
$ migrate redo
```

You can specify a prefix to migrate to. For example to migrate `001`, `002` but not `003`.

```sh
$ migrate up 002
```

Then migrate all the way up and rollback to the first migration.

```sh
$ migrate up
$ migrate down 001
```

You can also specify the number of migrations regardless of prefix.

```sh
$ migrate redo -n 3
```

### Linting

Check for inconsistencies between the database migrations and files. It looks for:

* migrated file no longer exists
* migrated file has been changed after migration
* new file added alphabetically before a file already migrated

Run the checks with.

```sh
$ migrate lint

 001_create_users
 file changed after migration

+drop table elephants;
-drop table users;

 002_seed_users
 file deleted but migration still exists

```

### Future plans

It occurred to me reading all the files at the beginning is wasteful, so I'll prolly refactor that. 

I also want to write an `audit` feature that runs the migrations in a different schema, and checks that the rollback actually returns the schema to the original state. This might require fake data, etc. 

**note to self:**

To run things in a different schema.

```sql
CREATE SCHEMA myschema;
SET search_path TO myschema;
-- run sql statements
DROP SCHEMA myschema CASCADE;
```
