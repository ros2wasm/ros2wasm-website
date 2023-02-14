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
let talker = null;
let listener = null;

  
// Receive messages from workers
let onMessageFromWorker = function( event ) {
    switch( event.data.command )
    {
        case "register":
            console.log("MMM Registering new participant")
            console.log(event.data.name)
            console.log(event.data.gid)
            break;

        case "deregister":
            console.log("MMM Deregister participant")
            console.log(event.data.gid)
            break;

        case "publish":
            msg_queue.enqueue( event.data.message );
            document.getElementById("talkerOutput").innerHTML += event.data.message + "\n";
            break;

        case "retrieve":
    
            if ( event.data.name == "/wasm_topic" ) {
                console.log("MMM Retrieving message")
                let retrieveMessage = "";
                if (!msg_queue.isEmpty) {
                    retrieveMessage = msg_queue.dequeue();
                }
                document.getElementById("listenerOutput").innerHTML += retrieveMessage + "\n";
                listener.postMessage(retrieveMessage);
                console.log("MMM Message sent back to wasm listener")
            }
            break;
    }
}


// PUBLISHER 

function startTalker() {

    document.getElementById("talkerOutput").innerHTML += "Publisher initializing.\n";

    if (talker === null) {
        talker = new Worker("pubsub/talker.js");
    }

    talker.onmessage = onMessageFromWorker;
}

function stopTalker() {
    talker.terminate();
    talker = null;

    // Terminate subscriber to reestablish connection at restart
    if (listener !== null) {
        stopListener();
    }

    document.getElementById("talkerOutput").innerHTML += "Publisher terminated.\n\n";
}

function clearTalker() {
    document.getElementById("talkerOutput").innerHTML = "";
}


// SUBSCRIBER

function startListener() {

    document.getElementById("listenerOutput").innerHTML += "Subscriber initializing.\n";

    if (listener === null) {
        listener = new Worker("pubsub/listener.js");
    }

    listener.onmessage = onMessageFromWorker;
}

function stopListener() {
    listener.terminate();
    listener = null;

    document.getElementById("listenerOutput").innerHTML += "Subscriber terminated.\n\n";
}

function clearListener() {
    document.getElementById("listenerOutput").innerHTML = "";
}
