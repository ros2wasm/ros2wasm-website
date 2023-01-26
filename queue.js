// Desired behavior:
// - New publisher
//     - connect: create new queue with topic name
//     - publish: broadcast to all subscribers
// - Subscriber:
// 

class Queue {
    constructor() {
        this.elements = {};
        this.head = 0;
        this.tail = 0;
    }
    enqueue(element) {
        this.elements[this.tail] = element;
        this.tail++;
    }
    dequeue() {
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
let subPort;

let onMessageFromPub = function(event) {
    let message = event.data;
    console.log("[QUEUE] Received from pub: " + message);
    msg_queue.enqueue(message);

    // To send something back to main
    self.postMessage({
        from: "pub",
        message: message
    })
    
    // Broadcast to all subscribers (currently 1)
    if (typeof(subPort) != "undefined") {
        console.log("is sub defined?" + typeof(subPort));
        subPort.postMessage(message);
        console.log("[QUEUE] Message sent to sub");
        self.postMessage({
            from: "sub",
            message: message
        });
    }
};

let onMessageFromSub = function(event) {
    console.log("[QUEUE] Received from sub: " + event.data);
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
        
        case "disconnectPub":
            pubPort = undefined;
            console.log("Publisher disconnected.");
            break;

        case "disconnectSub":
            subPort = undefined;
            console.log("Subscriber disconnected.");
            break;

        // handle other messages from main
        default:
            console.log(event.data);
    }
};

