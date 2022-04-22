$(document).ready(async() => {
    const availableStatus = [
        "online",
        "partial",
        "offline",
        "unknown"
    ]

    var status = $('#global-s-container').attr("status");

    if (!availableStatus.includes(status)) {
        $('#global-s-container').attr("status", "online");
        status = "online";
    }

    if (status === "partial")
        $('#global-s-container>#title').html("Welcome aboard,<br> Some systems are <status>offline</status>.");
    else if (status === "unknown")
        $('#global-s-container>#title').html("Welcome aboard,<br> Status is <status>unknown</status>.");
    else
        $('#global-s-container>#title').html(`Welcome aboard,<br> All systems <status>${status}</status>.`);

    checkTime();
});

function checkTime()
{
    const timeTypes = [
        't',
        'T',
        'd',
        'D',
        'f',
        'F',
        'R'
    ]
    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ]
    const weekdays = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thurstay",
        "Friday",
        "Saturday",
        "Sunday"
    ]
    $('time').each(i => {
        /**
         * @type {HTMLElement}
         */
        let el = $('time')[i];
        if (el.hasAttribute('timestamp'))
        {
            if (el.hasAttribute('type') && timeTypes.includes(el.getAttribute('type'))) var type = el.getAttribute('type');
            else var type = "f";
            var date = new Date(Number(el.getAttribute('timestamp')));
            var inner = '';

            if (type === 't')
                inner = `${zeroPadding(date.getHours())}:${zeroPadding(date.getMinutes())}`;

            else if (type === 'T')
                inner = `${zeroPadding(date.getHours())}:${zeroPadding(date.getMinutes())}:${zeroPadding(date.getSeconds())}`;

            else if (type === 'd')
                inner = `${zeroPadding(date.getDate())}/${zeroPadding(date.getMonth()+1)}/${date.getFullYear()}`;

            else if (type === 'D')
                inner = `${zeroPadding(date.getDate())} ${months[date.getMonth()]} ${date.getFullYear()}`;

            else if (type === 'f')
                inner = `${zeroPadding(date.getDate())} ${months[date.getMonth()]} ${date.getFullYear()} ${zeroPadding(date.getHours())}:${zeroPadding(date.getMinutes())}`;

            else if (type === 'F')
                inner = `${weekdays[date.getDay()]}, ${zeroPadding(date.getDate())} ${months[date.getMonth()]} ${date.getFullYear()} ${zeroPadding(date.getHours())}:${zeroPadding(date.getMinutes())}`;

            else if (type === 'R')
                inner = timeDifference(Date.now(), Date.parse(date));

            if (inner !== el.innerText) el.innerText = inner;
        }
    });
    var now = new Date();
    setTimeout(checkTime, 1000 - now.getMilliseconds());
}