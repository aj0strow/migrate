-- Create Users

--+ up

create table users (
  id serial primary key,
  name text
);

--+ down

drop table users;
