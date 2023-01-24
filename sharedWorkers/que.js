self.onconnect = function(e) {
    const port = e.ports[0];

    port.onmessage = function(e) {
        let pubPort = e.data.pubPort;
        pubPort.onmessage = function(e) {
            console.log("[QUE] Received: ", e.data);
        };
    };

};