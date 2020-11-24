/**
 * Shortens document.getElementById
 * @param id    id of the form element
 * @returns {*} content stored in that field
 */
function getInputVal(id) {
    return document.getElementById(id).value;
}

/**
 * Returns the current time in a suitable format
 * @returns {string} the time string, as required
 */
function getTime() {
    let currentTime = new Date();
    let hours = currentTime.getHours();
    let minutes = currentTime.getMinutes();
    let seconds = currentTime.getSeconds();
    let am_pm;

    if (hours >= 12) {
        hours -= 12;
        am_pm = "PM";
    } else
        am_pm = "AM";
    if (hours === 0)
        hours = 12;

    if (hours < 10)
        hours = "0" + hours;
    if (minutes < 10)
        minutes = "0" + minutes;
    if (seconds < 10)
        seconds = "0" + seconds;

    time = hours + ":" + minutes + ":" + seconds + " " + am_pm;
    return time;
}

/**
 * Sends an email using EmailJS
 * @param service_id        The service ID to be used
 * @param template_id       The template to be used
 * @param template_params   The template parameters to replace the placeholders
 */
function sendMail(service_id, template_id, template_params) {
    console.log("Sending Email")
//     emailjs.send(service_id, template_id, template_params)
//         .then(function (response) {
//             console.log('SUCCESS!', response.status, response.text);
//         }, function (error) {
//             console.log('FAILED...', error);
//         })
}
