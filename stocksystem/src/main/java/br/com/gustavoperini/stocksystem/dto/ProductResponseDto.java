package br.com.gustavoperini.stocksystem.dto;

import java.math.BigDecimal;

import br.com.gustavoperini.stocksystem.model.Product;
import br.com.gustavoperini.stocksystem.utils.enums.ClotheSize;

public class ProductResponseDto {

    private Long id;
    private String name;
    private ClotheSize size;
    private int stockQuantity;
    private BigDecimal unitPrice;
    private String imageUrl;

    public ProductResponseDto() {
    }

    public ProductResponseDto(Long id, String name, ClotheSize size, int stockQuantity, BigDecimal unitPrice) {
        this.id = id;
        this.name = name;
        this.size = size;
        this.stockQuantity = stockQuantity;
        this.unitPrice = unitPrice;
    }

    public static ProductResponseDto fromEntity(Product product) {
        ProductResponseDto dto = new ProductResponseDto(
                product.getId(),
                product.getName(),
                product.getSize(),
                product.getStockQuantity(),
                product.getUnitPrice()
        );
        dto.setImageUrl(product.getImageUrl());
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public ClotheSize getSize() {
        return size;
    }

    public void setSize(ClotheSize size) {
        this.size = size;
    }

    public int getStockQuantity() {
        return stockQuantity;
    }

    public void setStockQuantity(int stockQuantity) {
        this.stockQuantity = stockQuantity;
    }

    public BigDecimal getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(BigDecimal unitPrice) {
        this.unitPrice = unitPrice;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}