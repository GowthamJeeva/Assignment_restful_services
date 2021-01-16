const fs = require('fs');
const casssandra_ddl = require('./../utils/db/cassandra/cassandra_ddl');
const cassandra_client = require('./../utils/db/cassandra/cassandra_client');
htmlRegistrationTemplate = fs.readFileSync('./templates/forgot-password.html', 'utf8'),
    ejs = require('ejs');
const btoa = require('btoa');
const mail = require('./../utils/mail');
const jwt = require('jsonwebtoken-refresh');
const config = require('./../config/config');

const productList = (req, res, next) => {
    let body = req.body;
    let query = casssandra_ddl.select.viewProduct;
    let params = [];
    if (body.searchName && body.searchCategory) {
        query = casssandra_ddl.select.viewProductByCategoryName;
        params = ['%'+body.searchCategory+'%', '%'+body.searchName+'%'];
    } else if (body.searchName || body.searchCategory) {
        if (body.searchName) {
            params.push('%'+body.searchName+'%');
            query = casssandra_ddl.select.viewProductByName;
        }
        else if (body.searchCategory) {
            params.push('%'+body.searchCategory+'%');
            query = casssandra_ddl.select.viewProductByCategory;
        }
    }

    cassandra_client.dbQuery(query, params, (err, data) => {
        if (err) {
            console.log(`Error in inserting the user data${JSON.stringify(err)}`);
            res.status(500);
            res.send({ "status": false, "message": "Not created. Try after some time" });
        } else {
            let ascFlag = false;
            if (body.sort && body.sort.field && body.sort.by) {
                if (body.sort.by == 'asc') ascFlag = true;
            }
            if (ascFlag) data.rows.sort((a, b) => a[body.sort.field] > b[body.sort.field]);
            else data.rows.sort((a, b) => a[body.sort.field] < b[body.sort.field])
            res.status(200);
            res.send({ "status": true, data: data.rows });
        }
    })
}

const submitOrder = (req, res, next) => {
    try {
        let bodyData = req.body.cartItems;

        let promiseAArr = [];
        bodyData.forEach(async body => {
            promiseAArr.push(await createOrder(body));
        })
        Promise.all(promiseAArr).then((result) => {
            res.status(200);
            res.send({ "status": true, message: "Order created successfull" });
        }).catch((err) => {
            console.log(`Error${JSON.stringify(err)}`);
            res.status(404);
            res.send({ "status": false, message: "Out of Stock" });
        })

    } catch (e) {
        console.log(`Error${JSON.stringify(e)}`);
        res.status(500);
        res.send({ "status": false, "message": "Something went wrong" });
    }

}

function createOrder(body) {
    return new Promise(async (resolve, reject) => {
        try {
            let query = casssandra_ddl.select.viewProductCountById;
            let params = [body.product_uuid, body.product_name];
            await dbInsertions(query, params)
                .then(async (data) => {
                    if (data && data.rows.length > 0 && data.rows[0].stock_count > 0) {

                        query = casssandra_ddl.insert.order;
                        params = [body.product_uuid, body.user_name, body.phone_number, body.delivery_address, 'Order Placed', new Date().getTime()];
                        await dbInsertions(query, params);
                        query = casssandra_ddl.update.reduceStock;
                        params = [data.rows[0].stock_count - 1, body.product_uuid, body.product_name, body.sku];
                        await dbInsertions(query, params);
                        resolve()
                    } else {
                        reject({ error: "Out of Stock" })
                    }
                })
        }
        catch (e) {
            console.log(`Error${JSON.stringify(e)}`);
            reject({ error: "Error" })
        }
    })
}
function dbInsertions(query, params) {
    return new Promise((resolve, reject) => {
        cassandra_client.dbQuery(query, params, (err, data) => {
            if (err) {
                console.log(`Error${JSON.stringify(err)}`);
                return reject({ error: err });
            } else {

                return resolve(data)
            }
        })
    })
}

module.exports = {
    productList: productList,
    submitOrder: submitOrder
}