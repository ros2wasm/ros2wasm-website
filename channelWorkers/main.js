let channel_pub = new MessageChannel();
// let channel_sub = new MessageChannel();
let pub = new Worker("pub.js");
let queue = new Worker("queue.js");

// Setup the connection: Port 1 is for pub
pub.postMessage({
    command : "connect",
},[ channel_pub.port1 ]);

// Setup the connection: Port 2 is for queue
queue.postMessage({
    command : "connect",
},[ channel_pub.port2 ]);

pub.postMessage({
    command: "forward",
    message: "a little pub message"
});


let counter = 0;
let publish = setInterval( function() {
    pub.postMessage({
        command: "forward",
        message: "more pub messages " + counter
    });
    counter++;
    if (counter === 10) {
        clearInterval(publish);
    }
}, 500);