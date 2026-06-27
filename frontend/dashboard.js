
// Logged-in User ID
const userId = localStorage.getItem("userId");

// Form Elements
const fullName = document.getElementById("fullName");
const dob = document.getElementById("dob");
const bloodGroup = document.getElementById("bloodGroup");
const permanentAddress = document.getElementById("permanentAddress");
const pinCode = document.getElementById("pinCode");

const aadhaarNumber = document.getElementById("aadhaarNumber");
const panNumber = document.getElementById("panNumber");
const accountNumber = document.getElementById("accountNumber");
const voterId = document.getElementById("voterId");
const drivingLicence = document.getElementById("drivingLicence");

// Load Dashboard Data
window.onload = loadDashboard;

const form = document.getElementById("dashboardForm");
const saveStatus = document.getElementById("saveStatus");

let saveTimeout;
form.addEventListener("input",()=>{
    saveStatus.textContent = "Saving....";
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(()=>{
        saveDashboard();
    },1000);
})

async function loadDashboard() {

    if (!userId) {
        alert("Please login first.");
        window.location.href = "login.html";
        return;
    }

    try {

        const response = await fetch(
            `http://localhost:5000/dashboard/${userId}`
        );

        if (!response.ok) return;

        const data = await response.json();

        // Fill Form
        fullName.value = data.fullName || "";
        dob.value = data.dob || "";
        bloodGroup.value = data.bloodGroup || "";
        permanentAddress.value = data.permanentAddress || "";
        pinCode.value = data.pinCode || "";
        aadhaarNumber.value = data.aadhaarNumber || "";
        panNumber.value = data.panNumber || "";
        accountNumber.value = data.bankAccountNumber || "";
        voterId.value = data.voterIdNumber || "";
        drivingLicence.value = data.drivingLicenceNumber || "";

    } catch (error) {

        console.log("Error:", error);

    }
}

/* ===================================
   SAVE DASHBOARD DATA
=================================== */



async function saveDashboard() {

    const dashboardData = {

        userId: userId,

        fullName: fullName.value,
        dob: dob.value,
        bloodGroup: bloodGroup.value,
        permanentAddress: permanentAddress.value,
        pinCode: pinCode.value,

        aadhaarNumber: aadhaarNumber.value,
        panNumber: panNumber.value,
        bankAccountNumber: accountNumber.value,
        voterIdNumber: voterId.value,
        drivingLicenceNumber: drivingLicence.value

    };

    try {

        const response = await fetch(
            "http://localhost:5000/dashboard",
            {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(dashboardData)

            }
        );

        const data = await response.json();

        if (response.ok) {
            saveStatus.textContent = "All changes saved";
        }

    } catch (error) {

        console.log(error);
        alert("Unable to save data.");

    }

}
