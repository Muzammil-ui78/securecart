package com.securecart.securecart.repository;

import com.securecart.securecart.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CartRepository
        extends JpaRepository<CartItem, Long> {

    List<CartItem> findByUserId(Long userId);
}