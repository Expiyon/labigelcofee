package com.labigel.backend.repository;

import com.labigel.backend.entity.Subcategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubcategoryRepository extends JpaRepository<Subcategory, Long> {
    List<Subcategory> findByCategoryIdAndIsActiveTrueOrderByDisplayOrderAsc(Long categoryId);
    Optional<Subcategory> findBySlug(String slug);
}
