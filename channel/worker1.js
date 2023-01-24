let worker2port;
let onMessageFromWorker2 = function( event ){
    console.log("[W1] received a message from W2: " + event.data + ":END\n");

    //To send something back to worker 2
    worker2port.postMessage("[W1] I got your message");
};

self.onmessage = function( event ) {
    switch( event.data.command )
    {
        // Setup connection to worker 2
        case "connect":
            worker2port = event.ports[0];
            worker2port.onmessage = onMessageFromWorker2;
            break;

        // Forward messages to worker 2
        case "forward":
            // Forward messages to worker 2
            worker2port.postMessage( event.data.message );
            break;

        //handle other messages from main
        default:
            console.log( event.data );
    }
};