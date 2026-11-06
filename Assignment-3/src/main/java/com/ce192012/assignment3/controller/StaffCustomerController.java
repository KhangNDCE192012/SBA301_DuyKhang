package com.ce192012.assignment3.controller;

import com.ce192012.assignment3.dto.auth.CustomerRegisterRequest;
import com.ce192012.assignment3.dto.common.ApiResponse;
import com.ce192012.assignment3.dto.customer.CustomerDto;
import com.ce192012.assignment3.dto.customer.CustomerUpdateRequest;
import com.ce192012.assignment3.service.CustomerService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/staff/customers")
public class StaffCustomerController {

    private final CustomerService customerService;

    public StaffCustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CustomerDto>>> getAllCustomers(@RequestParam(required = false) String search) {
        List<CustomerDto> customers = customerService.getAllCustomers(search);
        return ResponseEntity.ok(ApiResponse.ok("Customers retrieved successfully", customers));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CustomerDto>> getCustomerById(@PathVariable Integer id) {
        CustomerDto customer = customerService.getCustomerById(id);
        return ResponseEntity.ok(ApiResponse.ok("Customer details retrieved successfully", customer));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CustomerDto>> createCustomer(@Valid @RequestBody CustomerRegisterRequest request) {
        CustomerDto created = customerService.createCustomer(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Customer created successfully", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CustomerDto>> updateCustomer(
            @PathVariable Integer id,
            @Valid @RequestBody CustomerUpdateRequest request) {
        CustomerDto updated = customerService.updateCustomer(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Customer updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCustomer(@PathVariable Integer id) {
        customerService.deleteCustomer(id);
        return ResponseEntity.ok(ApiResponse.ok("Customer deleted or deactivated successfully", null));
    }
}

