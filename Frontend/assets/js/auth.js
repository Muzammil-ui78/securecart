async function registerUser() {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
    });

    if (res.ok) {
        alert("Registered Successfully");
        window.location.href = "login.html";
    } else {
        const err = await res.json();
        alert(err.message || "Registration failed");
    }
}

async function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    if (res.ok) {
        const token = await res.text();
        localStorage.setItem("token", token);

        const meRes = await fetch(`${BASE_URL}/auth/me`, {
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
            }
        });

        if (meRes.ok) {
            const user = await meRes.json();
            localStorage.setItem("userId", user.id);
            localStorage.setItem("userName", user.name);
            localStorage.setItem("userRole", user.role);
        }

        window.location.href = "home.html";
    } else {
        const err = await res.json();
        alert(err.message || "Login failed");
    }
}

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    window.location.href = "login.html";
}