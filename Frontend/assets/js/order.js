const ORDER_STATUS_STEPS = ["PENDING", "SHIPPED", "DELIVERED"];

function statusClass(status) {
    switch (status) {
        case "DELIVERED": return "delivered";
        case "SHIPPED": return "shipped";
        case "CANCELLED": return "cancelled";
        default: return "pending";
    }
}

function renderTracker(status) {
    if (status === "CANCELLED") {
        return `<div class="status-badge cancelled">Order Cancelled</div>`;
    }

    const currentIndex = ORDER_STATUS_STEPS.indexOf(status);

    let html = '<div class="tracker">';
    ORDER_STATUS_STEPS.forEach((step, idx) => {
        const done = idx <= currentIndex ? "done" : "";
        html += `
            <div class="tracker-step ${done}">
                <div class="tracker-dot"></div>
                <span>${step}</span>
            </div>`;
        if (idx < ORDER_STATUS_STEPS.length - 1) {
            html += `<div class="tracker-line ${idx < currentIndex ? "done" : ""}"></div>`;
        }
    });
    html += '</div>';
    return html;
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
        document.getElementById("orders").innerHTML = "<p>Failed to load orders.</p>";
        return;
    }

    const orders = await res.json();

    if (orders.length === 0) {
        document.getElementById("orders").innerHTML =
            '<div class="empty-state">No orders yet.<br><br><a href="products.html">Start shopping</a></div>';
        return;
    }

    orders.sort((a, b) => b.id - a.id);

    let html = "";
    orders.forEach(o => {

        let itemsHtml = "";
        (o.items || []).forEach(it => {
            itemsHtml += `
                <div class="order-product-row">
                    <span>${it.productName}</span>
                    <span>x${it.quantity}</span>
                    <span>₹${(it.price * it.quantity).toLocaleString('en-IN')}</span>
                </div>`;
        });

        const canCancel = (o.status === "PENDING" || o.status === "SHIPPED");

        html += `
        <div class="order-card">
            <div class="order-header">
                <div>
                    <strong>Order #${o.id}</strong>
                    <span class="status-badge ${statusClass(o.status)}">${o.status}</span>
                </div>
                <div class="price">₹${o.totalAmount.toLocaleString('en-IN')}</div>
            </div>

            <div class="order-products">
                ${itemsHtml || "<p>No item details</p>"}
            </div>

            ${renderTracker(o.status)}

            <div class="order-meta">
                <p><strong>Delivery address:</strong> ${o.address || "Not provided"}</p>
                <p><strong>Payment:</strong> ${o.paymentMethod || "COD"}</p>
            </div>

            ${canCancel ? `<button class="cancel-btn" onclick="cancelOrder(${o.id})">Cancel Order</button>` : ""}
        </div>`;
    });

    document.getElementById("orders").innerHTML = html;
}

async function cancelOrder(id) {
    if (!confirm("Are you sure you want to cancel this order?")) return;

    const res = await fetch(`${BASE_URL}/api/orders/${id}/cancel`, {
        method: "PUT",
        headers: authHeader()
    });

    if (res.ok) {
        alert("Order cancelled.");
        loadOrders();
    } else {
        const err = await res.json();
        alert(err.message || "Failed to cancel order.");
    }
}

if (document.getElementById("orders")) {
    loadOrders();
}