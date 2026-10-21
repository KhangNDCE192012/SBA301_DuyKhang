package fu.se.lab6.responses;

import java.util.Date;

public record UserResponse(
        Integer id,
        String fullName,
        String email,
        Date createdAt,
        Date updatedAt
) {
}
