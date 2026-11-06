package com.ce192012.assignment3.dto.customer;

import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public class CustomerProfileUpdateRequest {

    @NotBlank(message = "Full name is required")
    @Size(max = 100, message = "Full name cannot exceed 100 characters")
    private String customerFullName;

    @Size(max = 12, message = "Telephone cannot exceed 12 characters")
    private String telephone;

    @PastOrPresent(message = "Birthday cannot be in the future")
    private LocalDate customerBirthday;

    @Size(min = 6, max = 50, message = "Password must be between 6 and 50 characters")
    private String newPassword;

    public CustomerProfileUpdateRequest() {
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

    public LocalDate getCustomerBirthday() {
        return customerBirthday;
    }

    public void setCustomerBirthday(LocalDate customerBirthday) {
        this.customerBirthday = customerBirthday;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
}

