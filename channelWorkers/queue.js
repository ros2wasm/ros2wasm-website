class Queue {
    constructor() {
        this.elements = {};
        this.head = 0;
        this.tail = 0;
    }
    enqueue(element) {
        console.log("QUEUEing: " + element);
        this.elements[this.tail] = element;
        this.tail++;
    }
    dequeue() {
        console.log("deQUEUED");
        const item = this.elements[this.head];
        delete this.elements[this.head];
        this.head++;
        return item;
    }
    peek() {
        return this.elements[this.head];
    }
    get length() {
        return this.tail - this.head;
    }
    get isEmpty() {
        return this.length === 0;
    }
}
  
let msg_queue = new Queue();

let pubPort;
let onMessageFromPub = function(event) {
    console.log("[QUEUE] Received from pub: " + event.data + ":END");
    msg_queue.enqueue(event.data);

    // To send something back to main
    self.postMessage({
        from: "pub",
        message: event.data + "\n"
    })
    // pubPort.postMessage("[W2] I got your message\n");
};

let subPort;
let onMessageFromSub = function(event) {
    console.log("[QUEUE] Received from sub: " + event.data + ":END");

    let message = (msg_queue.isEmpty) ? "empty queue" : msg_queue.dequeue();

    // Send something back to sub
    subPort.postMessage(message);

    // Send something back to main
    self.postMessage({
        from: "sub",
        message: message + "\n"
    })
}

self.onmessage = function( event ) {
    switch( event.data.command )
    {
        // Setup connection to pub
        case "connectPub":
            pubPort = event.ports[0];
            pubPort.onmessage = onMessageFromPub;
            break;

        case "connectSub":
            subPort = event.ports[0];
            subPort.onmessage = onMessageFromSub;
            break;

        // case "publish":
        //     console.log("HEEEERE");
        //     // Forward messages to pub
        //     pubPort.postMessage( event.data.message );

        //     // Send message to main for printing
            
        //     break;

        // case "subscribe":
        //     console.log("OR HEEERE");
        //     subPort.postMessage( event.data.message );

        //handle other messages from main
        default:
            console.log( event.data );
    }
};

