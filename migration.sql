DROP TABLE IF EXISTS userTest;

CREATE TABLE userTest (
    id serial PRIMARY KEY,
    name varchar(255) NOT NULL,
    age INT,
    email varchar(255) NOT NULL
);

