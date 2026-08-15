package br.com.gustavoperini.stocksystem.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.gustavoperini.stocksystem.model.Product;

public interface ProductRepository extends JpaRepository<Product, Long>{

}
