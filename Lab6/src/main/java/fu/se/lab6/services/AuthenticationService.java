
package fu.se.lab6.services;

import fu.se.lab6.dtos.LoginUserDto;
import fu.se.lab6.dtos.RegisterUserDto;
import fu.se.lab6.entities.User;
import fu.se.lab6.repositories.UserRepository;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Locale;

@Service
public class AuthenticationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    public AuthenticationService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
    }

    public User signup(RegisterUserDto input) {

        String email = input.getEmail()
                .trim()
                .toLowerCase(Locale.ROOT);

        if (userRepository.existsByEmail(email)) {
            throw new IllegalStateException(
                    "Email already exists");
        }

        User user = new User();

        user.setFullName(input.getFullName().trim());
        user.setEmail(email);

        user.setPassword(
                passwordEncoder.encode(
                        input.getPassword()));

        return userRepository.save(user);
    }

    public User authenticate(LoginUserDto input) {

        String email = input.getEmail()
                .trim()
                .toLowerCase(Locale.ROOT);

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        email,
                        input.getPassword()
                )
        );

        return userRepository.findByEmail(email)
                .orElseThrow();
    }
}
