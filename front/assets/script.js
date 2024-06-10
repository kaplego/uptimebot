const socket = new WebSocket("ws://localhost:7474");

socket.addEventListener("message", (ev) => {
    console.log(ev);
});