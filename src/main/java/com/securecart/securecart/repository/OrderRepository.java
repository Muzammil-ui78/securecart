package com.securecart.securecart.repository;

import com.securecart.securecart.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository
        extends JpaRepository<Order, Long> {
}