create extension if not exists "uuid-ossp";

create table product (
    id uuid primary key default uuid_generate_v4(),
    image text,
    title text,
    description text,
    price integer
);

create table stock (
    id uuid primary key default uuid_generate_v4(),
    product_id uuid,
    count integer,
    foreign key ("product_id") references "product" ("id")
);