CREATE DATABASE demo_user;

USE demo_user;
drop table userdata;
CREATE TABLE userdata
(
	id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50)  ,
    email VARCHAR(50) UNIQUE,
    age INT 
);

DESCRIBE userdata;

SELECT*FROM userdata;