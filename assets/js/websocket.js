const ws = new WebSocket('ws://localhost:9818');
ws.onopen = async function() {
    ws.onmessage = messageReceive;
    // await new Promise(r => setInterval(() => {
    //     ws.send('uptime');
    // }, 5000));
}

/**
 * @param {{
 *  data: Blob
 * }} message
 */
async function messageReceive(message) {
    var content = typeof message.data === "string" ? message.data : await message.data.text();
    try
    {
        content = JSON.parse(content);
    }
    catch (e) {}

    if (typeof content === "object" && content.type && content.type === "uptime")
    {
        /**
         * @type {{
         *  type: "uptime",
         *  status: UTB.Status,
         *  triggerIn: number,
         *  lastUpdated: number,
         *  stats: Map<string, {
         *      ping: boolean,
         *      time: number | null
         *  }>
         * }}
         */
        var status = content;
        status.stats = objectToMap(status.stats);
        $('#global-s-container').attr('status', status.status);

        $('#global-s-container>#lastupdate>time#lastupdated').attr('timestamp', status.lastUpdated);
        $('#global-s-container>#lastupdate>time#nextupdate').attr('timestamp', Date.now() + status.triggerIn);

        $('#s-container')[0].innerHTML = '';
        status.stats.forEach((service, name) => {
            var statusElement = document.createElement("div");
            statusElement.classList.add('status');
            statusElement.setAttribute('status', service.ping ? service.ping === true ? 'online' : 'offline' : 'unknown');
            statusElement.innerHTML = `<p class="name">${name}</p>
            <p class="time">${service.time === null ? '0' : service.time}ms</p>
            <div class="up"></div>
            <p class="uptext">${service.ping ? service.ping === true ? 'Online' : 'Offline' : 'Unknown'}</p>`;
            $('#s-container')[0].appendChild(statusElement);
        });

        if (status.status === "partial")
            $('#global-s-container>#title').html("Welcome aboard,<br> Some systems are <status>offline</status>.");
        else if (status.status === "unknown")
            $('#global-s-container>#title').html("Welcome aboard,<br> Status is <status>unknown</status>.");
        else
            $('#global-s-container>#title').html(`Welcome aboard,<br> All systems <status>${status.status}</status>.`);
    }
}