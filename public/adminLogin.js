//Listen for form submit
document.getElementById("adminLoginForm").addEventListener("submit", submitForm);

/**
 * Triggered on form submit
 * @param e Event
 */
function submitForm(e) {
    e.preventDefault();
    console.log("Submitting");
    if (getInputVal('admin-email')==='ems.snu@gmail.com' && getInputVal('admin-password')==='password')
        window.location.replace("adminPanel.html")
    else
        alert("Invalid credentials")
}
