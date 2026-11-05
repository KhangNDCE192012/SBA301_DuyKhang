package com.funews.assignment2.service;

import com.funews.assignment2.dto.ApiDtos.*;
import com.funews.assignment2.entity.Category;
import com.funews.assignment2.repository.CategoryRepository;
import com.funews.assignment2.repository.NewsArticleRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final NewsArticleRepository newsRepository;

    public CategoryService(
            CategoryRepository categoryRepository,
            NewsArticleRepository newsRepository
    ) {
        this.categoryRepository = categoryRepository;
        this.newsRepository = newsRepository;
    }

    private CategoryView toView(Category c) {

        return new CategoryView(
                c.getCategoryId(),
                c.getCategoryName(),
                c.getCategoryDescription(),
                c.getParentCategoryId(),
                c.getIsActive()
        );
    }

    public List<CategoryView> getAll(
            String search,
            boolean activeOnly
    ) {

        List<Category> categories;

        if (search == null || search.isBlank()) {
            categories = categoryRepository.findAll();
        } else {
            categories = categoryRepository
                    .findByCategoryNameContainingIgnoreCaseOrCategoryDescriptionContainingIgnoreCase(
                            search, search
                    );
        }

        return categories.stream()
                .filter(c -> !activeOnly ||
                        Boolean.TRUE.equals(c.getIsActive()))
                .map(this::toView)
                .toList();
    }

    @Transactional
    public CategoryView create(CategoryRequest request) {

        validateParent(request.parentCategoryId(), null);

        Category category = new Category();

        category.setCategoryName(request.categoryName());
        category.setCategoryDescription(
                request.categoryDescription()
        );
        category.setParentCategoryId(request.parentCategoryId());
        category.setIsActive(request.isActive());

        return toView(categoryRepository.save(category));
    }

    @Transactional
    public CategoryView update(
            Short id,
            CategoryRequest request
    ) {

        Category category = categoryRepository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Category not found"
                        )
                );

        validateParent(request.parentCategoryId(), id);

        category.setCategoryName(request.categoryName());
        category.setCategoryDescription(
                request.categoryDescription()
        );
        category.setParentCategoryId(request.parentCategoryId());
        category.setIsActive(request.isActive());

        return toView(categoryRepository.save(category));
    }

    private void validateParent(Short parentId, Short currentId) {

        if (parentId == null) {
            return;
        }

        if (parentId.equals(currentId)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Category cannot be its own parent"
            );
        }

        if (!categoryRepository.existsById(parentId)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Parent category does not exist"
            );
        }
    }

    @Transactional
    public void delete(Short id) {

        Category category = categoryRepository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Category not found"
                        )
                );

        if (newsRepository.existsByCategory_CategoryId(id)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Cannot delete category used by news articles"
            );
        }

        if (categoryRepository.existsByParentCategoryId(id)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Cannot delete category that has child categories"
            );
        }

        categoryRepository.delete(category);
    }
}
