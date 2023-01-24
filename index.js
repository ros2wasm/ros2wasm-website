class Queue {
    constructor() {
        this.elements = {};
        this.head = 0;
        this.tail = 0;
    }
    enqueue(element) {
        console.log("QUEUE: " + element.data);
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
  
// let msg_queue = new Queue();
let last_message = {"data": "data: I'm an empty message"};
let new_message;

// Communication channel
const channel = new MessageChannel();

// SUBSCRIBER

let listener;

function startListener() {

    document.getElementById("listenerOutput").innerHTML = "Initializing subscriber...\n";

    if (typeof(listener) == "undefined") {
        listener = new Worker("pubsub/listener.js");
    }

    listener.postMessage({port: channel.port1}, [channel.port1]);

}

function stopListener() {
    listener.terminate();
    listener = undefined;
    document.getElementById("listenerOutput").innerHTML += "Subscriber terminated.\n\n";
}

function clearListener() {
    document.getElementById("listenerOutput").innerHTML = "";
}

// PUBLISHER 

let publisher;

function startTalker() {

    startListener();

    document.getElementById("talkerOutput").innerHTML = "Initializing publisher...\n";

    if (typeof(publisher) == "undefined") {
        publisher = new Worker("pubsub/talker.js");
    }

    publisher.postMessage({port: channel.port2}, [channel.port2]);

    publisher.addEventListener('message', function(e) {
        const {port} = e.data;
        port.postMessage(['hellow', 'monde']);
    })

    // publisher.onmessage = function(event) {
    //     // msg_queue.enqueue(event);
    //     new_message = event.data;
    //     document.getElementById("talkerOutput").innerHTML += event.data;

    //     if (typeof listener != "undefined") {
    //         console.log(`[FROM PUB] ${new_message}`);
    //         listener.postMessage(new_message);
    //         console.log("[FROM PUB] results???");
    //     }
    // }
}

function stopTalker() {
    publisher.terminate();
    publisher = undefined;
    document.getElementById("talkerOutput").innerHTML += "Publisher terminated.\n\n";
}

function clearTalker() {
    document.getElementById("talkerOutput").innerHTML = "";
}



