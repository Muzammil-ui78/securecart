package com.securecart.securecart.service;

import com.securecart.securecart.model.CartItem;
import com.securecart.securecart.repository.CartRepository;
import org.springframework.stereotype.Service;
import com.securecart.securecart.exception.ResourceNotFoundException;
import java.util.List;

@Service
public class CartService {

    private final CartRepository cartRepository;

    public CartService(CartRepository cartRepository) {
        this.cartRepository = cartRepository;
    }

    public CartItem addToCart(CartItem cartItem) {
        return cartRepository.save(cartItem);
    }

    public List<CartItem> getCartByUser(Long userId) {
        return cartRepository.findByUserId(userId);
    }

    public void removeItem(Long id) {

        if (!cartRepository.existsById(id)) {
            throw new ResourceNotFoundException("Cart item not found");
        }

        cartRepository.deleteById(id);
    }
}