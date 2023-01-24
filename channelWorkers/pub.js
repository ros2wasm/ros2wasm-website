let queuePort;
let onMessageFromQueue = function( event ){
    console.log("[PUB] Received: " + event.data + ":END");

    //To send something back to worker 2
    // queuePort.postMessage("[W1] I got your message");
};

self.onmessage = function( event ) {
    switch( event.data.command )
    {
        // Setup connection to queue
        case "connect":
            queuePort = event.ports[0];
            queuePort.onmessage = onMessageFromQueue;
            break;

        // Forward messages to queue
        case "publish":
            // Forward messages to queue
            queuePort.postMessage( event.data.message );
            break;

        // Handle other messages from main
        default:
            console.log( event.data );
    }
};