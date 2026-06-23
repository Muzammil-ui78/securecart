package com.securecart.securecart.controller;

import com.securecart.securecart.dto.OrderDTO;
import com.securecart.securecart.model.CartItem;
import com.securecart.securecart.model.Order;
import com.securecart.securecart.model.OrderItem;
import com.securecart.securecart.model.Product;
import com.securecart.securecart.service.CartService;
import com.securecart.securecart.service.OrderService;
import com.securecart.securecart.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;
    private final CartService cartService;
    private final ProductService productService;

    public OrderController(OrderService orderService,
                           CartService cartService,
                           ProductService productService) {
        this.orderService = orderService;
        this.cartService = cartService;
        this.productService = productService;
    }

    @GetMapping
    public List<Order> getAllOrders(@RequestParam(required = false) Long userId) {
        List<Order> orders;
        if (userId != null) {
            orders = orderService.getOrdersByUserId(userId);
        } else {
            orders = orderService.getAllOrders();
        }
        for (Order order : orders) {
            order.setItems(orderService.getItemsByOrderId(order.getId()));
        }
        return orders;
    }

    @PostMapping
    public Order createOrder(@Valid @RequestBody OrderDTO orderDTO) {
        List<CartItem> cartItems = cartService.getCartByUser(orderDTO.getUserId());

        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty. Add products before placing order.");
        }

        double total = 0;
        for (CartItem item : cartItems) {
            Product product = productService.getProductById(item.getProductId());
            total += product.getPrice() * item.getQuantity();
        }

        Order order = new Order();
        order.setUserId(orderDTO.getUserId());
        order.setTotalAmount(total);
        order.setStatus("PENDING");
        order.setAddress(orderDTO.getAddress());
        order.setPaymentMethod(orderDTO.getPaymentMethod() != null ? orderDTO.getPaymentMethod() : "COD");

        Order savedOrder = orderService.saveOrder(order);

        for (CartItem item : cartItems) {
            Product product = productService.getProductById(item.getProductId());
            OrderItem orderItem = new OrderItem();
            orderItem.setOrderId(savedOrder.getId());
            orderItem.setProductId(product.getId());
            orderItem.setProductName(product.getName());
            orderItem.setPrice(product.getPrice());
            orderItem.setQuantity(item.getQuantity());
            orderService.saveOrderItem(orderItem);
        }

        for (CartItem item : cartItems) {
            cartService.removeItem(item.getId());
        }

        savedOrder.setItems(orderService.getItemsByOrderId(savedOrder.getId()));
        return savedOrder;
    }

    @GetMapping("/{id}")
    public Order getOrderById(@PathVariable Long id) {
        Order order = orderService.getOrderById(id);
        order.setItems(orderService.getItemsByOrderId(order.getId()));
        return order;
    }

    @PutMapping("/{id}/status")
    public Order updateStatus(@PathVariable Long id, @RequestBody StatusUpdateRequest request) {
        Order order = orderService.getOrderById(id);
        order.setStatus(request.getStatus());
        return orderService.saveOrder(order);
    }

    @PutMapping("/{id}/cancel")
    public Order cancelOrder(@PathVariable Long id) {
        Order order = orderService.getOrderById(id);
        if ("DELIVERED".equalsIgnoreCase(order.getStatus())) {
            throw new RuntimeException("Delivered orders cannot be cancelled.");
        }
        order.setStatus("CANCELLED");
        return orderService.saveOrder(order);
    }

    @DeleteMapping("/{id}")
    public String deleteOrder(@PathVariable Long id) {
        orderService.deleteOrder(id);
        return "Order Deleted Successfully";
    }

    public static class StatusUpdateRequest {
        private String status;
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }
}