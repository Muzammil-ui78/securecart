const BASE_URL = "https://securecart-production.up.railway.app";

function getToken() {
    return localStorage.getItem("token");
}

function authHeader() {
    return {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + getToken()
    };
}