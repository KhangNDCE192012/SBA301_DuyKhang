package com.funews.assignment2.repository;


import com.funews.assignment2.entity.SystemAccount;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AccountRepository
        extends JpaRepository<SystemAccount, Short> {

    Optional<SystemAccount> findByAccountEmailIgnoreCase(
            String email
    );

    boolean existsByAccountEmailIgnoreCase(String email);

    boolean existsByAccountEmailIgnoreCaseAndAccountIdNot(
            String email, Short id
    );

    Optional<SystemAccount> findTopByOrderByAccountIdDesc();

    List<SystemAccount>
    findByAccountNameContainingIgnoreCaseOrAccountEmailContainingIgnoreCase(
            String name, String email
    );
}
