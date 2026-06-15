package com.securecart.securecart.dto;

import jakarta.validation.constraints.NotNull;

public class OrderDTO {

    @NotNull(message = "User ID is required")
    private Long userId;

    private Double totalAmount;

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }
}