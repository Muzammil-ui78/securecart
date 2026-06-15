async function placeOrder() {
    const userId = localStorage.getItem("userId");

    if (!userId) {
        alert("Please login first");
        window.location.href = "login.html";
        return;
    }

    const res = await fetch(`${BASE_URL}/api/orders`, {
        method: "POST",
        headers: authHeader(),
        body: JSON.stringify({
            userId: parseInt(userId)
        })
    });

    if (res.ok) {
        const order = await res.json();
        alert(`Order placed! Total: ₹${order.totalAmount.toLocaleString('en-IN')} | Status: ${order.status}`);
        loadOrders();
    } else {
        const err = await res.json();
        alert(err.message || "Failed to place order");
    }
}

async function loadOrders() {
    const userId = localStorage.getItem("userId");

    if (!userId) {
        document.getElementById("orders").innerHTML =
            '<div class="empty-state">Please login to view orders.</div>';
        return;
    }

    const res = await fetch(`${BASE_URL}/api/orders?userId=${userId}`, {
        headers: authHeader()
    });

    if (!res.ok) {
        document.getElementById("orders").innerHTML =
            '<div class="empty-state">Failed to load orders.</div>';
        return;
    }

    const orders = await res.json();

    if (orders.length === 0) {
        document.getElementById("orders").innerHTML =
            '<div class="empty-state">No orders yet. <br><br><a href="products.html">Start shopping</a></div>';
        return;
    }

    let html = "";
    orders.forEach(o => {
        html += `
        <div class="order-item">
            <div class="info">
                <p><strong>Order #${o.id}</strong></p>
                <p>Amount: ₹${o.totalAmount.toLocaleString('en-IN')}</p>
            </div>
            <span class="status-badge pending">${o.status}</span>
        </div>`;
    });

    document.getElementById("orders").innerHTML = html;
}

if (document.getElementById("orders")) {
    loadOrders();
}