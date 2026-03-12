package com.financeapp.controller;

import com.financeapp.entity.User;
import com.financeapp.repository.UserRepository;
import com.financeapp.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authManager;
    private final JwtService            jwtService;
    private final UserRepository        userRepo;
    private final PasswordEncoder       passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> req) {
        try {
            Authentication auth = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.get("username"), req.get("password")));
            User user = (User) auth.getPrincipal();
            String token = jwtService.generateToken(user);
            return ResponseEntity.ok(Map.of(
                "token",    token,
                "username", user.getUsername(),
                "email",    user.getEmail()
            ));
        } catch (AuthenticationException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "Invalid username or password"));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> req) {
        if (userRepo.findByUsername(req.get("username")).isPresent())
            return ResponseEntity.badRequest().body(Map.of("error", "Username already taken"));
        User user = User.builder()
            .username(req.get("username"))
            .email(req.get("email"))
            .password(passwordEncoder.encode(req.get("password")))
            .role("USER")
            .build();
        userRepo.save(user);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(Map.of("message", "User created successfully"));
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(@AuthenticationPrincipal UserDetails userDetails) {
        return userRepo.findByUsername(userDetails.getUsername())
            .<ResponseEntity<?>>map(u -> ResponseEntity.ok(Map.of(
                "id",       u.getId(),
                "username", u.getUsername(),
                "email",    u.getEmail(),
                "role",     u.getRole())))
            .orElse(ResponseEntity.notFound().build());
    }
}
