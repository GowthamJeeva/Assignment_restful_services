const insertQuery = {
    user: "INSERT INTO users(id, firstname, lastname, email, password, mobile_number) VALUES (uuid(), ?,?,?,?,?)",
    order: "insert into orders(id, product_uuid, user_name,phone_number,delivery_address,status, created_at) values(uuid(), ?, ?, ? ,?, ?, ?)"
};

const selectQuery = {
    fetchUser: "SELECT firstname, lastname from users WHERE email = ? AND password = ? ALLOW FILTERING",
    checkUser: "SELECT firstname from users WHERE email = ? ALLOW FILTERING",
    viewProductByName: "select name,sku,category,id,image_url,price,rating,stock_count,unit from products where name like ? allow filtering;",
    viewProductByCategory: "select name,sku,category,id,image_url,price,rating,stock_count,unit from products where category like ? allow filtering;",
    viewProductByCategoryName: "select name,sku,category,id,image_url,price,rating,stock_count,unit from products where category like ? and name like ? allow filtering;",
    viewProduct: "select name,sku,category,id,image_url,price,rating,stock_count,unit from products",
    viewProductCountById: "select stock_count from products where id=? and name =? allow filtering",
}

const updateQuery = {
    updatePassword: "UPDATE users set password = ? WHERE email = ?",
    reduceStock: "update products set stock_count = ? where id = ? and name =? and sku=?"
}

module.exports = {
    insert: insertQuery,
    select: selectQuery,
    update: updateQuery
};