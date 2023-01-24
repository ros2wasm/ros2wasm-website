// SUBSCRIBER

let listener;

function startListener() {

    document.getElementById("listenerOutput").innerHTML = "Initializing subscriber...\n";

    if (typeof(listener) == "undefined") {
        listener = new Worker("pubsub/listener.js");
    }

}

function stopListener() {
    listener.terminate();
    listener = undefined;
    document.getElementById("listenerOutput").innerHTML += "Subscriber terminated.\n\n";
}

function clearListener() {
    document.getElementById("listenerOutput").innerHTML = "";
}


// PUBLISHER 

let publisher;

function startTalker() {

    document.getElementById("talkerOutput").innerHTML = "Initializing publisher...\n";

    if (typeof(publisher) == "undefined") {
        publisher = new Worker("pubsub/talker.js");
    }

}

function stopTalker() {
    publisher.terminate();
    publisher = undefined;
    document.getElementById("talkerOutput").innerHTML += "Publisher terminated.\n\n";
}

function clearTalker() {
    document.getElementById("talkerOutput").innerHTML = "";
}



