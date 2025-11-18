class CreateOrderDto{ constructor({book_id,quantity,total_price,customer_name}){ this.book_id=book_id; this.quantity=quantity; this.total_price=total_price; this.customer_name=customer_name; } }
class UpdateOrderDto{ constructor(partial){ Object.assign(this, partial);} }
class OrderDto{ constructor(row){ if(!row) return null; this.id=row.id; this.book_id=row.book_id; this.quantity=row.quantity; this.total_price=row.total_price; this.customer_name=row.customer_name; } }
module.exports={CreateOrderDto,UpdateOrderDto,OrderDto};
