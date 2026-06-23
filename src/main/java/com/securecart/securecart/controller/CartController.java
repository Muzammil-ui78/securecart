package com.securecart.securecart.controller;

import com.securecart.securecart.dto.CartItemResponse;
import com.securecart.securecart.model.CartItem;
import com.securecart.securecart.model.Product;
import com.securecart.securecart.service.CartService;
import com.securecart.securecart.service.ProductService;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;
    private final ProductService productService;

    public CartController(CartService cartService, ProductService productService) {
        this.cartService = cartService;
        this.productService = productService;
    }

    @PostMapping
    public CartItem addToCart(@RequestBody CartItem cartItem) {
        return cartService.addToCart(cartItem);
    }

    @GetMapping("/{userId}")
    public List<CartItemResponse> getCart(@PathVariable Long userId) {
        List<CartItem> items = cartService.getCartByUser(userId);
        List<CartItemResponse> response = new ArrayList<>();

        for (CartItem item : items) {
            CartItemResponse dto = new CartItemResponse();
            dto.setId(item.getId());
            dto.setProductId(item.getProductId());
            dto.setQuantity(item.getQuantity());

            try {
                Product product = productService.getProductById(item.getProductId());
                dto.setProductName(product.getName());
                dto.setDescription(product.getDescription());
                dto.setPrice(product.getPrice());
                dto.setImageUrl(product.getImageUrl());
                dto.setSubtotal(product.getPrice() * item.getQuantity());
            } catch (Exception e) {
                dto.setProductName("Product unavailable");
                dto.setPrice(0.0);
                dto.setSubtotal(0.0);
            }

            response.add(dto);
        }

        return response;
    }

    @DeleteMapping("/{id}")
    public String removeItem(@PathVariable Long id) {
        cartService.removeItem(id);
        return "Item Removed";
    }
}