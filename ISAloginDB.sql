create schema ISAloginDB;
use ISAloginDB;
create table ISAloginDB ( email varchar(40), password varchar(40), fname varchar(12), lname varchar(12), age smallint, PRIMARY KEY (email));
select * from ISAloginDB;