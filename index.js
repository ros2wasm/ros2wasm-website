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

let listener;

function startListener() {

    let last_message = "data: No data yet";
    let new_message = last_message;

    document.getElementById("listenerOutput").innerHTML = "Initializing subscriber...\n";

    if (typeof(listener) == "undefined") {
        listener = new Worker("pubsub/listener.js");
    }

    listener.addEventListener('message', function(e) {
        let message = e.data;
    })

    let count = 0;
    while (count < 1000) {
        console.log("CHECKING NEW MESSAGE");
        if (!msg_queue.isEmpty) {
            new_message = msg_queue.peek();
        }
        if (new_message != last_message) {
            console.log("FOUND NEW MESSAGE");
            listener.postMessage(new_message.data);
            last_message = new_message;
            document.getElementById("listenerOutput").innerHTML += new_message.data + "\n";
        }
        setTimeout(function(){
            console.log("Executed after 1 second");
        }, 1000);
        count++;
    }
    // listener.onmessage = function(event) {
    //     let msgTaken = (msg_queue.isEmpty) ? {"data": "data: empty"} : msg_queue.peek();
    //     document.getElementById("listenerOutput").innerHTML += msgTaken.data + "\n";
    //     listener.postMessage(msgTaken);
    // }
}

function stopListener() {
    listener.terminate();
    listener = undefined;
    document.getElementById("listenerOutput").innerHTML += "Subscriber terminated.\n\n";
}

function clearListener() {
    document.getElementById("listenerOutput").innerHTML = "";
}


// while (typeof listener != "undefined") {
//     let msgTaken = (msg_queue.isEmpty) ? {"data": "data: empty"} : msg_queue.peek();
//     console.log("MESAGE");
//     console.log(msgTaken);
//     listener.postMessage(msgTaken);
// }