package com.ce192012.assignment3.dto.customer;

import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public class CustomerUpdateRequest {

    @NotBlank(message = "Full name is required")
    @Size(max = 100, message = "Full name cannot exceed 100 characters")
    private String customerFullName;

    @Size(max = 12, message = "Telephone cannot exceed 12 characters")
    private String telephone;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    @Size(max = 100, message = "Email cannot exceed 100 characters")
    private String emailAddress;

    @PastOrPresent(message = "Birthday cannot be in the future")
    private LocalDate customerBirthday;

    @Min(value = 0, message = "Customer status must be 0 or 1")
    @Max(value = 1, message = "Customer status must be 0 or 1")
    private Byte customerStatus;

    @Size(min = 6, max = 50, message = "Password must be between 6 and 50 characters")
    private String password;

    public CustomerUpdateRequest() {
    }

    public String getCustomerFullName() {
        return customerFullName;
    }

    public void setCustomerFullName(String customerFullName) {
        this.customerFullName = customerFullName;
    }

    public String getTelephone() {
        return telephone;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }

    public String getEmailAddress() {
        return emailAddress;
    }

    public void setEmailAddress(String emailAddress) {
        this.emailAddress = emailAddress;
    }

    public LocalDate getCustomerBirthday() {
        return customerBirthday;
    }

    public void setCustomerBirthday(LocalDate customerBirthday) {
        this.customerBirthday = customerBirthday;
    }

    public Byte getCustomerStatus() {
        return customerStatus;
    }

    public void setCustomerStatus(Byte customerStatus) {
        this.customerStatus = customerStatus;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}

