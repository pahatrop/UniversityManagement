var mysql = require('mysql');
var body_parser = require('body-parser');
var methodOverride = require('method-override');
var config = require('./config');
var client = config.client;
var cnf = config.cnf;
var userLog = config.userLog;

function associationTable(t)
{	
	return cnf[t] ? cnf[t] : false;	
}

function requestDBGet(name, id, callback)
{
	var table = associationTable(name);
	var sql = 'SELECT * FROM ' + table + ' WHERE `deleted` = 0';
	
	if(id>0)
	{
		sql += ' AND `Parent` = ' + id;
	}
	userLog(sql);
	client.query(sql, function(error, result, fields){
		callback(error, result);
	});
}

function requestDBCreate(data, callback)
{
	var table = associationTable(data.queryName);
	if(table != false)
	{
		var sql = 'INSERT INTO '+table+' SET';
		for(var paramName in data){
			if(paramName == 'queryName') continue;
			if(paramName == 'deleted') continue;
			if(paramName == 'id') continue;
			if(paramName == 'Id') continue;
			sql += ' '+paramName+'='+mysql.escape(data[paramName])+',';
		}
		sql = sql.slice(0, sql.length-1);
		userLog(sql);
		client.query(sql, function(error, result, fields){ 			
			callback(error, result);
		});		
	}else{
		callback('table not found');
	}
}

function requestDBEdit(data, callback)
{
	var table = associationTable(data.queryName);
	if(table != false)
	{
		var sql = 'UPDATE '+table+' SET';
		for(var paramName in data){
			if(paramName == 'queryName') continue;
			if(paramName == 'deleted') continue;
			if(paramName == 'id') continue;
			if(paramName == 'Id') continue;
			sql += ' '+paramName+'='+mysql.escape(data[paramName])+',';
		}
		sql = sql.slice(0, sql.length-1);
		sql += ' WHERE `id` = ' + data.id;
		userLog(sql);
		client.query(sql, function(error, result, fields){ 			
			callback(error, result);
		});		
	}
}

function requestDBRemove(name, id, callback)
{
	var table = associationTable(name);
	if(table != false)
	{
		var sql = 'UPDATE '+table+' SET `deleted` = 1 WHERE `id` = ' + id;
		userLog(sql);
		client.query(sql, function(error, result, fields){ 			
			callback(error, result);
		});		
	}
}

function requestDBGetTZ(id, callback)
{
	var sql = 'SELECT * FROM `timezones` WHERE `id` = '+mysql.escape(id);
	
	userLog(sql);
	client.query(sql, function(error, result, fields){
		callback(error, result);
	});
}

exports.requestDBGet = requestDBGet;
exports.requestDBCreate = requestDBCreate;
exports.requestDBEdit = requestDBEdit;
exports.requestDBRemove = requestDBRemove;
exports.requestDBGetTZ = requestDBGetTZ;
