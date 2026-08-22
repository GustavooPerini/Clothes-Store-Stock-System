package br.com.gustavoperini.stocksystem.controller;

import java.math.BigDecimal;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import br.com.gustavoperini.stocksystem.dto.PageResponseDto;
import br.com.gustavoperini.stocksystem.dto.ProductDto;
import br.com.gustavoperini.stocksystem.dto.ProductResponseDto;
import br.com.gustavoperini.stocksystem.exception.GlobalExceptionHandler;
import br.com.gustavoperini.stocksystem.exception.ResourceNotFoundException;
import br.com.gustavoperini.stocksystem.service.ProductService;
import br.com.gustavoperini.stocksystem.utils.enums.ClotheSize;

@ExtendWith(MockitoExtension.class)
class ProductControllerTest {

    private MockMvc mockMvc;

    @Mock
    private ProductService productService;

    @InjectMocks
    private ProductController productController;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(productController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .setCustomArgumentResolvers(new PageableHandlerMethodArgumentResolver())
                .build();
    }

    @Test
    @DisplayName("POST /api/products - Should create product and return 201 CREATED")
    void shouldCreateProduct() throws Exception {
        ProductResponseDto response = new ProductResponseDto(1L, "Blue Jeans", ClotheSize.M, 20, new BigDecimal("129.90"));
        when(productService.createProduct(any(ProductDto.class))).thenReturn(response);

        String jsonRequest = """
                {
                    "name": "Blue Jeans",
                    "size": "M",
                    "stockQuantity": 20,
                    "unitPrice": 129.90
                }
                """;

        mockMvc.perform(post("/api/products")
                .contentType(MediaType.APPLICATION_JSON)
                .content(jsonRequest))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Blue Jeans"))
                .andExpect(jsonPath("$.size").value("M"))
                .andExpect(jsonPath("$.stockQuantity").value(20))
                .andExpect(jsonPath("$.unitPrice").value(129.90));

        verify(productService).createProduct(any(ProductDto.class));
    }

    @Test
    @DisplayName("POST /api/products - Should return 400 BAD REQUEST on invalid input")
    void shouldReturnBadRequestOnInvalidInput() throws Exception {
        String jsonRequest = """
                {
                    "name": "",
                    "stockQuantity": -5,
                    "unitPrice": -10.0
                }
                """;

        mockMvc.perform(post("/api/products")
                .contentType(MediaType.APPLICATION_JSON)
                .content(jsonRequest))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.errors.name").exists())
                .andExpect(jsonPath("$.errors.size").exists());
    }

    @Test
    @DisplayName("GET /api/products - Should return 200 OK with paginated products")
    void shouldGetAllProducts() throws Exception {
        ProductResponseDto response = new ProductResponseDto(1L, "Blue Jeans", ClotheSize.M, 20, new BigDecimal("129.90"));
        PageResponseDto<ProductResponseDto> pageResponse = new PageResponseDto<>(List.of(response), 0, 10, 1, 1, true);
        when(productService.listAllProducts(any(Pageable.class))).thenReturn(pageResponse);

        mockMvc.perform(get("/api/products"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].name").value("Blue Jeans"))
                .andExpect(jsonPath("$.totalElements").value(1));

        verify(productService).listAllProducts(any(Pageable.class));
    }

    @Test
    @DisplayName("GET /api/products/{id} - Should return 200 OK when found")
    void shouldGetProductById() throws Exception {
        ProductResponseDto response = new ProductResponseDto(1L, "Blue Jeans", ClotheSize.M, 20, new BigDecimal("129.90"));
        when(productService.getProductById(1L)).thenReturn(response);

        mockMvc.perform(get("/api/products/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Blue Jeans"));

        verify(productService).getProductById(1L);
    }

    @Test
    @DisplayName("GET /api/products/{id} - Should return 404 NOT FOUND when not found")
    void shouldReturnNotFoundWhenProductDoesNotExist() throws Exception {
        when(productService.getProductById(99L)).thenThrow(new ResourceNotFoundException("Product with ID 99 not found"));

        mockMvc.perform(get("/api/products/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.message").value("Product with ID 99 not found"));

        verify(productService).getProductById(99L);
    }

    @Test
    @DisplayName("PUT /api/products/{id} - Should update and return 200 OK")
    void shouldUpdateProduct() throws Exception {
        ProductResponseDto response = new ProductResponseDto(1L, "Updated Jeans", ClotheSize.G, 15, new BigDecimal("139.90"));
        when(productService.updateProduct(eq(1L), any(ProductDto.class))).thenReturn(response);

        String jsonRequest = """
                {
                    "name": "Updated Jeans",
                    "size": "G",
                    "stockQuantity": 15,
                    "unitPrice": 139.90
                }
                """;

        mockMvc.perform(put("/api/products/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(jsonRequest))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Updated Jeans"))
                .andExpect(jsonPath("$.size").value("G"));

        verify(productService).updateProduct(eq(1L), any(ProductDto.class));
    }

    @Test
    @DisplayName("DELETE /api/products/{id} - Should delete and return 204 NO CONTENT")
    void shouldDeleteProduct() throws Exception {
        doNothing().when(productService).deleteProduct(1L);

        mockMvc.perform(delete("/api/products/1"))
                .andExpect(status().isNoContent());

        verify(productService).deleteProduct(1L);
    }

    @Test
    @DisplayName("DELETE /api/products/{id} - Should return 404 NOT FOUND when deleting missing product")
    void shouldReturnNotFoundWhenDeletingMissingProduct() throws Exception {
        doThrow(new ResourceNotFoundException("Product with ID 99 not found")).when(productService).deleteProduct(99L);

        mockMvc.perform(delete("/api/products/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404));

        verify(productService).deleteProduct(99L);
    }
}
