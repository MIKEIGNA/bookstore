class CreateBookDto { constructor({ title, author_id, isbn, price, published_date }){ this.title=title; this.author_id=author_id; this.isbn=isbn; this.price=price; this.published_date=published_date; } }
class UpdateBookDto{ constructor(partial){ Object.assign(this, partial);} }
class BookDto{ constructor(row){ if(!row) return null; this.id=row.id; this.title=row.title; this.author_id=row.author_id; this.isbn=row.isbn; this.price=row.price; this.published_date=row.published_date; } }
module.exports={CreateBookDto,UpdateBookDto,BookDto};
