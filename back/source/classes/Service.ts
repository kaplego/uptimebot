import MySql from 'mysql2';
import * as http from 'node:http';
import * as https from 'node:https';
import { DatabaseProviders, type ServiceOption, ServiceOptionType, ServiceState, type ServiceStatus } from '../types';

export default class Service
{
    private readonly _name: string;
    private readonly _host: string;
    private readonly _port: number | null;
    private _isInsecure: boolean;
    private _timeout: number;
    private _options: ServiceOption;

    public get name(): string
    {
        return this._name;
    }

    public get host(): string
    {
        return this._host;
    }

    public get port(): number | null
    {
        return this._port;
    }

    public get isInsecure(): boolean
    {
        return this._isInsecure;
    }

    public set isInsecure(value: boolean)
    {
        this._isInsecure = value;
    }

    public get timeout(): number
    {
        return this._timeout;
    }

    public set timeout(value: number)
    {
        this._timeout = value;
    }

    public get options(): ServiceOption
    {
        return this._options;
    }

    public set options(value: ServiceOption)
    {
        this._options = value;
    }

    constructor(
        name: string,
        host: string,
        options: ServiceOption,
    )
    {
        this._name = name;
        this._host = host;
        this._options = options;
        this._port = options.port ?? null;
        this._isInsecure = options.isInsecure ?? false;
        this._timeout = options.timeout ?? 10_000;
    }

    public async TestConnection(): Promise<ServiceStatus>
    {
        return new Promise<ServiceStatus>((resolve) =>
        {
            let pingStart = Date.now();
            switch (this.options.type)
            {
                case ServiceOptionType.DATABASE:
                    switch (this.options.provider)
                    {
                        case DatabaseProviders.MYSQL:
                        {
                            const mysql = MySql.createConnection({
                                host: this.host,
                                port: this.port ?? 3306,
                                database: this.options.database,
                                user: '',
                                password: '',
                                insecureAuth: this.isInsecure,
                            });
                            mysql.connect((error) =>
                            {
                                if (!error || error.errno == 1045)
                                    resolve({
                                        state: ServiceState.UP,
                                        ping: Date.now() - pingStart,
                                    });
                                else if (error.code === 'ETIMEDOUT')
                                    resolve({
                                        state: ServiceState.DOWN,
                                        ping: null,
                                    });
                                else
                                {
                                    console.error(error);
                                    resolve({
                                        state: ServiceState.ERROR,
                                        ping: Date.now() - pingStart,
                                    });
                                }
                            });
                            break;
                        }
                    }
                    break;
                case ServiceOptionType.HTTP:
                    const req = (this.isInsecure ? http : https).get({
                        host: this.host,
                        port: this.port ?? (this.isInsecure ? 80 : 443),
                        path: this.options.path ?? '/',
                        timeout: this.timeout
                    }, (res) =>
                    {
                        const ping = Date.now() - pingStart;
                        resolve({
                            state: res.statusCode < 400 ? ServiceState.UP : ServiceState.ERROR,
                            ping,
                        });
                    });

                    req.on('error', (error) =>
                    {
                        console.error(error);
                        resolve({
                            state: ServiceState.DOWN,
                            ping: null,
                        });
                    });

                    break;
            }
        });
    }
}