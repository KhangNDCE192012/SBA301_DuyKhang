package com.funews.assignment2.service;

import com.funews.assignment2.dto.ApiDtos.TagView;
import com.funews.assignment2.repository.TagRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TagService {

    private final TagRepository tagRepository;

    public TagService(TagRepository tagRepository) {
        this.tagRepository = tagRepository;
    }

    public List<TagView> getAll() {

        return tagRepository.findAll()
                .stream()
                .map(t -> new TagView(
                        t.getTagId(),
                        t.getTagName(),
                        t.getNote()
                ))
                .toList();
    }
}
