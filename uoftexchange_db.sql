DROP TABLE IF EXISTS users;
CREATE TABLE users (
	email VARCHAR(64) PRIMARY KEY,
	password VARCHAR(32) CHECK (LENGTH(password) BETWEEN 8 AND 32),
	phone INT,
	year_of_study INT CHECK (year_of_study BETWEEN 1 AND 4),
	major VARCHAR(32),
	is_admin INT NOT NULL CHECK (is_admin BETWEEN 0 AND 1)
);

DROP TABLE IF EXISTS books;
CREATE TABLE books (
	title VARCHAR(64),
	author VARCHAR(32),
	publisher VARCHAR(64),
	isbn INT,
	PRIMARY KEY (title, author)
);

DROP TABLE IF EXISTS courses;
CREATE TABLE courses (
	dept CHAR(3) CHECK (LENGTH(dept) = 3),
	num INT,
	title VARCHAR(64),
	sect VARCHAR(16),
	PRIMARY KEY (dept, num)
);

DROP TABLE IF EXISTS offers_book;
CREATE TABLE offers_book (
	email VARCHAR(32) REFERENCES users(email) ON DELETE CASCADE,
	title VARCHAR(64),
	author VARCHAR(32),
	PRIMARY KEY (email, title, author),
	FOREIGN KEY (title, author) REFERENCES books(title, author) ON DELETE CASCADE
);

DROP TABLE IF EXISTS offers_course;
CREATE TABLE offers_course (
	email VARCHAR(32) REFERENCES users(email) ON DELETE CASCADE,
	dept CHAR(3),
	num INT,
	PRIMARY KEY (email, dept, num),
	FOREIGN KEY (dept, num) REFERENCES courses(dept, num) ON DELETE CASCADE
);

DROP TABLE IF EXISTS course_textbook;
CREATE TABLE course_textbook (
	dept CHAR(3),
	num INT,
	title VARCHAR(64),
	author VARCHAR(32),
	PRIMARY KEY (dept, num, title, author),
	FOREIGN KEY (dept, num) REFERENCES courses(dept, num) ON DELETE CASCADE,
	FOREIGN KEY (title, author) REFERENCES books(title, author) ON DELETE CASCADE
);

DROP TABLE IF EXISTS follows;
CREATE TABLE follows (
	user1 VARCHAR(64) REFERENCES users(email) ON DELETE CASCADE,
	user2 VARCHAR(64) REFERENCES users(email) ON DELETE CASCADE,
	PRIMARY KEY (user1, user2),
	CHECK(user1 <> user2)
);

DROP TABLE IF EXISTS messages;
CREATE TABLE messages (
	user1 VARCHAR(64) REFERENCES users(email) ON DELETE CASCADE,
	user2 VARCHAR(64) REFERENCES users(email) ON DELETE CASCADE,
	message VARCHAR(128), 
	PRIMARY KEY (user1, user2),
	CHECK(user1 <> user2)
);