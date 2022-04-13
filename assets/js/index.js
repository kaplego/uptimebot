$(document).ready(() => {
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
        $('#global-s-container>#title>status').text(status);
});