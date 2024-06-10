import Service from './classes/Service';
import { DatabaseProviders, HTTPMethods, ServiceOptionType } from './types';

const services: Service[] = [
    new Service(
        'Database',
        'clwxydcjair55xn0.chr7pe7iynqr.eu-west-1.rds.amazonaws.com',
        {
            type: ServiceOptionType.DATABASE as const,
            provider: DatabaseProviders.MYSQL,
            database: 'u0q6us3qv7si8ehn',
        },
    ),
    new Service(
        'new.frsf.xyz',
        'new.frsf.xyz',
        {
            type: ServiceOptionType.HTTP as const,
            method: HTTPMethods.GET,
            timeout: 5_000,
        },
    ),
    new Service(
        'Test',
        'gebzjbfezkbfjk.com',
        {
            type: ServiceOptionType.HTTP as const,
            method: HTTPMethods.GET,
            timeout: 5_000,
        },
    ),
];

export default services;