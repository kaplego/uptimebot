/**
 * @returns {XMLHttpRequest | null}
 */
function initXHR() {
    /**
     * @type {XMLHttpRequest|null}
     */
    var xhr = null;

    if (window.XMLHttpRequest || window.ActiveXObject) {
        if (window.ActiveXObject) {
            try {
                xhr = new ActiveXObject("Msxml2.XMLHTTP");
            } catch {
                xhr = new ActiveXObject("Microsoft.XMLHTTP");
            }
        } else {
            xhr = new XMLHttpRequest();
        }
    } else {
        alert("Veuillez changer de navigateur. Certaines parties du site s'afficheront pas ou mal.");
        return null;
    }
    return xhr;
}

/**
 * @param {`/${string}`} path
 * @param {Object|null} content
 * @param {(status, result) => void} [callback]
 * @param {{[header: string]: value}} [headers]
 * @returns {Promise<[status, result]|void>}
 */
function ws(path, content, callback, headers) {
    return new Promise((r) => {
        if (content !== null) {
            var strcontent = [];
            Object.keys(content).forEach(c => {
                strcontent.push(`${encodeURIComponent(c)}=${encodeURIComponent(content[c])}`);
            });
            strcontent = strcontent.join('&');
        } else var strcontent = null;

        /**
         * @type {XMLHttpRequest}
         */
        var xhr = initXHR();

        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                if (typeof callback !== 'undefined') {
                    callback(xhr.status, xhr.responseText);
                    r();
                } else r([xhr.status, xhr.responseText]);
            }
        }
        xhr.open("POST", path, true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset-iso-8859-1");
        xhr.send(strcontent);
    });
}

function htmlspecialchars_decode(string, quoteStyle) {
    let optTemp = 0
    let i = 0
    let noquotes = false
    if (typeof quoteStyle === 'undefined') {
        quoteStyle = 2
    }
    string = string.toString()
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
    const OPTS = {
        ENT_NOQUOTES: 0,
        ENT_HTML_QUOTE_SINGLE: 1,
        ENT_HTML_QUOTE_DOUBLE: 2,
        ENT_COMPAT: 2,
        ENT_QUOTES: 3,
        ENT_IGNORE: 4
    }
    if (quoteStyle === 0) {
        noquotes = true
    }
    if (typeof quoteStyle !== 'number') {
        quoteStyle = [].concat(quoteStyle)
        for (i = 0; i < quoteStyle.length; i++) {
            if (OPTS[quoteStyle[i]] === 0) {
                noquotes = true
            } else if (OPTS[quoteStyle[i]]) {
                optTemp = optTemp | OPTS[quoteStyle[i]]
            }
        }
        quoteStyle = optTemp
    }
    if (quoteStyle & OPTS.ENT_HTML_QUOTE_SINGLE) {
        string = string.replace(/&#0*39;/g, "'")
    }
    if (!noquotes) {
        string = string.replace(/&quot;/g, '"')
    }

    string = string.replace(/&amp;/g, '&')
    return string
}