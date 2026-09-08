package br.com.gustavoperini.stocksystem.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import br.com.gustavoperini.stocksystem.dto.PageResponseDto;
import br.com.gustavoperini.stocksystem.dto.ProductDto;
import br.com.gustavoperini.stocksystem.dto.ProductResponseDto;
import br.com.gustavoperini.stocksystem.exception.ResourceNotFoundException;
import br.com.gustavoperini.stocksystem.model.Product;
import br.com.gustavoperini.stocksystem.repository.ProductRepository;
import br.com.gustavoperini.stocksystem.utils.enums.ClotheSize;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductService productService;

    private Product product;
    private ProductDto productDto;

    @BeforeEach
    void setUp() {
        product = new Product();
        product.setId(1L);
        product.setName("Black T-Shirt");
        product.setSize(ClotheSize.M);
        product.setStockQuantity(50);
        product.setUnitPrice(new BigDecimal("79.90"));

        productDto = new ProductDto();
        productDto.setName("Black T-Shirt");
        productDto.setSize(ClotheSize.M);
        productDto.setStockQuantity(50);
        productDto.setUnitPrice(new BigDecimal("79.90"));
    }

    @Test
    @DisplayName("Should successfully create a product")
    void shouldCreateProduct() {
        when(productRepository.save(any(Product.class))).thenReturn(product);

        ProductResponseDto response = productService.createProduct(productDto);

        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("Black T-Shirt", response.getName());
        assertEquals(ClotheSize.M, response.getSize());
        assertEquals(50, response.getStockQuantity());
        assertEquals(new BigDecimal("79.90"), response.getUnitPrice());

        verify(productRepository).save(any(Product.class));
    }

    @Test
    @DisplayName("Should find a product by ID when it exists")
    void shouldFindProductByIdWhenExists() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        ProductResponseDto response = productService.getProductById(1L);

        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("Black T-Shirt", response.getName());
        verify(productRepository).findById(1L);
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException when finding non-existent product")
    void shouldThrowWhenProductNotFound() {
        when(productRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> productService.getProductById(99L));
        verify(productRepository).findById(99L);
    }

    @Test
    @DisplayName("Should list all products with pagination")
    void shouldListAllProducts() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Product> page = new PageImpl<>(List.of(product));
        when(productRepository.findByFilters(null, null, pageable)).thenReturn(page);

        PageResponseDto<ProductResponseDto> responsePage = productService.listAllProducts(null, null, pageable);

        assertNotNull(responsePage);
        assertEquals(1, responsePage.getTotalElements());
        assertEquals("Black T-Shirt", responsePage.getContent().get(0).getName());
        verify(productRepository).findByFilters(null, null, pageable);
    }

    @Test
    @DisplayName("Should successfully update an existing product")
    void shouldUpdateProduct() {
        ProductDto updateDto = new ProductDto();
        updateDto.setName("Updated T-Shirt");
        updateDto.setSize(ClotheSize.G);
        updateDto.setStockQuantity(30);
        updateDto.setUnitPrice(new BigDecimal("89.90"));

        Product updatedProduct = new Product();
        updatedProduct.setId(1L);
        updatedProduct.setName("Updated T-Shirt");
        updatedProduct.setSize(ClotheSize.G);
        updatedProduct.setStockQuantity(30);
        updatedProduct.setUnitPrice(new BigDecimal("89.90"));

        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(productRepository.save(any(Product.class))).thenReturn(updatedProduct);

        ProductResponseDto response = productService.updateProduct(1L, updateDto);

        assertNotNull(response);
        assertEquals("Updated T-Shirt", response.getName());
        assertEquals(ClotheSize.G, response.getSize());
        assertEquals(30, response.getStockQuantity());
        assertEquals(new BigDecimal("89.90"), response.getUnitPrice());

        verify(productRepository).findById(1L);
        verify(productRepository).save(any(Product.class));
    }

    @Test
    @DisplayName("Should delete a product when it exists")
    void shouldDeleteProduct() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        productService.deleteProduct(1L);

        verify(productRepository).findById(1L);
        verify(productRepository).delete(product);
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException when deleting non-existent product")
    void shouldThrowWhenDeletingNonExistentProduct() {
        when(productRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> productService.deleteProduct(99L));
        verify(productRepository).findById(99L);
        verify(productRepository, never()).delete(any());
    }
}
