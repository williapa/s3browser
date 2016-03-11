var AWS = require('aws-sdk'); 
var s3 = new AWS.S3(); 
var express = require('express');
var app = express();
app.set('port', 8080);

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

/*use root bucket */
var params = {
  Bucket: 'YOURBUCKET',
  EncodingType: 'url'
};

s3.listObjects(params, function(err, data){
	if (err) console.log(err, err.stack); //log error from s3 listing
	else makeDataForHTML(data.Contents);	
});    

function makeDataForHTML(content) {
	keys = []
	for( key in content ) {
		keys.push(key);
		console.log(content[key]);
		writeToPage(key,content);
	};
};

function writeToPage(k,c){
		//todo
};

