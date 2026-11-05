package com.funews.assignment2.dto;

import jakarta.validation.constraints.*;
import java.util.Set;
import java.util.List;
import java.time.LocalDateTime;

public class ApiDtos {

    public record LoginRequest(
            @NotBlank @Email String email,
            @NotBlank String password
    ) {}

    public record AccountView(
            Short accountId,
            String accountName,
            String accountEmail,
            Integer accountRole
    ) {}

    public record LoginResponse(
            String token,
            AccountView account
    ) {}

    public record AccountRequest(
            @NotBlank
            @Size(max = 100)
            String accountName,

            @NotBlank
            @Email
            @Size(max = 70)
            String accountEmail,

            @NotNull
            @Min(1)
            @Max(2)
            Integer accountRole,

            @Size(max = 70)
            String accountPassword
    ) {}

    public record ProfileRequest(
            @NotBlank
            @Size(max = 100)
            String accountName,

            @NotBlank
            @Email
            @Size(max = 70)
            String accountEmail,

            @Size(max = 70)
            String accountPassword
    ) {}

    public record CategoryRequest(
            @NotBlank
            @Size(max = 100)
            String categoryName,

            @NotBlank
            @Size(max = 250)
            String categoryDescription,

            Short parentCategoryId,

            @NotNull
            Boolean isActive
    ) {}

    public record CategoryView(
            Short categoryId,
            String categoryName,
            String categoryDescription,
            Short parentCategoryId,
            Boolean isActive
    ) {}

    public record TagView(
            Integer tagId,
            String tagName,
            String note
    ) {}

    public record NewsRequest(
            @NotBlank
            @Size(max = 400)
            String newsTitle,

            @NotBlank
            @Size(max = 150)
            String headline,

            @NotBlank
            @Size(max = 4000)
            String newsContent,

            @Size(max = 400)
            String newsSource,

            @NotNull
            Short categoryId,

            @NotNull
            Boolean newsStatus,

            Set<Integer> tagIds
    ) {}

    public record NewsView(
            String newsArticleId,
            String newsTitle,
            String headline,
            LocalDateTime createdDate,
            String newsContent,
            String newsSource,
            Short categoryId,
            String categoryName,
            Boolean newsStatus,
            Short createdById,
            String createdByName,
            LocalDateTime modifiedDate,
            List<TagView> tags
    ) {}
}
