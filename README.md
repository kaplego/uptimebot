# Uptime Bot
UpTimeBot is a website template for a status page.

## Installation

### Install Uptime Bot
You can install Uptime Bot by clicking the "Code" green button and downloading the ZIP file.
Then you can extract it in the folder you want.

**You have to move the assets/websocket folder to another place, not accessible by the website.**

### Install Node.JS
Go to the [Node.js Website](https://nodejs.org/en/), and click on the current version.

Open the installed file and follow the instructions.

## Setup
Now you need to setup your services. 
Go to the websocket directory, then open index.js
Go to the line 115. You can find this:
```js
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
```
You can edit this template service, and customize it as you want, and duplicate it for all the services you need.

## Start websocket
If you have properly installed Node.JS, you can now start the websocket. Go to the folder you moved before, and open the commands terminal. Write `node index` and press Enter. Now your websocket is successfully online.
