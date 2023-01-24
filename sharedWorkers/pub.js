self.onconnect = function(e) {
    const port = e.ports[0];

    self.setInterval(function() {
        console.log("[PUB] Sending a message");
        port.postMessage("sent from PUB");
    }, 1000);

}