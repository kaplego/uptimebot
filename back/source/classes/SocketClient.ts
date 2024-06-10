import type ws from "ws";

export default class SocketClient
{
    public get failCount(): number
    {
        return this._failCount;
    }

    public get socket()
    {
        return this._socket;
    }

    private readonly _socket: ws;
    private _failCount: number = 0;

    constructor(socket: ws)
    {
        this._socket = socket;
        this.Update();
    }

    public Update(): boolean
    {
        return true;
    }
}