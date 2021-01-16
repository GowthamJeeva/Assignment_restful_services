'use strict';

const cassandraDriver = require('cassandra-driver');
const host = "127.0.0.1";
const port = 9042;

const option = {
    contactPoints: [`${host}:${port}`],
    localDataCenter: 'datacenter1',
    keyspace: 'loginx'   
};

const client = new cassandraDriver.Client(option);

client.connect((err) => {
    if (err) {
        console.log(`Errror -- cassandra connection${JSON.stringify(err)}`);
    } else {
        console.log("Cassandra connected successfully");
    }
});

module.exports = client;