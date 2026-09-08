package br.com.gustavoperini.stocksystem.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import br.com.gustavoperini.stocksystem.model.Product;
import br.com.gustavoperini.stocksystem.utils.enums.ClotheSize;

public interface ProductRepository extends JpaRepository<Product, Long>{

    @Query("""
        SELECT p FROM Product p
        WHERE (:name IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%'))) 
        AND (:size IS NULL OR p.size = :size)
    """)
    Page<Product> findByFilters(
        @Param("name") String name,
        @Param("size") ClotheSize size,
        Pageable pageable
    );
}
