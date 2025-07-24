package com.paolasama.product.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.paolasama.product.entities.Product;

@RestController
@RequestMapping("/api/products")
public class ProjectApi {
    private List<Product> productsList = new ArrayList<>();
@GetMapping
    public List<Product> getProducts() {
        return productsList;
    }
@PostMapping
    public Product addProduct(Product product) {
        productsList.add(product);
        return product;
    }
}
