package com.funews.assignment2.repository;



import com.funews.assignment2.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CategoryRepository
        extends JpaRepository<Category, Short> {

    List<Category>
    findByCategoryNameContainingIgnoreCaseOrCategoryDescriptionContainingIgnoreCase(
            String name, String description
    );

    boolean existsByParentCategoryId(Short parentId);
}
