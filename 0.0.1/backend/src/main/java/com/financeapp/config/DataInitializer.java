package com.financeapp.config;

import com.financeapp.repository.UserRepository;
import com.financeapp.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements ApplicationRunner {

    private final UserRepository  userRepo;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(ApplicationArguments args) {
        userRepo.findByUsername("lnarayana").ifPresentOrElse(
            user -> {
                String stored = user.getPassword();
                boolean needsRehash = stored == null || !stored.startsWith("$2");
                if (needsRehash) {
                    user.setPassword(passwordEncoder.encode("Finance@123"));
                    userRepo.save(user);
                }
            },
            () -> {
                User user = User.builder()
                    .username("lnarayana")
                    .email("lnarayana@financeapp.local")
                    .password(passwordEncoder.encode("Finance@123"))
                    .role("USER")
                    .build();
                userRepo.save(user);
            }
        );
    }
}
