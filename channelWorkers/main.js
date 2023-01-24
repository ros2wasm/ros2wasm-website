let channel_pub = new MessageChannel();
let channel_sub = new MessageChannel();
let pub = new Worker("pub.js");
let queue = new Worker("queue.js");
let sub = new Worker("sub.js");

// Setup the connection: Port 1 is for pub
pub.postMessage({
    command : "connect",
},[ channel_pub.port1 ]);

// Setup the connection: Port 2 is for queue
queue.postMessage({
    command : "connectPub",
},[ channel_pub.port2 ]);

// Setup the connection: Port 1 is for queue
queue.postMessage({
    command : "connectSub",
},[ channel_sub.port1 ]);

// Setup the connection: Port 2 is for sub
sub.postMessage({
    command : "connect",
},[ channel_sub.port2 ]);

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
            console.log("Weird message");
    }
}


let counter = 0;
let full_loop = setInterval( function() {
    pub.postMessage({
        command: "publish",
        message: "more pub messages " + counter
    });

    sub.postMessage({
        command: "subscribe",
        message: "give me something " + counter
    })
    counter++;
    if (counter === 10) {
        clearInterval(full_loop);
    }
}, 500);