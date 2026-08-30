package br.com.gustavoperini.stocksystem.dto;

import java.math.BigDecimal;

import br.com.gustavoperini.stocksystem.utils.enums.ClotheSize;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class ProductDto {

    @NotBlank(message = "Name cannot be blank")
    @Size(max = 256, message = "Name must not exceed 256 characters")
    private String name;

    @NotNull(message = "Size is mandatory")
    private ClotheSize size;

    @NotNull(message = "Stock Quantity is mandatory")
    @Min(value = 0, message = "Stock quantity cannot be negative")
    private int stockQuantity;

    @NotNull(message = "Unit price is mandatory")
    @DecimalMin(value = "0.0", inclusive = true, message = "Unit price cannot be negative")
    private BigDecimal unitPrice;

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
}
