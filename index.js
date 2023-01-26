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
    }
}

// PUBLISHER 
let talker;
let channel_pub;

function startTalker() {

    document.getElementById("talkerOutput").innerHTML = "Initializing publisher...\n";

    channel_pub = new MessageChannel();

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

    channel_pub.port1.close();
    channel_pub.port2.close();
    channel_pub = undefined;

    document.getElementById("talkerOutput").innerHTML += "Publisher terminated.\n\n";
}

function clearTalker() {
    document.getElementById("talkerOutput").innerHTML = "";
}


// SUBSCRIBER
let listener;
let channel_sub;

function startListener() {

    document.getElementById("listenerOutput").innerHTML = "Initializing subscriber...\n";

    channel_sub = new MessageChannel();

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

    channel_sub.port1.close();
    channel_sub.port2.close();
    channel_sub = undefined;
    
    document.getElementById("listenerOutput").innerHTML += "Subscriber terminated.\n\n";
}

function clearListener() {
    document.getElementById("listenerOutput").innerHTML = "";
}
