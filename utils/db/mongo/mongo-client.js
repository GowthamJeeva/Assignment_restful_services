const MongoClient = require('mongodb').MongoClient;
const constants = require('./../../../config/config');

global.db = [];

// Connection URL
var url = `mongodb://${constants.DATABASE.URL}:${constants.DATABASE.PORT}/${constants.DATABASE.NAME}`;

// Use connect method to connect to the server
var connect = async function(){
	database = await new Promise((resolve, reject) => {
		MongoClient.connect(url, function(err, database) {
			if(err){
				reject(err);
				console.log('Failed to connect\n' + err.stack);
				process.exit();
			}
			resolve(database);
		});
	});
	global.db.push(database.db(constants.DATABASE.NAME));
	return database.db(constants.DATABASE.NAME);
}


module.exports = {connect: connect}
