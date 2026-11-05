package com.funews.assignment2.service;

import com.funews.assignment2.dto.ApiDtos.TagView;
import com.funews.assignment2.repository.TagRepository;

import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Nguyễn Duy Khang - CE192012 - Assignment 2
 * Class này cung cấp nghiệp vụ truy vấn danh sách Tag cho màn hình tạo/chỉnh sửa bài báo.
 */
@Service
public class TagService {

    private final TagRepository tagRepository;

    public TagService(TagRepository tagRepository) {
        this.tagRepository = tagRepository;
    }

    /**
     * Lấy toàn bộ danh sách Tag có trong hệ thống và chuyển đổi sang TagView DTO.
     */
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
