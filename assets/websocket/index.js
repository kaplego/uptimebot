/**
 * @typedef {import("./main").Status} UTB.Status
 */
const https = require("https");
const http = require("http");
const MySql = require("mysql");

/**
 * @param {(value: string, index: number, array: string[]) => Promise<void> | void} callbackfn 
 */
Array.prototype.asyncForEach = async(callbackfn) => {
    for (let i = 0; i < this.length; i++)
    {
        await callbackfn(this[i], i, this);
    }
}

/**
 * @param {object} o 
 * @returns {Map<any, any>}
 */
function objectToMap(o) {
    const keys = Object.keys(o);
    const map = new Map();
    for (let i = 0; i < keys.length; i++) {
        map.set(keys[i], o[keys[i]]);
    };
    return map;
}

/**
 * @param {https.RequestOptions} options
 * @returns {Promise<{
 *  ping: boolean,
 *  time: number | null
 * }>}
 */
function ping(options)
{
    return new Promise(async(r, e) => {
        if ((options.port == 3306 && (!options.database || options.database === true)) || options.database === true)
        {
            let before = Date.now();
            const msql = MySql.createConnection({
                host: options.host,
                port: 3306
            });
            msql.connect(e => {
                if (e.errno == "1045") r({
                    ping: true,
                    time: Date.now() - before
                });
                else r({
                    ping: true,
                    time: null
                });
            });
        }
        else if (options.http && options.http === true)
        {
            let before = Date.now();
            var oareq = http.request(options, (oares) => {
                let responsetime = Date.now() - before;
                if (oares.statusCode === 200) r({
                    ping: true,
                    time: responsetime
                });
                else r({
                    ping: false,
                    time: null
                });
            });

            oareq.on('error', error => {
                e(error);
            });
            oareq.end();
        }
        else
        {
            let before = Date.now();
            var oareq = https.request(options, (oares) => {
                let responsetime = Date.now() - before;
                if (oares.statusCode === 200) r({
                    ping: true,
                    time: responsetime
                });
                else r({
                    ping: false,
                    time: null
                });
            });

            oareq.on('error', error => {
                e(error);
            });
            oareq.end();
        }
    });
}

/**
 * @type {{
 *  [name: string]: {
 *      method: "GET" | "POST",
 *      host: string,
 *      path?: string,
 *      port?: number,
 *      database?: boolean,
 *      http?: boolean,
 *      timeout: number
 *  }
 * }}
 */
const services = {
    "Service": { // The name will be displayed on the page
        method: "GET", // Make a {method} request // Use GET if you don't known
        host: "255.255.255.255", // Ip, or domain name // Ex. 127.0.0.1, www.example.com, sub.domain.example.com
        path: "/test", // Make request at this path
        port: 80, // Make request at this port
        database: false, // ONLY MYSQL DATABASE FOR NOW // Set at false if you are using port 3306 and it is not a database // Set at true if you want to fetch a database and the port is not 3306
        http: true, // Wheter to use HTTP or HTTPS // Do not specify if you are fetching a database
        timeout: 10 // Returns offline is the server does not answer after X seconds
    }
}

/*
 * ===========================
 * ======== WEBSOCKET ========
 * ===========================
 */
const WebSocket = require('ws');
const server = new WebSocket.Server({
    port: 9818
});

var sockets = [];

const updateEvery = 60000;

var triggered = Date.now();
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
var lastUpdate = {
    type: "uptime",
    status: "unknown",
    triggerIn: 0,
    lastUpdated: Date.now(),
    stats: new Map()
}
trigger();
setInterval(trigger, updateEvery);

server.on('connection', async function(socket) {
    sockets.push(socket);

    var tempUpdate = {...lastUpdate
    };
    tempUpdate.triggerIn = (updateEvery + 1000) - (Date.now() - triggered);
    tempUpdate.stats = Object.fromEntries(tempUpdate.stats);
    socket.send(JSON.stringify(tempUpdate));
    delete tempUpdate;

    socket.on('close', function() {
        sockets = sockets.filter(s => s !== socket);
    });
});

async function trigger()
{
    triggered = Date.now();
    var up = await checkServices(services);
    var vals = Object.values(up);
    var status = 'unknown';

    if (vals.filter(v => v.ping === true).length === vals.length) status = "online";
    else if (vals.filter(v => v.ping === false).length === vals.length) status = "offline";
    else status = "partial";

    lastUpdate.status = status;
    lastUpdate.triggerIn = (updateEvery + 1000) - (Date.now() - triggered);
    lastUpdate.lastUpdated = Date.now();
    lastUpdate.stats = up;

    sockets.forEach(socket => socket.send(JSON.stringify(lastUpdate)));
    lastUpdate.stats = objectToMap(lastUpdate.stats);

    //let d = new Date();
    //setTimeout(trigger, (updateEvery - d.getMinutes()) * 1000 - d.getMilliseconds());
}

/**
 * @param {{
 *  [name: string]: https.RequestOptions
 * }} services
 * @returns {Promise<{[name: string]: {
 *  ping: boolean,
 *  time: number | null
 * }}>}
 */
async function checkServices(services)
{
    var res = {};

    for (s of Object.keys(services))
    {
        var on = await ping(services[s]).catch(e => {
            throw e;
        });
        res[s] = on;
    }
    return res;
}