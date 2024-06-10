import ws from 'ws';
import SocketClient from './classes/SocketClient';
import services from './services';
import { DEBUG } from './utils';

services.reduce<string[]>((acc, s) =>
{
    if (acc.includes(s.name))
        throw new ReferenceError('Services names must be unique.');
    acc.push(s.name);
    return acc;
}, []);

const server = new ws.Server({
    port: 7474,
});

server.on('listening', () =>
{
    console.log('Server listening on port 7474.');
    UpdateAll();
});

let clients: SocketClient[] = [];

server.on('connection', async (socket, req) =>
{
    if (DEBUG)
        console.log(`${req.socket.remoteAddress.padStart(32)} ———> CONNECTED`);

    const client = new SocketClient(socket);
    clients.push(client);

    client.socket.send('ok');

    if (DEBUG)
        console.log(`${req.socket.remoteAddress.padStart(32)} <——— ok`);

    socket.on('close', () =>
    {
        if (DEBUG)
            console.log(`${req.socket.remoteAddress.padStart(32)} ———> DISCONNECTED`);

        clients = clients.filter((c) => c !== client);
    });
});

async function UpdateAll()
{
    const status = {};

    for (const service of services)
    {
        status[service.name] = await service.TestConnection();
        console.log(status[service.name]);
    }

    console.log(status);
}