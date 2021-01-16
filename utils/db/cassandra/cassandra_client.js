const cassandraConnection = require('../../../startup/cassandraConnection');


const dbQuery = (query, params, cb) => {
    cassandraConnection.execute(query, params, {
        prepare: true
    }, (err, data) => {
        cb(err, data);
    })
}

module.exports = {
    dbQuery: dbQuery
};