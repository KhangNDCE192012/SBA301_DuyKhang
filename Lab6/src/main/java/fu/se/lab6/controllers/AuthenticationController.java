
package fu.se.lab6.controllers;

import fu.se.lab6.dtos.LoginUserDto;
import fu.se.lab6.dtos.RegisterUserDto;
import fu.se.lab6.entities.User;
import fu.se.lab6.responses.LoginResponse;
import fu.se.lab6.responses.UserResponse;
import fu.se.lab6.services.AuthenticationService;
import fu.se.lab6.services.JwtService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthenticationController {

    private final JwtService jwtService;
    private final AuthenticationService authenticationService;

    public AuthenticationController(
            JwtService jwtService,
            AuthenticationService authenticationService) {

        this.jwtService = jwtService;
        this.authenticationService = authenticationService;
    }

    @PostMapping("/signup")
    public ResponseEntity<UserResponse> register(
            @Valid @RequestBody RegisterUserDto dto) {

        User user = authenticationService.signup(dto);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(toResponse(user));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> authenticate(
            @Valid @RequestBody LoginUserDto dto) {

        User user = authenticationService.authenticate(dto);

        String token = jwtService.generateToken(user);

        return ResponseEntity.ok(
                new LoginResponse(
                        token,
                        jwtService.getExpirationTime()
                )
        );
    }

    private UserResponse toResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getCreatedAt(),
                user.getUpdatedAt()
        );
    }
}
