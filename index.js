var url = require('url');
var http = require('http');
var path = require('path');
var multer  = require('multer');
var express = require('express');
var fs = require('fs.extra');
var connect = require('connect');
var body_parser = require('body-parser');
var app = express();
var requestHandler = require('./requestHandler');
var config = require('./config');
var emulation = require('./emulation');
var port = 8888;
var userLog = config.userLog;

app.use(body_parser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/data'));
app.use(multer({dest:'./tmp/'}).array('file'));

function handler(err,result,res)
{
	if(err){
		console.error(err);
		res.send(err);
	}else{
		res.send(result);
	}
	res.end();	
}

app.get('/api/:type', function(req,res)
    {
		var url_parts = url.parse(req.url, true);
		var type = req.params.type;
		//userLog(url_parts);
		switch(type)
		{
			case "get" : requestHandler.requestDBGet(url_parts.query.request, url_parts.query.id, function(err, result){
				handler(err,result,res);			
			});
			break;
			case "remove" : requestHandler.requestDBRemove(url_parts.query.request, url_parts.query.id, function(err, result){
				handler(err,result,res);			
			});
			break;
			case "emulation" : emulation.Start(url_parts.query, function(err, result){
				handler(err,result,res);			
			});
			break;
			case "tz" : requestHandler.requestDBGetTZ(url_parts.query.id, function(err, result){
				handler(err,result,res);			
			});
			break;
		}
    }
);
app.post('/api/:type',function(req,res){
	var q = req.body;
	var type = req.params.type;
	switch(type)
	{
		case "create" : requestHandler.requestDBCreate(q,function(err,result){
							handler(err,result,res);				
						});
		break;
		case "edit" : requestHandler.requestDBEdit(q,function(err,result){
							handler(err,result,res);		
						});
		break;
	}
});


app.post('/upload', function(req, res, next) {
	fs.copy(req.files[0].path, 'data/user_images/'+req.files[0].filename+'.jpg');
	res.send('/user_images/'+req.files[0].filename+'.jpg');
});


http.createServer(app).on('connection', function(socket) {
  socket.setTimeout(10000);
}).listen(port, function(){
    userLog('Start');
});