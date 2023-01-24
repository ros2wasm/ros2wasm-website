let pubPort;
let onMessageFromPub = function( event ){
    console.log("[QUEUE] Received: " + event.data + ":END");

    //To send something back to pub
    // pubPort.postMessage("[W2] I got your message\n");
};

self.onmessage = function( event ) {
    switch( event.data.command )
    {
        // Setup connection to pub
        case "connect":
            pubPort = event.ports[0];
            pubPort.onmessage = onMessageFromPub;
            break;

        // Forward messages to pub
        case "forward":
            // Forward messages to pub
            pubPort.postMessage( event.data.message );
            break;

        //handle other messages from main
        default:
            console.log( event.data );
    }
};

