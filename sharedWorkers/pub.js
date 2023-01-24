const browserInstances = [];
const messages = [];

onconnect = function(e) {
    console.log("[PUB] Connected");
    const port = e.ports[0];

    // store new connected browser instances
    browserInstances.push(port);

    port.onmessage = function(event) {
        const message = event.data;

        // Store message
        messages.push(message);

        // Post message back
        console.log("[PUB] Sending back message");
        browserInstances.forEach(instance => {
            instance.postMessage(message);
        })
    }

}