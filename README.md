Migrations look like the following.

```
--+ up

/* sql here */

--+ down

/* sql here */
```

To run things in a different schema.

```sql
CREATE SCHEMA myschema;
SET search_path TO myschema;
-- run sql statements
DROP SCHEMA myschema CASCADE;
```

To run migrations.

```js
fs.readDir(migrationsDir, function (files) {
  // sort files
  // get last entry in migrations
  // run files from that point in order
})
```

To undo migrations.

```js
// read files
// get latest migration
// undo to desired migration key
```

To test migrations.

```js
// run migration without errors
// test each migration is indempotent
// run all tests in the migration
```
