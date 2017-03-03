var http = require('http');

http.createServer(function (req, res) {
    
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('This is a great test after removing unused files!');
    
}).listen(process.env.PORT || 8080);