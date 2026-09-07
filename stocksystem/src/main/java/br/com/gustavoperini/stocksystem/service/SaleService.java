package br.com.gustavoperini.stocksystem.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import br.com.gustavoperini.stocksystem.dto.PageResponseDto;
import br.com.gustavoperini.stocksystem.dto.SaleRequestDto;
import br.com.gustavoperini.stocksystem.dto.SaleResponseDto;
import br.com.gustavoperini.stocksystem.exception.InsufficientStockException;
import br.com.gustavoperini.stocksystem.exception.ResourceNotFoundException;
import br.com.gustavoperini.stocksystem.model.Product;
import br.com.gustavoperini.stocksystem.model.Sale;
import br.com.gustavoperini.stocksystem.repository.ProductRepository;
import br.com.gustavoperini.stocksystem.repository.SaleRepository;
import jakarta.transaction.Transactional;

@Service
public class SaleService {

    private final SaleRepository saleRepository;
    private final ProductRepository productRepository;
    
    public SaleService(SaleRepository saleRepository, ProductRepository productRepository) {
        this.saleRepository = saleRepository;
        this.productRepository = productRepository;
    }

    @Transactional 
    public SaleResponseDto sellProduct(SaleRequestDto dto) {

        Product product = productRepository.findById(dto.getProductId())
            .orElseThrow(() -> new ResourceNotFoundException("Product with ID " + dto.getProductId() + " not found"));

        if(product.getStockQuantity() < dto.getQuantity()) {
            throw new InsufficientStockException(
                "Insufficient Stock for product '" + product.getName() +
                "'. Available: " + product.getStockQuantity() +
                ", Requested: " + dto.getQuantity()
            );
        }

        // Calculating the total
        BigDecimal unitPrice = product.getUnitPrice();
        BigDecimal totalAmount = unitPrice.multiply(BigDecimal.valueOf(dto.getQuantity()));

        // Deducing stock
        product.setStockQuantity(product.getStockQuantity() - dto.getQuantity());
        productRepository.save(product);

        // Creating a sale
        Sale sale = new Sale();
        sale.setQuantity(dto.getQuantity());
        sale.setUnitPrice(unitPrice);
        sale.setTotalAmount(totalAmount);
        sale.setSaleDate(LocalDateTime.now());
        sale.setProduct(product);

        Sale savedSale = saleRepository.save(sale);
        return SaleResponseDto.fromEntity(savedSale);
    }

    @Transactional
    public PageResponseDto<SaleResponseDto> listSales(Pageable pageable) {
        Page<SaleResponseDto> salesPage = saleRepository.findAll(pageable)
            .map(SaleResponseDto::fromEntity);
        return PageResponseDto.fromPage(salesPage);
    }
}
