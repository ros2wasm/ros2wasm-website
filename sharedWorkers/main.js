// WORKER 1 - PUBLISHER
let pub = new SharedWorker("pub.js");
pub.port.onmessage = function(event) {
    const message = event.data;
}
pub.port.postMessage("IM ALIVE!");


// WORKER 2 - QUEUE
let queue = new SharedWorker("que.js");


// WORKER 3 - SUBSCRIBER
let sub = new SharedWorker("sub.js");


console.log("Hi")

// Connection from publisher to queue
// queue.port.postMessage({pubPort: pub.port}, [pub.port]);