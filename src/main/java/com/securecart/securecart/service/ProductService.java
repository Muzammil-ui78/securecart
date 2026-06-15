package com.securecart.securecart.service;

import com.securecart.securecart.model.Product;
import com.securecart.securecart.repository.ProductRepository;
import org.springframework.stereotype.Service;
import com.securecart.securecart.exception.ResourceNotFoundException;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public List<Product> searchProducts(String search,
                                        Double minPrice,
                                        Double maxPrice) {

        List<Product> products = productRepository.findAll();

        if (search != null && !search.isEmpty()) {
            String keyword = search.toLowerCase();
            products = products.stream()
                    .filter(p ->
                            p.getName().toLowerCase().contains(keyword) ||
                                    p.getDescription().toLowerCase().contains(keyword)
                    )
                    .collect(Collectors.toList());
        }

        if (minPrice != null) {
            products = products.stream()
                    .filter(p -> p.getPrice() >= minPrice)
                    .collect(Collectors.toList());
        }

        if (maxPrice != null) {
            products = products.stream()
                    .filter(p -> p.getPrice() <= maxPrice)
                    .collect(Collectors.toList());
        }

        return products;
    }

    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Product not found"));
    }

    public Product updateProduct(Long id, Product product) {

        Product existing = productRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Product not found"));

        existing.setName(product.getName());
        existing.setDescription(product.getDescription());
        existing.setPrice(product.getPrice());
        existing.setStock(product.getStock());
        existing.setImageUrl(product.getImageUrl());

        return productRepository.save(existing);
    }

    public void deleteProduct(Long id) {

        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Product not found");
        }

        productRepository.deleteById(id);
    }
}