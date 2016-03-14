var AWS = require('aws-sdk'); 
var fs = require('fs');
var s3 = new AWS.S3(); //you can pass in credentials here
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser());

//Serve static content for the app from the "public" directory in the application directory.

// GET /style.css etc
app.use(express.static(__dirname + '/public'));

// Mount the middleware at "/assets" to serve static content only when their request path is prefixed with "/assets".

// GET /assets/style.css etc.
app.use('/assets', express.static(__dirname + '/public'));

app.set('port', 8080);

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

var jsonData; 

/* 
	ROUTeS
			*/
//post bucket name to view bucket
app.post("/bucket", function(req,res){
	console.log(req.body.bucket);
	bucketname = req.body.bucket;

	/*use root bucket */
	var params = {
	  Bucket: bucketname,
	  EncodingType: 'url'
	};

	/*get objects from bucket */
	s3.listObjects(params, function(err, data){
		if (err) console.log(err, err.stack); //log error from s3 listing
		else saveDataAndKeys(data.Contents, bucketname);	
	});    

	function saveDataAndKeys(content, bucket) {
		jsonData = content;
		jsonData.push({"bucketName": bucket});
		
		fs.writeFile("assets/data.json", JSON.stringify(jsonData), function(err) {
	    if(err) {
	        return console.log(err);
	    }
	    console.log("The file was saved!");
		}); 
	}

	/* todo: add jquery and put in the bucket name */
	res.sendFile('index.html', {"root": __dirname});

});

/* one get for the html page */
app.get("/", function(req,res){
	res.sendFile('bucket.html', {"root": __dirname});
}); 

/* there has to be a better way to serve assets, but who gives a shit */
app.get("/assets/frontend.js", function(req,res){
	console.log("serve frontend script");
	res.sendFile('/assets/frontend.js', {"root": __dirname});
});

app.get("/assets/styles.css", function(req,res){
	console.log("serve styles styles!");
	res.sendFile('/assets/styles.css', {"root": __dirname});
});

app.get("/assets/landing.css", function(req,res){
	console.log("serve landing styles!");
	res.sendFile('/assets/landing.css', {"root": __dirname});
});

app.get("/assets/data.json", function(req,res){
	console.log("serve jsonData!");
	res.json(jsonData);
});
