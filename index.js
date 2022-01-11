const express = require('express');
const request = require('request');
const http = express();

// Only works with http requests.
http.all('*', (req, res) => {
    const hostname = req.headers.host;
    console.log(hostname);
    request(req.url).pipe(res);
});

http.listen({
    host: '0.0.0.0',
    port: 8000
}, () => {
    console.log("Server started & Listening at 8000");
}) 