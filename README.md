# `migrate`

Build your schema incrementally in the language the database speaks -- SQL. Consider this my attempt to kill one small [leaky abstraction](http://en.wikipedia.org/wiki/Leaky_abstraction) among the ocean in web development. 

There are a few advantages to SQL over using framework migrations like from Ruby On Rails.

1. The database and migrations will out-live the api, and maybe even the programming language.
2. PostgreSQL documentation is excellent and feature-complete. 
3. No framework limitations, you can turn on and use UUIDs and JSON native types.
4. Now you *know* if your schema has foreign key constraints, null checks, etc.

Hopefully developers will share pure-SQL migrations for common schemas like user authentication, and useful triggers, plpgsql functions, etc.

### Example

From zero to flying:

```sh
npm install aj0strow/migrate
export PATH=./node_modules/.bin:$PATH

export DEBUG=migrate

mkdir -p db/migrations
createdb -E UTF8 my_app_test

migrate new create_users --dir db/migrations

# .. edit the file ..

export MIGRATIONS_DIR=db/migrations
migrate up --url postgres://localhost/my_app_test
#  migrate db/migrations +0ms
#  migrate up 20150318091656_create_users +8ms

# .. edit the file ..

export DATABASE_URL=postgres://localhost/my_app_test
migrate redo
#  migrate db/migrations +0ms
#  migrate down 20150318091656_create_users +10ms
#  migrate up 20150318091656_create_users +16ms

psql my_app_test
> \d
#                 List of relations
#  Schema |       Name        |   Type   |  Owner  
# --------+-------------------+----------+---------
#  public | migrations        | table    | you
#  public | users             | table    | you
#  public | users_id_seq      | sequence | you
> \q

# .. git add ..
```

### Migrations

Migrations are `.sql` files stored in a directory with chronologically increasing filenames. To achieve this, use a file prefix, for example count up from `001_filename.sql` or use the numeric timestamp of when it was created `1421717088435_filename.sql`. 

With this history of migrations, its possible to recreate the database, and take it back to any point in time.

The SQL is delimited with special comments `--+ up` and `--+ down` to start the `up` and `down` sections respectively. There is only one up and down section because you can always make another migration file. 

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

Create a new `001_create_users.sql` file and save it to `db/migrations` for example. Make new migration files with the `new` command.

```
$ migrate new migration_name
```

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

You can specify the number of migrations.

```sh
$ migrate up -n 2
```

Then migrate all the way up and rollback once.

```sh
$ migrate up
$ migrate down -n 1
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

I removed the prefix parameter, but want to add a new command `to` which migrates either up or down to a specific migration prefix. 

I also want to write an `audit` feature that runs the migrations in a different schema, and checks that the rollback actually returns the schema to the original state. This might require fake data, etc. 

**note to self:**

To run things in a different schema.

```sql
CREATE SCHEMA myschema;
SET search_path TO myschema;
-- run sql statements
DROP SCHEMA myschema CASCADE;
```
