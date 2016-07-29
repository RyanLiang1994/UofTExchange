DROP TABLE IF EXISTS users;
CREATE TABLE users (
	email VARCHAR(64) PRIMARY KEY,
	password VARCHAR(64) CHECK (LENGTH(password) BETWEEN 8 AND 64),
	unhash_password VARCHAR(32) CHECK (LENGTH(unhash_password) BETWEEN 8 AND 32),
	birthday DATE NOT NULL,
	phone INT,
	year_of_study INT CHECK (year_of_study BETWEEN 1 AND 4),
	major CHAR(3) CHECK(LENGTH(major) = 3),
	is_admin INT NOT NULL CHECK (is_admin BETWEEN 0 AND 1)
);

DROP TABLE IF EXISTS offers_book;
CREATE TABLE offers_book (
	email VARCHAR(32) REFERENCES users(email) ON DELETE CASCADE,
	title VARCHAR(64),
	author VARCHAR(32),
	publisher VARCHAR(64),
	PRIMARY KEY (email, title, author)
);

DROP TABLE IF EXISTS offers_course;
CREATE TABLE offers_course (
	email VARCHAR(32) REFERENCES users(email) ON DELETE CASCADE,
	dept CHAR(3),
	num INT,
	title VARCHAR(32),
	sect VARCHAR(16),
	PRIMARY KEY (email, dept, num)
);

DROP TABLE IF EXISTS course_textbook;
CREATE TABLE course_textbook (
	dept CHAR(3),
	num INT,
	title VARCHAR(64),
	author VARCHAR(32),
	PRIMARY KEY (dept, num, title, author)
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
	time DATE,
	PRIMARY KEY (user1, user2, time),
	CHECK(user1 <> user2)
);


DROP TABLE IF EXISTS feedbacks;
CREATE TABLE feedbacks (
	feedback TEXT,
	time DATE
);

INSERT INTO users VALUES ('water@ryan.com', '$2a$10$V4owGB/iALdaprDj7lDmJOnVYPjv/ep5wFr8QlvZxILD8iA3gBO.S', 'asdasdasd', '1111-01-01', NULL, NULL, NULL, 1),
						 ('handsome@ryan.com', '$2a$10$yOEukyzVlBSiUS0y/9Td.e/vaCuVZyR7KK1l5FfDlMJ7O6RxIUrhi', 'ryanleung123', '1111-01-01', NULL, NULL, NULL, 1),
						 ('mizu@ryan.com', '$2a$10$f5a3S/zRC7M5JSePe/2wS.bJt5ONZ3FczjWNQDjpSaX9CtIuY14bK', 'mizukami', '1111-01-01', NULL, 2, 'csc', 0);

INSERT INTO offers_book VALUES ('mizu@ryan.com', 'Introduction to Algorithms', 'Author1', NULL),
						 	   ('mizu@ryan.com', 'Introduction to Algorithms', 'Author2', NULL),
						       ('mizu@ryan.com', 'Introduction to Algorithms', 'Author3', NULL),
						       ('mizu@ryan.com', 'Introduction to Algorithms', 'Author4', NULL);

INSERT INTO course_textbook VALUES ('csc', 263, 'Introduction to Algorithms', 'Author4');
INSERT INTO offers_course VALUES('mizu@ryan.com', 'csc', 369, NULL, NULL);
