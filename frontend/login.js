const form = document.getElementById("loginForm");
const message = document.getElementById("message");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email =
        document.getElementById("email").value;

    const password =
        document.getElementById("password").value;

    try {

        const response = await fetch(
            "http://localhost:5000/login",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password
                })
            }
        );

        const data = await response.json();

if (response.ok) {

    localStorage.setItem("userId", data.userId);

    message.style.color = "green";
    message.textContent = "Login Successful";

    setTimeout(() => {
        window.location.href = "dashboard.html";
    }, 2000);

} else {

    message.style.color = "red";
    message.textContent = data.message;

}

    } catch(error){

        message.style.color = "red";
        message.textContent =
        "Server Error";
    }
});