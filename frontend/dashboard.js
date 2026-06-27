// ===============================
// API URL
// ===============================
const API_URL =
    window.location.hostname === "localhost"
        ? "http://localhost:5000"
        : window.location.origin;

// ===============================
// Logged-in User ID
// ===============================
const userId = localStorage.getItem("userId");

// ===============================
// Form Elements
// ===============================
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

const form = document.getElementById("dashboardForm");
const saveStatus = document.getElementById("saveStatus");

// ===============================
// Load Dashboard on Page Load
// ===============================
window.onload = loadDashboard;

// ===============================
// Load Dashboard Data
// ===============================
async function loadDashboard() {

    if (!userId) {
        alert("Please login first.");
        window.location.href = "login.html";
        return;
    }

    try {

        const response = await fetch(`${API_URL}/dashboard/${userId}`);

        if (!response.ok) {
            return;
        }

        const data = await response.json();

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

        console.error("Load Error:", error);

    }

}

// ===============================
// Auto Save
// ===============================
let saveTimeout;

form.addEventListener("input", () => {

    saveStatus.textContent = "Saving...";

    clearTimeout(saveTimeout);

    saveTimeout = setTimeout(() => {

        saveDashboard();

    }, 1000);

});

// ===============================
// Save Dashboard Data
// ===============================
async function saveDashboard() {

    const dashboardData = {

        userId,

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

        const response = await fetch(`${API_URL}/dashboard`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(dashboardData)

        });

        const data = await response.json();

        if (response.ok) {

            saveStatus.textContent = "All changes saved";

        } else {

            saveStatus.textContent = data.message;

        }

    } catch (error) {

        console.error("Save Error:", error);
        saveStatus.textContent = "Unable to save data.";

    }

}