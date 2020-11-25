const users = firebase.firestore();

let uname;
let uphone;
let umail;
let checkintime;
let checkouttime;
let hname;
let address = "Shiv Nadar University, NH91, Tehsil Dadri, Greater Noida, Uttar Pradesh, 201314";
let timeStr;

//Listen for form submit
document.getElementById("checkoutForm").addEventListener("submit", submitForm);

/**
 * Triggered on form submit
 * @param e Event
 */
function submitForm(e) {
    e.preventDefault();
    console.log("Submitting");
    checkouttime = getTime();
    console.log(checkouttime);
    umail = getInputVal('visitor-email');

    let docRef = users.collection("checkedInUsers").doc(umail);
    docRef.get().then(function (doc) {
        if (doc.exists) {
            let data = doc.data();
            uname = data.visitorname;
            console.log(uname)
            uphone = data.visitorphone;
            checkintime = data.checkintime;
            hname = data.hostname;
            timeStr = data.timestamp;
            console.log(timeStr);
            users.collection("checkedInUsers").doc(umail).delete().then(function () {
                alert("SUCCESS!\nYou have successfully been checked out.");

                let docArchive = users.collection("visitHistory").doc(timeStr);
                docArchive.get().then(function (doc1) {
                    if (doc1.exists) {
                        users.collection("visitHistory").doc(timeStr).update({
                            checkouttime: checkouttime,
                            status: "Inactive",
                        })
                            .then(function (docRef) {
                                console.log("Visit history updated with ID: ", docArchive);
                                send();
                                // window.location.replace("index.html");
                            })
                            .catch(function (error) {
                                console.error("Error adding history: ", error);
                            });
                    } else {
                        alert('ERROR!\nUnable to update visit to history.');
                    }
                }).catch(function (error) {
                    console.log("Error adding history::", error);
                });
            }).catch(function (error) {
                console.log("Error getting document:", error);
            });
        } else {
            alert("ERROR!\nThere seems to be no active check-in with this email ID.");
        }
    }).catch(function (error) {
        console.log("Error getting document:", error);
    });
}

/**
 * Sets template parameters and calls the email sending utility.
 */
function send() {
    console.log(uname)
    let templateParams = {
        uname: uname,
        uphone: uphone,
        checkintime: checkintime,
        checkouttime: checkouttime,
        hname: hname,
        address: address,
        visitoremail: getInputVal('visitor-email'),
    };
    sendMail('ems', 'checkout', templateParams);
}
