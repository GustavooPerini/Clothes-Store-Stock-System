package br.com.gustavoperini.stocksystem.controller;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.gustavoperini.stocksystem.dto.PageResponseDto;
import br.com.gustavoperini.stocksystem.dto.SaleRequestDto;
import br.com.gustavoperini.stocksystem.dto.SaleResponseDto;
import br.com.gustavoperini.stocksystem.service.SaleService;
import jakarta.validation.Valid;

@RestController 
@RequestMapping("/api/sales")
public class SaleController {

    private final SaleService saleService;

    public SaleController(SaleService saleService) {
        this.saleService = saleService;
    }

    @PostMapping
    public ResponseEntity<SaleResponseDto> sellProduct(@RequestBody @Valid SaleRequestDto dto) {
        SaleResponseDto response = saleService.sellProduct(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<PageResponseDto<SaleResponseDto>> getAllSales(
        @PageableDefault(page = 0, size = 5, sort = "saleDate", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.status(HttpStatus.OK).body(saleService.listSales(pageable));
    }
}
