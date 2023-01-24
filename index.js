// Communication channels
let channel_pub = new MessageChannel();
let channel_sub = new MessageChannel();

// MESSAGE QUEUE
let queue = new Worker("queue.js");

// Receive messages from queue for printing output
queue.onmessage = function(event) {
    switch( event.data.from )
    {
        case "pub":
            document.getElementById("talkerOutput").innerHTML += event.data.message;
            break;
        case "sub":
            document.getElementById("listenerOutput").innerHTML += event.data.message;
        default:
            console.log("Weird message: " + event.data);
    }
}

// PUBLISHER 
let talker;

function startTalker() {

    document.getElementById("talkerOutput").innerHTML = "Initializing publisher...\n";

    if (typeof(talker) == "undefined") {
        talker = new Worker("pubsub/talker.js");
    }

    // Setup the connection: Port 1 is for pub
    talker.postMessage({
        command : "connect",
    },[ channel_pub.port1 ]);

    // Setup the connection: Port 2 is for queue
    queue.postMessage({
        command : "connectPub",
    },[ channel_pub.port2 ]);

}

function stopTalker() {
    talker.terminate();
    talker = undefined;
    document.getElementById("talkerOutput").innerHTML += "Publisher terminated.\n\n";
}

function clearTalker() {
    document.getElementById("talkerOutput").innerHTML = "";
}


// SUBSCRIBER
let listener;

function startListener() {

    document.getElementById("listenerOutput").innerHTML = "Initializing subscriber...\n";

    if (typeof(listener) == "undefined") {
        listener = new Worker("pubsub/listener.js");
    }

    // Setup the connection: Port 1 is for queue
    queue.postMessage({
        command : "connectSub",
    },[ channel_sub.port1 ]);

    // Setup the connection: Port 2 is for sub
    listener.postMessage({
        command : "connect",
    },[ channel_sub.port2 ]);

}

function stopListener() {
    listener.terminate();
    listener = undefined;
    document.getElementById("listenerOutput").innerHTML += "Subscriber terminated.\n\n";
}

function clearListener() {
    document.getElementById("listenerOutput").innerHTML = "";
}






