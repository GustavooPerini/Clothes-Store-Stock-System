package br.com.gustavoperini.stocksystem.service;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import br.com.gustavoperini.stocksystem.model.Product;
import br.com.gustavoperini.stocksystem.repository.ProductRepository;

@Service
public class ProductService {

    final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public Product saveProduct(Product productModel) {
        return this.productRepository.save(productModel);
    }

    public Page<Product> listAllProducts(Pageable pageable) {
        return this.productRepository.findAll(pageable);
    }

    public Optional<Product> getProductById(Long productId) {
        return this.productRepository.findById(productId);
    }
}
