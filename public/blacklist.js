const users = firebase.firestore();

let name;
let mail;
let reason;

//Listen for form submit
document.getElementById("blacklistForm").addEventListener("submit", submitForm);

/**
 * Triggered on form submit
 * @param e Event
 */
function submitForm(e) {
    e.preventDefault();
    console.log("Submitting");
    name = getInputVal('blacklist-name')
    mail = getInputVal('blacklist-email')
    reason = getInputVal('blacklist-reason')

    let docRef = users.collection("blacklist").doc(mail);
    docRef.get().then(function (doc) {
        if (doc.exists) {
            alert('ERROR!\nThis user is already blacklisted.');
        } else {
            users.collection("blacklist").doc(mail).set({
                name: name,
                email: mail,
                reason: reason
            })
                .then(function (docRef) {
                    console.log("Document written with ID: ", docRef);
                    alert("SUCCESS!\nUser has successfully been blacklisted.");
                    send();
                })
                .catch(function (error) {
                    console.error("Error adding document: ", error);
                });
        }
    }).catch(function (error) {
        console.log("Error getting document:", error);
    });
}

/**
 * Sets template parameters and calls the email sending utility.
 */
function send() {
    let templateParams = {
        name: name,
        email: mail,
        reason: reason,
    };
    sendMail('ems', 'blacklist', templateParams);
}
