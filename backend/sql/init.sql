-- PostgreSQL init script for BookStore
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS books;
DROP TABLE IF EXISTS authors;

CREATE TABLE authors (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  bio TEXT
);

CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  author_id INTEGER REFERENCES authors(id),
  isbn TEXT,
  price NUMERIC,
  published_date DATE
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  book_id INTEGER REFERENCES books(id),
  quantity INTEGER,
  total_price NUMERIC,
  customer_name TEXT
);

-- Insert authors
INSERT INTO authors(name,bio) VALUES
('J.K. Rowling','Author of Harry Potter series'),
('George R.R. Martin','Author of A Song of Ice and Fire'),
('J.R.R. Tolkien','Author of The Lord of the Rings'),
('Agatha Christie','Queen of Crime'),
('Stephen King','Horror writer'),
('Isaac Asimov','Sci-fi author'),
('Arthur C. Clarke','Sci-fi author'),
('Neil Gaiman','Fantasy author'),
('Ursula K. Le Guin','Fantasy & Sci-fi author'),
('Ernest Hemingway','20th-century author');

-- Insert books (10)
INSERT INTO books(title,author_id,isbn,price,published_date) VALUES
('Harry Potter and the Philosopher''s Stone',1,'9780747532699',9.99,'1997-06-26'),
('A Game of Thrones',2,'9780553103540',14.99,'1996-08-06'),
('The Fellowship of the Ring',3,'9780261102354',12.5,'1954-07-29'),
('Murder on the Orient Express',4,'9780007119318',8.99,'1934-01-01'),
('The Shining',5,'9780385121675',10.99,'1977-01-28'),
('Foundation',6,'9780553293357',11.99,'1951-06-01'),
('2001: A Space Odyssey',7,'9780451452733',9.5,'1968-07-01'),
('American Gods',8,'9781400078776',13.99,'2001-06-19'),
('A Wizard of Earthsea',9,'9780142424179',9.0,'1968-09-01'),
('The Old Man and the Sea',10,'9780684801223',7.5,'1952-09-01');

-- Insert orders (10)
INSERT INTO orders(book_id,quantity,total_price,customer_name) VALUES
(1,1,9.99,'Alice'),
(2,2,29.98,'Bob'),
(3,1,12.5,'Charlie'),
(4,3,26.97,'Diana'),
(5,1,10.99,'Eve'),
(6,2,23.98,'Frank'),
(7,1,9.5,'Grace'),
(8,1,13.99,'Heidi'),
(9,4,36.0,'Ivan'),
(10,1,7.5,'Judy');
