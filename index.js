const http = require('http');
const serverUrl = require('url');
const { StringDecoder } = require('string_decoder');
const routes = require('./routes');
const { resourceNotFound } = require('./controller');

let currentPort = process.env.PORT || 3000;

const server = http.createServer((request, response) => {
    const { url, method } = request;
    let { pathname } = serverUrl.parse(url, true);
    const trimmedPath = pathname.replace(/^\/+|\/+$/g, "");
    const currMethod = method.toUpperCase();

    let buffer = "";
    const decoder = new StringDecoder('utf-8');
    request.on('data', (data) => {
        buffer += decoder.write(data);
    });

    request.on('end', () => {
        buffer += decoder.end();
        const currentRoute = (typeof routes.get[trimmedPath] !== 'undefined' && currMethod === "GET") ? routes.get[trimmedPath] :
            (typeof routes.post[trimmedPath] !== 'undefined' && currMethod === "POST") ? routes.post[trimmedPath] : 
            resourceNotFound;

        currentRoute(buffer, (statusCode, reqResponse) => {
            statusCode = (typeof statusCode === 'number') ? statusCode : 404;
            reqResponse = (typeof reqResponse === 'object') ? reqResponse : {};

            response.setHeader('Content-Type', 'application/json');
            response.writeHead(statusCode);
            response.end(JSON.stringify(reqResponse));
        });
    })
});

server.listen(currentPort, () => {
    console.log("Listening on Port " + currentPort);
});