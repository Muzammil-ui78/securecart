const PLACEHOLDER_IMAGE_CART = "https://placehold.co/100x100?text=No+Image";

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
    const checkoutBox = document.getElementById("checkoutBox");

    if (items.length === 0) {
        document.getElementById("cart").innerHTML =
            '<div class="empty-state">Your cart is empty.<br><br><a href="products.html">Browse products</a></div>';
        if (checkoutBox) checkoutBox.style.display = "none";
        return;
    }

    let html = "";
    let total = 0;

    items.forEach(i => {
        const img = i.imageUrl ? i.imageUrl : PLACEHOLDER_IMAGE_CART;
        total += i.subtotal || 0;
        html += `
        <div class="cart-item">
            <img src="${img}" alt="${i.productName}" onerror="this.src='${PLACEHOLDER_IMAGE_CART}'">
            <div class="info">
                <p><strong>${i.productName}</strong></p>
                <p>${i.description || ""}</p>
                <p>Price: ₹${(i.price || 0).toLocaleString('en-IN')} x ${i.quantity}</p>
                <p class="price">Subtotal: ₹${(i.subtotal || 0).toLocaleString('en-IN')}</p>
            </div>
            <button onclick="removeItem(${i.id})">Remove</button>
        </div>`;
    });

    document.getElementById("cart").innerHTML = html;

    if (checkoutBox) {
        checkoutBox.style.display = "block";
        document.getElementById("cartTotal").innerHTML =
            `<strong>Total: ₹${total.toLocaleString('en-IN')}</strong>`;
    }
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

async function placeOrderFromCart() {
    const userId = getUserId();

    if (!userId) {
        alert("Please login first");
        window.location.href = "login.html";
        return;
    }

    const address = document.getElementById("address").value.trim();
    const paymentMethod = document.getElementById("paymentMethod").value;

    if (!address) {
        alert("Please enter a delivery address");
        return;
    }

    const res = await fetch(`${BASE_URL}/api/orders`, {
        method: "POST",
        headers: authHeader(),
        body: JSON.stringify({
            userId: parseInt(userId),
            address: address,
            paymentMethod: paymentMethod
        })
    });

    if (res.ok) {
        const order = await res.json();
        alert(`Order placed!\nTotal: ₹${order.totalAmount.toLocaleString('en-IN')}\nPayment: ${order.paymentMethod}\nStatus: ${order.status}`);
        window.location.href = "orders.html";
    } else {
        const err = await res.json();
        alert(err.message || "Failed to place order");
    }
}

if (document.getElementById("cart")) {
    loadCart();
}