let worker1port;
let onMessageFromWorker1 = function( event ){
    console.log("[W2] received a message from W1: " + event.data + ":END\n");

    //To send something back to worker 1
    // worker1port.postMessage("[W2] I got your message\n");
};

self.onmessage = function( event ) {
    switch( event.data.command )
    {
        // Setup connection to worker 1
        case "connect":
            worker1port = event.ports[0];
            worker1port.onmessage = onMessageFromWorker1;
            break;

        // Forward messages to worker 1
        case "forward":
            // Forward messages to worker 1
            worker1port.postMessage( event.data.message );
            break;

        //handle other messages from main
        default:
            console.log( event.data );
    }
};

