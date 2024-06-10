enum ServiceState
{
    UP,
    DOWN,
    ERROR
}

interface ServiceStatus
{
    state: ServiceState;
    ping: number | null;
}

enum HTTPMethods
{
    GET,
    POST,
    PUT,
    PATCH,
    DELETE
}

enum DatabaseProviders
{
    MYSQL
}

enum ServiceOptionType
{
    HTTP,
    DATABASE
}

interface ServiceOptionBase
{
    type: ServiceOptionType;
    port?: number;
    isInsecure?: boolean;
    timeout?: number;
}

interface ServiceOptionDatabase extends ServiceOptionBase
{
    type: ServiceOptionType.DATABASE;
    provider: DatabaseProviders;
    database: string;
}

interface ServiceOptionHTTP extends ServiceOptionBase
{
    type: ServiceOptionType.HTTP;
    method: HTTPMethods;
    path?: string;
}

type ServiceOption = ServiceOptionDatabase | ServiceOptionHTTP;

export
{
    ServiceState,
    ServiceStatus,
    HTTPMethods,
    DatabaseProviders,
    ServiceOptionType,
    ServiceOption,
};