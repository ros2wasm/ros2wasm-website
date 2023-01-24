let msg_queue = [];

onconnect = function(e) {
    console.log("[QUE] Connected");
    const port = e.ports[0];

    port.onmessage = function(event) {
        const message = event.data;
        console.log("[QUE] Received: ", message);
        
        // Store message
        msg_queue.push(message);

        // Post message back to application
        console.log("[QUE] Sending back message");
        port.postMessage("message from QUE")
    };

};