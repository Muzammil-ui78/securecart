function getUserId() {
    return localStorage.getItem("userId");
}

async function addToCart(productId) {
    const userId = getUserId();

    if (!userId) {
        alert("Please login first");
        window.location.href = "login.html";
        return;
    }

    const res = await fetch(`${BASE_URL}/api/cart`, {
        method: "POST",
        headers: authHeader(),
        body: JSON.stringify({
            userId: parseInt(userId),
            productId: productId,
            quantity: 1
        })
    });

    if (res.ok) {
        alert("Added to cart!");
    } else {
        alert("Failed to add to cart. Please login again.");
    }
}

async function loadCart() {
    const userId = getUserId();

    if (!userId) {
        document.getElementById("cart").innerHTML =
            '<div class="empty-state">Please login to view your cart.</div>';
        return;
    }

    const res = await fetch(`${BASE_URL}/api/cart/${userId}`, {
        headers: authHeader()
    });

    if (!res.ok) {
        document.getElementById("cart").innerHTML =
            '<div class="empty-state">Failed to load cart.</div>';
        return;
    }

    const items = await res.json();

    if (items.length === 0) {
        document.getElementById("cart").innerHTML =
            '<div class="empty-state">Your cart is empty. <br><br><a href="products.html">Browse products</a></div>';
        return;
    }

    let html = "";
    items.forEach(i => {
        html += `
        <div class="cart-item">
            <div class="info">
                <p><strong>Product ID:</strong> ${i.productId}</p>
                <p>Quantity: ${i.quantity}</p>
            </div>
            <button onclick="removeItem(${i.id})">Remove</button>
        </div>`;
    });

    document.getElementById("cart").innerHTML = html;
}

async function removeItem(id) {
    const res = await fetch(`${BASE_URL}/api/cart/${id}`, {
        method: "DELETE",
        headers: authHeader()
    });

    if (res.ok) {
        loadCart();
    } else {
        alert("Failed to remove item.");
    }
}

if (document.getElementById("cart")) {
    loadCart();
}