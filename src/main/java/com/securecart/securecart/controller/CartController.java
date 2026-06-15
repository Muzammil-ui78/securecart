package com.securecart.securecart.controller;

import com.securecart.securecart.model.CartItem;
import com.securecart.securecart.service.CartService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @PostMapping
    public CartItem addToCart(
            @RequestBody CartItem cartItem) {

        return cartService.addToCart(cartItem);
    }

    @GetMapping("/{userId}")
    public List<CartItem> getCart(
            @PathVariable Long userId) {

        return cartService.getCartByUser(userId);
    }

    @DeleteMapping("/{id}")
    public String removeItem(
            @PathVariable Long id) {

        cartService.removeItem(id);

        return "Item Removed";
    }
}