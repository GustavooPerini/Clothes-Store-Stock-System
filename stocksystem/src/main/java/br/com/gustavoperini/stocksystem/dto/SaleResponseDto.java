package br.com.gustavoperini.stocksystem.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import br.com.gustavoperini.stocksystem.model.Sale;

public class SaleResponseDto {
    private Long id;
    private Long productId;
    private String productName;
    private int quantity;
    private BigDecimal unitPrice;
    private BigDecimal totalAmount;
    private LocalDateTime saleDate;
    private String imageUrl;

    public SaleResponseDto() {
        
    }

    public SaleResponseDto(Long id, Long productId, String productName, int quantity, BigDecimal unitPrice,
            BigDecimal totalAmount, LocalDateTime saleDate, String imageUrl) {
        this.id = id;
        this.productId = productId;
        this.productName = productName;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.totalAmount = totalAmount;
        this.saleDate = saleDate;
        this.imageUrl = imageUrl;
    }

    public static SaleResponseDto fromEntity(Sale sale) {
        return new SaleResponseDto(
            sale.getId(),
            sale.getProduct().getId(),
            sale.getProduct().getName(),
            sale.getQuantity(),
            sale.getUnitPrice(),
            sale.getTotalAmount(),
            sale.getSaleDate(),
            sale.getProduct().getImageUrl()
        );
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(BigDecimal unitPrice) {
        this.unitPrice = unitPrice;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public LocalDateTime getSaleDate() {
        return saleDate;
    }

    public void setSaleDate(LocalDateTime saleDate) {
        this.saleDate = saleDate;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    
}
