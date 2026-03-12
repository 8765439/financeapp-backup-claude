package com.financeapp.controller;

import com.financeapp.entity.HomeLoan;
import com.financeapp.entity.User;
import com.financeapp.repository.HomeLoanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/home-loan")
@RequiredArgsConstructor
public class HomeLoanController {

    private final HomeLoanRepository hlRepo;

    @GetMapping
    public ResponseEntity<List<HomeLoan>> getAll(@AuthenticationPrincipal UserDetails ud) {
        return ResponseEntity.ok(hlRepo.findByUserId(uid(ud)));
    }

    @PostMapping
    public ResponseEntity<HomeLoan> create(@AuthenticationPrincipal UserDetails ud,
                                            @RequestBody HomeLoan hl) {
        hl.setUserId(uid(ud));
        return ResponseEntity.ok(hlRepo.save(hl));
    }

    @PutMapping("/{id}")
    public ResponseEntity<HomeLoan> update(@PathVariable Long id,
                                            @RequestBody HomeLoan hl,
                                            @AuthenticationPrincipal UserDetails ud) {
        hl.setId(id);
        hl.setUserId(uid(ud));
        return ResponseEntity.ok(hlRepo.save(hl));
    }

    private Long uid(UserDetails ud) { return ((User) ud).getId(); }
}
