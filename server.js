var http = require("http");
var fs = require("fs");

/*
	this is a list of url to save url which we
	might receive request later
*/
var url_lst = [
		'/',
		'/index.html',
		'/js/script.js',
		'/js/jquery-2.2.4.min.js',
		'/css/style.css'
];


/*
	Main function to start the server at 127.0.0.1:8080
*/
function startServer() {
	var hostname = '127.0.0.1';
  	var port = 3000;
	var server = http.createServer(function(req, res) {
		res.statusCode = 200;
      	res.setHeader('Content-Type', 'text/html');
		switch (req.url) {
			// case of url '/' and '/a3.html'
			case url_lst[0]:
			case url_lst[1]:
				var content = fs.readFileSync('./index.html', 'utf8');
				res.writeHead(200, {"Content-Type": "text/html"});
				res.end(content);
				break;

			// case of url '/assets/scripts/script.js' and
			// '/assets/scripts/jquery-2.2.4.min.js',
			case url_lst[2]:
			case url_lst[3]:
				var content = fs.readFileSync('.' + req.url, 'utf8');
				res.writeHead(200, {"Content-Type": "text/javascript"});
				res.end(content);

				break;

			// case of url '/assets/css/style.css'
			case url_lst[4]:
				var content = fs.readFileSync('.' + req.url, 'utf8');
				res.writeHead(200, {"Content-Type": "text/css"});
				res.end(content);

			// other request will be consider as 404 not found
			default:
      			res.statusCode = 404;
     			res.end("404 Not Found!");
    	}
	});
	server.listen(port, hostname);
};

// start the server
exports.startServer = startServer();
console.log('Server running at http://localhost:3000/');
