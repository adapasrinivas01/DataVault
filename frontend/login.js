// ===============================
// API URL
// ===============================
const API_URL =
    window.location.hostname === "localhost"
        ? "http://localhost:5000"
        : window.location.origin;

// ===============================
// Form Elements
// ===============================
const form = document.getElementById("loginForm");
const message = document.getElementById("message");

// ===============================
// Login
// ===============================
form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {

        const response = await fetch(`${API_URL}/login`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email,
                password
            })

        });

        const data = await response.json();

        if (response.ok) {

            localStorage.setItem("userId", data.userId);
            localStorage.setItem("userName", data.name);
            localStorage.setItem("userEmail", data.email);

            message.style.color = "green";
            message.textContent = "Login Successful";

            setTimeout(() => {

                window.location.href = "dashboard.html";

            }, 2000);

        } else {

            message.style.color = "red";
            message.textContent = data.message;

        }

    } catch (error) {

        console.error(error);

        message.style.color = "red";
        message.textContent = "Server Error";

    }

});