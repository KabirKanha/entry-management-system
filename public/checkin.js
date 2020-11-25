const users = firebase.firestore()

let date = new Date();
let uname;
let umail;
let uphone;
let time;
let sms;
let hname;
let hmail;
let hphone;
let timeStr = ~~(date.getTime() / 1000) + "";

//Listen for form submit
document.getElementById("checkinForm").addEventListener("submit", submitForm);

/**
 * Triggered on form submit
 * @param e Event
 */
function submitForm(e) {
    e.preventDefault();
    console.log("Submitting");
    time = getTime();
    console.log(time);

    // Assign data to variables
    uname = getInputVal('visitor-name-1')
        + " " + getInputVal('visitor-name-2') + " " + getInputVal('visitor-name-3');
    hname = getInputVal('host-name-1')
        + " " + getInputVal('host-name-2') + " " + getInputVal('host-name-3');
    umail = getInputVal('visitor-email');
    uphone = getInputVal('visitor-phone');
    hmail = getInputVal('host-email');
    hphone = getInputVal('host-phone');

    let isBlacklisted = users.collection("blacklist").doc(umail);
    isBlacklisted.get().then(function (doc) {
        if (doc.exists) {
            alert('ERROR!\nYou are blacklisted and cannot check-in.');
            window.location.replace("index.html");
        } else {
            let docRef = users.collection("checkedInUsers").doc(umail);
            docRef.get().then(function (doc) {
                if (doc.exists) {
                    alert('ERROR!\nYou are already checked-in.');
                } else {
                    users.collection("checkedInUsers").doc(umail).set({
                        timestamp: timeStr,
                        visitorname: uname,
                        visitoremail: umail,
                        visitorphone: '+91-' + uphone,
                        hostname: hname,
                        hostemail: hmail,
                        hostphone: '+91-' + hphone,
                        checkintime: time
                    })
                        .then(function (docRef) {
                            console.log("Document written with ID: ", docRef);
                            let docArchive = users.collection("visitHistory").doc(timeStr);
                            docArchive.get().then(function (doc1) {
                                if (doc1.exists) {
                                    alert('ERROR!\nUnable to add visit to history.');
                                } else {
                                    users.collection("visitHistory").doc(timeStr).set({
                                        checkindate: date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear(),
                                        visitorname: uname,
                                        visitoremail: umail,
                                        visitorphone: '+91-' + uphone,
                                        hostname: hname,
                                        hostemail: hmail,
                                        hostphone: '+91-' + hphone,
                                        checkintime: time,
                                        checkouttime: "N.A.",
                                        status: "Active",
                                    })
                                        .then(function (docArchive) {
                                            send();
                                            console.log("Visit history added with ID: ", docArchive);
                                            // window.location.replace("index.html");
                                        })
                                        .catch(function (error) {
                                            console.error("Error adding history: ", error);
                                        });
                                }
                            }).catch(function (error) {
                                console.log("Error adding history::", error);
                            });
                            alert("SUCCESS!\nYou have successfully been checked-in.");
                            // window.location.replace("index.html");
                        })
                        .catch(function (error) {
                            console.error("Error adding document: ", error);
                        });
                }
            }).catch(function (error) {
                console.log("Error getting document:", error);
            });
        }
    }).catch(function (error) {
        console.log("Error getting document:", error);
    });

}

/**
 * Sets template parameters and calls the email and SMS sending utilities.
 */
function send() {
    // Email
    let templateParams = {
        uname: uname,
        hname: hname,
        uphone: uphone,
        umail: umail,
        time: time,
        hostemail: hmail,
    };
    sendMail('ems', 'checkin', templateParams);

    // SMS
    sms = "We have just received a new visitor check-in for you. " +
        "\n\tName: " + uname + " " +
        "\n\tEmail ID: " + umail + " " +
        "\n\tPhone: " + uphone + " " +
        "\n\tCheck-In Time: " + time;
    let settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://www.fast2sms.com/dev/bulk?authorization=UgFqr2z44GTR9rcEafN1KYke5VA8Dpl3augEvBS8mYyKGoF4s3gK9wTIecjc&sender_id=SNU&message="
            + sms + "&language=english&route=p&numbers=" + hphone,
        "method": "GET"
    }
    $.ajax(settings).done(function () {
        console.log("SMS sent successfully.");
    })
}


