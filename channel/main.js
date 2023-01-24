let channel = new MessageChannel();
let worker1 = new Worker("worker1.js");
let worker2 = new Worker("worker2.js");

// Setup the connection: Port 1 is for worker 1
worker1.postMessage({
    command : "connect",
},[ channel.port1 ]);

// Setup the connection: Port 2 is for worker 2
worker2.postMessage({
    command : "connect",
},[ channel.port2 ]);

worker1.postMessage({
    command: "forward",
    message: "[W1] Forward to worker 2"
});