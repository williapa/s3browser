var AWS = require('aws-sdk'); 
var fs = require('fs');
var s3 = new AWS.S3(); 
var express = require('express');
var app = express();

//Serve static content for the app from the "public" directory in the application directory.

    // GET /style.css etc
    app.use(express.static(__dirname + '/public'));

// Mount the middleware at "/static" to serve static content only when their request path is prefixed with "/static".

    // GET /assets/style.css etc.
    app.use('/assets', express.static(__dirname + '/public'));



app.set('port', 8080);

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

var keys = [];
var jsonData;

/*use root bucket */
var params = {
  Bucket: 'bucket',
  EncodingType: 'url'
};

/*get objects from bucket */
s3.listObjects(params, function(err, data){
	if (err) console.log(err, err.stack); //log error from s3 listing
	else saveDataAndKeys(data.Contents);	
});    

function saveDataAndKeys(content) {
	jsonData = content;
	for( key in content ) {
		keys.push(key);
	};

	fs.writeFile("assets/data.json", JSON.stringify(content), function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("The file was saved!");
	}); 
}

/* one get for the html page */
app.get("/", function(req,res){
	res.sendFile('index.html', {"root": __dirname});
}); 

/* there has to be a better way to serve assets, but who gives a shit */
app.get("/assets/script.js", function(req,res){
	console.log("why can't i get a script bitch?");
	res.sendFile('/assets/script.js', {"root": __dirname});
});

app.get("/assets/data.json", function(req,res){
	console.log("it happened!");
	res.json(jsonData);
});
