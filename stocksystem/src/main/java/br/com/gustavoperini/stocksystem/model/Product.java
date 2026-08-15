package br.com.gustavoperini.stocksystem.model;

import br.com.gustavoperini.stocksystem.utils.enums.ClotheSize;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private ClotheSize size;

    @Column(nullable = false)
    private int stockQuantity;

    @Column(nullable = false)
    private float uniquePrice;

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

    public float getUniquePrice() {
        return uniquePrice;
    }

    public void setUniquePrice(float uniquePrice) {
        this.uniquePrice = uniquePrice;
    }
}
