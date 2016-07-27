DROP TABLE IF EXISTS users;
CREATE TABLE users (
	email VARCHAR(64) PRIMARY KEY,
	password VARCHAR(32) CHECK (LENGTH(password) BETWEEN 8 AND 32),
	birthday DATE NOT NULL,
	phone INT,
	year_of_study INT CHECK (year_of_study BETWEEN 1 AND 4),
	major CHAR(3),
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
	PRIMARY KEY (user1, user2),
	CHECK(user1 <> user2)
);


DROP TABLE IF EXISTS feedbacks;
CREATE TABLE feedbacks (
	feedback TEXT
);

INSERT INTO users VALUES ('water@ryan.com', 'asdasdasd', '1111-01-01', NULL, NULL, NULL, 1),
						 ('handsome@ryan.com', 'ryanleung123', '1111-01-01', NULL, NULL, NULL, 1),
						 ('mizu@ryan.com', 'mizukami', '1111-01-01', NULL, 2, 'csc', 0);

INSERT INTO offers_book VALUES ('mizu@ryan.com', 'Introduction to Algorithms', 'Author1', NULL),
						 	   ('mizu@ryan.com', 'Introduction to Algorithms', 'Author2', NULL),
						       ('mizu@ryan.com', 'Introduction to Algorithms', 'Author3', NULL),
						       ('mizu@ryan.com', 'Introduction to Algorithms', 'Author4', NULL);

INSERT INTO course_textbook VALUES ('csc', 263, 'Introduction to Algorithms', 'Author4');
INSERT INTO offers_course VALUES('mizu@ryan.com', 'csc', 369, NULL, NULL);
