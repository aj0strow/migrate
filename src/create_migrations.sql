--+ up

create table migrations (
  id text primary key,
  completed_at integer
);

--+ down

drop table migrations;
