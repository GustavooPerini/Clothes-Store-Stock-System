package br.com.gustavoperini.stocksystem.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.gustavoperini.stocksystem.model.Sale;

public interface SaleRepository extends JpaRepository<Sale, Long>{

}