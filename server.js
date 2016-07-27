
var http = require('http'),
    fs = require('fs');

var PORT = 80;

var RE = {
	fileReq: /\..{2,4}$/, // get file extension (2 to 4 chars after dot)
	subdir: /\/(.*?)\//   // between first two '/'
}

fs.readFile('./index.html', function (err, html) {
    if (err) 
        throw err;
         
    http.createServer(function(req, res) {

    	console.log('Req: ' + req.url);

    	// for file request
    	var gotReqFileExt = RE.fileReq.exec(req.url);
    	var reqFileExt = gotReqFileExt && gotReqFileExt[0];

    	//for dir request
    	var gotSubdir = RE.subdir.exec(req.url); 
    	var subdir = gotSubdir && gotSubdir[0];

    // Serve dirs

    	if ( gotSubdir && req.url.slice(-1) === '/' ) { // if not root && has '/' at the end
    		console.log('Res: 404');
    		res.writeHeader(404, { 'Content-Type': 'text/html'});
    		res.end(fs.readFileSync('./404.html'));
    	}

    // Serve files

    	// Serve .CSS
    	else if (reqFileExt === '.css' && subdir === '/css/') {
    		//check if file exists
    		fs.access('.' + req.url, fs.F_OK, function(err) {
    			if (err) {
    				console.log('No such file ' + req.url);
    				res.end('No such file on server!');
    			}
    			else {
    				fs.readFile('.' + req.url, function(err, data){
    					res.writeHead(200, {'Content-Type': 'text/css' });
    					res.end(data, 'utf-8');
    				});
    				
    			}
    		});
    	}
    	// Serve .TTF
    	else if (reqFileExt === '.ttf' && subdir === '/fonts/') {
    		//check if file exists
    		fs.access('.' + req.url, fs.F_OK, function(err) {
    			if (err) {
    				console.log('No such file ' + req.url);
    				res.end('No such file on server!');
    			}
    			else { // DIR.root + DIR.fonts +
    				fs.readFile('.' + req.url, function(err, data){
    					res.writeHead(200, {'Content-Type': 'application/font-sfnt' });
    					res.end(data, 'binary');
    				});

    			}
    		});
    	}
    	// Serve .PNG
    	else if (reqFileExt === '.png' && subdir === '/imgs/') {
    		//check if file exists
    		fs.access('.' + req.url, fs.F_OK, function(err) {
    			if (err) {
    				console.log('No such file ' + req.url);
    				res.end('No such file on server!');
    			}
    			else {
    				fs.readFile('.' + req.url, function(err, data){
    					res.writeHead(200, {'Content-Type': 'image/png' });
    					res.end(data, 'binary');
    				});

    			}
    		});
    	}
    	// Serve .JS
    	else if (reqFileExt === '.js' && subdir === '/js/') {
    		//check if file exists
    		fs.access('.' + req.url, fs.F_OK, function(err) {
    			if (err) {
    				console.log('No such file ' + req.url);
    				res.end('No such file on server!');
    			}
    			else {
    				fs.readFile('.' + req.url, function(err, data){
    					res.writeHead(200, {'Content-Type': 'text/javascript' });
    					res.end(data, 'utf-8');
    				});

    			}
    		});
    	}
		// Serve default (index.html)
    	else {
    		res.writeHeader(200, {"Content-Type": "text/html"});  
	        res.end(html);  	
    	}
		
    }).listen(PORT);

    console.log('Listening on port ' + PORT);
});