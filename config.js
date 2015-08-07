var mysql = require('mysql');

function config()
{
	console.log(123);
}

function userLog(text)
{
	console.log(text);
}

var client = mysql.createPool({
	connectionLimit : 10,
	host : 'localhost',
	user : 'root',
	password : 'S6rFYJNs$B',
	database : 'pavelt'
});

var cnf = {
	University:'universities',
	Department:'departments',
	Student:'students',
	Teacher:'teachers',
}

exports.config = config;
exports.userLog = userLog;
exports.client = client;
exports.cnf = cnf;