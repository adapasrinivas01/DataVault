const form = document.getElementById("signupForm");
const message = document.getElementById("message");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const name =
        document.getElementById("name").value;

    const email =
        document.getElementById("email").value;

    const password =
        document.getElementById("password").value;

    try {

        const response = await fetch(
            "http://localhost:5000/signup",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name,
                    email,
                    password
                })
            }
        );

        const data = await response.json();

        if(response.ok){

            message.style.color = "green";
            message.textContent =
            "Signup Successful!";

            form.reset();

            setTimeout(() => {

                window.location.href =
                "login.html";

            }, 5000);

        }else{

            message.style.color = "red";
            message.textContent =
            data.message;
        }

    }catch(error){

        message.style.color = "red";
        message.textContent =
        "Server Error";
    }
});