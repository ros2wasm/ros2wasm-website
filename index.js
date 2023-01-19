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
  
let msg_queue = new Queue();

let listener;

function startListener() {

    let last_message = "data: No data yet";
    let new_message;

    document.getElementById("listenerOutput").innerHTML = "Initializing subscriber...\n";

    if (typeof(listener) == "undefined") {
        listener = new Worker("pubsub/listener.js");
    }

    listener.addEventListener('message', function(e) {
        let message = e.data;
    })

    // listener.onmessage = function(event) {
    // let count = 0;
    // while (count < 1000) {

    let que_lenght = msg_queue.length;
    console.log("QUELENGHT: " + que_lenght);
    if (!msg_queue.isEmpty) {
        console.log("QUE IS NOT EMPTY " + msg_queue.length);
        new_message = msg_queue.dequeue();
        console.log("DEQUE: " + new_message.data);
    } else {
        new_message = {"data": "data: all empty"};
    }
    // new_message = (msg_queue.isEmpty()) ? {"data": "data: empty"} : msg_queue.peek();
    if (new_message != last_message) {
        document.getElementById("listenerOutput").innerHTML += new_message.data + "\n";
        last_message = new_message;
    }
    listener.postMessage(new_message.data);
        // count++;
    // }
        // return new_message;
    // }
    listener.onmessage = function(event) {
        console.log("I WAS CALLED");
        if (!msg_queue.isEmpty) {
            console.log("QUE IS NOT EMPTY " + msg_queue.length);
            new_message = msg_queue.dequeue();
            console.log("DEQUE: " + new_message.data);
        } else {
            new_message = {"data": "data: all empty"};
        }
        // new_message = (msg_queue.isEmpty()) ? {"data": "data: empty"} : msg_queue.peek();
        if (new_message != last_message) {
            document.getElementById("listenerOutput").innerHTML += new_message.data + "\n";
            last_message = new_message;
        }
        self.postMessage("data: onmessage from main");
    }

    // listener.postMessage(new_message);
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

    publisher.addEventListener('message', function(e) {
        let data = e.data;
    })

    publisher.onmessage = function(event) {
        msg_queue.enqueue(event);
        document.getElementById("talkerOutput").innerHTML += event.data;
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