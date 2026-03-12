package com.financeapp.dto;

import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class AuthResponse {
    private String token;
    private String username;
    private String email;
}
