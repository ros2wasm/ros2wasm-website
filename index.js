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


let listener;

function startListener() {

    document.getElementById("listenerOutput").innerHTML = "Initializing subscriber...\n";

    if (typeof(listener) == "undefined") {
        listener = new Worker("pubsub/listener.js");
    }

    listener.addEventListener('message', function(e) {
        let message = e.data;
    })

    listener.onmessage = function(e) {
        let message = e.data;
        console.log(`[FROM LISTENER]: ${message}`);
    }

    listener.postMessage("data: from main with no love");

    let count = 0;
    while (count < 10) {
        if (new_message != last_message) {
            listener.postMessage(new_message);
            last_message = new_message;
        } else {
            console.log("[FROM] SAME MESSAGE");
        }
        count ++;
    }

    listener.postMessage("data: listener done")


}

function stopListener() {
    listener.terminate();
    listener = undefined;
    document.getElementById("listenerOutput").innerHTML += "Subscriber terminated.\n\n";
}

function clearListener() {
    document.getElementById("listenerOutput").innerHTML = "";
}

let publisher;

function startTalker() {

    document.getElementById("talkerOutput").innerHTML = "Initializing publisher...\n";

    if (typeof(publisher) == "undefined") {
        publisher = new Worker("pubsub/talker.js");
    }

    // publisher.addEventListener('message', function(e) {
    //     let data = e.data;
    //     new_message = e.data;
    //     document.getElementById("talkerOutput").innerHTML += e.data;
    //     console.log(`[FROM PUB] ${new_message}`);
    //     listener.postMessage(new_message);
    //     console.log("[FROM PUB] results???");
    // })

    publisher.onmessage = function(event) {
        // msg_queue.enqueue(event);
        new_message = event.data;
        document.getElementById("talkerOutput").innerHTML += event.data;
        console.log(`[FROM PUB] ${new_message}`);
        listener.postMessage(new_message);
        console.log("[FROM PUB] results???");
    }
}

function stopTalker() {
    publisher.terminate();
    publisher = undefined;
    document.getElementById("talkerOutput").innerHTML += "Publisher terminated.\n\n";
}

function clearTalker() {
    document.getElementById("talkerOutput").innerHTML = "";
}
