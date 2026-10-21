package fu.se.lab6.responses;

public record LoginResponse(
        String token,
        long expiresIn
) {
}
