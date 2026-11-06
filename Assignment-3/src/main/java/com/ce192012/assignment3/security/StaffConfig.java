package com.ce192012.assignment3.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

/**
 * Reads the Staff account from application.properties.
 * The Staff account is not stored in the Customer table.
 */
@Configuration
public class StaffConfig {

    @Value("${hotel.staff.email}")
    private String staffEmail;

    @Value("${hotel.staff.password}")
    private String staffPassword;

    public String getStaffEmail() {
        return staffEmail;
    }

    public String getStaffPassword() {
        return staffPassword;
    }
}
