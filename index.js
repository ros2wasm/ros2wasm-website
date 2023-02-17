class CircularStack {
    constructor(size) {
        this.element = [];
        this.size = size
        this.top = -1
    }
    
    isEmpty() {
        return (this.element.length == 0)
    }
    
    push(element) {
        this.top++;
        // Wrap around
        this.top = (this.top < this.size) ? this.top : 0;
        this.element[this.top] = element;
    }
    
    pop() {
        // LIFO : get most recent
        if (this.isEmpty()) return null;
        const value = this.element[this.top]
        this.element[this.top] = null;
        return value
    }
    
    clear() {
        this.element = new Array()
        this.top = -1
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
            if (!(event.data.topic in topicMap)) {
                topicMap[event.data.topic] = {
                    messages: new CircularStack(5),
                    participants: []
                }
            }

            topicMap[event.data.topic].participants.push(event.data.gid);
            
            break;

        case "deregister":
            let gidIndex = topicMap[event.data.topic].participants.indexOf(gid);

            // Remove from topic map
            topicMap[event.data.topic].participants.splice(gidIndex, 1);

            if (topicMap[event.data.topic].participants.length == 0) {
                delete topicMap[event.data.topic];
            }

            break;

        case "publish":
            topicMap[event.data.topic].messages.push(event.data.message);
            document.getElementById("talkerOutput").innerHTML += event.data.message + "\n";
            break;

        case "retrieve":
    
            if ( event.data.topic == "/wasm_topic" ) {
                let msg = topicMap[event.data.topic].messages.pop();
                
                if (msg !== null) {
                    document.getElementById("listenerOutput").innerHTML += msg + "\n";

                    // TODO: broadcast to all subscribers
                    listener.postMessage(msg);
                } 
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
    if (listener !== null) {
        listener.terminate();
        listener = null;
    }
    document.getElementById("listenerOutput").innerHTML += "Subscriber terminated.\n\n";
}

function clearListener() {
    document.getElementById("listenerOutput").innerHTML = "";
}
