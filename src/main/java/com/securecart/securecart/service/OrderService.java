package com.securecart.securecart.service;

import com.securecart.securecart.model.Order;
import com.securecart.securecart.repository.OrderRepository;
import org.springframework.stereotype.Service;
import com.securecart.securecart.exception.ResourceNotFoundException;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public List<Order> getOrdersByUserId(Long userId) {
        return orderRepository.findAll()
                .stream()
                .filter(o -> userId.equals(o.getUserId()))
                .collect(Collectors.toList());
    }

    public Order saveOrder(Order order) {
        return orderRepository.save(order);
    }

    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Order not found"));
    }

    public void deleteOrder(Long id) {

        if (!orderRepository.existsById(id)) {
            throw new ResourceNotFoundException("Order not found");
        }

        orderRepository.deleteById(id);
    }
}