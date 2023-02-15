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


const topicMap = {};


let talker = null;
let listener = null;

  
// Receive messages from workers
let onMessageFromWorker = function( event ) {
    switch( event.data.command )
    {
        case "register":
            console.log("[MAIN] Registering new participant")

            if (!(event.data.topic in topicMap)) {
                topicMap[event.data.topic] = {
                    messages: new Queue(),
                    participants: []
                }
            }

            topicMap[event.data.topic].participants.push(event.data.gid);
            
            break;

        case "deregister":
            console.log("[MAIN] Deregister participant")

            let gidIndex = topicMap[event.data.topic].participants.indexOf(gid);

            // Remove from topic map
            topicMap[event.data.topic].participants.splice(gidIndex, 1);

            if (topicMap[event.data.topic].participants.length == 0) {
                delete topicMap[event.data.topic];
            }

            break;

        case "publish":
            topicMap[event.data.topic].messages.enqueue(event.data.message);
            document.getElementById("talkerOutput").innerHTML += event.data.message + "\n";
            break;

        case "retrieve":
    
            if ( event.data.topic == "/wasm_topic" ) {
                console.log("MMM Retrieving message")
                let msg = (
                    topicMap[event.data.topic].messages.isEmpty ?
                    "" :
                    topicMap[event.data.topic].messages.dequeue()
                );
                
                if (msg !== "") {
                    document.getElementById("listenerOutput").innerHTML += msg + "\n";
                }
                listener.postMessage(msg);
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
    if (listener !== null) { stopListener(); }

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
