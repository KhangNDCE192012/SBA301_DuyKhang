
package com.funews.assignment2.service;

import com.funews.assignment2.dto.ApiDtos.*;
import com.funews.assignment2.entity.*;
import com.funews.assignment2.repository.*;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class NewsArticleService {

    private final NewsArticleRepository newsRepository;
    private final CategoryRepository categoryRepository;
    private final TagRepository tagRepository;

    public NewsArticleService(
            NewsArticleRepository newsRepository,
            CategoryRepository categoryRepository,
            TagRepository tagRepository
    ) {
        this.newsRepository = newsRepository;
        this.categoryRepository = categoryRepository;
        this.tagRepository = tagRepository;
    }

    // CONVERT ENTITY TO DTO

    private NewsView toView(NewsArticle n) {

        List<TagView> tags = n.getTags()
                .stream()
                .map(t -> new TagView(
                        t.getTagId(),
                        t.getTagName(),
                        t.getNote()
                ))
                .toList();

        return new NewsView(
                n.getNewsArticleId(),
                n.getNewsTitle(),
                n.getHeadline(),
                n.getCreatedDate(),
                n.getNewsContent(),
                n.getNewsSource(),
                n.getCategory() == null
                        ? null : n.getCategory().getCategoryId(),
                n.getCategory() == null
                        ? null : n.getCategory().getCategoryName(),
                n.getNewsStatus(),
                n.getCreatedBy() == null
                        ? null : n.getCreatedBy().getAccountId(),
                n.getCreatedBy() == null
                        ? null : n.getCreatedBy().getAccountName(),
                n.getModifiedDate(),
                tags
        );
    }

    // GET ALL NEWS ARTICLES

    @Transactional(readOnly = true)
    public List<NewsView> getAll(
            String search,
            Short categoryId,
            Boolean activeOnly,
            SystemAccount currentUser
    ) {

        // PUBLIC USER AND ADMIN:
        // Only view active news articles

        boolean publicUser =
                currentUser == null ||
                        Integer.valueOf(1).equals(
                                currentUser.getAccountRole()
                        );

        // Only Staff can access management data

        if (currentUser != null &&
                !publicUser &&
                !Integer.valueOf(2).equals(
                        currentUser.getAccountRole()
                )) {

            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Invalid role"
            );
        }

        // Public users and Admin always see active news.
        // Staff can see all news when activeOnly is false.

        boolean onlyActive =
                publicUser || Boolean.TRUE.equals(activeOnly);

        String keyword =
                search == null || search.isBlank()
                        ? null : search.trim();

        return newsRepository.searchArticles(
                        keyword,
                        categoryId,
                        onlyActive,
                        null
                )
                .stream()
                .map(this::toView)
                .toList();
    }

    // GET NEWS ARTICLE BY ID

    @Transactional(readOnly = true)
    public NewsView getById(
            String id,
            SystemAccount currentUser
    ) {

        NewsArticle article = newsRepository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "News article not found"
                        )
                );

        // Public users and Admin cannot view inactive news.

        if ((currentUser == null ||
                Integer.valueOf(1).equals(
                        currentUser.getAccountRole()
                ))
                && !Boolean.TRUE.equals(
                article.getNewsStatus()
        )) {

            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "News article not found"
            );
        }

        return toView(article);
    }

    // STAFF: CREATE NEWS ARTICLE

    @Transactional
    public NewsView create(
            NewsRequest request,
            SystemAccount currentUser
    ) {

        Category category = categoryRepository.findById(
                request.categoryId()
        ).orElseThrow(() ->
                new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Category does not exist"
                )
        );

        NewsArticle article = new NewsArticle();

        article.setNewsArticleId(
                "N" + UUID.randomUUID()
                        .toString()
                        .replace("-", "")
                        .substring(0, 19)
        );

        article.setNewsTitle(request.newsTitle());
        article.setHeadline(request.headline());
        article.setNewsContent(request.newsContent());
        article.setNewsSource(request.newsSource());
        article.setCategory(category);
        article.setNewsStatus(request.newsStatus());

        article.setCreatedDate(LocalDateTime.now());
        article.setCreatedBy(currentUser);
        article.setUpdatedById(currentUser.getAccountId());

        article.setTags(getTags(request.tagIds()));

        return toView(newsRepository.save(article));
    }

    // STAFF: UPDATE NEWS ARTICLE

    @Transactional
    public NewsView update(
            String id,
            NewsRequest request,
            SystemAccount currentUser
    ) {

        NewsArticle article = newsRepository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "News article not found"
                        )
                );

        Category category = categoryRepository.findById(
                request.categoryId()
        ).orElseThrow(() ->
                new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Category does not exist"
                )
        );

        article.setNewsTitle(request.newsTitle());
        article.setHeadline(request.headline());
        article.setNewsContent(request.newsContent());
        article.setNewsSource(request.newsSource());
        article.setCategory(category);
        article.setNewsStatus(request.newsStatus());

        article.setUpdatedById(currentUser.getAccountId());
        article.setModifiedDate(LocalDateTime.now());

        article.setTags(getTags(request.tagIds()));

        return toView(newsRepository.save(article));
    }

    // GET TAGS

    private Set<Tag> getTags(Set<Integer> tagIds) {

        if (tagIds == null || tagIds.isEmpty()) {
            return new HashSet<>();
        }

        List<Tag> found = tagRepository.findAllById(tagIds);

        if (found.size() != tagIds.size()) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "One or more tags do not exist"
            );
        }

        return new HashSet<>(found);
    }

    // STAFF: DELETE NEWS ARTICLE

    @Transactional
    public void delete(String id) {

        NewsArticle article = newsRepository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "News article not found"
                        )
                );

        article.getTags().clear();

        newsRepository.delete(article);
    }

    // STAFF: VIEW OWN NEWS HISTORY

    @Transactional(readOnly = true)
    public List<NewsView> getMyHistory(
            SystemAccount currentUser
    ) {

        return newsRepository
                .findByCreatedBy_AccountIdOrderByCreatedDateDesc(
                        currentUser.getAccountId()
                )
                .stream()
                .map(this::toView)
                .toList();
    }
}
