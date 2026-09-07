package br.com.gustavoperini.stocksystem.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import br.com.gustavoperini.stocksystem.dto.PageResponseDto;
import br.com.gustavoperini.stocksystem.dto.ProductDto;
import br.com.gustavoperini.stocksystem.dto.ProductResponseDto;
import br.com.gustavoperini.stocksystem.exception.ResourceNotFoundException;
import br.com.gustavoperini.stocksystem.model.Product;
import br.com.gustavoperini.stocksystem.repository.ProductRepository;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final FileStorageService fileStorageService;

    public ProductService(ProductRepository productRepository, FileStorageService fileStorageService) {
        this.productRepository = productRepository;
        this.fileStorageService = fileStorageService;
    }

    @Transactional
    public ProductResponseDto createProduct(ProductDto productDto) {
        Product product = new Product();
        product.setName(productDto.getName());
        product.setSize(productDto.getSize());
        product.setStockQuantity(productDto.getStockQuantity());
        product.setUnitPrice(productDto.getUnitPrice());

        Product savedProduct = this.productRepository.save(product);
        return ProductResponseDto.fromEntity(savedProduct);
    }

    @Transactional(readOnly = true)
    public PageResponseDto<ProductResponseDto> listAllProducts(Pageable pageable) {
        Page<ProductResponseDto> productPage = this.productRepository.findAll(pageable)
                .map(ProductResponseDto::fromEntity);
        return PageResponseDto.fromPage(productPage);
    }

    @Transactional(readOnly = true)
    public ProductResponseDto getProductById(Long productId) {
        Product product = this.productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product with ID " + productId + " not found"));
        return ProductResponseDto.fromEntity(product);
    }

    @Transactional
    public ProductResponseDto updateProduct(Long productId, ProductDto productDto) {
        Product existingProduct = this.productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product with ID " + productId + " not found"));

        existingProduct.setName(productDto.getName());
        existingProduct.setSize(productDto.getSize());
        existingProduct.setStockQuantity(productDto.getStockQuantity());
        existingProduct.setUnitPrice(productDto.getUnitPrice());

        Product updatedProduct = this.productRepository.save(existingProduct);
        return ProductResponseDto.fromEntity(updatedProduct);
    }

    @Transactional
    public void deleteProduct(Long productId) {
        Product product = this.productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product with ID " + productId + " not found"));

        if(product.getImageUrl() != null) {
            String oldFilename = product.getImageUrl().replace("/uploads/products/", "");
            fileStorageService.deleteFile(oldFilename);
        }

        this.productRepository.delete(product);
    }

    @Transactional
    public ProductResponseDto uploadProductImage(Long productId, MultipartFile file) {
        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new ResourceNotFoundException("Product with ID " + productId + " not found"));

        if(product.getImageUrl() != null) {
            String oldFilename = product.getImageUrl().replace("/uploads/products/", "");
            fileStorageService.deleteFile(oldFilename);
        }

        String filename = fileStorageService.saveFile(file);

        product.setImageUrl("/uploads/products/" + filename);
        Product savedProduct = this.productRepository.save(product);

        return  ProductResponseDto.fromEntity(savedProduct);
    }
}