DROP TABLE IF EXISTS users;
CREATE TABLE users {
	username VARCHAR(32) PRIMARY KEY,
	password VARCHAR(32) CHECK (LEN(password) BETWEEN 6 AND 32),
	email VARCHAR(64),
	phone INT,
	year_of_study INT CHECK (year_of_study BETWEEN 1 AND 4),
	major VARCHAR(32),
	is_admin INT NOT NULL CHECK （is_admin BETWEEN 0 AND 1）
}

DROP TABLE IF EXISTS books;
CREATE TABLE books {
	title VARCHAR(64),
	author VARCHAR(32),
	publisher VARCHAR(64),
	isbn INT,
	PRIMARY KEY (title, author)
}

DROP TABLE IF EXISTS courses;
CREATE TABLE courses {
	dept CHAR(3) CHECK (LEN(dept) = 3),
	num INT,
	title VARCHAR(64),
	sect VARCHAR(16),
	PRIMARY KEY (dept, code)
}

DROP TABLE IF EXISTS offers_book;
CREATE TABLE offers_book {
	username VARCHAR(32) FOREIGN KEY REFERENCES users(username) ON DELETE CASCADE,
	title VARCHAR(64),
	author VARCHAR(32),
	PRIMARY KEY (username, title, author),
	FOREIGN KEY (title, author) REFERENCES books(title, author) ON DELETE CASCADE
}

DROP TABLE IF EXISTS offers_course;
CREATE TABLE offers_course {
	username VARCHAR(32) FOREIGN KEY REFERENCES users(username) ON DELETE CASCADE,
	dept CHAR(3),
	num INT,
	PRIMARY KEY (username, dept, num),
	FOREIGN KEY (dept, num) REFERENCES courses(dept, num) ON DELETE CASCADE
}