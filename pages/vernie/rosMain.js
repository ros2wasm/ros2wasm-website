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
let publisher = null;
  
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
            let gidIndex = topicMap[event.data.topic].participants.indexOf(event.data.gid);

            // TODO: fix
            // Remove from topic map
            // topicMap[event.data.topic].participants.splice(gidIndex, 1);

            // if (topicMap[event.data.topic].participants.length == 0) {
            //     delete topicMap[event.data.topic];
            // }

            break;

        case "publish":
            topicMap[event.data.topic].messages.push(event.data.message);
            let ledColor = event.data.message.substr("data: ".length);
            // Send message to Vernie
            colorLed(ledColor);
            document.getElementById("ledCircle").setAttribute("fill", ledColor);
            // document.getElementById("talkerOutput").innerHTML += ledColor + "\n";
            break;

        case "console":
            let rawMessage = event.data.message;
            // Remove end chars
            let msg = rawMessage.substr(4, rawMessage.length - 8);
            let talkerOutput = document.getElementById("talkerOutput");
            talkerOutput.scrollTop = talkerOutput.scrollHeight;
            talkerOutput.innerHTML += msg + "\n";
            break;
    }
}


// PUBLISHER 

function startPublisher() {

    document.getElementById("talkerOutput").innerHTML += "Initializing...\n";

    if (publisher === null) {
        publisher = new Worker("/rosWorkers/rainbow.js");
    }

    publisher.onmessage = onMessageFromWorker;
}

function stopPublisher() {
    publisher.terminate();
    publisher = null;
    let talkerOutput = document.getElementById("talkerOutput");
    talkerOutput.scrollTop = talkerOutput.scrollHeight;
    talkerOutput.innerHTML += "Terminated.\n\n";
}

function clearPublisher() {
    document.getElementById("talkerOutput").innerHTML = "";
}

function happyVernie() {
    document.getElementById("vernie").setAttribute("src", "/images/vernie_happy.svg");
}

function angryVernie() {
    document.getElementById("vernie").setAttribute("src", "/images/vernie_angry.svg")
}
