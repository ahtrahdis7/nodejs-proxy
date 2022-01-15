const net = require('net');
const server = net.createServer();

server.on('connection', (clientToProxySocket) => {
    // console.log("::=> Conn. Proxy Server <::");

    // write code to create http proxy server
    clientToProxySocket.once('data', (data) => {
        // console.log(data.toString());

        // HTTPs requests has CONNECT in the data.
        // where as HTTP requests contain req method followed by URL.
        let ishttps = data.toString().includes('CONNECT');
        let host, port;

        // http connects on port 80, where as https connects on port 443.
        if(ishttps){
            host = data.toString().split("CONNECT")[1].split(" ")[1].split(":")[0];
            port = 443
        } else {
            host = data.toString().split("Host: ")[1].split("\r\n")[0];
            port = 80
        }
        // creating a proxy to server connection here.
        let ProxyToServerSocket = net.createConnection({
            host: host,
            port: port
        }, () => {
            console.log(`::======> proxy ---------> ${host}:${port} connection established`);
        });

        if(ishttps){
            clientToProxySocket.write("HTTP/1.1 200 OK\r\n\r\n");
        } else {
            ProxyToServerSocket.write(data);
        }

        // console.log(clientToProxySocket)
        // piping the request-->client stream to proxy->server stream
        // and vice versa.
        clientToProxySocket.pipe(ProxyToServerSocket);
        ProxyToServerSocket.pipe(clientToProxySocket);

        // error logggers.
        ProxyToServerSocket.on('error', (err) => {
            console.log("proxy error")
            console.log(err);
        });

        clientToProxySocket.on('error', (err) => {
            console.log("socket error")
            console.log(err);
        }); 
    });

    clientToProxySocket.on('close', () => {
        console.log("::=> Client to Proxy Server Closed !! <::");
    })
});

server.on("error", (err) => {
    console.log("Error: " + err);
});

server.on("close", () => {
    console.log("Server closed");
});

server.listen({
    port: 8000
}, () => {
    console.log("Server started & 0.0.0.0:8000");
})