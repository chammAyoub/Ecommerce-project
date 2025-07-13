package com.chammakh.Ecommerce_project.service;

import com.chammakh.Ecommerce_project.model.Product;
import com.chammakh.Ecommerce_project.repository.ProductRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductRepo repository;

    public List<Product> getAllProducts(){
        return repository.findAll();
    }


}
