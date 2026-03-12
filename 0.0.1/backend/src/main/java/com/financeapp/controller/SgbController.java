package com.financeapp.controller;

import com.financeapp.entity.SovereignGoldBond;
import com.financeapp.entity.User;
import com.financeapp.repository.SovereignGoldBondRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/sgb")
@RequiredArgsConstructor
public class SgbController {

    private final SovereignGoldBondRepository sgbRepo;

    @GetMapping
    public ResponseEntity<List<SovereignGoldBond>> getAll(@AuthenticationPrincipal UserDetails ud) {
        return ResponseEntity.ok(sgbRepo.findByUserId(uid(ud)));
    }

    @GetMapping("/summary")
    public ResponseEntity<?> getSummary(@AuthenticationPrincipal UserDetails ud) {
        Long id = uid(ud);
        return ResponseEntity.ok(Map.of(
            "totalGrams",    sgbRepo.sumGrams(id).orElse(BigDecimal.ZERO),
            "totalInvested", sgbRepo.sumInvested(id).orElse(BigDecimal.ZERO),
            "count",         sgbRepo.findByUserId(id).size()
        ));
    }

    @PostMapping
    public ResponseEntity<SovereignGoldBond> create(@AuthenticationPrincipal UserDetails ud,
                                                     @RequestBody SovereignGoldBond sgb) {
        sgb.setUserId(uid(ud));
        return ResponseEntity.ok(sgbRepo.save(sgb));
    }

    @PatchMapping("/{id}/price")
    public ResponseEntity<SovereignGoldBond> updatePrice(@PathVariable Long id,
                                                          @RequestBody Map<String, BigDecimal> body) {
        return sgbRepo.findById(id).map(s -> {
            s.setCurrentPrice(body.get("currentPrice"));
            return ResponseEntity.ok(sgbRepo.save(s));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        sgbRepo.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private Long uid(UserDetails ud) { return ((User) ud).getId(); }
}
