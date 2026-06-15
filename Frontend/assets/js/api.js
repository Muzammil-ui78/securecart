const BASE_URL = "http://localhost:8080";

function getToken() {
    return localStorage.getItem("token");
}

function authHeader() {
    return {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + getToken()
    };
}