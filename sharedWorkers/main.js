// WORKER 1 - PUBLISHER
let pub = new SharedWorker("pub.js");
pub.port.start();

// WORKER 2 - QUEUE
let queue = new SharedWorker("que.js");
queue.port.start();

// WORKER 3 - SUBSCRIBER
let sub = new SharedWorker("sub.js");
sub.port.start();


// Connection from publisher to queue
queue.port.postMessage({pubPort: pub.port}, [pub.port]);