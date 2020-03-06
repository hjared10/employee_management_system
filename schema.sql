DROP DATABASE IF EXISTS descended_industries_db;
CREATE database descended_industries_db;

USE descended_industries_db;

CREATE TABLE personel (
  id int AUTO_INCREMENT,
  first_name varchar(30) NOT NULL,
  last_name varchar(30) not null,
  role_id int not null,
  manager_id int,
  PRIMARY KEY(id)
);

create table roles(
  id int AUTO_INCREMENT,
  title varchar(50),
  salary DECIMAL,
  department_id int,
);

create table personel(
  id int AUTO_INCREMENT,
  first_name varchar(50),
  last_name varchar(50),
  role_id int,
  manager_id int
)
