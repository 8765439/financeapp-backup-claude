package com.financeapp.controller;

import com.financeapp.entity.FixedDeposit;
import com.financeapp.entity.User;
import com.financeapp.repository.FixedDepositRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/fd")
@RequiredArgsConstructor
public class FixedDepositController {

    private final FixedDepositRepository fdRepo;

    @GetMapping
    public ResponseEntity<List<FixedDeposit>> getAll(@AuthenticationPrincipal UserDetails ud) {
        return ResponseEntity.ok(fdRepo.findByUserId(uid(ud)));
    }

    @GetMapping("/active")
    public ResponseEntity<List<FixedDeposit>> getActive(@AuthenticationPrincipal UserDetails ud) {
        return ResponseEntity.ok(fdRepo.findByUserIdAndIsActive(uid(ud), true));
    }

    @GetMapping("/summary")
    public ResponseEntity<?> getSummary(@AuthenticationPrincipal UserDetails ud) {
        Long id    = uid(ud);
        BigDecimal total = fdRepo.sumActivePrincipal(id).orElse(BigDecimal.ZERO);
        List<FixedDeposit> fds = fdRepo.findByUserIdAndIsActive(id, true);
        BigDecimal monthly = fds.stream()
            .map(f -> f.getMonthlyInterest() == null ? BigDecimal.ZERO : f.getMonthlyInterest())
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        return ResponseEntity.ok(Map.of(
            "totalPrincipal",  total,
            "monthlyInterest", monthly,
            "activeFdCount",   fds.size()
        ));
    }

    @PostMapping
    public ResponseEntity<FixedDeposit> create(@AuthenticationPrincipal UserDetails ud,
                                                @RequestBody FixedDeposit fd) {
        fd.setUserId(uid(ud));
        fd.setIsActive(true);
        return ResponseEntity.ok(fdRepo.save(fd));
    }

    @PutMapping("/{id}")
    public ResponseEntity<FixedDeposit> update(@PathVariable Long id,
                                                @RequestBody FixedDeposit fd,
                                                @AuthenticationPrincipal UserDetails ud) {
        fd.setId(id);
        fd.setUserId(uid(ud));
        return ResponseEntity.ok(fdRepo.save(fd));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        fdRepo.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private Long uid(UserDetails ud) { return ((User) ud).getId(); }
}
