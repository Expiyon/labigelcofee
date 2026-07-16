package com.labigel.backend.repository;

import com.labigel.backend.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findBySubcategoryIdAndIsActiveTrueOrderByDisplayOrderAsc(Long subcategoryId);
    Optional<Product> findBySlug(String slug);
    List<Product> findByIsFeaturedTrueAndIsActiveTrue();
    List<Product> findByNameContainingIgnoreCaseAndIsActiveTrue(String name);
    long countByIsActiveTrue();
    Page<Product> findAll(Pageable pageable);
}
