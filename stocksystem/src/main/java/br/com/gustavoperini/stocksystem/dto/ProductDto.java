package br.com.gustavoperini.stocksystem.dto;

import br.com.gustavoperini.stocksystem.utils.enums.ClotheSize;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class ProductDto{
    
    @NotBlank(message = "name can not be blank")
    @Size(max = 256)
    private String name;

    @NotBlank(message = "it is mandatory to give a size")
    private ClotheSize size;

    @Min(0)
    private int stockQuantity;

    @Min(0)
    private float uniquePrice;

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

    public float getUniquePrice() {
        return uniquePrice;
    }

    public void setUniquePrice(float uniquePrice) {
        this.uniquePrice = uniquePrice;
    }

}
