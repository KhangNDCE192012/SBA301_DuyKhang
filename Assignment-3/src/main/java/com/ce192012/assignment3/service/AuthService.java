package com.ce192012.assignment3.service;

import com.ce192012.assignment3.dto.auth.AuthRequest;
import com.ce192012.assignment3.dto.auth.AuthResponse;
import com.ce192012.assignment3.dto.auth.CustomerRegisterRequest;
import com.ce192012.assignment3.dto.customer.CustomerDto;
import com.ce192012.assignment3.entity.Customer;
import com.ce192012.assignment3.exception.BadRequestException;
import com.ce192012.assignment3.exception.UnauthorizedException;
import com.ce192012.assignment3.repository.CustomerRepository;
import com.ce192012.assignment3.security.JwtTokenProvider;
import com.ce192012.assignment3.security.StaffConfig;
import com.ce192012.assignment3.security.UserPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final CustomerRepository customerRepository;
    private final StaffConfig staffConfig;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public AuthService(CustomerRepository customerRepository,
                       StaffConfig staffConfig,
                       PasswordEncoder passwordEncoder,
                       JwtTokenProvider tokenProvider) {
        this.customerRepository = customerRepository;
        this.staffConfig = staffConfig;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    public AuthResponse loginStaff(AuthRequest request) {
        String configuredEmail = staffConfig.getStaffEmail();
        String configuredPassword = staffConfig.getStaffPassword();

        if (configuredEmail == null || !configuredEmail.equalsIgnoreCase(request.getEmail().trim()) ||
                configuredPassword == null || !configuredPassword.equals(request.getPassword())) {
            throw new UnauthorizedException("Invalid staff credentials");
        }

        UserPrincipal principal = new UserPrincipal(
                configuredEmail,
                configuredPassword,
                "Hotel Staff",
                "ROLE_STAFF",
                null
        );

        String token = tokenProvider.generateToken(principal);
        return new AuthResponse(token, "ROLE_STAFF", configuredEmail, "Hotel Staff", null);
    }

    public AuthResponse loginCustomer(AuthRequest request) {
        Customer customer = customerRepository.findByEmailAddress(request.getEmail().trim())
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), customer.getPassword())) {
            throw new UnauthorizedException("Invalid email or password");
        }

        if (customer.getCustomerStatus() != null && customer.getCustomerStatus() == 0) {
            throw new UnauthorizedException("Your account has been deactivated. Please contact hotel staff.");
        }

        UserPrincipal principal = new UserPrincipal(
                customer.getEmailAddress(),
                customer.getPassword(),
                customer.getCustomerFullName(),
                "ROLE_CUSTOMER",
                customer.getCustomerId()
        );

        String token = tokenProvider.generateToken(principal);
        return new AuthResponse(token, "ROLE_CUSTOMER", customer.getEmailAddress(),
                customer.getCustomerFullName(), customer.getCustomerId());
    }

    @Transactional
    public CustomerDto registerCustomer(CustomerRegisterRequest request) {
        if (customerRepository.existsByEmailAddress(request.getEmailAddress().trim())) {
            throw new BadRequestException("Email address is already registered: " + request.getEmailAddress());
        }

        Customer customer = new Customer();
        customer.setCustomerFullName(request.getCustomerFullName());
        customer.setTelephone(request.getTelephone());
        customer.setEmailAddress(request.getEmailAddress().trim());
        customer.setCustomerBirthday(request.getCustomerBirthday());
        customer.setCustomerStatus((byte) 1); // 1 = Active
        customer.setPassword(passwordEncoder.encode(request.getPassword()));

        Customer saved = customerRepository.save(customer);

        return new CustomerDto(
                saved.getCustomerId(),
                saved.getCustomerFullName(),
                saved.getTelephone(),
                saved.getEmailAddress(),
                saved.getCustomerBirthday(),
                saved.getCustomerStatus()
        );
    }
}

