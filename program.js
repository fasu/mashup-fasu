var http = require('http');
var concatStream = require('concat-stream');
var _ = require('lodash');

var port = 9090;

var statusHtml = "<html><body>No data available</body></html>";

var server = http.createServer(function (request, response) {
        response.writeHead(200, {'Content-Type' : 'text/html'});
        response.end(statusHtml);
});
server.listen(port);
console.log("Serveri pyörii portissa: " + port);

var bookUrl = 'http://metadata.helmet-kirjasto.fi/search/author.json?query=Campbell';

http.get(bookUrl, function(response) {
	response.pipe(concatStream(function (data) {
		var bookData = data.toString();
		var bookList = _.map(JSON.parse(bookData).records, function(d) {
            return {
                displayName: d.title,
                year: d.year
            };
        });

      	statusHtml = "<html><body>";
        _.map(bookList, function(d) {
            statusHtml += "<h1>" + d.displayName + "</h1>";
            statusHtml += "<p>" + d.year + "</p>";
   		 });

    statusHtml += "</body></html>";
    console.log("Kirjalista ladattu.");
	}));
});