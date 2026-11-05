package com.funews.assignment2.repository;


import com.funews.assignment2.entity.Tag;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TagRepository
        extends JpaRepository<Tag, Integer> {
}
