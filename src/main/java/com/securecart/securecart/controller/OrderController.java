package com.securecart.securecart.controller;

import com.securecart.securecart.dto.OrderDTO;
import com.securecart.securecart.model.CartItem;
import com.securecart.securecart.model.Order;
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

        if (userId != null) {
            return orderService.getOrdersByUserId(userId);
        }

        return orderService.getAllOrders();
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

        Order savedOrder = orderService.saveOrder(order);

        for (CartItem item : cartItems) {
            cartService.removeItem(item.getId());
        }

        return savedOrder;
    }

    @GetMapping("/{id}")
    public Order getOrderById(@PathVariable Long id) {
        return orderService.getOrderById(id);
    }

    @DeleteMapping("/{id}")
    public String deleteOrder(@PathVariable Long id) {
        orderService.deleteOrder(id);
        return "Order Deleted Successfully";
    }
}