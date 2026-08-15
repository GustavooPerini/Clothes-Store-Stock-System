package br.com.gustavoperini.stocksystem.controller;

import java.util.Optional;

import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.gustavoperini.stocksystem.dto.ProductDto;
import br.com.gustavoperini.stocksystem.model.Product;
import br.com.gustavoperini.stocksystem.service.ProductService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/product")
public class ProductController {

    final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @PostMapping("/create")
    public ResponseEntity<Object> createProduct(@RequestBody @Valid ProductDto product) {
        Product productModel = new Product();
        BeanUtils.copyProperties(product, productModel);
        return ResponseEntity.status(HttpStatus.CREATED).body(this.productService.saveProduct(productModel));
    }

    @GetMapping("/list")
    public ResponseEntity<Page<Product>> getAllProducts(@PageableDefault(page = 0, size = 10, sort = "name", direction = Sort.Direction.ASC) Pageable pageable) {
        return ResponseEntity.status(HttpStatus.OK).body(this.productService.listAllProducts(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> getProduct(@PathVariable(value = "id") Long productId) {
        Optional<Product> productOpt = this.productService.getProductById(productId);
        if(productOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product not found");
        }
        return ResponseEntity.status(HttpStatus.OK).body(productOpt.get());
    }
}
