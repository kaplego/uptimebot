/**
 * @typedef {import("../websocket/main").Status} UTB.Status
 */
/**
 * @param {(value: any, index: number, array: Array) => Promise<void> | void} cb
 */
Array.prototype.asyncForEach = async function(cb) {
    for (i = 0; i < this.length; i++) {
        await cb(this[i], i, this);
    }
}

const colors = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    dim: "\x1b[2m",
    underscore: "\x1b[4m",
    blink: "\x1b[5m",
    reverse: "\x1b[7m",
    hidden: "\x1b[8m",

    black: "\x1b[30m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    white: "\x1b[37m",

    bgBlack: "\x1b[40m",
    bgRed: "\x1b[41m",
    bgGreen: "\x1b[42m",
    bgYellow: "\x1b[43m",
    bgBlue: "\x1b[44m",
    bgMagenta: "\x1b[45m",
    bgCyan: "\x1b[46m",
    bgWhite: "\x1b[47m"

}

/**
 * @param {string} message 
 * @param {...(string|number|boolean|JSON|Array|Object)} suppArgs
 */
function debug(message, ...suppArgs) {
    console.debug(`%c${message}`, `color: yellow`, ...suppArgs);
}

/**
 * @param {string} message 
 * @param {...(string|number|boolean|JSON|Array|Object)} suppArgs
 */
function error(message, ...suppArgs) {
    console.debug(`%c${message}`, `color: red`, ...suppArgs);
}

/**
 * @param {string} message 
 * @param {...(string|number|boolean|JSON|Array|Object)} suppArgs
 */
function critical(message, ...suppArgs) {
    console.debug(`%c${message}`, `color: white;background-color: red`, ...suppArgs);
}

/**
 * @param {string} message 
 * @param {...(string|number|boolean|JSON|Array|Object)} suppArgs
 */
function success(message, ...suppArgs) {
    console.debug(`%c${message}`, `color: lime`, ...suppArgs);
}

/**
 * @param {number} current
 * @param {number} previous
 * @returns {string}
 */
function timeDifference(current, previous)
{
    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    if (current >= previous)
    {
        var elapsed = current - previous;
        var prefix = '';
        var suffix = ' ago';
    }
    else
    {
        var elapsed = previous - current;
        var prefix = 'in ';
        var suffix = '';
    }

    if (elapsed < msPerMinute)
        return `${prefix}${Math.round(elapsed / 1000)} second${Math.round(elapsed / 1000) > 1 ? 's' : ''}${suffix}`;

    else if (elapsed < msPerHour)
        return `${prefix}${Math.round(elapsed / msPerMinute)} minute${Math.round(elapsed / msPerMinute) > 1 ? 's' : ''}${suffix}`;

    else if (elapsed < msPerDay)
        return `${prefix}${Math.round(elapsed / msPerHour)} hour${Math.round(elapsed / msPerHour) > 1 ? 's' : ''}${suffix}`;

    else if (elapsed < msPerMonth)
        return `${prefix}${Math.round(elapsed / msPerDay)} day${Math.round(elapsed / msPerDay) > 1 ? 's' : ''}${suffix}`;

    else if (elapsed < msPerYear)
        return `${prefix}${Math.round(elapsed / msPerMonth)} month${Math.round(elapsed / msPerMonth) > 1 ? 's' : ''}${suffix}`;

    else
        return `${prefix}${Math.round(elapsed / msPerYear)} year${Math.round(elapsed / msPerYear) > 1 ? 's' : ''}${suffix}`;
}

/**
 * @param {number} number
 * @param {number} [zeroCount]
 * @return {string}
 */
function zeroPadding(number, zeroCount = 2)
{
    var zeros = '';
    for (let i = 0; i <= zeroCount; i++)
    {
        zeros += '0';
    }
    return (zeros + `${number}`).substr(-zeroCount);
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