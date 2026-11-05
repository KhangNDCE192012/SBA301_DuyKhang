package com.funews.assignment2.security;


import org.springframework.stereotype.Service;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class SessionService {

    private final ConcurrentHashMap<String, Short> sessions =
            new ConcurrentHashMap<>();

    public String createSession(Short accountId) {

        String token = UUID.randomUUID().toString();

        sessions.put(token, accountId);

        return token;
    }

    public Short getAccountId(String token) {
        return sessions.get(token);
    }

    public void removeSession(String token) {
        sessions.remove(token);
    }
}
