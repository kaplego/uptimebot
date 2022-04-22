export declare type Status = "online"|"offline"|"partial"|"unknown";

export function objectToMap(o: object) {
    const keys: Array<keyof typeof this.o> = Object.keys(o);
    const map: Map<keyof typeof this.o, typeof this.o[keyof typeof this.o]> = new Map();
    for (let i = 0; i < keys.length; i++) {
        map.set(keys[i], o[keys[i]]);
    };
    return map;
}